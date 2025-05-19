import { Router } from 'express'
//import { requireAuth } from '../../middleware/requireAuth.js'
import { getCampaigns, getCampaignsById } from '../../controllers/campaign.controller.js'
import { requireAuth, requireUserAuth } from '../../middleware/requireAuth.js'
import { participateCampaign } from '../../controllers/campaign.controller.js'

const router = Router()

router.get('/campaigns', requireAuth ,getCampaigns)

router.get('/campaigns/:id', requireAuth, getCampaignsById)

router.post('/participate', requireUserAuth, participateCampaign)

export default router