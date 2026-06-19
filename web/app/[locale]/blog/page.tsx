import Link from "next/link";
import { getPublishedPosts } from "@/lib/blog/posts";
import { localizePost } from "@/lib/blog/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: `${t("title")} - Convert Statement`,
    description: t("subtitle"),
  };
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const { posts: rawPosts, total, pages } = getPublishedPosts(page, 12);
  const t = await getTranslations({ locale, namespace: "blog" });

  // Apply locale translations to posts for listing
  const posts = rawPosts.map((p) => localizePost(p, locale));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-zinc-950">
        {/* Hero */}
        <section className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-14 px-6 text-center">
          <h1 className="font-display text-4xl font-extrabold text-zinc-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            {t("subtitle")}
            {total > 0 && <span className="ml-1">{t("articlesCount", { count: total })}</span>}
          </p>
        </section>

        {/* Grid */}
        <section className="mx-auto max-w-6xl px-6 py-12">
          {posts.length === 0 ? (
            <p className="text-center text-zinc-500 dark:text-zinc-400">{t("noPostsYet")}</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden hover:shadow-lg dark:hover:shadow-white/5 transition-shadow"
                >
                  <Link href={`/${locale}/blog/${post.slug}`} className="block overflow-hidden">
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
                          className="rounded-full bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 text-[11px] font-semibold text-brand-600 dark:text-violet-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link href={`/${locale}/blog/${post.slug}`}>
                      <h2 className="font-display font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-brand-600 dark:group-hover:text-violet-400 transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
                      <span>{post.author}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString(locale === "en" ? "en-IN" : locale, { day: "numeric", month: "short", year: "numeric" })}</span>
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
                  href={`/${locale}/blog?page=${page - 1}`}
                  className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-white dark:bg-zinc-950/5 transition-colors"
                >
                  {t("previous")}
                </Link>
              )}
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {t("page", { current: page, total: pages })}
              </span>
              {page < pages && (
                <Link
                  href={`/${locale}/blog?page=${page + 1}`}
                  className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-white dark:bg-zinc-950/5 transition-colors"
                >
                  {t("next")}
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
