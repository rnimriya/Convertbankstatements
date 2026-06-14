import { NextRequest, NextResponse } from "next/server";
import { getPublishedPosts, createPost } from "@/lib/blog/posts";
import { getAdminSession } from "@/lib/auth/admin";
import { checkCsrfOrigin } from "@/lib/csrf";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "12", 10);
  const result = getPublishedPosts(page, limit);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const csrf = checkCsrfOrigin(req);
  if (csrf) return csrf;

  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { slug, title, excerpt, content, featureImage, author, tags, published } = body;
    if (!slug || !title || !content) {
      return NextResponse.json({ error: "slug, title, and content are required" }, { status: 400 });
    }
    const post = createPost({
      slug,
      title,
      excerpt: excerpt ?? "",
      content,
      featureImage: featureImage ?? `https://picsum.photos/seed/${slug}/800/450`,
      author: author ?? "Convert Statement Team",
      tags: Array.isArray(tags) ? tags : [],
      published: published ?? false,
    });
    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
