import { NextRequest, NextResponse } from "next/server";
import { findByEmail, setResetToken } from "@/lib/auth/users";
import { checkRateLimit } from "@/lib/rate-limit";
import { randomUUID } from "crypto";
import { Resend } from "resend";

const SUCCESS_MSG = "If an account exists with that email, a password reset link has been sent.";

export async function POST(req: NextRequest) {
  const limited = await checkRateLimit(req);
  if (limited) return limited;

  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = await findByEmail(email);
    if (!user) {
      return NextResponse.json({ ok: true, message: SUCCESS_MSG });
    }

    const token = randomUUID();
    const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    await setResetToken(user.email, token, expiry);

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    await sendResetEmail(user.email, resetUrl);

    return NextResponse.json({
      ok: true,
      message: SUCCESS_MSG,
      ...(process.env.NODE_ENV === "development" ? { resetUrl } : {}),
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

async function sendResetEmail(to: string, resetUrl: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEV] Password reset link for ${to}: ${resetUrl}`);
    } else {
      console.error("[forgot-password] RESEND_API_KEY not configured — email not sent");
    }
    return;
  }

  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: "Convert Statement <onboarding@resend.dev>",
    to,
    subject: "Reset your Convert Statement password",
    html: `
      <div style="font-family:sans-serif;max-width:580px;margin:0 auto;padding:32px">
        <h2 style="color:#16a34a;margin-bottom:8px">Reset your password</h2>
        <p style="color:#374151">Click the button below to reset your Convert Statement password.
           This link expires in <strong>1 hour</strong>.</p>
        <a href="${resetUrl}"
           style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;
                  padding:12px 28px;border-radius:6px;font-weight:600;margin:20px 0;font-size:15px">
          Reset Password
        </a>
        <p style="color:#6b7280;font-size:13px;margin-top:24px">
          If you didn't request a password reset, you can safely ignore this email.
          Your account password will not change.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
        <p style="color:#9ca3af;font-size:12px">
          Convert Statement &mdash; Convert Indian bank statements to Excel
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("[forgot-password] Resend error:", error);
  }
}
