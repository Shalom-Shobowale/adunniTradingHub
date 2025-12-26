export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}


export const getProductCardData = (product) => {
  const in_stock = product.stock_quantity > 0;
  const is_low_stock = product.stock_quantity > 0 && product.stock_quantity < 10;
  const imageUrl = product.images?.[0] || '/placeholder-ponmo.jpg';
  const rating = product.rating || 4.0;
  const review_count = product.review_count || 0;
  
  const badges = [];
  if (product.drying_method) badges.push(product.drying_method);
  if (product.is_fresh) badges.push('FRESH');
  if (product.featured_badge) badges.push(product.featured_badge);
  
  return {
    id: product.id,
    name: product.name,
    price: product.retail_price,
    weight: product.weight_per_unit,
    grade: product.grade,
    imageUrl,
    rating,
    review_count,
    badges,
    cut_type: product.cut_type || 'STRIPS',
    texture: product.texture || 'BUBBLY',
    prep_time: product.prep_time || 'READY IN 15MIN',
    cleanliness: product.cleanliness || 'HAIRLESS',
    best_for: product.best_for || 'Perfect for soups & stews',
    in_stock,
    is_low_stock,
    stock_quantity: product.stock_quantity
  };
};