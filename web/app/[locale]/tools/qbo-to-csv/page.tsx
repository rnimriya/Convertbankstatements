import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { QboToCsv } from "@/components/tools/QboToCsv";

const PAGE_URL = "https://www.convertstatement.online/tools/qbo-to-csv";

export const metadata: Metadata = {
  title: "QBO to CSV Converter — Free QBO / OFX to CSV & Excel | Convert Statement",
  description:
    "Free QBO to CSV converter: turn a QuickBooks Web Connect (.qbo), OFX or QFX file into a clean CSV or Excel spreadsheet with dates, descriptions, amounts and transaction IDs. Fully free, no account, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QBO to CSV Converter — QBO / OFX to CSV & Excel",
    description:
      "Upload a QBO, OFX or QFX file and download its transactions as CSV or Excel. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a QBO file to CSV?",
    a: "Upload the .qbo file here. The tool reads the transactions inside it — date, type, description, amount, and the transaction ID (FITID) — and shows a preview with your totals. Download the CSV or the Excel file, both fully free with no account.",
  },
  {
    q: "Can I also convert OFX or QFX files?",
    a: "Yes. A QBO file is OFX format underneath, so the same converter reads .ofx files from banks and .qfx files from Quicken. All three produce the same spreadsheet: Date, Type, Description, Amount, Transaction ID.",
  },
  {
    q: "Why would I convert a QBO to a spreadsheet?",
    a: "Spreadsheets are easier to review, sort, filter, and share than a Web Connect file. Accountants convert QBO files to CSV or Excel to check transactions before importing, to send a client a readable copy, or to load the data into another system that does not read QBO.",
  },
  {
    q: "Are the amounts changed during conversion?",
    a: "No. Amounts are copied exactly as they appear in your file — credits stay positive and debits stay negative, which is the sign convention QuickBooks and spreadsheets both use. The summary on the result screen shows money in, money out, and the net change so you can tie the spreadsheet back to the file.",
  },
  {
    q: "What does the Transaction ID column contain?",
    a: "It is the FITID from your file — the unique ID QuickBooks uses to detect duplicates. Keeping it in the spreadsheet makes it possible to trace any row back to the exact transaction in the original file. Rows whose file had no FITID are left blank in that column.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the conversion and is not stored afterwards. We never sell or share your financial data, and both downloads are free with no account.",
  },
];

const HOWTO = [
  { title: "Get your QBO file", body: "Download the .qbo, .ofx, or .qfx file from your bank, or use one you already have on your computer." },
  { title: "Upload it here", body: "Drop the file in. The tool reads its transactions and shows the statement period and totals." },
  { title: "Check the preview", body: "Review the first 50 rows and the money-in, money-out, and net totals, plus any warnings about the file itself." },
  { title: "Download CSV or Excel", body: "Save the spreadsheet — both downloads are fully free, with every row from the file included." },
];

export default function QboToCsvPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QBO to CSV Converter"
      subtitle="Turn a QuickBooks QBO, OFX, or QFX file into a clean CSV or Excel spreadsheet — dates, descriptions, amounts, and transaction IDs, fully free with no account."
      tool={<QboToCsv />}
      currentPath="/tools/qbo-to-csv"
      faqs={FAQS}
      howToName="How to convert a QBO to CSV"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Why convert a QBO file at all?</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            A QBO file is built for one job: feeding transactions into QuickBooks. It is not
            built for reading. When a client, a colleague, or another piece of software needs
            those transactions, a spreadsheet is the format everyone can open. This converter
            reads the OFX data inside the file and lays it out as five plain columns — Date,
            Type, Description, Amount, and Transaction ID — with the totals shown up front so
            you can confirm nothing was lost on the way out.
          </p>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-12">What this tool handles</h2>
          <ul className="mt-4 space-y-2.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <li><strong className="text-zinc-900 dark:text-white">QBO, OFX, and QFX</strong> — all three are the same OFX format underneath, so one converter covers bank and Quicken exports too.</li>
            <li><strong className="text-zinc-900 dark:text-white">CSV and Excel downloads</strong> — both fully free, with every transaction from the file, not just the preview.</li>
            <li><strong className="text-zinc-900 dark:text-white">Totals that tie out</strong> — money in, money out, net change, and the file's ledger balance are shown before you download.</li>
            <li><strong className="text-zinc-900 dark:text-white">File warnings included</strong> — if the file itself has problems (a missing closing balance, repeated transaction IDs), they are listed so you know before the data is used elsewhere.</li>
          </ul>
          <p className="mt-5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Need the reverse direction? The{" "}
            <a href="/tools/csv-to-qbo" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">CSV to QBO converter</a>{" "}
            turns a bank CSV into a QuickBooks file. If QuickBooks rejects your file outright, run it through the{" "}
            <a href="/tools/ofx-to-qbo" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">OFX to QBO fixer</a>{" "}
            to repair the header, dates, and transaction IDs, or check it first with the{" "}
            <a href="/tools/qbo-checker" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">QBO File Checker</a>.
          </p>
        </>
      }
    />
  );
}
