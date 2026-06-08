/**
 * User store — Turso (libSQL/SQLite) in production, local JSON file in dev.
 *
 * Turso is already connected to the project via Vercel marketplace.
 * Env vars TURSO_DATABASE_URL + TURSO_AUTH_TOKEN are set automatically.
 *
 * Tables (all prefixed cs_ to avoid conflicts with other projects that share
 * this Turso database):
 *   cs_users       — user accounts
 *   cs_payg_used   — one-time PAYG payment markers (auto-purged after 2 h)
 */
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { createClient, type Client, type Row } from "@libsql/client";

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

// ── Turso client ─────────────────────────────────────────────────────────────

let _db: Client | null = null;

function getDb(): Client | null {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) return null;
  if (!_db) _db = createClient({ url, authToken });
  return _db;
}

// ── Schema initialisation (once per cold start) ───────────────────────────────

let _initDone = false;

async function initDb(db: Client): Promise<void> {
  if (_initDone) return;
  await db.batch([
    `CREATE TABLE IF NOT EXISTS cs_users (
       id                   TEXT PRIMARY KEY,
       email                TEXT UNIQUE NOT NULL,
       name                 TEXT,
       password_hash        TEXT NOT NULL,
       pages_used           INTEGER NOT NULL DEFAULT 0,
       tier                 TEXT NOT NULL DEFAULT 'FREE',
       monthly_page_limit   INTEGER NOT NULL DEFAULT 8,
       razorpay_customer_id TEXT,
       created_at           TEXT NOT NULL,
       reset_token          TEXT,
       reset_token_expiry   TEXT
     )`,
    `CREATE TABLE IF NOT EXISTS cs_payg_used (
       payment_id TEXT PRIMARY KEY,
       user_id    TEXT NOT NULL,
       used_at    INTEGER NOT NULL
     )`,
  ], "write");
  _initDone = true;
}

// ── Row → User ────────────────────────────────────────────────────────────────

function rowToUser(row: Row): User {
  return {
    id:                 row.id as string,
    email:              row.email as string,
    name:               (row.name as string) || null,
    passwordHash:       row.password_hash as string,
    pagesUsed:          row.pages_used as number,
    tier:               (row.tier as string || "FREE") as User["tier"],
    monthlyPageLimit:   row.monthly_page_limit as number,
    razorpayCustomerId: (row.razorpay_customer_id as string) || null,
    createdAt:          row.created_at as string,
    resetToken:         (row.reset_token as string) || null,
    resetTokenExpiry:   (row.reset_token_expiry as string) || null,
  };
}

// ── File backend (local dev only) ─────────────────────────────────────────────

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

// ── Seed account ──────────────────────────────────────────────────────────────

let _seeded = false;

async function ensureSeed() {
  if (_seeded) return;
  _seeded = true;
  const email = process.env.SEED_USER_EMAIL;
  const passwordHash = process.env.SEED_USER_PASSWORD_HASH;
  if (!email || !passwordHash) return;

  try {
    const db = getDb();
    if (db) {
      await initDb(db);
      // INSERT OR IGNORE — does nothing if email already exists
      await db.execute({
        sql: `INSERT OR IGNORE INTO cs_users
              (id, email, name, password_hash, pages_used, tier, monthly_page_limit, razorpay_customer_id, created_at)
              VALUES (?, ?, ?, ?, 0, 'FREE', 8, NULL, ?)`,
        args: [
          "seed-user-001",
          email.toLowerCase(),
          process.env.SEED_USER_NAME ?? null,
          passwordHash,
          new Date().toISOString(),
        ],
      });
    } else {
      const users = await fileRead();
      if (users.length === 0) {
        await fileWrite([{
          id: "seed-user-001",
          email: email.toLowerCase(),
          name: process.env.SEED_USER_NAME ?? null,
          passwordHash,
          pagesUsed: 0,
          tier: "FREE",
          monthlyPageLimit: 8,
          razorpayCustomerId: null,
          createdAt: new Date().toISOString(),
        }]);
      }
    }
  } catch { /* non-fatal */ }
}

