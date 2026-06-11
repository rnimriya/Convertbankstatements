import { NextRequest, NextResponse } from "next/server";
import { findById } from "@/lib/auth/users";
import { validateBackendApiKey } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  if (!validateBackendApiKey(req.headers.get("x-api-key"))) {
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
