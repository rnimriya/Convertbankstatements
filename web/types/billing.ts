export type SubTier = "FREE" | "PRO" | "BUSINESS";
export type BillingType = "FREE_TIER" | "SUBSCRIPTION";
export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";

export interface BillingContext {
  tier: SubTier;
  pagesUsedThisPeriod: number;
  monthlyPageLimit: number;
  razorpayCustomerId: string | null;
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
  message: string;
}

export interface ProcessResult {
  success: boolean;
  file_name: string;
  page_count: number;
  transaction_count: number;
  bank_name: string | null;
  billing: BillingDecision;
  transactions: Transaction[];
  export_urls: Record<string, string>;
  processing_ms: number;
  is_demo?: boolean;
}
