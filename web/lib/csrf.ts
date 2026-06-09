/**
 * CSRF origin guard for mutation endpoints (POST /api/create-order, /api/verify-payment).
 *
 * Validates that the request Origin matches the production domain or localhost
 * in development. Rejects cross-origin requests that browsers automatically
 * attach cookies to (CSRF attacks).
 *
 * Returns a 403 NextResponse if the origin is disallowed, null if it is fine.
 */
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = new Set([
  "https://convertstatement.online",
  "https://www.convertstatement.online",
]);

export function checkCsrfOrigin(req: NextRequest): NextResponse | null {
  // In development, skip the check (localhost has no sensible origin to enforce).
  if (process.env.NODE_ENV !== "production") return null;

  const origin = req.headers.get("origin") ?? "";
  if (!ALLOWED_ORIGINS.has(origin)) {
    return NextResponse.json(
      { error: "Forbidden: cross-origin request not allowed." },
      { status: 403 }
    );
  }
  return null;
}
