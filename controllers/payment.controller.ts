import Stripe from "stripe";
import { stripe } from "../stripe/stripe.js";

export const createSession = async (req: any, res: any) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: 1000,
            product_data: {
              name: "Campaña #1",
              description: "Descripción de la campaña…",
              metadata: {
                campaign_id: "1",
              },
            },
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/dashboard?status=success",
      cancel_url: "http://localhost:5173/dashboard?status=cancel",
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500);
  }
};
