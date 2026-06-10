import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getSession } from "@/lib/auth/session";
import { findById, setEmailVerifyToken } from "@/lib/auth/users";
import { checkRateLimit } from "@/lib/rate-limit";

async function sendVerificationEmail(email: string, name: string | null, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://convertstatement.com";
  const link = `${baseUrl}/verify-email?token=${token}`;

  if (process.env.RESEND_API_KEY) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Convert Statement <noreply@convertstatement.com>",
        to: [email],
        subject: "Verify your email — Convert Statement",
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;">
            <img src="${baseUrl}/logo.svg" alt="Convert Statement" width="40" style="margin-bottom:24px"/>
            <h2 style="margin:0 0 8px;font-size:22px;color:#0f172a;">Verify your email</h2>
            <p style="margin:0 0 24px;color:#64748b;font-size:15px;">
              Hi ${name ?? "there"}, click the button below to verify your email address.
            </p>
            <a href="${link}" style="display:inline-block;background:#1a47c8;color:#fff;font-weight:700;font-size:15px;padding:12px 28px;border-radius:12px;text-decoration:none;">
              Verify email
            </a>
            <p style="margin:24px 0 0;color:#94a3b8;font-size:13px;">
              Or copy this link: ${link}<br/>This link expires in 24 hours.
            </p>
          </div>
        `,
      }),
    });
  } else {
    // Dev fallback — just log the link
    console.log(`[email-verify] Link for ${email}: ${link}`);
  }
}

export async function POST(req: NextRequest) {
  const limited = await checkRateLimit(req);
  if (limited) return limited;

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findById(session.sub);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.emailVerified) {
    return NextResponse.json({ ok: true, message: "Already verified" });
  }

  const token = randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h

  await setEmailVerifyToken(user.id, token, expiry);
  await sendVerificationEmail(user.email, user.name, token);

  return NextResponse.json({ ok: true });
}
