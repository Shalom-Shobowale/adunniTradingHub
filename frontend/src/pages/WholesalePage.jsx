import { useState } from "react";
import { Package, TrendingDown, Clock, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/useAuth";
import { API_BASE_URL } from "../config/api"

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
        err instanceof Error ? err.message : "Failed to submit quote request"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <TrendingDown className="h-8 w-8 text-white" />,
      title: "Competitive Pricing",
      description: "Get special bulk discounts on large orders.",
    },
    {
      icon: <Package className="h-8 w-8 text-white" />,
      title: "Consistent Supply",
      description: "Reliable inventory and consistent product quality.",
    },
    {
      icon: <Clock className="h-8 w-8 text-white" />,
      title: "Priority Service",
      description: "Dedicated account manager and faster processing.",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-white" />,
      title: "Flexible Terms",
      description: "Customized payment terms and delivery schedules.",
    },
  ];

  const pricingTiers = [
    { range: "5 - 20 units", discount: "10% off" },
    { range: "21 - 50 units", discount: "15% off" },
    { range: "51 - 100 units", discount: "20% off" },
    { range: "100+ units", discount: "Custom pricing" },
  ];

  const contactInfo = [
    { label: "Email", value: "adunnitradehub@gmail.com", type: "email" },
    {
      label: "Phone",
      value: ["+2348023546947", "+2347066898121"],
      type: "phone",
    },
    { label: "Business Hours", value: "Mon - Fri, 9AM - 6PM", type: "text" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-[url('/bg.png')] bg-no-repeat bg-center bg-cover text-white h-[50vh] flex flex-col justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-vibes">
          Wholesale Solutions
        </h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto">
          Partner with Adunni Trading Hub for competitive wholesale pricing and
          reliable supply
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

          {isWholesale && !isWholesaleApproved && (
            <Card className="bg-yellow-50 border border-yellow-200 text-yellow-800 mb-8">
              <p className="font-medium">
                Your wholesale account is pending approval.
              </p>
              <p className="text-sm mt-1">We'll notify you once approved.</p>
            </Card>
          )}

          {isWholesaleApproved && (
            <Card className="bg-green-50 border border-green-200 text-green-800 mb-8 text-center">
              <p className="font-medium">
                Your wholesale account is approved! Browse products to see
                wholesale pricing.
              </p>
              <Button className="mt-4" onClick={() => onNavigate("products")}>
                View Products
              </Button>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <h2 className="text-3xl font-bold mb-6 font-vibes">
                Request a Quote
              </h2>
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
                  )
                )}
                <Textarea
                  label="Additional Information"
                  value={quoteData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Tell us about your requirements..."
                />
                <Button type="submit" fullWidth disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Quote Request"}
                </Button>
              </form>
            </Card>

            <div className="space-y-6">
              <Card>
                <h3 className="text-3xl font-bold mb-4 font-vibes">
                  Wholesale Pricing Tiers
                </h3>
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
              </Card>

              <Card>
                <h3 className="text-3xl font-bold mb-4 font-vibes ">
                  Contact Information
                </h3>
                <div className="space-y-3 text-gray-700">
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
