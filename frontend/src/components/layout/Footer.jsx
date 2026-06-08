import {
  Package,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Send,
  ChevronRight,
  Clock,
  Shield,
} from "lucide-react";

export function Footer({ onNavigate }) {
  return (
    <footer className="bg-gray-900 text-white mt-auto relative">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#CA993B] to-transparent"></div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-5">
              <img src="logo1.png" alt="Adunni Trading Hub Logo"  className="h-14"/>
              <span className="ml-3 text-xl font-bold tracking-tight">
                Adunni Trading Hub
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Your trusted supplier of premium quality dried cow skin. Serving
              retail and wholesale customers with dedication to excellence since
              2014.
            </p>

            {/* Trust Badges */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield className="h-3 w-3 text-[#CA993B]" />
                <span>100% Quality</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3 text-[#CA993B]" />
                <span>Fast Delivery</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="#"
                className="bg-gray-800 hover:bg-[#CA993B] p-2 rounded-full transition-all duration-300 group"
              >
                <Facebook className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-[#CA993B] p-2 rounded-full transition-all duration-300 group"
              >
                <Twitter className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-[#CA993B] p-2 rounded-full transition-all duration-300 group"
              >
                <Instagram className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 relative inline-block">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#CA993B] rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {["home", "products", "wholesale", "about"].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => onNavigate(item)}
                    className="text-gray-400 hover:text-[#CA993B] transition-all duration-300 flex items-center gap-2 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    <span className="capitalize group-hover:translate-x-1 transition-transform duration-300">
                      {item === "home"
                        ? "Home"
                        : item === "products"
                          ? "Products"
                          : item === "wholesale"
                            ? "Wholesale"
                            : "About Us"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-6 relative inline-block">
              Customer Service
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#CA993B] rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Contact Us", action: "contact" },
                { label: "Shipping Info", action: "shipping" },
                { label: "Returns Policy", action: "returns" },
                { label: "FAQs", action: "faqs" },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => onNavigate(item.action)}
                    className="text-gray-400 hover:text-[#CA993B] transition-all duration-300 flex items-center gap-2 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-6 relative inline-block">
              Get In Touch
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#CA993B] rounded-full"></div>
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 group">
                <Mail className="h-5 w-5 text-[#CA993B] mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="text-gray-400 text-sm">
                  <p>Email Us</p>
                  <a
                    href="mailto:info@adunnitradinghub.com"
                    className="hover:text-[#CA993B] transition-colors"
                  >
                    info@adunnitradinghub.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <Phone className="h-5 w-5 text-[#CA993B] mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="text-gray-400 text-sm">
                  <p>Call Us</p>
                  <div className="space-y-1">
                    <a
                      href="tel:+2348023546947"
                      className="hover:text-[#CA993B] transition-colors block"
                    >
                      +234 802 354 6947
                    </a>
                    <a
                      href="tel:+2347066898121"
                      className="hover:text-[#CA993B] transition-colors block"
                    >
                      +234 706 689 8121
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <MapPin className="h-5 w-5 text-[#CA993B] mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="text-gray-400 text-sm">
                  <p>Visit Us</p>
                  <span>Lagos, Nigeria</span>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3">
                Subscribe for updates
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#CA993B] transition-colors flex-1"
                />
                <button className="bg-[#CA993B] hover:bg-[#b8852e] text-gray-900 p-2 rounded-lg transition-all duration-300 hover:scale-105">
                  <Send className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Adunni Trading Hub. All rights
              reserved.
            </p>
            <div className="flex gap-6 text-xs text-gray-500">
              <a href="#" className="hover:text-[#CA993B] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-[#CA993B] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-[#CA993B] transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
