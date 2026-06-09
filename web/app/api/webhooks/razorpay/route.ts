/**
 * POST /api/webhooks/razorpay
 * Handles server-side Razorpay webhook events (backup to client-side verification).
 * Configure in Razorpay dashboard → Webhooks → add this URL.
 */
import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { upgradeTier, findById, markWebhookProcessed } from "@/lib/auth/users";
import { TIER_CONFIG } from "@/lib/config/tiers";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const body = await req.text();

  if (!verifyWebhookSignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  const eventType: string = event.event;

  if (eventType === "payment.captured") {
    const payment = event.payload?.payment?.entity;
    const paymentId: string = payment?.id ?? "";
    const notes = payment?.notes ?? {};
    const plan: string = notes.plan ?? "payg";
    const userId: string = notes.userId ?? "";

    // Idempotency guard — Razorpay retries webhooks; process each payment_id only once.
    if (paymentId && !(await markWebhookProcessed(paymentId))) {
      return NextResponse.json({ received: true, skipped: "duplicate" });
    }

    if (userId && (plan === "pro" || plan === "business" || plan === "pro_annual" || plan === "business_annual")) {
      const user = await findById(userId);
      if (user) {
        const tier = plan.startsWith("pro") ? "PRO" : "BUSINESS";
        const cycle = plan.endsWith("_annual") ? "annual" : "monthly";
        await upgradeTier(
          userId,
          tier,
          TIER_CONFIG[tier].pagesPerMonth,
          cycle,
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
