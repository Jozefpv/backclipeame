import { ProfileDB } from "../models/db/ProfileDB.js";
import { Profile } from "../models/Profile.js";
import * as authRepo from "../repositories/auth.repository.js";

export async function fetchProfile(id: string): Promise<Profile> {
  const row: ProfileDB = await authRepo.getProfile(id);
  return {
    id: row.id,
    profileName: row.name,
    profileUsername: row.username,
    email: row.email,
    avatarUrl: row.avatar_url,
    createdAt: new Date(row.created_at),
    phone: row.phone,
    campaings: row.campaings,
    rol: row.rol,
  };
}

export async function changeAvatar(
  userId: string,
  fileBuffer: Buffer,
  mimeType: string
) {
  const publicUrl = await authRepo.uploadAvatar(userId, fileBuffer, mimeType);

  await authRepo.updateUserAvatarUrl(userId, publicUrl);

  return publicUrl;
}

export async function updateConfigProfile(
  userId: string,
  form: Partial<Profile>
): Promise<boolean> {
  const res = await authRepo.updateConfigProfile(userId, form);
  return res;
}
