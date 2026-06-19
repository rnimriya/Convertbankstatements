/**
 * Shared email config.
 *
 * All transactional emails must use EMAIL_FROM so the sender address
 * stays consistent and only needs to be updated in one place.
 */
import { Resend } from "resend";
import { isDeployed } from "@/lib/env";

export const EMAIL_FROM = "Convert Statement <noreply@convertstatement.online>";

let _resend: Resend | null = null;
let _warned = false;

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (isDeployed() && !_warned) {
      _warned = true;
      console.error("[email] RESEND_API_KEY is not set — transactional email (verification, password reset, invites, contact) is DISABLED. Set RESEND_API_KEY and verify the sending domain in Resend.");
    }
    return null;
  }
  if (!_resend) _resend = new Resend(key);
  return _resend;
}
