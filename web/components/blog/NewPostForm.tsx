"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const INPUT =
  "w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white dark:bg-zinc-950/5 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 outline-none transition focus:border-brand-400 dark:focus:border-brand-500 focus:bg-white dark:bg-zinc-950 dark:focus:bg-surface-raised focus:ring-2 focus:ring-brand-400/20";

export function NewPostForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featureImage, setFeatureImage] = useState("");
  const [author, setAuthor] = useState("Convert Statement Team");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === autoSlug(title)) {
      setSlug(autoSlug(val));
    }
  };

  const autoSlug = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setError("Title, slug, and content are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          featureImage: featureImage.trim() || undefined,
          author: author.trim() || "Convert Statement Team",
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          published,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create post.");
      router.push("/admin/blog");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="How to Read an Indian Bank Statement"
          className={INPUT}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300">Slug *</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="how-to-read-indian-bank-statement"
          className={INPUT}
          required
        />
        <p className="text-xs text-zinc-400 dark:text-gray-500">URL: /blog/{slug || "your-slug"}</p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300">Excerpt</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short description shown in the blog listing..."
          rows={2}
          className={INPUT + " resize-none"}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300">Content (HTML) *</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="<p>Your content here...</p><h2>Section</h2><p>...</p>"
          rows={14}
          className={INPUT + " resize-y font-mono text-xs"}
          required
        />
        <p className="text-xs text-zinc-400 dark:text-gray-500">Enter HTML content. Use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt; tags.</p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300">Feature Image URL</label>
        <input
          type="url"
          value={featureImage}
          onChange={(e) => setFeatureImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className={INPUT}
        />
        <p className="text-xs text-zinc-400 dark:text-gray-500">Leave blank to auto-generate from slug.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={INPUT}
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="banking, guide, SBI"
            className={INPUT}
          />
          <p className="text-xs text-zinc-400 dark:text-gray-500">Comma-separated.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 dark:border-white/20 accent-brand-500"
        />
        <label htmlFor="published" className="text-sm font-medium text-zinc-700 dark:text-gray-300">
          Publish immediately
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-400 py-3 text-sm font-bold text-black shadow-glow-sm hover:bg-brand-300 hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</> : "Create Post"}
      </button>
    </form>
  );
}
