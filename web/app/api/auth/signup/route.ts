import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser, findByReferralCode } from "@/lib/auth/users";
import { signJWT } from "@/lib/auth/jwt";
import { sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

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

    // Resolve the referrer up front and persist it on the new account. Crediting
    // is deferred until the user verifies their email (see creditReferralForUser),
    // so unverified throwaway accounts can't farm free pages.
    let referrerId: string | undefined;
    if (referralCode) {
      const referrer = await findByReferralCode(referralCode).catch(() => null);
      // Reject self-referral (same email registered twice).
      if (referrer && referrer.email !== email.toLowerCase()) {
        referrerId = referrer.id;
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser(email, passwordHash, name, referrerId);

    const token = await signJWT({
      sub: user.id,
      email: user.email,
      name: user.name,
      tokenVersion: user.tokenVersion ?? 0,
    });

    const res = NextResponse.json({ ok: true, email: user.email });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (err: unknown) {
    // Do not echo internal errors or explicitly confirm that an email is already
    // registered — that enables account enumeration. Return a neutral message
    // that's identical whether the email exists or another error occurred.
    const isDuplicate =
      err instanceof Error && /already exists/i.test(err.message);
    if (!isDuplicate) console.error("[signup] error:", err);
    return NextResponse.json(
      { error: "Could not complete signup. If you already have an account, try logging in." },
      { status: 400 }
    );
  }
}
