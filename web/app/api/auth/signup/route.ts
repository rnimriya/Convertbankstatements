import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser, findByReferralCode, creditPages } from "@/lib/auth/users";
import { signJWT } from "@/lib/auth/jwt";
import { sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const REFERRAL_BONUS_PAGES = 50;

const schema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  name: z.string().optional(),
  referralCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const limited = await checkRateLimit(req);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, name, referralCode } = parsed.data;

    // Resolve referral code before creating user (non-blocking — ignore invalid codes)
    let referrerId: string | null = null;
    if (referralCode) {
      const referrer = await findByReferralCode(referralCode).catch(() => null);
      if (referrer) referrerId = referrer.id;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser(email, passwordHash, name, referrerId ?? undefined);

    // Credit both parties with bonus pages.
    // Isolated in its own try-catch: a Redis failure here must not roll back the
    // signup or leak an error message — the account is already created and the
    // JWT is about to be issued. Lost referral pages are non-critical and can be
    // corrected manually if needed.
    if (referrerId) {
      try {
        await Promise.all([
          creditPages(user.id, REFERRAL_BONUS_PAGES),
          creditPages(referrerId, REFERRAL_BONUS_PAGES),
        ]);
      } catch (err) {
        console.error("[signup] referral credit failed for user", user.id, err);
      }
    }

    const token = await signJWT({ sub: user.id, email: user.email, name: user.name });

    const res = NextResponse.json({ ok: true, email: user.email });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Signup failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
