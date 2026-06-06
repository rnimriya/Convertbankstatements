"use client";

import { useRouter } from "next/navigation";

export function AdminDeleteButton({ postId }: { postId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    const slug = postId;
    const res = await fetch(`/api/blog/${slug}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Delete failed. The post may be a seed post.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-xs"
    >
      Delete
    </button>
  );
}
