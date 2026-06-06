import Link from "next/link";
import { getPublishedPosts } from "@/lib/blog/posts";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog - BankStatements India",
  description: "Guides, tips, and resources on Indian bank statements, banking, and personal finance.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const { posts, total, pages } = getPublishedPosts(page, 12);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-[#0a0a0a]">
        {/* Hero */}
        <section className="border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-[#0d0d0d] py-14 px-6 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
            BankStatements Blog
          </h1>
          <p className="mt-3 text-base text-slate-500 dark:text-gray-400 max-w-xl mx-auto">
            Practical guides on Indian bank statements, banking, and personal finance.
            {total > 0 && <span className="ml-1">{total} articles and counting.</span>}
          </p>
        </section>

        {/* Grid */}
        <section className="mx-auto max-w-6xl px-6 py-12">
          {posts.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-gray-400">No posts yet. Check back soon.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111] overflow-hidden hover:shadow-lg dark:hover:shadow-brand-500/10 transition-shadow"
                >
                  <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                    <img
                      src={post.featureImage}
                      alt={post.title}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 text-[11px] font-semibold text-brand-600 dark:text-brand-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="font-bold text-slate-900 dark:text-white leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="mt-2 text-sm text-slate-500 dark:text-gray-400 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-400 dark:text-gray-500">
                      <span>{post.author}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {page > 1 && (
                <Link
                  href={`/blog?page=${page - 1}`}
                  className="rounded-lg border border-slate-200 dark:border-white/10 px-4 py-2 text-sm font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  Previous
                </Link>
              )}
              <span className="text-sm text-slate-500 dark:text-gray-400">
                Page {page} of {pages}
              </span>
              {page < pages && (
                <Link
                  href={`/blog?page=${page + 1}`}
                  className="rounded-lg border border-slate-200 dark:border-white/10 px-4 py-2 text-sm font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
