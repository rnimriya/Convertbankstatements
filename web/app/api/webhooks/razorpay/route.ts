/**
 * POST /api/webhooks/razorpay
 * Handles server-side Razorpay webhook events (backup to client-side verification).
 * Configure in Razorpay dashboard → Webhooks → add this URL.
 */
import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { upgradeTier, findById, markWebhookProcessed } from "@/lib/auth/users";
import { TIER_CONFIG } from "@/lib/config/tiers";

const SUBSCRIPTION_PLANS = new Set(["pro", "business", "pro_annual", "business_annual"]);

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const body = await req.text();

  if (!verifyWebhookSignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // BUG-01: wrap JSON.parse — malformed body (corruption in transit, proxy modification)
  // must not crash the handler. Return 200 so Razorpay stops retrying a bad payload.
  let event: Record<string, unknown>;
  try {
    event = JSON.parse(body);
  } catch {
    console.error("[razorpay-webhook] Malformed JSON body received");
    return NextResponse.json({ received: true, error: "malformed_payload" });
  }

  const eventType = event.event as string | undefined;

  if (eventType === "payment.captured") {
    const payment = (event.payload as Record<string, unknown>)?.payment as Record<string, unknown> | undefined;
    const entity = payment?.entity as Record<string, unknown> | undefined;
    const paymentId: string = (entity?.id as string) ?? "";
    const notes = (entity?.notes as Record<string, string>) ?? {};
    const plan: string = notes.plan ?? "";
    const userId: string = notes.userId ?? "";

    // BUG-03: validate required fields BEFORE marking the payment as processed.
    // Without this check, a webhook with a valid paymentId but missing/empty userId
    // consumes the idempotency slot, preventing any future retry from upgrading the user.
    if (!paymentId) {
      console.warn("[razorpay-webhook] payment.captured missing paymentId — skipping");
      return NextResponse.json({ received: true, skipped: "missing_payment_id" });
    }

    if (!userId || !plan) {
      console.error(`[razorpay-webhook] payment.captured missing userId or plan: paymentId=${paymentId}`);
      // Return 200 to prevent pointless Razorpay retries — this payload will never be valid.
      return NextResponse.json({ received: true, skipped: "missing_user_or_plan" });
    }

    // Idempotency guard — Razorpay retries webhooks; process each payment_id only once.
    if (!(await markWebhookProcessed(paymentId))) {
      return NextResponse.json({ received: true, skipped: "duplicate" });
    }

    if (SUBSCRIPTION_PLANS.has(plan)) {
      const user = await findById(userId);
      if (!user) {
        // User was deleted or ID is wrong. Log loudly — this represents lost revenue.
        console.error(`[razorpay-webhook] User not found for subscription: userId=${userId}, paymentId=${paymentId}, plan=${plan}`);
        return NextResponse.json({ received: true, error: "user_not_found" });
      }

      const tier = plan.startsWith("pro") ? "PRO" : "BUSINESS";
      const cycle = plan.endsWith("_annual") ? "annual" : "monthly";
      await upgradeTier(userId, tier, TIER_CONFIG[tier as "PRO" | "BUSINESS"].pagesPerMonth, cycle);
    }
  }

  return NextResponse.json({ received: true });
}
