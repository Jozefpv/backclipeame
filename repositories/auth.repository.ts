import supabase from "../db/db.js";
import { v4 as uuidv4 } from "uuid";
import { Profile } from "../models/Profile.js";

export async function getProfile(id: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      *,
      campaigns:campaign_participants(campaign_id)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Repository Error:", error);
    throw error;
  }
  return data;
}

export async function uploadAvatar(
  userId: string,
  buffer: Buffer,
  mimeType: string
) {
  // const { data: existing, error: listErr } = await supabase
  // .storage
  // .from('avatars')
  // .list(userId, { limit: 100, offset: 0, sortBy: { column: 'name', order: 'asc' } })

  // if (listErr) throw listErr

  // if (existing && existing.length > 0) {
  //   const pathsToRemove = existing.map(f => `${userId}/${f.name}`)
  //   const { error: removeErr } = await supabase
  //     .storage
  //     .from('avatars')
  //     .remove(pathsToRemove)
  //   if (removeErr) console.warn('No pude borrar antiguos:', removeErr)
  // }

  const ext = mimeType.split("/")[1];
  const fileName = `${uuidv4()}.${ext}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadErr } = await supabase.storage
    .from("avatars")
    .upload(filePath, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (uploadErr) throw uploadErr;

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  return publicUrl;
}

export async function updateUserAvatarUrl(userId: string, avatarUrl: string) {
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", userId);

  if (error) throw error;
  return true;
}

export async function updateConfigProfile(
  userId: string,
  form: Partial<Profile>
) {
  const { error } = await supabase
    .from("profiles")
    .update({
      name: form.profileName,
      username: form.profileUsername,
      phone: form.phone,
    })
    .eq("id", userId);

  if (error) throw error;
  return true;
}
