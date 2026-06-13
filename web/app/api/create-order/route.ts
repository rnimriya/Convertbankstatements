/**
 * POST /api/create-order
 * Creates a Razorpay order for PAYG (₹49) or subscription plans.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getRazorpay } from "@/lib/razorpay";
import { TIER_CONFIG } from "@/lib/config/tiers";
import { checkCsrfOrigin } from "@/lib/csrf";
import { z } from "zod";

const AMOUNTS: Record<string, number> = {
  pro:              TIER_CONFIG.PRO.monthlyPricePaise,
  business:         TIER_CONFIG.BUSINESS.monthlyPricePaise,
  pro_annual:       TIER_CONFIG.PRO.annualPricePaise!,
  business_annual:  TIER_CONFIG.BUSINESS.annualPricePaise!,
};

const schema = z.object({
  plan: z.enum(["pro", "business", "pro_annual", "business_annual"]),
  fileName: z.string().optional(),
  pageCount: z.number().optional(),
});

export async function POST(req: NextRequest) {
  const PLAN_IDS: Record<string, string | undefined> = {
    pro: process.env.RAZORPAY_PLAN_PRO_MONTHLY,
    business: process.env.RAZORPAY_PLAN_BUSINESS_MONTHLY,
    pro_annual: process.env.RAZORPAY_PLAN_PRO_ANNUAL,
    business_annual: process.env.RAZORPAY_PLAN_BUSINESS_ANNUAL,
  };

  const csrf = checkCsrfOrigin(req);
  if (csrf) return csrf;

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { plan, fileName, pageCount } = parsed.data;

  try {
    const rp = getRazorpay();

    const planId = PLAN_IDS[plan];
    if (!planId) throw new Error(`Razorpay plan ID for ${plan} is not configured.`);

    const subscription = await rp.subscriptions.create({
      plan_id: planId,
      total_count: plan.includes("annual") ? 10 : 120, // 10 years or 10 years in months
      customer_notify: 1,
      notes: {
        userId: session.sub,
        userEmail: session.email,
        plan,
      },
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      amount: AMOUNTS[plan],
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Order creation failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
