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
