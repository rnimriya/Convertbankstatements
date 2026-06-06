import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/blog/posts";
import { getCommentsForPost } from "@/lib/blog/comments";
import { getSession } from "@/lib/auth/session";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommentSection } from "@/components/blog/CommentSection";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} - BankStatements India`,
    description: post.excerpt,
    openGraph: { images: [post.featureImage] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || !post.published) notFound();

  const comments = getCommentsForPost(slug);
  const session = await getSession();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-[#0a0a0a]">
        {/* Feature image */}
        <div className="h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={post.featureImage}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mx-auto max-w-3xl px-6 py-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-50 dark:bg-brand-900/20 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:text-brand-400"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mt-4 flex items-center gap-3 text-sm text-slate-400 dark:text-gray-500">
            <span>{post.author}</span>
            <span>·</span>
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>

          {/* Content */}
          <article
            className="mt-8 prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-xl prose-p:text-base prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Back link */}
          <div className="mt-12 border-t border-slate-100 dark:border-white/10 pt-8">
            <a
              href="/blog"
              className="text-sm font-medium text-brand-500 dark:text-brand-400 hover:underline"
            >
              ← Back to Blog
            </a>
          </div>

          {/* Comments */}
          <CommentSection
            slug={slug}
            initialComments={comments}
            isLoggedIn={!!session}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
