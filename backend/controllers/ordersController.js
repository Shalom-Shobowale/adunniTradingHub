import { supabaseAdmin } from "../lib/supabaseAdmin.js";

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
