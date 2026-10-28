import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";

interface Props {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null;
  return (
    <aside className="mt-12 border-t border-zinc-100 pt-8">
      <h2 className="text-lg font-bold text-zinc-900 mb-5">Related Articles</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {posts.slice(0, 4).map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex gap-3 rounded-xl border border-zinc-200 bg-white p-3 hover:border-brand-300 hover:bg-zinc-50 transition-colors"
          >
            <img
              src={post.featureImage}
              alt={post.title}
              loading="lazy"
              decoding="async"
              className="h-16 w-24 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-pine-500 mb-0.5">
                {post.tags[0] ?? "Banking"}
              </p>
              <p className="text-sm font-semibold text-zinc-800 line-clamp-2 group-hover:text-brand-600 transition-colors leading-snug">
                {post.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
