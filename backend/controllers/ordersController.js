import { supabaseAdmin } from "../lib/supabaseAdmin.js";

// console.log("🔥 createOrder route hit");

export const createOrder = async (req, res) => {
  try {
    // console.log("Incoming order:", JSON.stringify(req.body, null, 2));

    const {
      userId,
      cart,
      shippingInfo,
      paymentMethod,
      subtotal,
      shippingCost,
      total,
    } = req.body;

    // ✅ 1. Validate required fields
    if (!userId || !cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid input: userId and cart are required",
      });
    }

    if (!shippingInfo || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: "Missing shipping or payment info",
      });
    }

    // ✅ 2. Generate order number
    const orderNumber = `ADH${Date.now()}`;

    // ✅ 3. Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: userId,
        order_type: "retail",
        status: "pending",
        subtotal,
        shipping_cost: shippingCost,
        total,
        shipping_address: shippingInfo,
        payment_method: paymentMethod,
        payment_status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order insert error:", orderError);
      return res.status(500).json({
        success: false,
        error: orderError.message,
      });
    }

    if (!order) {
      return res.status(500).json({
        success: false,
        error: "Order creation failed",
      });
    }

    // ✅ Fetch products from DB
    const productIds = cart.map((item) => item.product_id);

    const { data: products, error: productError } = await supabaseAdmin
      .from("products")
      .select("id, name, retail_price")
      .in("id", productIds);

    if (productError) throw productError;

    // ✅ Map products
    const productMap = {};
    products.forEach((p) => {
      productMap[p.id] = p;
    });

    // ✅ Build order items safely
    const orderItems = cart.map((item, index) => {
      const product = productMap[item.product_id];

      if (!product) {
        throw new Error(`Product not found: ${item.product_id}`);
      }

      if (typeof product.retail_price !== "number") {
        throw new Error(`Invalid price for product: ${product.id}`);
      }

      return {
        order_id: order.id,
        product_id: item.product_id,
        product_name: product.name,
        quantity: item.quantity,
        unit_price: product.retail_price,
        total_price: product.retail_price * item.quantity,
      };
    });

    // ✅ 5. Insert order items
    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items insert error:", itemsError);

      // Optional: rollback order if items fail
      await supabaseAdmin.from("orders").delete().eq("id", order.id);

      return res.status(500).json({
        success: false,
        error: itemsError.message,
      });
    }

    // ✅ 6. Success response
    return res.status(201).json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
    });
  } catch (err) {
    console.error("Create order error:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
      // ⚠️ remove stack in production
      stack: err.stack,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ error: err.message });
  }
};
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          product_name,
          quantity,
          unit_price,
          total_price
        )
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Get my orders error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    if (!payment_status) {
      return res.status(400).json({ error: "Payment status is required" });
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ payment_status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Update payment status error:", err);
    res.status(500).json({ error: err.message });
  }
};
