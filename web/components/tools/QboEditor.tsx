"use client";

import { useMemo, useRef, useState } from "react";
import { AlertTriangle, Download, Trash2, XCircle } from "lucide-react";
import { ToolUpload, usd, downloadTextFile, downloadFromApi } from "./tool-shared";
import { SampleDownloads } from "./SampleDownloads";

interface ParsedRow {
  date: string;
  type: string;
  name: string;
  amount: number;
  fitid: string | null;
}

interface EditRow extends ParsedRow {
  key: number;
  amountText: string;
}

interface FileMeta {
  accountId: string | null;
  ledgerBalance: number | null;
  ledgerAsOf: string | null;
  currency: string | null;
  periodStart: string | null;
  periodEnd: string | null;
}

interface Issue {
  level: "error" | "warning";
  message: string;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/** Same CSV shape and formula-injection guard as the QBO to CSV tool. */
function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

function rowsToCsv(rows: EditRow[]): string {
  const header = "Date,Type,Description,Amount,Transaction ID\n";
  const body = rows
    .map((r) => {
      const amt = parseFloat(r.amountText);
      return [
        csvCell(r.date),
        csvCell(r.type),
        csvCell(r.name),
        Number.isFinite(amt) ? amt.toFixed(2) : "",
        csvCell(r.fitid ?? ""),
      ].join(",");
    })
    .join("\n");
  return header + body;
}

export function QboEditor() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<EditRow[] | null>(null);
  const [meta, setMeta] = useState<FileMeta | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [replaceNote, setReplaceNote] = useState<string | null>(null);
  const [dlBusy, setDlBusy] = useState(false);
  const keyRef = useRef(0);

