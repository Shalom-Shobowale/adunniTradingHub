import { supabaseAdmin } from "../lib/supabaseAdmin.js"; // Use admin client for all admin CRUD

export const getProducts = async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProducts error:", error);
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
};

export const createProduct = async (req, res) => {
  const product = req.body;

  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single(); // <--- ensures we get the inserted product

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single(); // <--- ensures we get the updated product

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  console.log("Deleting product with ID:", id);

  const { data, error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", id)
    .select();
  if (error) {
    console.error("deleteProduct error:", error);
    return res.status(500).json({ error: error.message });
  }

  console.log("Delete result:", data);
  res.json({ message: "Deleted successfully", data });
};
