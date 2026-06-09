"use client";

import { SubTier } from "@/types/billing";

const FREE_PAGE_CAP = 8;

interface Props {
  tier: SubTier;
  pagesUsed: number;
  monthlyPageLimit: number;
}

export function FreePagesIndicator({ tier, pagesUsed, monthlyPageLimit }: Props) {
  if (tier === "PRO" || tier === "BUSINESS") {
    const remaining = Math.max(0, monthlyPageLimit - pagesUsed);
    const pct = Math.min(100, (pagesUsed / monthlyPageLimit) * 100);
    const low = pct > 85;

    return (
      <div className={`flex items-center gap-4 px-4 py-3 rounded-xl border bg-white ${low ? "border-amber-200" : "border-slate-200"}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Monthly pages</span>
            <span className={`text-xs font-bold ${low ? "text-amber-600" : "text-navy"}`}>
              {remaining.toLocaleString()} / {monthlyPageLimit.toLocaleString()} left
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${low ? "bg-amber-400" : "bg-navy"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        {low && (
          <a href="/pricing" className="shrink-0 text-xs font-semibold text-navy border border-navy/20 bg-navy/5 px-2.5 py-1 rounded-lg hover:bg-navy/10 transition-colors">
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
      <div className={`flex items-center gap-4 px-4 py-3 rounded-xl border bg-white ${isDepleted ? "border-amber-200 bg-amber-50" : "border-slate-200"}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Free pages</span>
            <span className={`text-xs font-bold tabular-nums ${isDepleted ? "text-amber-600" : "text-navy"}`}>
              {remaining} / {FREE_PAGE_CAP} remaining
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-700 ${isDepleted ? "bg-amber-400" : "bg-navy"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        {isDepleted ? (
          <a href="/pricing" className="shrink-0 text-xs font-semibold text-white bg-navy px-2.5 py-1 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap">
            Upgrade
          </a>
        ) : (
          <div className={`shrink-0 text-2xl font-bold tabular-nums ${isDepleted ? "text-amber-500" : "text-navy"}`}>
            {remaining}
          </div>
        )}
      </div>
    );
  }

  // PAYG
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white">
      <div className="w-7 h-7 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
        <span className="text-[11px] font-bold text-navy">₹</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">Pay-as-you-go</p>
        <p className="text-xs text-slate-500">₹49 per document · No monthly limit</p>
      </div>
    </div>
  );
}
