import express from "express";
import stripe from "../config/stripe.js";

dotenv.config();

const router = express.Router();

router.post("/create-payment-intent", async (req, res) => {});
