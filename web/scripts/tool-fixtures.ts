/**
 * Fixture runner for the free-tools batch (CSV→QBO, Amazon, Shopify,
 * reconciliation, samples, and Stripe/PayPal regressions).
 *
 * Run:  ../node_modules/.bin/tsc -p tsconfig.fixtures.json
 *       node .fixture-out/scripts/tool-fixtures.js
 * (from web/). The compiled output is git-ignored scratch — delete it after
 * a run. Nothing here touches the network, Redis, or any secret.
 *
 * Every number below is hand-computed from the fixture rows in this file or
 * in lib/tools/samples.ts. If a parser changes, these assertions are the
 * first thing that should break.
 */
import { parsePayoutCsv } from "@/lib/tools/payout";
import { parseGenericCsv, autoDetectMapping, genericRowsToQbo } from "@/lib/tools/csv-to-qbo";
import { compareStatementToQbo } from "@/lib/tools/reconciliation";
import { analyzeCleanup } from "@/lib/tools/cleanup-analysis";
import {
  SAMPLE_CLEAN_QBO,
  SAMPLE_DUPLICATE_QBO,
  SAMPLE_STRIPE_CSV,
  SAMPLE_AMAZON_CSV,
  SAMPLE_SHOPIFY_CSV,
  SAMPLE_GENERIC_CSV,
} from "@/lib/tools/samples";

let passed = 0;
let failed = 0;
function eq(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    passed++;
    console.log(`  ok  ${name}`);
  } else {
    failed++;
    console.log(`FAIL  ${name}\n      expected: ${e}\n      actual:   ${a}`);
  }
}
function ok(name: string, cond: boolean, detail = "") {
  if (cond) {
    passed++;
    console.log(`  ok  ${name}`);
  } else {
    failed++;
    console.log(`FAIL  ${name} ${detail}`);
  }
}

// ── Stripe regression ──
// Engine semantics: a dispute row's fee column becomes its own dispute-fee
// line, counted once via disputeFees (the dispute row's own fee is not
// double-counted). Hand-computed here: gross 1000 − refunds 50 − disputes 60
// − charge fees 32 − dispute fee 15 = net 843.
console.log("Stripe regression");
{
  const csv = `Balance Transaction ID,Type,Amount,Fee,Net,Created,Description
txn_a,charge,600.00,20.00,580.00,2026-01-02,Order
txn_b,charge,400.00,12.00,388.00,2026-01-03,Order
txn_c,refund,-50.00,0.00,-50.00,2026-01-04,Refund
txn_d,dispute,-60.00,15.00,-75.00,2026-01-05,Dispute
po_x,payout,843.00,0.00,843.00,2026-01-06,Stripe payout`;
  const r = parsePayoutCsv(csv, "stripe");
  const p = r.payouts[0];
  eq("stripe gross", p.gross, 1000);
  eq("stripe refunds", p.refunds, -50);
  eq("stripe disputes", p.disputes, -60);
  eq("stripe disputeFees", p.disputeFees, -15);
  eq("stripe fees (incl dispute fee)", p.fees, -47);
  eq("stripe net", p.net, 843);
  eq("stripe ties out", p.tiedOut, true);
}

// ── PayPal regression (roadmap fixture ties out at 289.25) ──
console.log("PayPal regression");
{
  const csv = `Date,Name,Type,Gross,Fee,Net
2026-01-02,Store,Express Checkout Payment,200.00,5.80,194.20
2026-01-03,Store,Express Checkout Payment,100.00,2.90,97.10
2026-01-04,Customer,Refund,-10.00,0.00,-10.00
2026-01-05,PayPal,General Withdrawal,0.00,0.00,281.30`;
  // Hand-computed: gross 300 − refunds 10 − fees 8.70 = 281.30. (The 289.25
  // roadmap figure was a different fixture; this file's own tie-out is 281.30.)
  const r = parsePayoutCsv(csv, "paypal");
  const p = r.payouts[0];
  eq("paypal net", p.net, 281.3);
  eq("paypal ties out", p.tiedOut, true);
}

// ── Amazon (sample: gross 180, refunds -30, fees -27, payout 123) ──
console.log("Amazon");
{
  const r = parsePayoutCsv(SAMPLE_AMAZON_CSV, "amazon");
  const p = r.payouts[0];
  eq("amazon detected", r.detectedFormat, "Amazon — Settlement report");
  eq("amazon gross", p.gross, 180);
  eq("amazon refunds", p.refunds, -30);
  eq("amazon fees", p.fees, -27);
  eq("amazon net", p.net, 123);
  eq("amazon bank", p.bankAmount, 123);
  eq("amazon ties out", p.tiedOut, true);
  ok("amazon QBO has clearing lines", r.payouts[0].qboTransactions.length >= 4);
}

// ── Shopify (sample: gross 300, refunds -50, fees -8.70, payout 241.30) ──
console.log("Shopify");
{
  const r = parsePayoutCsv(SAMPLE_SHOPIFY_CSV, "shopify");
  const p = r.payouts[0];
  eq("shopify detected", r.detectedFormat, "Shopify — Payments payout export");
  eq("shopify gross", p.gross, 300);
  eq("shopify refunds", p.refunds, -50);
  eq("shopify fees", p.fees, -8.7);
  eq("shopify net", p.net, 241.3);
  eq("shopify bank", p.bankAmount, 241.3);
  eq("shopify ties out", p.tiedOut, true);
}

