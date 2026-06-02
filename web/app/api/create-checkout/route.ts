import { NextResponse } from "next/server";

// Stripe checkout replaced by Razorpay — use /api/create-order instead.
export async function POST() {
  return NextResponse.json(
    { error: "Use /api/create-order for Razorpay payments." },
    { status: 410 }
  );
}
