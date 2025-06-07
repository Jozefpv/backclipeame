import Stripe from "stripe";
import supabase from "../../db/db.js";
import { Router } from "express";
import { requireUserAuth } from "../../middleware/requireAuth.js";
import { stripe } from "../../stripe/stripe.js";
const router = Router();

router.get("/check-auth", requireUserAuth, (req: any, res: any) => {
  res.json({ authenticated: true, user: req.user });
});

router.get("/refresh", (req: any, res: any) => {
  res.status(200).json({ message: "done" });
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

router.post("/stripe/webhook", async (req: any, res: any) => {
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

export default router;
