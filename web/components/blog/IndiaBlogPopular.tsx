import Link from "next/link";
import { Heart, User, Clock, FileText } from "lucide-react";
import type { BlogPost } from "@/lib/blog/types";

/**
 * India (.in) blog listing — "Most Popular" magazine layout (owner order
 * 2026-11-28, layout pattern from owner's reference image; our own text,
 * images and green #047857). Server component; category tabs are plain
 * links (?cat=tag) handled by the blog page.
 */

function fmtDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === "en" ? "en-IN" : locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Meta({ post, locale }: { post: BlogPost; locale: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
      <span className="inline-flex items-center gap-1.5">
        <User size={13} className="text-[#047857]" />
        {post.author || "Convert Statement"}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock size={13} className="text-[#047857]" />
        {fmtDate(post.createdAt, locale)}
      </span>
    </div>
  );
}

function Pill({ label, onImage = false }: { label: string; onImage?: boolean }) {
  return (
    <span
      className={
        onImage
          ? "rounded-full bg-[#047857] px-3 py-1 text-[11px] font-bold text-white"
          : "rounded-full bg-[#ecfdf5] px-2.5 py-0.5 text-[11px] font-semibold text-[#047857]"
      }
    >
      {label}
    </span>
  );
}

function Thumb({
  post,
  className,
}: {
  post: BlogPost;
  className: string;
}) {
  if (!post.featureImage) {
    return (
      <div className={`${className} flex items-center justify-center bg-[#ecfdf5]`}>
        <FileText size={36} className="text-[#047857]" />
      </div>
    );
  }
  return (
    <img
      src={post.featureImage}
      alt={post.title}
      loading="lazy"
      decoding="async"
      className={`${className} object-cover`}
    />
  );
}

export function IndiaBlogPopular({
  posts,
  locale,
  categories,
  activeCat,
}: {
  posts: BlogPost[];
  locale: string;
  categories: string[];
  activeCat: string;
}) {
  const featured = posts[0];
  const sideList = posts.slice(1, 4);
  const bottomRow = posts.slice(4, 8);
  if (!featured) return null;

  const href = (p: BlogPost) => `/${locale}/blog/${p.slug}`;
  const tabHref = (cat: string) =>
    cat ? `/${locale}/blog?cat=${encodeURIComponent(cat)}` : `/${locale}/blog`;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-14">
      {/* Section header + category tabs */}
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-zinc-900">
            <Heart size={24} className="fill-[#047857] text-[#047857]" />
            Most Popular
          </h2>
          <div className="mt-3 h-[3px] w-44 rounded-full bg-[#047857]" />
        </div>
        {categories.length > 0 && (
          <nav className="flex flex-wrap items-center gap-1 rounded-xl bg-[#ecfdf5] px-2 py-2">
            {["", ...categories].map((cat) => {
              const active = activeCat === cat;
              return (
                <Link
                  key={cat || "all"}
                  href={tabHref(cat)}
                  className={
                    active
                      ? "rounded-lg bg-white px-3.5 py-1.5 text-sm font-bold text-[#047857] underline decoration-[#047857] decoration-2 underline-offset-4"
                      : "rounded-lg px-3.5 py-1.5 text-sm font-medium text-zinc-600"
                  }
                >
                  {cat || "All"}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {/* Top row: featured + side list */}
      <div className="mt-9 grid gap-10 lg:grid-cols-2">
        <article>
          <Link href={href(featured)} className="relative block overflow-hidden rounded-xl">
            <Thumb post={featured} className="aspect-[16/10] w-full" />
            {featured.tags[0] && (
              <span className="absolute bottom-4 left-4">
                <Pill label={featured.tags[0]} onImage />
              </span>
            )}
          </Link>
          <div className="mt-4">
            <Meta post={featured} locale={locale} />
          </div>
          <Link href={href(featured)}>
            <h3 className="mt-2.5 text-2xl font-extrabold leading-snug tracking-tight text-zinc-900">
              {featured.title}
            </h3>
          </Link>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 line-clamp-2">
            {featured.excerpt}
          </p>
        </article>

        <div className="flex flex-col justify-between gap-7">
          {sideList.map((post) => (
            <article key={post.id} className="flex gap-5">
              <Link href={href(post)} className="block w-40 shrink-0 overflow-hidden rounded-xl sm:w-48">
                <Thumb post={post} className="aspect-[4/3] w-full" />
              </Link>
              <div className="min-w-0">
                {post.tags[0] && <Pill label={post.tags[0]} />}
                <Link href={href(post)}>
                  <h3 className="mt-2 font-display text-base font-bold leading-snug text-zinc-900 line-clamp-3">
                    {post.title}
                  </h3>
                </Link>
                <div className="mt-2">
                  <Meta post={post} locale={locale} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Dashed divider */}
      <div className="my-10 border-t border-dashed border-zinc-300" />

      {/* Bottom row: 4 cards */}
      {bottomRow.length > 0 && (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {bottomRow.map((post) => (
            <article key={post.id}>
              <Link href={href(post)} className="block overflow-hidden rounded-xl">
                <Thumb post={post} className="aspect-[16/10] w-full" />
              </Link>
              <div className="mt-3.5">
                {post.tags[0] && <Pill label={post.tags[0]} />}
              </div>
              <Link href={href(post)}>
                <h3 className="mt-2 font-display text-base font-bold leading-snug text-zinc-900 line-clamp-3">
                  {post.title}
                </h3>
              </Link>
              <div className="mt-2">
                <Meta post={post} locale={locale} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
