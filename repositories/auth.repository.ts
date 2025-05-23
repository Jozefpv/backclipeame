import supabase from '../db/db.js'

export async function getProfile(id: string) {
   const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      campaigns:campaign_participants(campaign_id)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error('Repository Error:', error)
    throw error
  }
  return data
}