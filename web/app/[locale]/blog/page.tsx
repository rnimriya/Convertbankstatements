import Link from "next/link";
import { getPublishedPosts, getAllPosts } from "@/lib/blog/posts";
import { isIndiaRelevantPost } from "@/lib/blog/india-filter";
import { localizePost } from "@/lib/blog/i18n";
import { IndiaBlogPopular } from "@/components/blog/IndiaBlogPopular";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getTranslations } from "next-intl/server";
import { isIndiaSite } from "@/lib/site-region";
import { IndiaHeadingBand, IndiaStickyBar } from "@/components/inner-india/IndiaInner";


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
  searchParams: Promise<{ page?: string; cat?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const activeCat = (sp.cat ?? "").trim();
  const { posts: rawPosts, total, pages } = getPublishedPosts(page, 12);
  const t = await getTranslations({ locale, namespace: "blog" });

  // Apply locale translations to posts for listing
  const posts = rawPosts.map((p) => localizePost(p, locale));
  const IN = isIndiaSite();

  // India (.in): magazine "Most Popular" layout with category tabs.
  // Categories are the most-used tags across IN-visible posts; ?cat=
  // filters by tag. .online keeps the flow above untouched.
  const IN_PER_PAGE = 12;
  const inAll = IN
    ? getAllPosts().filter((p) => p.published && isIndiaRelevantPost(p))
    : [];
  const tagCounts = new Map<string, number>();
  for (const p of inAll) {
    for (const tag of p.tags) {
      const key = tag.trim();
      if (key) tagCounts.set(key, (tagCounts.get(key) ?? 0) + 1);
    }
  }
  const inCategories = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);
  const inFiltered = activeCat
    ? inAll.filter((p) =>
        p.tags.some((tag) => tag.trim().toLowerCase() === activeCat.toLowerCase())
      )
    : inAll;
  const inPages = Math.max(1, Math.ceil(inFiltered.length / IN_PER_PAGE));
  const inPage = Math.min(page, inPages);
  const inPosts = inFiltered
    .slice((inPage - 1) * IN_PER_PAGE, inPage * IN_PER_PAGE)
    .map((p) => localizePost(p, locale));
  const inPageHref = (n: number) =>
    `/${locale}/blog?page=${n}${activeCat ? `&cat=${encodeURIComponent(activeCat)}` : ""}`;

  return (
    <div className="agri-sans">
      <Navbar />
      <main className={IN ? "min-h-screen bg-[#FAFAFC]" : "min-h-screen bg-white"}>
        {/* Hero */}
        {IN ? (
          <IndiaHeadingBand
            title={t("title")}
            subtitle={
              <>
                {t("subtitle")}
                {total > 0 && <span className="ml-1">{t("articlesCount", { count: total })}</span>}
              </>
            }
          />
        ) : (
        <section className="relative overflow-hidden pt-[124px] pb-16 px-6 text-center" style={{ background: "linear-gradient(180deg, #E9F5E4 0%, #F4FAF1 70%, #FFFFFF 100%)" }}>
          <div className="absolute left-1/2 -translate-x-1/2 -top-[420px] w-[1100px] h-[800px] pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(44,160,28,0.18), transparent 72%)" }} />
          <span className="relative inline-flex items-center gap-2 rounded-full bg-white border border-[#D8E8D2] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#007A33] mb-4 shadow-sm"><span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />Blog</span>
          <h1 className="relative font-display font-bold text-[1.8rem] sm:text-[2.4rem] text-[#0B1F16] tracking-tight">
            {t("title")}
          </h1>
          <p className="relative mt-3 text-base text-zinc-600 max-w-xl mx-auto">
            {t("subtitle")}
            {total > 0 && <span className="ml-1">{t("articlesCount", { count: total })}</span>}
          </p>
        </section>
        )}

        {/* India (.in): Most Popular magazine layout + rest grid */}
        {IN && (
          <>
            {inPosts.length === 0 ? (
              <p className="py-16 text-center text-zinc-500">{t("noPostsYet")}</p>
            ) : (
              <>
                {inPage === 1 && (
                  <IndiaBlogPopular
                    posts={inPosts.slice(0, 8)}
                    locale={locale}
                    categories={inCategories}
                    activeCat={activeCat}
                  />
                )}
                {(inPage > 1 ? inPosts : inPosts.slice(8)).length > 0 && (
                  <section className="mx-auto max-w-7xl px-4 py-14">
                    {inPage === 1 && (
                      <h2 className="mb-8 text-2xl font-extrabold tracking-tight text-zinc-900">
                        More articles
                      </h2>
                    )}
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                      {(inPage > 1 ? inPosts : inPosts.slice(8)).map((post) => (
                        <article
                          key={post.id}
                          className="flex flex-col rounded-xl border border-[#e2e8f0] bg-white overflow-hidden"
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
                                  className="rounded-full bg-[#ecfdf5] px-2 py-0.5 text-[11px] font-semibold text-[#047857]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <Link href={`/${locale}/blog/${post.slug}`}>
                              <h3 className="font-display font-bold text-zinc-900 leading-snug">
                                {post.title}
                              </h3>
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
                  </section>
                )}
              </>
            )}
            {inPages > 1 && (
              <div className="flex items-center justify-center gap-2 pb-16">
                {inPage > 1 && (
                  <Link
                    href={inPageHref(inPage - 1)}
                    className="rounded-full border border-[#E3EDE0] px-4 py-2 text-sm font-medium text-zinc-700"
                  >
                    {t("previous")}
                  </Link>
                )}
                <span className="text-sm text-zinc-500">
                  {t("page", { current: inPage, total: inPages })}
                </span>
                {inPage < inPages && (
                  <Link
                    href={inPageHref(inPage + 1)}
                    className="rounded-full border border-[#E3EDE0] px-4 py-2 text-sm font-medium text-zinc-700"
                  >
                    {t("next")}
                  </Link>
                )}
              </div>
            )}
          </>
        )}

        {/* Grid (.online) */}
        {!IN && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          {posts.length === 0 ? (
            <p className="text-center text-zinc-500">{t("noPostsYet")}</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className={IN
                    ? "flex flex-col rounded-xl border border-[#e2e8f0] bg-white overflow-hidden"
                    : "flex flex-col rounded-[24px] border border-[#E3EDE0] bg-white overflow-hidden shadow-[0_1px_2px_rgba(16,24,40,0.04)]"}
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
                          className={IN
                            ? "rounded-full bg-[#ecfdf5] px-2 py-0.5 text-[11px] font-semibold text-[#047857]"
                            : "rounded-full bg-[#E3F2DF] px-2 py-0.5 text-[11px] font-semibold text-[#007A33]"}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link href={`/${locale}/blog/${post.slug}`}>
                      <h2 className="font-display font-bold text-zinc-900 leading-snug">
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
                  className="rounded-full border border-[#E3EDE0] px-4 py-2 text-sm font-medium text-zinc-700"
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
                  className="rounded-full border border-[#E3EDE0] px-4 py-2 text-sm font-medium text-zinc-700"
                >
                  {t("next")}
                </Link>
              )}
            </div>
          )}
        </section>
        )}
        {IN && <IndiaStickyBar />}
      </main>
      <Footer />
    </div>
  );
}
