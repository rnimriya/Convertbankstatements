import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug, updatePost, deletePost } from "@/lib/blog/posts";
import { getSession } from "@/lib/auth/session";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || !post.published) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  if (!session || session.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  const existing = getPostBySlug(slug);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.id.startsWith("seed-")) {
    return NextResponse.json({ error: "Cannot update seed posts" }, { status: 400 });
  }
  try {
    const body = await req.json();
    const updated = updatePost(existing.id, body);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  if (!session || session.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  const existing = getPostBySlug(slug);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.id.startsWith("seed-")) {
    return NextResponse.json({ error: "Cannot delete seed posts" }, { status: 400 });
  }
  const ok = deletePost(existing.id);
  if (!ok) return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  return NextResponse.json({ success: true });
}
