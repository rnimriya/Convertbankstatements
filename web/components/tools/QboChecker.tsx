"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import { Upload, FileCheck2, AlertTriangle, XCircle, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

interface Issue { level: "error" | "warning"; message: string }
interface Analysis {
  valid: boolean;
  fileKind: string;
  bankId: string | null;
  accountMasked: string | null;
  accountType: string | null;
  currency: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  ledgerBalance: number | null;
  ledgerAsOf: string | null;
  transactionCount: number;
  creditsTotal: number;
  debitsTotal: number;
  netChange: number;
  issues: Issue[];
}

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function QboChecker() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<Analysis | null>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    setResult(null);
    setFileName(file.name);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/tools/qbo-check", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not check that file.");
      setResult(data.analysis as Analysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not check that file.");
    } finally {
      setBusy(false);
    }
  }

  const errors = result?.issues.filter((i) => i.level === "error") ?? [];
  const warnings = result?.issues.filter((i) => i.level === "warning") ?? [];

  return (
    <div>
      <div
        className="rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 px-6 py-10 text-center cursor-pointer hover:border-teal-400 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) void handleFile(f);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".qbo,.ofx,.qfx"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = "";
          }}
        />
        {busy ? (
          <Loader2 className="h-9 w-9 mx-auto text-teal-600 animate-spin" />
        ) : (
          <Upload className="h-9 w-9 mx-auto text-teal-600" />
        )}
        <p className="mt-3 font-semibold text-zinc-900 dark:text-white">
          {busy ? "Checking your file…" : fileName ?? "Drop a .qbo, .ofx or .qfx file here, or click to browse"}
        </p>
        <p className="mt-1 text-sm text-zinc-400">
          No account needed · The file is checked in memory and never stored
        </p>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-8">
          <div
            className={`rounded-2xl border px-5 py-4 flex items-start gap-3 ${
              errors.length
                ? "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
                : warnings.length
                  ? "border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800"
                  : "border-teal-200 bg-teal-50 dark:bg-teal-900/20 dark:border-teal-800"
            }`}
          >
            {errors.length ? (
              <XCircle className="h-6 w-6 text-red-500 shrink-0" />
            ) : warnings.length ? (
              <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />
            ) : (
              <CheckCircle2 className="h-6 w-6 text-teal-500 shrink-0" />
            )}
            <div>
              <p className="font-bold text-zinc-900 dark:text-white">
                {errors.length
                  ? "This file has problems QuickBooks will trip over"
                  : warnings.length
                    ? "The file imports, but check these warnings first"
                    : "This file looks clean and ready to import"}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                {result.fileKind}
                {result.accountMasked ? ` · Account ${result.accountMasked}` : ""}
                {result.accountType ? ` · ${result.accountType}` : ""}
                {result.currency ? ` · ${result.currency}` : ""}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Transactions", value: String(result.transactionCount) },
              { label: "Statement period", value: result.periodStart && result.periodEnd ? `${result.periodStart} → ${result.periodEnd}` : "Not declared" },
              { label: "Net change", value: usd(result.netChange) },
              { label: "Ledger (closing) balance", value: result.ledgerBalance != null ? usd(result.ledgerBalance) : "Missing" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{s.label}</p>
                <p className="mt-1.5 font-bold text-zinc-900 dark:text-white text-[15px] leading-snug">{s.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Money in {usd(result.creditsTotal)} · Money out {usd(result.debitsTotal)}
            {result.ledgerAsOf ? ` · Balance as of ${result.ledgerAsOf}` : ""}
          </p>

          {result.issues.length > 0 && (
            <ul className="mt-6 space-y-3">
              {result.issues.map((issue, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3">
                  {issue.level === "error" ? (
                    <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <span className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{issue.message}</span>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
            If QuickBooks shows an error when importing, the{" "}
            <Link href="/tools/qbo-import-errors" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">QBO import-error decoder</Link>{" "}
            explains what each message means and how to fix it.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6">
            <p className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-teal-500" /> Working from a PDF statement instead?
            </p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Convert Statement turns the PDF into a QBO file that passes these checks by
              construction — balances verified against the statement, closing balance embedded,
              and transaction IDs that can&apos;t collide next month.
            </p>
            <Link
              href="/quickbooks"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-white text-sm font-semibold hover:bg-teal-500 transition-colors"
            >
              Convert a statement for QuickBooks <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
