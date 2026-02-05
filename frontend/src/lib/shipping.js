import { getWholesaleBagPerk } from "./wholesalePerks";

export const SHIPPING_ZONES = {
  lagos_mainland: {
    label: "Lagos Mainland",
    price: 1000,
  },
  lagos_island: {
    label: "Lagos Island",
    price: 1500,
  },
  outskirts: {
    label: "Outskirts",
    price: 2500,
  },
  interstate: {
    label: "Interstate",
    price: 4000,
  },
};

export function calculateShipping({
  zone,
  isWholesaleApproved = false,
  bags = 0,
}) {
  const basePrice = SHIPPING_ZONES[zone]?.price ?? 3000;

  // 🚫 Retailers → NO discount, NO free shipping
  if (!isWholesaleApproved) {
    return {
      basePrice,
      finalPrice: basePrice,
      discountPercent: 0,
      discountAmount: 0,
      reason: "RETAIL_STANDARD_SHIPPING",
    };
  }

  // ✅ Approved wholesalers → discounted shipping
  let discountPercent = 0;

  if (bags > 0) {
    const perk = getWholesaleBagPerk(bags);
    discountPercent = perk?.deliveryDiscount ?? 0;
  }

  const discountAmount = Math.round(
    (discountPercent / 100) * basePrice,
  );

  const finalPrice = Math.max(0, basePrice - discountAmount);

  return {
    basePrice,
    finalPrice,
    discountPercent,
    discountAmount,
    reason:
      discountPercent > 0
        ? "WHOLESALE_DELIVERY_DISCOUNT"
        : "WHOLESALE_STANDARD_SHIPPING",
  };
}
