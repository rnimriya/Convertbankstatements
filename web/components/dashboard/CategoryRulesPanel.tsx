"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Tags, Trash2 } from "lucide-react";

interface Rule {
  pattern: string;
  category: string;
}

export function CategoryRulesPanel() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pattern, setPattern] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/category-rules");
      const data = await res.json();
      if (res.ok) setRules(data.rules ?? []);
    } catch {
      /* panel is non-critical */
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function addRule() {
    if (pattern.trim().length < 2 || !category.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/category-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pattern: pattern.trim(), category: category.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save the rule");
      setRules(data.rules ?? []);
      setPattern("");
      setCategory("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the rule");
    }
    setSaving(false);
  }

  async function removeRule(p: string) {
    try {
      const res = await fetch("/api/category-rules", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pattern: p }),
      });
      const data = await res.json();
      if (res.ok) setRules(data.rules ?? []);
    } catch {
      /* non-fatal */
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-brand-border bg-brand-surface p-5">
      <div className="flex items-center gap-2">
        <Tags size={17} className="text-pine-500" />
        <h3 className="font-bold text-brand-text">Smart Auto-Categorization — your rules</h3>
      </div>
      <p className="mt-1.5 text-sm text-brand-muted leading-relaxed">
        Teach the converter your chart of accounts. When a transaction&apos;s description contains
        your keyword, it gets your category in every export — on top of the built-in rules for
        payroll, fuel, software, fees, and more. Rules apply to your single and bulk conversions,
        including client portal uploads.
      </p>

      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <input
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="Description contains… e.g. SHELL OIL"
          className="flex-1 rounded-[20px] border border-brand-border bg-brand-bg px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-pine-500/40"
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category… e.g. Vehicle Fuel"
          className="sm:w-52 rounded-[20px] border border-brand-border bg-brand-bg px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-pine-500/40"
        />
        <button
          onClick={addRule}
          disabled={saving || pattern.trim().length < 2 || !category.trim()}
          className="flex items-center justify-center gap-1.5 rounded-[20px] bg-zinc-900 dark:bg-white px-4 py-2.5 text-sm font-semibold text-white dark:text-zinc-900 hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add rule
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <div className="mt-4 space-y-2">
        {loading ? (
          <p className="text-sm text-brand-muted flex items-center gap-2">
            <Loader2 size={14} className="animate-spin" /> Loading your rules…
          </p>
        ) : rules.length === 0 ? (
          <p className="text-sm text-brand-muted">
            No custom rules yet — the built-in rules are already categorizing your conversions.
          </p>
        ) : (
          rules.map((rule) => (
            <div
              key={rule.pattern}
              className="flex items-center justify-between gap-3 rounded-[20px] border border-brand-border bg-brand-bg px-4 py-2.5"
            >
              <p className="text-sm text-brand-text truncate">
                <span className="font-semibold">{rule.pattern}</span>
                <span className="text-brand-muted"> → </span>
                {rule.category}
              </p>
              <button
                onClick={() => removeRule(rule.pattern)}
                className="text-brand-muted hover:text-red-500 transition-colors shrink-0"
                aria-label={`Delete rule ${rule.pattern}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
