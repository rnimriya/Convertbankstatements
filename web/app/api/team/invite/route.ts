import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { findById } from "@/lib/auth/users";
import { getRedis } from "@/lib/redis";
import { getResend, EMAIL_FROM } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email("Invalid email address."),
});

async function sendInviteEmail(to: string, inviterName: string | null, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://convertstatement.online";
  const link = `${baseUrl}/join-team?token=${token}`;

  const resend = getResend();
  if (resend) {
    const { error } = await resend.emails.send(
      {
        from: EMAIL_FROM,
        to,
        subject: `${inviterName ?? "Someone"} invited you to their team on Convert Statement`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;">
            <h2 style="font-size:22px;color:#0f172a;">You've been invited</h2>
            <p style="color:#64748b;font-size:15px;">${inviterName ?? "A colleague"} has invited you to join their Convert Statement Business team.</p>
            <a href="${link}" style="display:inline-block;background:#1a47c8;color:#fff;font-weight:700;padding:12px 28px;border-radius:12px;text-decoration:none;">Accept invitation</a>
            <p style="color:#94a3b8;font-size:13px;margin-top:24px;">This invitation expires in 7 days.</p>
          </div>`,
      },
      { idempotencyKey: `team-invite/${token}` }
    );
    if (error) console.error("[team-invite] Resend error:", error);
  } else {
    console.log(`[team-invite] Link for ${to}: ${link}`);
  }
}

export async function POST(req: NextRequest) {
  const limited = await checkRateLimit(req);
  if (limited) return limited;

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findById(session.sub);
  if (!user || user.tier !== "BUSINESS") {
    return NextResponse.json({ error: "Business plan required." }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { email } = parsed.data;
  const memberId = randomUUID();
  const token = randomUUID();
  const teamId = user.teamId ?? user.id;

  const member = {
    id: memberId,
    email,
    name: null,
    role: "member",
    status: "pending",
    joinedAt: new Date().toISOString(),
    inviteToken: token,
  };

  const redis = getRedis();
  if (redis) {
    const pipe = redis.pipeline();
    pipe.hset(`cs:team:${teamId}`, { [`member:${memberId}`]: JSON.stringify(member) });
    pipe.set(`cs:invite:${token}`, JSON.stringify({ memberId, teamId, email }), { ex: 604800 });
    await pipe.exec();
  }

  await sendInviteEmail(email, user.name, token);

  return NextResponse.json({ ok: true, memberId });
}
