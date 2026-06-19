/**
 * Structured security-event logging. Emits one-line JSON that Vercel captures;
 * forward to a SIEM via Vercel Log Drains. NEVER include secrets, tokens, raw
 * passwords, or full PII — use ids/hashes and coarse context only.
 */
export type SecurityEvent =
  | "auth.login.success"
  | "auth.login.failure"
  | "auth.password_change"
  | "auth.password_reset"
  | "admin.access_denied"
  | "webhook.signature_invalid"
  | "billing.tier_change"
  | "ratelimit.triggered";

export function logSecurityEvent(event: SecurityEvent, details: Record<string, unknown> = {}): void {
  try {
    console.log(JSON.stringify({ tag: "security", event, ts: new Date().toISOString(), ...details }));
  } catch {
    /* logging must never throw */
  }
}

/** Best-effort client IP from forwarding headers (for audit context). */
export function ipFromHeaders(headers: Headers): string {
  return (headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
}
