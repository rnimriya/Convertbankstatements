"use client";

import { useState, useEffect } from"react";
import { Plus, Copy, CheckCircle2, Trash2, Link2, Loader2 } from"lucide-react";

interface Portal {
  token: string;
  label: string;
  active: boolean;
  createdAt: string;
}

export function PortalsPanel() {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/portals")
      .then(r => r.json())
      .then(d => setPortals(d.portals ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function createPortal() {
    setCreating(true);
    try {
      const res = await fetch("/api/portals", {
        method:"POST",
        headers: {"Content-Type":"application/json" },
        body: JSON.stringify({ label: newLabel, slug: newSlug }),
      });
      const data = await res.json();
      if (res.ok) {
        setPortals(p => [data.portal, ...p]);
        setNewLabel("");
        setNewSlug("");
        setShowForm(false);
      } else {
        alert(data.error || "Failed to create portal");
      }
    } catch { /* non-fatal */ }
    setCreating(false);
  }

  async function deactivate(token: string) {
    await fetch(`/api/portals/${token}`, { method:"DELETE" });
    setPortals(p => p.filter(x => x.token !== token));
  }

  function copyUrl(token: string) {
    const url = `${window.location.origin}/p/${token}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    });
  }

  const activePortals = portals.filter(p => p.active);

  return (
    <div className="max-w-2xl">
      {/* Create form */}
      {showForm ? (
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 mb-6">
          <p className="text-sm font-semibold text-brand-text mb-3">New upload portal</p>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                placeholder="Internal Label (e.g. HDFC Statements – Sharma & Sons)"
                className="flex-1 rounded-xl border border-brand-border bg-brand-surface px-4 py-2.5 text-sm text-brand-text placeholder-slate-400 dark:placeholder-gray-500 outline-none focus:border-navy focus:bg-brand-surface dark:focus:bg-gray-800 focus:ring-2 focus:ring-navy/10"
                autoFocus
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <div className="flex-1 flex items-center rounded-xl border border-brand-border bg-brand-surface overflow-hidden focus-within:ring-2 focus-within:ring-navy/10 focus-within:border-navy transition-all">
                <span className="px-3 py-2.5 text-sm text-brand-muted bg-zinc-50 dark:bg-zinc-900 border-r border-brand-border hidden sm:block">
                  convertstatement.online/p/
                </span>
                <span className="px-2 py-2.5 text-sm text-brand-muted bg-zinc-50 dark:bg-zinc-900 border-r border-brand-border sm:hidden">
                  /p/
                </span>
                <input
                  type="text"
                  value={newSlug}
                  onChange={e => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="custom-slug (optional)"
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm text-brand-text placeholder-slate-400 outline-none w-full"
                  onKeyDown={e => e.key ==="Enter" && createPortal()}
                />
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={createPortal}
                  disabled={creating}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-950 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {creating ? <Loader2 size={14} className="animate-spin text-purple-500 dark:text-purple-400" /> : <Plus className="text-blue-500 dark:text-blue-400"  size={14} />}
                  Create
                </button>
                <button onClick={() => setShowForm(false)} className="px-3 py-2.5 rounded-xl border border-brand-border text-brand-muted hover:text-brand-text dark:hover:text-gray-200 text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-950 text-white text-sm font-semibold hover:opacity-90 transition-opacity mb-6"
        >
          <Plus className="text-blue-500 dark:text-blue-400"  size={14} />
          New portal link
        </button>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center gap-2 text-brand-muted text-sm py-8 justify-center">
          <Loader2 size={16} className="animate-spin text-purple-500 dark:text-purple-400" />
          Loading portals…
        </div>
      ) : activePortals.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center">
            <Link2 size={20} className="dark: text-emerald-500 dark:text-emerald-400" />
          </div>
          <p className="text-sm font-medium text-brand-muted">No portal links yet</p>
          <p className="text-xs text-brand-muted max-w-xs">Create a link to share with a client. They upload their PDF; you get the converted file billed to your account.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activePortals.map(portal => {
            const url = typeof window !=="undefined" ? `${window.location.origin}/p/${portal.token}` : `/p/${portal.token}`;
            const isCopied = copiedToken === portal.token;
            return (
              <div key={portal.token} className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-950/10 dark:bg-brand-400/10 flex items-center justify-center shrink-0">
                  <Link2 size={15} className="text-navy dark:text-violet-400 text-emerald-500 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-800 dark:text-white truncate">{portal.label}</p>
                  <p className="text-xs text-brand-muted truncate font-mono">/p/{portal.token.slice(0, 12)}…</p>
                </div>
                <button
                  onClick={() => copyUrl(portal.token)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${isCopied ?"bg-emerald-100 text-emerald-700" :"bg-zinc-900 dark:bg-zinc-950/10 text-brand-text hover:bg-zinc-900 dark:bg-zinc-950/20"}`}
                >
                  {isCopied ? <><CheckCircle2 className="text-emerald-500 dark:text-emerald-400"  size={12} /> Copied</> : <><Copy className="text-cyan-500 dark:text-cyan-400"  size={12} /> Copy link</>}
                </button>
                <button
                  onClick={() => deactivate(portal.token)}
                  className="p-1.5 rounded-lg text-zinc-300 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0"
                  title="Deactivate portal"
                >
                  <Trash2 className="text-rose-500 dark:text-rose-400"  size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
