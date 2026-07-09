"use client";

import { FileText } from"lucide-react";
import { Badge } from"@/components/ui/Badge";
import { EmptyState } from"@/components/ui/EmptyState";
import { Clock, Info } from"lucide-react";

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

const BILLING_BADGE: Record<string, { label: string; variant:"success" |"brand" |"warning" }> = {
  FREE_TIER:    { label:"Free",         variant:"success" },
  SUBSCRIPTION: { label:"Subscription", variant:"brand"   },
};

export function UsageHistory({ logs, isDemo }: { logs: Log[]; isDemo?: boolean }) {
  if (logs.length === 0) {
    if (isDemo) {
      return (
        <div className="rounded-2xl border border-dashed border-brand-border bg-brand-bg">
          <EmptyState
            icon={<Info className="h-full w-full" />}
            title="History not available in demo mode"
            description="Sign up free to track your processing history."
            cta={{ label:"Sign up free", href:"/signup", variant:"primary", size:"sm" }}
          />
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-dashed border-brand-border bg-brand-bg">
        <EmptyState
          icon={<Clock className="h-full w-full" />}
          title="No documents yet"
          description="Upload your first bank statement to get started."
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => {
        const badge = BILLING_BADGE[log.billingType];
        const date = new Date(log.createdAt);
        return (
          <div
            key={log.id}
            className="flex items-center gap-4 rounded-2xl border border-brand-border bg-brand-bg px-5 py-4 shadow-sm hover:shadow-md dark:hover:shadow-black/20 transition-shadow"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/30">
              <FileText className="h-5 w-5 dark:text-violet-400 text-indigo-500 dark:text-indigo-400" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-brand-text">{log.fileName}</p>
              <p className="mt-0.5 text-xs text-brand-muted">
                {log.bankName && <span className="font-medium">{log.bankName} · </span>}
                {log.pageCount}p · {log.transactionCount} txns
                {log.exportFormats.length > 0 && ` · ${log.exportFormats.join(",").toUpperCase()}`}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
              {badge ? (
                <Badge variant={badge.variant} size="sm" dot>{badge.label}</Badge>
              ) : (
                <Badge variant="default" size="sm">{log.billingType}</Badge>
              )}
              <span className="text-xs text-brand-muted">
                {date.toLocaleDateString("en-US", { month:"short", day:"numeric" })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
