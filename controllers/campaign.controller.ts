import { ParticipationResult } from "../enums/participation-result.enum.js";
import { Campaign } from "../models/Campaign.js";
import * as campaignService from "../services/campaign.service.js";
import { stripe } from "../stripe/stripe.js";

export async function getCampaigns(req: any, res: any) {
  try {
    const campaigns: Campaign[] = await campaignService.fetchAllCampaigns();
    res.json({ campaigns });
  } catch (err: any) {
    console.error("Controller Error:", err);
    return res.status(500).json({ error: err.message });
  }
}

export async function getCampaignsById(req: any, res: any) {
  try {
    const { id } = req.params;
    const campaign: Campaign | null =
      await campaignService.fetchCampaignById(id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    return res.json({ campaign });
  } catch (err: any) {
    console.error("Controller Error:", err);
    return res.status(500).json({ error: err.message });
  }
}

export async function getMyCampaignsById(req: any, res: any) {
  try {
    const { id } = req.params;
    const campaigns: Campaign[] = await campaignService.fetchMyCampaignById(id);
    if (!campaigns) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    return res.json({ campaigns });
  } catch (err: any) {
    console.error("Controller Error:", err);
    return res.status(500).json({ error: err.message });
  }
}

export async function participateCampaign(req: any, res: any) {
  try {
    const { campaignId, postLink } = req.body;
    const userId = req.user.id.toString();
    const result = await campaignService.participateInCampaign({
      campaignId,
      userId,
      postLink,
    });

    switch (result) {
      case ParticipationResult.CREATED:
        return res.status(201).json({
          status: result,
          message: "Participación registrada correctamente.",
        });

      case ParticipationResult.ALREADY_PARTICIPATED:
        return res.status(409).json({
          status: result,
          message: "Ya has participado en esta campaña.",
        });

      case ParticipationResult.ERROR:
      default:
        return res.status(500).json({
          status: result,
          message: "Ocurrió un error interno. Intenta de nuevo.",
        });
    }
  } catch (err: any) {
    return res
      .status(500)
      .json({ status: "ERROR", message: "Error inesperado." });
  }
}

export async function addCampaign(req: any, res: any) {
  try {
    const {
      title,
      description,
      budget,
      reward,
      typeId,
      socialMediaId,
      startDate,
      endDate,
      paid,
      requirements,
      categoryId,
      files,
      status,
      creationDate,
    } = req.body;

    const profileId = req.user.id;

    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ error: "Falta la imagen de la campaña" });
    }
    const newCampaign = await campaignService.createCampaign({
      title,
      description,
      budget: Number(budget),
      reward: Number(reward),
      typeId,
      socialMediaId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      paid: Number(paid),
      requirements: JSON.parse(requirements),
      categoryId,
      files: JSON.parse(files),
      status: Number(status),
      creationDate: new Date(creationDate),
      authorId: profileId,
      imageFile,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(Number(budget) * 100),
            product_data: {
              name: title,
              description,
              metadata: { campaign_id: newCampaign.id },
            },
          },
          quantity: 1,
        },
      ],
      metadata: { campaign_id: newCampaign.id },
      success_url: `${process.env.FRONTEND_URL}/clipeame`,
      cancel_url: `${process.env.FRONTEND_URL}/clipeame/error`,
    });

    return res.status(201).json({
      campaign: newCampaign,
      checkoutUrl: session.url,
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: "Error interno al crear campaña", details: err.message });
  }
}

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
