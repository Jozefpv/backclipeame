import * as scrapRepo from "../repositories/scrap.repository.js";

export async function scrapTiktok(campaignId: string): Promise<boolean> {
  const updated = (await scrapRepo.scrapAndSaveTikTokData(campaignId)) ?? false;

  return updated;
}
