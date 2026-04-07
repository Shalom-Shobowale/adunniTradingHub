import { useState, useEffect } from "react";
import { CreditCard, MapPin, Package } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { useCart } from "../contexts/useCart";
import { useAuth } from "../contexts/useAuth";
import { formatCurrency } from "../lib/utils";
import { API_BASE_URL } from "../config/api";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

// console.log("API URL:", `${API_BASE_URL}/orders/create`);

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    cart,
    cartTotal,
    shippingCost,
    total,
    deliveryZone,
    setDeliveryZone,
    clearCart,
  } = useCart();

  const { user } = useAuth();

  const [processing, setProcessing] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [shippingInfo, setShippingInfo] = useState({
    full_name: "",
    phone: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Nigeria",
  });

  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
    "FCT",
  ];

  /* ------------------ OPTIONAL AUTO-ZONE LOGIC ------------------ */
  useEffect(() => {
    if (!shippingInfo.state) return;

    if (shippingInfo.state === "Lagos") {
      if (!deliveryZone) {
        setDeliveryZone("lagos_island"); // ✅ only set if not already chosen
      }
    } else {
      setDeliveryZone("interstate");
    }
  }, [shippingInfo.state, deliveryZone, setDeliveryZone]); // ✅ FIX: added deliveryZone

  // 🚫 No checkout with empty cart
  useEffect(() => {
    if (!justSubmitted && cart.length === 0) {
      navigate("/cart");
    }
  }, [cart.length, navigate, justSubmitted]);

  if (cart.length === 0) return null;

  /* ------------------ SUBMIT ORDER ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (processing) return;

    setError("");
    setProcessing(true);

    try {
      if (!user) throw new Error("You must be logged in to checkout.");

      // ✅ Basic validation
      if (
        !shippingInfo.full_name ||
        !shippingInfo.phone ||
        !shippingInfo.street_address ||
        !shippingInfo.state
      ) {
        throw new Error("Please fill all required fields");
      }

      // ✅ Nigerian phone validation
      const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
      if (!phoneRegex.test(shippingInfo.phone)) {
        throw new Error("Enter a valid Nigerian phone number");
      }

      // ✅ Get auth token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;
      if (!token)
        throw new Error("Authentication expired. Please log in again.");

      // ✅ Safe cart (no price tampering)
      const safeCart = cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));

      const res = await fetch(`${API_BASE_URL}/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          cart: safeCart,
          shippingInfo,
          paymentMethod,
          subtotal: cartTotal,
          shippingCost,
          total,
        }),
      });

      // ✅ Handle bad responses
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create order");
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Order creation failed");
      }

      await clearCart();
      setJustSubmitted(true); // flag to prevent redirect
      navigate("/order-confirmation", {
        state: {
          orderId: data.orderId,
          orderNumber: data.orderNumber,
        },
      });
    } catch (err) {
      setError(err.message || "Failed to process order.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <div className="flex items-center space-x-2 mb-6">
                  <MapPin className="h-6 w-6 text-[#CA993B]" />
                  <h2 className="text-2xl font-bold">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    required
                    value={shippingInfo.full_name}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        full_name: e.target.value,
                      })
                    }
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    required
                    value={shippingInfo.phone}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        phone: e.target.value,
                      })
                    }
                  />

                  <div className="md:col-span-2">
                    <Input
                      label="Street Address"
                      required
                      value={shippingInfo.street_address}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          street_address: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Input
                    label="City"
                    required
                    value={shippingInfo.city}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, city: e.target.value })
                    }
                  />

                  <Select
                    label="State"
                    required
                    value={shippingInfo.state}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        state: e.target.value,
                      })
                    }
                    options={[
                      { value: "", label: "Select State" },
                      ...nigerianStates.map((state) => ({
                        value: state,
                        label: state,
                      })),
                    ]}
                  />

                  <Input
                    label="Postal Code"
                    value={shippingInfo.postal_code}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        postal_code: e.target.value,
                      })
                    }
                  />

                  <Input
                    label="Country"
                    disabled
                    value={shippingInfo.country}
                  />
                </div>
              </Card>

              <Card>
                <div className="flex items-center space-x-2 mb-6">
                  <CreditCard className="h-6 w-6 text-[#CA993B]" />
                  <h2 className="text-2xl font-bold">Payment Method</h2>
                </div>

                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  options={[
                    { value: "bank_transfer", label: "Bank Transfer" },
                    { value: "card", label: "Card Payment" },
                    { value: "cash_on_delivery", label: "Cash on Delivery" },
                  ]}
                />
              </Card>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <div className="flex items-center space-x-2 mb-6">
                  <Package className="h-6 w-6 text-[#CA993B]" />
                  <h2 className="text-2xl font-bold">Order Summary</h2>
                </div>

                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(cartTotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0
                        ? "FREE"
                        : formatCurrency(shippingCost)}
                    </span>
                  </div>

                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#CA993B]">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <Button type="submit" fullWidth size="lg" disabled={processing}>
                  {processing ? "Processing..." : "Place Order"}
                </Button>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
