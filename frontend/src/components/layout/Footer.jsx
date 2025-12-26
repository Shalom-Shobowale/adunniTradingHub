import { Package, Mail, Phone, MapPin } from "lucide-react";

export function Footer({ onNavigate }) {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="logo1.png"
                alt="Adunni Trading Hub Logo"
                className="h-14"
              />
              <span className="ml-3 text-2xl font-bold">
                Adunni Trading Hub
              </span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Your trusted supplier of quality dried cow skin. We serve both
              retail and wholesale customers with dedication to excellence.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4 text-[#CA993B]" />
                <span>info@adunnitradinghub.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-4 w-4 text-[#CA993B]" />
                <div>
                  <a href="tel:+2348023546947">+234 802 354 6947</a><br />
                  <a href="tel:+2347066898121">+234 706 689 8121</a>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="h-4 w-4 text-[#CA993B]" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate("home")}
                  className="text-gray-400 hover:text-[#CA993B] transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("products")}
                  className="text-gray-400 hover:text-[#CA993B] transition"
                >
                  Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("wholesale")}
                  className="text-gray-400 hover:text-[#CA993B] transition"
                >
                  Wholesale
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("about")}
                  className="text-gray-400 hover:text-[#CA993B] transition"
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-[#CA993B] transition cursor-pointer">
                Contact Us
              </li>
              <li className="hover:text-[#CA993B] transition cursor-pointer">
                Shipping Info
              </li>
              <li className="hover:text-[#CA993B] transition cursor-pointer">
                Returns Policy
              </li>
              <li className="hover:text-[#CA993B] transition cursor-pointer">
                FAQs
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Adunni Trading Hub. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
