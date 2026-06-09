/**
 * Single source of truth for all tier limits, page quotas, and prices.
 * Import from here — never hardcode these values in route handlers.
 */

export type Tier = "FREE" | "PAYG" | "PRO" | "BUSINESS";
export type BillingCycle = "monthly" | "annual";

export interface TierConfig {
  /** Pages included per month (or per conversion for PAYG). */
  pagesPerMonth: number;
  /** Monthly price in paise (₹1 = 100 paise). 0 for FREE. */
  monthlyPricePaise: number;
  /** Annual price in paise (total charge, not monthly). null if no annual option. */
  annualPricePaise: number | null;
}

export const TIER_CONFIG = {
  FREE: {
    pagesPerMonth: 8,
    monthlyPricePaise: 0,
    annualPricePaise: null,
  },
  PAYG: {
    pagesPerMonth: 0,            // not monthly — per-conversion model
    monthlyPricePaise: 4_900,    // ₹49 per conversion
    annualPricePaise: null,
  },
  PRO: {
    pagesPerMonth: 500,
    monthlyPricePaise: 119_800,  // ₹1,198
    annualPricePaise: 1_149_900, // ₹11,499  (≈ ₹958/mo, 20% off)
  },
  BUSINESS: {
    pagesPerMonth: 2_000,
    monthlyPricePaise: 449_800,  // ₹4,498
    annualPricePaise: 4_317_800, // ₹43,178 (≈ ₹3,598/mo, 20% off)
  },
} satisfies Record<Tier, TierConfig>;

/** Page limit for a given tier + billing cycle, ready to store in Redis. */
export function pageLimit(tier: "PRO" | "BUSINESS"): number {
  return TIER_CONFIG[tier].pagesPerMonth;
}
