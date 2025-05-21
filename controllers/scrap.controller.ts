import * as scrapService from '../services/scrap.service.js'

export async function scrapTiktok(req: any, res: any ) {
  try {
    const test = await scrapService.scrapTiktok()
    res.json({ status: test })
  } catch (err: any) {
    console.error('Controller Error:', err)
    return res.status(500).json({ error: err.message })
  }
}