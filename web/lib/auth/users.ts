/**
 * User store — Upstash Redis in production (persistent, atomic),
 * local JSON file in development.
 *
 * Redis data model:
 *   cs:user:{id}       → HASH   (all user fields; HINCRBY for atomic page increments)
 *   cs:email:{email}   → STRING userId   (email lookup index, SET NX for atomic signup)
 *   cs:rtoken:{token}  → STRING userId   (reset-token reverse index, TTL = 1 h)
 *   cs:webhook:{payId} → STRING "1"      (webhook idempotency, TTL = 25 h)
 */
import fs from "fs/promises";
import path from "path";
import { randomUUID, createHash } from "crypto";
import { Redis } from "@upstash/redis";
import { encryptField, decryptField } from "@/lib/crypto";
import { isDeployed } from "@/lib/env";

// ── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string;
  pagesUsed: number;
  tier: "FREE" | "BASIC" | "PRO" | "BUSINESS";
  monthlyPageLimit: number;
  billingCycle: "monthly" | "annual";
  razorpayCustomerId: string | null;
  referralCode: string;
  referredBy: string | null;
  referralPagesCredited: number;
  createdAt: string;
  /** ISO timestamp of the last time pagesUsed was reset for a new billing period. */
  lastPeriodResetAt: string | null;
  resetToken?: string | null;
  resetTokenExpiry?: string | null;
  emailVerified?: boolean;
  emailVerifyToken?: string | null;
  emailVerifyExpiry?: string | null;
  googleSheetsRefreshToken?: string | null;
  teamId?: string | null;
  teamRole?: "owner" | "member" | null;
  /** Session-revocation counter — bumped on password change / "log out everywhere". */
  tokenVersion?: number;
  /** True once the referral bonus for this account has been granted (on email verify). */
  referralCredited?: boolean;
}

export interface ConversionLog {
  id: string;
  userId: string;
  fileName: string;
  pageCount: number;
  transactionCount: number;
  billingType: string;
  bankName: string | null;
  exportFormats: string[];
  createdAt: string;
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
      // BUG-11: retry once with a short backoff so transient network blips don't
      // surface as hard 500s. Upstash REST client uses fetch internally;
      // retryConfig limits how long we wait before propagating the error.
      retry: { retries: 1, backoff: (n) => Math.min(200 * 2 ** n, 1000) },
    });
  }
  return _redis;
}

// ── Redis key helpers ────────────────────────────────────────────────────────

const UK = (id: string) => `cs:user:${id}`;
const EK = (email: string) => `cs:email:${email.toLowerCase()}`;
const RK = (token: string) => `cs:rtoken:${token}`;

/**
 * Reset / email-verify tokens are stored and indexed as a SHA-256 hash, never
 * in the clear. The raw token only ever exists in the email link; a store leak
 * therefore can't be replayed into an account takeover. Lookups hash the
 * caller-supplied raw token and compare hashes.
 */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

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
    billingCycle: u.billingCycle,
    razorpayCustomerId: u.razorpayCustomerId ?? "",
    referralCode: u.referralCode,
    referredBy: u.referredBy ?? "",
    referralPagesCredited: u.referralPagesCredited,
    createdAt: u.createdAt,
    lastPeriodResetAt: u.lastPeriodResetAt ?? "",
    resetToken: u.resetToken ?? "",
    resetTokenExpiry: u.resetTokenExpiry ?? "",
    emailVerified: u.emailVerified ? "1" : "0",
    emailVerifyToken: u.emailVerifyToken ?? "",
    emailVerifyExpiry: u.emailVerifyExpiry ?? "",
    googleSheetsRefreshToken: encryptField(u.googleSheetsRefreshToken),
    teamId: u.teamId ?? "",
    teamRole: u.teamRole ?? "",
    tokenVersion: u.tokenVersion ?? 0,
    referralCredited: u.referralCredited ? "1" : "0",
  };
}

