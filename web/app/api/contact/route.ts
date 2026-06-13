import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { checkCsrfOrigin } from "@/lib/csrf";
import { getResend, EMAIL_FROM } from "@/lib/email";

export async function POST(req: NextRequest) {
  const csrf = checkCsrfOrigin(req);
  if (csrf) return csrf;

  // Rate limit check
  const limited = await checkRateLimit(req);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }
    if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
      return NextResponse.json({ error: "Subject is required." }, { status: 400 });
    }
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const resend = getResend();

    if (!resend) {
      // Development / Staging fallback: log to console and simulate success
      console.log("================ CONTACT FORM SUBMISSION ==================");
      printSubmission(name, email, subject, message);
      console.log("===========================================================");

      return NextResponse.json({
        ok: true,
        message: "Message logged successfully (Development mode).",
      });
    }

    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: "support@convertstatement.online",
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:580px;margin:0 auto;padding:32px;border:1px solid #f1f5f9;border-radius:12px;background-color:#fff">
          <h2 style="color:#0f172a;margin-top:0;margin-bottom:24px;border-bottom:1px solid #e2e8f0;padding-bottom:12px">New Contact Form Message</h2>
          
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <tr>
              <td style="padding:6px 0;font-weight:600;color:#475569;width:100px">From:</td>
              <td style="padding:6px 0;color:#0f172a">${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-weight:600;color:#475569">Subject:</td>
              <td style="padding:6px 0;color:#0f172a;font-weight:600">${escapeHtml(subject)}</td>
            </tr>
          </table>

          <div style="padding:20px;background-color:#f8fafc;border-radius:8px;border:1px solid #f1f5f9;white-space:pre-wrap;color:#334155;line-height:1.6">
            ${escapeHtml(message)}
          </div>
          
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0 16px">
          <p style="color:#94a3b8;font-size:12px;margin:0">
            Received via Convert Statement Contact Form API.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("[contact-api] Resend error:", error);
      return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "Message sent successfully." });
  } catch (err: unknown) {
    console.error("[contact-api] Server error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

function printSubmission(name: string, email: string, subject: string, message: string) {
  console.log(`From:    ${name} <${email}>`);
  console.log(`Subject: ${subject}`);
  console.log(`Message:\n${message}`);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
