import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findByEmail } from "@/lib/auth/users";
import { signJWT } from "@/lib/auth/jwt";
import { sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Pre-computed at module load (12 rounds = same cost as real password hashes).
// Ensures non-existent-email responses take the same time as wrong-password
// responses — prevents email enumeration via timing.
// Fixed string — Math.random() was removed intentionally.
// bcrypt timing depends on cost factor (rounds=12), not the input value,
// so a constant string gives identical timing to a real hash comparison.
const DUMMY_HASH_PROMISE = bcrypt.hash("dummy-constant-never-matches", 12);

export async function POST(req: NextRequest) {
  const limited = await checkRateLimit(req);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const user = await findByEmail(email);

    if (!user) {
      // Always run a full bcrypt comparison to keep timing identical to
      // the valid-user path — prevents enumeration via response latency.
      await bcrypt.compare(password, await DUMMY_HASH_PROMISE);
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await signJWT({
      sub: user.id,
      email: user.email,
      name: user.name,
      tokenVersion: user.tokenVersion ?? 0,
    });

    const res = NextResponse.json({ ok: true, email: user.email });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch {
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
