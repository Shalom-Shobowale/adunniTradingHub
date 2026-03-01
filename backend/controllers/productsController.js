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
  const { name, ...rest } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Product name required" });
  }

  // 1️⃣ Basic slug generator (no library)
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  let slug = baseSlug;
  let counter = 1;

  // 2️⃣ Ensure uniqueness
  while (true) {
    const { data: existing } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!existing) break;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  // 3️⃣ Insert
  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({ name, slug, ...rest })
    .select()
    .single();

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  res.json(data);
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, ...rest } = req.body;

  let updates = { ...rest };

  // If name is being updated, regenerate slug
  if (name) {
    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const { data: existing } = await supabaseAdmin
        .from("products")
        .select("id")
        .eq("slug", slug)
        .neq("id", id) // exclude current product
        .maybeSingle();

      if (!existing) break;

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    updates.name = name;
    updates.slug = slug;
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ message: error.message });
  }

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
