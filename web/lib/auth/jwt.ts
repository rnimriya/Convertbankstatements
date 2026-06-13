import { SignJWT, jwtVerify } from "jose";

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) {
    throw new Error("JWT_SECRET env var is required and must be at least 32 characters");
  }
  return new TextEncoder().encode(s);
}

export interface JWTPayload {
  sub: string;
  email: string;
  name: string | null;
  /** Monotonic session-revocation counter. Bumped on password change / logout-all. */
  tokenVersion: number;
}

export async function signJWT(payload: JWTPayload): Promise<string> {
  return new SignJWT({
    email: payload.email,
    name: payload.name,
    tv: payload.tokenVersion ?? 0,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());

    // BUG-08: validate required claims exist before trusting the payload.
    // A JWT signed without sub/email (e.g. hand-crafted, or from a future schema change)
    // would pass verification but produce undefined fields that crash downstream callers
    // expecting non-null sub/email (findById, getSession, all auth-gated routes).
    const sub = payload.sub as string | undefined;
    const email = payload.email as string | undefined;
    if (!sub || !email) {
      console.warn("[jwt] Token missing required claims (sub or email)");
      return null;
    }

    return {
      sub,
      email,
      name: (payload.name as string | null) ?? null,
      tokenVersion: typeof payload.tv === "number" ? payload.tv : 0,
    };
  } catch {
    return null;
  }
}
