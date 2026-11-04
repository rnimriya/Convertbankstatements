"use client";

import { useState } from "react";
import { CheckCircle2, Download } from "lucide-react";
import { ToolUpload } from "./tool-shared";

export function IifToExcel() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"csv" | "xlsx">("xlsx");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ rows: number; outName: string } | null>(null);

  function handleFile(f: File) {
    setFile(f);
    setResult(null);
    setError(null);
  }

  async function convert() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("format", format);
      const res = await fetch("/api/tools/iif-convert", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not convert that file.");
      }
      const rowsHeader = res.headers.get("X-Rows");
      const blob = await res.blob();
      const outName = `${file.name.replace(/\.iif$/i, "") || "iif-export"}.${format}`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = outName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setResult({ rows: rowsHeader ? Number(rowsHeader) : 0, outName });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not convert that file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <ToolUpload
        accept=".iif"
        busy={busy}
        busyText="Converting your IIF file…"
        title={file ? file.name : "Drop an IIF file here"}
        meta={["IIF (QuickBooks Desktop)", "Max 10 MB"]}
        activeTitle="Release to convert"
        onFile={handleFile}
      />

      {file && (
        <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-5">
          <h3 className="font-bold text-zinc-900 text-sm">Output format</h3>
          <div className="mt-3 flex flex-wrap gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 has-[:checked]:border-pine-500 has-[:checked]:bg-pine-50">
              <input
                type="radio"
                name="iif-format"
                value="xlsx"
                checked={format === "xlsx"}
                onChange={() => setFormat("xlsx")}
                className="accent-pine-600"
              />
              Excel (.xlsx)
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 has-[:checked]:border-pine-500 has-[:checked]:bg-pine-50">
              <input
                type="radio"
                name="iif-format"
                value="csv"
                checked={format === "csv"}
                onChange={() => setFormat("csv")}
                className="accent-pine-600"
              />
              CSV (.csv)
            </label>
          </div>
          <div className="mt-4">
            <button
              onClick={() => void convert()}
              disabled={busy}
              className="inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pine-700 disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> {busy ? "Converting…" : "Convert & download (free)"}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-pine-200 bg-pine-50 px-5 py-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-pine-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-zinc-900">
              Converted {result.rows} rows — {result.outName} downloaded
            </p>
            <p className="mt-1 text-zinc-600">
              Every transaction line (TRNS) and split line (SPL, marked “Split line”) from the IIF
              file is in the spreadsheet. Upload another file or switch the format above to convert
              again.
            </p>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-zinc-400 text-center">
        Reads QuickBooks Desktop IIF exports — IIF is the Desktop import/export format. QuickBooks
        Online does not use IIF; if you have a .qbo file instead, the QBO to CSV converter is the
        right tool. Fully free, no account, files never stored.
      </p>
    </div>
  );
}
