import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qfx-to-pdf";

export const metadata: Metadata = {
  title: "QFX to PDF Converter — Free | Convert Statement",
  description: "Render a Quicken QFX download as a readable, printable PDF statement — for records, sharing and expense sign-off. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QFX to PDF Converter — Free",
    description: "Upload a QFX file and download it as PDF — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a QFX file to PDF?",
    a: "Upload the .qfx above and press Convert to PDF. The download's transactions are rendered as a readable statement you can save, print or share. Fully free, no account.",
  },
  {
    q: "Can the PDF be imported into Quicken or QuickBooks?",
    a: "No. A PDF is a readable, printable document for records and sharing, not an import format. Keep the original QFX for anything that needs the data.",
  },
  {
    q: "What appears in the PDF?",
    a: "The transactions themselves — date, description and amount — in statement form. If the QFX carries a closing balance it is carried over; otherwise none is shown, because one is never invented.",
  },
  {
    q: "Are amounts changed during conversion?",
    a: "No. Amounts are copied exactly as they appear in the QFX, with no currency conversion.",
  },
  {
    q: "What is a QFX file?",
    a: "QFX is Quicken's variant of OFX, the standard format banks export — identical in structure plus an Intuit institution ID (INTU.BID) tying the file to a bank in Quicken.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the PDF and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Get your QFX file", body: "Use the .qfx file you already have, or export a fresh one from the bank or app that produced it." },
  { title: "Upload it here", body: "Drop the QFX file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to PDF", body: "Press Convert to PDF. The transactions are read and rebuilt in PDF format, with amounts copied exactly." },
  { title: "Download the PDF file", body: "Save the converted file — fully free — and open or import it wherever you need the PDF version." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QfxToPdfPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QFX to PDF Converter"
      subtitle="Render a Quicken QFX download as a readable, printable PDF statement — for records, sharing and expense sign-off. Fully free with no account."
      tool={<FormatConverter tool="qfx-to-pdf" fromLabel="QFX" toLabel="PDF" accept=".qfx" outputExt="pdf" />}
      currentPath="/tools/qfx-to-pdf"
      faqs={FAQS}
      howToName="How to convert QFX to PDF"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why convert a QFX to PDF?</h2>
          <p className={P}>
            A QFX download is a data file for Quicken, not a document for people. When a Quicken statement needs to leave Quicken — printed for a paper file, attached to an expense claim, sent to someone who has never opened the app — it needs to become a readable statement, and PDF is the format that stays fixed and printable everywhere.
          </p>
          <p className={P}>
            This converter renders the transactions inside the QFX as that document. A PDF is for records and sharing, not for importing back into accounting software; the QFX remains your data file, and the PDF is its presentable copy.
          </p>
          <h2 className={H2M}>What the conversion does</h2>
          <p className={P}>
            QFX is Quicken's variant of OFX, and the converter reads its transaction list and lays each transaction out as a statement line — date, description and amount, copied exactly with no currency conversion.
          </p>
          <p className={P}>
            If the source file carries a closing balance, it is carried over into the document; if it does not, none is shown. The converter never invents a balance, so the printed statement says exactly what the bank's file said.
          </p>
          <h2 className={H2M}>Format notes and where to go next</h2>
          <p className={P}>
            Keep the QFX beside the PDF. The PDF circulates; the QFX still converts onward — to a spreadsheet via the <a href="/tools/qfx-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to CSV converter</a> or the <a href="/tools/qfx-to-excel" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to Excel converter</a>, and into QuickBooks via the <a href="/tools/qfx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to QBO converter</a>.
          </p>
          <p className={P}>
            The same rendering exists for the rest of the family: the <a href="/tools/ofx-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to PDF converter</a> for bank OFX files and the <a href="/tools/qbo-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to PDF converter</a> for QuickBooks Web Connect files.
          </p>
        </>
      }
    />
  );
}
