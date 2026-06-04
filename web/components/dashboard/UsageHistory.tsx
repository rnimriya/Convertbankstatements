"use client";

import { FileText, Clock, Info } from "lucide-react";

interface Log {
  id: string;
  fileName: string;
  pageCount: number;
  transactionCount: number;
  billingType: string;
  bankName: string | null;
  createdAt: Date;
  exportFormats: string[];
}

const BILLING_BADGE: Record<string, { label: string; cls: string }> = {
  FREE_TIER: { label: "Free", cls: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" },
  SUBSCRIPTION: { label: "Subscription", cls: "bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400" },
  PAY_AS_YOU_GO: { label: "$1.99", cls: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" },
};

export function UsageHistory({ logs, isDemo }: { logs: Log[]; isDemo?: boolean }) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-800 py-16 text-center">
        {isDemo ? (
          <>
            <Info className="h-10 w-10 text-amber-400" />
            <p className="mt-3 text-base font-semibold text-slate-700 dark:text-gray-200">History not available in demo mode</p>
            <p className="mt-1 text-sm text-slate-400 dark:text-gray-500">
              <a href="/signup" className="text-brand-600 dark:text-brand-400 underline">Sign up free</a> to track your processing history.
            </p>
          </>
        ) : (
          <>
            <Clock className="h-10 w-10 text-slate-200 dark:text-gray-600" />
            <p className="mt-3 text-base font-semibold text-slate-500 dark:text-gray-400">No documents yet</p>
            <p className="mt-1 text-sm text-slate-400 dark:text-gray-500">Upload your first bank statement to get started.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => {
        const badge = BILLING_BADGE[log.billingType] ?? { label: log.billingType, cls: "bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300" };
        const date = new Date(log.createdAt);
        return (
          <div
            key={log.id}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-800 px-5 py-4 shadow-sm hover:shadow-md dark:hover:shadow-black/20 transition-shadow"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/30">
              <FileText className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-gray-200">{log.fileName}</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-gray-400">
                {log.bankName && <span className="font-medium">{log.bankName} · </span>}
                {log.pageCount}p · {log.transactionCount} txns
                {log.exportFormats.length > 0 && ` · ${log.exportFormats.join(", ").toUpperCase()}`}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.cls}`}>
                {badge.label}
              </span>
              <span className="text-xs text-slate-400 dark:text-gray-500">
                {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
