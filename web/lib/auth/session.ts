/**
 * Server-side session helpers — reads the JWT from the `bs_token` cookie.
 */
import { cookies } from "next/headers";
import { verifyJWT, type JWTPayload } from "./jwt";

export const SESSION_COOKIE = "bs_token";

export async function getSession(): Promise<JWTPayload | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyJWT(token);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  };
}
