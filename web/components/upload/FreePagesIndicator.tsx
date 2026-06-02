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
    const barColor = pct > 85 ? "bg-amber-500" : "bg-brand-500";

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-sm font-medium">
          <span className="text-slate-700">Monthly pages</span>
          <span className={remaining === 0 ? "text-red-600 font-semibold" : "text-slate-600"}>
            {remaining.toLocaleString()} / {monthlyPageLimit.toLocaleString()} remaining
          </span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {remaining === 0 && (
          <p className="mt-2 text-xs text-amber-700">
            Monthly limit reached. Additional documents are $1.99 each.
          </p>
        )}
      </div>
    );
  }

  if (tier === "FREE") {
    const remaining = Math.max(0, FREE_PAGE_CAP - pagesUsed);
    const pct = (pagesUsed / FREE_PAGE_CAP) * 100;
    const isDepleted = remaining === 0;

    return (
      <div
        className={`rounded-xl border p-4 shadow-sm transition-colors ${
          isDepleted
            ? "border-amber-300 bg-amber-50"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">Free pages</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {isDepleted
                ? "Upgrade or pay $1.99 per document"
                : `${remaining} free page${remaining !== 1 ? "s" : ""} remaining`}
            </p>
          </div>
          <div className="text-right">
            <span
              className={`text-3xl font-bold tabular-nums ${
                isDepleted ? "text-amber-600" : "text-brand-600"
              }`}
            >
              {remaining}
            </span>
            <span className="text-xs text-slate-400 ml-1">/ {FREE_PAGE_CAP}</span>
          </div>
        </div>

        <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
          <div
            className={`h-2 rounded-full transition-all duration-700 ${
              isDepleted ? "bg-amber-500" : "bg-brand-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs text-slate-400">
          {Array.from({ length: FREE_PAGE_CAP }).map((_, i) => (
            <div
              key={i}
              className={`h-1 w-1 rounded-full ${
                i < pagesUsed ? (isDepleted ? "bg-amber-400" : "bg-brand-400") : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // PAYG tier
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-700">Pay-as-you-go</p>
      <p className="text-xs text-slate-500 mt-0.5">$1.99 per document · No monthly limit</p>
    </div>
  );
}
