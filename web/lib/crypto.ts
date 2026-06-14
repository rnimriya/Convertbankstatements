/**
 * Field-level encryption for secrets stored in Redis (e.g. Google OAuth refresh
 * tokens). AES-256-GCM with a key from FIELD_ENCRYPTION_KEY (64 hex chars = 32
 * bytes). If the key isn't configured, values pass through as plaintext so the
 * app keeps working — no worse than before, and migrates transparently once set.
 *
 * Generate a key: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */
import crypto from "crypto";

const MARKER = "enc:v1:";

function key(): Buffer | null {
  const k = process.env.FIELD_ENCRYPTION_KEY;
  if (!k || k.length < 64) return null;
  try {
    return Buffer.from(k.slice(0, 64), "hex");
  } catch {
    return null;
  }
}

/** Encrypt a value for storage. Returns "" for empty, plaintext if no key, and
 *  is idempotent (won't double-encrypt an already-encrypted value). */
export function encryptField(plain: string | null | undefined): string {
  if (!plain) return "";
  if (plain.startsWith(MARKER)) return plain;
  const k = key();
  if (!k) return plain;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", k, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return MARKER + Buffer.concat([iv, tag, enc]).toString("base64");
}

/** Decrypt a stored value. Plaintext (legacy / no key) passes through unchanged. */
export function decryptField(stored: string | null | undefined): string | null {
  if (!stored) return null;
  if (!stored.startsWith(MARKER)) return stored;
  const k = key();
  if (!k) {
    console.error("[crypto] encountered an encrypted field but FIELD_ENCRYPTION_KEY is not set");
    return null;
  }
  try {
    const raw = Buffer.from(stored.slice(MARKER.length), "base64");
    const iv = raw.subarray(0, 12);
    const tag = raw.subarray(12, 28);
    const data = raw.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", k, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
  } catch (e) {
    console.error("[crypto] decrypt failed:", e);
    return null;
  }
}
