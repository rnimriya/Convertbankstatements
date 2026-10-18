import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getSession } from "@/lib/auth/session";
import { qbConfigured, qbAuthUrl } from "@/lib/quickbooks";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_BASE_URL ?? "https://convertstatement.online"));

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://convertstatement.online";
  if (!qbConfigured()) {
    return NextResponse.redirect(new URL("/dashboard?qb=setup", base));
  }

  const state = randomBytes(16).toString("hex");
  const res = NextResponse.redirect(qbAuthUrl(state));
  res.cookies.set("qb_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
