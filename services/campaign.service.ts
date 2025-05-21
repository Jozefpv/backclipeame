import { Campaign } from '../models/Campaign.js'
import { CampaignDB } from '../models/db/CampaignDB.js'
import * as campaignRepo from '../repositories/campaign.repository.js'
import { Participation } from '../models/Participation.js'
import { ParticipationDB } from '../models/db/ParticipationDB.js'
import { ParticipationResult } from '../enums/participation-result.enum.js'

export async function fetchAllCampaigns(): Promise<Campaign[]> {
  const rows: CampaignDB[] = await campaignRepo.findAll() ?? []

  return rows.map(r => ({
    id:           r.id,
    title:        r.title,
    description:  r.description,
    imageUrl:     r.image_url,
    budget:       Number(r.budget),
    paid:         Number(r.paid),
    reward:       r.reward,
    type:         r.content_type_name.name,
    socialMedia:  r.socialmedia,
    requirements: r.requirements ? JSON.parse(r.requirements) : [],
    category:     r.content_category_name.name,
    files:        r.files ?? [],
    status:       r.status,
    creationDate: new Date(r.creation_date),
    startDate:    new Date(r.start_date),
    endDate:      new Date(r.end_date),
    authorId:     r.author.id,
    authorName:   r.author.name,
    authorAvatar: r.author.avatar_url,
    maxPayment:   r.max_payment
  }))
}

export async function fetchCampaignById(id: string): Promise<Campaign | null> {
  const row = await campaignRepo.findById(id)
  return {
    id:           row.id,
    title:        row.title,
    description:  row.description,
    imageUrl:     row.image_url,
    budget:       Number(row.budget),
    paid:         Number(row.paid),
    reward:       row.reward,
    type:         row.content_type_name.name,
    socialMedia:  row.socialmedia,
    requirements: row.requirements ? JSON.parse(row.requirements) : [],
    category:     row.content_category_name.name,
    files:        row.files ?? [],
    status:       row.status,
    creationDate: new Date(row.creation_date),
    startDate:    new Date(row.start_date),
    endDate:      new Date(row.end_date),
    authorId:     row.author.id,
    authorName:   row.author.name,
    authorAvatar: row.author.avatar_url,
    maxPayment:   row.max_payment

  }
}

export async function participateInCampaign(params: {
  campaignId: string
  userId: string
  postLink: string
}): Promise<ParticipationResult> {
  try {
    await campaignRepo.insertParticipation({
      campaign_id: params.campaignId,
      user_id:     params.userId,
      post_link:   params.postLink,
    })
    return ParticipationResult.CREATED

  } catch (err) {
    if (err === '23505') {
      return ParticipationResult.ALREADY_PARTICIPATED
    }
    return ParticipationResult.ERROR
  }
}