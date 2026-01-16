import { useEffect, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/useAuth";
import { useCart } from "../contexts/useCart";
import { formatCurrency } from "../lib/utils";

export default function WishlistPage({ onNavigate }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadWishlist();
  }, [user]);

  const loadWishlist = async () => {
    try {
      const { data } = await supabase
        .from("wishlist")
        .select("*, product:products(*)")
        .order("created_at", { ascending: false });
      setWishlist(data || []);
    } catch (err) {
      console.error("Error loading wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await supabase.from("wishlist").delete().eq("id", id);
      loadWishlist();
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  const handleAddToCart = async (productId, wishlistId) => {
    try {
      await addToCart(productId, 1);
      await removeFromWishlist(wishlistId);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const renderProductCard = (item) => {
    const images = item.product.images;
    const imageUrl =
      Array.isArray(images) && images.length > 0
        ? typeof images[0] === "string"
          ? images[0]
          : images[0]?.url
        : "https://images.pexels.com/photos/4113773/pexels-photo-4113773.jpeg";

    return (
      <Card key={item.id} padding="none" hover>
        <div
          className="aspect-square bg-gray-200 overflow-hidden cursor-pointer"
          onClick={() =>
            onNavigate("product-detail", { productId: item.product_id })
          }
        >
          <img
            src={imageUrl}
            alt={item.product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1">{item.product.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{item.product.grade}</p>
          <p className="text-xl font-bold text-[#CA993B] mb-4">
            {formatCurrency(item.product.retail_price)}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              fullWidth
              onClick={() => handleAddToCart(item.product_id, item.id)}
              disabled={item.product.stock_quantity === 0}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => removeFromWishlist(item.id)}
            >
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-300 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!wishlist.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <Heart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Save items you love to your wishlist
          </p>
          <Button size="lg" onClick={() => onNavigate("/products")}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map(renderProductCard)}
        </div>
      </div>
    </div>
  );
}
