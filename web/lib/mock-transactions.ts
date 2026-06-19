import type { Transaction } from "@/types/billing";
import * as XLSX from "xlsx";

const MERCHANTS = [
  "AMAZON.IN", "FLIPKART INTERNET", "MYNTRA DESIGNS", "SWIGGY ORDER",
  "ZOMATO LIMITED", "OLA CABS", "UBER INDIA", "OLA ELECTRIC",
  "RELIANCE JIO", "AIRTEL MOBILE", "BSNL RECHARGE", "VODAFONE IDEA",
  "HDFC LIFE INS", "LIC PREMIUM", "BAJAJ ALLIANZ", "STAR HEALTH INS",
  "DMART RETAIL", "BIGBASKET.COM", "GROFERS NOW", "BLINKIT ORDER",
  "IRCTC TICKET", "MAKE MY TRIP", "GOIBIBO FLIGHT", "RED BUS TICKET",
  "PAYTM MERCHANT", "PHONEPE TRANSFER", "GOOGLEPAY UPI", "BHIM UPI",
  "NETFLIX INDIA", "HOTSTAR DISNEY", "SONY LIV", "AMAZON PRIME",
  "ELECTRICITY BILL MSEDCL", "MAHANAGAR GAS", "INDANE GAS",
  "MUNICIPAL TAX AUTO", "PROPERTY TAX", "WATER BILL",
  "SIP MUTUAL FUND", "NSE BROKERAGE", "ZERODHA KITE", "GROWW APP",
  "EMI HDFC HOME LOAN", "EMI ICICI CAR", "CREDIT CARD BILL PAYMENT",
  "SALARY CREDIT NEFT", "FREELANCE TRANSFER NEFT", "RENT CREDIT",
  "ATM WDL STATE BANK", "CASH WDL", "CHEQUE CLEARING",
  "CANTEEN CHARGES", "PETROL BPCL", "PETROL HPCL", "HP GAS",
];

const CATEGORY_MAP: [string, string][] = [
  ["AMAZON", "Shopping"], ["FLIPKART", "Shopping"], ["MYNTRA", "Shopping"],
  ["SWIGGY", "Food & Dining"], ["ZOMATO", "Food & Dining"],
  ["OLA", "Transport"], ["UBER", "Transport"], ["IRCTC", "Transport"],
  ["MAKE MY TRIP", "Travel"], ["GOIBIBO", "Travel"], ["RED BUS", "Travel"],
  ["NETFLIX", "Entertainment"], ["HOTSTAR", "Entertainment"], ["SONY LIV", "Entertainment"],
  ["AMAZON PRIME", "Entertainment"],
  ["DMART", "Groceries"], ["BIGBASKET", "Groceries"], ["BLINKIT", "Groceries"],
  ["JIO", "Utilities"], ["AIRTEL", "Utilities"], ["BSNL", "Utilities"],
  ["ELECTRICITY", "Utilities"], ["GAS", "Utilities"], ["WATER BILL", "Utilities"],
  ["LIC", "Insurance"], ["HDFC LIFE", "Insurance"], ["BAJAJ", "Insurance"],
  ["STAR HEALTH", "Insurance"],
  ["MUTUAL FUND", "Investments"], ["ZERODHA", "Investments"], ["GROWW", "Investments"],
  ["SIP", "Investments"],
  ["EMI", "Loan EMI"], ["HOME LOAN", "Loan EMI"], ["CAR", "Loan EMI"],
  ["SALARY", "Income"], ["FREELANCE", "Income"], ["RENT CREDIT", "Income"],
  ["ATM", "Cash"], ["PETROL", "Fuel"], ["HPCL", "Fuel"], ["BPCL", "Fuel"],
];

function getCategory(desc: string): string {
  const upper = desc.toUpperCase();
  for (const [key, cat] of CATEGORY_MAP) {
    if (upper.includes(key)) return cat;
  }
  return "Others";
}

