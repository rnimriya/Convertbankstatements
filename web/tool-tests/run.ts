/**
 * E2E fixture tests for the three free QuickBooks tools.
 * Run: npx tsc -p /tmp/tt/tsconfig.json && node /tmp/tt/out/tool-tests/run.js
 */
import { analyzeCleanup, buildCleanedTransactions, buildCleanedQbo } from "@/lib/tools/cleanup-analysis";
import { parsePayoutCsv, payoutsToQbo } from "@/lib/tools/payout";
import { analyzeOfx } from "@/lib/ofx-check";
import { transactionsToQBO } from "@/lib/mock-transactions";
import { extractReceiptFromImage } from "@/lib/extraction/extract";

let failures = 0;
function check(name: string, cond: boolean, detail = "") {
  if (cond) console.log(`  PASS ${name}`);
  else { failures++; console.log(`  FAIL ${name} ${detail}`); }
}

// ── TOOL 1 fixtures ──────────────────────────────────────────────────────────

function makeTxns(n: number, startBal: number) {
  const txns = [];
  let bal = startBal;
  for (let i = 0; i < n; i++) {
    const amount = i % 3 === 0 ? 250 : -(40 + i * 7);
    bal = Math.round((bal + amount) * 100) / 100;
    txns.push({
      date: `2026-09-${String(i + 1).padStart(2, "0")}`,
      description: ["WHOLEFDS MKT", "SHELL OIL", "COMCAST", "AMZN MKTP", "STARBUCKS"][i % 5],
      amount,
      balance: bal,
      category: "Other",
      reference: `REF${1000 + i}`,
    });
  }
  return txns;
}

console.log("TOOL 1 — cleanup analysis");

const cleanQbo = transactionsToQBO(makeTxns(10, 2000), "0000000000");
const clean = analyzeCleanup(cleanQbo, "stmt.qbo");
check("clean file: score >= 95", clean.healthScore >= 95, `got ${clean.healthScore}`);
check("clean file: no duplicates", clean.duplicateInstances === 0);
check("clean file: no errors", clean.errorCount === 0, `got ${clean.errorCount}`);

// Duplicate-FITID file: repeat the FITID of the first transaction on the last one.
const fitidOf = (qbo: string, n: number) => {
  const m = [...qbo.matchAll(/<FITID>([^<]+)/g)];
  return m[n]?.[1];
};
const dupQbo = cleanQbo.replace(
  new RegExp(`<FITID>${fitidOf(cleanQbo, 9)}</FITID>`),
  `<FITID>${fitidOf(cleanQbo, 0)}</FITID>`
);
const dup = analyzeCleanup(dupQbo, "dup.qbo");
check("dup FITID: exact-fitid group found", dup.duplicateGroups.some((g) => g.kind === "exact-fitid"));
check("dup FITID: duplicateInstances = 1", dup.duplicateInstances === 1, `got ${dup.duplicateInstances}`);
check("dup FITID: score dropped", dup.healthScore < clean.healthScore, `clean=${clean.healthScore} dup=${dup.healthScore}`);

// Cleaned QBO: exact dup removed, FITIDs unique, ledger preserved, still valid OFX.
const { txns: cleanedTxns, removed } = buildCleanedTransactions(dup);
check("cleaned: removed 1 duplicate", removed === 1, `got ${removed}`);
const { qbo: cleanedQbo } = buildCleanedQbo(dup);
const cleanedCheck = analyzeOfx(cleanedQbo);
check("cleaned QBO: valid per analyzeOfx", cleanedCheck.valid, JSON.stringify(cleanedCheck.issues.slice(0, 2)));
check("cleaned QBO: no dup FITIDs", !cleanedCheck.issues.some((i) => /repeat/i.test(i.message)));
check("cleaned QBO: ledger preserved", cleanedCheck.ledgerBalance === dup.ledgerBalance,
  `got ${cleanedCheck.ledgerBalance} want ${dup.ledgerBalance}`);
void cleanedTxns;

