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

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      let productsData = [];
      let ordersData = [];

      if (activeTab === "products" || activeTab === "overview") {
        const { data: productsRes } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });
        productsData = productsRes || [];
        setProducts(productsData);
      }

      if (activeTab === "orders" || activeTab === "overview") {
        const { data: ordersRes } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });
        ordersData = ordersRes || [];
        setOrders(ordersData);
      }

      // Calculate stats safely
      const revenue =
        ordersData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
      setStats({
        totalProducts: productsData.length,
        totalOrders: ordersData.length,
        revenue,
      });
    };

    loadData();
  }, [activeTab]);

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
        // NEW FIELDS:
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

      if (editingProduct) {
        await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);
      } else {
        await supabase.from("products").insert(productData);
      }

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
        // RESET NEW FIELDS:
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

      // Reload products after submit
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      setProducts(data || []);
    } catch (error) {
      console.error("Error saving product:", error);
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

  const handleDeleteProduct = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await supabase.from("products").delete().eq("id", id);
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      setProducts(data || []);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders(data || []);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          {["overview", "products", "orders"].map((tab) => (
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
          ))}
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
            <h2 className="text-2xl font-bold mb-6">Orders</h2>
            <div className="space-y-4">
              {(orders || []).map((order) => (
                <Card key={order.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">
                        {order.order_number}
                      </h3>
                      <p className="text-gray-600">
                        {formatCurrency(order.total || 0)}
                      </p>
                    </div>
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
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Product Modal */}
        <Modal
          isOpen={showProductModal}
          onClose={() => setShowProductModal(false)}
          title={editingProduct ? "Edit Product" : "Add Product"}
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
