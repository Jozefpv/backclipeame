import { Router } from 'express'
import { requireUserAuth } from '../../middleware/requireAuth.js'
const router = Router()

router.get('/check-auth', requireUserAuth, (req: any, res: any) => {
  res.json({ authenticated: true, user: req.user })
})

export default router
