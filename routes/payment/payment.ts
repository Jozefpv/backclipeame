import { Router } from "express";
import { createSession } from "../../controllers/payment.controller.js";

const router = Router();

router.get("/", createSession);

export default router;
