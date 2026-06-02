/**
 * JWT helpers using `jose` — already bundled with Next.js, no extra deps.
 */
import { SignJWT, jwtVerify } from "jose";

const secret = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET ?? "dev-secret-please-change-in-production-32chars"
  );

export interface JWTPayload {
  sub: string;       // user id
  email: string;
  name: string | null;
}

export async function signJWT(payload: JWTPayload): Promise<string> {
  return new SignJWT({ email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      name: (payload.name as string | null) ?? null,
    };
  } catch {
    return null;
  }
}
