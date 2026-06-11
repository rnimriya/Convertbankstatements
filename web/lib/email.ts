/**
 * Shared email config.
 *
 * All transactional emails must use EMAIL_FROM so the sender address
 * stays consistent and only needs to be updated in one place.
 */
import { Resend } from "resend";

export const EMAIL_FROM = "Convert Statement <noreply@convertstatement.online>";

let _resend: Resend | null = null;

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!_resend) _resend = new Resend(key);
  return _resend;
}
