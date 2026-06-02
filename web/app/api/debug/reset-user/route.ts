/**
 * DEV-ONLY endpoint — resets / seeds a user account with a known password.
 * ONLY works when NODE_ENV !== "production" OR when DEBUG_SECRET matches.
 *
 * POST /api/debug/reset-user
 * Body: { email, password, name?, secret }
 *
 * The `secret` must equal the DEBUG_SECRET env var (set it in .env.local / Vercel dashboard).
 * This lets you reset accounts on Vercel without a full DB.
 */
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";

const FILE = process.env.VERCEL
  ? "/tmp/users.json"
  : path.join(process.cwd(), "data", "users.json");

async function readUsers() {
  try { return JSON.parse(await fs.readFile(FILE, "utf8")); } catch { return []; }
}
async function writeUsers(users: unknown[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true }).catch(() => {});
  await fs.writeFile(FILE, JSON.stringify(users, null, 2));
}

export async function POST(req: NextRequest) {
  const debugSecret = process.env.DEBUG_SECRET;
  const isDev = process.env.NODE_ENV !== "production";

  const body = await req.json().catch(() => ({}));
  const { email, password, name, secret } = body;

  // Security: require secret in production
  if (!isDev && (!debugSecret || secret !== debugSecret)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "email and password (min 8 chars) are required." },
      { status: 400 }
    );
  }

  const users = await readUsers();
  const idx = users.findIndex(
    (u: { email: string }) => u.email.toLowerCase() === email.toLowerCase()
  );
  const hash = await bcrypt.hash(password, 12);

  if (idx >= 0) {
    users[idx].passwordHash = hash;
    users[idx].resetToken = null;
    users[idx].resetTokenExpiry = null;
  } else {
    users.push({
      id: randomUUID(),
      email,
      name: name ?? null,
      passwordHash: hash,
      pagesUsed: 0,
      tier: "FREE",
      monthlyPageLimit: 8,
      razorpayCustomerId: null,
      createdAt: new Date().toISOString(),
    });
  }

  await writeUsers(users);
  return NextResponse.json({
    ok: true,
    action: idx >= 0 ? "password_updated" : "user_created",
    email,
  });
}
