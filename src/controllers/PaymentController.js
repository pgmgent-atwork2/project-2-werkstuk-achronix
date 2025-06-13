import { createMollieClient } from "@mollie/api-client";
import dotenv from "dotenv";

import { sendMail } from "../utils/mailer.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

dotenv.config();

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY,
});

export const createPayment = async (req, res) => {
  const { amount, orderId, userId } = req.body;

  try {
    const payment = await mollieClient.payments.create({
      amount: {
        currency: "EUR",
        value: amount,
      },
      description: `Bestelling #${orderId}`,
      redirectUrl: `${process.env.APP_URL}/betaling`,
      method: "bancontact",
    });

    const redirectUrl = `${process.env.APP_URL}/betaling/result?paymentId=${payment.id}&orderId=${orderId}&userId=${userId}`;

    await mollieClient.payments.update(payment.id, {
      redirectUrl,
    });

    const IsFetch =
      req.headers.accept?.includes("application/json") ||
      req.headers["x-requested-with"] === "XMLHttpRequest";

    if (IsFetch) {
      return res.json({ paymentUrl: payment.getCheckoutUrl() });
    }

    res.redirect(payment.getCheckoutUrl());
  } catch (error) {
    console.error("Error creating payment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const paymentResult = async (req, res) => {
  const { paymentId, orderId, userId } = req.query;

  try {
    const order = await Order.query()
      .findById(orderId)
      .withGraphFetched("orderItems.consumable");

    const user = await User.query().findById(userId);

    const payment = await mollieClient.payments.get(paymentId);

    switch (payment.status) {
      case "paid":
        await sendConfirmationEmail(user.email, order);
        await Order.query().patchAndFetchById(orderId, {
          status: "PAID",
          method: "ONLINE",
        });

        res.redirect(
          `${process.env.APP_URL}/betaling/bedankt?paymentId=${paymentId}&userId=${userId}`
        );
        break;
      case "expired":
      case "canceled":
      case "failed":
      case "open":
        res.redirect(
          `${process.env.APP_URL}/betaling/mislukt?paymentId=${paymentId}&userId=${userId}`
        );
        break;
    }
  } catch (error) {
    console.error("Error processing payment result:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const processCashPayment = async (req, res) => {

  const { userId, orderId, cashDetails } = req.body;

  try {
    if (!userId || !orderId || !cashDetails) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: userId, orderId, cashDetails",
      });
    }

    const order = await Order.query()
      .findById(orderId)
      .withGraphFetched("orderItems.consumable");

    const user = await User.query().findById(userId);

    if (!order || !user) {
      console.error("Order or user not found:", { orderId, userId });
      return res.status(404).json({
        success: false,
        error: "Order or user not found",
      });
    }

    let paymentDetails;
    try {
      paymentDetails =
        typeof cashDetails === "string" ? JSON.parse(cashDetails) : cashDetails;
    } catch (parseError) {
      console.error("Failed to parse cashDetails:", parseError);
      return res.status(400).json({
        success: false,
        error: "Invalid cashDetails format",
      });
    }

    if (!paymentDetails.cashGiven || !paymentDetails.orderAmount) {
      return res.status(400).json({
        success: false,
        error: "Invalid payment details: missing cashGiven or orderAmount",
      });
    }
    await Order.query().patchAndFetchById(orderId, {
      status: "PAID",
      method: "CASH",
    });

    if (user.email) {
      try {
        await sendConfirmationEmail(user.email, order);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
    }


    return res.status(200).json({
      success: true,
      message: "Cash payment processed successfully",
      data: {
        orderId: orderId,
        amount: paymentDetails.orderAmount,
        change: paymentDetails.change || 0,
        method: "CASH",
        cashDetails: paymentDetails, 
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to process cash payment",
      details: error.message,
    });
  }
};

async function sendConfirmationEmail(email, order) {
  try {
    await sendMail(
      email,
      "Bestelling Bevestiging | Ping Pong Tool",
      "orderConfirmation.ejs",
      order
    );
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
}
