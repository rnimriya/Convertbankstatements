/**
 * Stripe / PayPal payout → QuickBooks converter engine.
 *
 * Accounting model (industry standard, same as Synder/Acodei): every payout is
 * represented through a clearing account —
 *   Gross sales  → income into the clearing account
 *   Refunds      → contra-income against the clearing account
 *   Fees         → expense against the clearing account
 *   Net payout   → transfer from the clearing account to the real bank account
 * When the clearing nets to zero, the payout reconciles to the penny.
 *
 * Pure parsing — no network, no storage. The QBO body is generated with the
 * site's existing transactionsToQBO() so FITIDs stay collision-proof.
 */
import { transactionsToQBO } from "@/lib/mock-transactions";
import type { Transaction } from "@/types/billing";

export type Provider = "stripe" | "paypal";

export interface NormalizedRow {
  id: string;
  /** charge | refund | dispute | dispute_fee | fee | payout | adjustment | transfer */
  kind: string;
  amount: number; // signed, USD
  fee: number; // signed (negative), USD
  date: string; // yyyy-mm-dd
  payoutId: string | null;
  label: string;
}

export interface PayoutSummary {
  provider: Provider;
  payoutId: string | null;
  payoutDate: string;
  gross: number;
  refunds: number;
  disputes: number;
  disputeFees: number;
  fees: number;
  adjustments: number;
  net: number;
  /** Amount that actually hit the bank (from the payout/transfer row, when present). */
  bankAmount: number | null;
  /** bankAmount − net: 0 (or ~0) means the payout ties out. */
  tieOutDiff: number | null;
  tiedOut: boolean | null;
  rowCount: number;
  qboTransactions: Transaction[];
}

export interface PayoutResult {
  provider: Provider;
  detectedFormat: string;
  payouts: PayoutSummary[];
  warnings: string[];
  csv: string; // QBO-Online-ready CSV of the clearing entries
}

const r2 = (n: number) => Math.round(n * 100) / 100;

// ── CSV utils ────────────────────────────────────────────────────────────────

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else inQ = false;
      } else cur += c;
    } else if (c === '"') {
      inQ = true;
    } else if (c === ",") {
      out.push(cur); cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out;
}

function parseMoney(raw: string | undefined): number {
  if (!raw) return 0;
  let s = raw.trim();
  const neg = /^\(.*\)$/.test(s) || /^-/.test(s);
  s = s.replace(/[()$,£€\s]/g, "").replace(/,/g, "");
  const v = parseFloat(s);
  if (Number.isNaN(v)) return 0;
  return neg && v > 0 ? -v : v;
}

