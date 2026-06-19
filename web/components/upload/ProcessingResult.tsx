"use client";

import { CheckCircle2, Download, RefreshCw, FileSpreadsheet, TrendingUp, ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import type { ProcessResult, Transaction } from "@/types/billing";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";

interface Props {
  result: ProcessResult & { is_demo?: boolean };
  onReset: () => void;
  hasSheetsAccess?: boolean;
}

const FORMAT_LABELS: Record<string, string> = {
  csv: "Download CSV",
  xlsx: "Download Excel (.xlsx)",
  ofx: "Download OFX (QuickBooks / Tally)",
  qfx: "Download QFX (Quicken)",
  sheets: "Download Google Sheets (CSV)",
};

const FORMAT_EXTENSIONS: Record<string, string> = {
  csv: "csv",
  xlsx: "xlsx",
  ofx: "ofx",
  qfx: "qfx",
  sheets: "csv",
};

export function ProcessingResult({ result, onReset, hasSheetsAccess }: Props) {
  const [sheetsExporting, setSheetsExporting] = useState(false);
  const [sheetsUrl, setSheetsUrl] = useState<string | null>(null);
  const [sheetsError, setSheetsError] = useState<string | null>(null);

  const exportToSheets = async () => {
    setSheetsExporting(true);
    setSheetsError(null);
    try {
      const res = await fetch("/api/google-sheets/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: result.file_name,
          transactions: result.transactions,
          bankName: result.bank_name,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Export failed.");
      setSheetsUrl(data.url);
    } catch (err: unknown) {
      setSheetsError(err instanceof Error ? err.message : "Export failed.");
    } finally { setSheetsExporting(false); }
  };

  const handleDownload = (fmt: string, url: string) => {
    const ext = FORMAT_EXTENSIONS[fmt] ?? fmt;
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.file_name.replace(".pdf", "")}_transactions.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4">
      {/* Demo notice */}
      {result.is_demo && (
        <Alert variant="info" title="Sample data">
          This is a demo using a sample SBI statement.{" "}
          <a href="/signup" className="font-semibold underline hover:no-underline">
            Sign up free
          </a>{" "}
          to convert your own bank statements.
        </Alert>
      )}

      {/* Success card */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-200">Processing complete!</h3>
              <Badge variant="success" size="sm" dot>Done</Badge>
            </div>
            <p className="mt-0.5 truncate text-sm text-zinc-500 dark:text-zinc-400">{result.file_name}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <StatCard label="Pages" value={result.page_count} />
          <StatCard label="Transactions" value={result.transaction_count} />
          <StatCard label="Time" value={`${(result.processing_ms / 1000).toFixed(1)}s`} />
        </div>

        {result.bank_name && (
          <p className="mt-3 text-center text-xs text-zinc-400 dark:text-zinc-500">
            Detected: <span className="font-semibold text-zinc-600 dark:text-zinc-300">{result.bank_name}</span>
          </p>
        )}

        {/* Billing message */}
        <p className="mt-2 text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          {result.billing.message}
        </p>

        {/* Downloads */}
        {Object.keys(result.export_urls).length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Downloads</p>
            {Object.entries(result.export_urls).map(([fmt, url]) => (
              <button
                key={fmt}
                onClick={() => handleDownload(fmt, url)}
                className="flex w-full items-center justify-between rounded-xl bg-zinc-900 hover:bg-zinc-800 active:scale-[0.99] transition-all px-4 py-3 text-sm font-semibold text-white"
              >
                <span className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-white/80" />
                  {FORMAT_LABELS[fmt] ?? fmt.toUpperCase()}
                </span>
                <Download className="h-4 w-4 text-white/80" />
              </button>
            ))}

            {/* Google Sheets export (Pro/Business) */}
            {hasSheetsAccess && (
              sheetsUrl ? (
                <a
                  href={sheetsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-between rounded-xl bg-green-600 hover:bg-green-700 px-4 py-3 text-sm font-semibold text-white transition-all"
                >
                  <span className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white/80"><path d="M6 2h8l6 6v14a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"/><path d="M14 2l6 6h-6V2z" opacity=".5"/></svg>
                    Open in Google Sheets
                  </span>
                  <ExternalLink className="h-4 w-4 text-white/80" />
                </a>
              ) : (
                <button
                  onClick={exportToSheets}
                  disabled={sheetsExporting}
                  className="flex w-full items-center justify-between rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 px-4 py-3 text-sm font-semibold text-green-700 dark:text-green-400 transition-all disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    {sheetsExporting
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M6 2h8l6 6v14a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"/><path d="M14 2l6 6h-6V2z" opacity=".4"/></svg>
                    }
                    {sheetsExporting ? "Exporting to Google Sheets…" : "Export to Google Sheets"}
                  </span>
                  <ExternalLink className="h-4 w-4 opacity-60" />
                </button>
              )
            )}
            {sheetsError && (
              <p className="text-xs text-red-600 dark:text-red-400 px-1">{sheetsError}</p>
            )}
          </div>
        )}
      </div>

      {/* Transaction preview */}
      {result.transactions.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 px-5 py-3 bg-zinc-50">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-200">
              <TrendingUp className="h-4 w-4 text-zinc-500 dark:text-violet-400" />
              Transaction preview
            </div>
            <Badge variant="default" size="sm">
              {result.transactions.length} of {result.transaction_count}
            </Badge>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-white/10 font-mono">
            {result.transactions.slice(0, 8).map((txn: Transaction, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-2.5 hover:bg-zinc-50 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-zinc-900 dark:text-zinc-200">{txn.description}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    {txn.date}{txn.category && ` · ${txn.category}`}
                  </p>
                </div>
                <span className={`shrink-0 text-xs font-bold tabular-nums ${txn.amount >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-zinc-300"}`}>
                  {txn.amount >= 0 ? "+" : ""}₹{Math.abs(txn.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        variant="secondary"
        fullWidth
        leftIcon={<RefreshCw className="h-4 w-4" />}
        onClick={onReset}
      >
        Process another statement
      </Button>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:bg-zinc-950 p-3 text-center">
      <p className="text-xl font-bold text-zinc-900 dark:text-zinc-200">{value}</p>
      <p className="text-xs text-zinc-500 dark:text-zinc-500">{label}</p>
    </div>
  );
}
