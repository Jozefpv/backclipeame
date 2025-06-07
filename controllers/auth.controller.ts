import { Profile } from "../models/Profile.js";
import * as authService from "../services/auth.service.js";

export async function getProfileById(req: any, res: any) {
  try {
    const { id } = req.params;
    const profile: Profile = await authService.fetchProfile(id);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    return res.json({ profile });
  } catch (err: any) {
    console.error("Controller Error:", err);
    return res.status(500).json({ error: err.message });
  }
}

export const changeAvatar = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se ha subido ningún archivo" });
    }
    if (!req.user?.id) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const userId = req.user.id;
    const buffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    const publicUrl = await authService.changeAvatar(userId, buffer, mimeType);

    return res.json({ avatarUrl: publicUrl });
  } catch (err: any) {
    console.error("Error en changeAvatar:", err);
    return res
      .status(500)
      .json({ error: err.message || "Error interno del servidor" });
  }
};

export async function uploadConfig(req: any, res: any) {
  try {
    const id = req.user.id;
    const { form } = req.body;
    const response = await authService.updateConfigProfile(id, form);
    if (!response) {
      return res.status(404).json({ error: "Profile not found" });
    }
    return res.json({ response });
  } catch (err: any) {
    console.error("Controller Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
