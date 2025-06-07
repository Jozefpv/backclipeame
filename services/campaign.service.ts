import { Campaign } from "../models/Campaign.js";
import { CampaignDB } from "../models/db/CampaignDB.js";
import * as campaignRepo from "../repositories/campaign.repository.js";
import { ParticipationResult } from "../enums/participation-result.enum.js";

export async function fetchAllCampaigns(): Promise<Campaign[]> {
  const rows: CampaignDB[] = (await campaignRepo.findAll()) ?? [];

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    imageUrl: r.image_url,
    budget: Number(r.budget),
    budgetRemaining: Number(r.budget_remaining),
    paid: Number(r.paid),
    reward: r.reward,
    typeId: r.type_id,
    socialMediaId: r.socialmedia_id,
    requirements: r.requirements ? JSON.parse(r.requirements) : [],
    categoryId: r.category_id,
    files: r.files ?? [],
    status: r.status_id,
    creationDate: new Date(r.creation_date),
    startDate: new Date(r.start_date),
    endDate: new Date(r.end_date),
    authorId: r.author.id,
    authorName: r.author.name,
    authorAvatar: r.author.avatar_url,
    maxPayment: r.max_payment,
    participants: (r.participants ?? []).map((p) => ({
      postLink: p.post_link,
      views: p.views,
    })),
  }));
}

export async function fetchCampaignById(
  campaignid: string
): Promise<Campaign | null> {
  const row: CampaignDB = await campaignRepo.findCampaignById(campaignid);
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    budget: Number(row.budget),
    budgetRemaining: Number(row.budget_remaining),
    paid: Number(row.paid),
    reward: row.reward,
    typeId: row.type_id,
    socialMediaId: row.socialmedia_id,
    requirements: row.requirements ? JSON.parse(row.requirements) : [],
    categoryId: row.category_id,
    files: row.files ?? [],
    status: row.status_id,
    creationDate: new Date(row.creation_date),
    startDate: new Date(row.start_date),
    endDate: new Date(row.end_date),
    authorId: row.author.id,
    authorName: row.author.name,
    authorAvatar: row.author.avatar_url,
    maxPayment: row.max_payment,
    participants: (row.participants ?? []).map((p) => ({
      postLink: p.post_link,
      views: p.views,
    })),
  };
}

export async function fetchMyCampaignById(
  profileId: string
): Promise<Campaign[]> {
  const rows: CampaignDB[] =
    (await campaignRepo.findMyCampaignById(profileId)) ?? [];

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    imageUrl: r.image_url,
    budget: Number(r.budget),
    budgetRemaining: Number(r.budget_remaining),
    paid: Number(r.paid),
    reward: r.reward,
    typeId: r.type_id,
    socialMediaId: r.socialmedia_id,
    requirements: r.requirements ? JSON.parse(r.requirements) : [],
    categoryId: r.category_id,
    files: r.files ?? [],
    status: r.status_id,
    creationDate: new Date(r.creation_date),
    startDate: new Date(r.start_date),
    endDate: new Date(r.end_date),
    authorId: r.author.id,
    authorName: r.author.name,
    authorAvatar: r.author.avatar_url,
    maxPayment: r.max_payment,
    participants: (r.participants ?? []).map((p) => ({
      postLink: p.post_link,
      views: p.views,
    })),
  }));
}

export async function participateInCampaign(params: {
  campaignId: string;
  userId: string;
  postLink: string;
}): Promise<ParticipationResult> {
  try {
    await campaignRepo.insertParticipation({
      campaign_id: params.campaignId,
      user_id: params.userId,
      post_link: params.postLink,
    });
    return ParticipationResult.CREATED;
  } catch (err) {
    if (err === "23505") {
      return ParticipationResult.ALREADY_PARTICIPATED;
    }
    return ParticipationResult.ERROR;
  }
}

export async function createCampaign(input: any): Promise<Campaign> {
  return await campaignRepo.addCampaign(input);
}
