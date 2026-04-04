// lib/purchaseRules.js

export const UNIT_TYPES = {
  DOZEN: 12,
  BUNCH: 160,
  UNIT: 1,
};

export const BUNCHES_PER_BAG = 5;

export const BAG_SIZE = UNIT_TYPES.BUNCH * BUNCHES_PER_BAG;
// = 160 * 5 = 800 units

export const DEFAULT_UNIT_SIZE = UNIT_TYPES.DOZEN; // fallback