function randomINRAmount(isCredit: boolean): number {
  if (isCredit) {
    const credits = [45000, 60000, 25000, 15000, 8500, 3200];
    return credits[Math.floor(Math.random() * credits.length)];
  }
  // Debits: ₹50 – ₹12000
  return -(Math.floor(Math.random() * 120 + 5) * 100);
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function generateMockTransactions(pageCount: number): Transaction[] {
  const count = Math.min(pageCount * 22, 500);
  const transactions: Transaction[] = [];

  const start = new Date();
  start.setMonth(start.getMonth() - Math.ceil(pageCount / 3));
  let balance = 50000 + Math.random() * 100000; // Starting with ₹50k–₹1.5L

  const interval = (Date.now() - start.getTime()) / count;

  for (let i = 0; i < count; i++) {
    const date = new Date(start.getTime() + i * interval);
    const isCredit = Math.random() < 0.12;
    const description = isCredit
      ? ["SALARY CREDIT NEFT", "FREELANCE TRANSFER NEFT", "UPI CREDIT"][Math.floor(Math.random() * 3)]
      : MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)];
    const amount = randomINRAmount(isCredit);
    balance += amount;

    transactions.push({
      date: formatDate(date),
      description,
      amount: Math.round(amount * 100) / 100,
      balance: Math.round(balance * 100) / 100,
      category: getCategory(description),
      reference: `UPI${String(i + 100000).padStart(12, "0")}`,
    });
  }

  return transactions.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Neutralise CSV/spreadsheet formula injection. A cell beginning with =, +, -, @,
 * or a control char is treated as a formula by Excel/LibreOffice/Sheets when the
 * file is opened. Transaction text comes from uploaded (possibly attacker-supplied,
 * e.g. via a client portal) PDFs, so we prefix such values with a single quote.
 */
function csvSafe(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

/** Wrap a string cell for CSV: sanitise formulas, then quote and escape. */
function csvCell(value: string): string {
  return `"${csvSafe(value).replace(/"/g, '""')}"`;
}

export function transactionsToCSV(transactions: Transaction[]): string {
  const header = "Date,Description,Amount (INR),Balance (INR),Category,Reference\n";
  const rows = transactions
    .map((t) =>
      [
        csvCell(t.date),
        csvCell(t.description),
        t.amount.toFixed(2),
        t.balance?.toFixed(2) ?? "",
        csvCell(t.category ?? ""),
        csvCell(t.reference ?? ""),
      ].join(",")
    )
    .join("\n");
  return header + rows;
}

/** Excel (.xlsx) — returns a Buffer */
export function transactionsToExcel(transactions: Transaction[]): Buffer {
  const rows = transactions.map((t) => ({
    Date: t.date,
    Description: t.description,
    "Amount (INR)": t.amount,
    "Balance (INR)": t.balance ?? "",
    Category: t.category ?? "",
    Reference: t.reference ?? "",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [
    { wch: 12 }, // Date
    { wch: 40 }, // Description
    { wch: 14 }, // Amount
    { wch: 14 }, // Balance
    { wch: 18 }, // Category
    { wch: 22 }, // Reference
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transactions");
  return Buffer.from(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
}

/** OFX 1.02 (QuickBooks / Tally / Xero) */
export function transactionsToOFX(transactions: Transaction[], accountId = "0000000000"): string {
  const now = new Date();
  const dtNow = formatOFXDate(now);

  const txnXml = transactions
    .map((t, i) => {
      const type = t.amount >= 0 ? "CREDIT" : "DEBIT";
      const fitid = t.reference ?? `TXN${String(i + 1).padStart(10, "0")}`;
      return `<STMTTRN>
<TRNTYPE>${type}</TRNTYPE>
<DTPOSTED>${formatOFXDate(new Date(t.date))}</DTPOSTED>
<TRNAMT>${t.amount.toFixed(2)}</TRNAMT>
<FITID>${fitid}</FITID>
<NAME>${escapeXml(t.description)}</NAME>
<MEMO>${escapeXml(t.category ?? "")}</MEMO>
</STMTTRN>`;
    })
    .join("\n");

  return `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:UTF-8
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

<OFX>
<SIGNONMSGSRSV1>
<SONRS>
<STATUS><CODE>0</CODE><SEVERITY>INFO</SEVERITY></STATUS>
<DTSERVER>${dtNow}</DTSERVER>
<LANGUAGE>ENG</LANGUAGE>
</SONRS>
</SIGNONMSGSRSV1>
<BANKMSGSRSV1>
<STMTTRNRS>
<TRNUID>1001</TRNUID>
<STATUS><CODE>0</CODE><SEVERITY>INFO</SEVERITY></STATUS>
<STMTRS>
<CURDEF>INR</CURDEF>
<BANKACCTFROM>
<BANKID>IN</BANKID>
<ACCTID>${accountId}</ACCTID>
<ACCTTYPE>CHECKING</ACCTTYPE>
</BANKACCTFROM>
<BANKTRANLIST>
<DTSTART>${dtNow}</DTSTART>
<DTEND>${dtNow}</DTEND>
${txnXml}
</BANKTRANLIST>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>`;
}

/** QFX (Quicken Financial Exchange — OFX 1.02 variant) */
export function transactionsToQFX(transactions: Transaction[], accountId = "0000000000"): string {
  // QFX is virtually identical to OFX 1.02; Quicken identifies it by file extension
  return transactionsToOFX(transactions, accountId);
}

/** Google Sheets — identical CSV, Google Sheets auto-imports on open */
export function transactionsToGoogleSheets(transactions: Transaction[]): string {
  return transactionsToCSV(transactions);
}

function formatOFXDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  );
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
