import { Router } from "express";
import axios from "axios";
import supabase from "../../db/db.js";
import { requireAuth, requireUserAuth } from "../../middleware/requireAuth.js";
import {
  changeAvatar,
  getProfileById,
  uploadConfig,
} from "../../controllers/auth.controller.js";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/google", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GCP_CLIENT_ID!,
    redirect_uri: process.env.GCP_REDIRECT_URI!,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

router.get("/google/callback", async (req: any, res: any) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code provided");

  try {
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: process.env.GCP_CLIENT_ID!,
        client_secret: process.env.GCP_CLIENT_SECRET!,
        redirect_uri: process.env.GCP_REDIRECT_URI!,
        grant_type: "authorization_code",
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const { id_token } = tokenResponse.data;

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: id_token,
    });
    if (error) throw error;

    const { session } = data;
    res.cookie("sb-access-token", session.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.redirect(`${process.env.FRONTEND_URL}/`);
  } catch (err: any) {
    console.error("Error en OAuth callback:", err);
    res.redirect(
      `${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(err.message)}`
    );
  }
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    res.json({
      user: signUpData.user,
      message: "Revisa tu correo para confirmar tu cuenta",
    });
  } catch (err: any) {
    console.error("Error en /auth/register:", err);
    res.status(400).json({ error: err.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, token } = req.body;
  try {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    if (error) throw error;
    res.json({ message: "Email confirmado correctamente" });
  } catch (err: any) {
    console.error("Error en /auth/verify-otp:", err);
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    const { session, user } = data;
    res.cookie("sb-access-token", session.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.json({ user, verify: true });
  } catch (err: any) {
    console.error("Error en /auth/login:", err);
    res.status(401).json({ error: err.message });
  }
});

router.post("/logout", async (req, res) => {
  res.clearCookie("sb-access-token", { path: "/" });
  res.json({ success: true });
});

router.get("/profile/:id", requireAuth, getProfileById);

router.post(
  "/profile/avatar",
  requireUserAuth,
  upload.single("avatar"),
  changeAvatar
);

router.post("/profile/config", requireUserAuth, uploadConfig);

export default router;
