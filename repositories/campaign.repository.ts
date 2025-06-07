import supabase from "../db/db.js";
import { ParticipationDB } from "../models/db/ParticipationDB.js";
export async function findAll() {
  const { data, error } = await supabase
    .from("campaigns")
    .select(
      `
      *,
      author:profiles (
        id,
        name,
        avatar_url
      ),
      participants:campaign_participants (
        post_link,
        views
      )
    `
    )
    .order("views", {
      referencedTable: "campaign_participants",
      ascending: false,
    })
    .limit(5, { referencedTable: "campaign_participants" });

  if (error) {
    console.error("Repository Error:", error);
    throw error;
  }
  return data;
}

export async function findCampaignById(campaignid: string) {
  const { data, error } = await supabase
    .from("campaigns")
    .select(
      `
      *,
      author:profiles (
        id,
        name,
        avatar_url
      ),
      participants:campaign_participants (
        post_link,
        views
      )
    `
    )
    .eq("id", campaignid)
    .order("views", {
      referencedTable: "campaign_participants",
      ascending: false,
    })
    .limit(5, { referencedTable: "campaign_participants" })
    .single();

  if (error) {
    console.error("Repository Error:", error);
    throw error;
  }
  return data;
}

export async function findMyCampaignIds(profileId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("campaign_participants")
    .select("campaign_id")
    .eq("profile_id", profileId);

  if (error) throw error;

  return data.map((row) => row.campaign_id);
}

export async function findMyCampaignById(profileId: string) {
  const ids = await findMyCampaignIds(profileId);
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from("campaigns")
    .select(
      `
      *,
      author:profiles (
        id,
        name,
        avatar_url
      ),
      participants:campaign_participants (
        post_link,
        views
      )
    `
    )
    .in("id", ids);

  if (error) throw error;
  return data;
}

export async function insertParticipation(data: {
  campaign_id: string;
  user_id: string;
  post_link: string;
}): Promise<ParticipationDB> {
  const { data: inserted, error } = await supabase
    .from("campaign_participants")
    .insert([
      {
        campaign_id: data.campaign_id,
        profile_id: data.user_id,
        post_link: data.post_link,
      },
    ])
    .single();

  if (error) {
    throw error.code;
  }

  return inserted!;
}

export async function addCampaign(data: any) {
  const {
    imageFile,
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
    authorId,
  } = data;

  const fileExt = imageFile.originalname.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `campaigns/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("campaign-images")
    .upload(filePath, imageFile.buffer, {
      contentType: imageFile.mimetype,
    });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("campaign-images").getPublicUrl(filePath);

  const { data: created, error: insertError } = await supabase
    .from("campaigns")
    .insert([
      {
        title,
        description,
        image_url: publicUrl,
        budget,
        reward,
        type_id: typeId,
        socialmedia_id: socialMediaId,
        start_date: startDate,
        end_date: endDate,
        paid,
        requirements,
        category_id: categoryId,
        files,
        status_id: status,
        creation_date: creationDate,
        author_id: authorId,
      },
    ])
    .single();

  if (insertError) {
    console.error("DB insert error:", insertError);
    throw insertError;
  }

  return created;
}
