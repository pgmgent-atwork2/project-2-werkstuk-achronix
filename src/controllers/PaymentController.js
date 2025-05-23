import { createMollieClient } from "@mollie/api-client";
import dotenv from "dotenv";
dotenv.config();

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY,
});

export const createPayment = async (req, res) => {
  const { amount, orderId } = req.body;

  try {
    const payment = await mollieClient.payments.create({
      amount: {
        currency: "EUR",
        value: amount,
      },
      description: `Bestelling #${orderId}`,
      redirectUrl: `${process.env.APP_URL}/betaling`,
      method: "ideal",
    });

    const redirectUrl = `${process.env.APP_URL}/betaling/result?paymentId=${payment.id}`;

    await mollieClient.payments.update(payment.id, {
      redirectUrl,
    });

    res.redirect(payment.getCheckoutUrl());
  } catch (error) {
    console.error("Error creating payment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const paymentResult = async (req, res) => {
  const { paymentId } = req.query;

  try {
    const payment = await mollieClient.payments.get(paymentId);

    switch (payment.status) {
      case "paid":
        res.redirect(
          `${process.env.APP_URL}/betaling/bedankt?paymentId=${paymentId}`
        );
        break;
      case "open":
        res.redirect(
          `${process.env.APP_URL}/betaling/wacht?paymentId=${paymentId}`
        );
        break;
      case "expired":
      case "canceled":
      case "failed":
        res.redirect(
          `${process.env.APP_URL}/betaling/fout?paymentId=${paymentId}`
        );
        break;
    }
  } catch (error) {
    res.redirect(
      res.send
    )
  }
};
