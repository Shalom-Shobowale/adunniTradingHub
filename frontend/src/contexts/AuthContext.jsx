import { createContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let authSubscription = null;

    const initAuth = async () => {
      // Get initial session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await loadProfile(session.user.id);
      } else {
        setLoading(false);
      }

      // Subscribe to auth state changes
      authSubscription = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            await loadProfile(session.user.id);
          } else {
            setProfile(null);
            setLoading(false);
          }
        }
      );
    };

    initAuth();

    return () => {
      if (authSubscription?.subscription) {
        authSubscription.subscription.unsubscribe();
      }
    };
  }, []);

  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email,
          full_name: userData.full_name,
          phone: userData.phone,
          account_type: userData.account_type,
          company_name: userData.company_name || null,
          business_registration: userData.business_registration || null,
          wholesale_approved: false,
        });
        if (profileError) throw profileError;
      }

      // If session is null, user needs email confirmation
      const requiresConfirmation = !data.session;

      return { error: null, requiresConfirmation };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isAdmin = profile?.account_type === "admin";
  const isWholesale = profile?.account_type === "wholesale";
  const isWholesaleApproved =
    isWholesale && profile?.wholesale_approved === true;

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin,
    isWholesale,
    isWholesaleApproved,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
