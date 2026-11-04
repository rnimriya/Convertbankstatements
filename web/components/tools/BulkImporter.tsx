"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Download, FileText, RotateCcw, X } from "lucide-react";
import { ToolUpload, usd } from "./tool-shared";
import type { CsvMapping, GenericRow } from "@/lib/tools/csv-to-qbo";
import type { IifAccounts } from "@/lib/tools/csv-to-iif";

const STORAGE_KEY = "cs-bulk-import-mapping";
const MAX_ROWS = 10_000;

interface PreviewFile {
  name: string;
  headers: string[];
  mapping: CsvMapping;
  rowCount: number;
  sampleRows: GenericRow[];
  parseError?: string;
}

type EditableField = "date" | "payee" | "amount" | "debit" | "credit" | "memo";

const FIELDS: { key: EditableField; label: string; required?: boolean }[] = [
  { key: "date", label: "Date column", required: true },
  { key: "payee", label: "Description / payee column", required: true },
  { key: "amount", label: "Amount column (signed)" },
  { key: "debit", label: "Debit (money out) column" },
  { key: "credit", label: "Credit (money in) column" },
  { key: "memo", label: "Memo column (optional)" },
];

const DEFAULT_ACCOUNTS: IifAccounts = {
  bankAccount: "Business Checking",
  incomeAccount: "Uncategorized Income",
  expenseAccount: "Uncategorized Expense",
};

interface BuiltFile {
  url: string;
  fileName: string;
  rows: number;
  fileCount: number;
  format: "qbo" | "iif";
}

/** Validate a saved mapping against a header count; out-of-range columns become "not used". */
function sanitizeMapping(raw: unknown, headerCount: number): CsvMapping | null {
  if (!raw || typeof raw !== "object") return null;
  const m = raw as Record<string, unknown>;
  const num = (v: unknown) => {
    if (typeof v !== "number" || !Number.isInteger(v)) return -1;
    return v >= 0 && v < headerCount ? v : -1;
  };
  return {
    date: num(m.date),
    payee: num(m.payee),
    amount: num(m.amount),
    debit: num(m.debit),
    credit: num(m.credit),
    memo: num(m.memo),
    balance: num(m.balance),
  };
}

