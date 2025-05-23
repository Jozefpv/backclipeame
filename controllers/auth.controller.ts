import { Profile } from '../models/Profile.js'
import * as authService from '../services/auth.service.js'


export async function getProfileById(req: any, res: any ) {
  try {
    const { id } = req.params
    const profile: Profile = await authService.fetchProfile(id)
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' })
    }
    return res.json({ profile })
  } catch (err: any) {
    console.error('Controller Error:', err)
    return res.status(500).json({ error: err.message })
  }
}