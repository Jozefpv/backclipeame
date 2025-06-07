import { CampaignParticipants } from "./CampaignParticipants.js";

export interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  budget: number;
  budgetRemaining: number;
  paid: number;
  reward: number;
  typeId: number;
  socialMediaId: number[];
  requirements?: string[];
  categoryId: number;
  files?: string[];
  status: number;
  creationDate: Date;
  startDate: Date;
  endDate: Date;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  maxPayment: number;
  participants: CampaignParticipants[];
}

export enum SocialMedia {
  TikTok = "tiktok",
  YouTube = "youtube",
  Instagram = "instagram",
}
