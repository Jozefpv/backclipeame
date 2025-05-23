import { ProfileDB } from "../models/db/ProfileDB.js"
import { Profile } from "../models/Profile.js"
import * as authRepo from '../repositories/auth.repository.js'

export async function fetchProfile(id: string): Promise<Profile> {
  const row: ProfileDB = await authRepo.getProfile(id)
  return {
    id:           row.id,
    profileName:  row.name,
    email:        row.email,
    avatarUrl:    row.avatar_url,
    createdAt:    new Date(row.created_at),
    campaings:    row.campaings
 }
}