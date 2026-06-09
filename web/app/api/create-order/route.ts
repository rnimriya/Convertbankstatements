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
  payg:             TIER_CONFIG.PAYG.monthlyPricePaise,
  pro:              TIER_CONFIG.PRO.monthlyPricePaise,
  business:         TIER_CONFIG.BUSINESS.monthlyPricePaise,
  pro_annual:       TIER_CONFIG.PRO.annualPricePaise!,
  business_annual:  TIER_CONFIG.BUSINESS.annualPricePaise!,
};

const schema = z.object({
  plan: z.enum(["payg", "pro", "business", "pro_annual", "business_annual"]),
  fileName: z.string().optional(),
  pageCount: z.number().optional(),
});

export async function POST(req: NextRequest) {
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
    const order = await rp.orders.create({
      amount: AMOUNTS[plan],
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: session.sub,
        userEmail: session.email,
        plan,
        fileName: fileName ?? "",
        pageCount: String(pageCount ?? 0),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Order creation failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