function fromHash(h: Record<string, string>): User {
  // BUG-02: guard against corrupted / partially-written Redis hashes.
  // If a deploy or Redis error left the hash without core fields, accessing
  // h.id / h.email / h.passwordHash would return undefined, causing every
  // downstream caller (login, findById, getSession) to crash silently.
  if (!h.id || !h.email || !h.passwordHash || !h.createdAt) {
    throw new Error(
      `Corrupted user record: missing required fields. Present keys: [${Object.keys(h).join(", ")}]`
    );
  }

  return {
    id: h.id,
    email: h.email,
    name: h.name || null,
    passwordHash: h.passwordHash,
    pagesUsed: parseInt(h.pagesUsed ?? "0", 10),
    tier: (h.tier || "FREE") as User["tier"],
    monthlyPageLimit: parseInt(h.monthlyPageLimit ?? "8", 10),
    billingCycle: (h.billingCycle || "monthly") as User["billingCycle"],
    razorpayCustomerId: h.razorpayCustomerId || null,
    referralCode: h.referralCode || h.id.slice(0, 8),
    referredBy: h.referredBy || null,
    referralPagesCredited: parseInt(h.referralPagesCredited ?? "0", 10),
    createdAt: h.createdAt,
    lastPeriodResetAt: h.lastPeriodResetAt || null,
    resetToken: h.resetToken || null,
    resetTokenExpiry: h.resetTokenExpiry || null,
    emailVerified: h.emailVerified === "1",
    emailVerifyToken: h.emailVerifyToken || null,
    emailVerifyExpiry: h.emailVerifyExpiry || null,
    googleSheetsRefreshToken: decryptField(h.googleSheetsRefreshToken) || null,
    teamId: h.teamId || null,
    teamRole: (h.teamRole || null) as User["teamRole"],
    tokenVersion: parseInt(h.tokenVersion ?? "0", 10),
    referralCredited: h.referralCredited === "1",
  };
}

// ── Billing period helpers ───────────────────────────────────────────────────

/**
 * Returns "YYYY-MM" for the given date — used to detect when a new
 * monthly billing period has started.
 */
function billingPeriodKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Lazily resets pagesUsed at the start of each new billing period.
 *
 * Called every time a user record is fetched. FREE users are excluded —
 * their 8-page allowance is a one-time trial, not a monthly quota.
 *
 * For PRO and BUSINESS users, if the stored lastPeriodResetAt (or createdAt
 * for accounts that predate this field) is from a prior calendar month,
 * pagesUsed is reset to 0 and lastPeriodResetAt is updated atomically.
 *
 * Race condition note: two concurrent fetches in the first request of a new
 * month will both attempt the reset. Since we use a simple hset (not Lua),
 * both will write { pagesUsed: 0 } and then both will HINCRBY their own
 * pageCount. The final value will be the sum of both uploads — correct
 * behaviour within a fresh period.
 */
async function maybeResetPeriod(user: User): Promise<User> {
  if (user.tier === "FREE") return user;

  const now = new Date();
  const currentPeriod = billingPeriodKey(now);
  const anchorDate = new Date(user.lastPeriodResetAt ?? user.createdAt);
  const lastPeriod = billingPeriodKey(anchorDate);

  if (lastPeriod === currentPeriod) return user;

  const nowIso = now.toISOString();

  if (useRedis()) {
    await r().hset(UK(user.id), { pagesUsed: 0, lastPeriodResetAt: nowIso });
  } else {
    const users = await fileRead();
    const u = users.find((u) => u.id === user.id);
    if (u) {
      u.pagesUsed = 0;
      u.lastPeriodResetAt = nowIso;
      await fileWrite(users);
    }
  }

  return { ...user, pagesUsed: 0, lastPeriodResetAt: nowIso };
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
        billingCycle: "monthly",
        razorpayCustomerId: null,
        referralCode: "seed0001",
        referredBy: null,
        referralPagesCredited: 0,
        createdAt: new Date().toISOString(),
        lastPeriodResetAt: null,
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
          billingCycle: "monthly",
          razorpayCustomerId: null,
          referralCode: "seed0001",
          referredBy: null,
          referralPagesCredited: 0,
          createdAt: new Date().toISOString(),
          lastPeriodResetAt: null,
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
    return maybeResetPeriod(fromHash(hash as Record<string, string>));
  }
  const users = await fileRead();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  return user ? maybeResetPeriod(user) : null;
}

export async function findById(id: string): Promise<User | null> {
  await ensureSeed();
  if (useRedis()) {
    const hash = await r().hgetall(UK(id));
    if (!hash) return null;
    return maybeResetPeriod(fromHash(hash as Record<string, string>));
  }
  const users = await fileRead();
  const user = users.find(u => u.id === id) ?? null;
  return user ? maybeResetPeriod(user) : null;
}

