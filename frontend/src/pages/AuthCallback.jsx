import { useEffect } from "react";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const { setUser, setSession } = useAuth(); // make sure your AuthContext exposes these
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // This reads the access token from the URL
        const { data: { session }, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });

        if (error) {
          console.error("Supabase auth callback error:", error);
          navigate("/"); // fallback redirect
          return;
        }

        if (session) {
          // Update global auth context
          setSession(session);
          setUser(session.user);

          // Redirect to dashboard or home after successful login
          navigate("/");
        }
      } catch (err) {
        console.error("Error handling auth callback:", err);
        navigate("/");
      }
    };

    handleAuth();
  }, [navigate, setUser, setSession]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg text-gray-600">Verifying your email…</p>
    </div>
  );
}
