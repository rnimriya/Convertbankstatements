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

  // Inject ids into h2 headings (jump links + the FAQ anchor id).
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

  // Design C v3 (owner-approved 2026-10-27): dark hero, title with the last
  // two words in gradient, white card overlapping the hero.
  const titleWords = post.title.split(" ");
  const titleHead = titleWords.length > 2 ? titleWords.slice(0, -2).join(" ") : "";
  const titleTail = titleWords.length > 2 ? titleWords.slice(-2).join(" ") : post.title;
  const authorInitials = post.author
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
      <main className="min-h-screen bg-[#fafafa]">
        {/* Dark hero */}
        <div className="bg-[#0b0b12] text-white">
          <div className="mx-auto max-w-[1060px] px-6 pt-10 pb-28">
            <nav aria-label="Breadcrumb" className="text-[13px] text-zinc-500 mb-6">
              <a href="/" className="hover:text-zinc-300">Home</a>
              <span className="mx-1.5">/</span>
              <a href={`/${locale}/blog`} className="hover:text-zinc-300">Blog</a>
              {post.tags[0] && (
                <>
                  <span className="mx-1.5">/</span>
                  <span>{post.tags[0]}</span>
                </>
              )}
            </nav>
            <h1 className="text-[40px] sm:text-[58px] font-black leading-[1.05] max-w-[900px]">
              {titleHead ? <>{titleHead} </> : null}
              <span className="bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
                {titleTail}
              </span>
            </h1>
            <p className="text-zinc-400 text-[19px] leading-relaxed max-w-[760px] mt-5">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap gap-2.5 mt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-zinc-700 px-3.5 py-1.5 text-[13px] text-zinc-300"
                >
                  {tag}
                </span>
              ))}
              <span className="rounded-full border border-zinc-700 px-3.5 py-1.5 text-[13px] text-zinc-300">
                {readingMinutes} min read
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1060px] px-6">
          {/* White card overlapping the hero */}
          <div className="relative z-10 -mt-16 rounded-[28px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.18)] px-6 sm:px-10 py-9">
            {/* Feature image — floated, article text wraps around it */}
            <figure className="blog-feature-figure">
              <img src={post.featureImage} alt={post.title} />
            </figure>

            {/* Author row */}
            <div className="mb-4 text-sm text-zinc-500">
              <span className="mr-2.5 inline-flex h-[42px] w-[42px] items-center justify-center rounded-full bg-emerald-700 font-extrabold text-white align-middle">
                {authorInitials}
              </span>
              <span>
                {post.author} · <time dateTime={post.createdAt}>{formattedDate}</time>
              </span>
            </div>

            {/* Content */}
            <article
              className="article-body"
              dangerouslySetInnerHTML={{ __html: mainContent }}
            />

            {/* FAQ as a toggle accordion */}
            {faqItems.length > 0 && (
              <div className="mt-9">
                <h2
                  id={faqHeadingId ?? undefined}
                  className="text-[28px] font-bold text-zinc-900 scroll-mt-24 mb-[18px] clear-both"
                >
                  Frequently asked questions
                </h2>
                <BlogFAQAccordion items={faqItems} />
                {faqTrailingHtml && (
                  <div
                    className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-xl prose-p:text-base prose-p:leading-relaxed mt-8"
                    dangerouslySetInnerHTML={{ __html: faqTrailingHtml }}
                  />
                )}
              </div>
            )}
          </div>

          {/* In-article CTA */}
          <div className="mt-9 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-[#09090b] px-8 py-8 text-white">
            <div>
              <p className="font-bold">Skip the manual work</p>
              <p className="text-zinc-400 text-sm mt-1">
                Convert your bank statement to Excel, CSV or QBO in minutes.
              </p>
            </div>
            <a
              href="/signup"
              className="shrink-0 rounded-full bg-gradient-to-r from-emerald-700 to-emerald-500 px-6 py-3 font-extrabold text-white whitespace-nowrap"
            >
              Convert my statement →
            </a>
          </div>

          {/* Back link */}
          <div className="mt-12 border-t border-zinc-100 pt-8">
            <a
              href={`/${locale}/blog`}
              className="text-sm font-medium text-emerald-500 hover:underline"
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
