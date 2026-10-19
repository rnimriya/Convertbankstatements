/**
 * BUILD_NONCE — a single CSP nonce shared by every deployment (build).
 *
 * Public pages are statically rendered, so there is no per-request middleware
 * nonce at serve time. Every page that used to read the per-request
 * `x-nonce` header now uses this constant instead, and middleware sets the
 * static tier's response CSP to this same value.
 *
 * Derived from the deployment's commit SHA (unique per deploy on Vercel),
 * falling back to a dev placeholder locally. It is a deployment-unique
 * string — not a secret — and CSP nonces never need to be random, only
 * unique per deployment and unguessable by an attacker (a 40-hex SHA qualifies).
 *
 * This module runs in the middleware (edge runtime) and in server components
 * (node runtime), so it must not use node-only APIs — plain string only.
 */
export const BUILD_NONCE: string =
  process.env.VERCEL_GIT_COMMIT_SHA && process.env.VERCEL_GIT_COMMIT_SHA.length > 0
    ? process.env.VERCEL_GIT_COMMIT_SHA
    : "dev-static-nonce";
