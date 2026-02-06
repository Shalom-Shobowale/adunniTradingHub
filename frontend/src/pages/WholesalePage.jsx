import { useState } from "react";
import {
  Package,
  TrendingDown,
  Clock,
  CheckCircle,
  Truck,
  Utensils,
  PartyPopper,
  ShoppingCart,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/useAuth";
import { API_BASE_URL } from "../config/api";
import { WHOLESALE_BAG_PERKS } from "../lib/wholesalePerks";

export default function WholesalePage({ onNavigate }) {
  const { user, isWholesale, isWholesaleApproved } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [quoteData, setQuoteData] = useState({
    company_name: "",
    email: "",
    phone: "",
    estimated_quantity: "",
    message: "",
  });

  const handleChange = (field, value) => {
    setQuoteData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { error: quoteError } = await supabase
        .from("wholesale_quotes")
        .insert({
          user_id: user?.id || null,
          company_name: quoteData.company_name,
          email: quoteData.email,
          phone: quoteData.phone,
          product_details: { message: quoteData.message },
          estimated_quantity: parseInt(quoteData.estimated_quantity),
          message: quoteData.message,
          status: "pending",
        });

      if (quoteError) throw quoteError;

      // Send email via API route
      const res = await fetch(`${API_BASE_URL}/sendWholesaleEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quoteData),
      });

      if (!res.ok) throw new Error("Failed to send email");

      setSuccess(true);
      setQuoteData({
        company_name: "",
        email: "",
        phone: "",
        estimated_quantity: "",
        message: "",
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit quote request",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <TrendingDown className="h-8 w-8 text-white" />,
      title: "Trade Pricing on Bulk Orders",
      description:
        "Access special pricing when buying in bags, designed for businesses that order regularly.",
    },
    {
      icon: <Package className="h-8 w-8 text-white" />,
      title: "Discounted Delivery Fees",
      description:
        "Approved wholesale partners enjoy reduced delivery costs on bulk orders.",
    },
    {
      icon: <Clock className="h-8 w-8 text-white" />,
      title: "Free Bonus Quantity",
      description:
        "Get extra cow skin added to your order when you buy more bags.",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-white" />,
      title: "Priority Processing & Support",
      description:
        "Wholesale orders are processed faster with dedicated trade support.",
    },
  ];

  const pricingTiers = [
    { range: "100 - 200 dozen", discount: "10% off" },
    { range: "201 - 300 dozen", discount: "15% off" },
    { range: "301 - 400 dozen", discount: "20% off" },
    { range: "401+ dozen", discount: "Custom pricing" },
  ];

  const contactInfo = [
    { label: "Email", value: "adunnitradehub@gmail.com", type: "email" },
    {
      label: "Phone",
      value: ["+2348023546947", "+2347066898121"],
      type: "phone",
    },
    { label: "Business Hours", value: "Mon - Sat, 9AM - 6PM", type: "text" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-[url('/bg.png')] bg-no-repeat bg-center bg-cover text-white h-[50vh] flex flex-col justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-vibes">
          Wholesale & Trade Orders
        </h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto">
          For restaurants, caterers, food vendors, and bulk buyers who need
          consistent supply, better pricing, and priority service.
        </p>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-vibes">
              Why Choose Our Wholesale Program?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((b, i) => (
              <Card key={i} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-[#CA993B] bg-opacity-10 p-4 rounded-full">
                    {b.icon}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{b.title}</h3>
                <p className="text-gray-600">{b.description}</p>
              </Card>
            ))}
          </div>
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 font-vibes">
                Who Our Wholesale Program Is For
              </h2>
              <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
                Designed for businesses that buy regularly or in large
                quantities.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  {
                    title: "Restaurants & Hotels",
                    desc: "Premium quality with bulk pricing",
                    icon: <Utensils className="h-6 w-6" />,
                    bg: "bg-gradient-to-br from-orange-500/5 to-amber-500/5",
                  },
                  {
                    title: "Caterers & Event Planners",
                    desc: "Flexible orders for large events",
                    icon: <PartyPopper className="h-6 w-6" />,
                    bg: "bg-gradient-to-br from-amber-500/5 to-amber-500/5",
                  },
                  {
                    title: "Food Vendors & Market Sellers",
                    desc: "Daily supply with competitive rates",
                    icon: <ShoppingCart className="h-6 w-6" />,
                    bg: "bg-gradient-to-br from-orange-500/5 to-amber-500/5",
                  },
                  {
                    title: "Distributors & Resellers",
                    desc: "Exclusive terms for B2B partners",
                    icon: <Truck className="h-6 w-6" />,
                    bg: "bg-gradient-to-br from-orange-500/5 to-amber-500/5",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`group p-6 rounded-xl border border-gray-200/50 backdrop-blur-sm ${item.bg} hover:border-[#CA993B]/30 hover:bg-white/50 transition-all duration-300`}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-2.5 rounded-lg bg-white/70 border border-gray-200/50 group-hover:scale-110 transition-transform duration-300">
                        <div className="text-gray-700">{item.icon}</div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1.5">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {isWholesale && !isWholesaleApproved && (
            <Card className="bg-yellow-50 border border-yellow-200 text-yellow-800 mb-8">
              <p className="font-medium">Wholesale Application Under Review</p>
              <p className="text-sm mt-1">
                Once approved, you’ll gain access to trade pricing, discounted
                delivery, and bonus quantities.
              </p>
            </Card>
          )}

          {isWholesaleApproved && (
            <div className="mb-8 overflow-hidden rounded-lg border border-green-200 bg-white shadow-sm">
              <div className="px-4 py-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 mr-2">
                      Approved
                    </span>
                    <span className="text-sm text-gray-700">
                      Your wholesale account is active with bulk pricing &
                      delivery discounts
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => onNavigate("/products")}
                  >
                    Shop Wholesale
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="h-fit">
              <h2 className="text-3xl font-bold mb-6 font-vibes">
                Request Trade Pricing
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                For distributors, restaurants, and bulk buyers who require large
                or recurring orders.
              </p>
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                  Quote request submitted successfully!
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                {["company_name", "email", "phone", "estimated_quantity"].map(
                  (field, i) => (
                    <Input
                      key={i}
                      label={field.replace("_", " ").toUpperCase()}
                      type={
                        field === "email"
                          ? "email"
                          : field === "phone"
                            ? "tel"
                            : field === "estimated_quantity"
                              ? "number"
                              : "text"
                      }
                      required
                      value={quoteData[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                    />
                  ),
                )}
                <Textarea
                  label="Additional Information"
                  value={quoteData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Tell us about your requirements..."
                />
                <Button type="submit" fullWidth disabled={submitting}>
                  {submitting ? "Submitting..." : "Request Trade Quote"}
                </Button>
              </form>
            </Card>

            <div className="space-y-6">
              <Card>
                <h3 className="text-3xl font-bold mb-4 font-vibes">
                  Automatic Volume Discounts
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  These discounts apply to all customers and are based on order
                  quantity.
                </p>

                <div className="space-y-3">
                  {pricingTiers.map((tier, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium">{tier.range}</span>
                      <span className="text-[#CA993B] font-bold">
                        {tier.discount}
                      </span>
                    </div>
                  ))}
                </div>
                <Card className="mt-6">
                  <h3 className="text-3xl font-bold mb-4 font-vibes">
                    Wholesale Bag Perks
                  </h3>

                  <p className="text-sm text-gray-600 mb-3">
                    {isWholesaleApproved
                      ? "These perks apply automatically to your wholesale orders."
                      : "Apply for a wholesale account to unlock these perks on bulk orders."}
                  </p>

                  <div className="space-y-3">
                    {WHOLESALE_BAG_PERKS.map((perk, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium">{perk.label}</span>
                        <span className="text-[#CA993B] font-bold">
                          {perk.deliveryDiscount}% delivery discount
                          {perk.freeDozen > 0 &&
                            ` + ${perk.freeDozen} dozen free cow skin`}
                        </span>
                      </div>
                    ))}
                  </div>

                  {!isWholesaleApproved && (
                    <p className="text-sm text-gray-600 mt-4">
                      <strong>
                        Wholesale partners receive additional benefits
                      </strong>{" "}
                      such as discounted delivery fees, free bonus quantities on
                      bag orders, and priority service.
                    </p>
                  )}
                </Card>
              </Card>

              <Card>
                <h3 className="text-3xl font-bold mb-4 font-vibes ">
                  Contact Information
                </h3>
                <div className="space-y-3 text-gray-700 ">
                  {contactInfo.map((info, i) => (
                    <p key={i}>
                      <strong>{info.label}:</strong>{" "}
                      {info.type === "email" && (
                        <a href={`mailto:${info.value}`}>{info.value}</a>
                      )}
                      {info.type === "phone" &&
                        info.value.map((num, idx) => (
                          <span key={idx}>
                            <a href={`tel:${num}`}>{num}</a>
                            {idx === 0 && ", "}
                          </span>
                        ))}
                      {info.type === "text" && info.value}
                    </p>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
