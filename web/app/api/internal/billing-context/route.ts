import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { findById } from "@/lib/auth/users";

function isValidApiKey(provided: string | null): boolean {
  const expected = process.env.BACKEND_API_KEY ?? "";
  if (!expected || !provided) return false;
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(provided);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!isValidApiKey(req.headers.get("x-api-key"))) {
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
