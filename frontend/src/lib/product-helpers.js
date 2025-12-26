// utils/product-helpers.js

export const getProductCardData = (product) => {
  // Calculate stock status
  const in_stock = product.stock_quantity > 0;
  const is_low_stock = product.stock_quantity > 0 && product.stock_quantity < 10;
  
  // Get first image or placeholder
  const imageUrl = product.images?.[0] || '/placeholder-ponmo.jpg';
  
  // Get rating with fallback
  const rating = product.rating || 4.0;
  const review_count = product.review_count || 0;
  
  // Get badge based on conditions
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

// Helper to get stock status text and color
export const getStockStatus = (quantity) => {
  if (quantity <= 0) {
    return { text: 'OUT OF STOCK', color: 'text-red-600', bg: 'bg-red-50' };
  }
  if (quantity < 10) {
    return { text: 'LOW STOCK', color: 'text-amber-600', bg: 'bg-amber-50' };
  }
  return { text: 'IN STOCK', color: 'text-emerald-600', bg: 'bg-emerald-50' };
};

// Helper for rating display
export const renderRatingStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push('★');
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push('★');
    } else {
      stars.push('☆');
    }
  }
  
  return stars.join('');
};