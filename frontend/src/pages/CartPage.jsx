import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  Shield,
  Package,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useCart } from "../contexts/useCart";
import { formatCurrency } from "../lib/utils";

export default function CartPage({ onNavigate }) {
  const { cart, updateQuantity, removeFromCart, cartTotal, loading } =
    useCart();

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-10 w-64 bg-linear-to-r from-gray-200 to-gray-300 rounded-full mb-8" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-40 bg-linear-to-r from-gray-100 to-gray-200 rounded-2xl"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-amber-50 to-gray-100 rounded-full mb-6 shadow-lg">
            <ShoppingBag className="h-12 w-12 text-[#CA993B]" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Ready to cook something delicious? Start adding premium ponmo to
            your cart!
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate("/products")}
            className="bg-[#CA993B] hover:bg-[#B8852F] shadow-lg hover:shadow-xl transition-all"
          >
            Browse Premium Ponmo
          </Button>
        </div>
      </div>
    );
  }

  const shippingCost = cartTotal > 5000 ? 0 : 2000;
  const total = cartTotal + shippingCost;

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Your Shopping Cart
          </h1>
          <div className="flex items-center text-gray-600">
            <span className="bg-[#CA993B] text-white px-3 py-1 rounded-full text-sm font-medium mr-3">
              {cart.length} {cart.length === 1 ? "item" : "items"}
            </span>
            <span className="text-lg font-bold text-[#CA993B]">
              {formatCurrency(cartTotal)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => {
              const images = item.product.images;
              const imageUrl =
                Array.isArray(images) && images.length > 0
                  ? typeof images[0] === "string"
                    ? images[0]
                    : images[0]?.url
                  : "https://images.pexels.com/photos/4113773/pexels-photo-4113773.jpeg";

              return (
                <Card
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-6 p-6 border border-gray-200 hover:border-[#CA993B]/30 transition-all duration-300 shadow-sm hover:shadow-lg"
                >
                  {/* Product Image */}
                  <div className="relative">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden bg-linear-to-br from-amber-50 to-gray-100">
                      <img
                        src={imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {item.product.featured && (
                      <span className="absolute -top-2 -left-2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                        FEATURED
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1">
                          {item.product.name}
                        </h3>
                        {item.price < item.product.retail_price && (
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded ">
                            WHOLESALE PRICE
                          </span>
                        )}
                        <div className="flex flex-wrap gap-2 my-3">
                          <span className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            {item.product.grade}
                          </span>
                          <span className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            {item.product.cut_type || "STRIPS"}
                          </span>
                          <span className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            {item.product.weight_per_unit}kg
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#CA993B] mb-1">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatCurrency(item.price)} each
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-3 hover:bg-gray-100 transition disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="font-bold text-lg w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-3 hover:bg-gray-100 transition disabled:opacity-30"
                            disabled={
                              item.quantity >= item.product.stock_quantity
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">
                            {item.product.stock_quantity}
                          </span>{" "}
                          available
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center text-[#CA993B] hover:text-ambr-700 hover:bg-amber-50 px-4 py-2 rounded-lg transition-colors group"
                      >
                        <Trash2 className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Remove</span>
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-28 border border-gray-200 shadow-xl">
              <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-gray-200">
                Order Summary
              </h2>

              {/* Summary Items */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold">{formatCurrency(cartTotal)}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <div>
                    <span className="font-medium">Shipping</span>
                    {shippingCost === 0 && (
                      <span className="ml-2 text-xs bg-amber-100 text-[#CA993B] px-2 py-1 rounded">
                        FREE
                      </span>
                    )}
                  </div>
                  <span
                    className={`font-bold ${
                      shippingCost === 0 ? "text-[#CA993B]" : ""
                    }`}
                  >
                    {shippingCost === 0 ? "FREE" : formatCurrency(shippingCost)}
                  </span>
                </div>

                {shippingCost > 0 && cartTotal < 5000 && (
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                    <p className="text-sm text-amber-700">
                      Add {formatCurrency(5000 - cartTotal)} more for{" "}
                      <span className="font-bold">FREE shipping</span>!
                    </p>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-6 mb-8">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-[#CA993B] text-2xl">
                    {formatCurrency(total)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Including all taxes
                </p>
              </div>

              {/* Checkout Button */}
              <Button
                fullWidth
                size="lg"
                onClick={() => onNavigate("checkout")}
                className="bg-linear-to-r from-[#CA993B] to-amber-600 hover:from-[#B8852F] hover:to-amber-700 shadow-lg hover:shadow-xl transition-all"
              >
                Proceed to Checkout
              </Button>

              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-[#CA993B]/10 rounded-full mb-2">
                      <Truck className="h-5 w-5 text-[#CA993B]" />
                    </div>
                    <p className="text-xs font-medium text-gray-700">
                      Free Shipping
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-[#CA993B]/10 rounded-full mb-2">
                      <Shield className="h-5 w-5 text-[#CA993B]" />
                    </div>
                    <p className="text-xs font-medium text-gray-700">
                      Secure Checkout
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-[#CA993B]/10 rounded-full mb-2">
                      <Package className="h-5 w-5 text-[#CA993B]" />
                    </div>
                    <p className="text-xs font-medium text-gray-700">
                      Fresh Quality
                    </p>
                  </div>
                </div>
              </div>

              {/* Continue Shopping */}
              <button
                onClick={() => onNavigate("/products")}
                className="w-full text-center mt-8 pt-6 border-t border-gray-200 text-gray-600 hover:text-[#CA993B] font-medium transition flex items-center justify-center group"
              >
                <svg
                  className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  />
                </svg>
                Continue Shopping
              </button>
            </Card>
          </div>
        </div>

        {/* Cart Tips Section */}
        <Card className="mt-12 bg-linear-to-r from-amber-50 to-gray-50 border border-amber-100">
          <div className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <svg
                className="h-5 w-5 mr-2 text-[#CA993B]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Tips for Your Ponmo Purchase
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <div className="shrink-0">
                  <div className="w-8 h-8 bg-[#CA993B]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#CA993B] font-bold">1</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Mix & Match</p>
                  <p className="text-sm text-gray-600">
                    Combine different cuts for variety
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="shrink-0">
                  <div className="w-8 h-8 bg-[#CA993B]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#CA993B] font-bold">2</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Bulk Savings</p>
                  <p className="text-sm text-gray-600">
                    Order 5+ units for wholesale pricing
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="shrink-0">
                  <div className="w-8 h-8 bg-[#CA993B]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#CA993B] font-bold">3</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Fresh Delivery</p>
                  <p className="text-sm text-gray-600">
                    Vacuum-sealed for maximum freshness
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
