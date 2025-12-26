import { createContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

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
        .select("*, product:products(*)")
        .eq("user_id", user.id);

      if (error) throw error;
      setCart(data || []);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity) => {
    if (!user) throw new Error("Must be logged in");

    try {
      const existing = cart.find((i) => i.product_id === productId);

      if (existing) {
        await updateQuantity(existing.id, existing.quantity + quantity);
      } else {
        await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: productId,
          quantity,
        });
        await loadCart();
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) return removeFromCart(cartItemId);

    await supabase.from("cart_items").update({ quantity }).eq("id", cartItemId);

    await loadCart();
  };

  const removeFromCart = async (cartItemId) => {
    await supabase.from("cart_items").delete().eq("id", cartItemId);

    await loadCart();
  };

  const clearCart = async () => {
    if (!user) return;
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.retail_price * item.quantity,
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
