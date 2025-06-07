import * as scrapService from "../services/scrap.service.js";

export async function scrapTiktok(req: any, res: any) {
  try {
    const { campaignId } = req.body;
    const updated = await scrapService.scrapTiktok(campaignId);
    res.json({ status: updated });
  } catch (err: any) {
    console.error("Controller Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
