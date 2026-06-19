/**
 * Server-to-server API key validation (used by internal/* routes).
 *
 * Uses timing-safe comparison to prevent timing-based secret enumeration.
 */
import { timingSafeEqual } from "crypto";

export function validateBackendApiKey(provided: string | null): boolean {
  const expected = process.env.BACKEND_API_KEY ?? "";
  if (!expected || !provided) return false;
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(provided);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
