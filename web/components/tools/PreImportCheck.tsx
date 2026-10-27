"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, FileCheck2, XCircle } from "lucide-react";
import type { CleanupAnalysis } from "@/lib/tools/cleanup-analysis";

interface Props {
  /** The QBO download URL from the conversion result (a data: URL today). */
  qboUrl: string | undefined;
}

/**
 * "Check this QBO before importing" — decodes the exact QBO the user is
 * about to download, runs it through the existing cleanup checker on the
 * server, and shows the issues inline. No account required, nothing stored.
 */
export function PreImportCheck({ qboUrl }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<CleanupAnalysis | null>(null);

  async function runCheck() {
    if (!qboUrl) return;
    setBusy(true);
    setError(null);
    setAnalysis(null);
    try {
      let text = "";
      if (qboUrl.startsWith("data:")) {
        const base64 = qboUrl.split(",").slice(1).join(",");
        const bin = atob(base64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        text = new TextDecoder().decode(bytes);
      } else {
        const res = await fetch(qboUrl);
        if (!res.ok) throw new Error("Could not read the generated QBO.");
        text = await res.text();
      }
      const res = await fetch("/api/tools/preimport-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qbo: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Check failed.");
      setAnalysis(data.analysis as CleanupAnalysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Check failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!qboUrl) return null;

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3">
      {!analysis && !error && (
        <button
          onClick={() => void runCheck()}
          disabled={busy}
          className="flex w-full items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100 hover:text-teal-600 dark:hover:text-teal-400 disabled:opacity-60"
        >
          <FileCheck2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          {busy ? "Checking this QBO…" : "Check this QBO before importing"}
        </button>
      )}
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
      {analysis && (
        <div className="text-sm">
          <div className="flex items-start gap-2">
            {analysis.duplicateInstances > 0 || analysis.errorCount > 0 ? (
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                Pre-import check: health score {analysis.healthScore} · {analysis.transactionCount} transactions
                {analysis.duplicateInstances > 0 ? ` · ${analysis.duplicateInstances} duplicate instance(s)` : " · no duplicates"}
              </p>
              {analysis.issues.length === 0 && (
                <p className="text-zinc-600 dark:text-zinc-300 mt-0.5">
                  This file looks clean — unique transaction IDs, no structural issues. Safe to import.
                </p>
              )}
              {analysis.issues.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {analysis.issues.slice(0, 5).map((issue, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                      {issue.level === "error" ? (
                        <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <span>{issue.message}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-xs text-zinc-400">
                Full detail:{" "}
                <Link href="/tools/free-qbo-cleanup-checker" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">
                  QBO Duplicate Finder
                </Link>
                {" · "}
                <Link href="/tools/qbo-import-errors" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">
                  Import errors, explained
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
