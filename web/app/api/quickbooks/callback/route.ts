import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { exchangeCode } from "@/lib/quickbooks";

export async function GET(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://convertstatement.online";
  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL("/login", base));

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const realmId = url.searchParams.get("realmId");
  const state = url.searchParams.get("state");
  const cookieState = req.cookies.get("qb_oauth_state")?.value;

  if (!code || !realmId || !state || !cookieState || state !== cookieState) {
    return NextResponse.redirect(new URL("/dashboard?qb=error", base));
  }

  try {
    await exchangeCode(session.sub, code, realmId);
    const res = NextResponse.redirect(new URL("/dashboard?qb=connected", base));
    res.cookies.delete("qb_oauth_state");
    return res;
  } catch {
    return NextResponse.redirect(new URL("/dashboard?qb=error", base));
  }
}
