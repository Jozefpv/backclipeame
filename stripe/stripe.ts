// src/stripe.ts
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY no definida en .env");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {});
