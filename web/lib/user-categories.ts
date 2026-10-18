/**
 * Learned category rules per user — Redis data model:
 *   cs:catrules:{uid} → HASH { PATTERN: Category }
 * When a transaction description contains PATTERN (case-insensitive),
 * the user's category wins over the built-in rules. In-memory fallback
 * for local dev (same pattern as lib/portals.ts).
 */
import { Redis } from "@upstash/redis";

export interface CategoryRule {
  pattern: string;
  category: string;
}

const _mem = new Map<string, Map<string, string>>();

function useRedis(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

let _redis: Redis | null = null;
function r(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return _redis;
}

const KEY = (uid: string) => `cs:catrules:${uid}`;
const MAX_RULES = 200;

export async function listCategoryRules(uid: string): Promise<CategoryRule[]> {
  if (useRedis()) {
    const hash = (await r().hgetall(KEY(uid))) as Record<string, string> | null;
    if (!hash) return [];
    return Object.entries(hash)
      .map(([pattern, category]) => ({ pattern, category }))
      .sort((a, b) => a.pattern.localeCompare(b.pattern));
  }
  const m = _mem.get(uid);
  if (!m) return [];
  return [...m.entries()]
    .map(([pattern, category]) => ({ pattern, category }))
    .sort((a, b) => a.pattern.localeCompare(b.pattern));
}

export async function getCategoryRuleTuples(uid: string): Promise<[string, string][]> {
  const rules = await listCategoryRules(uid);
  return rules.map((x) => [x.pattern, x.category]);
}

export async function setCategoryRule(uid: string, pattern: string, category: string): Promise<void> {
  const p = pattern.trim().toUpperCase().slice(0, 60);
  const c = category.trim().slice(0, 40);
  if (!p || !c) throw new Error("Pattern and category are required");
  const existing = await listCategoryRules(uid);
  if (existing.length >= MAX_RULES && !existing.some((x) => x.pattern === p)) {
    throw new Error(`Rule limit reached (${MAX_RULES})`);
  }
  if (useRedis()) {
    await r().hset(KEY(uid), { [p]: c });
  } else {
    if (!_mem.has(uid)) _mem.set(uid, new Map());
    _mem.get(uid)!.set(p, c);
  }
}

export async function deleteCategoryRule(uid: string, pattern: string): Promise<void> {
  const p = pattern.trim().toUpperCase();
  if (useRedis()) {
    await r().hdel(KEY(uid), p);
  } else {
    _mem.get(uid)?.delete(p);
  }
}
