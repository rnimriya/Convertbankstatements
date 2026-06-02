/**
 * JSON-file user store — works locally with zero configuration.
 * In production, swap for Prisma/PostgreSQL by updating each function.
 */
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const FILE = path.join(process.cwd(), "data", "users.json");

export interface User {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string;
  pagesUsed: number;            // lifetime pages consumed
  tier: "FREE" | "PRO" | "BUSINESS";
  monthlyPageLimit: number;     // 8 FREE, 200 PRO, 500 BUSINESS
  razorpayCustomerId: string | null;
  createdAt: string;
}

async function ensure() {
  await fs.mkdir(path.dirname(FILE), { recursive: true }).catch(() => {});
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, "[]");
  }
}

async function read(): Promise<User[]> {
  await ensure();
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}

async function write(users: User[]) {
  await ensure();
  await fs.writeFile(FILE, JSON.stringify(users, null, 2));
}

export async function findByEmail(email: string): Promise<User | null> {
  const users = await read();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function findById(id: string): Promise<User | null> {
  const users = await read();
  return users.find((u) => u.id === id) ?? null;
}

export async function createUser(
  email: string,
  passwordHash: string,
  name?: string
): Promise<User> {
  const users = await read();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }
  const user: User = {
    id: randomUUID(),
    email,
    name: name ?? null,
    passwordHash,
    pagesUsed: 0,
    tier: "FREE",
    monthlyPageLimit: 8,
    razorpayCustomerId: null,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await write(users);
  return user;
}

export async function incrementPages(userId: string, count: number): Promise<void> {
  const users = await read();
  const user = users.find((u) => u.id === userId);
  if (user) {
    user.pagesUsed += count;
    await write(users);
  }
}

export async function upgradeTier(
  userId: string,
  tier: User["tier"],
  pageLimit: number
): Promise<void> {
  const users = await read();
  const user = users.find((u) => u.id === userId);
  if (user) {
    user.tier = tier;
    user.monthlyPageLimit = pageLimit;
    await write(users);
  }
}
