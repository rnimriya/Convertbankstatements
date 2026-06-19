"use client";

import { SubTier } from "@/types/billing";

const FREE_PAGE_CAP = 8;

interface Props {
  tier: SubTier;
  pagesUsed: number;
  monthlyPageLimit: number;
}

export function FreePagesIndicator({ tier, pagesUsed, monthlyPageLimit }: Props) {
  // Any paid tier (Basic/Pro/Business) shows the monthly-quota indicator.
  if (tier !== "FREE") {
    const remaining = Math.max(0, monthlyPageLimit - pagesUsed);
    const pct = Math.min(100, (pagesUsed / monthlyPageLimit) * 100);
    const low = pct > 85;

    return (
      <div className={`flex items-center gap-4 px-4 py-3 rounded-xl border bg-white dark:bg-surface ${low ? "border-amber-200 dark:border-amber-700" : "border-zinc-200 dark:border-white/10"}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-zinc-500 dark:text-gray-400 uppercase tracking-wide">Monthly pages</span>
            <span className={`text-xs font-bold ${low ? "text-amber-600 dark:text-amber-400" : "text-navy dark:text-brand-400"}`}>
              {remaining.toLocaleString()} / {monthlyPageLimit.toLocaleString()} left
            </span>
          </div>
          <div className="h-1.5 w-full bg-zinc-100 dark:bg-white dark:bg-zinc-950/10 rounded-full overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${low ? "bg-amber-400" : "bg-navy dark:bg-brand-400"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        {low && (
          <a href="/pricing" className="shrink-0 text-xs font-semibold text-navy dark:text-brand-400 border border-navy/20 dark:border-brand-400/30 bg-zinc-900 dark:bg-zinc-950/5 dark:bg-brand-400/5 px-2.5 py-1 rounded-lg hover:bg-zinc-900 dark:bg-zinc-950/10 dark:hover:bg-brand-400/10 transition-colors">
            Upgrade
          </a>
        )}
      </div>
    );
  }

  if (tier === "FREE") {
    const remaining = Math.max(0, FREE_PAGE_CAP - pagesUsed);
    const pct = (pagesUsed / FREE_PAGE_CAP) * 100;
    const isDepleted = remaining === 0;

    return (
      <div className={`flex items-center gap-4 px-4 py-3 rounded-xl border ${isDepleted ? "border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20" : "border-zinc-200 dark:border-white/10 bg-white dark:bg-surface"}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-zinc-500 dark:text-gray-400 uppercase tracking-wide">Free pages</span>
            <span className={`text-xs font-bold tabular-nums ${isDepleted ? "text-amber-600 dark:text-amber-400" : "text-navy dark:text-brand-400"}`}>
              {remaining} / {FREE_PAGE_CAP} remaining
            </span>
          </div>
          <div className="h-1.5 w-full bg-zinc-100 dark:bg-white dark:bg-zinc-950/10 rounded-full overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-700 ${isDepleted ? "bg-amber-400" : "bg-navy dark:bg-brand-400"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        {isDepleted ? (
          <a href="/pricing" className="shrink-0 text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-950 px-2.5 py-1 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap">
            Upgrade
          </a>
        ) : (
          <div className="shrink-0 text-2xl font-bold tabular-nums text-navy dark:text-brand-400">
            {remaining}
          </div>
        )}
      </div>
    );
  }

  return null;
}
