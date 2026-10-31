"use client";

import { useMemo, useState } from "react";
import { FileText, Download, Info, TrendingUp, Layers, Clock } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import type { BillingContext } from "@/types/billing";

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

const FORMAT_LABEL: Record<string, string> = {
  csv: "CSV",
  xlsx: "Excel",
  ofx: "OFX",
  qfx: "QFX",
  sheets: "Sheets",
  qbo: "QBO",
};

const PAGE_SIZE = 8;

type Filter = "all" | "xlsx" | "csv" | "ofx" | "sheets" | "month";

export function UsageHistory({ logs, isDemo, billing }: { logs: Log[]; isDemo?: boolean; billing?: BillingContext }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(0);

  const now = new Date();
  const isThisMonth = (d: Date) => d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();

  const stats = useMemo(() => {
    const monthLogs = logs.filter(l => isThisMonth(new Date(l.createdAt)));
    const banks = new Set(logs.map(l => l.bankName).filter(Boolean));
    const formatCounts = new Map<string, number>();
    for (const l of logs) for (const f of l.exportFormats) formatCounts.set(f, (formatCounts.get(f) ?? 0) + 1);
    let topFormat: string | null = null;
    let topCount = 0;
    for (const [f, c] of formatCounts) if (c > topCount) { topFormat = f; topCount = c; }
    return {
      monthCount: monthLogs.length,
      bankCount: banks.size,
      topFormat,
      topCount,
      totalTxns: logs.reduce((s, l) => s + l.transactionCount, 0),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs]);

  const filtered = useMemo(() => {
    const sorted = [...logs].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    switch (filter) {
      case "month": return sorted.filter(l => isThisMonth(new Date(l.createdAt)));
      case "ofx": return sorted.filter(l => l.exportFormats.some(f => ["ofx", "qfx", "qbo"].includes(f)));
      case "all": return sorted;
      default: return sorted.filter(l => l.exportFormats.includes(filter));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs, filter]);

  const pageCountTotal = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCountTotal - 1);
  const pageLogs = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const exportCsv = () => {
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const rows = [
      ["File", "Bank", "Formats", "Pages", "Transactions", "Date"].join(","),
      ...filtered.map(l => [
        esc(l.fileName),
        esc(l.bankName ?? ""),
        esc(l.exportFormats.map(f => FORMAT_LABEL[f] ?? f.toUpperCase()).join(" + ")),
        l.pageCount,
        l.transactionCount,
        esc(new Date(l.createdAt).toISOString().slice(0, 10)),
      ].join(",")),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "conversion-history.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (logs.length === 0) {
    if (isDemo) {
      return (
        <div className="rounded-[24px] border border-dashed border-[#E3EDE0] bg-brand-surface">
          <EmptyState
            icon={<Info className="h-full w-full" />}
            title="History not available in demo mode"
            description="Sign up free to track your processing history."
            cta={{ label: "Sign up free", href: "/signup", variant: "primary", size: "sm" }}
          />
        </div>
      );
    }
    return (
      <div className="rounded-[24px] border border-dashed border-[#E3EDE0] bg-brand-surface">
        <EmptyState
          icon={<Clock className="h-full w-full" />}
          title="No documents yet"
          description="Upload your first bank statement to get started."
        />
      </div>
    );
  }

  const chips: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "xlsx", label: "Excel" },
    { id: "csv", label: "CSV" },
    { id: "ofx", label: "QBO / OFX" },
    { id: "sheets", label: "Sheets" },
    { id: "month", label: "This month" },
  ];

  const statCards = [
    {
      label: `Conversions · ${now.toLocaleDateString("en-IN", { month: "long" })}`,
      value: String(stats.monthCount),
      sub: `Across ${stats.bankCount} bank${stats.bankCount !== 1 ? "s" : ""}`,
      Icon: TrendingUp,
    },
    {
      label: "Pages converted",
      value: billing ? billing.pagesUsedThisPeriod.toLocaleString("en-IN") : String(logs.reduce((s, l) => s + l.pageCount, 0)),
      sub: billing ? `Of ${billing.monthlyPageLimit} plan pages` : "Across all conversions",
      Icon: FileText,
    },
    {
      label: "Top format",
      value: stats.topFormat ? (FORMAT_LABEL[stats.topFormat] ?? stats.topFormat.toUpperCase()) : "—",
      sub: stats.topFormat ? `${stats.topCount} of ${logs.length} conversions` : "No formats yet",
      Icon: Layers,
    },
    {
      label: "Transactions",
      value: stats.totalTxns.toLocaleString("en-IN"),
      sub: "Auto-extracted",
      Icon: Clock,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Export action row */}
      <div className="flex justify-end -mb-1">
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E3EDE0] text-[13px] font-bold text-brand-text hover:border-[#2CA01C] transition-colors"
        >
          <Download size={14} className="text-[#007A33]" /> Export list
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {chips.map(chip => (
          <button
            key={chip.id}
            onClick={() => { setFilter(chip.id); setPage(0); }}
            className={`px-4 py-2 rounded-full text-[13px] font-bold border transition-colors ${
              filter === chip.id
                ? "bg-[#0B1F16] text-white border-transparent"
                : "bg-white text-brand-muted border-[#E3EDE0] hover:text-brand-text"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded-[24px] border border-[#E3EDE0] shadow-[0_2px_10px_rgba(11,31,22,0.04)] p-5 flex items-start gap-3.5">
            <div className="w-[42px] h-[42px] rounded-[13px] flex items-center justify-center bg-[#E3F2DF] shrink-0">
              <card.Icon size={20} className="text-[#007A33]" />
            </div>
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold text-brand-muted">{card.label}</p>
              <p className="text-[25px] lg:text-[27px] font-display font-bold text-brand-text tracking-tight leading-tight">{card.value}</p>
              <p className="text-xs text-brand-muted mt-0.5">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] border border-[#E3EDE0] shadow-[0_2px_10px_rgba(11,31,22,0.04)] overflow-hidden">
        {pageLogs.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-brand-muted">No conversions match this filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[820px]">
              <div className="grid grid-cols-12 px-6 py-2.5 bg-[#EFF7ED] text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#007A33]">
                <div className="col-span-4">File</div>
                <div className="col-span-2">Bank</div>
                <div className="col-span-2">Formats</div>
                <div className="col-span-1 text-center">Pages</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-1 text-right">Status</div>
              </div>
              <div className="divide-y divide-[#EFF4EC]">
                {pageLogs.map(log => (
                  <div key={log.id} className="grid grid-cols-12 items-center gap-2 px-6 py-3 hover:bg-[#F7FAF5] transition-colors">
                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#EFF7ED] flex items-center justify-center shrink-0">
                        <FileText size={14} className="text-[#007A33]" />
                      </div>
                      <p className="text-sm font-semibold text-brand-text truncate">{log.fileName}</p>
                    </div>
                    <div className="col-span-2 min-w-0">
                      <span className="text-[13px] text-brand-muted truncate block">{log.bankName ?? "—"}</span>
                    </div>
                    <div className="col-span-2 flex gap-1 flex-wrap">
                      {log.exportFormats.slice(0, 3).map(f => (
                        <span key={f} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F7FAF5] border border-[#E3EDE0] text-brand-muted">
                          {FORMAT_LABEL[f] ?? f.toUpperCase()}
                        </span>
                      ))}
                    </div>
                    <div className="col-span-1 text-center">
                      <span className="text-sm font-semibold text-brand-text">{log.pageCount}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[13px] text-brand-muted">
                        {new Date(log.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <div className="col-span-1 text-right">
                      <span className="inline-flex items-center gap-1 text-[11.5px] font-bold px-2.5 py-1 rounded-full bg-[#E3F2DF] text-[#007A33]">
                        Done ✓
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#EFF4EC]">
          <p className="text-[13px] text-brand-muted">
            Showing {filtered.length === 0 ? 0 : safePage * PAGE_SIZE + 1}–{Math.min(filtered.length, (safePage + 1) * PAGE_SIZE)} of {filtered.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="px-4 py-1.5 rounded-full border border-[#E3EDE0] bg-white text-[13px] font-bold text-brand-text disabled:opacity-40 hover:border-[#2CA01C] transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage(p => Math.min(pageCountTotal - 1, p + 1))}
              disabled={safePage >= pageCountTotal - 1}
              className="px-4 py-1.5 rounded-full border border-[#E3EDE0] bg-white text-[13px] font-bold text-brand-text disabled:opacity-40 hover:border-[#2CA01C] transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
