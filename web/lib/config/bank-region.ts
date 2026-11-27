/**
 * Region filter for bank listings (owner order 2026-11-27).
 *
 * The same codebase serves convertstatement.online (all banks) and
 * convertstatement.in (Indian banks only). Set NEXT_PUBLIC_BANKS_REGION=IN
 * on the .in deployment to restrict every bank LISTING surface (bank pages,
 * sitemap, link grids, counts) to Indian banks operating in India.
 * Unset = all banks, current behaviour.
 *
 * NOTE: this filters listings/SEO surfaces only. The conversion engine
 * (inferBankName in lib/config/banks.ts) is deliberately NOT filtered, so a
 * statement from any supported bank still converts on either site.
 */
import { SUPPORTED_BANKS } from "@/lib/config/banks";

export const BANKS_REGION = process.env.NEXT_PUBLIC_BANKS_REGION ?? "";

/**
 * Display names (exact SUPPORTED_BANKS values) of Indian banks operating in
 * India: scheduled commercial banks, small finance banks, payments banks,
 * co-operative banks and regional rural banks licensed in India.
 *
 * Derived 2026-11-27 from the "Indian Banks" section of SUPPORTED_BANKS plus
 * Indian entries in the alphabetical bankstatementwizard list. Foreign banks
 * that merely have an India presence (HSBC, Standard Chartered, DBS,
 * Citibank, MUFG, etc.) are intentionally NOT included — owner asked for
 * Indian banks. Indian fintechs/NBFCs in the source list (Niyo, PhonePe,
 * Scapia, Piramal Finance, Monarch Networth, KoinX, Finacle) are also
 * excluded: they are not banks.
 *
 * Flagged for owner review (included, but classification is inferred from
 * the name alone): "ADC Bank" (Ahmedabad District Co-operative Bank),
 * "Prime Co Operative Bank", "Sindhudurg" (district co-op bank).
 */
export const INDIAN_BANK_NAMES: ReadonlySet<string> = new Set([
  "AU Small Finance Bank",
  "Abhyudaya Co-op. Bank Ltd.",
  "ADC Bank",
  "Airtel Payments Bank",
  "Akola Janata Bank",
  "Axis Bank",
  "Bandhan Bank",
  "Bank of Baroda",
  "Bank of India",
  "Bank of Maharashtra",
  "Bharat Bank",
  "Bicholim Urban Co-operative Bank",
  "CSB Bank",
  "Canara Bank",
  "Central Bank of India",
  "City Union Bank",
  "Cosmos Co-operative Bank Ltd",
  "DCB Bank",
  "Dhanlaxmi Bank",
  "ESAF Small Finance Bank",
  "Equitas Small Finance Bank",
  "Federal Bank",
  "Federal Bank India",
  "HDFC Bank",
  "ICICI Bank",
  "IDBI Bank",
  "IDFC FIRST Bank",
  "Indian Bank",
  "Indian Overseas Bank",
  "IndusInd Bank",
  "Induslnd Bank", // typo variant present in source data
  "Jammu and Kashmir Bank",
  "Jana Small Finance Bank",
  "Janata Sahakari Bank",
  "Jio Payments Bank",
  "Karnatka Bank", // source-data spelling of Karnataka Bank
  "Karur Vysya Bank",
  "Kotak Mahindra Bank",
  "Maharashtra Gramin Bank",
  "Municipal Co-Operative Bank",
  "Paytm Payments Bank",
  "Prime Co Operative Bank",
  "Punjab National Bank",
  "Punjab and Sind Bank",
  "RBL Bank",
  "SVC Bank",
  "Samarth Sahkari Bank",
  "Saraswat Bank",
  "Sindhudurg",
  "South Indian Bank",
  "State Bank of India (SBI)",
  "Surat People Cooperative Bank",
  "Suvrnayug Sahakari Bank",
  "TJSB Bank",
  "Tamilnad Mercantile Bank",
  "Thane Bharat Sahakari Bank Ltd.",
  "The Muslim Co-Operative Bank",
  "UCO Bank",
  "Union Bank of India",
  "Yes Bank",
]);

export function isIndianBank(name: string): boolean {
  return INDIAN_BANK_NAMES.has(name);
}

/** True when the bank may appear in listings on this deployment. */
export function isBankVisible(name: string): boolean {
  return BANKS_REGION !== "IN" || isIndianBank(name);
}

function uniqueNames(): string[] {
  return Array.from(new Set(SUPPORTED_BANKS.map(([, name]) => name)));
}

/** Unique supported-bank display names visible on this deployment. */
export function visibleBankNames(): string[] {
  return uniqueNames().filter(isBankVisible);
}

export function visibleBankCount(): number {
  return visibleBankNames().length;
}

/**
 * Count label for marketing copy. Unset region keeps the historical "400+"
 * wording byte-identical; region=IN shows the exact filtered count.
 */
export function bankCountLabel(): string {
  return BANKS_REGION === "IN" ? `${visibleBankCount()}` : "400+";
}
