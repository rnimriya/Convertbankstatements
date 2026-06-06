"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Send, MessageSquare } from "lucide-react";
import type { BlogComment } from "@/lib/blog/types";

interface Props {
  slug: string;
  initialComments: BlogComment[];
  isLoggedIn: boolean;
}

export function CommentSection({ slug, initialComments, isLoggedIn }: Props) {
  const [comments, setComments] = useState<BlogComment[]>(initialComments);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`/api/blog/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to post comment.");
      setComments((prev) => [data, ...prev]);
      setText("");
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-12 border-t border-slate-100 dark:border-white/10 pt-8">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-brand-500" />
        Comments
        {comments.length > 0 && (
          <span className="ml-1 rounded-full bg-slate-100 dark:bg-white/10 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:text-gray-300">
            {comments.length}
          </span>
        )}
      </h2>

      {/* Comment form */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mt-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            maxLength={2000}
            className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 outline-none transition focus:border-brand-400 dark:focus:border-brand-500 focus:bg-white dark:focus:bg-surface-raised focus:ring-2 focus:ring-brand-400/20 resize-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400 dark:text-gray-500">
              {text.length}/2000
            </span>
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="flex items-center gap-2 rounded-xl bg-brand-400 px-4 py-2 text-sm font-bold text-black shadow-glow-sm hover:bg-brand-300 hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Post comment
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
          )}
          {success && (
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">Comment posted.</p>
          )}
        </form>
      ) : (
        <div className="mt-6 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-6 py-5 text-center">
          <p className="text-sm text-slate-600 dark:text-gray-400">
            <Link href={`/login?redirectTo=/blog/${slug}`} className="font-semibold text-brand-500 dark:text-brand-400 hover:underline">
              Sign in
            </Link>{" "}
            to leave a comment.
          </p>
        </div>
      )}

      {/* Comment list */}
      {comments.length === 0 ? (
        <p className="mt-8 text-sm text-slate-400 dark:text-gray-500 text-center">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <ul className="mt-8 space-y-6">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30 text-sm font-bold text-brand-700 dark:text-brand-300 uppercase">
                {(c.userName ?? c.userEmail)[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800 dark:text-gray-100">
                    {c.userName ?? c.userEmail}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-700 dark:text-gray-300 whitespace-pre-wrap">
                  {c.content}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
