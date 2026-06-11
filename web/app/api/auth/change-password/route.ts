import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getSession, SESSION_COOKIE } from "@/lib/auth/session";
import { findById, changePassword } from "@/lib/auth/users";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(8, "New password must be at least 8 characters."),
});

export async function POST(req: NextRequest) {
  const limited = await checkRateLimit(req);
  if (limited) return limited;

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const user = await findById(session.sub);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const valid = await bcrypt.compare(parsed.data.oldPassword, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
  }

  const hash = await bcrypt.hash(parsed.data.newPassword, 12);
  await changePassword(user.id, hash);

  // Invalidate the current session — forces re-login with the new password.
  // Closes the window where a stolen/compromised session persists post-change.
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
