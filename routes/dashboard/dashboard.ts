import { Router } from "express";
//import { requireAuth } from '../../middleware/requireAuth.js'
import {
  addCampaign,
  getCampaigns,
  getCampaignsById,
  getMyCampaignsById,
} from "../../controllers/campaign.controller.js";
import { requireAuth, requireUserAuth } from "../../middleware/requireAuth.js";
import { participateCampaign } from "../../controllers/campaign.controller.js";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/campaigns", requireAuth, getCampaigns);

router.get("/campaigns/:id", requireAuth, getCampaignsById);

router.get("/mycampaigns/:id", requireUserAuth, getMyCampaignsById);

router.post("/add", requireUserAuth, upload.single("image"), addCampaign);

router.post("/participate", requireUserAuth, participateCampaign);

export default router;
