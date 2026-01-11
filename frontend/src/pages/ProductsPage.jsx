import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { useAuth } from "../contexts/useAuth";
import { supabase } from "../lib/supabase";
import { formatCurrency } from "../lib/utils";

export default function ProductsPage({ onNavigate }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const { isWholesaleApproved } = useAuth();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, gradeFilter, sortBy]);

  const loadProducts = async () => {
    try {
      // Fetch active products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;

      // Extract product IDs
      const productIds = productsData.map((p) => p.id);

      // Fetch wholesale prices for those products
      let wholesaleData = [];

      if (isWholesaleApproved) {
        const { data, error } = await supabase
          .from("wholesale_pricing")
          .select("*")
          .in("product_id", productIds);

        if (error) throw error;
        wholesaleData = data || [];
      }

      // if (wholesaleError) throw wholesaleError;

      // Attach wholesale pricing to each product
      const productsWithWholesale = productsData.map((product) => ({
        ...product,
        wholesale_pricing: isWholesaleApproved
          ? wholesaleData.filter((w) => w.product_id === product.id)
          : [],
      }));

      setProducts(productsWithWholesale);
    } catch (error) {
      console.error("Error loading products and wholesale pricing:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (gradeFilter !== "all") {
      filtered = filtered.filter((product) => product.grade === gradeFilter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.retail_price - b.retail_price;
        case "price-high":
          return b.retail_price - a.retail_price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  };

  const uniqueGrades = Array.from(new Set(products.map((p) => p.grade)));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-vibes">
            Our Products
          </h1>
          <p className="text-gray-600 text-lg">
            Browse our selection of premium quality dried cow skin
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              options={[
                { value: "all", label: "All Grades" },
                ...uniqueGrades.map((grade) => ({
                  value: grade,
                  label: grade,
                })),
              ]}
            />

            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: "name", label: "Sort by Name" },
                { value: "price-low", label: "Price: Low to High" },
                { value: "price-high", label: "Price: High to Low" },
              ]}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} padding="none" className="animate-pulse ">
                <div className="bg-gray-300 h-64 rounded-t-xl" />
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2" />
                  <div className="h-4 bg-gray-300 rounded w-2/3" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="mb-4 text-gray-600">
              Showing {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const images = product.images || [];
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
                    className="cursor-pointer overflow-hidden group bg-white rounded-xl border border-gray-200 hover:border-[#CA993B] transition-all duration-300 shadow-sm hover:shadow-lg"
                    onClick={() => {
                      console.log("CLICKED PRODUCT:", product.id);
                      onNavigate("product-detail", { productId: product.id });
                    }}
                  >
                    {/* Top ribbon for important badges */}
                    <div className="absolute top-2 left-2 z-10 flex gap-1">
                      <span className="px-2 py-1 bg-[#CA993B] text-white text-xs font-bold rounded-full shadow">
                        {product.drying_method || "SUN-DRIED"}
                      </span>
                      {product.is_fresh && (
                        <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow">
                          FRESH
                        </span>
                      )}
                    </div>

                    {/* Image with texture focus - FIXED: bg-gradient-to-br */}
                    <div className="aspect-square overflow-hidden relative bg-linear-to-br from-amber-50 to-gray-100">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Overlay showing texture detail - FIXED: bg-gradient-to-t */}
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
                      {/* Product name with cut type */}
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
                          {/* Wholesale pricing section */}
                          {isWholesaleApproved &&
                            product.wholesale_pricing.length > 0 && (
                              <div className="mt-2">
                                <h4 className="font-semibold text-sm mb-1">
                                  Wholesale Pricing:
                                </h4>
                                <ul className="text-xs text-gray-700">
                                  {product.wholesale_pricing.map(
                                    ({
                                      id,
                                      min_quantity,
                                      max_quantity,
                                      price_per_unit,
                                    }) => (
                                      <li key={id}>
                                        {min_quantity} - {max_quantity} units: ₦
                                        {price_per_unit.toFixed(2)} per unit
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          {console.log(
                            "Wholesale approved?",
                            isWholesaleApproved,
                            "min qty:",
                            product.min_wholesale_quantity
                          )}

                          {!isWholesaleApproved &&
                            product.min_wholesale_quantity > 1 && (
                              <p className="text-xs text-gray-500 mt-2">
                                Wholesale pricing available for approved
                                partners
                              </p>
                            )}

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
          </>
        ) : (
          <div className="text-center py-16">
            <SlidersHorizontal className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
