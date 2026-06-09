/**
 * POST /api/verify-payment
 * Verifies Razorpay payment signature and marks user's payment as cleared.
 * For PAYG: increments paid_pages so the next upload can proceed.
 * For subscriptions: upgrades the user's tier.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { upgradeTier } from "@/lib/auth/users";
import { z } from "zod";

const schema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  plan: z.enum(["payg", "pro", "business", "pro_annual", "business_annual"]),
});

const PLAN_CONFIG: Record<string, { tier: "FREE" | "PRO" | "BUSINESS"; pageLimit: number; billingCycle: "monthly" | "annual" }> = {
  pro:              { tier: "PRO",      pageLimit: 500,   billingCycle: "monthly" },
  business:         { tier: "BUSINESS", pageLimit: 2000,  billingCycle: "monthly" },
  pro_annual:       { tier: "PRO",      pageLimit: 500,   billingCycle: "annual"  },
  business_annual:  { tier: "BUSINESS", pageLimit: 2000,  billingCycle: "annual"  },
  payg:             { tier: "FREE",     pageLimit: 8,     billingCycle: "monthly" },
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const valid = verifyPaymentSignature(parsed.data);
  if (!valid) return NextResponse.json({ error: "Payment signature invalid" }, { status: 400 });

  const { plan } = parsed.data;

  if (plan === "payg") {
    // For PAYG, store the verified payment ID in a cookie so the next upload request
    // sees it as authorized. The process-statement route resets it after use.
    const res = NextResponse.json({ ok: true, plan });
    res.cookies.set("bs_payg_cleared", parsed.data.razorpay_payment_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 30, // 30 minutes to complete the upload
    });
    return res;
  }

  // Subscription upgrade
  const cfg = PLAN_CONFIG[plan];
  await upgradeTier(session.sub, cfg.tier, cfg.pageLimit, cfg.billingCycle);

  return NextResponse.json({ ok: true, plan, tier: cfg.tier, billingCycle: cfg.billingCycle });
}
