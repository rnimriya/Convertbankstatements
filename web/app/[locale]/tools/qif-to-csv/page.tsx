import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qif-to-csv";

export const metadata: Metadata = {
  title: "QIF to CSV Converter — Free | Convert Statement",
  description: "Rescue legacy Quicken QIF data into a clean CSV spreadsheet — one row per transaction — that any modern tool can read. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QIF to CSV Converter — Free",
    description: "Upload a QIF file and download it as CSV — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a QIF file to CSV?",
    a: "Upload the .qif above and press Convert to CSV. Every QIF record becomes one spreadsheet row with its date, description and amount. Fully free, no account.",
  },
  {
    q: "What is a QIF file?",
    a: "QIF is Quicken Interchange Format, Quicken's legacy plain-text format: one record per transaction, each record ended by a line containing only a caret (^). Intuit discontinued QIF imports in favour of QFX in the mid-2000s, but the files live on.",
  },
  {
    q: "Are amounts changed during conversion?",
    a: "No. Amounts are copied exactly as recorded in the QIF, with no currency conversion.",
  },
  {
    q: "My QIF is very old — will it still convert?",
    a: "QIF's plain-text structure barely changed across its life, so old files parse the same way as newer ones. If a file was hand-edited or truncated, some records may be incomplete — converting shows you exactly what is readable.",
  },
  {
    q: "Can I get the data into QuickBooks afterwards?",
    a: "Yes — convert the same QIF with the QIF to QBO converter for a direct Web Connect file, or take this CSV into the CSV to QBO converter. Either way the legacy data lands in QuickBooks.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the CSV and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Get your QIF file", body: "Use the .qif file you already have, or export a fresh one from the bank or app that produced it." },
  { title: "Upload it here", body: "Drop the QIF file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to CSV", body: "Press Convert to CSV. The transactions are read and rebuilt in CSV format, with amounts copied exactly." },
  { title: "Download the CSV file", body: "Save the converted file — fully free — and open or import it wherever you need the CSV version." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QifToCsvPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QIF to CSV Converter"
      subtitle="Rescue legacy Quicken QIF data into a clean CSV spreadsheet — one row per transaction — that any modern tool can read. Fully free with no account."
      tool={<FormatConverter tool="qif-to-csv" fromLabel="QIF" toLabel="CSV" accept=".qif" outputExt="csv" />}
      currentPath="/tools/qif-to-csv"
      faqs={FAQS}
      howToName="How to convert QIF to CSV"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why convert a QIF to CSV?</h2>
          <p className={P}>
            QIF files are where old financial history goes to be stranded. QIF is Quicken's legacy plain-text format — records separated by ^ lines — and while it was once the standard hand-off, modern apps largely stopped reading it: Intuit itself discontinued QIF imports in favour of QFX in the mid-2000s. Years of transactions can sit in a format nothing current will open.
          </p>
          <p className={P}>
            Converting to CSV rescues that history into the most durable shape there is: one row per transaction, readable by every spreadsheet and importer you are likely to meet next.
          </p>
          <h2 className={H2M}>What the conversion does</h2>
          <p className={P}>
            The converter parses the QIF records and writes each transaction out as a CSV row with its date, description and amount. Amounts are copied exactly, with no currency conversion and no cleanup of the original wording.
          </p>
          <p className={P}>
            QIF carries no bank identity and no transaction IDs, so there is nothing of that kind to preserve — the value in the file is the transaction list, and that crosses over complete. From CSV, the data can go almost anywhere modern.
          </p>
          <h2 className={H2M}>Format notes and where the CSV goes next</h2>
          <p className={P}>
            The most valuable next step for rescued Quicken data is often QuickBooks: the <a href="/tools/qif-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to QBO converter</a> takes the same QIF straight into Web Connect form. For a formatted workbook instead of plain CSV, the <a href="/tools/qif-to-excel" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to Excel converter</a> produces the same rows as an .xlsx file.
          </p>
          <p className={P}>
            Going back is possible too — the <a href="/tools/csv-to-qif" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QIF converter</a> rebuilds QIF records from a spreadsheet — though for most rescued data the journey is one-way, out of the legacy format for good.
          </p>
        </>
      }
    />
  );
}
