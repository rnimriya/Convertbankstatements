/**
 * POST /api/verify-payment
 * Verifies Razorpay payment signature and marks user's payment as cleared.
 * For subscriptions: upgrades the user's tier.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { verifyPaymentSignature, getRazorpay } from "@/lib/razorpay";
import { upgradeTier } from "@/lib/auth/users";
import { TIER_CONFIG } from "@/lib/config/tiers";
import { checkCsrfOrigin } from "@/lib/csrf";
import { z } from "zod";

// NOTE: `plan` is intentionally NOT accepted from the client. The Razorpay
// signature only covers payment_id|subscription_id — it does not bind the plan.
// Trusting a client-supplied plan would let a user pay for the cheapest tier
// and claim the most expensive one. We derive the plan from the subscription's
// server-set notes (written in create-order) instead.
const schema = z.object({
  razorpay_order_id: z.string().optional(),
  razorpay_subscription_id: z.string().optional(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

const PLAN_CONFIG: Record<string, { tier: "FREE" | "BASIC" | "PRO" | "BUSINESS"; pageLimit: number; billingCycle: "monthly" | "annual" }> = {
  basic: { tier: "BASIC", pageLimit: TIER_CONFIG.BASIC.pagesPerMonth, billingCycle: "monthly" },
  pro: { tier: "PRO", pageLimit: TIER_CONFIG.PRO.pagesPerMonth, billingCycle: "monthly" },
  business: { tier: "BUSINESS", pageLimit: TIER_CONFIG.BUSINESS.pagesPerMonth, billingCycle: "monthly" },
  pro_annual: { tier: "PRO", pageLimit: TIER_CONFIG.PRO.pagesPerMonth, billingCycle: "annual" },
  business_annual: { tier: "BUSINESS", pageLimit: TIER_CONFIG.BUSINESS.pagesPerMonth, billingCycle: "annual" },
};

export async function POST(req: NextRequest) {
  const csrf = checkCsrfOrigin(req);
  if (csrf) return csrf;

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const valid = verifyPaymentSignature(parsed.data);
  if (!valid) return NextResponse.json({ error: "Payment signature invalid" }, { status: 400 });

  // A subscription_id is required: the plan is read from the subscription, not the client.
  if (!parsed.data.razorpay_subscription_id) {
    return NextResponse.json({ error: "Missing subscription reference" }, { status: 400 });
  }

  // Fetch the authoritative subscription from Razorpay and derive the plan
  // from the notes WE set in create-order. Never trust a client-supplied plan.
  let plan: string;
  let notesUserId: string | undefined;
  try {
    const sub = await getRazorpay().subscriptions.fetch(parsed.data.razorpay_subscription_id);
    const notes = (sub.notes ?? {}) as Record<string, string>;
    plan = String(notes.plan ?? "");
    notesUserId = notes.userId;
  } catch {
    return NextResponse.json({ error: "Could not verify subscription" }, { status: 502 });
  }

  // The subscription must belong to the authenticated user.
  if (notesUserId !== session.sub) {
    return NextResponse.json({ error: "Subscription does not belong to this account" }, { status: 403 });
  }

  const cfg = PLAN_CONFIG[plan];
  if (!cfg) {
    return NextResponse.json({ error: "Unknown or unconfigured plan" }, { status: 400 });
  }

  await upgradeTier(session.sub, cfg.tier, cfg.pageLimit, cfg.billingCycle);

  return NextResponse.json({ ok: true, plan, tier: cfg.tier, billingCycle: cfg.billingCycle });
}
