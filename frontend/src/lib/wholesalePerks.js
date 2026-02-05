export const WHOLESALE_BAG_PERKS = [
  {
    minBags: 1,
    maxBags: 5,
    deliveryDiscount: 5,
    freeDozen: 0,
    label: "1–5 bags",
  },
  {
    minBags: 6,
    maxBags: 9,
    deliveryDiscount: 10,
    freeDozen: 1,
    label: "6–9 bags",
  },
  {
    minBags: 10,
    maxBags: Infinity,
    deliveryDiscount: 20,
    freeDozen: 2,
    label: "10+ bags",
  },
];

export function getWholesaleBagPerk(bags) {
  return WHOLESALE_BAG_PERKS.find(
    (perk) => bags >= perk.minBags && bags <= perk.maxBags
  );
}
