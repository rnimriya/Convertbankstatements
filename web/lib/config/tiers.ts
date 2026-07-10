/**
 * Single source of truth for all tier limits, page quotas, and prices.
 * Import from here — never hardcode these values in route handlers.
 */

export type Tier = "FREE" | "BASIC" | "PRO" | "BUSINESS";
export type BillingCycle = "monthly" | "annual";

export interface TierConfig {
  /** Pages included per month. */
  pagesPerMonth: number;
  /** Monthly price in cents ($1 = 100 cents). 0 for FREE. */
  monthlyPriceCents: number;
  /** Annual price in cents (total charge, not monthly). null if no annual option. */
  annualPriceCents: number | null;
}

export const TIER_CONFIG = {
  FREE: {
    pagesPerMonth: 8,
    monthlyPriceCents: 0,
    annualPriceCents: null,
  },
  BASIC: {
    pagesPerMonth: 25,
    monthlyPriceCents: 500,       // $5 / month
    annualPriceCents: 4800,       // $48 / year (≈ $4/mo)
  },
  PRO: {
    pagesPerMonth: 500,
    monthlyPriceCents: 2000,      // $20 / month
    annualPriceCents: 19200,      // $192 / year (≈ $16/mo, 20% off)
  },
  BUSINESS: {
    pagesPerMonth: 2_000,
    monthlyPriceCents: 7500,      // $75 / month
    annualPriceCents: 72000,      // $720 / year (≈ $60/mo, 20% off)
  },
} satisfies Record<Tier, TierConfig>;

/** Page limit for a given paid tier, ready to store in Redis. */
export function pageLimit(tier: "BASIC" | "PRO" | "BUSINESS"): number {
  return TIER_CONFIG[tier].pagesPerMonth;
}
