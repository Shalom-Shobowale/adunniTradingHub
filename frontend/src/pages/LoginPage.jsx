// pages/LoginPage.jsx

import { useNavigate } from "react-router-dom";
import { AuthModal } from "../components/auth/AuthModal";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");

  return (
    <AuthModal
      isOpen={true}
      mode={mode}
      onSwitchMode={setMode}
      onClose={() => navigate("/")}
    />
  );
}
