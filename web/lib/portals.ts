/**
 * Client Upload Portals — Redis data model:
 *   cs:portal:{token}          → HASH  {ownerId, label, active, createdAt}
 *   cs:portals-by-user:{uid}   → SET   of portal tokens (for listing)
 */
import { randomBytes } from "crypto";
import { Redis } from "@upstash/redis";

export interface Portal {
  token: string;
  ownerId: string;
  label: string;
  active: boolean;
  createdAt: string;
}

// ── In-memory fallback for local dev ─────────────────────────────────────────

const _memPortals = new Map<string, Portal>();
const _memByUser = new Map<string, Set<string>>();

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

const PK = (token: string) => `cs:portal:${token}`;
const UPK = (uid: string) => `cs:portals-by-user:${uid}`;

// ── Public API ────────────────────────────────────────────────────────────────

export async function createPortal(ownerId: string, label: string): Promise<Portal> {
  const token = randomBytes(16).toString("hex"); // 32-char hex token
  const portal: Portal = {
    token,
    ownerId,
    label: label.trim() || "Upload Portal",
    active: true,
    createdAt: new Date().toISOString(),
  };

  if (useRedis()) {
    const pipe = r().pipeline();
    pipe.hset(PK(token), {
      token, ownerId, label: portal.label, active: "1", createdAt: portal.createdAt,
    });
    pipe.sadd(UPK(ownerId), token);
    await pipe.exec();
  } else {
    _memPortals.set(token, portal);
    if (!_memByUser.has(ownerId)) _memByUser.set(ownerId, new Set());
    _memByUser.get(ownerId)!.add(token);
  }
  return portal;
}

export async function getPortal(token: string): Promise<Portal | null> {
  if (useRedis()) {
    const h = await r().hgetall(PK(token));
    if (!h) return null;
    const raw = h as Record<string, string>;
    return {
      token: raw.token,
      ownerId: raw.ownerId,
      label: raw.label,
      active: raw.active === "1",
      createdAt: raw.createdAt,
    };
  }
  return _memPortals.get(token) ?? null;
}

export async function listPortals(ownerId: string): Promise<Portal[]> {
  if (useRedis()) {
    const tokens = await r().smembers(UPK(ownerId));
    if (!tokens || tokens.length === 0) return [];
    const portals = await Promise.all(tokens.map(t => getPortal(t as string)));
    return portals.filter((p): p is Portal => p !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const tokens = _memByUser.get(ownerId);
  if (!tokens) return [];
  return Array.from(tokens)
    .map(t => _memPortals.get(t))
    .filter((p): p is Portal => p !== undefined)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function deactivatePortal(token: string, ownerId: string): Promise<boolean> {
  const portal = await getPortal(token);
  if (!portal || portal.ownerId !== ownerId) return false;

  if (useRedis()) {
    await r().hset(PK(token), { active: "0" });
  } else {
    const p = _memPortals.get(token);
    if (p) p.active = false;
  }
  return true;
}
