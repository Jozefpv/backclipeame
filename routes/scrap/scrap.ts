import { Router } from "express";
import { scrapTiktok } from "../../controllers/scrap.controller.js";

const router = Router();

router.post("/tiktok", scrapTiktok);

export default router;
