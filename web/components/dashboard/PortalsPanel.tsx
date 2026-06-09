"use client";

import { useState, useEffect } from "react";
import { Plus, Copy, CheckCircle2, Trash2, Link2, Loader2 } from "lucide-react";

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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel }),
      });
      const data = await res.json();
      if (res.ok) {
        setPortals(p => [data.portal, ...p]);
        setNewLabel("");
        setShowForm(false);
      }
    } catch { /* non-fatal */ }
    setCreating(false);
  }

  async function deactivate(token: string) {
    await fetch(`/api/portals/${token}`, { method: "DELETE" });
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
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
          <p className="text-sm font-semibold text-slate-700 mb-3">New upload portal</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              placeholder="e.g. HDFC Statements – Sharma & Sons"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-navy focus:bg-white focus:ring-2 focus:ring-navy/10"
              onKeyDown={e => e.key === "Enter" && createPortal()}
              autoFocus
            />
            <button
              onClick={createPortal}
              disabled={creating}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Create
            </button>
            <button onClick={() => setShowForm(false)} className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 text-sm transition-colors">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:opacity-90 transition-opacity mb-6"
        >
          <Plus size={14} />
          New portal link
        </button>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm py-8 justify-center">
          <Loader2 size={16} className="animate-spin" />
          Loading portals…
        </div>
      ) : activePortals.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Link2 size={20} className="text-slate-300" />
          </div>
          <p className="text-sm font-medium text-slate-500">No portal links yet</p>
          <p className="text-xs text-slate-400 max-w-xs">Create a link to share with a client. They upload their PDF; you get the converted file billed to your account.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activePortals.map(portal => {
            const url = typeof window !== "undefined" ? `${window.location.origin}/p/${portal.token}` : `/p/${portal.token}`;
            const isCopied = copiedToken === portal.token;
            return (
              <div key={portal.token} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
                  <Link2 size={15} className="text-navy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{portal.label}</p>
                  <p className="text-xs text-slate-400 truncate font-mono">/p/{portal.token.slice(0, 12)}…</p>
                </div>
                <button
                  onClick={() => copyUrl(portal.token)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${isCopied ? "bg-emerald-100 text-emerald-700" : "bg-navy/10 text-navy hover:bg-navy/20"}`}
                >
                  {isCopied ? <><CheckCircle2 size={12} /> Copied</> : <><Copy size={12} /> Copy link</>}
                </button>
                <button
                  onClick={() => deactivate(portal.token)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0"
                  title="Deactivate portal"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
