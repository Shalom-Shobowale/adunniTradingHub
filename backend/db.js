// backend/db.js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// This is for frontend-safe operations (like fetching public data)
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
