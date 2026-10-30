/**
 * QBO file splitter — trim a QBO/OFX file to a chosen date range.
 *
 * Parses the uploaded file with the site's OFX checker, rebuilds running
 * balances from the file's own closing (ledger) balance when it has one,
 * and regenerates a smaller QBO containing only the transactions inside
 * the selected range. When the kept rows carry balances, the regenerated
 * file's ledger balance is the last kept row's balance, so the balance
 * chain stays consistent. When the original file has no closing balance,
 * there is no real balance to carry, so the trimmed file uses the honest
 * zero-ledger convention (withZeroLedger) used by other tool-generated
 * QBOs on this site.
 *
 * Pure parsing — no network, no storage. This tool is fully free.
 */
import { analyzeOfx } from "@/lib/ofx-check";
import { transactionsToQBO, verifyBalanceChain } from "@/lib/mock-transactions";
import type { Transaction } from "@/types/billing";
import { withZeroLedger } from "./payout";

export interface SplitTransaction {
  date: string; // yyyy-mm-dd
  description: string;
  amount: number;
  balance: number | null;
  category: string | null;
  reference: string | null;
}

export interface SplitAnalysis {
  periodStart: string | null;
  periodEnd: string | null;
  transactionCount: number;
  ledgerBalance: number | null;
  netChange: number;
  transactions: SplitTransaction[];
}

export interface SplitResult {
  qbo: string;
  kept: SplitTransaction[];
  keptCount: number;
  droppedBefore: number;
  droppedAfter: number;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

function toTransaction(t: SplitTransaction): Transaction {
  return {
    date: t.date,
    description: t.description,
    amount: t.amount,
    balance: t.balance,
    category: t.category ?? null,
    reference: t.reference ?? null,
  };
}

export function analyzeForSplit(text: string): SplitAnalysis {
  const analysis = analyzeOfx(text);
  if (!analysis.transactions || analysis.transactions.length === 0) {
    throw new Error(
      "No transactions could be found in that file. Please choose a .qbo, .ofx or .qfx file that contains bank transactions."
    );
  }

  const sorted = [...analysis.transactions]
    .filter((t) => t.date && Number.isFinite(t.amount))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (sorted.length === 0) {
    throw new Error(
      "No transactions could be found in that file. Please choose a .qbo, .ofx or .qfx file that contains bank transactions."
    );
  }

  const transactions: SplitTransaction[] = sorted.map((t) => ({
    date: t.date,
    description: (t.name || t.type || "Transaction").slice(0, 120),
    amount: r2(t.amount),
    balance: null,
    category: null,
    reference: t.fitid ?? null,
  }));

  const netChange = r2(transactions.reduce((s, t) => s + t.amount, 0));
  const ledgerBalance = analysis.ledgerBalance;

  if (ledgerBalance !== null && ledgerBalance !== undefined) {
    // Opening balance is whatever makes the file's own closing balance
    // true: opening + net change of every parsed transaction = ledger.
    const opening = r2(ledgerBalance - netChange);
    let running = opening;
    for (const t of transactions) {
      running = r2(running + t.amount);
      t.balance = running;
    }
  }

  return {
    periodStart: analysis.periodStart ?? transactions[0].date,
    periodEnd: analysis.periodEnd ?? transactions[transactions.length - 1].date,
    transactionCount: transactions.length,
    ledgerBalance: ledgerBalance ?? null,
    netChange,
    transactions,
  };
}

export function splitQbo(
  transactions: SplitTransaction[],
  start: string,
  end: string
): SplitResult {
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  const kept = sorted.filter((t) => t.date >= start && t.date <= end);
  const droppedBefore = sorted.filter((t) => t.date < start).length;
  const droppedAfter = sorted.filter((t) => t.date > end).length;

  if (kept.length === 0) {
    throw new Error(
      "No transactions fall inside the selected date range. Widen the dates and try again."
    );
  }

  const keptTxns: Transaction[] = kept.map(toTransaction);
  const allHaveBalances = kept.every(
    (t) => t.balance !== null && t.balance !== undefined && Number.isFinite(t.balance)
  );

  const qbo = allHaveBalances
    ? transactionsToQBO(keptTxns, "0000000000")
    : withZeroLedger(transactionsToQBO(keptTxns, "0000000000"));

  return { qbo, kept, keptCount: kept.length, droppedBefore, droppedAfter };
}

/** True only when the rows carry enough balances to check and every step holds. */
export function balanceChainOk(transactions: SplitTransaction[]): boolean {
  const result = verifyBalanceChain(transactions.map(toTransaction));
  return result.checked && result.ok;
}
