import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin";
import { NewPostForm } from "@/components/blog/NewPostForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin - New Blog Post" };

export default async function NewBlogPostPage() {
  if (!(await getAdminSession())) {
    redirect("/login");
  }
  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <a
            href="/admin/blog"
            className="text-sm text-brand-500 dark:text-brand-400 hover:underline"
          >
            ← Back to posts
          </a>
          <h1 className="mt-3 text-2xl font-extrabold text-zinc-900 dark:text-white">New Blog Post</h1>
        </div>
        <NewPostForm />
      </div>
    </main>
  );
}
