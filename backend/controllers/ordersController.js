import { supabaseAdmin } from "../lib/supabaseAdmin.js";

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cart,
      shippingInfo,
      paymentMethod,
      subtotal,
      shippingCost,
      total,
    } = req.body;

    const orderNumber = `ADH${Date.now()}`;

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

    if (orderError) throw orderError;

    const orderItems = cart.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product.name,
      quantity: item.quantity,
      unit_price: item.product.retail_price,
      total_price: item.product.retail_price * item.quantity,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);
    if (itemsError) throw itemsError;

    res.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getOrders = async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { payment_status } = req.body;

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ payment_status })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
