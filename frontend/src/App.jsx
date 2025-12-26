import { useState, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import WholesalePage from "./pages/WholesalePage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import AboutPage from "./pages/AboutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import WishlistPage from "./pages/WishlistPage";

const pages = {
  home: HomePage,
  products: ProductsPage,
  "product-detail": ProductDetailPage,
  cart: CartPage,
  checkout: CheckoutPage,
  wholesale: WholesalePage,
  dashboard: DashboardPage,
  admin: AdminDashboard,
  about: AboutPage,
  "order-confirmation": OrderConfirmationPage,
  wishlist: WishlistPage,
};

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [pageData, setPageData] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Universal navigation
  const handleNavigate = (page, data = {}) => {
    setCurrentPage(page);
    setPageData(data);
  };

  // Get the correct page component
  const CurrentPage = pages[currentPage] || HomePage;

  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Header onNavigate={handleNavigate} currentPage={currentPage} />

          <main className="flex-1">
            <CurrentPage
              onNavigate={handleNavigate}
              {...pageData} // send productId, orderNumber, etc
            />
          </main>

          <Footer onNavigate={handleNavigate} />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
