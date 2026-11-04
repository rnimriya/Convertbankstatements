import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qif-to-pdf";

export const metadata: Metadata = {
  title: "QIF to PDF Converter — Free | Convert Statement",
  description: "Render legacy Quicken QIF data as a readable, printable PDF statement — so old history can be archived and shared in a fixed form. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QIF to PDF Converter — Free",
    description: "Upload a QIF file and download it as PDF — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a QIF file to PDF?",
    a: "Upload the .qif above and press Convert to PDF. Its transactions are rendered as a readable statement document you can save, print or share. Fully free, no account.",
  },
  {
    q: "Can the PDF be imported back into software?",
    a: "No. A PDF is a readable, printable document for records and sharing, not an import format. Keep the original QIF for anything that needs the data itself.",
  },
  {
    q: "What appears in the PDF?",
    a: "The transactions themselves — date, description and amount for each QIF record — in statement form. QIF files carry no closing balance, so none is shown; one is never invented.",
  },
  {
    q: "Are amounts changed during conversion?",
    a: "No. Amounts are copied exactly as recorded in the QIF, with no currency conversion.",
  },
  {
    q: "What is a QIF file?",
    a: "QIF is Quicken Interchange Format, Quicken's legacy plain-text format: one record per transaction, each ended by a ^ line. Intuit discontinued QIF imports in favour of QFX in the mid-2000s, but countless history files remain in the format.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the PDF and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Get your QIF file", body: "Use the .qif file you already have, or export a fresh one from the bank or app that produced it." },
  { title: "Upload it here", body: "Drop the QIF file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to PDF", body: "Press Convert to PDF. The transactions are read and rebuilt in PDF format, with amounts copied exactly." },
  { title: "Download the PDF file", body: "Save the converted file — fully free — and open or import it wherever you need the PDF version." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QifToPdfPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QIF to PDF Converter"
      subtitle="Render legacy Quicken QIF data as a readable, printable PDF statement — so old history can be archived and shared in a fixed form. Fully free with no account."
      tool={<FormatConverter tool="qif-to-pdf" fromLabel="QIF" toLabel="PDF" accept=".qif" outputExt="pdf" />}
      currentPath="/tools/qif-to-pdf"
      faqs={FAQS}
      howToName="How to convert QIF to PDF"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why convert a QIF to PDF?</h2>
          <p className={P}>
            Old QIF files hold history that people periodically need to see: the year a loan started, the early transactions of a long-running account, records an auditor or a family member asks about. But QIF is legacy plain text — records separated by ^ lines — and handing someone the raw file answers nothing.
          </p>
          <p className={P}>
            A PDF turns that legacy data into a fixed, readable statement: printable, emailable, and identical on every screen. It is the archiving step that lets old history be filed away in a form anyone can open — for records and sharing, not for importing back into accounting software.
          </p>
          <h2 className={H2M}>What the conversion does</h2>
          <p className={P}>
            The converter parses the QIF records and renders each transaction as a statement line with its date, description and amount, copied exactly — no currency conversion, nothing reworded or tidied.
          </p>
          <p className={P}>
            QIF carries no closing balance, and the PDF shows none rather than inventing one. What the legacy file recorded is what the document presents — the honest rendering of a format that kept only transactions, presented so people can finally read them comfortably.
          </p>
          <h2 className={H2M}>Format notes and where to go next</h2>
          <p className={P}>
            Keep the original QIF with the PDF. The PDF is the readable copy; the QIF is still the data — it converts onward to a spreadsheet via the <a href="/tools/qif-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to CSV converter</a> or the <a href="/tools/qif-to-excel" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to Excel converter</a>, and forward into QuickBooks via the <a href="/tools/qif-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to QBO converter</a>.
          </p>
          <p className={P}>
            That pairing — fixed document plus original data file — is the sound way to archive any statement format, and it matters most for legacy files, where the QIF may be the only surviving copy of the period it covers.
          </p>
        </>
      }
    />
  );
}
