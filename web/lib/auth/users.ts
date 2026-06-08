/**
 * User store — Upstash Redis in production (persistent, atomic),
 * local JSON file in development.
 *
 * Redis data model:
 *   cs:user:{id}       → HASH   (all user fields; HINCRBY for atomic page increments)
 *   cs:email:{email}   → STRING userId   (email lookup index, SET NX for atomic signup)
 *   cs:rtoken:{token}  → STRING userId   (reset-token reverse index, TTL = 1 h)
 *   cs:payg:{payId}    → STRING userId   (one-time PAYG payment markers, TTL = 2 h)
 */
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { Redis } from "@upstash/redis";

// ── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string;
  pagesUsed: number;
  tier: "FREE" | "PRO" | "BUSINESS";
  monthlyPageLimit: number;
  razorpayCustomerId: string | null;
  createdAt: string;
  resetToken?: string | null;
  resetTokenExpiry?: string | null;
}

// ── Backend selection ────────────────────────────────────────────────────────

function useRedis(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
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

// ── Redis key helpers ────────────────────────────────────────────────────────

const UK = (id: string) => `cs:user:${id}`;
const EK = (email: string) => `cs:email:${email.toLowerCase()}`;
const RK = (token: string) => `cs:rtoken:${token}`;
const PK = (payId: string) => `cs:payg:${payId}`;

// ── Type marshalling ─────────────────────────────────────────────────────────

function toHash(u: User): Record<string, string | number> {
  return {
    id: u.id,
    email: u.email,
    name: u.name ?? "",
    passwordHash: u.passwordHash,
    pagesUsed: u.pagesUsed,
    tier: u.tier,
    monthlyPageLimit: u.monthlyPageLimit,
    razorpayCustomerId: u.razorpayCustomerId ?? "",
    createdAt: u.createdAt,
    resetToken: u.resetToken ?? "",
    resetTokenExpiry: u.resetTokenExpiry ?? "",
  };
}

function fromHash(h: Record<string, string>): User {
  return {
    id: h.id,
    email: h.email,
    name: h.name || null,
    passwordHash: h.passwordHash,
    pagesUsed: parseInt(h.pagesUsed ?? "0", 10),
    tier: (h.tier || "FREE") as User["tier"],
    monthlyPageLimit: parseInt(h.monthlyPageLimit ?? "8", 10),
    razorpayCustomerId: h.razorpayCustomerId || null,
    createdAt: h.createdAt,
    resetToken: h.resetToken || null,
    resetTokenExpiry: h.resetTokenExpiry || null,
  };
}

// ── File backend (local dev) ─────────────────────────────────────────────────

const FILE = path.join(process.cwd(), "data", "users.json");

async function fileEnsure() {
  await fs.mkdir(path.dirname(FILE), { recursive: true }).catch(() => {});
  try { await fs.access(FILE); }
  catch { await fs.writeFile(FILE, "[]"); }
}

async function fileRead(): Promise<User[]> {
  await fileEnsure();
  try { return JSON.parse(await fs.readFile(FILE, "utf8")) as User[]; }
  catch { return []; }
}

async function fileWrite(users: User[]) {
  await fileEnsure();
  await fs.writeFile(FILE, JSON.stringify(users, null, 2));
}

// ── Seed account ─────────────────────────────────────────────────────────────

let _seeded = false;

async function ensureSeed() {
  if (_seeded) return;
  _seeded = true;
  const email = process.env.SEED_USER_EMAIL;
  const passwordHash = process.env.SEED_USER_PASSWORD_HASH;
  if (!email || !passwordHash) return;

  try {
    if (useRedis()) {
      const exists = await r().get(EK(email));
      if (exists) return;
      const user: User = {
        id: "seed-user-001",
        email: email.toLowerCase(),
        name: process.env.SEED_USER_NAME ?? null,
        passwordHash,
        pagesUsed: 0,
        tier: "FREE",
        monthlyPageLimit: 8,
        razorpayCustomerId: null,
        createdAt: new Date().toISOString(),
      };
      const claimed = await r().set(EK(email), user.id, { nx: true });
      if (claimed) await r().hset(UK(user.id), toHash(user));
    } else {
      const users = await fileRead();
      if (users.length === 0) {
        const user: User = {
          id: "seed-user-001",
          email: email.toLowerCase(),
          name: process.env.SEED_USER_NAME ?? null,
          passwordHash,
          pagesUsed: 0,
          tier: "FREE",
          monthlyPageLimit: 8,
          razorpayCustomerId: null,
          createdAt: new Date().toISOString(),
        };
        await fileWrite([user]);
      }
    }
  } catch { /* non-fatal */ }
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function findByEmail(email: string): Promise<User | null> {
  await ensureSeed();
  if (useRedis()) {
    const id = await r().get<string>(EK(email));
    if (!id) return null;
    const hash = await r().hgetall(UK(id));
    if (!hash) return null;
    return fromHash(hash as Record<string, string>);
  }
  const users = await fileRead();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function findById(id: string): Promise<User | null> {
  await ensureSeed();
  if (useRedis()) {
    const hash = await r().hgetall(UK(id));
    if (!hash) return null;
    return fromHash(hash as Record<string, string>);
  }
  const users = await fileRead();
  return users.find(u => u.id === id) ?? null;
}

export async function createUser(
  email: string,
  passwordHash: string,
  name?: string
): Promise<User> {
  const user: User = {
    id: randomUUID(),
    email: email.toLowerCase(),
    name: name ?? null,
    passwordHash,
    pagesUsed: 0,
    tier: "FREE",
    monthlyPageLimit: 8,
    razorpayCustomerId: null,
    createdAt: new Date().toISOString(),
  };

  if (useRedis()) {
    // SET NX atomically claims the email slot — rejects duplicate signups
    const claimed = await r().set(EK(email), user.id, { nx: true });
    if (!claimed) throw new Error("An account with this email already exists.");
    await r().hset(UK(user.id), toHash(user));
    return user;
  }

  const users = await fileRead();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }
  users.push(user);
  await fileWrite(users);
  return user;
}

export async function incrementPages(userId: string, count: number): Promise<void> {
  if (useRedis()) {
    // HINCRBY is a single atomic Redis command — safe under any concurrency
    await r().hincrby(UK(userId), "pagesUsed", count);
    return;
  }
  const users = await fileRead();
  const user = users.find(u => u.id === userId);
  if (user) { user.pagesUsed += count; await fileWrite(users); }
}

export async function upgradeTier(
  userId: string,
  tier: User["tier"],
  pageLimit: number
): Promise<void> {
  if (useRedis()) {
    await r().hset(UK(userId), { tier, monthlyPageLimit: pageLimit });
    return;
  }
  const users = await fileRead();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.tier = tier;
    user.monthlyPageLimit = pageLimit;
    await fileWrite(users);
  }
}

export async function setResetToken(
  email: string,
  token: string,
  expiry: string
): Promise<void> {
  if (useRedis()) {
    const id = await r().get<string>(EK(email));
    if (!id) return;
    const ttl = Math.max(60, Math.floor((new Date(expiry).getTime() - Date.now()) / 1000));
    // Store token on user hash AND a reverse-index key with matching TTL
    const pipe = r().pipeline();
    pipe.hset(UK(id), { resetToken: token, resetTokenExpiry: expiry });
    pipe.set(RK(token), id, { ex: ttl });
    await pipe.exec();
    return;
  }
  const users = await fileRead();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await fileWrite(users);
  }
}

