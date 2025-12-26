import { useState } from "react";
import { CreditCard, MapPin, Package } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { useCart } from "../contexts/useCart";
import { useAuth } from "../contexts/useAuth";
import { supabase } from "../lib/supabase";
import { formatCurrency } from "../lib/utils";

export default function CheckoutPage({ onNavigate }) {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
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

  if (cart.length === 0) {
    onNavigate("cart");
    return null;
  }

  const shippingCost = 2000;
  const total = cartTotal + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setProcessing(true);

    try {
      if (!user) throw new Error("Must be logged in to checkout");

      const orderNumber = `ADH${Date.now()}`;

      // const verifyPayment = async (reference, orderId) => {
      //   const res = await fetch("/api/paystack/verify", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ reference, orderId }),
      //   });

      //   const data = await res.json();

      //   if (!data.success) {
      //     setError("Payment verification failed");
      //     return;
      //   }

      //   await clearCart();
      //   onNavigate("order-confirmation");
      // };

      // const payWithPaystack = (order) => {
      //   const handler = window.PaystackPop.setup({
      //     key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      //     email: user.email,
      //     amount: order.total * 100, // kobo
      //     ref: order.order_number,

      //     onSuccess: (response) => {
      //       verifyPayment(response.reference, order.id);
      //     },

      //     onClose: () => {
      //       setError("Payment was cancelled. Order is still pending.");
      //     },
      //   });

      //   handler.openIframe();
      // };

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          user_id: user.id,
          order_type: "retail",
          status: "pending",
          subtotal: cartTotal,
          shipping_cost: shippingCost,
          total: total,
          shipping_address: shippingInfo,
          payment_method: paymentMethod,
          payment_status: "pending",
        })
        .select()
        .single();
      // if (paymentMethod === "card") {
      //   payWithPaystack(order);
      //   return; // stop here, don't redirect yet
      // }

      if (orderError) throw orderError;

      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.retail_price,
        total_price: item.product.retail_price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      for (const item of cart) {
        const { error: stockError } = await supabase
          .from("products")
          .update({
            stock_quantity: item.product.stock_quantity - item.quantity,
          })
          .eq("id", item.product_id);

        if (stockError) throw stockError;
      }

      await clearCart();

      onNavigate("order-confirmation", {
        orderId: order.id,
        orderNumber: order.order_number,
      });
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Failed to process order");
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
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    {paymentMethod === "bank_transfer" &&
                      "Bank details will be provided after order confirmation."}
                    {paymentMethod === "card" &&
                      "You will be redirected to our secure payment gateway."}
                    {paymentMethod === "cash_on_delivery" &&
                      "Pay when your order is delivered to you."}
                  </p>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <div className="flex items-center space-x-2 mb-6">
                  <Package className="h-6 w-6 text-[#CA993B]" />
                  <h2 className="text-2xl font-bold">Order Summary</h2>
                </div>

                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(
                          item.product.retail_price * item.quantity
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(cartTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {formatCurrency(shippingCost)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
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
