import { supabaseAdmin } from "../lib/supabaseAdmin.js";

export const getWholesale = async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("wholesale_pricing")
    .select(`
      id,
      product_id,
      min_quantity,
      max_quantity,
      price_per_unit,
      products!inner ( name )
    `)
    .order("min_quantity", { ascending: true });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
};

export const createWholesale = async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("wholesale_pricing")
    .insert(req.body)
    .select();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
};

export const updateWholesale = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabaseAdmin
    .from("wholesale_pricing")
    .update(req.body)
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
};

export const deleteWholesale = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabaseAdmin
    .from("wholesale_pricing")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json({ success: true });
};
