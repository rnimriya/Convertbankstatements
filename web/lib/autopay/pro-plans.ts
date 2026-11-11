/**
 * AutoPay Khoj — Khoj Pro plan definitions (Day 8 prep, 2026-11-11).
 *
 * Prices were approved by the owner on 2026-11-11: ₹99/month, ₹699/year.
 * The Razorpay plan IDs themselves are NOT created yet — they are made
 * in the owner's Razorpay account during the Day-8 live session and
 * supplied through env vars, exactly like the converter's plans:
 *
 *   RAZORPAY_PLAN_KHOJ_MONTHLY   (INR 99,  period: monthly, interval 1)
 *   RAZORPAY_PLAN_KHOJ_ANNUAL    (INR 699, period: yearly,  interval 1)
 *
 * Until an env var is set, the create-subscription route answers 503
 * with a plain "not available yet" — it never invents a plan or takes
 * money against a missing configuration.
 */

export type KhojPlanKey = "khoj_monthly" | "khoj_annual";

export interface KhojPlan {
  key: KhojPlanKey;
  label: string;
  /** Amount in paise (INR). */
  amountPaise: number;
  amountLabel: string;
  period: "monthly" | "yearly";
  /** Razorpay subscription total_count (billing cycles to run). */
  totalCount: number;
  envVar: string;
}

export const KHOJ_PRO_PLANS: Record<KhojPlanKey, KhojPlan> = {
  khoj_monthly: {
    key: "khoj_monthly",
    label: "Khoj Pro — Monthly",
    amountPaise: 9900,
    amountLabel: "₹99/month",
    period: "monthly",
    totalCount: 120,
    envVar: "RAZORPAY_PLAN_KHOJ_MONTHLY",
  },
  khoj_annual: {
    key: "khoj_annual",
    label: "Khoj Pro — Yearly",
    amountPaise: 69900,
    amountLabel: "₹699/year",
    period: "yearly",
    totalCount: 10,
    envVar: "RAZORPAY_PLAN_KHOJ_ANNUAL",
  },
};

export const KHOJ_PRO_FEATURES = [
  "A WhatsApp alert 3 days and 1 day before every debit lands",
  "An alert the moment any subscription raises its price",
  "A trial countdown, so free trials never convert silently",
  "A monthly Paisa Report for the whole household",
  "Cover for up to 4 family members",
] as const;

export function isKhojPlanKey(v: unknown): v is KhojPlanKey {
  return v === "khoj_monthly" || v === "khoj_annual";
}

export function khojPlanId(key: KhojPlanKey): string | undefined {
  return process.env[KHOJ_PRO_PLANS[key].envVar] || undefined;
}

/** Exact spec to create in the Razorpay dashboard during the live session. */
export function razorpayPlanSpec(key: KhojPlanKey) {
  const p = KHOJ_PRO_PLANS[key];
  return {
    period: p.period,
    interval: 1,
    item: {
      name: p.label,
      amount: p.amountPaise,
      currency: "INR",
      description:
        "AutoPay Khoj Pro — debit alerts, price-rise alerts, trial countdowns and the monthly Paisa Report on ConvertStatement.",
    },
    notes: { product: "autopay-khoj", plan: key },
  };
}
