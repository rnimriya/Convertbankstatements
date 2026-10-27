import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/blog/posts";
import { localizePost } from "@/lib/blog/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommentSection } from "@/components/blog/CommentSection";
import { BlogFAQAccordion } from "@/components/blog/BlogFAQAccordion";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { RELATED_MAP } from "@/lib/blog/related";
import { getTranslations } from "next-intl/server";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import sanitizeHtml from "sanitize-html";


export async function generateStaticParams() {
  return getAllPosts()
    .filter((p) => p.published)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const rawPost = getPostBySlug(slug);
  if (!rawPost) return { title: "Post not found" };
  const post = localizePost(rawPost, locale);
  const canonicalUrl = `https://www.convertstatement.online/blog/${slug}`;
  return {
    title: `${post.title} - Convert Statement`,
    description: post.excerpt,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      images: [{ url: post.featureImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.featureImage],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const rawPost = getPostBySlug(slug);
  if (!rawPost || !rawPost.published) notFound();

  const post = localizePost(rawPost, locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  const comments: never[] = [];
  const nonce = BUILD_NONCE;

  // Sanitize the (admin-authored) post HTML with a serverless-safe sanitizer.
  // Note: isomorphic-dompurify pulls in jsdom, which fails to run in Vercel's
  // serverless functions (caused blog articles to 500); sanitize-html is pure JS.
  const safeContent = sanitizeHtml(post.content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });

  const relatedSlugs = RELATED_MAP[slug] ?? [];
  const allPosts = getAllPosts();
  const relatedPosts = relatedSlugs
    .map((s) => {
      const p = allPosts.find((x) => x.slug === s && x.published);
      return p ? localizePost(p, locale) : null;
    })
    .filter(Boolean) as (typeof allPosts)[0][];

  // Build a table of contents from h2 headings (jump links = better UX + SEO).
  const tocHeadings: { id: string; text: string }[] = [];
  const contentWithIds = safeContent.replace(
    /<h2([^>]*)>([\s\S]*?)<\/h2>/gi,
    (_match, attrs: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      if (!text) return `<h2${attrs}>${inner}</h2>`;
      let id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      if (tocHeadings.some((h) => h.id === id)) {
        id = `${id}-${tocHeadings.length + 1}`;
      }
      tocHeadings.push({ id, text });
      if (/id=/.test(attrs)) return `<h2${attrs}>${inner}</h2>`;
      return `<h2${attrs} id="${id}">${inner}</h2>`;
    }
  );
  const showToc = tocHeadings.length >= 3;

  // Split the FAQ section out of the article body so it renders as a toggle
  // accordion (same look as the homepage FAQ) instead of plain Q&A text.
  // Posts without a matching FAQ section fall back to the plain body.
  let mainContent = contentWithIds;
  let faqItems: { q: string; a: string }[] = [];
  let faqHeadingId: string | null = null;
  let faqTrailingHtml = "";
  const faqHeadingMatch = contentWithIds.match(/<h2([^>]*)>Frequently asked questions<\/h2>/i);
  if (faqHeadingMatch && faqHeadingMatch.index !== undefined) {
    const faqStart = faqHeadingMatch.index;
    const faqTail = contentWithIds.slice(faqStart + faqHeadingMatch[0].length);
    const qaRegex = /<p><strong>([\s\S]*?)<\/strong><br\s*\/?>([\s\S]*?)<\/p>/gi;
    const pairs: { q: string; a: string }[] = [];
    let qaMatch: RegExpExecArray | null;
    let lastEnd = 0;
    while ((qaMatch = qaRegex.exec(faqTail)) !== null) {
      pairs.push({
        q: qaMatch[1].replace(/<[^>]+>/g, "").trim(),
        a: qaMatch[2].trim(),
      });
      lastEnd = qaMatch.index + qaMatch[0].length;
    }
    if (pairs.length > 0) {
      faqItems = pairs;
      mainContent = contentWithIds.slice(0, faqStart);
      faqTrailingHtml = faqTail.slice(lastEnd).trim();
      const tocFaq = tocHeadings.find((h) => /frequently asked questions/i.test(h.text));
      faqHeadingId = tocFaq ? tocFaq.id : "frequently-asked-questions";
    }
  }

  // Estimated reading time for the meta row.
  const wordCount = safeContent.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featureImage,
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Convert Statement",
      logo: { "@type": "ImageObject", url: "https://www.convertstatement.online/logo.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.convertstatement.online/blog/${slug}` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.convertstatement.online" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.convertstatement.online/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://www.convertstatement.online/blog/${slug}` },
    ],
  };

  return (
    <>
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
      />
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-zinc-950">
        {/* Feature image */}
        <div className="h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={post.featureImage}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-50 dark:bg-brand-900/20 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:text-violet-400"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mt-4 flex items-center gap-3 text-sm text-zinc-400 dark:text-zinc-500">
            <span>{post.author}</span>
            <span>·</span>
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{readingMinutes} min read</span>
            {post.updatedAt && post.updatedAt !== post.createdAt && (
              <>
                <span>·</span>
                <span className="italic">
                  Last updated on {new Date(post.updatedAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </>
            )}
          </div>

          {/* Table of contents */}
          {showToc && (
            <nav
              aria-label="Table of contents"
              className="mt-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6"
            >
              <p className="font-bold text-zinc-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
                In this article
              </p>
              <ul className="space-y-2">
                {tocHeadings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 hover:underline"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Content */}
          <article
            className="article-body mt-8 prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-xl prose-p:text-base prose-p:leading-relaxed prose-h2:scroll-mt-24 prose-img:rounded-2xl prose-img:shadow-lg prose-img:ring-1 prose-img:ring-slate-900/10 dark:prose-img:ring-white/10 prose-figcaption:text-left prose-figcaption:text-sm"
            dangerouslySetInnerHTML={{ __html: mainContent }}
          />

          {/* FAQ as a toggle accordion (homepage style) */}
          {faqItems.length > 0 && (
            <div className="mt-8">
              <h2
                id={faqHeadingId ?? undefined}
                className="font-display font-bold text-xl scroll-mt-24 text-zinc-900 dark:text-white mb-4"
              >
                Frequently asked questions
              </h2>
              <BlogFAQAccordion items={faqItems} />
              {faqTrailingHtml && (
                <div
                  className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-xl prose-p:text-base prose-p:leading-relaxed mt-8"
                  dangerouslySetInnerHTML={{ __html: faqTrailingHtml }}
                />
              )}
            </div>
          )}

          {/* In-article CTA */}
          <div className="mt-12 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Skip the manual work</h2>
            <p className="text-violet-100 mb-6 text-sm sm:text-base">
              Convert your bank statement PDF to Excel, CSV or OFX in under 15 seconds — first 8 pages free.
            </p>
            <a
              href="/signup"
              className="inline-block bg-white text-violet-900 font-bold px-8 py-3 rounded-2xl hover:bg-violet-50 transition-colors"
            >
              Try it free
            </a>
          </div>

          {/* Back link */}
          <div className="mt-12 border-t border-zinc-100 dark:border-zinc-800 pt-8">
            <a
              href={`/${locale}/blog`}
              className="text-sm font-medium text-violet-500 dark:text-violet-400 hover:underline"
            >
              {t("backToBlog")}
            </a>
          </div>

          {/* Related posts */}
          <RelatedPosts posts={relatedPosts} />

          {/* Comments */}
          <CommentSection
            slug={slug}
            initialComments={comments}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
