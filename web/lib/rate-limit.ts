/**
 * In-memory rate limiter for auth endpoints.
 * 10 requests per IP per minute, sliding window.
 *
 * Per-serverless-instance (good enough for a small startup).
 * Swap for a Redis-backed solution when traffic warrants it.
 */
import { NextRequest, NextResponse } from "next/server";

const store = new Map<string, { count: number; resetAt: number }>();

function allow(ip: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = store.get(ip) ?? { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + windowMs; }
  entry.count++;
  store.set(ip, entry);
  return entry.count <= limit;
}

export async function checkRateLimit(req: NextRequest): Promise<NextResponse | null> {
  const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0].trim();
  if (!allow(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }
  return null;
}
