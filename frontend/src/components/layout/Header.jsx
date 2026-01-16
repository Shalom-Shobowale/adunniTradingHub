import { useState } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  LayoutDashboard,
  LogOut,
  Heart,
} from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../contexts/useAuth";
import { useCart } from "../../contexts/useCart";
import { AuthModal } from "../auth/AuthModal";
import { Link, NavLink, useNavigate } from "react-router-dom";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const { user, profile, signOut, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/"); // redirect to homepage
  };

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Products", to: "/products" },
    { name: "Wholesale", to: "/wholesale" },
    { name: "About", to: "/about" },
  ];

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src="/logo1.png" alt="Adunni Trading Hub" className="h-24" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-base font-medium transition-colors ${
                      isActive
                        ? "text-[#CA993B] border-b-2 border-[#CA993B]"
                        : "text-gray-700 hover:text-[#CA993B]"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  {/* Cart */}
                  <Link
                    to="/cart"
                    className="relative p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <ShoppingCart className="h-6 w-6 text-gray-700" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#CA993B] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  {/* Wishlist */}
                  <Link
                    to="/wishlist"
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <Heart className="h-6 w-6 text-gray-700" />
                  </Link>

                  {/* Account Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition">
                      <User className="h-6 w-6 text-gray-700" />
                      <span className="text-sm font-medium text-gray-700">
                        {profile?.full_name}
                      </span>
                    </button>

                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 w-full px-4 py-3 text-left hover:bg-gray-50 transition"
                      >
                        <User className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-700">
                          My Account
                        </span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-2 w-full px-4 py-3 text-left hover:bg-gray-50 transition"
                        >
                          <LayoutDashboard className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-700">
                            Admin Dashboard
                          </span>
                        </Link>
                      )}

                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 w-full px-4 py-3 text-left hover:bg-gray-50 transition border-t border-gray-200"
                      >
                        <LogOut className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-700">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleAuthClick("login")}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleAuthClick("signup")}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                      isActive
                        ? "bg-[#CA993B] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {user ? (
                <>
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 w-full px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart {cartCount > 0 && `(${cartCount})`}</span>
                  </Link>

                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 w-full px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <User className="h-5 w-5" />
                    <span>My Account</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 w-full px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 rounded-lg hover:bg-gray-100 transition text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={() => {
                      handleAuthClick("login");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    fullWidth
                    variant="primary"
                    onClick={() => {
                      handleAuthClick("signup");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={(mode) => setAuthMode(mode)}
      />
    </>
  );
}
