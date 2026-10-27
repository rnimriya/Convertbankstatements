import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { CsvToQbo } from "@/components/tools/CsvToQbo";

const PAGE_URL = "https://www.convertstatement.online/tools/csv-to-qbo";

export const metadata: Metadata = {
  title: "CSV to QBO Converter — Free Bank CSV to QuickBooks | Convert Statement",
  description:
    "Free CSV to QBO converter: turn any bank transaction CSV into a QuickBooks-ready QBO file with a column-mapping step, a balance-chain check, and unique transaction IDs. Scan and CSV export are free with no account; QBO download is on Pro.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "CSV to QBO Converter — Bank CSV to QuickBooks",
    description:
      "Upload a bank CSV, map its columns, and get a QuickBooks-ready QBO file with a balance check. Free to scan.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a CSV file to QBO for QuickBooks?",
    a: "Upload your bank's CSV export, check the auto-detected column mapping (date, payee, and either a signed amount column or a debit/credit pair), and download the result. The CSV export is free; the QBO file is available on the Pro plan. Import the QBO through QuickBooks' bank-feed import, and QuickBooks matches it against your account.",
  },
  {
    q: "What if my CSV uses debit and credit columns instead of one amount column?",
    a: "Map both columns. Debit rows (money out) become negative amounts and credit rows (money in) stay positive, which is the sign convention QuickBooks expects. A row that fills neither side is skipped and counted in the warnings so you can check it.",
  },
  {
    q: "Why does the tool check the running-balance chain?",
    a: "If your CSV carries a running-balance column, the tool verifies that each balance equals the previous balance plus the transaction. A break means the export is missing a row or has a wrong amount — importing it would leave your QuickBooks reconciliation off by exactly that amount, so the break is flagged before you import.",
  },
  {
    q: "Will re-importing the same file create duplicates in QuickBooks?",
    a: "No. Every row gets a unique transaction ID derived from its own date, payee, and amount, so QuickBooks recognizes a re-imported row as already imported. If you are unsure, run the file through the QBO Duplicate Finder first — it flags repeated IDs before they reach your books.",
  },
  {
    q: "Which CSV exports does this work with?",
    a: "Any export with a header row and date, description, and amount columns — most US banks (Chase, Wells Fargo, Bank of America, Citi, Capital One, and others) export this shape. If your bank's headers differ, the mapping step lets you point each field at the right column.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "No. Your CSV is processed in memory to build the conversion and is not stored afterwards. We never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Export from your bank", body: "Download your transactions as a CSV from your bank's website — any export with date, description, and amount columns works." },
  { title: "Upload it here", body: "Drop the CSV in. The tool auto-detects the column mapping from your header row." },
  { title: "Check the mapping", body: "Confirm the date, payee, and amount (or debit/credit) columns are right, and review the balance-chain check." },
  { title: "Download and import", body: "Download the CSV free, or the QBO on Pro, and import it into QuickBooks through the bank-feed import." },
];

export default function CsvToQboPage() {
  return (
    <ToolPageLayout
      eyebrow="Free Tool"
      title="CSV to QBO Converter"
      subtitle="Turn any bank transaction CSV into a QuickBooks-ready QBO file: map your columns, check the balance chain, and import without duplicates."
      tool={<CsvToQbo />}
      currentPath="/tools/csv-to-qbo"
      faqs={FAQS}
      howToName="How to convert a CSV to QBO"
      howToSteps={HOWTO}
      privacyLine="No account needed to scan · Processed in memory, never stored"
      content={
        <>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Why a plain CSV import goes wrong</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            QuickBooks Online's own CSV import is picky about column order, signs, and dates, and
            it has no way to tell you that the file itself is broken. A missing row, a flipped
            sign, or a debit/credit pair read backwards all import silently — and surface weeks
            later as a reconciliation difference nobody can explain. This converter fixes the
            file before it reaches QuickBooks: it normalizes dates and signs, verifies the
            running-balance chain when your export carries balances, and gives every row a
            unique transaction ID so a re-import cannot duplicate your books.
          </p>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-12">What this tool handles</h2>
          <ul className="mt-4 space-y-2.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <li><strong className="text-zinc-900 dark:text-white">Column mapping</strong> — auto-detected from your headers, editable when your bank names things differently.</li>
            <li><strong className="text-zinc-900 dark:text-white">Signed amounts or debit/credit pairs</strong> — both conventions are understood, with the sign QuickBooks expects.</li>
            <li><strong className="text-zinc-900 dark:text-white">Balance-chain check</strong> — when a balance column is present, every step of the chain is verified.</li>
            <li><strong className="text-zinc-900 dark:text-white">Duplicate-proof IDs</strong> — each row's transaction ID is derived from the row itself.</li>
          </ul>
          <p className="mt-5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Converting a PDF statement instead? Use the{" "}
            <a href="/quickbooks" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">QuickBooks reconciliation converter</a>.
            {" "}Already have a QBO that QuickBooks refuses? The{" "}
            <a href="/tools/qbo-import-errors" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">QBO import-error decoder</a>{" "}
            explains each error and its fix, and the{" "}
            <a href="/tools/free-qbo-cleanup-checker" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">QBO Duplicate Finder</a>{" "}
            checks any file before you import it.
          </p>
        </>
      }
    />
  );
}