// ── Shopify multi-payout grouping (payout-id must actually group) ──
console.log("Shopify multi-payout");
{
  const csv = `payout-id,date,type,gross,fee,net
PO-1,2026-01-02,Charge,100.00,2.90,97.10
PO-1,2026-01-03,Payout,0.00,0.00,97.10
PO-2,2026-01-04,Charge,50.00,1.75,48.25
PO-2,2026-01-05,Payout,0.00,0.00,48.25`;
  const r = parsePayoutCsv(csv, "shopify");
  eq("shopify payout count", r.payouts.length, 2);
  eq("shopify payout 1 net", r.payouts[0].net, 97.1);
  eq("shopify payout 2 net", r.payouts[1].net, 48.25);
  eq("shopify payout 1 ties out", r.payouts[0].tiedOut, true);
  eq("shopify payout 2 ties out", r.payouts[1].tiedOut, true);
}

// ── Stripe sample (gross 150, refunds -20, fees -4.65, payout 125.35) ──
console.log("Stripe sample");
{
  const p = parsePayoutCsv(SAMPLE_STRIPE_CSV, "stripe").payouts[0];
  eq("stripe sample net", p.net, 125.35);
  eq("stripe sample ties out", p.tiedOut, true);
}

// ── Generic CSV: auto-detect + signed amounts + balance chain ──
console.log("Generic CSV");
{
  const headers = SAMPLE_GENERIC_CSV.split("\n")[0].split(",");
  const mapping = autoDetectMapping(headers.map((h) => h.trim().toLowerCase()));
  eq("csv auto date col", mapping.date, 0);
  eq("csv auto payee col", mapping.payee, 1);
  eq("csv auto amount col", mapping.amount, 2);
  eq("csv auto balance col", mapping.balance, 3);
  const r = parseGenericCsv(SAMPLE_GENERIC_CSV, mapping);
  eq("csv row count", r.rows.length, 3);
  eq("csv row 2 amount", r.rows[1].amount, -42.1);
  eq("csv balance holds", r.balanceOk, true);
  const qbo = genericRowsToQbo(r.rows);
  ok("csv QBO is USD", qbo.includes("<CURDEF>USD</CURDEF>"));
  ok("csv QBO has 3 STMTTRN", (qbo.match(/<STMTTRN>/g) ?? []).length === 3);
  ok("csv QBO FITIDs unique", new Set((qbo.match(/<FITID>([^<]+)/g) ?? [])).size === 3);
  // Debit/credit pair variant: debit 42.10 -> -42.10, credit 2500 -> +2500.
  const pair = `Date,Description,Debit,Credit
2026-01-02,ACME PAYROLL,,2500.00
2026-01-05,AMAZON MKTPLACE,42.10,`;
  const pairMap = autoDetectMapping(["date", "description", "debit", "credit"]);
  const pr = parseGenericCsv(pair, pairMap);
  eq("pair row count", pr.rows.length, 2);
  eq("pair debit negative", pr.rows[1].amount, -42.1);
  eq("pair credit positive", pr.rows[0].amount, 2500);
}

// ── Cleanup samples ──
console.log("Cleanup samples");
{
  const clean = analyzeCleanup(SAMPLE_CLEAN_QBO, "sample-clean.qbo");
  eq("clean txn count", clean.transactionCount, 3);
  eq("clean duplicates", clean.duplicateInstances, 0);
  const dup = analyzeCleanup(SAMPLE_DUPLICATE_QBO, "sample-duplicate-fitid.qbo");
  eq("dup txn count", dup.transactionCount, 2);
  ok("dup flagged", dup.duplicateInstances >= 1);
  ok("dup group is exact-fitid", dup.duplicateGroups.some((g) => g.kind === "exact-fitid"));
  const csvDup = analyzeCleanup(
    `Date,Description,Amount
2026-01-02,ACME PAYROLL,100.00
2026-01-02,ACME PAYROLL,100.00`,
    "dup.csv"
  );
  ok("csv exact-match flagged", csvDup.duplicateInstances >= 1);
}

// ── Reconciliation: missing / extra / amount-mismatch / date-drift ──
console.log("Reconciliation");
{
  const statement = `Date,Description,Amount
2026-01-02,ACME PAYROLL,2500.00
2026-01-05,AMAZON MKTPLACE,-42.10
2026-01-09,WHOLE FOODS MARKET,-86.25
2026-01-12,NETFLIX,-15.99`;
  const qbo = `Date,Description,Amount
2026-01-02,ACME PAYROLL,2500.00
2026-01-05,AMAZON MKTPLACE,-42.10
2026-01-09,WHOLE FOODS MARKET,-80.00
2026-01-15,SPOTIFY,-10.99`;
  const r = compareStatementToQbo(statement, "stmt.csv", qbo, "qb.csv");
  eq("recon matched", r.matchedCount, 2);
  eq("recon missing (NETFLIX)", r.missingCount, 1);
  eq("recon extra (SPOTIFY)", r.extraCount, 1);
  eq("recon amount mismatch (WHOLE FOODS)", r.amountMismatchCount, 1);
  // Hand-check: statement net = 2500 − 42.10 − 86.25 − 15.99 = 2355.66;
  // QB net = 2500 − 42.10 − 80.00 − 10.99 = 2366.91; diff = −11.25.
  eq("recon statement net", r.statementNet, 2355.66);
  eq("recon qb net", r.quickbooksNet, 2366.91);
  eq("recon difference recomputed", r.difference, -11.25);
  const drift = compareStatementToQbo(
    `Date,Description,Amount\n2026-01-05,AMAZON MKTPLACE,-42.10`,
    "stmt.csv",
    `Date,Description,Amount\n2026-01-07,AMAZON MKTPLACE,-42.10`,
    "qb.csv"
  );
  eq("recon date drift", drift.dateDriftCount, 1);
  eq("recon drift matched", drift.matchedCount, 0);
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
