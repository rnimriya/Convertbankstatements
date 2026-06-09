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
        className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-slate-700 border border-slate-200 hover:border-navy/40 hover:text-navy bg-white transition-colors"
      >
        <Zap size={15} className="text-amber-500" />
        Try with sample PDF
      </button>
    );
  }

  if (state === "loading") {
    return (
      <button disabled className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-slate-400 border border-slate-200 bg-white cursor-wait">
        <Loader2 size={15} className="animate-spin" />
        Converting SBI sample…
      </button>
    );
  }

  if (state === "error") {
    return (
      <button onClick={reset} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-rose-600 border border-rose-200 bg-rose-50 hover:bg-rose-100 transition-colors">
        <X size={15} />
        Demo failed — try again
      </button>
    );
  }

  // done
  return (
    <div className="w-full max-w-[420px] bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 border-b border-emerald-100">
        <div className="flex items-center gap-2 text-emerald-700">
          <CheckCircle2 size={15} className="text-emerald-500" />
          <span className="text-sm font-semibold">Converted in {result?.processing_ms}ms</span>
        </div>
        <button onClick={reset} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={14} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
        <div className="px-4 py-3 text-center">
          <p className="text-lg font-bold text-slate-900">{result?.transaction_count}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Transactions</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-lg font-bold text-slate-900">5</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Pages</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-lg font-bold text-slate-900 text-[13px] leading-tight mt-0.5">{result?.bank_name?.replace("State Bank of India", "SBI")}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Bank</p>
        </div>
      </div>

      {/* Preview table */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Preview (first 3 rows)</p>
        <div className="overflow-x-auto rounded-lg border border-slate-100 text-xs">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-2.5 py-2 text-left text-slate-500 font-semibold">Date</th>
                <th className="px-2.5 py-2 text-left text-slate-500 font-semibold">Description</th>
                <th className="px-2.5 py-2 text-right text-slate-500 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {result?.transactions.slice(0, 3).map((tx, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                  <td className="px-2.5 py-2 text-slate-600 whitespace-nowrap">{tx.date}</td>
                  <td className="px-2.5 py-2 text-slate-600 truncate max-w-[120px]">{tx.description}</td>
                  <td className={`px-2.5 py-2 text-right font-medium tabular-nums ${tx.type === "credit" ? "text-emerald-600" : "text-rose-500"}`}>
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
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-navy bg-navy/8 hover:bg-navy/15 rounded-lg transition-colors"
          >
            <FileSpreadsheet size={13} />
            Download Excel
          </a>
        )}
        {result?.export_urls.csv && (
          <a
            href={result.export_urls.csv}
            download="SBI_Sample_Converted.csv"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-600 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors"
          >
            <Download size={13} />
            Download CSV
          </a>
        )}
      </div>
      <p className="px-4 pb-3 text-[10px] text-slate-400 text-center">
        Demo data — <a href="/signup" className="underline underline-offset-1 hover:text-navy transition-colors">sign up free</a> to convert your real statements
      </p>
    </div>
  );
}
