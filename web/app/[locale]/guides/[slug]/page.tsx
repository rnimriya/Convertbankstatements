import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { headers } from "next/headers";
import { getClusterBySlug, getAllClusterSlugs } from "@/lib/seo/clusters";
import { getPostBySlug } from "@/lib/blog/posts";
import { localizePost } from "@/lib/blog/i18n";
import { getTopBanksForSEO } from "@/lib/seo/banks";
import Link from "next/link";
import { ArrowRight, BookOpen, Building2 } from "lucide-react";
import sanitizeHtml from "sanitize-html";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getAllClusterSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const cluster = getClusterBySlug(slug);
  if (!cluster) return { title: "Guide not found" };
  const url = `https://convertstatement.online/guides/${slug}`;
  return {
    title: `${cluster.title} - Convert Statement`,
    description: cluster.description,
    alternates: { canonical: url },
    openGraph: { title: cluster.title, description: cluster.description, url, type: "article" },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const cluster = getClusterBySlug(slug);
  if (!cluster) notFound();

  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const safeContent = sanitizeHtml(cluster.longContent, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel"],
    },
  });

  // Resolve related blog posts
  const relatedPosts = cluster.relatedBlogSlugs
    .map((s) => {
      const p = getPostBySlug(s);
      return p && p.published ? localizePost(p, locale) : null;
    })
    .filter(Boolean) as NonNullable<ReturnType<typeof localizePost>>[];

  // Resolve related banks
  const allBanks = getTopBanksForSEO(200);
  const relatedBanks = cluster.relatedBankSlugs
    .map((bslug) => allBanks.find((b) => b.slug === bslug))
    .filter(Boolean) as NonNullable<typeof allBanks[0]>[];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: cluster.title,
    description: cluster.description,
    author: {
      "@type": "Organization",
      name: "Convert Statement",
    },
    publisher: {
      "@type": "Organization",
      name: "Convert Statement",
      logo: { "@type": "ImageObject", url: "https://convertstatement.online/logo.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://convertstatement.online/guides/${slug}` },
  };

  return (
    <>
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-zinc-950">
        <section className="bg-gradient-to-b from-violet-50/60 to-white dark:from-zinc-900 dark:to-zinc-950 border-b border-zinc-100 dark:border-zinc-800 px-6 py-16 text-center">
          <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-3">
            Comprehensive Guide
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white leading-tight max-w-4xl mx-auto">
            {cluster.title}
          </h1>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
            {cluster.description}
          </p>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content (Pillar) */}
          <div className="lg:col-span-8">
            <article
              className="prose prose-zinc dark:prose-invert max-w-none prose-a:text-violet-600 hover:prose-a:text-violet-500 dark:prose-a:text-violet-400"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
          </div>

          {/* Sidebar (Cluster Links) */}
          <div className="lg:col-span-4 space-y-10">
            {relatedPosts.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-violet-500" /> Supporting Articles
                </h3>
                <div className="flex flex-col gap-3">
                  {relatedPosts.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-violet-700 bg-zinc-50 dark:bg-zinc-900/50 transition-colors"
                    >
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors text-sm mb-1">
                        {p.title}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                        {p.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {relatedBanks.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-emerald-500" /> Specific Bank Guides
                </h3>
                <div className="flex flex-col gap-2">
                  {relatedBanks.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/banks/${b.slug}`}
                      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 flex items-center justify-between group"
                    >
                      {b.name} <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            <div className="p-6 rounded-2xl bg-violet-600 text-white">
              <h3 className="font-bold mb-2">Ready to convert?</h3>
              <p className="text-violet-100 text-sm mb-4">Secure, fast, and 100% private. Start converting your statements today.</p>
              <Link href="/signup" className="block w-full text-center bg-white text-violet-900 font-semibold py-2 rounded-lg hover:bg-zinc-50 transition-colors">
                Start Free Trial
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