// Near-duplicate CSV fixture: 3 pairs, same amount within 3 days, similar names.
const nearCsv = `Date,Description,Amount,Balance
2026-09-01,AMZN MKTP US*2R3T41,-49.99,1950.01
2026-09-02,Amazon Mktp US 2R3T41,-49.99,1900.02
2026-09-05,SHELL OIL 5744,-38.20,1861.82
2026-09-07,Shell Oil,-38.20,1823.62
2026-09-10,STARBUCKS STORE 123,-6.45,1817.17
2026-09-12,Starbucks,-6.45,1810.72
2026-09-15,WHOLEFDS MKT,-120.00,1690.72`;
const near = analyzeCleanup(nearCsv, "stmt.csv");
check("near-dup CSV: 3 near-match groups", near.duplicateGroups.filter((g) => g.kind === "near-match").length === 3,
  `got ${near.duplicateGroups.filter((g) => g.kind === "near-match").length}`);
check("near-dup CSV: balance chain holds", near.balanceChecked && near.balanceOk === true);

// Broken balance chain CSV.
const brokenCsv = `Date,Description,Amount,Balance
2026-09-01,OPENING,,1000.00
2026-09-02,SHOP A,-100.00,900.00
2026-09-03,SHOP B,-50.00,870.00`;
const broken = analyzeCleanup(brokenCsv, "broken.csv");
check("broken chain: balanceChecked", broken.balanceChecked);
check("broken chain: flagged as error", broken.balanceOk === false && broken.errorCount > 0);

// Stale uncleared CSV.
const staleCsv = `Date,Description,Amount,Clr
2026-01-05,OLD CHECK 101,-250.00,
2026-09-20,NEW SHOP,-30.00,Y
2026-09-21,ANOTHER,-40.00,`;
const stale = analyzeCleanup(staleCsv, "stale.csv");
check("stale uncleared: 1 flagged", stale.staleUncleared === 1, `got ${stale.staleUncleared}`);

// ── TOOL 2 fixtures ──────────────────────────────────────────────────────────
// 10 charges of $100 (fee $3.20 each), 1 refund of $50 (fee kept $0), 1 dispute
// of $75 with $15 dispute fee. Hand-computed:
//   gross = 1000.00, fees = 32.00, refunds = -50.00, disputes = -75.00,
//   disputeFees = -15.00, net = 1000 - 50 - 75 - 32 - 15 = 828.00
console.log("TOOL 2 — payout converter");

const stripeLines = ["id,type,amount,fee,net,created,description,available_on"];
for (let i = 0; i < 10; i++) {
  stripeLines.push(`txn_ch${i},charge,100.00,3.20,96.80,2026-09-1${i % 10},Payment,2026-09-15`);
}
stripeLines.push("txn_rf1,refund,-50.00,0.00,-50.00,2026-09-16,Refund,2026-09-16");
stripeLines.push("txn_dp1,dispute,-75.00,15.00,-90.00,2026-09-17,Dispute,2026-09-17");
stripeLines.push("po_123,payout,828.00,0.00,828.00,2026-09-18,Payout to bank,2026-09-18");
const stripeCsv = stripeLines.join("\n");

const pres = parsePayoutCsv(stripeCsv, "stripe");
check("stripe: format detected", /balance-transactions/.test(pres.detectedFormat), pres.detectedFormat);
check("stripe: 1 payout", pres.payouts.length === 1, `got ${pres.payouts.length}`);
const p = pres.payouts[0];
check("stripe: gross = 1000", p.gross === 1000, `got ${p.gross}`);
check("stripe: fees = -47 (32 processing + 15 dispute)", p.fees === -47, `got ${p.fees}`);
check("stripe: refunds = -50", p.refunds === -50, `got ${p.refunds}`);
check("stripe: disputes = -75, disputeFees = -15", p.disputes === -75 && p.disputeFees === -15,
  `got ${p.disputes}/${p.disputeFees}`);
check("stripe: net = 828", p.net === 828, `got ${p.net}`);
check("stripe: bankAmount = 828, ties out", p.bankAmount === 828 && p.tiedOut === true,
  `bank=${p.bankAmount} tied=${p.tiedOut} diff=${p.tieOutDiff}`);
