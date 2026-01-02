import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { useAuth } from "../../contexts/useAuth";

export function AuthModal({ isOpen, onClose, mode, onSwitchMode }) {
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone: "",
    account_type: "retail",
    company_name: "",
    business_registration: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await signIn(loginData.email, loginData.password);
      if (error) throw error;
      onClose();
      setLoginData({ email: "", password: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setConfirmationSent(false);

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Call signUp and get confirmation flag
      const { error, requiresConfirmation } = await signUp(
        signupData.email,
        signupData.password,
        {
          full_name: signupData.full_name,
          phone: signupData.phone,
          account_type: signupData.account_type,
          company_name:
            signupData.account_type === "wholesale"
              ? signupData.company_name
              : undefined,
          business_registration:
            signupData.account_type === "wholesale"
              ? signupData.business_registration
              : undefined,
        }
      );

      if (error) throw error;

      if (requiresConfirmation) {
        setConfirmationSent(true);
        // Optionally clear password fields but keep email so user knows where to check
        setSignupData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      } else {
        onClose();
        setSignupData({
          email: "",
          password: "",
          confirmPassword: "",
          full_name: "",
          phone: "",
          account_type: "retail",
          company_name: "",
          business_registration: "",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="max-w-md mx-auto h-[70vh] ">
        <div className="flex justify-center">
          <img
            src="/logo1.png"
            alt="Adunni Trading Hub"
            className="h-32 w-32"
          />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-gray-600 text-center mb-6">
          {mode === "login"
            ? "Sign in to your account to continue"
            : "Sign up to start shopping with us"}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {confirmationSent && (
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg mb-4">
            A confirmation email has been sent to{" "}
            <strong>{signupData.email}</strong>. Please check your inbox and
            follow the instructions to complete your registration.
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              label="Email"
              required
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />
            <Input
              type="password"
              label="Password"
              required
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              type="text"
              label="Full Name"
              required
              value={signupData.full_name}
              onChange={(e) =>
                setSignupData({ ...signupData, full_name: e.target.value })
              }
            />
            <Input
              type="email"
              label="Email"
              required
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
            />
            <Input
              type="tel"
              label="Phone Number"
              required
              value={signupData.phone}
              onChange={(e) =>
                setSignupData({ ...signupData, phone: e.target.value })
              }
            />
            <Select
              label="Account Type"
              required
              value={signupData.account_type}
              onChange={(e) =>
                setSignupData({ ...signupData, account_type: e.target.value })
              }
              options={[
                { value: "retail", label: "Retail Customer" },
                { value: "wholesale", label: "Wholesale Customer" },
              ]}
            />
            {signupData.account_type === "wholesale" && (
              <>
                <Input
                  type="text"
                  label="Company Name"
                  required
                  value={signupData.company_name}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      company_name: e.target.value,
                    })
                  }
                />
                <Input
                  type="text"
                  label="Business Registration Number"
                  value={signupData.business_registration}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      business_registration: e.target.value,
                    })
                  }
                />
              </>
            )}
            <Input
              type="password"
              label="Password"
              required
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
            />
            <Input
              type="password"
              label="Confirm Password"
              required
              value={signupData.confirmPassword}
              onChange={(e) =>
                setSignupData({
                  ...signupData,
                  confirmPassword: e.target.value,
                })
              }
            />
            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <button
              onClick={() =>
                onSwitchMode(mode === "login" ? "signup" : "login")
              }
              className="ml-2 text-[#CA993B] font-medium hover:underline"
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
}
