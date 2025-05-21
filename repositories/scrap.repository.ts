import supabase from '../db/db.js'
import { ApifyClient } from 'apify-client';
import dotenv from 'dotenv';
dotenv.config();

async function actualizarViews(postURLs: string[]) {
    const client = new ApifyClient({ token: 'apify_api_0NcLQNuGPOu1PgPvk19JHIAgOjq4NR1zWglF' });

    // Lanza el actor con todos los URLs de una pasada
    const run = await client
        .actor('clockworks/tiktok-video-scraper')
        .call({
            postURLs,
            shouldDownloadCovers: false,
            shouldDownloadSlideshowImages: false,
            shouldDownloadSubtitles: false,
            shouldDownloadVideos: false,
        });

    const { items } = await client
        .dataset(run.defaultDatasetId)
        .listItems();

    return items.map(item => ({
        url: item.webVideoUrl,
        views: item.playCount,
    }));
}
export async function scrapAndSaveTikTokData() {
   const { data, error } = await supabase
    .from('campaign_participants')
    .select('post_link')
    const urls = data?.map(d => d.post_link)
    console.log(urls)
  if (error) {
    console.error('Repository Error:', error)
    throw error
  }
    const resultados = await actualizarViews(urls ?? []);
    console.log('Datos para guardar:', resultados);



  return data
}