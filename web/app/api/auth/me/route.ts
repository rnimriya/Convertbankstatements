import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { findById } from "@/lib/auth/users";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });

  const user = await findById(session.sub);
  if (!user) return NextResponse.json({ user: null });

  const res = NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      tier: user.tier,
      pagesUsed: user.pagesUsed,
      monthlyPageLimit: user.monthlyPageLimit,
    },
  });
  res.headers.set("Cache-Control", "private, no-cache, no-store");
  return res;
}
