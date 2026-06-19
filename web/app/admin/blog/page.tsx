import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth/admin";
import { getAllPosts } from "@/lib/blog/posts";
import { AdminDeleteButton } from "@/components/blog/AdminDeleteButton";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin - Blog Posts" };

export default async function AdminBlogPage() {
  if (!(await getAdminSession())) {
    redirect("/login");
  }

  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Blog Posts</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {posts.length} total posts
            </p>
          </div>
          <Link
            href="/admin/blog/new"
            className="rounded-xl bg-brand-400 px-4 py-2.5 text-sm font-bold text-black hover:bg-brand-300 transition-colors shadow-glow-sm"
          >
            + New Post
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-white dark:bg-zinc-950/5 border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-300">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-300 hidden sm:table-cell">Author</th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-300 hidden md:table-cell">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-300">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr
                  key={post.id}
                  className={`border-b border-zinc-100 dark:border-white/5 ${i % 2 === 0 ? "" : "bg-zinc-50 dark:bg-zinc-900/50 dark:bg-white dark:bg-zinc-950/[0.02]"}`}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white line-clamp-1">{post.title}</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{post.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 hidden sm:table-cell">{post.author}</td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 hidden md:table-cell">
                    {new Date(post.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        post.published
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-zinc-100 dark:bg-white dark:bg-zinc-950/10 text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-violet-500 dark:text-violet-400 hover:underline text-xs"
                      >
                        View
                      </Link>
                      {!post.id.startsWith("seed-") && (
                        <AdminDeleteButton postId={post.slug} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

