import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { findById } from "@/lib/auth/users";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findById(session.sub);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    tier: user.tier,
    pagesUsedThisPeriod: user.pagesUsed,
    monthlyPageLimit: user.monthlyPageLimit,
    stripeCustomerId: null,
  });
}