export async function createUser(
  email: string,
  passwordHash: string,
  name?: string,
  referredBy?: string
): Promise<User> {
  const id = randomUUID();
  const user: User = {
    id,
    email: email.toLowerCase(),
    name: name ?? null,
    passwordHash,
    pagesUsed: 0,
    tier: "FREE",
    monthlyPageLimit: 8,
    billingCycle: "monthly",
    razorpayCustomerId: null,
    referralCode: id.slice(0, 8),
    referredBy: referredBy ?? null,
    referralPagesCredited: 0,
    createdAt: new Date().toISOString(),
    lastPeriodResetAt: null,
  };

  if (useRedis()) {
    // SET NX atomically claims the email slot — rejects duplicate signups
    const claimed = await r().set(EK(email), user.id, { nx: true });
    if (!claimed) throw new Error("An account with this email already exists.");
    const pipe = r().pipeline();
    pipe.hset(UK(user.id), toHash(user));
    pipe.set(`cs:ref:${user.referralCode}`, user.id);
    await pipe.exec();
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
  // BUG-09: reject non-positive or non-integer counts before they touch storage.
  // A zero or negative count from a backend bug or malicious internal request
  // would silently inflate quota (negative) or be a no-op that still marks usage (zero).
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error(`incrementPages requires a positive integer pageCount, got: ${count}`);
  }
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
  pageLimit: number,
  billingCycle: User["billingCycle"] = "monthly"
): Promise<void> {
  if (useRedis()) {
    // Reset pagesUsed on upgrade so the new period starts clean
    await r().hset(UK(userId), {
      tier,
      monthlyPageLimit: pageLimit,
      billingCycle,
      pagesUsed: 0,
      lastPeriodResetAt: new Date().toISOString(),
    });
    return;
  }
  const users = await fileRead();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.tier = tier;
    user.monthlyPageLimit = pageLimit;
    user.billingCycle = billingCycle;
    user.pagesUsed = 0;
    user.lastPeriodResetAt = new Date().toISOString();
    await fileWrite(users);
  }
}

/** Credit extra free pages to a user (used by referral program). */
export async function creditPages(userId: string, pages: number): Promise<void> {
  if (useRedis()) {
    await r().hincrby(UK(userId), "monthlyPageLimit", pages);
    await r().hincrby(UK(userId), "referralPagesCredited", pages);
    return;
  }
  const users = await fileRead();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.monthlyPageLimit += pages;
    user.referralPagesCredited += pages;
    await fileWrite(users);
  }
}

/** Look up a user by their referral code. */
export async function findByReferralCode(code: string): Promise<User | null> {
  if (useRedis()) {
    const userId = await r().get<string>(`cs:ref:${code}`);
    if (!userId) return null;
    return findById(userId);
  }
  const users = await fileRead();
  return users.find(u => u.referralCode === code) ?? null;
}

/** Register a referral code→userId mapping (call at createUser time). */
export async function registerReferralCode(code: string, userId: string): Promise<void> {
  if (useRedis()) {
    await r().set(`cs:ref:${code}`, userId);
    return;
  }
  // file backend: code is stored on the user object itself, no extra index needed
}

export async function setResetToken(
  email: string,
  token: string,
  expiry: string
): Promise<void> {
  const h = hashToken(token);
  if (useRedis()) {
    const id = await r().get<string>(EK(email));
    if (!id) return;
    const ttl = Math.max(60, Math.floor((new Date(expiry).getTime() - Date.now()) / 1000));
    // Store the token HASH on the user hash AND a reverse-index key with matching TTL
    const pipe = r().pipeline();
    pipe.hset(UK(id), { resetToken: h, resetTokenExpiry: expiry });
    pipe.set(RK(h), id, { ex: ttl });
    await pipe.exec();
    return;
  }
  const users = await fileRead();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    user.resetToken = h;
    user.resetTokenExpiry = expiry;
    await fileWrite(users);
  }
}

export async function findUserByResetToken(token: string): Promise<User | null> {
  const h = hashToken(token);
  if (useRedis()) {
    // O(1) reverse-index lookup — no SCAN needed
    const id = await r().get<string>(RK(h));
    if (!id) return null;
    const hash = await r().hgetall(UK(id));
    if (!hash) return null;
    const user = fromHash(hash as Record<string, string>);
    // Verify the stored hash matches — prevents reuse after updatePassword clears it.
    if (!user.resetToken || user.resetToken !== h) return null;
    if (user.resetTokenExpiry && new Date(user.resetTokenExpiry) < new Date()) return null;
    return user;
  }
  const users = await fileRead();
  const user = users.find(u => u.resetToken === h);
  if (!user) return null;
  if (user.resetTokenExpiry && new Date(user.resetTokenExpiry) < new Date()) return null;
  return user;
}

/**
 * Updates the user's password and invalidates the reset token.
 * Pass `consumedToken` to also delete the Redis reverse-index key immediately,
 * preventing token reuse within the remaining TTL window.
 */
