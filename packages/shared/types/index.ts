// Shared TypeScript types used by both web and mobile

export type SubTier = "FREE" | "PAYG" | "PRO" | "BUSINESS";
export type BillingType = "FREE_TIER" | "SUBSCRIPTION" | "PAY_AS_YOU_GO";
export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";

export interface BillingContext {
  tier: SubTier;
  pagesUsedThisPeriod: number;
  monthlyPageLimit: number;
  stripeCustomerId: string | null;
}

export interface Transaction {
  date: string;
  description: string;
  amount: number;
  balance: number | null;
  category: string | null;
  reference: string | null;
}

export interface BillingDecision {
  billing_type: BillingType;
  pages_charged: number;
  payment_required: boolean;
  stripe_checkout_url: string | null;
  message: string;
}

export interface ProcessStatementResult {
  success: boolean;
  file_name: string;
  page_count: number;
  transaction_count: number;
  bank_name: string | null;
  billing: BillingDecision;
  transactions: Transaction[];
  export_urls: Record<string, string>;
  processing_ms: number;
}

export interface PaymentRequiredError {
  error: "PAYMENT_REQUIRED";
  message: string;
  page_count: number;
  price_usd: number;
  stripe_checkout_url: string;
}

export const FREE_PAGE_CAP = 8;
export const PAYG_PRICE_USD = 1.99;

export const TIER_PAGE_LIMITS: Record<SubTier, number> = {
  FREE: 8,
  PAYG: 0,
  PRO: 200,
  BUSINESS: 500,
};

export const TIER_PRICES_USD: Partial<Record<SubTier, number>> = {
  PRO: 48,
  BUSINESS: 98,
};
