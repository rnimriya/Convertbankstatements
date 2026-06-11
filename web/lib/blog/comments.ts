/**
 * Blog comment store.
 *
 * Production  → Upstash Redis (persistent across deploys/restarts)
 * Development → local JSON file  data/blog-comments.json
 *
 * Redis layout:
 *   cs:blog:comments:{slug}  → Redis LIST  of JSON-serialised BlogComment objects
 *                              (RPUSH on write, LRANGE 0 -1 on read)
 */

import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { BlogComment } from "./types";

// ── Redis helpers ─────────────────────────────────────────────────────────────

function useRedis(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
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

const redisKey = (slug: string) => `cs:blog:comments:${slug}`;

// ── Local JSON fallback ───────────────────────────────────────────────────────

const LOCAL_FILE = path.join(process.cwd(), "data", "blog-comments.json");

function localRead(): BlogComment[] {
  try {
    if (!fs.existsSync(LOCAL_FILE)) return [];
    return JSON.parse(fs.readFileSync(LOCAL_FILE, "utf-8")) as BlogComment[];
  } catch {
    return [];
  }
}

function localWrite(comments: BlogComment[]): void {
  const dir = path.dirname(LOCAL_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(comments, null, 2), "utf-8");
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getCommentsForPost(slug: string): Promise<BlogComment[]> {
  if (useRedis()) {
    const raw = await r().lrange<unknown>(redisKey(slug), 0, -1);
    return raw.map((item) =>
      typeof item === "string" ? (JSON.parse(item) as BlogComment) : (item as BlogComment)
    );
  }
  return localRead()
    .filter((c) => c.postSlug === slug)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export async function addComment(
  postSlug: string,
  userId: string,
  userName: string,
  userEmail: string,
  content: string,
  parentId: string | null = null
): Promise<BlogComment> {
  const comment: BlogComment = {
    id: `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    postSlug,
    userId,
    userName,
    userEmail,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    parentId,
  };

  if (useRedis()) {
    await r().rpush(redisKey(postSlug), JSON.stringify(comment));
  } else {
    const all = localRead();
    all.push(comment);
    localWrite(all);
  }
  return comment;
}

export async function deleteComment(id: string, slug: string): Promise<boolean> {
  if (useRedis()) {
    const key = redisKey(slug);
    const raw = await r().lrange<unknown>(key, 0, -1);
    const filtered = raw
      .map((item) =>
        typeof item === "string" ? (JSON.parse(item) as BlogComment) : (item as BlogComment)
      )
      .filter((c) => c.id !== id && c.parentId !== id); // also remove child replies

    if (filtered.length === raw.length) return false;
    // Rebuild the list atomically: delete + re-push
    await r().del(key);
    if (filtered.length > 0) {
      await r().rpush(key, ...filtered.map((c) => JSON.stringify(c)));
    }
    return true;
  }

  const all = localRead();
  const filtered = all.filter((c) => c.id !== id && c.parentId !== id);
  if (filtered.length === all.length) return false;
  localWrite(filtered);
  return true;
}
