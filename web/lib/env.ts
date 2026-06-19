/**
 * Environment detection for security-sensitive toggles.
 *
 * Controls that protect production (CSRF enforcement, the cookie `Secure` flag,
 * debug-only responses) must FAIL SECURE: anything that isn't unambiguously local
 * development is treated as a deployed environment. We never key these on
 * `NODE_ENV !== "production"`, because a single mis-set env var would silently
 * disable every control at once.
 */

/**
 * True only in genuine local development (e.g. `next dev` on a laptop).
 *
 * Vercel sets `VERCEL=1` in every deployed environment (production, preview, and
 * its own "development" environment), so its presence means "deployed" → enforce.
 */
export function isLocalDev(): boolean {
  if (process.env.VERCEL) return false;
  return process.env.NODE_ENV !== "production";
}

/** True whenever production-grade security controls should be enforced. */
export function isDeployed(): boolean {
  return !isLocalDev();
}
