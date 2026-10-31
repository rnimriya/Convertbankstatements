import Link from "next/link";
import { getPublishedPosts } from "@/lib/blog/posts";
import { localizePost } from "@/lib/blog/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getTranslations } from "next-intl/server";


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
    <div className="agri-sans">
      <Navbar dark />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#0B1F16] py-14 px-6 text-center">
          <div className="absolute left-1/2 -translate-x-1/2 -top-[420px] w-[1100px] h-[800px] pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(100,203,72,0.38), rgba(19,84,28,0.28) 55%, transparent 75%)" }} />
          <h1 className="relative font-extrabold text-4xl text-white">
            {t("title")}
          </h1>
          <p className="relative mt-3 text-base text-zinc-300 max-w-xl mx-auto">
            {t("subtitle")}
            {total > 0 && <span className="ml-1">{t("articlesCount", { count: total })}</span>}
          </p>
        </section>

        {/* Grid */}
        <section className="mx-auto max-w-6xl px-6 py-12">
          {posts.length === 0 ? (
            <p className="text-center text-zinc-500">{t("noPostsYet")}</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col rounded-[24px] border border-[#CBE3C4] bg-white overflow-hidden"
                >
                  <Link href={`/${locale}/blog/${post.slug}`} className="block overflow-hidden">
                    <img
                      src={post.featureImage}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="h-48 w-full object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#E3F2DF] px-2 py-0.5 text-[11px] font-semibold text-[#007A33]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link href={`/${locale}/blog/${post.slug}`}>
                      <h2 className="font-bold text-zinc-900 leading-snug">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="mt-2 text-sm text-zinc-500 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
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
                  className="rounded-full border border-[#CBE3C4] px-4 py-2 text-sm font-medium text-zinc-700"
                >
                  {t("previous")}
                </Link>
              )}
              <span className="text-sm text-zinc-500">
                {t("page", { current: page, total: pages })}
              </span>
              {page < pages && (
                <Link
                  href={`/${locale}/blog?page=${page + 1}`}
                  className="rounded-full border border-[#CBE3C4] px-4 py-2 text-sm font-medium text-zinc-700"
                >
                  {t("next")}
                </Link>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
