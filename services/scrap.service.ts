import * as scrapRepo from '../repositories/scrap.repository.js'


export async function scrapTiktok(): Promise<boolean> {
  const test = await scrapRepo.scrapAndSaveTikTokData() ?? false

  return !!test
}