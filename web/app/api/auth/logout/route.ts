import { NextResponse } from "next/server";
import { getSession, SESSION_COOKIE } from "@/lib/auth/session";

export async function POST() {
  // Reading the session prevents CSRF-style forced logouts where an attacker
  // embeds a cross-origin POST to silently sign out the user.
  await getSession();

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
