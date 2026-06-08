/**
 * Rate limiting for auth endpoints.
 *
 * When UPSTASH_REDIS_REST_URL is set: uses @upstash/ratelimit (global across
 * all Vercel instances — 10 requests per IP per minute).
 *
 * Without Redis (local dev): falls back to a per-instance in-memory sliding
 * window with the same parameters.
 */
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let _rl: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL) return null;
  if (!_rl) {
    _rl = new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      }),
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      prefix: "cs:rl",
    });
  }
  return _rl;
}

// Per-instance in-memory fallback (local dev / no Redis)
const memStore = new Map<string, { count: number; resetAt: number }>();

function memLimit(ip: string): boolean {
  const now = Date.now();
  const window = 60_000;
  const limit = 10;
  const entry = memStore.get(ip) ?? { count: 0, resetAt: now + window };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + window; }
  entry.count++;
  memStore.set(ip, entry);
  return entry.count <= limit;
}

export async function checkRateLimit(req: NextRequest): Promise<NextResponse | null> {
  const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0].trim();
  const rl = getRatelimit();

  if (rl) {
    const { success } = await rl.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }
    return null;
  }

  if (!memLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }
  return null;
}
