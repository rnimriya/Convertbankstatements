import { NextResponse } from "next/server";

// Stripe webhooks replaced by Razorpay — see /api/webhooks/razorpay instead.
export async function POST() {
  return NextResponse.json({ received: false, note: "Stripe removed. Use Razorpay." }, { status: 410 });
}
