import supabase from "../db/db.js";
import { ApifyClient } from "apify-client";
import dotenv from "dotenv";
dotenv.config();

function normalizeUrl(raw: any) {
  try {
    const u = new URL(raw);
    return (u.origin + u.pathname).replace(/\/$/, "");
  } catch {
    return raw;
  }
}

async function actualizarViews(postURLs: string[]) {
  const client = new ApifyClient({
    token: process.env.APIFY_TOKEN,
  });

  const run = await client.actor("clockworks/tiktok-video-scraper").call({
    postURLs,
    shouldDownloadCovers: false,
    shouldDownloadSlideshowImages: false,
    shouldDownloadSubtitles: false,
    shouldDownloadVideos: false,
  });

  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  return items.map((item) => ({
    url: item.webVideoUrl,
    views: item.playCount,
  }));
}

export async function scrapAndSaveTikTokData(campaignId: string) {
  const { data, error } = await supabase
    .from("campaign_participants")
    .select("id, post_link")
    .eq("campaign_id", campaignId);

  if (data?.length === 0) return false;
  const urls = data?.map((d) => d.post_link);

  if (error) {
    console.error("Repository Error:", error);
    throw error;
  }

  const resultados = await actualizarViews(urls ?? []);

  for (const { url, views } of resultados) {
    const cleanUrl = normalizeUrl(url);
    const row = data.find((d) => normalizeUrl(d.post_link) == cleanUrl);

    if (!row) continue;

    const { error: updateError } = await supabase
      .from("campaign_participants")
      .update({ views })
      .eq("id", row.id);

    if (updateError) {
      console.error(
        `Error al actualizar views para id=${row.id}:`,
        updateError
      );
      throw updateError;
    }
  }

  return true;
}
