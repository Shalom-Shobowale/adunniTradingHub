import { supabaseAdmin } from "../lib/supabaseAdmin.js";

export const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");

    // 1️⃣ Validate JWT
    const { data: userData, error: userError } =
      await supabaseAdmin.auth.getUser(token);

    if (userError || !userData?.user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // 2️⃣ Fetch profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("account_type")
      .eq("id", userData.user.id)
      .single();

    if (profileError || profile.account_type !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // 3️⃣ Attach user for downstream use (optional)
    req.user = userData.user;
    next();
  } catch (err) {
    console.error("Admin auth error:", err);
    res.status(403).json({ error: "Forbidden" });
  }
};
