import { createClient } from '@supabase/supabase-js';

// Load environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

// Create Supabase client with typing (optional, if you have Database types)
// import { Database } from './database.types';
// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const supabase = createClient("https://dqounbjgjoeduayvhoyb.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxb3VuYmpnam9lZHVheXZob3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NDEyODgsImV4cCI6MjA3OTUxNzI4OH0.ejOO8X0XOcMwe1NWQ6hzMPNoP-9tUMyG6Nuj2aNLQqs");
