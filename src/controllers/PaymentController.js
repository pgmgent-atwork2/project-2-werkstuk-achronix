import createMollieClient from "@mollie/api-client";
import dotenv from "dotenv";
dotenv.config();

export const createPayment = async (req, res) => {
  const { amount, orderId } = req.body;

  const mollieClient = createMollieClient({
    apiKey: process.env.MOLLIE_API_KEY,
  });

  try {

    const payment = await mollieClient.payments.create({
      amount: {
        currency: "EUR",
        value: amount.toFixed(2),
      },
      description: `Bestelling #${orderId}`,
      redirectUrl: `/betaling/gelukt`,
      cancelUrl: `/betaling/mislukt`,
      method: "ideal",
    });

    res.status(200).json({ paymentUrl: payment.getPaymentUrl() });
  } catch (error) {
    console.error("Error creating payment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
