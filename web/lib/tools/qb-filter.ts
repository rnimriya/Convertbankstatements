/**
 * QuickBooks-content filter for convertstatement.in (owner order 2026-11-27:
 * "Quickbook se related sara content hta do, bus website converter base
 * rakho" — the India site stays converter-based: Excel / CSV / OFX for
 * Tally / Google Sheets, no QuickBooks anywhere).
 *
 * Everything here is display/routing only and applies ONLY when
 * isIndiaSite() (NEXT_PUBLIC_SITE_REGION=IN or NEXT_PUBLIC_BANKS_REGION=IN).
 * convertstatement.online is untouched. The conversion engine and APIs
 * are NOT affected — QB formats still convert server-side, they are
 * simply not listed, linked or reachable on the India site.
 */
import { isIndiaSite } from "@/lib/site-region";

/** Tool slugs (under /tools/) that are QuickBooks-specific. IIF is a
 *  QuickBooks Desktop format, so IIF tools count as QuickBooks. */
export const QB_TOOL_SLUGS = new Set<string>([
  "csv-to-qbo",
  "qbo-to-csv",
  "csv-to-iif",
  "ofx-to-qbo",
  "free-receipt-to-quickbooks",
  "bulk-import-quickbooks",
  "bulk-export-quickbooks",
  "iif-to-excel",
  "iif-to-csv",
  "free-stripe-to-quickbooks",
  "free-paypal-to-quickbooks",
  "amazon-to-quickbooks",
  "shopify-to-quickbooks",
  "square-to-quickbooks",
  "etsy-to-quickbooks",
  "qbo-to-iif",
  "qbo-to-pdf",
  "qfx-to-qbo",
  "qif-to-qbo",
  "free-qbo-cleanup-checker",
  "qbo-checker",
  "qbo-import-errors",
  "reconciliation-finder",
  "qbo-splitter",
  "bulk-deleter-quickbooks",
  "qbo-file-editor",
  "qbo-merger",
  "invoice-import-checker",
  "payroll-journal-generator",
]);

/** Non-tool routes that are QuickBooks pages. */
export const QB_ROUTES = new Set<string>([
  "/quickbooks",
  "/quickbooks-reconciliation",
  "/pdf-to-qbo",
  "/services/quickbooks-cleanup",
  "/compare/synder-alternative",
  // QuickBooks-framed audience/comparison pages (copy is built around
  // QuickBooks workflows, so they 404 on .in instead of being rewritten)
  "/for-bookkeepers",
  "/partners",
  "/best-bank-statement-converter",
]);

/** Guide slugs (under /guides/) that are QuickBooks topics. */
export const QB_GUIDE_SLUGS = new Set<string>(["import-bank-statement-to-quickbooks"]);

/** True when a /tools/<slug> is QuickBooks-specific. */
export function isQbToolSlug(slug: string): boolean {
  return QB_TOOL_SLUGS.has(slug);
}

/** True when a site path ("/tools/csv-to-qbo", "/quickbooks", …) is a
 *  QuickBooks page that must disappear on the India site. */
export function isQbPath(path: string): boolean {
  if (QB_ROUTES.has(path)) return true;
  const m = path.match(/^\/tools\/([^/]+)$/);
  return m ? QB_TOOL_SLUGS.has(m[1]) : false;
}

/** True when this slug/path should be hidden on the current site. */
export function isQbHiddenOnIndia(slugOrPath: string): boolean {
  if (!isIndiaSite()) return false;
  return slugOrPath.startsWith("/") ? isQbPath(slugOrPath) : isQbToolSlug(slugOrPath);
}

/** Filter a list of items carrying an href ("/tools/<slug>") for IN. */
export function withoutQbTools<T extends { href: string }>(items: T[]): T[] {
  if (!isIndiaSite()) return items;
  return items.filter((it) => !isQbPath(it.href));
}

/** Filter a list of items carrying a slug for IN. */
export function withoutQbSlugs<T extends { slug: string }>(items: T[]): T[] {
  if (!isIndiaSite()) return items;
  return items.filter((it) => !isQbToolSlug(it.slug));
}