// ── Public API ─────────────────────────────────────────────────────────────────

export async function findByEmail(email: string): Promise<User | null> {
  await ensureSeed();
  const db = getDb();
  if (db) {
    await initDb(db);
    const res = await db.execute({
      sql: "SELECT * FROM cs_users WHERE email = ?",
      args: [email.toLowerCase()],
    });
    return res.rows[0] ? rowToUser(res.rows[0]) : null;
  }
  const users = await fileRead();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function findById(id: string): Promise<User | null> {
  await ensureSeed();
  const db = getDb();
  if (db) {
    await initDb(db);
    const res = await db.execute({
      sql: "SELECT * FROM cs_users WHERE id = ?",
      args: [id],
    });
    return res.rows[0] ? rowToUser(res.rows[0]) : null;
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

  const db = getDb();
  if (db) {
    await initDb(db);
    // UNIQUE constraint on email — INSERT OR IGNORE + rowsAffected check = atomic duplicate detection
    const res = await db.execute({
      sql: `INSERT OR IGNORE INTO cs_users
            (id, email, name, password_hash, pages_used, tier, monthly_page_limit, razorpay_customer_id, created_at)
            VALUES (?, ?, ?, ?, 0, 'FREE', 8, NULL, ?)`,
      args: [user.id, user.email, user.name, user.passwordHash, user.createdAt],
    });
    if (res.rowsAffected === 0) {
      throw new Error("An account with this email already exists.");
    }
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
  const db = getDb();
  if (db) {
    await initDb(db);
    // Single SQL statement — atomic in SQLite
    await db.execute({
      sql: "UPDATE cs_users SET pages_used = pages_used + ? WHERE id = ?",
      args: [count, userId],
    });
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
  const db = getDb();
  if (db) {
    await initDb(db);
    await db.execute({
      sql: "UPDATE cs_users SET tier = ?, monthly_page_limit = ? WHERE id = ?",
      args: [tier, pageLimit, userId],
    });
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
  const db = getDb();
  if (db) {
    await initDb(db);
    await db.execute({
      sql: "UPDATE cs_users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      args: [token, expiry, email.toLowerCase()],
    });
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
  const db = getDb();
  if (db) {
    await initDb(db);
    // SQLite datetime comparison handles expiry check inline
    const res = await db.execute({
      sql: `SELECT * FROM cs_users
            WHERE reset_token = ?
              AND reset_token_expiry > datetime('now')`,
      args: [token],
    });
    return res.rows[0] ? rowToUser(res.rows[0]) : null;
  }
  const users = await fileRead();
  const user = users.find(u => u.resetToken === token);
  if (!user) return null;
  if (user.resetTokenExpiry && new Date(user.resetTokenExpiry) < new Date()) return null;
  return user;
}

export async function updatePassword(userId: string, newPasswordHash: string): Promise<void> {
  const db = getDb();
  if (db) {
    await initDb(db);
    await db.execute({
      sql: "UPDATE cs_users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
      args: [newPasswordHash, userId],
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
 * Uses INSERT OR IGNORE + rowsAffected — SQLite's UNIQUE constraint makes
 * this atomic: two concurrent requests with the same payment_id can only
 * succeed once (the second gets rowsAffected=0).
 *
 * Returns true  — first use, proceed with upload.
 * Returns false — already consumed, reject (replay / concurrent duplicate).
 */
export async function markPaygUsed(paymentId: string, userId: string): Promise<boolean> {
  const db = getDb();
  if (db) {
    await initDb(db);
    const res = await db.execute({
      sql: `INSERT OR IGNORE INTO cs_payg_used (payment_id, user_id, used_at)
            VALUES (?, ?, ?)`,
      args: [paymentId, userId, Date.now()],
    });
    // Async cleanup — remove markers older than 2 hours (fire-and-forget)
    db.execute({
      sql: "DELETE FROM cs_payg_used WHERE used_at < ?",
      args: [Date.now() - 7_200_000],
    }).catch(() => {});
    return res.rowsAffected > 0;
  }
  // File backend: no real Razorpay in local dev — always allow
  return true;
}
