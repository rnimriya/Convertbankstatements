/**
 * Internal endpoint called by the FastAPI backend to fetch a user's billing state.
 * Protected by a shared API key, never exposed to clients.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.BACKEND_API_KEY) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: { externalId: userId },
    include: { subscription: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const sub = user.subscription;
  const tier = sub?.tier ?? "FREE";
  const pagesUsed = sub?.pagesUsedThisPeriod ?? 0;
  const pageLimit = sub?.monthlyPageLimit ?? 8;

  return NextResponse.json({
    user_id: userId,
    tier,
    pages_used_this_period: pagesUsed,
    monthly_page_limit: pageLimit,
    stripe_customer_id: user.stripeCustomerId ?? null,
  });
}
