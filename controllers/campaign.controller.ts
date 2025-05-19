import { Campaign } from '../models/Campaign.js'
import * as campaignService from '../services/campaign.service.js'

export async function getCampaigns(req: any, res: any ) {
  try {
    const campaigns: Campaign[] = await campaignService.fetchAllCampaigns()
    res.json({ campaigns })
  } catch (err: any) {
    console.error('Controller Error:', err)
    return res.status(500).json({ error: err.message })
  }
}

export async function getCampaignsById(req: any, res: any ) {
  try {
    const { id } = req.params
    const campaign: Campaign | null = await campaignService.fetchCampaignById(id)
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' })
    }
    return res.json({ campaign })
  } catch (err: any) {
    console.error('Controller Error:', err)
    return res.status(500).json({ error: err.message })
  }
}

export async function participateCampaign(req: any, res: any ) {
  try {
    const { campaignId, postLink } = req.body
    const userId  = req.user.id.toString()
    const participation = await campaignService.participateInCampaign({
      campaignId,
      userId,
      postLink
    })

    return res.status(201).json({ participation })
  } catch (err: any) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}
