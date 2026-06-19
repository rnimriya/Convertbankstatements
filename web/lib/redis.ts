/**
 * Shared Upstash Redis singleton.
 *
 * Import `getRedis()` anywhere instead of re-instantiating Redis per-module.
 * Returns null when UPSTASH_REDIS_REST_URL is not set (local dev fallback).
 */
import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return _redis;
}

export function requireRedis(): Redis {
  const redis = getRedis();
  if (!redis) throw new Error("Redis is not configured (missing UPSTASH_REDIS_REST_URL)");
  return redis;
}
