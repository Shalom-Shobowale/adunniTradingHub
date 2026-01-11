import { useEffect, useState } from "react";
import { Package, ShoppingBag, TrendingUp } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Select } from "../components/ui/Select";
import { Modal } from "../components/ui/Modal";
import { supabase } from "../lib/supabase";
import { formatCurrency, generateSlug } from "../lib/utils";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    grade: "",
    weight_per_unit: "",
    retail_price: "",
    stock_quantity: "",
    min_wholesale_quantity: "5",
    featured: false,
    images: [],
    // NEW FIELDS FOR PONMO:
    cut_type: "STRIPS",
    texture: "BUBBLY",
    drying_method: "SUN-DRIED",
    prep_time: "READY IN 15MIN",
    cleanliness: "HAIRLESS",
    best_for: "Perfect for soups & stews",
    rating: "4.5",
    review_count: "0",
    is_fresh: true,
    packaging: "VACUUM SEALED",
    certification: "",
    seller_trust: "",
    featured_badge: "",
    active: true,
  });
  const [wholesaleTabData, setWholesaleTabData] = useState([]);
  const [showWholesaleModal, setShowWholesaleModal] = useState(false);
  const [editingWholesale, setEditingWholesale] = useState(null);
  const [wholesaleForm, setWholesaleForm] = useState({
    product_id: "",
    min_quantity: 5,
    max_quantity: 100,
    price_per_unit: 0,
  });

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      let productsData = [];
      let ordersData = [];
      let profilesData = [];
      let wholesaleData = [];

      try {
        // 1️⃣ Get logged-in session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error("Not authenticated");
        }

        const token = session.access_token;

        const authHeaders = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        // 2️⃣ PRODUCTS
        if (
          activeTab === "products" ||
          activeTab === "overview" ||
          activeTab === "wholesale"
        ) {
          const res = await fetch("http://localhost:5000/products", {
            headers: authHeaders,
          });
          productsData = await res.json();
          setProducts(productsData || []);
        }

        // 3️⃣ ORDERS (ADMIN ONLY)
        if (activeTab === "orders" || activeTab === "overview") {
          const res = await fetch("http://localhost:5000/admin/orders", {
            headers: authHeaders,
          });
          ordersData = await res.json();
          setOrders(ordersData || []);
        }

        // 4️⃣ PROFILES (ADMIN ONLY)
        if (activeTab === "profiles") {
          const res = await fetch("http://localhost:5000/admin/users", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            console.error("Failed to load profiles:", res.status);
            setProfiles([]);
            return;
          }

          profilesData = await res.json();

          setProfiles(Array.isArray(profilesData) ? profilesData : []);
        }

        // 5️⃣ WHOLESALE PRICING
        if (activeTab === "wholesale") {
          const res = await fetch("http://localhost:5000/admin/wholesale", {
            headers: authHeaders, // make sure this includes Authorization
          });

          if (!res.ok) {
            console.error("Failed to load wholesale data:", res.status);
            setWholesaleTabData([]);
            return;
          }

          wholesaleData = await res.json();
          setWholesaleTabData(
            Array.isArray(wholesaleData) ? wholesaleData : []
          );
        }

        // 6️⃣ SAFE STATS
        const revenue = Array.isArray(ordersData)
          ? ordersData.reduce((sum, order) => sum + (order.total || 0), 0)
          : 0;

        setStats({
          totalProducts: productsData.length,
          totalOrders: ordersData.length,
          revenue,
        });
      } catch (error) {
        console.error("Error loading data:", error.message);
      }
    };

    loadData();
  }, [activeTab]);

  // AdminDashboard.jsx

  const adminFetch = async (url, options = {}) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      ...options.headers,
    };

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Request failed");
    }

    return res.json();
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        name: productForm.name,
        slug: generateSlug(productForm.name),
        description: productForm.description,
        grade: productForm.grade,
        weight_per_unit: parseFloat(productForm.weight_per_unit),
        retail_price: parseFloat(productForm.retail_price),
        stock_quantity: parseInt(productForm.stock_quantity),
        min_wholesale_quantity: parseInt(productForm.min_wholesale_quantity),
        featured: productForm.featured,
        images: productForm.images,

        // EXTRA FIELDS
        cut_type: productForm.cut_type,
        texture: productForm.texture,
        drying_method: productForm.drying_method,
        prep_time: productForm.prep_time,
        cleanliness: productForm.cleanliness,
        best_for: productForm.best_for,
        rating: parseFloat(productForm.rating),
        review_count: parseInt(productForm.review_count),
        is_fresh: productForm.is_fresh,
        packaging: productForm.packaging,
        certification: productForm.certification,
        seller_trust: productForm.seller_trust,
        featured_badge: productForm.featured_badge,
        active: productForm.active,
      };

      // ✅ CREATE or UPDATE
      if (editingProduct) {
        await adminFetch(
          `http://localhost:5000/products/${editingProduct.id}`,
          {
            method: "PUT",
            body: JSON.stringify(productData),
          }
        );
      } else {
        await adminFetch("http://localhost:5000/products", {
          method: "POST",
          body: JSON.stringify(productData),
        });
      }

      // ✅ RESET UI STATE
      setShowProductModal(false);
      setEditingProduct(null);

      setProductForm({
        name: "",
        description: "",
        grade: "",
        weight_per_unit: "",
        retail_price: "",
        stock_quantity: "",
        min_wholesale_quantity: "5",
        featured: false,
        images: [],

        cut_type: "STRIPS",
        texture: "BUBBLY",
        drying_method: "SUN-DRIED",
        prep_time: "READY IN 15MIN",
        cleanliness: "HAIRLESS",
        best_for: "Perfect for soups & stews",
        rating: "4.5",
        review_count: "0",
        is_fresh: true,
        packaging: "VACUUM SEALED",
        certification: "",
        seller_trust: "",
        featured_badge: "",
        active: true,
      });

      // ✅ RELOAD PRODUCTS (adminFetch already returns JSON)
      const productsData = await adminFetch("http://localhost:5000/products");
      setProducts(productsData || []);
    } catch (error) {
      console.error("Error saving product:", error.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      grade: product.grade,
      weight_per_unit: product.weight_per_unit?.toString() || "",
      retail_price: product.retail_price?.toString() || "",
      stock_quantity: product.stock_quantity?.toString() || "",
      min_wholesale_quantity: product.min_wholesale_quantity?.toString() || "5",
      featured: product.featured || false,
      images: product.images || [],
      // NEW FIELDS WITH FALLBACKS:
      cut_type: product.cut_type || "STRIPS",
      texture: product.texture || "BUBBLY",
      drying_method: product.drying_method || "SUN-DRIED",
      prep_time: product.prep_time || "READY IN 15MIN",
      cleanliness: product.cleanliness || "HAIRLESS",
      best_for: product.best_for || "Perfect for soups & stews",
      rating: product.rating?.toString() || "4.5",
      review_count: product.review_count?.toString() || "0",
      is_fresh: product.is_fresh ?? true,
      packaging: product.packaging || "VACUUM SEALED",
      certification: product.certification || "",
      seller_trust: product.seller_trust || "",
      featured_badge: product.featured_badge || "",
      active: product.active ?? true,
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    console.log("Deleting product with ID:", productId);

    try {
      // adminFetch throws automatically if not ok
      await adminFetch(`http://localhost:5000/products/${productId}`, {
        method: "DELETE",
      });

      console.log("Delete successful");

      const productsData = await adminFetch("http://localhost:5000/products");
      setProducts(productsData || []);
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
  };

  const toggleWholesaleApproval = async (profileId, currentValue) => {
    try {
      await adminFetch(`http://localhost:5000/admin/users/${profileId}`, {
        method: "PUT",
        body: JSON.stringify({
          wholesale_approved: !currentValue,
        }),
      });

      // Update UI immediately
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profileId ? { ...p, wholesale_approved: !currentValue } : p
        )
      );
    } catch (error) {
      console.error("Error toggling wholesale approval:", error.message);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await adminFetch(`http://localhost:5000/orders/${orderId}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      const ordersData = await adminFetch("http://localhost:5000/orders");
      setOrders(ordersData || []);
    } catch (err) {
      console.error("Error updating order status:", err.message);
    }
  };

  const updatePaymentStatus = async (orderId, payment_status) => {
    try {
      await adminFetch(`http://localhost:5000/orders/${orderId}/payment`, {
        method: "PUT",
        body: JSON.stringify({ payment_status }),
      });

      if (payment_status === "paid") {
        await adminFetch("http://localhost:5000/sendPaymentEmail", {
          method: "POST",
          body: JSON.stringify({ orderId }),
        });
      }

      const ordersData = await adminFetch("http://localhost:5000/orders");
      setOrders(ordersData || []);
    } catch (err) {
      console.error("Error updating payment status:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          {["overview", "products", "orders", "profiles", "wholesale"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium capitalize transition ${
                  activeTab === tab
                    ? "border-b-2 border-[#CA993B] text-[#CA993B]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Total Products</p>
                    <p className="text-3xl font-bold">{products.length}</p>
                  </div>
                  <Package className="h-12 w-12 text-[#CA993B]" />
                </div>
              </Card>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Total Orders</p>
                    <p className="text-3xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <ShoppingBag className="h-12 w-12 text-[#CA993B]" />
                </div>
              </Card>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Revenue</p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(stats.revenue)}
                    </p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-[#CA993B]" />
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Products */}
        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Products</h2>
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductModal(true);
                }}
              >
                Add Product
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(products || []).map((product) => (
                <Card
                  key={product.id}
                  padding="none"
                  className="border border-gray-200 hover:shadow-md transition-shadow"
                >
                  {/* Image preview if available */}
                  {product.images && product.images.length > 0 && (
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-4">
                    {/* Product header with status */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        {product.active && (
                          <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                            Active
                          </span>
                        )}
                        {product.featured && (
                          <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Basic info */}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 font-medium">
                          Grade:
                        </span>
                        <span className="text-sm text-gray-900">
                          {product.grade}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 font-medium">
                          Weight:
                        </span>
                        <span className="text-sm text-gray-900">
                          {product.weight_per_unit}kg
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 font-medium">
                          Cut:
                        </span>
                        <span className="text-sm text-gray-900">
                          {product.cut_type || "STRIPS"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 font-medium">
                          Texture:
                        </span>
                        <span className="text-sm text-gray-900">
                          {product.texture || "BUBBLY"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 font-medium">
                          Prep:
                        </span>
                        <span className="text-sm text-gray-900">
                          {product.prep_time || "READY IN 15MIN"}
                        </span>
                      </div>
                    </div>

                    {/* Price and stock */}
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-xl font-bold text-[#CA993B]">
                          {formatCurrency(product.retail_price)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {product.min_wholesale_quantity > 1
                            ? `Min: ${product.min_wholesale_quantity} units`
                            : "Retail"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-sm font-semibold ${
                            product.stock_quantity > 10
                              ? "text-emerald-600"
                              : product.stock_quantity > 0
                              ? "text-amber-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.stock_quantity > 0
                            ? `${product.stock_quantity} in stock`
                            : "Out of stock"}
                        </p>
                        {product.rating && (
                          <p className="text-xs text-gray-600 flex items-center justify-end">
                            <span className="mr-1">⭐</span>
                            {product.rating} ({product.review_count || 0})
                          </p>
                        )}
                      </div>
                    </div>

                    {/* New fields indicator */}
                    {(product.drying_method ||
                      product.cleanliness ||
                      product.best_for) && (
                      <div className="mb-3 pt-3 border-t border-gray-100">
                        <div className="flex flex-wrap gap-1">
                          {product.drying_method && (
                            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                              {product.drying_method}
                            </span>
                          )}
                          {product.cleanliness && (
                            <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded">
                              {product.cleanliness}
                            </span>
                          )}
                          {product.best_for && (
                            <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded">
                              {product.best_for}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEditProduct(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        className="flex-1"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </Button>
                    </div>

                    {/* Created date */}
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Added: {new Date(product.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders</h2>

            <div className="space-y-4">
              {(orders || []).map((order) => (
                <Card
                  key={order.id}
                  className="p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">
                          {order.order_number || `ORD-${order.id.slice(-6)}`}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "processing"
                              ? "bg-purple-100 text-purple-800"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.status || "Pending"}
                        </span>
                      </div>

                      <div className="text-gray-600 mb-3">
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-[#CA993B]">
                            {formatCurrency(order.total || 0)}
                          </span>
                          <span className="text-sm">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Controls */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Select
                        value={order.status || "pending"}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value)
                        }
                        options={[
                          { value: "pending", label: "Pending" },
                          { value: "processing", label: "Processing" },
                          { value: "shipped", label: "Shipped" },
                          { value: "delivered", label: "Delivered" },
                          { value: "cancelled", label: "Cancelled" },
                        ]}
                        className="min-w-40"
                      />

                      <Select
                        value={order.payment_status || "pending"}
                        onChange={(e) =>
                          updatePaymentStatus(order.id, e.target.value)
                        }
                        options={[
                          { value: "pending", label: "Payment Pending" },
                          { value: "paid", label: "Paid" },
                          { value: "failed", label: "Failed" },
                          { value: "refunded", label: "Refunded" },
                        ]}
                        className="min-w-40"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Profiles */}
        {activeTab === "profiles" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              User Profiles
            </h2>

            <div className="space-y-4">
              {profiles.map((profile) => (
                <Card
                  key={profile.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* User Info */}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {profile.full_name || "No Name"}
                    </p>
                    <p className="text-sm text-gray-600">{profile.email}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      Account Type: {profile.account_type}
                    </p>
                  </div>

                  {/* Wholesale Status */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        profile.wholesale_approved
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {profile.wholesale_approved
                        ? "Wholesale Approved"
                        : "Not Wholesale"}
                    </span>

                    {/* Prevent toggling admins */}
                    {profile.account_type !== "admin" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          toggleWholesaleApproval(
                            profile.id,
                            profile.wholesale_approved
                          )
                        }
                      >
                        {profile.wholesale_approved ? "Revoke" : "Approve"}
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Wholesale Pricing */}
        {activeTab === "wholesale" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Wholesale Pricing</h2>
              <Button onClick={() => setShowWholesaleModal(true)}>
                Add Wholesale Price
              </Button>
            </div>

            <div className="space-y-4">
              {wholesaleTabData.map((item) => (
                <Card
                  key={item.id}
                  className="flex justify-between items-center p-4"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      Product: {item.products?.name}
                    </p>
                    <p>
                      Qty: {item.min_quantity} – {item.max_quantity}
                    </p>
                    <p className="font-bold text-[#CA993B]">
                      ₦{item.price_per_unit}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingWholesale(item);
                        setWholesaleForm({
                          product_id: item.product_id,
                          min_quantity: item.min_quantity,
                          max_quantity: item.max_quantity,
                          price_per_unit: item.price_per_unit,
                        });

                        setShowWholesaleModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={async () => {
                        try {
                          await adminFetch(
                            `http://localhost:5000/admin/wholesale/${item.id}`,
                            {
                              method: "DELETE",
                            }
                          );
                          setWholesaleTabData((prev) =>
                            prev.filter((w) => w.id !== item.id)
                          );
                        } catch (err) {
                          console.error(
                            "Error deleting wholesale entry:",
                            err.message
                          );
                          alert("Failed to delete wholesale entry");
                        }

                        setWholesaleTabData((prev) =>
                          prev.filter((w) => w.id !== item.id)
                        );
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* {wholesale Modal} */}
        <Modal
          isOpen={showWholesaleModal}
          onClose={() => {
            setShowWholesaleModal(false);
            setEditingWholesale(null);
            setWholesaleForm({
              product_id: "",
              min_quantity: 5,
              max_quantity: 100,
              price_per_unit: 0,
            });
          }}
          title={
            editingWholesale ? "Edit Wholesale Price" : "Add Wholesale Price"
          }
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              if (!wholesaleForm.product_id) {
                alert("Please select a product");
                return;
              }

              const data = {
                product_id: wholesaleForm.product_id,
                min_quantity: Number(wholesaleForm.min_quantity),
                max_quantity: Number(wholesaleForm.max_quantity),
                price_per_unit: Number(wholesaleForm.price_per_unit),
              };

              // Check overlap
              const { data: existingRanges, error: rangeError } = await supabase
                .from("wholesale_pricing")
                .select("id, min_quantity, max_quantity")
                .eq("product_id", data.product_id);

              if (rangeError) {
                alert(rangeError.message);
                return;
              }

              const overlap = existingRanges?.some((range) => {
                if (editingWholesale && range.id === editingWholesale.id)
                  return false;
                return !(
                  data.max_quantity < range.min_quantity ||
                  data.min_quantity > range.max_quantity
                );
              });

              if (overlap) {
                alert(
                  "Quantity range overlaps with an existing wholesale price"
                );
                return;
              }

              // Save
              try {
                if (editingWholesale) {
                  await adminFetch(
                    `http://localhost:5000/admin/wholesale/${editingWholesale.id}`,
                    {
                      method: "PUT",
                      body: JSON.stringify(data),
                    }
                  );
                } else {
                  await adminFetch("http://localhost:5000/admin/wholesale", {
                    method: "POST",
                    body: JSON.stringify(data),
                  });
                }

                // Refresh wholesale data
                const updated = await adminFetch(
                  "http://localhost:5000/admin/wholesale"
                );
                setWholesaleTabData(updated || []);

                // Close modal & reset form
                setShowWholesaleModal(false);
                setEditingWholesale(null);
                setWholesaleForm({
                  product_id: "",
                  min_quantity: 5,
                  max_quantity: 100,
                  price_per_unit: 0,
                });
              } catch (err) {
                console.error(err);
                alert(err.message || "Failed to save wholesale pricing");
              }

              // Refresh
              const { data: updated } = await supabase
                .from("wholesale_pricing")
                .select(
                  `
      id,
      product_id,
      min_quantity,
      max_quantity,
      price_per_unit,
      products ( name )
    `
                )
                .order("min_quantity", { ascending: true });

              setWholesaleTabData(updated || []);

              setShowWholesaleModal(false);
              setEditingWholesale(null);
              setWholesaleForm({
                product_id: "",
                min_quantity: 5,
                max_quantity: 100,
                price_per_unit: 0,
              });
            }}
            className="space-y-4"
          >
            <Select
              label="Select Product"
              value={wholesaleForm.product_id}
              onChange={(e) =>
                setWholesaleForm({
                  ...wholesaleForm,
                  product_id: e.target.value,
                })
              }
              options={products.map((p) => ({
                value: p.id,
                label: p.name,
              }))}
              required
            />
            <Input
              label="Minimum Quantity"
              type="number"
              value={wholesaleForm.min_quantity}
              onChange={(e) =>
                setWholesaleForm({
                  ...wholesaleForm,
                  min_quantity: e.target.value,
                })
              }
              required
            />
            <Input
              label="Maximum Quantity"
              type="number"
              value={wholesaleForm.max_quantity}
              onChange={(e) =>
                setWholesaleForm({
                  ...wholesaleForm,
                  max_quantity: e.target.value,
                })
              }
              required
            />
            <Input
              label="Wholesale Price"
              type="number"
              value={wholesaleForm.price_per_unit}
              onChange={(e) =>
                setWholesaleForm({
                  ...wholesaleForm,
                  price_per_unit: e.target.value,
                })
              }
              required
            />
            <Button type="submit" fullWidth>
              {editingWholesale ? "Update" : "Add"}
            </Button>
          </form>
        </Modal>

        {/* Product Modal */}
        <Modal
          isOpen={showProductModal}
          onClose={() => setShowProductModal(false)}
          title={editingProduct ? "Edit Product" : "Add Product"}
          showSideImage={false}
          size="2xl"
        >
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <Input
              label="Product Name"
              required
              value={productForm.name}
              onChange={(e) =>
                setProductForm({ ...productForm, name: e.target.value })
              }
            />
            <Textarea
              label="Description"
              required
              value={productForm.description}
              onChange={(e) =>
                setProductForm({ ...productForm, description: e.target.value })
              }
            />
            <Input
              label="Grade"
              required
              value={productForm.grade}
              onChange={(e) =>
                setProductForm({ ...productForm, grade: e.target.value })
              }
            />
            <Input
              label="Weight per Unit (kg)"
              type="number"
              step="0.1"
              required
              value={productForm.weight_per_unit}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  weight_per_unit: e.target.value,
                })
              }
            />
            <Input
              label="Retail Price"
              type="number"
              required
              value={productForm.retail_price}
              onChange={(e) =>
                setProductForm({ ...productForm, retail_price: e.target.value })
              }
            />
            <Input
              label="Stock Quantity"
              type="number"
              required
              value={productForm.stock_quantity}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  stock_quantity: e.target.value,
                })
              }
            />

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={async (e) => {
                const files = Array.from(e.target.files);
                const uploadedUrls = [];

                for (let file of files) {
                  const fileName = `${Date.now()}-${file.name}`;
                  const { error } = await supabase.storage
                    .from("product-images")
                    .upload(fileName, file);

                  if (error) {
                    console.error("Upload error:", error.message);
                  } else {
                    const publicUrl =
                      supabase.storage
                        .from("product-images")
                        .getPublicUrl(fileName)?.data?.publicUrl || "";
                    if (publicUrl) uploadedUrls.push(publicUrl);
                  }
                }

                setProductForm((prev) => ({
                  ...prev,
                  images: [...prev.images, ...uploadedUrls],
                }));
              }}
            />

            <div className="flex gap-2 mt-2">
              {(productForm.images || []).map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt="preview"
                    className="h-24 w-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setProductForm((prev) => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index),
                      }))
                    }
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            {/* NEW PONMO FIELDS */}
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Cut Type"
                value={productForm.cut_type}
                onChange={(e) =>
                  setProductForm({ ...productForm, cut_type: e.target.value })
                }
                options={[
                  { value: "STRIPS", label: "Strips" },
                  { value: "CUBES", label: "Cubes" },
                  { value: "WHOLE", label: "Whole" },
                  { value: "SHREDDED", label: "Shredded" },
                ]}
              />

              <Select
                label="Texture"
                value={productForm.texture}
                onChange={(e) =>
                  setProductForm({ ...productForm, texture: e.target.value })
                }
                options={[
                  { value: "BUBBLY", label: "Bubbly" },
                  { value: "SMOOTH", label: "Smooth" },
                  { value: "CRINKLED", label: "Crinkled" },
                  { value: "MIXED", label: "Mixed" },
                ]}
              />

              <Select
                label="Drying Method"
                value={productForm.drying_method}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    drying_method: e.target.value,
                  })
                }
                options={[
                  { value: "SUN-DRIED", label: "Sun-Dried" },
                  { value: "SMOKED", label: "Smoked" },
                  { value: "OVEN-DRIED", label: "Oven-Dried" },
                  { value: "AIR-DRIED", label: "Air-Dried" },
                ]}
              />

              <Select
                label="Cleanliness"
                value={productForm.cleanliness}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    cleanliness: e.target.value,
                  })
                }
                options={[
                  { value: "HAIRLESS", label: "Hairless" },
                  { value: "WELL-TRIMMED", label: "Well-Trimmed" },
                  { value: "PROPERLY CLEANED", label: "Properly Cleaned" },
                ]}
              />

              <Select
                label="Preparation Time"
                value={productForm.prep_time}
                onChange={(e) =>
                  setProductForm({ ...productForm, prep_time: e.target.value })
                }
                options={[
                  { value: "READY IN 15MIN", label: "Ready in 15min" },
                  { value: "SOAK OVERNIGHT", label: "Soak Overnight" },
                  { value: "QUICK BOIL", label: "Quick Boil" },
                  { value: "INSTANT COOK", label: "Instant Cook" },
                ]}
              />

              <Select
                label="Best For"
                value={productForm.best_for}
                onChange={(e) =>
                  setProductForm({ ...productForm, best_for: e.target.value })
                }
                options={[
                  {
                    value: "Perfect for soups & stews",
                    label: "Soups & Stews",
                  },
                  {
                    value: "Ideal for peppered ponmo",
                    label: "Peppered Ponmo",
                  },
                  { value: "Great for asun", label: "Asun" },
                  { value: "Best for egusi soup", label: "Egusi Soup" },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Rating (0-5)"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={productForm.rating}
                onChange={(e) =>
                  setProductForm({ ...productForm, rating: e.target.value })
                }
              />

              <Input
                label="Review Count"
                type="number"
                min="0"
                value={productForm.review_count}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    review_count: e.target.value,
                  })
                }
              />

              <Select
                label="Packaging"
                value={productForm.packaging}
                onChange={(e) =>
                  setProductForm({ ...productForm, packaging: e.target.value })
                }
                options={[
                  { value: "VACUUM SEALED", label: "Vacuum Sealed" },
                  { value: "HYGIENIC PACK", label: "Hygienic Pack" },
                  { value: "BULK PACK", label: "Bulk Pack" },
                  { value: "FAMILY PACK", label: "Family Pack" },
                ]}
              />

              <div className="flex items-center gap-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={productForm.is_fresh}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        is_fresh: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span>Mark as Fresh</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={productForm.active}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        active: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span>Active</span>
                </label>
              </div>
            </div>

            <Input
              label="Certification (optional)"
              value={productForm.certification}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  certification: e.target.value,
                })
              }
              placeholder="e.g., NAFDAC APPROVED"
            />

            <Input
              label="Seller Trust Badge (optional)"
              value={productForm.seller_trust}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  seller_trust: e.target.value,
                })
              }
              placeholder="e.g., TRUSTED SELLER"
            />

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={productForm.featured}
                onChange={(e) =>
                  setProductForm({ ...productForm, featured: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span>Featured Product</span>
            </label>
            <Button type="submit" fullWidth className="cursor-pointer">
              {editingProduct ? "Update Product" : "Add Product"}
            </Button>
          </form>
        </Modal>
      </div>
    </div>
  );
}
