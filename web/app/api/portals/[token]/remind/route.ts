import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getPortal, markReminderSent } from "@/lib/portals";
import { checkCsrfOrigin } from "@/lib/csrf";
import { getResend, EMAIL_FROM } from "@/lib/email";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * POST /api/portals/{token}/remind — owner-only statement reminder email.
 * Sends the portal's client a reminder containing their upload link.
 * Rate-limited to one reminder per portal per 24 hours (via lastReminderAt)
 * so a client is never spammed by repeated clicks. Email delivery uses the
 * site's existing Resend setup; when Resend is not configured the route
 * reports that honestly instead of pretending the reminder went out.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const csrf = checkCsrfOrigin(req);
  if (csrf) return csrf;

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { token } = await params;
  const portal = await getPortal(token);
  if (!portal || portal.ownerId !== session.sub) {
    return NextResponse.json({ error: "Portal not found or access denied" }, { status: 404 });
  }
  if (!portal.active) {
    return NextResponse.json({ error: "This portal is deactivated." }, { status: 400 });
  }
  if (!portal.clientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(portal.clientEmail)) {
    return NextResponse.json(
      { error: "No client email is saved for this portal. Recreate the portal with a client email to enable reminders." },
      { status: 400 }
    );
  }
  if (portal.lastReminderAt) {
    const last = new Date(portal.lastReminderAt).getTime();
    if (!Number.isNaN(last) && Date.now() - last < DAY_MS) {
      return NextResponse.json(
        { error: "A reminder was already sent for this portal in the last 24 hours. Please wait before sending another." },
        { status: 429 }
      );
    }
  }

  const resend = getResend();
  if (!resend) {
    return NextResponse.json(
      { error: "Email sending is not configured on this site right now, so the reminder could not be sent." },
      { status: 503 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://convertstatement.online";
  const url = `${baseUrl}/p/${portal.token}`;
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: portal.clientEmail,
    subject: "Reminder: please upload your bank statement",
    html: `<p>Hello,</p><p>This is a friendly reminder to upload your bank statement using the link below. It takes a minute, and no account is needed on your side.</p><p><a href="${url}">${url}</a></p><p>Thank you!</p>`,
    text: `Hello,\n\nThis is a friendly reminder to upload your bank statement using this link (no account needed on your side):\n${url}\n\nThank you!`,
  });
  if (error) {
    return NextResponse.json({ error: "The reminder email could not be sent. Please try again later." }, { status: 502 });
  }

  await markReminderSent(token);
  return NextResponse.json({ ok: true, sentTo: portal.clientEmail });
}
