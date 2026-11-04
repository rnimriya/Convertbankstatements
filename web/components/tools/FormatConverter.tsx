"use client";

import { useState } from "react";
import { CheckCircle2, Download, FileSpreadsheet, X } from "lucide-react";
import { ToolUpload } from "./tool-shared";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function filenameFromDisposition(header: string | null, fallback: string): string {
  if (!header) return fallback;
  const star = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (star) {
    const raw = star[1].trim().replace(/^"|"$/g, "");
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }
  const quoted = /filename="([^"]+)"/i.exec(header);
  if (quoted) return quoted[1];
  const plain = /filename=([^;]+)/i.exec(header);
  if (plain) return plain[1].trim().replace(/^"|"$/g, "");
  return fallback;
}

interface ConvertResult {
  filename: string;
  rows: number | null;
}

export function FormatConverter({
  tool,
  fromLabel,
  toLabel,
  accept,
  outputExt,
}: {
  tool: string;
  fromLabel: string;
  toLabel: string;
  accept: string;
  outputExt: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConvertResult | null>(null);

  function addFile(f: File) {
    setError(null);
    setResult(null);
    setFile(f);
  }

  function removeFile() {
    setFile(null);
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
      fd.append("tool", tool);
      const res = await fetch("/api/tools/convert", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ?? "Could not convert that file.",
        );
      }
      const base = file.name.replace(/\.[^.]+$/, "") || "converted";
      const fallback = `${base}.${outputExt}`;
      const filename = filenameFromDisposition(
        res.headers.get("Content-Disposition"),
        fallback,
      );
      const rawRows = res.headers.get("X-Rows");
      const parsedRows = rawRows ? Number.parseInt(rawRows, 10) : NaN;
      const rows = Number.isNaN(parsedRows) ? null : parsedRows;
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      setResult({ filename, rows });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not convert that file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <ToolUpload
        accept={accept}
        busy={busy}
        busyText={`Converting your ${fromLabel} file…`}
        title={`Drop your ${fromLabel} file here`}
        meta={[`${fromLabel} file`, "Max 10 MB", "Fully free"]}
        activeTitle="Release to add the file"
        onFile={addFile}
      />

      {error && (
        <p className="mt-4 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {file && (
        <div className="mt-8">
          <div className="rounded-2xl border border-zinc-200 overflow-hidden">
            <ul className="divide-y divide-zinc-100">
              <li className="flex items-center gap-3 px-5 py-2.5 text-sm">
                <FileSpreadsheet className="h-4 w-4 shrink-0 text-pine-600" />
                <span className="font-medium text-zinc-900 truncate">{file.name}</span>
                <span className="text-xs text-zinc-400 shrink-0">{formatSize(file.size)}</span>
                <button
                  type="button"
                  onClick={removeFile}
                  disabled={busy}
                  aria-label={`Remove ${file.name}`}
                  className="ml-auto shrink-0 rounded-full p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            </ul>
          </div>

          <div className="mt-5">
            <button
              onClick={() => void convert()}
              disabled={busy}
              className="inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pine-700 disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> {busy ? "Converting…" : `Convert to ${toLabel}`}
            </button>
          </div>
          <p className="mt-3 text-xs text-zinc-400">
            Fully free, no account; files are processed in memory and never stored.
          </p>
        </div>
      )}

      {result && (
        <div className="mt-8 rounded-2xl border border-pine-200 bg-pine-50 px-5 py-4">
          <p className="font-semibold text-zinc-900 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-pine-600" />
            {result.rows != null
              ? `Conversion complete — ${result.rows} transaction${result.rows === 1 ? "" : "s"}`
              : "Conversion complete"}
          </p>
          <p className="mt-3 text-xs text-zinc-500">Downloaded as {result.filename}</p>
        </div>
      )}
    </div>
  );
}
