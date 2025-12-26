import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Package,
  Truck,
  Shield,
  AlertCircle,
  Star,
  CheckCircle,
  Calendar,
  Scale,
  ChefHat,
  Users,
  Clock,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { supabase } from "../lib/supabase";
import { formatCurrency } from "../lib/utils";
import { useAuth } from "../contexts/useAuth";
import { useCart } from "../contexts/useCart";

export default function ProductDetailPage({ productId, onNavigate }) {
  const { user, isWholesaleApproved } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [wholesalePricing, setWholesalePricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const [
        { data: productData, error: productError },
        { data: pricingData },
        { data: reviewsData },
      ] = await Promise.all([
        supabase.from("products").select("*").eq("id", productId).maybeSingle(),
        supabase
          .from("wholesale_pricing")
          .select("*")
          .eq("product_id", productId)
          .order("min_quantity"),
        supabase
          .from("reviews")
          .select("*")
          .eq("product_id", productId)
          .order("created_at", { ascending: false }),
      ]);

      if (productError) throw productError;
      setProduct(productData);
      setWholesalePricing(pricingData || []);
      setReviews(reviewsData || []);

      // Calculate average rating
      if (reviewsData && reviewsData.length > 0) {
        const avg =
          reviewsData.reduce((sum, review) => sum + review.rating, 0) /
          reviewsData.length;
        setAverageRating(avg.toFixed(1));
      }
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      setMessage({
        type: "error",
        text: "Please sign in to add items to cart",
      });
      return;
    }
    if (!product || product.stock_quantity === 0) {
      setMessage({ type: "error", text: "Product is out of stock" });
      return;
    }
    if (quantity > product.stock_quantity) {
      setMessage({
        type: "error",
        text: `Only ${product.stock_quantity} items available`,
      });
      return;
    }
    setAddingToCart(true);
    try {
      await addToCart(productId, quantity);
      setMessage({ type: "success", text: "Added to cart successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: `Failed to add to cart ${error}` });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      setMessage({
        type: "error",
        text: "Please sign in to add items to wishlist",
      });
      return;
    }
    try {
      const { error } = await supabase.from("wishlist").insert({
        user_id: user.id,
        product_id: productId,
      });
      if (error) {
        if (error.code === "23505") {
          setMessage({ type: "error", text: "Already in wishlist" });
        } else {
          throw error;
        }
      } else {
        setMessage({ type: "success", text: "Added to wishlist!" });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      setMessage({ type: "error", text: "Failed to add to wishlist" });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-300 rounded mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-300 h-96 rounded-xl" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-300 rounded w-1/2" />
                <div className="h-32 bg-gray-300 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => onNavigate("products")}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const imageUrls =
    Array.isArray(images) && images.length > 0
      ? images.map((img) => (typeof img === "string" ? img : img?.url))
      : ["https://images.pexels.com/photos/4113773/pexels-photo-4113773.jpeg"];

  const currentPrice =
    isWholesaleApproved && quantity >= product.min_wholesale_quantity
      ? wholesalePricing.find(
          (tier) =>
            quantity >= tier.min_quantity &&
            (tier.max_quantity === null || quantity <= tier.max_quantity)
        )?.price_per_unit || product.retail_price
      : product.retail_price;

  // Get all ponmo-specific fields
  const ponmoDetails = [
    { label: "Cut Type", value: product.cut_type || "STRIPS", icon: Package },
    { label: "Texture", value: product.texture || "BUBBLY", icon: Scale },
    {
      label: "Drying Method",
      value: product.drying_method || "SUN-DRIED",
      icon: Calendar,
    },
    {
      label: "Preparation Time",
      value: product.prep_time || "READY IN 15MIN",
      icon: Clock,
    },
    {
      label: "Cleanliness",
      value: product.cleanliness || "HAIRLESS",
      icon: CheckCircle,
    },
    {
      label: "Packaging",
      value: product.packaging || "VACUUM SEALED",
      icon: Package,
    },
  ];

  const qualityBadges = [
    { condition: product.is_fresh, label: "FRESH", color: "bg-[#CA993B]" },
    { condition: product.featured, label: "FEATURED", color: "bg-[#CA993B]" },
    {
      condition: product.certification,
      label: product.certification,
      color: "bg-blue-500",
    },
    {
      condition: product.seller_trust,
      label: product.seller_trust,
      color: "bg-purple-500",
    },
  ].filter((badge) => badge.condition);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => onNavigate("products")}
          className="flex items-center space-x-2 text-gray-600 hover:text-[#CA993B] mb-8 transition group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to All Ponmo Products</span>
        </button>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-8 p-4 rounded-xl border ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              {message.text}
            </div>
          </div>
        )}

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div>
            {/* Main Image */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl mb-6 border border-gray-200">
              <img
                src={imageUrls[selectedImage]}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </div>

            {/* Thumbnails */}
            {imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? "border-[#CA993B] ring-2 ring-[#CA993B]/20"
                        : "border-gray-200 hover:border-[#CA993B]/50"
                    }`}
                  >
                    <img
                      src={url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quality Badges */}
            <div className="mt-8">
              <h3 className="font-bold text-gray-900 mb-3">Quality Assured</h3>
              <div className="flex flex-wrap gap-2">
                {qualityBadges.map((badge, index) => (
                  <span
                    key={index}
                    className={`px-3 py-2 ${badge.color} text-white text-xs font-bold rounded-full shadow`}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div>
            {/* Product Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {product.name}
                </h1>
                {/* Rating */}
                <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                  <span className="font-bold text-gray-900">
                    {averageRating || product.rating || "4.5"}
                  </span>
                  <span className="text-gray-600 text-sm ml-1">
                    ({reviews.length || product.review_count || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Grade and Weight */}
              <div className="flex items-center space-x-4 mb-4">
                <span className="px-3 py-1 bg-[#CA993B] bg-opacity-10 text-[#CA993B] font-medium rounded-full">
                  {product.grade}
                </span>
                <span className="text-gray-600 flex items-center">
                  <Scale className="h-4 w-4 mr-1" />
                  {product.weight_per_unit}kg per unit
                </span>
                <span className="text-gray-600 flex items-center">
                  <Package className="h-4 w-4 mr-1" />
                  {product.cut_type || "STRIPS"}
                </span>
              </div>
            </div>

            {/* Price Section */}
            <Card className="mb-8 bg-linear-to-r from-amber-50 to-white border border-amber-100">
              <div className="p-6">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <div className="text-4xl font-bold text-[#CA993B]">
                      {formatCurrency(currentPrice * quantity)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {formatCurrency(currentPrice)} × {quantity} unit
                      {quantity > 1 ? "s" : ""}
                    </div>
                  </div>
                  <div
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      product.stock_quantity > 10
                        ? "bg-[#CA993B] text-white"
                        : product.stock_quantity > 0
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.stock_quantity > 10
                      ? "In Stock"
                      : product.stock_quantity > 0
                      ? "Low Stock"
                      : "Out of Stock"}
                  </div>
                </div>

                {/* Stock Info */}
                <p className="text-sm text-gray-600 mb-4">
                  {product.stock_quantity} units available
                </p>

                {/* Quantity Selector */}
                {product.stock_quantity > 0 && (
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition"
                        >
                          −
                        </button>
                        <Input
                          type="number"
                          min="1"
                          max={product.stock_quantity}
                          value={quantity}
                          onChange={(e) =>
                            setQuantity(
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          }
                          className="border-0 text-center rounded-none"
                        />
                        <button
                          onClick={() =>
                            setQuantity(
                              Math.min(product.stock_quantity, quantity + 1)
                            )
                          }
                          className="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex-1 space-y-2">
                      <Button
                        fullWidth
                        size="lg"
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                        className="bg-[#CA993B] hover:bg-[#B8852F] transition-colors"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        {addingToCart ? "Adding..." : "Add to Cart"}
                      </Button>
                      <Button
                        fullWidth
                        variant="outline"
                        size="lg"
                        onClick={handleAddToWishlist}
                        className="border-[#CA993B] text-[#CA993B] hover:bg-[#CA993B]/10"
                      >
                        <Heart className="h-5 w-5 mr-2" />
                        Add to Wishlist
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Description */}
            <Card className="mb-8">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <ChefHat className="h-5 w-5 mr-2 text-[#CA993B]" />
                Product Description
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
              {product.best_for && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                  <div className="flex items-center text-[#CA993B] ">
                    <ChefHat className="h-5 w-5 mr-2" />
                    <span className="font-medium">{product.best_for}</span>
                  </div>
                </div>
              )}
            </Card>

            {/* Ponmo Details Grid */}
            <Card className="mb-8">
              <h3 className="font-bold text-lg mb-6 flex items-center">
                <Package className="h-5 w-5 mr-2 text-[#CA993B]" />
                Product Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {ponmoDetails.map((detail, index) => {
                  const Icon = detail.icon;
                  return (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                    >
                      <div className="flex items-center mb-2">
                        <Icon className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-xs font-medium text-gray-600">
                          {detail.label}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {detail.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Trust Section */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#CA993B]/10 rounded-full mb-3">
                  <Truck className="h-6 w-6 text-[#CA993B]" />
                </div>
                <p className="text-xs font-medium text-gray-700">
                  Fast Delivery
                </p>
                <p className="text-xs text-gray-500">Nationwide</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#CA993B]/10 rounded-full mb-3">
                  <Shield className="h-6 w-6 text-[#CA993B]" />
                </div>
                <p className="text-xs font-medium text-gray-700">
                  Secure Payment
                </p>
                <p className="text-xs text-gray-500">100% Safe</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#CA993B]/10 rounded-full mb-3">
                  <Users className="h-6 w-6 text-[#CA993B]" />
                </div>
                <p className="text-xs font-medium text-gray-700">
                  24/7 Support
                </p>
                <p className="text-xs text-gray-500">Always Available</p>
              </div>
            </div>

            {/* Wholesale Pricing */}
            {isWholesaleApproved && wholesalePricing.length > 0 && (
              <Card className="bg-linear-to-r from-gray-50 to-white">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-[#CA993B]" />
                  Wholesale Pricing (Bulk Orders)
                </h3>
                <div className="space-y-3">
                  {wholesalePricing.map((tier) => (
                    <div
                      key={tier.id}
                      className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-[#CA993B] transition-colors"
                    >
                      <div>
                        <span className="font-medium text-gray-700">
                          {tier.min_quantity} - {tier.max_quantity || "∞"} units
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Save{" "}
                          {Math.round(
                            (1 - tier.price_per_unit / product.retail_price) *
                              100
                          )}
                          %
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#CA993B]">
                          {formatCurrency(tier.price_per_unit)}/unit
                        </span>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(
                            tier.price_per_unit * tier.min_quantity
                          )}{" "}
                          min order
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4 p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Note:</span> Minimum wholesale
                  order is {product.min_wholesale_quantity} units. Contact us
                  for custom bulk orders.
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.slice(0, 4).map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <div className="mt-4 text-sm text-gray-500">
                    - {review.customer_name || "Anonymous"}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
