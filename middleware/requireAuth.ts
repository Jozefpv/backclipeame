import supabase from "../db/db.js";

export async function requireUserAuth(req: any, res: any, next: any) {
  const token = req.cookies["sb-access-token"];
  if (!token) return res.status(401).json({ error: "No autenticado" });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: "Token inválido" });
  req.user = user;
  next();
}

export async function requireAuth(req: any, res: any, next: any) {
  const token = req.cookies["sb-access-token"];
  if (!token) return res.status(401).json({ error: "No autenticado" });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: "Token inválido" });

  next();
}
