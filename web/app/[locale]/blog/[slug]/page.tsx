import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/blog/posts";
import { localizePost } from "@/lib/blog/i18n";
import { getCommentsForPost } from "@/lib/blog/comments";
import { getSession } from "@/lib/auth/session";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommentSection } from "@/components/blog/CommentSection";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { RELATED_MAP } from "@/lib/blog/related";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import sanitizeHtml from "sanitize-html";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const rawPost = getPostBySlug(slug);
  if (!rawPost) return { title: "Post not found" };
  const post = localizePost(rawPost, locale);
  const canonicalUrl = `https://convertstatement.online/blog/${slug}`;
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

  const comments = await getCommentsForPost(slug);
  const session = await getSession();
  const nonce = (await headers()).get("x-nonce") ?? undefined;

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
      logo: { "@type": "ImageObject", url: "https://convertstatement.online/logo.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://convertstatement.online/blog/${slug}` },
    keywords: post.tags.join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://convertstatement.online" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://convertstatement.online/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://convertstatement.online/blog/${slug}` },
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

        <div className="mx-auto max-w-3xl px-6 py-10">
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
              {new Date(post.createdAt).toLocaleDateString(locale === "en" ? "en-IN" : locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>

          {/* Content */}
          <article
            className="mt-8 prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-xl prose-p:text-base prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />

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
            isLoggedIn={!!session}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
