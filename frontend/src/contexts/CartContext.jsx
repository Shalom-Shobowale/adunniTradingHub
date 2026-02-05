import { createContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";
import { calculateShipping } from "../lib/shipping";

const CartContext = createContext(null);

/* ------------------ HELPERS ------------------ */
const getWholesalePrice = (quantity, pricing) => {
  if (!pricing || pricing.length === 0) return null;

  const sorted = [...pricing].sort((a, b) => a.min_quantity - b.min_quantity);

  return (
    sorted.find(
      (tier) =>
        quantity >= tier.min_quantity &&
        (tier.max_quantity === null || quantity <= tier.max_quantity),
    )?.price_per_unit ?? null
  );
};

export function CartProvider({ children }) {
  const { user, isWholesaleApproved } = useAuth();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ NEW: delivery location
  const [deliveryZone, setDeliveryZone] = useState("lagos_mainland");

  useEffect(() => {
    if (user) mergeGuestCartToUserCart();
  }, [user]);

  /* ------------------ LOAD CART ------------------ */
  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);

      // -----------------------
      // GUEST CART (localStorage)
      // -----------------------
      if (!user) {
        const guestCart = JSON.parse(
          localStorage.getItem("guest_cart") || "[]",
        );

        // If empty, just load it
        if (guestCart.length === 0) {
          setCart([]);
          return;
        }

        // Fetch product details for guest cart
        const productIds = guestCart.map((item) => item.product_id);

        const { data: products, error } = await supabase
          .from("products")
          .select("*, wholesale_pricing(*)")
          .in("id", productIds);

        if (error) throw error;

        // Merge product details into guest cart
        const merged = guestCart.map((item) => {
          const product = products.find((p) => p.id === item.product_id);

          return {
            id: `guest-${item.product_id}`, // fake id for React keys
            product_id: item.product_id,
            quantity: item.quantity,
            price: product ? resolvePrice(product, item.quantity) : 0,
            product,
            isGuest: true,
          };
        });

        setCart(merged);
        return;
      }

      // -----------------------
      // LOGGED IN CART (Supabase)
      // -----------------------
      const { data, error } = await supabase
        .from("cart_items")
        .select(
          `
          *,
          product:products(
            *,
            wholesale_pricing(*)
          )
        `,
        )
        .eq("user_id", user.id);

      if (error) throw error;

      setCart(data || []);
    } catch (err) {
      console.error("loadCart error:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const resolvePrice = (product, quantity) => {
    if (product?.wholesale_pricing?.length) {
      const volumePrice = getWholesalePrice(
        quantity,
        product.wholesale_pricing,
      );
      if (volumePrice) return volumePrice;
    }
    return product.retail_price;
  };

  const mergeGuestCartToUserCart = async () => {
    const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
    if (!guestCart.length) return;

    try {
      for (const item of guestCart) {
        const { data: existing } = await supabase
          .from("cart_items")
          .select("*")
          .eq("user_id", user.id)
          .eq("product_id", item.product_id)
          .maybeSingle();

        if (existing) {
          await supabase
            .from("cart_items")
            .update({ quantity: existing.quantity + item.quantity })
            .eq("id", existing.id);
        } else {
          // fetch product pricing
          const { data: product } = await supabase
            .from("products")
            .select("retail_price, wholesale_pricing(*)")
            .eq("id", item.product_id)
            .single();

          const price = resolvePrice(product, item.quantity);

          await supabase.from("cart_items").insert({
            user_id: user.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price,
          });
        }
      }

      localStorage.removeItem("guest_cart");
      await loadCart();
    } catch (err) {
      console.error("mergeGuestCartToUserCart error:", err);
    }
  };

  /* ------------------ ADD TO CART ------------------ */
  const addToCart = async (productId, quantity) => {
    // -----------------------
    // GUEST CART (localStorage)
    // -----------------------
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");

      const existing = guestCart.find((i) => i.product_id === productId);

      if (existing) {
        existing.quantity += quantity;
      } else {
        guestCart.push({ product_id: productId, quantity });
      }

      localStorage.setItem("guest_cart", JSON.stringify(guestCart));

      // refresh UI cart
      await loadCart();
      return;
    }

    // -----------------------
    // LOGGED IN CART (Supabase)
    // -----------------------

    // 1. Load product pricing
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("retail_price, wholesale_pricing(*)")
      .eq("id", productId)
      .single();

    if (productError) throw productError;

    const price = resolvePrice(product, quantity);

    if (!price || price <= 0) {
      throw new Error("Invalid price calculated");
    }

    // 2. Check existing cart item
    const existing = cart.find((i) => i.product_id === productId);

    if (existing) {
      await updateQuantity(existing.id, existing.quantity + quantity);
      return;
    }

    // 3. Insert new cart item
    const { error: insertError } = await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: productId,
      quantity,
      price,
    });

    if (insertError) throw insertError;

    await loadCart();
  };

  /* ------------------ UPDATE QUANTITY ------------------ */
  const updateQuantity = async (cartItemId, quantity) => {
    // -----------------------
    // GUEST CART
    // -----------------------
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");

      const productId = cartItemId.replace("guest-", "");
      const item = guestCart.find((i) => i.product_id === productId);

      if (!item) return;

      if (quantity <= 0) {
        const updated = guestCart.filter((i) => i.product_id !== productId);
        localStorage.setItem("guest_cart", JSON.stringify(updated));
        await loadCart();
        return;
      }

      item.quantity = quantity;
      localStorage.setItem("guest_cart", JSON.stringify(guestCart));
      await loadCart();
      return;
    }

    // -----------------------
    // LOGGED IN CART
    // -----------------------
    if (quantity <= 0) return removeFromCart(cartItemId);

    const item = cart.find((i) => i.id === cartItemId);
    if (!item) return;

    const newPrice = resolvePrice(item.product, quantity);

    if (!newPrice || newPrice <= 0) {
      throw new Error("Invalid price during quantity update");
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity, price: newPrice })
      .eq("id", cartItemId);

    if (error) throw error;

    await loadCart();
  };

  /* ------------------ REMOVE ------------------ */
  const removeFromCart = async (cartItemId) => {
    // -----------------------
    // GUEST CART
    // -----------------------
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      const productId = cartItemId.replace("guest-", "");

      const updated = guestCart.filter((i) => i.product_id !== productId);
      localStorage.setItem("guest_cart", JSON.stringify(updated));

      await loadCart();
      return;
    }

    // -----------------------
    // LOGGED IN CART
    // -----------------------
    await supabase.from("cart_items").delete().eq("id", cartItemId);
    await loadCart();
  };

  const clearCart = async () => {
    if (!user) {
      localStorage.removeItem("guest_cart");
      setCart([]);
      return;
    }

    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setCart([]);
  };

  /* ------------------ TOTALS ------------------ */
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const cartCount = cart.length;

  // ✅ DEFINE BAGS
  const totalBags = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ✅ SHIPPING
  const shippingResult = calculateShipping({
    zone: deliveryZone,
    cartTotal,
    isWholesaleApproved,
    bags: totalBags,
  });

  const shippingCost = shippingResult.finalPrice;
  const total = cartTotal + shippingCost;

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
        shippingCost,
        shippingDetails: shippingResult,
        total,
        deliveryZone,
        setDeliveryZone,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
