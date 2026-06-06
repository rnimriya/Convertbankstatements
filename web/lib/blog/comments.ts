import fs from "fs";
import path from "path";
import { BlogComment } from "./types";

const DATA_FILE =
  process.env.NODE_ENV === "production"
    ? "/tmp/blog-comments.json"
    : path.join(process.cwd(), "data", "blog-comments.json");

function readComments(): BlogComment[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as BlogComment[];
  } catch {
    return [];
  }
}

function writeComments(comments: BlogComment[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(comments, null, 2), "utf-8");
}

export function getCommentsForPost(slug: string): BlogComment[] {
  return readComments()
    .filter((c) => c.postSlug === slug)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addComment(
  postSlug: string,
  userId: string,
  userName: string,
  userEmail: string,
  content: string
): BlogComment {
  const comments = readComments();
  const comment: BlogComment = {
    id: `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    postSlug,
    userId,
    userName,
    userEmail,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };
  comments.push(comment);
  writeComments(comments);
  return comment;
}

export function deleteComment(id: string): boolean {
  const comments = readComments();
  const filtered = comments.filter((c) => c.id !== id);
  if (filtered.length === comments.length) return false;
  writeComments(filtered);
  return true;
}