function parseDateFlex(raw: string | undefined): string {
  const s = (raw ?? "").trim();
  if (!s) return "";
  let m = s.match(/^(\d{4})[/\-.](\d{1,2})[/\-.](\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  m = s.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})/);
  if (m) {
    const y = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${y}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

function colIdx(headers: string[], ...names: string[]): number {
  for (const n of names) {
    const i = headers.indexOf(n);
    if (i >= 0) return i;
  }
  return -1;
}

// ── Stripe parsers ───────────────────────────────────────────────────────────

type StripeFormat = "balance-transactions" | "payouts" | "itemized-payout";

function detectStripeFormat(headers: string[]): StripeFormat | null {
  const h = headers.join(" ");
  if (h.includes("balance transaction id") || (h.includes("available_on") && h.includes("type") && h.includes("fee"))) {
    return "balance-transactions";
  }
  if (h.includes("payout id") || (h.includes("arrival_date") && h.includes("destination"))) {
    return "payouts";
  }
  if ((h.includes("charge id") || h.includes("payment id")) && (h.includes("gross") || h.includes("net"))) {
    return "itemized-payout";
  }
  // Fallback: recognizable Stripe columns at all
  if (h.includes("id") && (h.includes("amount") || h.includes("gross"))) {
    return headers.includes("type") ? "balance-transactions" : "itemized-payout";
  }
  return null;
}

function stripeRows(lines: string[][], headers: string[], format: StripeFormat, warnings: string[]): NormalizedRow[] {
  const rows: NormalizedRow[] = [];
  const lower = headers.map((h) => h.toLowerCase());

  if (format === "balance-transactions") {
    const idI = colIdx(lower, "id", "balance transaction id", "transaction id");
    const typeI = colIdx(lower, "type");
    const amtI = colIdx(lower, "amount", "gross");
    const feeI = colIdx(lower, "fee");
    const netI = colIdx(lower, "net");
    const createdI = colIdx(lower, "created", "created (utc)", "date");
    const availI = colIdx(lower, "available_on", "available on");
    const descI = colIdx(lower, "description");
    for (const cells of lines) {
      const type = (cells[typeI] ?? "").toLowerCase();
      const amount = parseMoney(cells[amtI]);
      const fee = parseMoney(cells[feeI]);
      const net = parseMoney(cells[netI]);
      const id = (cells[idI] ?? "").trim();
      let kind = "adjustment";
      if (type.includes("charge")) kind = "charge";
      else if (type.includes("refund")) kind = "refund";
      else if (type.includes("dispute")) kind = "dispute";
      else if (type.includes("payout")) kind = "payout";
      else if (type.includes("fee") || type.includes("stripe_fee")) kind = "fee";
      // A dispute row carries its own $15 fee in the fee column; Stripe keeps the
      // $0.30 fixed fee on refunds (data-driven, nothing to special-case).
      rows.push({
        id: id || `txn_${rows.length}`,
        kind,
        amount: kind === "payout" ? amount : r2(amount),
        fee: kind === "dispute" ? -Math.abs(fee) : kind === "charge" ? -Math.abs(fee) : fee,
        date: parseDateFlex(cells[createdI]),
        payoutId: null,
        label: (cells[descI] ?? "").trim().slice(0, 100),
      });
      // Split the dispute's $15 fee into its own explicit line so the QBO shows it.
      if (kind === "dispute" && Math.abs(fee) > 0.004) {
        rows.push({
          id: `${id || `txn_${rows.length}`}_disputefee`,
          kind: "dispute_fee",
          amount: 0,
          fee: -Math.abs(fee),
          date: parseDateFlex(cells[createdI]),
          payoutId: null,
          label: "Stripe dispute fee ($15, returned only if you win the dispute)",
        });
      }
      void net;
    }
  } else if (format === "payouts") {
    const idI = colIdx(lower, "id", "payout id");
    const amtI = colIdx(lower, "amount", "net");
    const dateI = colIdx(lower, "arrival_date", "arrival date", "date", "created");
    for (const cells of lines) {
      rows.push({
        id: (cells[idI] ?? "").trim() || `payout_${rows.length}`,
        kind: "payout",
        amount: parseMoney(cells[amtI]),
        fee: 0,
        date: parseDateFlex(cells[dateI]),
        payoutId: (cells[idI] ?? "").trim() || null,
        label: "Stripe payout",
      });
    }
    warnings.push(
      "This is a payouts-only export — it lists payout totals but not the charges, fees, and refunds inside each payout. For the full clearing breakdown, export Stripe's Payout Reconciliation (itemized) report instead."
    );
  } else {
    // itemized-payout
    const idI = colIdx(lower, "charge id", "payment id", "id", "transaction id");
    const grossI = colIdx(lower, "gross", "amount", "charge amount");
    const feeI = colIdx(lower, "fee", "fees");
    const netI = colIdx(lower, "net");
    const typeI = colIdx(lower, "type", "transaction type");
    const dateI = colIdx(lower, "date", "created", "charge date");
    const poI = colIdx(lower, "payout id", "payout");
    for (const cells of lines) {
      const type = (cells[typeI] ?? "").toLowerCase();
      const gross = parseMoney(cells[grossI]);
      const fee = -Math.abs(parseMoney(cells[feeI]));
      let kind = "charge";
      if (type.includes("refund")) kind = "refund";
      else if (type.includes("dispute")) kind = "dispute";
      else if (type.includes("payout") || type.includes("transfer")) kind = "payout";
      rows.push({
        id: (cells[idI] ?? "").trim() || `txn_${rows.length}`,
        kind,
        amount: gross,
        fee: kind === "payout" ? 0 : fee,
        date: parseDateFlex(cells[dateI]),
        payoutId: (cells[poI] ?? "").trim() || null,
        label: (cells[typeI] ?? "").trim().slice(0, 100),
      });
      if (kind === "dispute" && Math.abs(fee) > 0.004) {
        rows.push({
          id: `${(cells[idI] ?? "").trim()}_disputefee`,
          kind: "dispute_fee",
          amount: 0,
          fee: -Math.abs(fee),
          date: parseDateFlex(cells[dateI]),
          payoutId: (cells[poI] ?? "").trim() || null,
          label: "Stripe dispute fee ($15, returned only if you win the dispute)",
        });
      }
      void netI;
    }
  }
  return rows;
}

// ── PayPal parser ────────────────────────────────────────────────────────────

function paypalRows(lines: string[][], headers: string[]): NormalizedRow[] {
  const lower = headers.map((h) => h.toLowerCase());
  const dateI = colIdx(lower, "date");
  const nameI = colIdx(lower, "name");
  const typeI = colIdx(lower, "type");
  const grossI = colIdx(lower, "gross");
  const feeI = colIdx(lower, "fee");
  const netI = colIdx(lower, "net");
  const rows: NormalizedRow[] = [];
  for (const cells of lines) {
    const type = (cells[typeI] ?? "").toLowerCase();
    const gross = parseMoney(cells[grossI]);
    const fee = -Math.abs(parseMoney(cells[feeI]));
    const net = parseMoney(cells[netI]);
    let kind = "charge";
    if (type.includes("refund") || type.includes("reversal")) kind = "refund";
    else if (type.includes("chargeback") || type.includes("dispute")) kind = "dispute";
    else if (type.includes("transfer") && type.includes("bank")) kind = "transfer";
    else if (type.includes("withdraw")) kind = "transfer";
    else if (type.includes("fee")) kind = "fee";
    else if (type.includes("payment") || type.includes("express checkout") || type.includes("invoice")) kind = "charge";
    rows.push({
      id: `pp_${rows.length}`,
      kind,
      amount: kind === "transfer" ? net : gross,
      fee: kind === "transfer" ? 0 : fee,
      date: parseDateFlex(cells[dateI]),
      payoutId: null,
      label: (cells[nameI] ?? "").trim().slice(0, 100) || (cells[typeI] ?? "").trim(),
    });
  }
  return rows;
}

// ── Grouping into payouts + clearing model ───────────────────────────────────

function fitidForPayout(payoutId: string | null, kind: string, idx: number, salt: string): string {
  const raw = `PAYOUT|${payoutId ?? "single"}|${kind}|${idx}|${salt}`;
  let h = 5381;
  for (let i = 0; i < raw.length; i++) h = ((h << 5) + h + raw.charCodeAt(i)) >>> 0;
  return `CSPO${h.toString(36).toUpperCase()}${idx + 1}`;
}

function summarize(provider: Provider, rows: NormalizedRow[], payoutId: string | null, label: string): PayoutSummary {
  const of = (k: string) => rows.filter((r) => r.kind === k);
  const gross = r2(of("charge").reduce((s, r) => s + r.amount, 0));
  const refunds = r2(of("refund").reduce((s, r) => s + r.amount, 0)); // negative
  const disputes = r2(of("dispute").reduce((s, r) => s + r.amount, 0)); // negative
  const disputeFees = r2(of("dispute_fee").reduce((s, r) => s + r.fee, 0)); // negative
  const fees = r2(
    of("charge").reduce((s, r) => s + r.fee, 0) +
      of("refund").reduce((s, r) => s + r.fee, 0) +
      of("fee").reduce((s, r) => s + r.fee, 0) +
      disputeFees
  );
  const adjustments = r2(
    of("adjustment").reduce((s, r) => s + r.amount + r.fee, 0)
  );
  const net = r2(gross + refunds + disputes + fees + adjustments);

  const bankRows = rows.filter((r) => r.kind === "payout" || r.kind === "transfer");
  const bankAmount = bankRows.length ? r2(bankRows.reduce((s, r) => s + r.amount, 0)) : null;
  const tieOutDiff = bankAmount === null ? null : r2(bankAmount - net);
  const tiedOut = tieOutDiff === null ? null : Math.abs(tieOutDiff) < 0.011;

  const dates = rows.map((r) => r.date).filter(Boolean).sort();
  const payoutDate = dates.length ? dates[dates.length - 1] : "";

  // Clearing-account view: the QBO file represents the "{Provider} Clearing"
  // account. Each line below is one STMTTRN; the final transfer moves the net
  // to the real checking account, which the user matches in their bank feed.
  const clearing = provider === "stripe" ? "Stripe Clearing" : "PayPal Clearing";
  const t: Array<[string, number, string, string]> = [];
  let i = 0;
  const salt = `${payoutDate}|${net.toFixed(2)}`;
  if (Math.abs(gross) > 0.004)
    t.push([`${label} sales`, gross, "Income", fitidForPayout(payoutId, "GROSS", i++, salt)]);
  if (Math.abs(refunds) > 0.004)
    t.push([`${label} refunds`, refunds, "Income", fitidForPayout(payoutId, "REFUNDS", i++, salt)]);
  if (Math.abs(disputes) > 0.004)
    t.push([`${label} disputes/chargebacks`, disputes, "Income", fitidForPayout(payoutId, "DISPUTES", i++, salt)]);
  if (Math.abs(disputeFees) > 0.004)
    t.push(["Dispute fees ($15 each, returned only if won)", disputeFees, "Bank Fees", fitidForPayout(payoutId, "DFEE", i++, salt)]);
  const otherFees = r2(fees - disputeFees);
  if (Math.abs(otherFees) > 0.004)
    t.push([`${label} processing fees`, otherFees, "Bank Fees", fitidForPayout(payoutId, "FEES", i++, salt)]);
  if (Math.abs(adjustments) > 0.004)
    t.push([`${label} adjustments`, adjustments, "Other", fitidForPayout(payoutId, "ADJ", i++, salt)]);
  t.push([
    `Payout transfer to checking${payoutId ? ` (${payoutId})` : ""}`,
    -net,
    `Transfer: ${clearing} → Checking`,
    fitidForPayout(payoutId, "PAYOUT", i++, salt),
  ]);

  const qboTransactions: Transaction[] = t.map(([description, amount, category, reference]) => ({
    date: payoutDate || "1970-01-01",
    description,
    amount: r2(amount),
    balance: null,
    category,
    reference,
  }));

  return {
    provider,
    payoutId,
    payoutDate,
    gross,
    refunds,
    disputes,
    disputeFees,
    fees,
    adjustments,
    net,
    bankAmount,
    tieOutDiff,
    tiedOut,
    rowCount: rows.length,
    qboTransactions,
  };
}

export function parsePayoutCsv(text: string, provider: Provider): PayoutResult {
  const warnings: string[] = [];
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    throw new Error("That CSV appears to be empty. Export your transactions as a CSV and try again.");
  }
  const headers = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const body = lines.slice(1).map(splitCsvLine);

  let rows: NormalizedRow[];
  let detectedFormat: string;
  if (provider === "stripe") {
    const fmt = detectStripeFormat(headers);
    if (!fmt) {
      throw new Error(
        "We couldn't recognize this as a Stripe export. Use one of Stripe's CSV exports: Balance transactions, Payouts, or the Payout Reconciliation (itemized) report."
      );
    }
    detectedFormat = `Stripe — ${fmt}`;
    rows = stripeRows(body, headers, fmt, warnings);
  } else {
    if (!headers.includes("gross") || !headers.includes("type")) {
      throw new Error(
        "We couldn't recognize this as a PayPal activity export. In PayPal, go to Activity → Statements → Activity download and choose CSV."
      );
    }
    detectedFormat = "PayPal — Activity download";
    rows = paypalRows(body, headers);
  }

  if (rows.length === 0) {
    throw new Error("No transaction rows found in this CSV.");
  }

  // Group into payouts.
  const byPayout = new Map<string | null, NormalizedRow[]>();
  for (const r of rows) {
    if (r.kind === "payout" || r.kind === "transfer") continue; // handled as bankAmount
    const key = r.payoutId ?? null;
    const list = byPayout.get(key) ?? [];
    list.push(r);
    byPayout.set(key, list);
  }
  // PayPal transfers split periods: assign rows to the transfer that follows them.
  let payouts: PayoutSummary[];
  if (provider === "paypal") {
    const transfers = rows.filter((r) => r.kind === "transfer").sort((a, b) => a.date.localeCompare(b.date));
    if (transfers.length > 0) {
      payouts = [];
      const sorted = rows.filter((r) => r.kind !== "transfer").sort((a, b) => a.date.localeCompare(b.date));
      let start = 0;
      for (const tr of transfers) {
        const end = sorted.findIndex((r, k) => k >= start && r.date >= tr.date);
        const slice = end === -1 ? sorted.slice(start) : sorted.slice(start, end);
        start = end === -1 ? sorted.length : end;
        const group = [...slice];
        // attach the transfer row for the bank amount
        const summary = summarize(provider, group, null, "PayPal");
        summary.payoutId = `transfer-${tr.date}`;
        summary.bankAmount = r2(tr.amount);
        summary.tieOutDiff = r2(summary.bankAmount - summary.net);
        summary.tiedOut = Math.abs(summary.tieOutDiff) < 0.011;
        payouts.push(summary);
      }
      if (start < sorted.length) payouts.push(summarize(provider, sorted.slice(start), null, "PayPal"));
    } else {
      payouts = [summarize(provider, rows, null, "PayPal")];
    }
  } else if (byPayout.size > 1 || (byPayout.size === 1 && !byPayout.has(null))) {
    const keys = [...byPayout.keys()].sort((a, b) => String(a).localeCompare(String(b)));
    payouts = keys.map((k) => summarize(provider, byPayout.get(k)!, k, "Stripe"));
  } else {
    payouts = [summarize(provider, rows.filter((r) => r.kind !== "payout" && r.kind !== "transfer"), null, "Stripe")];
  }

  // Attach bank amounts for stripe payout rows when grouping was by payout id.
  // A lone payout row (typical balance-transaction export) attaches to the
  // single summary; with several summaries we match by payout id.
  const payoutRows = rows.filter((r) => r.kind === "payout");
  if (payoutRows.length) {
    for (const p of payouts) {
      const match =
        payoutRows.find((r) => (r.payoutId ?? r.id) === p.payoutId) ??
        (payouts.length === 1 ? payoutRows[0] : undefined);
      if (match) {
        p.bankAmount = r2(match.amount);
        p.tieOutDiff = r2(p.bankAmount - p.net);
        p.tiedOut = Math.abs(p.tieOutDiff) < 0.011;
      }
    }
    // A lone payouts-only export: one summary per payout row. There are no
    // detail rows, so no clearing entries can be built — QBO stays empty and
    // the UI directs the user to the itemized report instead.
    if (payouts.length === 1 && payouts[0].rowCount === 0 && byPayout.size === 0) {
      payouts = payoutRows.map((r) => ({
        ...summarize(provider, [], r.payoutId ?? r.id, "Stripe"),
        payoutId: r.payoutId ?? r.id,
        payoutDate: r.date,
        bankAmount: r2(r.amount),
        tieOutDiff: null,
        tiedOut: null,
        rowCount: 0,
        qboTransactions: [],
      }));
    }
  }

  // QBO-Online-ready CSV (clearing entries for every payout).
  const csvLines = [
    "Date,Description,Amount,Account,Reference",
    ...payouts.flatMap((p) =>
      p.qboTransactions.map((t) =>
        [
          t.date,
          `"${t.description.replace(/"/g, '""')}"`,
          t.amount.toFixed(2),
          `"${(t.category ?? "").replace(/"/g, '""')}"`,
          t.reference ?? "",
        ].join(",")
      )
    ),
  ];

  return { provider, detectedFormat, payouts, warnings, csv: csvLines.join("\n") };
}

/** Build the QBO body for the selected payouts (free = CSV; QBO is Pro-gated at the route). */
export function payoutsToQbo(payouts: PayoutSummary[]): string {
  const txns = payouts.flatMap((p) => p.qboTransactions);
  return withZeroLedger(transactionsToQBO(txns, "0000000000"));
}

/**
 * Tool-generated QBOs (payout clearing, receipt expenses) are not bank
 * statements, so there is no closing balance to carry. A zero ledger balance
 * is the honest convention here — and it keeps the files passing the site's
 * own QBO checker instead of tripping its missing-ledger error.
 */
export function withZeroLedger(qbo: string): string {
  const dtEnd = qbo.match(/<DTEND>(\d{14})/)?.[1];
  const ledger = `\n<LEDGERBAL>\n<BALAMT>0.00</BALAMT>\n${
    dtEnd ? `<DTASOF>${dtEnd}</DTASOF>\n` : ""
  }</LEDGERBAL>`;
  return qbo.replace("</BANKTRANLIST>", `</BANKTRANLIST>${ledger}`);
}
