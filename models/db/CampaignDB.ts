import { CampaignParticipantsDB } from "./CampaingParticipantsDB.js";

export interface CampaignDB {
  id: string;
  title: string;
  description: string;
  image_url: string;
  budget: number;
  budget_remaining: number;
  paid: number;
  reward: number;
  type_id: number;
  socialmedia_id: number[];
  requirements: string | null;
  category_id: number;
  files: string[] | null;
  status_id: number;
  creation_date: string;
  start_date: string;
  end_date: string;
  author: {
    id: string;
    name: string;
    avatar_url: string;
  };
  content_type_name: { name: string };
  content_category_name: { name: string };
  max_payment: number;
  participants: CampaignParticipantsDB[];
  payment_status?: number;
}
