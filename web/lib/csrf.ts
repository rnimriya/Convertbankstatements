/**
 * CSRF origin guard for mutation endpoints.
 *
 * Validates that the request Origin matches an allowed production origin.
 * Rejects cross-origin requests that browsers automatically attach cookies to.
 *
 * The allowlist is derived from the app's own configured URLs (so it can't go
 * stale if the domain changes) plus the known production domains. Returns a 403
 * NextResponse if the origin is disallowed, null if it is fine.
 */
import { NextRequest, NextResponse } from "next/server";
import { isLocalDev } from "@/lib/env";

/** Normalize a URL (or origin) string to its bare origin, or null if unusable. */
function toOrigin(value: string | undefined | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

let _allowed: Set<string> | null = null;

function allowedOrigins(): Set<string> {
  if (_allowed) return _allowed;
  const origins = [
    "https://convertstatement.online",
    "https://www.convertstatement.online",
    // Derived from the app's own configured URLs so the allowlist tracks the
    // real deployment domain (custom domain, preview, etc.) automatically.
    toOrigin(process.env.NEXT_PUBLIC_BASE_URL),
    toOrigin(process.env.NEXTAUTH_URL),
    toOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`),
    toOrigin(process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`),
  ].filter((o): o is string => Boolean(o));
  _allowed = new Set(origins);
  return _allowed;
}

export function checkCsrfOrigin(req: NextRequest): NextResponse | null {
  // Skip only in genuine local development; any deployed environment enforces.
  // (Fail secure — never key this on NODE_ENV alone.)
  if (isLocalDev()) return null;

  const origin = req.headers.get("origin") ?? "";
  if (!allowedOrigins().has(origin)) {
    return NextResponse.json(
      { error: "Forbidden: cross-origin request not allowed." },
      { status: 403 }
    );
  }
  return null;
}
