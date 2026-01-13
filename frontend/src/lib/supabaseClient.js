import { supabase } from "./supabase.js"; // your existing client

export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error.message);
    return null;
  }

  // Save the access token in localStorage for backend requests
  localStorage.setItem("token", data.session.access_token);

  console.log("Token saved:", data.session.access_token);

  return data.session.access_token;
};