export async function updatePassword(
  userId: string,
  newPasswordHash: string,
  consumedToken?: string
): Promise<void> {
  if (useRedis()) {
    const pipe = r().pipeline();
    pipe.hset(UK(userId), {
      passwordHash: newPasswordHash,
      resetToken: "",
      resetTokenExpiry: "",
    });
    // Bump tokenVersion so every existing session (any device) is invalidated.
    pipe.hincrby(UK(userId), "tokenVersion", 1);
    if (consumedToken) pipe.del(RK(hashToken(consumedToken)));
    await pipe.exec();
    return;
  }
  const users = await fileRead();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.passwordHash = newPasswordHash;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    user.tokenVersion = (user.tokenVersion ?? 0) + 1;
    await fileWrite(users);
  }
}


const WK = (paymentId: string) => `cs:webhook:${paymentId}`;

/**
 * Idempotency guard for Razorpay webhooks.
 *
 * Razorpay retries webhooks on failure (up to 3 times over 24 h).
 * SET NX ensures a given payment_id is only processed once even if the
 * webhook fires multiple times.
 *
 * Returns true  — first delivery, handler should proceed.
 * Returns false — already processed, handler should return 200 immediately.
 */
export async function markWebhookProcessed(paymentId: string): Promise<boolean> {
  if (useRedis()) {
    // 25-hour TTL — longer than Razorpay's 24-hour retry window
    const result = await r().set(WK(paymentId), "1", { nx: true, ex: 90_000 });
    return result === "OK";
  }
  if (isDeployed()) {
    console.error("[security][webhook] Redis not configured in production — webhook idempotency is DISABLED (replays possible). Set UPSTASH_REDIS_REST_URL/TOKEN.");
  }
  return true; // local dev — always process
}

// ── Email Verification ────────────────────────────────────────────────────────

const EVK = (token: string) => `cs:evtoken:${token}`;

export async function setEmailVerifyToken(
  userId: string,
  token: string,
  expiry: string
): Promise<void> {
  const ttl = Math.max(60, Math.floor((new Date(expiry).getTime() - Date.now()) / 1000));
  const h = hashToken(token);
  if (useRedis()) {
    const pipe = r().pipeline();
    pipe.hset(UK(userId), { emailVerifyToken: h, emailVerifyExpiry: expiry });
    pipe.set(EVK(h), userId, { ex: ttl });
    await pipe.exec();
    return;
  }
  const users = await fileRead();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.emailVerifyToken = h;
    user.emailVerifyExpiry = expiry;
    await fileWrite(users);
  }
}

/** Verifies an email token. Returns the verified user's id on success, else null. */
export async function verifyEmail(token: string): Promise<string | null> {
  const h = hashToken(token);
  if (useRedis()) {
    const userId = await r().get<string>(EVK(h));
    if (!userId) return null;
    const hash = await r().hgetall(UK(userId));
    if (!hash) return null;
    const user = fromHash(hash as Record<string, string>);
    if (user.emailVerifyToken !== h) return null;
    if (user.emailVerifyExpiry && new Date(user.emailVerifyExpiry) < new Date()) return null;
    const pipe = r().pipeline();
    pipe.hset(UK(userId), { emailVerified: "1", emailVerifyToken: "", emailVerifyExpiry: "" });
    pipe.del(EVK(h));
    await pipe.exec();
    return userId;
  }
  const users = await fileRead();
  const user = users.find(u => u.emailVerifyToken === h);
  if (!user) return null;
  if (user.emailVerifyExpiry && new Date(user.emailVerifyExpiry) < new Date()) return null;
  user.emailVerified = true;
  user.emailVerifyToken = null;
  user.emailVerifyExpiry = null;
  await fileWrite(users);
  return user.id;
}

// ── Referral crediting ─────────────────────────────────────────────────────────

/** Bonus granted to each party when a referred account verifies its email. */
export const REFERRAL_BONUS_PAGES = 50;
/** Hard cap on total referral pages a single referrer can ever accrue (anti-farming). */
const REFERRER_MAX_CREDIT_PAGES = 500;

/**
 * Grants the referral bonus to a newly-verified user and their referrer.
 *
 * Crediting is deliberately deferred to *email verification* (not signup) so that
 * unverified throwaway accounts can't farm free pages. A one-time guard prevents
 * double-crediting, and the referrer is capped to limit large-scale abuse.
 */
