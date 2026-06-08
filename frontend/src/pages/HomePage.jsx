import { useEffect, useState } from "react";
import { ArrowRight, Package, Shield, Truck, Star } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { supabase } from "../lib/supabase";
import { formatCurrency } from "../lib/utils";
import Section from "../components/Section";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { isWholesaleApproved } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("featured", true)
        .eq("active", true)
        .limit(4);

      if (error) throw error;
      setFeaturedProducts(data || []);
    } catch (error) {
      console.error("Error loading featured products:", error);
    } finally {
      setLoading(false);
    }
  };

  const backgroundImages = [
    "/img1.jpg",
    "/pics4.jpg",
    "/pics3.jpg",
    "/pics2.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const testimonials = [
    {
      name: "Adebayo Johnson",
      rating: 5,
      comment:
        "Excellent quality dried cow skin! I have been ordering from Adunni Trading Hub for over a year now and the quality is always consistent.",
    },
    {
      name: "Fatima Ahmed",
      rating: 5,
      comment:
        "Best wholesale supplier in Lagos. Great prices for bulk orders and fast delivery. Highly recommended for restaurant owners.",
    },
    {
      name: "Chidi Okonkwo",
      rating: 5,
      comment:
        "Premium quality products and professional service. Their customer support team is always helpful and responsive.",
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-linear-to-br from-gray-950 via-gray-900 to-black">
        <div className="absolute inset-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-out ${
                index === currentImageIndex
                  ? "opacity-100 scale-105"
                  : "opacity-0 scale-100"
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
       
          <div className="absolute inset-0 bg-linear-to-r from-gray-950/90 via-gray-950/70 to-gray-950/40" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
          
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CA993B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CA993B]"></span>
              </span>
              <span className="text-xs font-medium text-white/80 tracking-wide">
                Trusted Quality Since 2015
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl lg:text-6xl font-bold mb-6 leading-[1.1] text-white font-vibes">
              Affordable Quality{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#CA993B] to-[#E8B85A]">
                Dried Cow Skin
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
              Your trusted supplier for retail and wholesale orders. We deliver
              excellence in every package, nationwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate("/products")}
                className="group bg-linear-to-r from-[#CA993B] to-[#B8872F] hover:from-[#B8872F] hover:to-[#9A7325] text-white shadow-lg shadow-[#CA993B]/20 hover:shadow-xl hover:shadow-[#CA993B]/30 transition-all duration-300"
              >
                Shop Retail
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/wholesale")}
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
              >
                Wholesale Orders
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-[#CA993B]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-400">50+ Happy Clients</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-[#CA993B]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-400">
                  Trusted Quality Guaranteed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-[#CA993B]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-400">Same Day Dispatch</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              className={`transition-all duration-300 rounded-full ${
                index === currentImageIndex
                  ? "w-8 h-1.5 bg-[#CA993B]"
                  : "w-4 h-1.5 bg-white/30 hover:bg-white/50"
              }`}
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="absolute bottom-8 right-8 hidden md:block">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-400 tracking-wider uppercase">
              Scroll
            </span>
            <div className="w-px h-12 bg-linear-to-b from-[#CA993B] to-transparent" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-[#CA993B] bg-opacity-10 p-4 rounded-full">
                  <Package className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Carefully selected and processed dried cow skin that meets the
                highest standards.
              </p>
            </Card>

            <Card className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-[#CA993B] bg-opacity-10 p-4 rounded-full">
                  <Truck className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable delivery service across Nigeria for all your
                orders.
              </p>
            </Card>

            <Card className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-[#CA993B] bg-opacity-10 p-4 rounded-full">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Trusted Supplier</h3>
              <p className="text-gray-600">
                Serving both retail and wholesale customers with dedication to
                excellence.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Section />

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-vibes mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 text-lg">
              Discover our premium selection of dried cow skin
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-300 rounded mb-2" />
                  <div className="h-4 bg-gray-300 rounded w-2/3" />
                </Card>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => {
                const DOZEN_SIZE = 12;
                const BAG_SIZE = 10 * DOZEN_SIZE;

                const images = product.images || [];
                const imageUrl =
                  Array.isArray(images) && images.length > 0
                    ? typeof images[0] === "string"
                      ? images[0]
                      : images[0]?.url
                    : "https://images.pexels.com/photos/4113773/pexels-photo-4113773.jpeg";

                const dozenPrice = product.retail_price * DOZEN_SIZE;

                return (
                  <Card
                    key={product.id}
                    hover
                    padding="none"
                    className="cursor-pointer overflow-hidden group bg-white rounded-xl border border-gray-200 hover:border-[#CA993B] transition-all duration-300 shadow-sm hover:shadow-lg"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >

                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        ⭐ {product.rating || "4.5"} (
                        {product.review_count || 0})
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-sm mb-1">
                        {product.name}
                      </h3>

                      <p className="text-xs text-gray-500 mb-2">
                        Sold in{" "}
                        {isWholesaleApproved
                          ? "bags (10 dozen)"
                          : "dozens (12 units)"}
                      </p>

                      <div className="mb-2">
                        <span className="text-lg font-bold text-[#CA993B]">
                          {formatCurrency(dozenPrice)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          / dozen
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="text-xs px-2 py-1 border border-[#CA993B] text-[#CA993B] rounded">
                          ✓ {product.cleanliness || "HAIRLESS"}
                        </span>
                        <span className="text-xs px-2 py-1 border border-[#CA993B] text-[#CA993B] rounded">
                          WELL-CURED
                        </span>
                        <span className="text-xs px-2 py-1 border border-[#CA993B] text-[#CA993B] rounded">
                          {product.prep_time || "READY IN 15MIN"}
                        </span>
                      </div>

                      {/* {!isWholesaleApproved &&
                        product.min_wholesale_quantity > 1 && (
                          <p className="text-xs text-gray-500 mt-2">
                            Wholesale pricing available for approved partners
                          </p>
                        )} */}

                      {/* Dynamic stock status */}
                      <div
                        className={`text-xs font-semibold mt-0.5 flex items-center justify-end ${
                          product.stock_quantity > 10
                            ? "text-[#CA993B]"
                            : product.stock_quantity > 0
                              ? "text-[#CA993B]"
                              : "text-[#CA993B]"
                        }`}
                      >
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {product.stock_quantity > 10
                          ? "IN STOCK"
                          : product.stock_quantity > 0
                            ? "LOW STOCK"
                            : "OUT OF STOCK"}
                      </div>

                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center text-gray-500">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-xs">
                            {product.best_for || "Perfect for soups & stews"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No featured products available at the moment.
              </p>
            </div>
          )}

          <div className="text-center mt-8">
            <Button size="lg" onClick={() => navigate("/products")}>
              View All Products
            </Button>
          </div>
        </div>
      </section>

      <section className=" bg-white my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#CA993B]/10 border border-[#CA993B]/20 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CA993B] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CA993B]"></span>
                </span>
                <span className="text-xs font-medium text-[#CA993B] tracking-wide">
                  Our Story
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight font-vibes">
                About{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#CA993B] to-[#E8B85A]">
                  Adunni Trading Hub
                </span>
              </h2>

              <div className="space-y-4 mb-8">
                <p className="text-gray-600 text-lg leading-relaxed">
                  We are a leading supplier of premium quality dried cow skin in
                  Nigeria. With years of experience in the industry, we have
                  built a reputation for excellence and reliability.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Whether you're a retail customer or a wholesale buyer, we
                  offer competitive prices, consistent quality, and exceptional
                  customer service to meet your needs.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 rounded-xl bg-gray-50">
                  <div className="text-2xl font-bold text-[#CA993B]">500+</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Happy Clients
                  </div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gray-50">
                  <div className="text-2xl font-bold text-[#CA993B]">5+</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Years Experience
                  </div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gray-50">
                  <div className="text-2xl font-bold text-[#CA993B]">24/7</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Customer Support
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate("/about")}
                className="group bg-linear-to-r from-[#CA993B] to-[#B8872F] hover:from-[#B8872F] hover:to-[#9A7325] text-white shadow-lg shadow-[#CA993B]/20 hover:shadow-xl hover:shadow-[#CA993B]/30 transition-all duration-300"
              >
                Learn More About Us
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.pexels.com/photos/5466808/pexels-photo-5466808.jpeg"
                    alt="About Adunni Trading Hub"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-linear-to-br from-[#CA993B]/20 to-transparent rounded-2xl -z-10" />
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-linear-to-tr from-[#CA993B]/10 to-transparent rounded-full -z-10" />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-3 backdrop-blur-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#CA993B]/10 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-[#CA993B]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        Premium Quality
                      </div>
                      <div className="text-xs text-gray-500">
                        Certified Supplier
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#CA993B]/10 border border-[#CA993B]/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CA993B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CA993B]"></span>
              </span>
              <span className="text-xs font-medium text-[#CA993B] tracking-wide">
                Testimonials
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight font-vibes">
              What Our{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#CA993B] to-[#E8B85A]">
                Customers Say
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it — hear from our satisfied
              customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#CA993B]/20"
              >
          
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <svg
                    className="w-12 h-12 text-gray-900"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                <div className="flex gap-1 mb-6 relative">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-[#CA993B] fill-[#CA993B]"
                    />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
                  "{testimonial.comment}"
                </p>

                <div className="pt-4 border-t border-gray-100">
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {testimonial.role || "Verified Customer"}
                  </p>
                </div>

                <div className="absolute bottom-6 right-6">
                  <div className="flex items-center gap-1 text-xs text-[#CA993B]">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-linear-to-br from-[#CA993B]/20 to-[#CA993B]/10 flex items-center justify-center border-2 border-white"
                  >
                    <span className="text-[10px] font-semibold text-[#CA993B]">
                      ✓
                    </span>
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                Trusted by{" "}
                <span className="font-semibold text-gray-900">50+</span> happy
                customers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="py-16 bg-linear-to-r from-[#CA993B] to-[#B8872F] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Bulk Orders?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get special wholesale pricing and dedicated support for your
            business
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => onNavigate("wholesale")}
          >
            Request Wholesale Quote
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section> */}
      <section className="bg-gray-50">
        <div className="flex md:flex-row flex-col justify-between w-[90%] md:w-[80%] md:h-72 mx-auto md:items-center md:mb-0 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-vibes">
              Need Bulk Orders?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get special wholesale pricing and dedicated support for your
              business
            </p>
          </div>
          <Button
            size="lg"
            className="bg-[#CA993B] text-white hover:text-[#CA993B] hover:bg-white"
            onClick={() => navigate("/wholesale")}
          >
            Request Wholesale Quote
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
