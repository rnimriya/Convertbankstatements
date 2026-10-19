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
