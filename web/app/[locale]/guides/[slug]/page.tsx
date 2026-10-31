import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import { getClusterBySlug, getAllClusterSlugs } from "@/lib/seo/clusters";
import { getPostBySlug } from "@/lib/blog/posts";
import { localizePost } from "@/lib/blog/i18n";
import { getTopBanksForSEO } from "@/lib/seo/banks";
import Link from "next/link";
import { ArrowRight, BookOpen, Building2 } from "lucide-react";
import sanitizeHtml from "sanitize-html";


export function generateStaticParams() {
  return getAllClusterSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const cluster = getClusterBySlug(slug);
  if (!cluster) return { title: "Guide not found" };
  const url = `https://www.convertstatement.online/guides/${slug}`;
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

  const nonce = BUILD_NONCE;

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
      logo: { "@type": "ImageObject", url: "https://www.convertstatement.online/logo.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.convertstatement.online/guides/${slug}` },
  };

  return (
    <div className="agri-sans">
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Navbar dark />
      <main className="min-h-screen bg-white">
        <section className="relative overflow-hidden bg-[#0B1F16] px-6 py-16 text-center">
          <div className="absolute left-1/2 -translate-x-1/2 -top-[420px] w-[1100px] h-[800px] pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(100,203,72,0.38), rgba(19,84,28,0.28) 55%, transparent 75%)" }} />
          <p className="agri-mono relative inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#B9D6B2] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
            Comprehensive Guide
          </p>
          <h1 className="relative text-3xl sm:text-4xl font-extrabold text-white leading-tight max-w-4xl mx-auto">
            {cluster.title}
          </h1>
          <p className="relative mt-4 text-lg text-zinc-300 max-w-2xl mx-auto">
            {cluster.description}
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content (Pillar) */}
          <div className="lg:col-span-8">
            <article
              className="prose prose-zinc max-w-none prose-a:text-[#007A33] prose-headings:font-extrabold"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
          </div>

          {/* Sidebar (Cluster Links) */}
          <div className="lg:col-span-4 space-y-10">
            {relatedPosts.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-zinc-900  mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#007A33]" /> Supporting Articles
                </h3>
                <div className="flex flex-col gap-3">
                  {relatedPosts.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      className="p-4 rounded-[24px] border border-[#CBE3C4] hover:border-[#007A33] bg-[#F2F4EC]"
                    >
                      <h4 className="font-semibold text-zinc-900 text-sm mb-1">
                        {p.title}
                      </h4>
                      <p className="text-xs text-zinc-500  line-clamp-2">
                        {p.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {relatedBanks.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-zinc-900  mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#007A33]" /> Specific Bank Guides
                </h3>
                <div className="flex flex-col gap-2">
                  {relatedBanks.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/banks/${b.slug}`}
                      className="text-sm text-zinc-600 hover:text-[#007A33] flex items-center justify-between group"
                    >
                      {b.name} <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            <div className="p-6 rounded-[24px] bg-[#007A33] text-white">
              <h3 className="font-bold mb-2">Ready to convert?</h3>
              <p className="text-[#BFE3B8] text-sm mb-4">Secure, fast, and 100% private. Start converting your statements today.</p>
              <Link href="/signup" className="block w-full text-center bg-white text-[#0B1F16] font-semibold py-2 rounded-full">
                Start Free Trial
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
