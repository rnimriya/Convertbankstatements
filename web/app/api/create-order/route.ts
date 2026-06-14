/**
 * POST /api/create-order
 * Creates a Razorpay order for subscription plans.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getRazorpay } from "@/lib/razorpay";
import { TIER_CONFIG } from "@/lib/config/tiers";
import { checkCsrfOrigin } from "@/lib/csrf";
import { z } from "zod";

const AMOUNTS: Record<string, number> = {
  basic:            TIER_CONFIG.BASIC.monthlyPricePaise,
  basic_annual:     TIER_CONFIG.BASIC.annualPricePaise!,
  pro:              TIER_CONFIG.PRO.monthlyPricePaise,
  business:         TIER_CONFIG.BUSINESS.monthlyPricePaise,
  pro_annual:       TIER_CONFIG.PRO.annualPricePaise!,
  business_annual:  TIER_CONFIG.BUSINESS.annualPricePaise!,
};

const schema = z.object({
  plan: z.enum(["basic", "basic_annual", "pro", "business", "pro_annual", "business_annual"]),
  fileName: z.string().optional(),
  pageCount: z.number().optional(),
});

export async function POST(req: NextRequest) {
  const PLAN_IDS: Record<string, string | undefined> = {
    // Create these Basic plans in the Razorpay dashboard and set the env vars
    // (₹28/month and ₹248/year).
    basic: process.env.RAZORPAY_PLAN_BASIC_MONTHLY,
    basic_annual: process.env.RAZORPAY_PLAN_BASIC_ANNUAL,
    pro: process.env.RAZORPAY_PLAN_PRO_MONTHLY || "plan_T14Sj6GkD8svJ2",
    business: process.env.RAZORPAY_PLAN_BUSINESS_MONTHLY || "plan_T14TRWQvERqGf5",
    pro_annual: process.env.RAZORPAY_PLAN_PRO_ANNUAL || "plan_T14UgoFUfRdt5Z",
    business_annual: process.env.RAZORPAY_PLAN_BUSINESS_ANNUAL || "plan_T14VWIqFnSbBMF",
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
    // Log the real (possibly Razorpay-internal) error server-side; return a
    // generic message so we don't leak provider internals to the client.
    console.error("[create-order] error:", err);
    return NextResponse.json({ error: "Order creation failed. Please try again." }, { status: 500 });
  }
}
