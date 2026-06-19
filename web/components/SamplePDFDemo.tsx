"use client";

import { useState } from "react";
import { Zap, Download, CheckCircle2, Loader2, X, FileSpreadsheet } from "lucide-react";

type DemoState = "idle" | "loading" | "done" | "error";

interface Transaction {
  date: string;
  description: string;
  amount: number;
  balance: number;
  type: string;
}

interface DemoResult {
  transaction_count: number;
  bank_name: string;
  processing_ms: number;
  transactions: Transaction[];
  export_urls: { csv?: string; xlsx?: string };
}

export function SamplePDFDemo() {
  const [state, setState] = useState<DemoState>("idle");
  const [result, setResult] = useState<DemoResult | null>(null);

  async function runDemo() {
    setState("loading");
    try {
      const res = await fetch("/api/process-statement?demo=true", { method: "POST" });
      if (!res.ok) throw new Error("Demo failed");
      const data = await res.json();
      setResult(data);
      setState("done");
    } catch {
      setState("error");
    }
  }

  function reset() {
    setState("idle");
    setResult(null);
  }

  if (state === "idle") {
    return (
      <button
        onClick={runDemo}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-zinc-700 dark:text-gray-200 border border-zinc-200 dark:border-white/10 hover:border-zinc-900/40 dark:border-zinc-800 dark:hover:border-brand-400/40 hover:text-zinc-900 dark:text-zinc-100 dark:hover:text-brand-400 bg-white dark:bg-surface transition-colors"
      >
        <Zap size={15} className="text-amber-500" />
        Try with sample PDF
      </button>
    );
  }

  if (state === "loading") {
    return (
      <button disabled className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-zinc-400 dark:text-gray-500 border border-zinc-200 dark:border-white/10 bg-white dark:bg-surface cursor-wait">
        <Loader2 size={15} className="animate-spin" />
        Converting SBI sample…
      </button>
    );
  }

  if (state === "error") {
    return (
      <button onClick={reset} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-rose-600 border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors">
        <X size={15} />
        Demo failed — try again
      </button>
    );
  }

  // done
  return (
    <div className="w-full max-w-[420px] bg-white dark:bg-surface border border-zinc-200 dark:border-white/10 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-800">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 size={15} className="text-emerald-500" />
          <span className="text-sm font-semibold">Converted in {result?.processing_ms}ms</span>
        </div>
        <button onClick={reset} className="text-zinc-400 dark:text-gray-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-gray-300 transition-colors">
          <X size={14} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-white/10 border-b border-zinc-100 dark:border-white/10">
        <div className="px-4 py-3 text-center">
          <p className="text-lg font-bold text-zinc-900 dark:text-white">{result?.transaction_count}</p>
          <p className="text-[10px] text-zinc-400 dark:text-gray-500 uppercase tracking-wide">Transactions</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-lg font-bold text-zinc-900 dark:text-white">5</p>
          <p className="text-[10px] text-zinc-400 dark:text-gray-500 uppercase tracking-wide">Pages</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-lg font-bold text-zinc-900 dark:text-white text-[13px] leading-tight mt-0.5">{result?.bank_name?.replace("State Bank of India", "SBI")}</p>
          <p className="text-[10px] text-zinc-400 dark:text-gray-500 uppercase tracking-wide">Bank</p>
        </div>
      </div>

      {/* Preview table */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-[10px] font-semibold text-zinc-400 dark:text-gray-500 uppercase tracking-wide mb-2">Preview (first 3 rows)</p>
        <div className="overflow-x-auto rounded-lg border border-zinc-100 dark:border-white/10 text-xs">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50 dark:bg-surface">
                <th className="px-2.5 py-2 text-left text-zinc-500 dark:text-gray-400 font-semibold">Date</th>
                <th className="px-2.5 py-2 text-left text-zinc-500 dark:text-gray-400 font-semibold">Description</th>
                <th className="px-2.5 py-2 text-right text-zinc-500 dark:text-gray-400 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {result?.transactions.slice(0, 3).map((tx, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-surface" : "bg-zinc-50 dark:bg-zinc-900/50 dark:bg-white dark:bg-zinc-950/5"}>
                  <td className="px-2.5 py-2 text-zinc-600 dark:text-gray-300 whitespace-nowrap">{tx.date}</td>
                  <td className="px-2.5 py-2 text-zinc-600 dark:text-gray-300 truncate max-w-[120px]">{tx.description}</td>
                  <td className={`px-2.5 py-2 text-right font-medium tabular-nums ${tx.type === "credit" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}>
                    {tx.type === "credit" ? "+" : "−"}₹{Math.abs(tx.amount).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Download buttons */}
      <div className="flex gap-2 px-4 py-3">
        {result?.export_urls.xlsx && (
          <a
            href={result.export_urls.xlsx}
            download="SBI_Sample_Converted.xlsx"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-navy dark:text-brand-400 bg-zinc-900 dark:bg-zinc-950/[0.08] dark:bg-brand-400/10 hover:bg-zinc-900 dark:bg-zinc-950/[0.15] dark:hover:bg-brand-400/20 rounded-lg transition-colors"
          >
            <FileSpreadsheet size={13} />
            Download
          </a>
        )}
        {result?.export_urls.csv && (
          <a
            href={result.export_urls.csv}
            download="SBI_Sample_Converted.csv"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-zinc-600 dark:text-gray-300 border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-white/20 rounded-lg transition-colors"
          >
            <Download size={13} />
            Download
          </a>
        )}
      </div>
      <p className="px-4 pb-3 text-[10px] text-zinc-400 dark:text-gray-500 text-center">
        Demo data — <a href="/signup" className="underline underline-offset-1 hover:text-zinc-900 dark:text-zinc-100 dark:hover:text-brand-400 transition-colors">sign up free</a> to convert your real statements
      </p>
    </div>
  );
}
