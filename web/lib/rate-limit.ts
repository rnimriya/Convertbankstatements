/**
 * Rate limiting for auth endpoints.
 * Uses @upstash/ratelimit with the same Redis instance as the user store
 * (10 req/IP/min, sliding window, globally consistent across all Vercel instances).
 * Falls back to a per-instance in-memory window when Redis is not configured.
 */
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

interface Bucket {
  /** Max requests allowed per window. */
  limit: number;
  /** Upstash sliding-window duration string. */
  window: `${number} ${"s" | "m" | "h"}`;
  /** Redis key prefix — keep buckets isolated so auth & uploads don't share a budget. */
  prefix: string;
}

// Default auth bucket: 10 req/IP/min.
const AUTH_BUCKET: Bucket = { limit: 10, window: "1 m", prefix: "cs:rl" };
// Upload bucket: stricter — each upload can trigger a paid Claude Vision call.
const UPLOAD_BUCKET: Bucket = { limit: 8, window: "1 m", prefix: "cs:rl:upload" };

const _rl = new Map<string, Ratelimit>();

function getRatelimit(bucket: Bucket): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL) return null;
  if (!_rl.has(bucket.prefix)) {
    _rl.set(
      bucket.prefix,
      new Ratelimit({
        redis: new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL!,
          token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        }),
        limiter: Ratelimit.slidingWindow(bucket.limit, bucket.window),
        prefix: bucket.prefix,
      })
    );
  }
  return _rl.get(bucket.prefix)!;
}

// Per-instance in-memory fallback (local dev / no Redis configured)
const memStore = new Map<string, { count: number; resetAt: number }>();

function memAllow(key: string, limit: number): boolean {
  const now = Date.now();
  const entry = memStore.get(key) ?? { count: 0, resetAt: now + 60_000 };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + 60_000; }
  entry.count++;
  memStore.set(key, entry);
  return entry.count <= limit;
}

function clientIp(req: NextRequest): string {
  return (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0].trim();
}

async function enforce(req: NextRequest, bucket: Bucket): Promise<NextResponse | null> {
  const ip = clientIp(req);
  const rl = getRatelimit(bucket);

  const allowed = rl
    ? (await rl.limit(ip)).success
    : memAllow(`${bucket.prefix}:${ip}`, bucket.limit);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }
  return null;
}

export async function checkRateLimit(req: NextRequest): Promise<NextResponse | null> {
  return enforce(req, AUTH_BUCKET);
}

/** Stricter limiter for file-processing endpoints (cost-amplification protection). */
export async function checkUploadRateLimit(req: NextRequest): Promise<NextResponse | null> {
  return enforce(req, UPLOAD_BUCKET);
}
