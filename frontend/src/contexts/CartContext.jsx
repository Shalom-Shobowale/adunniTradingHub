import { createContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

const CartContext = createContext(null);

/* ------------------ HELPERS ------------------ */
const getWholesalePrice = (quantity, pricing) => {
  if (!pricing || pricing.length === 0) return null;

  const sorted = [...pricing].sort((a, b) => a.min_quantity - b.min_quantity);

  return (
    sorted.find(
      (tier) =>
        quantity >= tier.min_quantity &&
        (tier.max_quantity === null || quantity <= tier.max_quantity)
    )?.price_per_unit ?? null
  );
};

export function CartProvider({ children }) {
  const { user, isWholesaleApproved } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ------------------ LOAD CART ------------------ */
  useEffect(() => {
    if (user) loadCart();
    else {
      setCart([]);
      setLoading(false);
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("cart_items")
        .select(
          `
          *,
          product:products(
            *,
            wholesale_pricing(*)
          )
        `
        )
        .eq("user_id", user.id);

      if (error) throw error;
      setCart(data || []);
    } finally {
      setLoading(false);
    }
  };

  const resolvePrice = (product, quantity) => {
    if (isWholesaleApproved && product?.wholesale_pricing?.length) {
      const wholesalePrice = getWholesalePrice(
        quantity,
        product.wholesale_pricing
      );
      if (wholesalePrice) return wholesalePrice;
    }

    return product.retail_price;
  };

  /* ------------------ ADD TO CART ------------------ */
  const addToCart = async (productId, quantity) => {
    if (!user) throw new Error("Must be logged in");

    const { data: product } = await supabase
      .from("products")
      .select("retail_price, wholesale_pricing(*)")
      .eq("id", productId)
      .single();

    const price = resolvePrice(product, quantity);

    const existing = cart.find((i) => i.product_id === productId);

    if (existing) {
      await updateQuantity(existing.id, existing.quantity + quantity);
      return;
    }

    await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: productId,
      quantity,
      price,
    });

    await loadCart();
  };

  /* ------------------ UPDATE QUANTITY (FIX) ------------------ */
  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) return removeFromCart(cartItemId);

    const item = cart.find((i) => i.id === cartItemId);
    if (!item) return;

    const newPrice = resolvePrice(item.product, quantity);

    await supabase
      .from("cart_items")
      .update({ quantity, price: newPrice })
      .eq("id", cartItemId);

    await loadCart();
  };

  /* ------------------ REMOVE ------------------ */
  const removeFromCart = async (cartItemId) => {
    await supabase.from("cart_items").delete().eq("id", cartItemId);
    await loadCart();
  };

  const clearCart = async () => {
    if (!user) return;
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setCart([]);
  };

  /* ------------------ TOTALS ------------------ */
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
