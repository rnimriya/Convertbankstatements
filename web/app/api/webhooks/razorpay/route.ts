/**
 * POST /api/webhooks/razorpay
 * Handles server-side Razorpay webhook events (backup to client-side verification).
 * Configure in Razorpay dashboard → Webhooks → add this URL.
 */
import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { upgradeTier, findById } from "@/lib/auth/users";

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
    const notes = payment?.notes ?? {};
    const plan: string = notes.plan ?? "payg";
    const userId: string = notes.userId ?? "";

    if (userId && (plan === "pro" || plan === "business")) {
      const user = await findById(userId);
      if (user) {
        await upgradeTier(
          userId,
          plan === "pro" ? "PRO" : "BUSINESS",
          plan === "pro" ? 200 : 500
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
