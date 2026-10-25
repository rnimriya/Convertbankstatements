/**
 * Shared server-side gate for the free tools' QBO downloads.
 * Site pricing rule: CSV/Excel are free for everyone; QBO/QFX/OFX downloads
 * are a Pro (or Business) feature. Free-tool reports stay fully free.
 */
import { getSession } from "@/lib/auth/session";
import { findById } from "@/lib/auth/users";

export type GateVerdict = { ok: true } | { ok: false; reason: "login" | "upgrade" };

export async function qboDownloadGate(): Promise<GateVerdict> {
  const session = await getSession();
  if (!session) return { ok: false, reason: "login" };
  const user = await findById(session.sub).catch(() => null);
  if (!user) return { ok: false, reason: "login" };
  if (user.tier === "PRO" || user.tier === "BUSINESS") return { ok: true };
  return { ok: false, reason: "upgrade" };
}

export const QBO_LOCKED_MESSAGE =
  "QBO download is included on the Pro plan ($20/month). The full report and CSV download above are free — sign in and upgrade to unlock the one-click QBO.";

/**
 * Signup gate, kept for QBO downloads only: scans, reports, and CSV exports
 * are free without an account (scan routes no longer call requireToolUser),
 * but every .qbo download still requires a signed-in Pro/Business account
 * via qboDownloadGate below. Do not re-add this gate to scan routes.
 */
export const SIGNUP_REQUIRED_ERROR =
  "Please create a free account to use this tool.";
export const SIGNUP_REQUIRED_CODE = "SIGNUP_REQUIRED";

/** Returns the logged-in user, or null when anonymous. */
export async function requireToolUser() {
  const session = await getSession();
  if (!session) return null;
  return findById(session.sub).catch(() => null);
}