// Clearing nets to zero: gross + refunds + disputes + disputeFees + otherFees + transfer(-net) = 0
const clearingSum = Math.round(p.qboTransactions.reduce((s, t) => s + t.amount, 0) * 100) / 100;
check("stripe: clearing entries sum to 0", clearingSum === 0, `got ${clearingSum}`);
check("stripe: FITIDs unique", new Set(p.qboTransactions.map((t) => t.reference)).size === p.qboTransactions.length);

const payoutQbo = payoutsToQbo(pres.payouts);
const payoutCheck = analyzeOfx(payoutQbo);
check("stripe QBO: valid per analyzeOfx", payoutCheck.valid, JSON.stringify(payoutCheck.issues.slice(0, 2)));
check("stripe QBO: txn count matches", payoutCheck.transactionCount === p.qboTransactions.length);

// PayPal fixture.
const ppCsv = [
  "Date,Time,TimeZone,Name,Type,Status,Gross,Fee,Net",
  "09/01/2026,10:00:00,PDT,Buyer A,Express Checkout Payment,Completed,200.00,-6.10,193.90",
  "09/02/2026,11:00:00,PDT,Buyer B,Express Checkout Payment,Completed,150.00,-4.65,145.35",
  "09/03/2026,12:00:00,PDT,Buyer A,Refund,Completed,-50.00,0.00,-50.00",
  "09/05/2026,09:00:00,PDT,,Transfer to bank account,Completed,,-0.00,289.25",
].join("\n");
const ppres = parsePayoutCsv(ppCsv, "paypal");
check("paypal: 1 payout period", ppres.payouts.length === 1, `got ${ppres.payouts.length}`);
const pp = ppres.payouts[0];
check("paypal: gross = 350", pp.gross === 350, `got ${pp.gross}`);
check("paypal: fees = -10.75", pp.fees === -10.75, `got ${pp.fees}`);
check("paypal: refunds = -50", pp.refunds === -50, `got ${pp.refunds}`);
check("paypal: ties out to 289.25", pp.tiedOut === true, `tied=${pp.tiedOut} diff=${pp.tieOutDiff} net=${pp.net}`);

// ── TOOL 3 fixtures (mocked Gemini) ──────────────────────────────────────────
console.log("TOOL 3 — receipt extraction (mocked Gemini)");

const geminiJson = JSON.stringify({
  bank_name: "Whole Foods Market",
  transactions: [
    { date: "2026-09-20", description: "Organic milk", amount: -4.99, balance: null },
    { date: "2026-09-20", description: "Sourdough bread", amount: -5.49, balance: null },
    { date: "2026-09-20", description: "Sales tax", amount: -0.84, balance: null },
  ],
});
const geminiResp = {
  candidates: [{ content: { parts: [{ text: geminiJson }] } }],
};

async function runReceiptTests() {
  const realFetch = global.fetch;
  // @ts-expect-error mock
  global.fetch = async () => ({ ok: true, json: async () => geminiResp });
  process.env.GEMINI_API_KEY = "test-key";
  const r = await extractReceiptFromImage(Buffer.from("fake-jpeg-bytes"), "image/jpeg", "127.0.0.1");
  check("receipt: method vision", r.method === "vision", r.method);
  check("receipt: 3 line items", r.transactions.length === 3, `got ${r.transactions.length}`);
  check("receipt: vendor detected", r.bankName === "Whole Foods Market", String(r.bankName));
  check("receipt: categorized", r.transactions.every((t) => !!t.category), JSON.stringify(r.transactions.map((t) => t.category)));
  const total = Math.abs(r.transactions.reduce((s, t) => s + t.amount, 0));
  check("receipt: total = 11.32", Math.abs(total - 11.32) < 0.001, `got ${total}`);

  // No-key path.
  delete process.env.GEMINI_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  const r2 = await extractReceiptFromImage(Buffer.from("fake-jpeg-bytes"), "image/jpeg");
  check("receipt: no-key → no_vision_key", r2.method === "none" && r2.reason === "no_vision_key",
    `${r2.method}/${r2.reason}`);
  global.fetch = realFetch;
}

runReceiptTests().then(() => {
  console.log(failures === 0 ? "\nALL TESTS PASSED" : `\n${failures} TEST(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
});