  async function handleFile(f: File) {
    setBusy(true);
    setError(null);
    setRows(null);
    setMeta(null);
    setIssues([]);
    setReplaceNote(null);
    setFileName(f.name);
    try {
      const fd = new FormData();
      fd.append("files", f);
      const res = await fetch("/api/tools/ofx-parse", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not read that file.");
      const parsed = data.files?.[0];
      if (!parsed) throw new Error("Could not read that file.");
      keyRef.current = 0;
      setRows(
        (parsed.transactions as ParsedRow[]).map((t) => ({
          ...t,
          key: keyRef.current++,
          amountText: Number.isFinite(t.amount) ? t.amount.toFixed(2) : "",
        }))
      );
      setMeta({
        accountId: parsed.summary.accountId ?? null,
        ledgerBalance: parsed.summary.ledgerBalance ?? null,
        ledgerAsOf: parsed.summary.ledgerAsOf ?? null,
        currency: parsed.summary.currency ?? null,
        periodStart: parsed.summary.periodStart ?? null,
        periodEnd: parsed.summary.periodEnd ?? null,
      });
      setIssues((parsed.issues as Issue[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that file.");
    } finally {
      setBusy(false);
    }
  }

  const totals = useMemo(() => {
    let credits = 0;
    let debits = 0;
    let invalid = 0;
    for (const r of rows ?? []) {
      const amt = parseFloat(r.amountText);
      if (!Number.isFinite(amt) || r.amountText.trim() === "" || !isValidDate(r.date)) {
        invalid += 1;
        continue;
      }
      if (amt > 0) credits += amt;
      else if (amt < 0) debits += amt;
    }
    return {
      credits: Math.round(credits * 100) / 100,
      debits: Math.round(debits * 100) / 100,
      net: Math.round((credits + debits) * 100) / 100,
      invalid,
    };
  }, [rows]);

  const matchRows = useMemo(() => {
    if (!rows || !findText) return 0;
    return rows.filter((r) => r.name.includes(findText)).length;
  }, [rows, findText]);

  function updateRow(key: number, patch: Partial<EditRow>) {
    setRows((prev) => (prev ? prev.map((r) => (r.key === key ? { ...r, ...patch } : r)) : prev));
  }

  function deleteRow(key: number) {
    setRows((prev) => (prev ? prev.filter((r) => r.key !== key) : prev));
  }

  function replaceAll() {
    if (!rows || !findText) return;
    let changed = 0;
    const next = rows.map((r) => {
      if (!r.name.includes(findText)) return r;
      changed += 1;
      return { ...r, name: r.name.split(findText).join(replaceText) };
    });
    setRows(next);
    setReplaceNote(
      changed > 0
        ? `Replaced in ${changed} transaction name${changed === 1 ? "" : "s"}.`
        : "No transaction names contain that text."
    );
  }

  const outBase = (fileName ?? "statement").replace(/\.(qbo|ofx|qfx)$/i, "");

  async function downloadQbo() {
    if (!rows) return;
    if (totals.invalid > 0) {
      setError(
        `${totals.invalid} row${totals.invalid === 1 ? " has" : "s have"} an invalid date or amount — fix the highlighted values before downloading the QBO.`
      );
      return;
    }
    setDlBusy(true);
    setError(null);
    try {
      await downloadFromApi(
        "/api/tools/ofx-build",
        {
          transactions: rows.map((r) => ({
            date: r.date,
            name: r.name,
            amount: Math.round(parseFloat(r.amountText) * 100) / 100,
            fitid: r.fitid,
          })),
          accountId: meta?.accountId ?? undefined,
          ledgerBalance: meta?.ledgerBalance ?? undefined,
          ledgerAsOf: meta?.ledgerAsOf ?? undefined,
          fileName: `${outBase}-edited.qbo`,
        },
        `${outBase}-edited.qbo`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setDlBusy(false);
    }
  }

  function downloadCsv() {
    if (!rows) return;
    downloadTextFile(`${outBase}-edited.csv`, rowsToCsv(rows), "text/csv");
  }

  const inputCls =
    "w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:border-pine-500 focus:outline-none";

  return (
    <div>
      <ToolUpload
        accept=".qbo,.ofx,.qfx"
        busy={busy}
        busyText="Reading your file…"
        title={fileName ?? "Drop a QBO, OFX or QFX file here"}
        meta={["QBO / OFX / QFX", "Max 10 MB"]}
        activeTitle="Release to edit"
        onFile={(f) => void handleFile(f)}
      />
      <div className="mt-4 text-center">
        <p className="text-xs text-zinc-500 mb-2">Try it without your own data first:</p>
        <SampleDownloads ids={["clean-qbo"]} />
      </div>

      {error && (
        <p className="mt-4 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {rows && meta && (
        <div className="mt-8">
          <p className="text-sm text-zinc-600 leading-relaxed">
            <strong className="text-zinc-900">{rows.length} transactions</strong>
            {meta.periodStart && meta.periodEnd ? (
              <> · {meta.periodStart} → {meta.periodEnd}</>
            ) : null}
            {" "}· Money in {usd(totals.credits)} · Money out {usd(totals.debits)} · Net {usd(totals.net)}
            {meta.ledgerBalance != null ? <> · Ledger balance {usd(meta.ledgerBalance)}</> : null}
          </p>
          {totals.invalid > 0 && (
            <p className="mt-2 flex items-start gap-2 text-sm text-amber-800">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                {totals.invalid} row{totals.invalid === 1 ? " has" : "s have"} an invalid date or
                amount and {totals.invalid === 1 ? "is" : "are"} left out of the totals. Fix them
                before downloading the QBO.
              </span>
            </p>
          )}

          {issues.length > 0 && (
            <ul className="mt-4 space-y-3">
              {issues.map((issue, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-2 rounded-[20px] border px-4 py-3 text-sm ${
                    issue.level === "error"
                      ? "border-red-200 bg-red-50 text-red-800"
                      : "border-amber-200 bg-amber-50 text-amber-800"
                  }`}
                >
                  {issue.level === "error" ? (
                    <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  )}
                  <span>{issue.message}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="font-bold text-zinc-900 text-sm">Find &amp; replace in transaction names</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Handy for cleaning up payee text — for example turning “AMZN MKTP US*2K…” into
              “Amazon”. Matching is exact and case-sensitive.
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
              <label className="block text-sm">
                <span className="text-xs text-zinc-500">Find</span>
                <input
                  type="text"
                  value={findText}
                  onChange={(e) => {
                    setFindText(e.target.value);
                    setReplaceNote(null);
                  }}
                  placeholder="Text to find"
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
                />
              </label>
              <label className="block text-sm">
                <span className="text-xs text-zinc-500">Replace with</span>
                <input
                  type="text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="Replacement text"
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
                />
              </label>
              <button
                onClick={replaceAll}
                disabled={!findText || matchRows === 0}
                className="inline-flex items-center justify-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pine-700 disabled:opacity-60"
              >
                Replace all
              </button>
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              {findText
                ? `${matchRows} transaction name${matchRows === 1 ? "" : "s"} contain that text.`
                : "Type the text to find and see how many names it appears in."}
              {replaceNote ? ` ${replaceNote}` : ""}
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-200 overflow-hidden">
            <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-200">
              <p className="font-bold text-zinc-900 text-sm">Transactions — edit the values, then download</p>
            </div>
            <div className="overflow-auto max-h-[560px]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="text-left text-xs text-zinc-500 border-b border-zinc-200">
                    <th className="px-4 py-2 font-semibold">Date</th>
                    <th className="px-3 py-2 font-semibold">Name</th>
                    <th className="px-3 py-2 font-semibold text-right">Amount</th>
                    <th className="px-3 py-2 font-semibold">Transaction ID (FITID)</th>
                    <th className="px-3 py-2 font-semibold text-right">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.key} className="border-b border-zinc-100 text-zinc-700">
                      <td className="px-4 py-1.5 w-[132px]">
                        <input
                          type="text"
                          value={r.date}
                          onChange={(e) => updateRow(r.key, { date: e.target.value })}
                          placeholder="yyyy-mm-dd"
                          aria-label="Transaction date"
                          className={`${inputCls} ${!isValidDate(r.date) ? "border-red-300 bg-red-50" : ""}`}
                        />
                      </td>
                      <td className="px-3 py-1.5 min-w-[200px]">
                        <input
                          type="text"
                          value={r.name}
                          onChange={(e) => updateRow(r.key, { name: e.target.value })}
                          aria-label="Transaction name"
                          className={inputCls}
                        />
                      </td>
                      <td className="px-3 py-1.5 w-[128px]">
                        <input
                          type="number"
                          step="0.01"
                          value={r.amountText}
                          onChange={(e) => updateRow(r.key, { amountText: e.target.value })}
                          aria-label="Transaction amount"
                          className={`${inputCls} text-right ${r.amountText.trim() === "" || !Number.isFinite(parseFloat(r.amountText)) ? "border-red-300 bg-red-50" : ""}`}
                        />
                      </td>
                      <td className="px-3 py-1.5 font-mono text-xs text-zinc-500 max-w-[180px] truncate">
                        {r.fitid ?? "—"}
                      </td>
                      <td className="px-3 py-1.5 text-right">
                        <button
                          onClick={() => deleteRow(r.key)}
                          aria-label="Remove this transaction"
                          className="inline-flex items-center justify-center rounded-md border border-zinc-300 p-1.5 text-zinc-500 hover:border-red-300 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length === 0 && (
              <p className="px-5 py-4 text-sm text-zinc-500">
                Every transaction has been removed. Upload the file again to start over.
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => void downloadQbo()}
              disabled={dlBusy || rows.length === 0}
              className="inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pine-700 disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> {dlBusy ? "Preparing…" : "Download QBO (free)"}
            </button>
            <button
              onClick={downloadCsv}
              disabled={rows.length === 0}
              className="inline-flex items-center gap-2 bg-white border border-zinc-300 text-zinc-900 font-semibold px-5 py-2.5 rounded-lg hover:border-pine-400 disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> Download CSV (free)
            </button>
          </div>
          <p className="mt-3 text-xs text-zinc-400">
            The download is a new QBO file built from the rows above — your original file is never
            changed, and nothing here touches QuickBooks itself. FITIDs are shown read-only on
            purpose: QuickBooks uses them to detect duplicates, so they are carried into the new
            file exactly as they were. The account number and closing balance from your file are
            carried over too.
          </p>
        </div>
      )}
    </div>
  );
}
