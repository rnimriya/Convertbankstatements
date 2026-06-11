import { NextRequest, NextResponse } from "next/server";
import { getCommentsForPost, addComment } from "@/lib/blog/comments";
import { getPostBySlug } from "@/lib/blog/posts";
import { getSession } from "@/lib/auth/session";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comments = await getCommentsForPost(slug);
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "You must be logged in to comment." }, { status: 401 });
  }

  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || !post.published) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { content, parentId } = body as { content: string; parentId?: string };

    if (!content || typeof content !== "string" || content.trim().length < 3) {
      return NextResponse.json({ error: "Comment must be at least 3 characters." }, { status: 400 });
    }
    if (content.trim().length > 2000) {
      return NextResponse.json({ error: "Comment must be under 2000 characters." }, { status: 400 });
    }

    const comment = await addComment(
      slug,
      session.sub,
      session.name ?? session.email,
      session.email,
      content,
      parentId ?? null
    );
    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