export async function creditReferralForUser(userId: string): Promise<void> {
  const user = await findById(userId);
  if (!user || !user.referredBy || user.referralCredited) return;

  // Atomic one-time guard so concurrent verifications can't double-credit.
  if (useRedis()) {
    const claimed = await r().set(`cs:refcredit:${userId}`, "1", { nx: true });
    if (!claimed) return;
    await r().hset(UK(userId), { referralCredited: "1" });
  } else {
    const users = await fileRead();
    const u = users.find((x) => x.id === userId);
    if (!u || u.referralCredited) return;
    u.referralCredited = true;
    await fileWrite(users);
  }

  // Credit the referee.
  await creditPages(userId, REFERRAL_BONUS_PAGES);

  // Credit the referrer, guarding against self-referral and respecting the cap.
  const referrer = await findById(user.referredBy);
  if (
    referrer &&
    referrer.id !== userId &&
    referrer.email !== user.email &&
    referrer.referralPagesCredited < REFERRER_MAX_CREDIT_PAGES
  ) {
    await creditPages(referrer.id, REFERRAL_BONUS_PAGES);
  }
}

// ── Subscription Cancellation ─────────────────────────────────────────────────

export async function cancelSubscription(userId: string): Promise<void> {
  if (useRedis()) {
    await r().hset(UK(userId), {
      tier: "FREE",
      monthlyPageLimit: 8,
      lastPeriodResetAt: new Date().toISOString(),
    });
    return;
  }
  const users = await fileRead();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.tier = "FREE";
    user.monthlyPageLimit = 8;
    user.lastPeriodResetAt = new Date().toISOString();
    await fileWrite(users);
  }
}

// ── Password change ───────────────────────────────────────────────────────────

export async function changePassword(
  userId: string,
  newPasswordHash: string
): Promise<void> {
  if (useRedis()) {
    const pipe = r().pipeline();
    pipe.hset(UK(userId), { passwordHash: newPasswordHash });
    // Invalidate all other active sessions on password change.
    pipe.hincrby(UK(userId), "tokenVersion", 1);
    await pipe.exec();
    return;
  }
  const users = await fileRead();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.passwordHash = newPasswordHash;
    user.tokenVersion = (user.tokenVersion ?? 0) + 1;
    await fileWrite(users);
  }
}

// ── Google Sheets ─────────────────────────────────────────────────────────────

export async function setGoogleSheetsToken(userId: string, refreshToken: string): Promise<void> {
  if (useRedis()) {
    await r().hset(UK(userId), { googleSheetsRefreshToken: encryptField(refreshToken) });
    return;
  }
  const users = await fileRead();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.googleSheetsRefreshToken = refreshToken;
    await fileWrite(users);
  }
}

// ── Token version (session revocation) ─────────────────────────────────────────

/**
 * Returns the user's current tokenVersion, or null if the user can't be found.
 * Used by getSession to reject JWTs minted before a password change / logout-all.
 */
export async function getTokenVersion(userId: string): Promise<number | null> {
  if (useRedis()) {
    const v = await r().hget<string | number>(UK(userId), "tokenVersion");
    if (v === null || v === undefined) return 0; // legacy users with no field
    return typeof v === "number" ? v : parseInt(v, 10) || 0;
  }
  const users = await fileRead();
  const user = users.find(u => u.id === userId);
  if (!user) return null;
  return user.tokenVersion ?? 0;
}

// ── Conversion Logs ───────────────────────────────────────────────────────────

const CL_KEY = (userId: string) => `cs:logs:${userId}`;

export async function addConversionLog(log: ConversionLog): Promise<void> {
  if (useRedis()) {
    await r().lpush(CL_KEY(log.userId), JSON.stringify(log));
    await r().ltrim(CL_KEY(log.userId), 0, 49); // keep last 50
    return;
  }
  const logFile = path.join(process.cwd(), "data", `logs_${log.userId}.json`);
  let logs: ConversionLog[] = [];
  try { logs = JSON.parse(await fs.readFile(logFile, "utf8")); } catch { /* first log */ }
  logs.unshift(log);
  if (logs.length > 50) logs = logs.slice(0, 50);
  await fs.writeFile(logFile, JSON.stringify(logs, null, 2));
}

export async function getConversionLogs(userId: string): Promise<ConversionLog[]> {
  if (useRedis()) {
    const raw = await r().lrange<string>(CL_KEY(userId), 0, 49);
    return raw.map(s => (typeof s === "string" ? JSON.parse(s) : s)) as ConversionLog[];
  }
  const logFile = path.join(process.cwd(), "data", `logs_${userId}.json`);
  try { return JSON.parse(await fs.readFile(logFile, "utf8")); } catch { return []; }
}
