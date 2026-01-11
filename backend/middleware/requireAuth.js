// middleware/requireAuth.js
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.replace("Bearer ", "");
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = data.user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
