import fs from "fs";
import path from "path";
import { BlogPost } from "./types";
import { SEED_POSTS } from "./seed";

const DATA_FILE =
  process.env.NODE_ENV === "production"
    ? "/tmp/blog-posts.json"
    : path.join(process.cwd(), "data", "blog-posts.json");

function readCustomPosts(): BlogPost[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as BlogPost[];
  } catch {
    return [];
  }
}

function writeCustomPosts(posts: BlogPost[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

export function getAllPosts(): BlogPost[] {
  const custom = readCustomPosts();
  const all = [...SEED_POSTS, ...custom];
  return all.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getPublishedPosts(page = 1, limit = 12): { posts: BlogPost[]; total: number; pages: number } {
  const all = getAllPosts().filter((p) => p.published);
  const total = all.length;
  const pages = Math.ceil(total / limit);
  const posts = all.slice((page - 1) * limit, page * limit);
  return { posts, total, pages };
}

export function getPostBySlug(slug: string): BlogPost | null {
  const all = getAllPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

export function createPost(data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): BlogPost {
  const custom = readCustomPosts();
  const post: BlogPost = {
    ...data,
    id: `custom-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  custom.push(post);
  writeCustomPosts(custom);
  return post;
}

export function updatePost(id: string, data: Partial<BlogPost>): BlogPost | null {
  const custom = readCustomPosts();
  const idx = custom.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  custom[idx] = { ...custom[idx], ...data, updatedAt: new Date().toISOString() };
  writeCustomPosts(custom);
  return custom[idx];
}

export function deletePost(id: string): boolean {
  const custom = readCustomPosts();
  const filtered = custom.filter((p) => p.id !== id);
  if (filtered.length === custom.length) return false;
  writeCustomPosts(filtered);
  return true;
}
