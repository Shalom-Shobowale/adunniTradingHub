import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { useAuth } from "../contexts/useAuth";
import { supabase } from "../lib/supabase";
import { formatCurrency } from "../lib/utils";
import { useNavigate } from "react-router-dom";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const { isWholesaleApproved } = useAuth();
  const navigate = useNavigate();

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

      const { data, error } = await supabase
        .from("wholesale_pricing")
        .select("*")
        .in("product_id", productIds);

      if (error) throw error;
      wholesaleData = data || [];

      // Attach wholesale pricing to each product
      const productsWithWholesale = productsData.map((product) => ({
        ...product,
        wholesale_pricing: wholesaleData.filter(
          (w) => w.product_id === product.id,
        ),
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
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (gradeFilter !== "all") {
      filtered = filtered.filter((product) => product.grade === gradeFilter);
    }

    filtered.sort((a, b) => {
      const getPrice = (product) => {
        const unitSize =
          product.unit_size || (product.unit_type === "BUNCH" ? 160 : 12);

        return product.retail_price * unitSize;
      };

      switch (sortBy) {
        case "price-low":
          return getPrice(a) - getPrice(b);

        case "price-high":
          return getPrice(b) - getPrice(a);

        case "name":
        default:
          return (a.name || "").localeCompare(b.name || "");
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

                // ✅ FIX: define unit size properly
                const unitSize =
                  product.unit_size ||
                  (product.unit_type === "BUNCH" ? 160 : 12);

                // ✅ FIX: define label properly
                const unitLabel =
                  product.unit_type?.toLowerCase() === "bunch"
                    ? "bunches"
                    : "dozens";

                const displayPrice = product.retail_price * unitSize;

                return (
                  <Card
                    key={product.id}
                    hover
                    padding="none"
                    className="cursor-pointer overflow-hidden group bg-white rounded-xl border border-gray-200 hover:border-[#CA993B] transition-all duration-300 shadow-sm hover:shadow-lg"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {/* Top ribbon */}
                    <div className="absolute top-2 left-2 z-10 flex gap-1">
                      <span className="px-2 py-1 bg-[#CA993B] text-white text-xs font-bold rounded-full shadow">
                        {product.drying_method || "SUN-DRIED"}
                      </span>

                      <span className="px-2 py-1 bg-black/80 text-white text-xs font-bold rounded-full">
                        Sold in {isWholesaleApproved ? "bags" : unitLabel}
                      </span>

                      {product.is_fresh && (
                        <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow">
                          FRESH
                        </span>
                      )}
                    </div>

                    {/* Image */}
                    <div className="aspect-square overflow-hidden relative bg-linear-to-br from-amber-50 to-gray-100">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-black/70 via-black/40 to-transparent">
                        <div className="absolute bottom-2 left-3 flex items-center text-white">
                          ⭐
                          <span className="text-sm font-bold ml-1">
                            {product.rating || "4.5"}
                          </span>
                          <span className="text-xs text-gray-300 ml-1">
                            ({product.review_count || "0"})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      {/* Name */}
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Sold in{" "}
                            {isWholesaleApproved ? "bags (bulk)" : unitLabel}
                          </p>
                        </div>

                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded ml-2">
                          {product.cut_type || "STRIPS"}
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

                      {/* Bottom row */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-700">
                          {product.texture || "BUBBLY"}
                        </span>

                        <div className="text-right">
                          <div className="flex items-baseline">
                            <span className="text-lg font-bold text-[#CA993B]">
                              {formatCurrency(displayPrice)}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              /{product.unit_type?.toLowerCase() || "unit"}
                            </span>
                          </div>

                          {isWholesaleApproved && (
                            <div className="text-xs text-gray-600 mt-1">
                              ≈{" "}
                              {formatCurrency(product.retail_price * 12 * 100)}{" "}
                              / bag
                            </div>
                          )}

                          {/* Stock */}
                          <div className="text-xs font-semibold mt-0.5 text-[#CA993B]">
                            {product.stock_quantity > 10
                              ? "IN STOCK"
                              : product.stock_quantity > 0
                                ? "LOW STOCK"
                                : "OUT OF STOCK"}
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                        {product.best_for || "Perfect for soups & stews"}
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
