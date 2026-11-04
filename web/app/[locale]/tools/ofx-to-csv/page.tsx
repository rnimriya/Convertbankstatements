import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/ofx-to-csv";

export const metadata: Metadata = {
  title: "OFX to CSV Converter — Free | Convert Statement",
  description: "Turn a bank OFX file into a clean CSV spreadsheet — one row per transaction with dates, descriptions and amounts — for review, sharing or migration. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "OFX to CSV Converter — Free",
    description: "Upload a OFX file and download it as CSV — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert an OFX file to CSV?",
    a: "Upload the .ofx above and press Convert to CSV. Every transaction becomes one row with its date, description and amount. Fully free, no account.",
  },
  {
    q: "What columns does the CSV have?",
    a: "The spreadsheet holds the transactions themselves — date, description and amount, one row per transaction — the plain shape spreadsheets and other importers expect.",
  },
  {
    q: "Are amounts changed during conversion?",
    a: "No. Amounts are copied exactly as they appear in the OFX, with no currency conversion and no rounding beyond the file itself.",
  },
  {
    q: "Can this converter read QBO or QFX files too?",
    a: "This page converts OFX files. Its close relatives have their own converters: QBO to CSV for Web Connect files and QFX to CSV for Quicken downloads — all three formats are one OFX family, so the spreadsheets they produce match in shape.",
  },
  {
    q: "What if my OFX file will not convert?",
    a: "Usually the download was truncated, or the file is not really OFX — a PDF renamed to .ofx is the classic case. Re-download the OFX from your bank; if a genuine OFX still fails, the QBO File Checker can name the structural problem.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the CSV and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Get your OFX file", body: "Use the .ofx file you already have, or export a fresh one from the bank or app that produced it." },
  { title: "Upload it here", body: "Drop the OFX file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to CSV", body: "Press Convert to CSV. The transactions are read and rebuilt in CSV format, with amounts copied exactly." },
  { title: "Download the CSV file", body: "Save the converted file — fully free — and open or import it wherever you need the CSV version." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function OfxToCsvPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="OFX to CSV Converter"
      subtitle="Turn a bank OFX file into a clean CSV spreadsheet — one row per transaction with dates, descriptions and amounts — for review, sharing or migration. Fully free with no account."
      tool={<FormatConverter tool="ofx-to-csv" fromLabel="OFX" toLabel="CSV" accept=".ofx" outputExt="csv" />}
      currentPath="/tools/ofx-to-csv"
      faqs={FAQS}
      howToName="How to convert OFX to CSV"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why convert an OFX to CSV?</h2>
          <p className={P}>
            OFX — Open Financial Exchange — is the standard format banks export for software, which makes it excellent for machines and awkward for people. Open an OFX file and you see nested markup; ask a colleague to review it, load it into a tool that never heard of OFX, or sort it by amount, and the format is in the way.
          </p>
          <p className={P}>
            Converting it to CSV keeps every transaction and removes the wrapping problem: one row per transaction, in a file that every spreadsheet, database and importer on earth can open.
          </p>
          <h2 className={H2M}>What the conversion does</h2>
          <p className={P}>
            The converter reads the OFX transaction list and writes one CSV row per transaction with its date, description and amount. Amounts are copied exactly — no currency conversion — and the transactions themselves are the whole output, in the order the file presents them.
          </p>
          <p className={P}>
            Spreadsheet-bound conversions like this one are also the quickest sanity check on a bank file: totals in a spreadsheet either match the statement or they visibly do not. If the OFX itself looks damaged, the <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a> diagnoses OFX-family files without changing a byte.
          </p>
          <h2 className={H2M}>Format notes and where the CSV goes next</h2>
          <p className={P}>
            OFX sits underneath its better-known relatives: QBO files are OFX 1.02 underneath, and QFX is Quicken's variant of the same structure. That is why one OFX file can fan out in several directions — to QuickBooks via the <a href="/tools/ofx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QBO converter</a>, or to Quicken's variant via the <a href="/tools/ofx-to-qfx" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QFX converter</a>.
          </p>
          <p className={P}>
            Need the reverse trip later? The <a href="/tools/csv-to-ofx" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to OFX converter</a> rebuilds an OFX from a spreadsheet. And for a readable document rather than data, the <a href="/tools/ofx-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to PDF converter</a> turns the same file into a printable statement.
          </p>
        </>
      }
    />
  );
}
