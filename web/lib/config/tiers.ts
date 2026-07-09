/**
 * Single source of truth for all tier limits, page quotas, and prices.
 * Import from here — never hardcode these values in route handlers.
 */

export type Tier = "FREE" | "BASIC" | "PRO" | "BUSINESS";
export type BillingCycle = "monthly" | "annual";

export interface TierConfig {
  /** Pages included per month. */
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
  BASIC: {
    pagesPerMonth: 25,
    monthlyPricePaise: 500,       // $5 / month
    annualPricePaise: 4800,       // $48 / year (≈ $4/mo)
  },
  PRO: {
    pagesPerMonth: 500,
    monthlyPricePaise: 2000,      // $20
    annualPricePaise: 19200,      // $192  (≈ $16/mo, 20% off)
  },
  BUSINESS: {
    pagesPerMonth: 2_000,
    monthlyPricePaise: 7500,      // $75
    annualPricePaise: 72000,      // $720 (≈ $60/mo, 20% off)
  },
} satisfies Record<Tier, TierConfig>;

/** Page limit for a given paid tier, ready to store in Redis. */
export function pageLimit(tier: "BASIC" | "PRO" | "BUSINESS"): number {
  return TIER_CONFIG[tier].pagesPerMonth;
}
