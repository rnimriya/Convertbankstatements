/**
 * Admin authorization. Trusting a JWT email claim alone is unsafe — an
 * unverified/squatted email could match ADMIN_EMAIL. Require BOTH that the
 * session email equals ADMIN_EMAIL AND that the underlying account has a
 * verified email before granting admin access.
 */
import { getSession } from "./session";
import { findById } from "./users";
import type { JWTPayload } from "./jwt";

export async function getAdminSession(): Promise<JWTPayload | null> {
  const session = await getSession();
  if (!session) return null;

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || session.email.toLowerCase() !== adminEmail.toLowerCase()) {
    return null;
  }

  // Prove the account actually owns the email (defeats email-squatting before
  // the real admin has verified their address).
  const user = await findById(session.sub);
  if (!user || !user.emailVerified) return null;

  return session;
}
