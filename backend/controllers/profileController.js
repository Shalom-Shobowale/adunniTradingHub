import { supabaseAdmin } from "../lib/supabaseAdmin.js";

// GET ALL USERS (ADMIN ONLY)
export const getProfiles = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data); // ALWAYS an array
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load profiles" });
  }
};

export const toggleWholesaleApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { wholesale_approved } = req.body;

    console.log("TOGGLE REQUEST:", {
      id,
      wholesale_approved,
    });

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({ wholesale_approved })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

