import supabase from '../db/db.js'
import { ParticipationDB } from '../models/db/ParticipationDB.js'
export async function findAll() {
   const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      author:profiles (
        id,
        name,
        avatar_url
      ),
      content_type_name:content_type(name),
      content_category_name:content_category(name)
    `)

  if (error) {
    console.error('Repository Error:', error)
    throw error
  }
  return data
}

export async function findById(id: string) {
   const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      author:profiles (
        id,
        name,
        avatar_url
      ),
      content_type_name:content_type(name),
      content_category_name:content_category(name)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Repository Error:', error)
    throw error
  }
  return data
}

export async function insertParticipation(data: {
  campaign_id: string
  user_id: string
  post_link: string
}): Promise<ParticipationDB> {
  const { data: inserted, error } = await supabase
    .from('campaign_participants')
    .insert([{
      campaign_id: data.campaign_id,
      profile_id:     data.user_id,
      post_link:   data.post_link,
    }])
    .single()

  if (error) {
    console.error('Participation Repository Error:', error)
    throw error
  }
  return inserted
}
