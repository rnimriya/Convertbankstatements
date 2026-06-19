"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Send, MessageSquare, CornerDownRight } from "lucide-react";
import type { BlogComment } from "@/lib/blog/types";

interface Props {
  slug: string;
  initialComments: BlogComment[];
  isLoggedIn: boolean;
}

/* ── Small reusable textarea + submit ────────────────────────────── */
function CommentForm({
  slug,
  parentId,
  placeholder,
  onPosted,
  onCancel,
}: {
  slug: string;
  parentId: string | null;
  placeholder: string;
  onPosted: (c: BlogComment) => void;
  onCancel?: () => void;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/blog/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, parentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to post.");
      onPosted(data as BlogComment);
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={3}
        maxLength={2000}
        className="w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white dark:bg-zinc-950/5 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 outline-none transition focus:border-brand-400 dark:focus:border-brand-500 focus:bg-white dark:bg-zinc-950 dark:focus:bg-surface-raised focus:ring-2 focus:ring-brand-400/20 resize-none"
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-xs text-zinc-400 dark:text-zinc-500">{text.length}/2000</span>
        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-brand-400 px-4 py-2 text-sm font-bold text-black shadow-glow-sm hover:bg-brand-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            {parentId ? "Reply" : "Post comment"}
          </button>
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </form>
  );
}

/* ── Avatar initial ──────────────────────────────────────────────── */
function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm";
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30 font-bold text-brand-700 dark:text-brand-300 uppercase ${dim}`}>
      {name[0]}
    </div>
  );
}

/* ── Formatted date ──────────────────────────────────────────────── */
function RelativeDate({ iso }: { iso: string }) {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  let label: string;
  if (diffMin < 1) label = "just now";
  else if (diffMin < 60) label = `${diffMin}m ago`;
  else if (diffHr < 24) label = `${diffHr}h ago`;
  else if (diffDay < 7) label = `${diffDay}d ago`;
  else label = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <time dateTime={iso} className="text-xs text-zinc-400 dark:text-gray-500">
      {label}
    </time>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
export function CommentSection({ slug, initialComments, isLoggedIn }: Props) {
  const [comments, setComments] = useState<BlogComment[]>(initialComments);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const topLevel = comments.filter((c) => !c.parentId);
  const repliesOf = (id: string) => comments.filter((c) => c.parentId === id);

  const handlePosted = (c: BlogComment) => {
    setComments((prev) => [...prev, c]);
    setReplyingTo(null);
  };

  return (
    <section className="mt-12 border-t border-zinc-100 dark:border-white/10 pt-8">
      {/* Header */}
      <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-brand-500" />
        Comments
        {comments.length > 0 && (
          <span className="ml-1 rounded-full bg-zinc-100 dark:bg-white dark:bg-zinc-950/10 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:text-gray-300">
            {comments.length}
          </span>
        )}
      </h2>

      {/* Top-level comment form */}
      {isLoggedIn ? (
        <CommentForm
          slug={slug}
          parentId={null}
          placeholder="Share your thoughts…"
          onPosted={handlePosted}
        />
      ) : (
        <div className="mt-6 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white dark:bg-zinc-950/5 px-6 py-5 text-center">
          <p className="text-sm text-zinc-600 dark:text-gray-400">
            <Link
              href={`/login?redirectTo=/blog/${slug}`}
              className="font-semibold text-brand-500 dark:text-brand-400 hover:underline"
            >
              Sign in
            </Link>{" "}
            to leave a comment.
          </p>
        </div>
      )}

      {/* Comment list */}
      {topLevel.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-400 dark:text-gray-500 text-center">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <ul className="mt-8 space-y-7">
          {topLevel.map((comment) => {
            const replies = repliesOf(comment.id);
            const isReplying = replyingTo === comment.id;

            return (
              <li key={comment.id}>
                {/* Top-level comment */}
                <div className="flex gap-3">
                  <Avatar name={comment.userName ?? comment.userEmail} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-zinc-800 dark:text-gray-100">
                        {comment.userName ?? comment.userEmail}
                      </span>
                      <RelativeDate iso={comment.createdAt} />
                    </div>
                    <p className="mt-1 text-sm text-zinc-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {comment.content}
                    </p>

                    {/* Reply button */}
                    {isLoggedIn && !isReplying && (
                      <button
                        onClick={() => setReplyingTo(comment.id)}
                        className="mt-2 flex items-center gap-1 text-xs font-medium text-zinc-400 dark:text-zinc-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                      >
                        <CornerDownRight size={12} />
                        Reply
                      </button>
                    )}

                    {/* Inline reply form */}
                    {isReplying && (
                      <CommentForm
                        slug={slug}
                        parentId={comment.id}
                        placeholder={`Replying to ${comment.userName ?? comment.userEmail}…`}
                        onPosted={handlePosted}
                        onCancel={() => setReplyingTo(null)}
                      />
                    )}
                  </div>
                </div>

                {/* Replies (indented) */}
                {replies.length > 0 && (
                  <ul className="mt-4 ml-12 space-y-4 border-l-2 border-zinc-100 dark:border-white/10 pl-5">
                    {replies.map((reply) => (
                      <li key={reply.id} className="flex gap-3">
                        <Avatar name={reply.userName ?? reply.userEmail} size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-zinc-800 dark:text-gray-100">
                              {reply.userName ?? reply.userEmail}
                            </span>
                            <RelativeDate iso={reply.createdAt} />
                          </div>
                          <p className="mt-1 text-sm text-zinc-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {reply.content}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
