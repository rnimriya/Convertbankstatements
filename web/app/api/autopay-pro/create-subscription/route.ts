/**
 * POST /api/autopay-pro/create-subscription (Day 8 prep, 2026-11-11)
 *
 * Creates a Razorpay Subscription for Khoj Pro (₹99/mo or ₹699/yr),
 * mirroring /api/create-order's pattern for the converter plans:
 * login required, CSRF origin check, plan id from env. Activation is
 * NOT granted here — the Razorpay webhook flips users.khojPro when
 * the first charge lands, so a created-but-unpaid subscription gives
 * nothing. Until the owner creates the plans and sets the env vars,
 * this answers an honest 503.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getRazorpay } from "@/lib/razorpay";
import { checkCsrfOrigin } from "@/lib/csrf";
import { KHOJ_PRO_PLANS, isKhojPlanKey, khojPlanId } from "@/lib/autopay/pro-plans";

export async function POST(req: NextRequest) {
  const csrf = checkCsrfOrigin(req);
  if (csrf) return csrf;

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please log in to upgrade to Khoj Pro." }, { status: 401 });

  let body: { plan?: unknown };
  try {
    body = (await req.json()) as { plan?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!isKhojPlanKey(body.plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  const plan = KHOJ_PRO_PLANS[body.plan];

  const planId = khojPlanId(body.plan);
  if (!planId) {
    console.error(
      `[autopay-pro] Missing Razorpay plan id for "${body.plan}". Create the plan in Razorpay (INR ${plan.amountPaise / 100}, ${plan.period}) and set ${plan.envVar}.`,
    );
    return NextResponse.json(
      { error: "Khoj Pro is not open yet — it launches with the full release. The audit above stays free." },
      { status: 503 },
    );
  }

  try {
    const rp = getRazorpay();
    const subscription = await rp.subscriptions.create({
      plan_id: planId,
      total_count: plan.totalCount,
      customer_notify: 1,
      notes: {
        userId: session.sub,
        userEmail: session.email,
        plan: plan.key,
        product: "autopay-khoj",
      },
    });
    return NextResponse.json({
      subscriptionId: subscription.id,
      amount: plan.amountPaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err: unknown) {
    console.error("[autopay-pro] subscription creation failed:", err);
    const e = err as { error?: { description?: string }; message?: string };
    const reason = e?.error?.description ?? e?.message ?? null;
    return NextResponse.json(
      { error: reason ? `Could not start the subscription: ${reason}` : "Could not start the subscription. Please try again." },
      { status: 500 },
    );
  }
}
