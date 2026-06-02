import { NextRequest, NextResponse } from "next/server";
import { findById } from "@/lib/auth/users";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.BACKEND_API_KEY) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const user = await findById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user_id: userId,
    tier: user.tier,
    pages_used_this_period: user.pagesUsed,
    monthly_page_limit: user.monthlyPageLimit,
    stripe_customer_id: user.razorpayCustomerId ?? null,
  });
}
