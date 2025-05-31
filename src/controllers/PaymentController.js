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
        await Order.query().patchAndFetchById(orderId, { status: "PAID" });

        res.redirect(
          `${process.env.APP_URL}/betaling/bedankt?paymentId=${paymentId}&userId=${userId}`
        );
        break;
      case "open":
        res.redirect(
          `${process.env.APP_URL}/betaling/wacht?paymentId=${paymentId}&userId=${userId}`
        );
        break;
      case "expired":
      case "canceled":
      case "failed":
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