export async function findUserByResetToken(token: string): Promise<User | null> {
  if (useRedis()) {
    // O(1) reverse-index lookup — no SCAN needed
    const id = await r().get<string>(RK(token));
    if (!id) return null;
    const hash = await r().hgetall(UK(id));
    if (!hash) return null;
    return fromHash(hash as Record<string, string>);
  }
  const users = await fileRead();
  const user = users.find(u => u.resetToken === token);
  if (!user) return null;
  if (user.resetTokenExpiry && new Date(user.resetTokenExpiry) < new Date()) return null;
  return user;
}

export async function updatePassword(userId: string, newPasswordHash: string): Promise<void> {
  if (useRedis()) {
    await r().hset(UK(userId), {
      passwordHash: newPasswordHash,
      resetToken: "",
      resetTokenExpiry: "",
    });
    return;
  }
  const users = await fileRead();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.passwordHash = newPasswordHash;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await fileWrite(users);
  }
}

/**
 * Atomically mark a Razorpay payment ID as consumed for a PAYG upload.
 *
 * Redis SET NX EX is a single atomic command — two concurrent requests with
 * the same payment ID can only succeed once (the TOCTOU race is closed).
 *
 * Returns true  — first use, proceed with upload.
 * Returns false — already used, reject (replay / concurrent duplicate).
 */
export async function markPaygUsed(paymentId: string, userId: string): Promise<boolean> {
  if (useRedis()) {
    const result = await r().set(PK(paymentId), userId, { nx: true, ex: 7200 });
    return result === "OK";
  }
  return true; // local dev — no real payments
}
