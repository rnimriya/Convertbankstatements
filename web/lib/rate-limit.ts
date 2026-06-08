/**
 * Rate limiting for auth endpoints.
 * Uses @upstash/ratelimit with the same Redis instance as the user store
 * (10 req/IP/min, sliding window, globally consistent across all Vercel instances).
 * Falls back to a per-instance in-memory window when Redis is not configured.
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

// Per-instance in-memory fallback (local dev / no Redis configured)
const memStore = new Map<string, { count: number; resetAt: number }>();

function memAllow(ip: string): boolean {
  const now = Date.now();
  const entry = memStore.get(ip) ?? { count: 0, resetAt: now + 60_000 };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + 60_000; }
  entry.count++;
  memStore.set(ip, entry);
  return entry.count <= 10;
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

  if (!memAllow(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }
  return null;
}
