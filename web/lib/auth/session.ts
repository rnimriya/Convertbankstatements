/**
 * Server-side session helpers — reads the JWT from the `bs_token` cookie.
 */
import { cookies } from "next/headers";
import { verifyJWT, type JWTPayload } from "./jwt";
import { getTokenVersion } from "./users";
import { isDeployed } from "@/lib/env";

export const SESSION_COOKIE = "bs_token";

export async function getSession(): Promise<JWTPayload | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifyJWT(token);
  if (!payload) return null;

  // Session-revocation check: reject tokens minted before the user's last
  // password change / "log out everywhere". Fail OPEN on infra errors so a
  // transient store outage doesn't log everyone out.
  try {
    const current = await getTokenVersion(payload.sub);
    if (current === null) return null; // user no longer exists
    if (current !== payload.tokenVersion) return null; // stale/revoked session
  } catch {
    // store unreachable — accept the cryptographically-valid token
  }

  return payload;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: isDeployed(),
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days — matches the JWT TTL; slid on activity
  };
}