export function BulkImporter() {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<PreviewFile[] | null>(null);
  const [mapping, setMapping] = useState<CsvMapping | null>(null);
  const [mappingFromSaved, setMappingFromSaved] = useState(false);
  const [format, setFormat] = useState<"qbo" | "iif">("qbo");
  const [accounts, setAccounts] = useState<IifAccounts>(DEFAULT_ACCOUNTS);
  const [previewBusy, setPreviewBusy] = useState(false);
  const [buildBusy, setBuildBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [built, setBuilt] = useState<BuiltFile | null>(null);

  // The mapping is saved automatically in this browser only — it is offered
  // again on the next visit. Nothing about the files leaves the tab except
  // the build request itself, and nothing is stored on the server.
  useEffect(() => {
    if (!mapping) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mapping));
    } catch {
      /* storage unavailable — the tool still works */
    }
  }, [mapping]);

  function clearDownstream() {
    setPreview(null);
    setMapping(null);
    setMappingFromSaved(false);
    setBuilt(null);
    setError(null);
  }

  function addFile(f: File) {
    setFiles((prev) => [...prev, f]);
    clearDownstream();
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    clearDownstream();
  }

  function startOver() {
    setFiles([]);
    setFormat("qbo");
    setAccounts(DEFAULT_ACCOUNTS);
    clearDownstream();
  }

  async function runPreview() {
    if (files.length === 0) return;
    setPreviewBusy(true);
    setError(null);
    setBuilt(null);
    try {
      const fd = new FormData();
      fd.append("step", "preview");
      files.forEach((f) => fd.append("files", f));
      const res = await fetch("/api/tools/bulk-import", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not read those files.");
      const list = data.files as PreviewFile[];
      setPreview(list);

      // Prefill the editor: a mapping saved in this browser on a previous
      // visit wins over the first file's auto-detected mapping.
      let initial: CsvMapping = list[0].mapping;
      let fromSaved = false;
      try {
        const savedRaw = localStorage.getItem(STORAGE_KEY);
        if (savedRaw) {
          const saved = sanitizeMapping(JSON.parse(savedRaw), list[0].headers.length);
          if (saved) {
            initial = { ...saved, balance: list[0].mapping.balance };
            fromSaved = true;
          }
        }
      } catch {
        /* no saved mapping — auto-detected it is */
      }
      setMapping(initial);
      setMappingFromSaved(fromSaved);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read those files.");
    } finally {
      setPreviewBusy(false);
    }
  }

  function setField(key: EditableField, value: string) {
    if (!mapping) return;
    setMappingFromSaved(false);
    setMapping({ ...mapping, [key]: value === "" ? -1 : Number(value) });
  }

  async function runBuild() {
    if (!mapping || files.length === 0) return;
    setBuildBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("step", "build");
      files.forEach((f) => fd.append("files", f));
      fd.append("mapping", JSON.stringify(mapping));
      fd.append("format", format);
      if (format === "iif") fd.append("accounts", JSON.stringify(accounts));
      const res = await fetch("/api/tools/bulk-import", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Could not build the import file.");
      }
      const blob = await res.blob();
      const rows = Number(res.headers.get("X-Rows") ?? 0);
      const fileName = format === "iif" ? "bulk-import.iif" : "bulk-import.qbo";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setBuilt((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { url, fileName, rows, fileCount: files.length, format };
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not build the import file.");
    } finally {
      setBuildBusy(false);
    }
  }

  const first = preview?.[0] ?? null;
  const totalRows = preview ? preview.reduce((sum, f) => sum + f.rowCount, 0) : 0;

  return (
    <div>
      <ToolUpload
        accept=".csv"
        busy={false}
        busyText="Reading your files…"
        title="Drop CSV files here"
        meta={["Bank CSV exports", "Add several files", "Max 10 MB each"]}
        activeTitle="Release to add the file"
        onFile={addFile}
      />

      {files.length > 0 && (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="font-bold text-zinc-900 text-sm">
              {files.length} {files.length === 1 ? "file" : "files"} added
            </h3>
            <span className="text-xs text-zinc-500">
              Add more above, or continue — the rows from every file are merged into one import file.
            </span>
          </div>
          <ul className="mt-3 divide-y divide-zinc-100">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex items-center gap-2 py-2 text-sm">
                <FileText className="h-4 w-4 shrink-0 text-zinc-400" />
                <span className="truncate text-zinc-700">{f.name}</span>
                <span className="ml-auto shrink-0 text-xs text-zinc-400">
                  {Math.max(1, Math.round(f.size / 1024))} KB
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  aria-label={`Remove ${f.name}`}
                  className="shrink-0 rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          {!preview && (
            <button
              type="button"
              onClick={() => void runPreview()}
              disabled={previewBusy}
              className="mt-4 inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pine-700 disabled:opacity-60"
            >
              {previewBusy ? "Reading your files…" : "Continue to column mapping"}
            </button>
          )}
          <p className="mt-3 text-xs text-zinc-400">
            Files are processed in memory to build your import file and are never stored.
          </p>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {preview && (
        <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
          <h3 className="font-bold text-zinc-900 text-sm">What was read</h3>
          <ul className="mt-2 space-y-1.5 text-sm">
            {preview.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-medium text-zinc-700">{f.name}</span>
                {f.parseError ? (
                  <span className="text-xs text-amber-700">
                    Could not be read with the auto-detected columns — fix the mapping below and the build will use it.
                  </span>
                ) : (
                  <span className="text-xs text-zinc-500">
                    {f.rowCount.toLocaleString("en-US")} transactions
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-zinc-500">
            Total so far: {totalRows.toLocaleString("en-US")} transactions (one import file can hold up to{" "}
            {MAX_ROWS.toLocaleString("en-US")}).
          </p>
        </div>
      )}

      {preview && mapping && first && (
        <div className="mt-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="font-bold text-zinc-900 text-sm">Column mapping</h3>
            <p className="text-xs text-zinc-500 mt-1">
              One mapping is applied to every file, so the files need the same column layout — the usual
              case when they come from the same bank. Columns are matched against the first file,{" "}
              <span className="font-medium text-zinc-700">{first.name}</span>.
            </p>
            {mappingFromSaved && (
              <div className="mt-3 rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  Your saved mapping from a previous visit was applied. Check each column against this
                  file&apos;s headers before building.{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMapping(first.mapping);
                      setMappingFromSaved(false);
                    }}
                    className="font-semibold underline underline-offset-2"
                  >
                    Reset to auto-detected
                  </button>
                </span>
              </div>
            )}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FIELDS.map((f) => (
                <label key={f.key} className="block text-sm">
                  <span className="text-xs text-zinc-500">
                    {f.label}
                    {f.required ? " *" : ""}
                  </span>
                  <select
                    value={mapping[f.key] >= 0 ? String(mapping[f.key]) : ""}
                    onChange={(e) => setField(f.key, e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
                  >
                    <option value="">Not used</option>
                    {first.headers.map((h, i) => (
                      <option key={i} value={i}>
                        {h}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              Map either one signed amount column, or a debit/credit pair. Debit rows become negative
              amounts; credit rows stay positive. The mapping is saved in this browser automatically and
              offered again next time.
            </p>
          </div>

          {first.parseError ? (
            <div className="mt-3 rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                No preview rows for the first file yet: {first.parseError} Adjust the mapping above — the
                build step reads the files again with your mapping.
              </span>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-zinc-200 overflow-hidden">
              <div className="px-5 py-3 bg-white border-b border-zinc-200">
                <p className="font-bold text-zinc-900 text-sm">
                  Preview — first rows of {first.name}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Read with the auto-detected columns. Your mapping changes are applied when the import
                  file is built.
                </p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-zinc-500 border-b border-zinc-200">
                    <th className="px-5 py-2 font-semibold">Date</th>
                    <th className="px-3 py-2 font-semibold">Payee</th>
                    <th className="px-3 py-2 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {first.sampleRows.map((r, i) => (
                    <tr key={i} className="border-b border-zinc-100 text-zinc-700">
                      <td className="px-5 py-1.5">{r.date}</td>
                      <td className="px-3 py-1.5">
                        {r.payee}
                        {r.memo ? <span className="text-zinc-400"> · {r.memo}</span> : null}
                      </td>
                      <td className="px-3 py-1.5 text-right font-mono">{usd(r.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="font-bold text-zinc-900 text-sm">Output file</h3>
            <div className="mt-3 space-y-3">
              <label className="flex items-start gap-3 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="bulk-import-format"
                  checked={format === "qbo"}
                  onChange={() => setFormat("qbo")}
                  className="mt-1 accent-[#2CA01C]"
                />
                <span>
                  <span className="font-semibold text-zinc-900">QBO — for QuickBooks Online</span>
                  <span className="block text-xs text-zinc-500 mt-0.5">
                    A Web Connect file. In QuickBooks Online: Banking → Link account dropdown → Upload a
                    file.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="bulk-import-format"
                  checked={format === "iif"}
                  onChange={() => setFormat("iif")}
                  className="mt-1 accent-[#2CA01C]"
                />
                <span>
                  <span className="font-semibold text-zinc-900">IIF — for QuickBooks Desktop</span>
                  <span className="block text-xs text-zinc-500 mt-0.5">
                    An IIF bank-transaction file. In QuickBooks Desktop: File → Utilities → Import → IIF
                    Files.
                  </span>
                </span>
              </label>
            </div>

            {format === "iif" && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="block text-sm">
                  <span className="text-xs text-zinc-500">Bank account (must match QuickBooks)</span>
                  <input
                    type="text"
                    value={accounts.bankAccount}
                    onChange={(e) => setAccounts({ ...accounts, bankAccount: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-xs text-zinc-500">Income account (for deposits)</span>
                  <input
                    type="text"
                    value={accounts.incomeAccount}
                    onChange={(e) => setAccounts({ ...accounts, incomeAccount: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-xs text-zinc-500">Expense account (for payments)</span>
                  <input
                    type="text"
                    value={accounts.expenseAccount}
                    onChange={(e) => setAccounts({ ...accounts, expenseAccount: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
                  />
                </label>
                <p className="text-xs text-zinc-400 sm:col-span-3">
                  Use the exact account names from your QuickBooks Desktop chart of accounts — IIF imports
                  match accounts by name. Deposits are offset to the income account and payments to the
                  expense account; you can re-categorize individual transactions after importing.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => void runBuild()}
              disabled={buildBusy}
              className="mt-5 inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pine-700 disabled:opacity-60"
            >
              <Download className="h-4 w-4" />
              {buildBusy ? "Building your import file…" : "Build import file"}
            </button>
            <p className="mt-3 text-xs text-zinc-400">
              This tool prepares a standard import file — it does not connect to QuickBooks or post
              anything into your company. You import the file yourself, so you stay in control of what
              enters your books.
            </p>
          </div>
        </div>
      )}

      {built && (
        <div className="mt-4 rounded-2xl border border-pine-200 bg-pine-50 px-5 py-4">
          <p className="font-semibold text-zinc-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-pine-600" /> Your import file is ready
          </p>
          <p className="mt-1 text-sm text-zinc-600">
            {built.rows.toLocaleString("en-US")} transactions merged from {built.fileCount}{" "}
            {built.fileCount === 1 ? "file" : "files"} into one{" "}
            {built.format === "iif" ? ".IIF file for QuickBooks Desktop" : ".QBO file for QuickBooks Online"}.
            The download should have started automatically.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href={built.url}
              download={built.fileName}
              className="inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-pine-700 transition-colors"
            >
              <Download className="h-4 w-4" /> Download again
            </a>
            <button
              type="button"
              onClick={startOver}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-2 font-semibold text-zinc-900 transition-colors hover:border-pine-400"
            >
              <RotateCcw className="h-4 w-4" /> Start over
            </button>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            {built.format === "iif"
              ? "Import it in QuickBooks Desktop: File → Utilities → Import → IIF Files. Make a backup of your company file first — IIF imports cannot be undone in bulk."
              : "Import it in QuickBooks Online: Banking → Upload a file, then review the transactions before adding them to your books."}
          </p>
        </div>
      )}
    </div>
  );
}
