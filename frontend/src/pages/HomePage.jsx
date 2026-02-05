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
                onClick={() => navigate("/products")}
              >
                Shop Retail
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/wholesale")}
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
                const DOZEN_SIZE = 12;
                const BAG_SIZE = 10 * DOZEN_SIZE;

                const images = product.images || [];
                const imageUrl =
                  Array.isArray(images) && images.length > 0
                    ? typeof images[0] === "string"
                      ? images[0]
                      : images[0]?.url
                    : "https://images.pexels.com/photos/4113773/pexels-photo-4113773.jpeg";

                // Determine price per dozen
                const dozenPrice = product.retail_price * DOZEN_SIZE;

                return (
                  <Card
                    key={product.id}
                    hover
                    padding="none"
                    className="cursor-pointer overflow-hidden group bg-white rounded-xl border border-gray-200 hover:border-[#CA993B] transition-all duration-300 shadow-sm hover:shadow-lg"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {/* Image + rating */}
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Rating */}
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        ⭐ {product.rating || "4.5"} (
                        {product.review_count || 0})
                      </div>
                    </div>

                    {/* Card content */}
                    <div className="p-4">
                      {/* Name */}
                      <h3 className="font-bold text-gray-900 text-sm mb-1">
                        {product.name}
                      </h3>

                      {/* Sold in */}
                      <p className="text-xs text-gray-500 mb-2">
                        Sold in{" "}
                        {isWholesaleApproved
                          ? "bags (10 dozen)"
                          : "dozens (12 units)"}
                      </p>

                      {/* Price */}
                      <div className="mb-2">
                        <span className="text-lg font-bold text-[#CA993B]">
                          {formatCurrency(dozenPrice)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          / dozen
                        </span>
                      </div>

                      {/* Tags */}
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
            <Button size="lg" onClick={() => navigate("/products")}>
              View All Products
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
              <Button onClick={() => navigate("/about")}>
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
