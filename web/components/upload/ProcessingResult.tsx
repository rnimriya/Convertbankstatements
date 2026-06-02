"use client";

import { CheckCircle2, Download, RefreshCw, FileSpreadsheet, Info, TrendingUp } from "lucide-react";
import type { ProcessResult, Transaction } from "@/types/billing";

interface Props {
  result: ProcessResult & { is_demo?: boolean };
  onReset: () => void;
}

const FORMAT_LABELS: Record<string, string> = {
  csv: "CSV",
  xlsx: "Excel (.xlsx)",
  ofx: "OFX (QuickBooks)",
  qfx: "QFX (Quicken)",
  sheets: "Google Sheets",
};

export function ProcessingResult({ result, onReset }: Props) {
  const handleDownload = (fmt: string, url: string) => {
    // Handle data: URLs (base64 CSV) or regular URLs
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.file_name.replace(".pdf", "")}_transactions.${fmt}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4">
      {/* Demo notice */}
      {result.is_demo && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <span>
            <strong>Demo data</strong> — the Python AI backend isn&apos;t connected, so transactions
            are sample data. Connect FastAPI to extract real transactions from your PDF.
          </span>
        </div>
      )}

      {/* Success card */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500" />
          <div className="min-w-0">
            <h3 className="font-bold text-slate-800">Processing complete!</h3>
            <p className="mt-0.5 truncate text-sm text-slate-500">{result.file_name}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <StatCard label="Pages" value={result.page_count} />
          <StatCard label="Transactions" value={result.transaction_count} />
          <StatCard label="Time" value={`${(result.processing_ms / 1000).toFixed(1)}s`} />
        </div>

        {result.bank_name && (
          <p className="mt-3 text-center text-xs text-slate-400">
            Detected: <span className="font-semibold text-slate-600">{result.bank_name}</span>
          </p>
        )}

        {/* Billing message */}
        <p className="mt-2 text-center text-xs text-emerald-600 font-medium">
          {result.billing.message}
        </p>

        {/* Downloads */}
        {Object.keys(result.export_urls).length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Downloads</p>
            {Object.entries(result.export_urls).map(([fmt, url]) => (
              <button
                key={fmt}
                onClick={() => handleDownload(fmt, url)}
                className="flex w-full items-center justify-between rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-emerald-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                  {FORMAT_LABELS[fmt] ?? fmt.toUpperCase()}
                </span>
                <Download className="h-4 w-4 text-slate-400" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Transaction preview */}
      {result.transactions.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <TrendingUp className="h-4 w-4 text-brand-600" />
              Transaction preview
            </div>
            <span className="text-xs text-slate-400">
              First {result.transactions.length} of {result.transaction_count}
            </span>
          </div>
          <div className="divide-y divide-slate-50">
            {result.transactions.slice(0, 8).map((txn: Transaction, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-slate-700">{txn.description}</p>
                  <p className="text-xs text-slate-400">{txn.date} {txn.category && `· ${txn.category}`}</p>
                </div>
                <span className={`shrink-0 text-xs font-bold tabular-nums ${txn.amount >= 0 ? "text-emerald-600" : "text-slate-700"}`}>
                  {txn.amount >= 0 ? "+" : ""}${Math.abs(txn.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Process another statement
      </button>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white p-3 text-center shadow-sm">
      <p className="text-xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}
