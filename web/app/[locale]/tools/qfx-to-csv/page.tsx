import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qfx-to-csv";

export const metadata: Metadata = {
  title: "QFX to CSV Converter — Free | Convert Statement",
  description: "Turn a Quicken QFX download into a clean CSV spreadsheet — one row per transaction — for review, sharing or moving away from Quicken. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QFX to CSV Converter — Free",
    description: "Upload a QFX file and download it as CSV — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a QFX file to CSV?",
    a: "Upload the .qfx above and press Convert to CSV. Every transaction becomes one spreadsheet row with its date, description and amount. Fully free, no account.",
  },
  {
    q: "What is a QFX file?",
    a: "QFX is Quicken's variant of OFX — the standard format banks export — identical in structure plus an Intuit institution ID (INTU.BID) that ties the file to a bank in Quicken.",
  },
  {
    q: "Are amounts changed during conversion?",
    a: "No. Amounts are copied exactly as they appear in the QFX, with no currency conversion.",
  },
  {
    q: "CSV or Excel — which should I choose?",
    a: "Choose CSV for importing into other software; choose Excel, via the QFX to Excel converter, when a person will read, sort or annotate the file, since it opens formatted and ready.",
  },
  {
    q: "Can I convert the CSV back to QFX?",
    a: "Yes — the CSV to QFX converter rebuilds a Quicken file from a spreadsheet. Note a rebuilt file cannot recover bank identity the original QFX carried, because a CSV does not hold it.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the CSV and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Get your QFX file", body: "Use the .qfx file you already have, or export a fresh one from the bank or app that produced it." },
  { title: "Upload it here", body: "Drop the QFX file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to CSV", body: "Press Convert to CSV. The transactions are read and rebuilt in CSV format, with amounts copied exactly." },
  { title: "Download the CSV file", body: "Save the converted file — fully free — and open or import it wherever you need the CSV version." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QfxToCsvPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QFX to CSV Converter"
      subtitle="Turn a Quicken QFX download into a clean CSV spreadsheet — one row per transaction — for review, sharing or moving away from Quicken. Fully free with no account."
      tool={<FormatConverter tool="qfx-to-csv" fromLabel="QFX" toLabel="CSV" accept=".qfx" outputExt="csv" />}
      currentPath="/tools/qfx-to-csv"
      faqs={FAQS}
      howToName="How to convert QFX to CSV"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why convert a QFX to CSV?</h2>
          <p className={P}>
            A QFX file speaks to Quicken and almost nothing else. The moment you need the same transactions somewhere a spreadsheet belongs — a review with your accountant, an import into a different finance app, a migration away from Quicken altogether — the Quicken wrapping becomes the obstacle.
          </p>
          <p className={P}>
            Converting to CSV strips the wrapping and keeps the substance: one row per transaction with its date, description and amount, in the most portable data shape there is.
          </p>
          <h2 className={H2M}>What the conversion does</h2>
          <p className={P}>
            The converter reads the transaction list inside the QFX — QFX is Quicken's variant of OFX, so the structure underneath is the familiar one — and writes each transaction out as a CSV row. Amounts are copied exactly, with no currency conversion.
          </p>
          <p className={P}>
            Bank identity and institution IDs belong to the Quicken hand-off, not to a spreadsheet, so they stay behind. What crosses over is the transaction data itself, complete and in file order.
          </p>
          <h2 className={H2M}>Format notes and where the CSV goes next</h2>
          <p className={P}>
            Prefer a formatted workbook over plain text? The <a href="/tools/qfx-to-excel" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to Excel converter</a> produces the same rows as an Excel file that opens ready to sort and annotate. For the plain-text route in reverse, the <a href="/tools/csv-to-qfx" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QFX converter</a> rebuilds a QFX from a spreadsheet.
          </p>
          <p className={P}>
            If the destination is QuickBooks rather than a spreadsheet, skip CSV entirely: the <a href="/tools/qfx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to QBO converter</a> moves the download straight into Web Connect form, keeping the bank identity a spreadsheet would drop.
          </p>
        </>
      }
    />
  );
}
