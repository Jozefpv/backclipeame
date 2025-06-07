import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth/auth.js";
import apiRouter from "./routes/api/api.js";
import dashboardRotuer from "./routes/dashboard/dashboard.js";
import scrapRouter from "./routes/scrap/scrap.js";
import supabase from "./db/db.js";
import { stripe } from "./stripe/stripe.js";
import Stripe from "stripe";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://jozefpv.github.io",
    credentials: true,
  })
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

app.post("api/stripe/webhook", async (req: any, res: any) => {
  const signature = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err: any) {
    return res.sendStatus(400);
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const campaignId = session.metadata?.campaign_id;
  if (!campaignId) {
    return res.sendStatus(400);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await supabase
          .from("campaigns")
          .update({ payment_status: 1 })
          .eq("id", campaignId);
        break;

      case "checkout.session.async_payment_failed":
      case "payment_intent.payment_failed":
      case "checkout.session.expired":
        await supabase.from("campaigns").delete().eq("id", campaignId);
        break;
      default:
    }
  } catch (dbErr) {
    return res.sendStatus(500);
  }

  res.sendStatus(200);
});

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/api", apiRouter);
app.use("/dashboard", dashboardRotuer);
app.use("/scrap", scrapRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API escuchando en puerto ${PORT}`);
});
