import { useEffect, useState } from "react";
import { Package, Heart, User, MapPin } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/useAuth";
import { formatCurrency, formatDate } from "../lib/utils";

export default function DashboardPage({ onNavigate }) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "orders") {
        const { data } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });
        setOrders(data || []);
      } else if (activeTab === "wishlist") {
        const { data } = await supabase
          .from("wishlist")
          .select("*, product:products(*)");
        setWishlist(data || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await supabase.from("wishlist").delete().eq("id", id);
      loadData();
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const tabs = [
    { id: "orders", label: "My Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "profile", label: "Profile", icon: User },
  ];

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Welcome back, {profile?.full_name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                        activeTab === tab.id
                          ? "bg-[#CA993B] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {activeTab === "orders" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">Order History</h2>
                {loading ? (
                  <Card className="animate-pulse">
                    <div className="h-32 bg-gray-300 rounded" />
                  </Card>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <Card key={order.id} hover className="cursor-pointer">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-bold text-lg">
                              {order.order_number}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                statusColors[order.status]
                              }`}
                            >
                              {order.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#CA993B]">
                            {formatCurrency(order.total)}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {order.order_type}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <div className="text-center py-8">
                      <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No orders yet</p>
                      <Button
                        className="mt-4"
                        onClick={() => onNavigate("products")}
                      >
                        Start Shopping
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "wishlist" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <Card key={i} padding="none" className="animate-pulse">
                        <div className="bg-gray-300 h-48" />
                      </Card>
                    ))}
                  </div>
                ) : wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlist.map((item) => {
                      const images = item.product.images;
                      const imageUrl =
                        Array.isArray(images) && images.length > 0
                          ? typeof images[0] === "string"
                            ? images[0]
                            : images[0]?.url
                          : "https://images.pexels.com/photos/4113773/pexels-photo-4113773.jpeg";

                      return (
                        <Card key={item.id} padding="none" hover>
                          <img
                            src={imageUrl}
                            alt={item.product.name}
                            className="w-full h-48 object-cover cursor-pointer"
                            onClick={() =>
                              onNavigate("product-detail", {
                                productId: item.product_id,
                              })
                            }
                          />
                          <div className="p-4">
                            <h3 className="font-bold text-lg mb-2">
                              {item.product.name}
                            </h3>
                            <div className="flex justify-between items-center">
                              <span className="text-xl font-bold text-[#CA993B]">
                                {formatCurrency(item.product.retail_price)}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFromWishlist(item.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card>
                    <div className="text-center py-8">
                      <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Your wishlist is empty</p>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "profile" && (
              <div className="space-y-6">
                <Card>
                  <h2 className="text-2xl font-bold mb-6">
                    Profile Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Full Name
                      </label>
                      <p className="text-lg text-gray-900">
                        {profile?.full_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Email
                      </label>
                      <p className="text-lg text-gray-900">{profile?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Phone
                      </label>
                      <p className="text-lg text-gray-900">
                        {profile?.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Account Type
                      </label>
                      <p className="text-lg text-gray-900 capitalize">
                        {profile?.account_type}
                      </p>
                    </div>
                    {profile?.account_type === "wholesale" && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Company Name
                          </label>
                          <p className="text-lg text-gray-900">
                            {profile?.company_name || "N/A"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Wholesale Status
                          </label>
                          <p className="text-lg">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                profile?.wholesale_approved
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {profile?.wholesale_approved
                                ? "Approved"
                                : "Pending"}
                            </span>
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
