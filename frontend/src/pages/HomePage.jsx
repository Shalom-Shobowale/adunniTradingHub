import { useEffect, useState } from "react";
import { ArrowRight, Package, Shield, Truck, Star } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { supabase } from "../lib/supabase";
import { formatCurrency } from "../lib/utils";
import Section from "../components/Section";

export default function HomePage({ onNavigate }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
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
      <section className="relative bg-linear-to-br from-gray-900 via-gray-800 to-black text-white py-20 md:py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-35" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-vibes">
              Affordable Quality{" "}
              <span className="text-[#CA993B]">Dried Cow Skin</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed">
              Your trusted supplier for retail and wholesale orders. We deliver
              excellence in every package.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                variant="primary"
                onClick={() => onNavigate("products")}
              >
                Shop Retail
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate("wholesale")}
                className="border-white text-white hover:bg-white hover:text-[#CA993B]!"
              >
                Wholesale Orders
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? "bg-[#CA993B] scale-125"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
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
                const images = product.images;
                const imageUrl =
                  Array.isArray(images) && images.length > 0
                    ? typeof images[0] === "string"
                      ? images[0]
                      : images[0]?.url
                    : "https://images.pexels.com/photos/4113773/pexels-photo-4113773.jpeg";

                return (
                  <Card
                    key={product.id}
                    hover
                    padding="none"
                    className="cursor-pointer overflow-hidden group bg-white rounded-xl border border-gray-200 hover:border-amber-300 transition-all duration-300 shadow-sm hover:shadow-lg"
                    onClick={() =>
                      onNavigate("product-detail", { productId: product.id })
                    }
                  >
                    {/* Top ribbon for important badges */}
                    <div className="absolute top-2 left-2 z-10 flex gap-1">
                      <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow">
                        {product.drying_method || "SUN-DRIED"}
                      </span>
                      {product.is_fresh && (
                        <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow">
                          FRESH
                        </span>
                      )}
                    </div>

                    {/* Image with texture focus */}
                    <div className="aspect-square overflow-hidden relative bg-linear-to-br from-amber-50 to-gray-100">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Overlay showing texture detail */}
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-black/70 via-black/40 to-transparent pointer-events-none">
                        <div className="absolute bottom-2 left-3 flex items-center text-white">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-bold">
                            {product.rating || "4.5"}
                          </span>
                          <span className="text-xs text-gray-300 ml-1">
                            ({product.review_count || "0"})
                          </span>
                        </div>
                      </div>

                      {/* Quick view button on hover */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors">
                          <svg
                            className="w-4 h-4 text-gray-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Content area */}
                    <div className="p-3">
                      {/* Product name with cut type - FIXED text-2xl to text-sm */}
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-1 flex-1">
                          {product.name}
                        </h3>
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded ml-2">
                          {product.cut_type || "STRIPS"}
                        </span>
                      </div>

                      {/* Quality tags */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="text-xs px-2 py-1 text-[#CA993B] border border-[#CA993B] rounded">
                          ✓ {product.cleanliness || "HAIRLESS"}
                        </span>
                        <span className="text-xs px-2 py-1 text-[#CA993B] border rounded">
                          WELL-CURED
                        </span>
                        <span className="text-xs px-2 py-1 text-[#CA993B] border border-[#CA993B] rounded">
                          {product.prep_time || "READY IN 15MIN"}
                        </span>
                      </div>

                      {/* Main info row */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        {/* Weight and texture */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <svg
                              className="w-3 h-3 text-gray-500 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-xs text-gray-700 font-medium">
                              {product.weight_per_unit}kg
                            </span>
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-3 h-3 text-gray-500 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                              <path
                                fillRule="evenodd"
                                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-xs text-gray-700">
                              {product.texture || "BUBBLY"}
                            </span>
                          </div>
                        </div>

                        {/* Price and CTA */}
                        <div className="text-right">
                          <div className="flex items-baseline">
                            <span className="text-lg font-bold text-[#CA993B]">
                              {formatCurrency(product.retail_price)}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              /unit
                            </span>
                          </div>
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
                        </div>
                      </div>

                      {/* Subtle preparation hint */}
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
            <Button size="lg" onClick={() => onNavigate("products")}>
              View All Products
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-vibes">
                About Adunni Trading Hub
              </h2>
              <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                We are a leading supplier of premium quality dried cow skin in
                Nigeria. With years of experience in the industry, we have built
                a reputation for excellence and reliability.
              </p>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Whether you're a retail customer or a wholesale buyer, we offer
                competitive prices, consistent quality, and exceptional customer
                service.
              </p>
              <Button onClick={() => onNavigate("about")}>
                Learn More About Us
              </Button>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/5466808/pexels-photo-5466808.jpeg"
                alt="About Adunni Trading Hub"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-vibes">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 text-lg">
              Don't just take our word for it
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-[#CA993B] fill-[#CA993B]"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  "{testimonial.comment}"
                </p>
                <p className="font-bold text-gray-900">{testimonial.name}</p>
              </Card>
            ))}
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
            onClick={() => onNavigate("wholesale")}
          >
            Request Wholesale Quote
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
