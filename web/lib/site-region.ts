/**
 * Site-region flag for content variants (owner order 2026-11-27).
 *
 * The same codebase serves convertstatement.online (global/US-leaning
 * content) and convertstatement.in (Indian-user content: Indian banks,
 * Tally, GST/tax filing, ₹ pricing lead). Set NEXT_PUBLIC_SITE_REGION=IN
 * on the .in deployment to switch copy. Unset = current content,
 * byte-identical.
 *
 * NEXT_PUBLIC_BANKS_REGION=IN (the bank-listing filter flag from
 * lib/config/bank-region.ts) also counts as the India site, so either
 * env var turns the India content on.
 */
export const SITE_REGION = process.env.NEXT_PUBLIC_SITE_REGION ?? "";

export function isIndiaSite(): boolean {
  return SITE_REGION === "IN" || process.env.NEXT_PUBLIC_BANKS_REGION === "IN";
}
