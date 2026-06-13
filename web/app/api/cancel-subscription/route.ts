import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { findById, cancelSubscription } from "@/lib/auth/users";
import { checkRateLimit } from "@/lib/rate-limit";
import { checkCsrfOrigin } from "@/lib/csrf";

export async function POST(req: NextRequest) {
  const csrf = checkCsrfOrigin(req);
  if (csrf) return csrf;

  const limited = await checkRateLimit(req);
  if (limited) return limited;

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findById(session.sub);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.tier === "FREE") {
    return NextResponse.json({ error: "Already on Free plan." }, { status: 400 });
  }

  await cancelSubscription(user.id);

  return NextResponse.json({ ok: true, tier: "FREE" });
}
