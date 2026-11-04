import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qbo-to-pdf";

export const metadata: Metadata = {
  title: "QBO to PDF Converter — Free | Convert Statement",
  description: "Render a QuickBooks QBO file as a readable, printable PDF statement — the copy you can send a client or file away. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QBO to PDF Converter — Free",
    description: "Upload a QBO file and download it as PDF — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a QBO file to PDF?",
    a: "Upload the .qbo above and press Convert to PDF. Its transactions are rendered as a readable statement document you can save, print or send. Fully free, no account.",
  },
  {
    q: "Can the PDF be imported into QuickBooks?",
    a: "No. A PDF is a readable, printable document for records and sharing, not an import format. Keep the original QBO for importing into QuickBooks.",
  },
  {
    q: "What appears in the PDF?",
    a: "The transactions themselves — date, description and amount — in statement form. If the QBO carries a closing balance it is carried over; otherwise none is shown, because one is never invented.",
  },
  {
    q: "Are amounts changed during conversion?",
    a: "No. Amounts are copied exactly as they appear in the QBO, with no currency conversion.",
  },
  {
    q: "Why not just open the QBO to read it?",
    a: "A QBO is an OFX document full of nested tags — the transactions are in there, but wrapped in markup meant for software. The PDF unwraps them into lines a person can read at a glance.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the PDF and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Get your QBO file", body: "Use the .qbo file you already have, or export a fresh one from the bank or app that produced it." },
  { title: "Upload it here", body: "Drop the QBO file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to PDF", body: "Press Convert to PDF. The transactions are read and rebuilt in PDF format, with amounts copied exactly." },
  { title: "Download the PDF file", body: "Save the converted file — fully free — and open or import it wherever you need the PDF version." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QboToPdfPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QBO to PDF Converter"
      subtitle="Render a QuickBooks QBO file as a readable, printable PDF statement — the copy you can send a client or file away. Fully free with no account."
      tool={<FormatConverter tool="qbo-to-pdf" fromLabel="QBO" toLabel="PDF" accept=".qbo" outputExt="pdf" />}
      currentPath="/tools/qbo-to-pdf"
      faqs={FAQS}
      howToName="How to convert QBO to PDF"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why convert a QBO to PDF?</h2>
          <p className={P}>
            A QBO file is markup written for QuickBooks — open one and you see tags, not a statement. That is fine for importing and useless for everything human around the import: sending a client the statement their file came from, attaching activity to an email, printing a period for a paper file.
          </p>
          <p className={P}>
            This converter renders the transactions inside the QBO as a clean PDF document instead. The PDF is for records and sharing, not for importing back into accounting software — the QBO stays your importable original, and the PDF becomes the readable copy.
          </p>
          <h2 className={H2M}>What the conversion does</h2>
          <p className={P}>
            Every transaction in the QBO becomes a line in the PDF with its date, description and amount, copied exactly — a QBO is OFX 1.02 underneath, and the converter reads that transaction list and lays it out in statement form. No currency conversion, no reworded descriptions.
          </p>
          <p className={P}>
            If the source file carries a closing balance, it is carried over into the document; if it does not, none is shown. The converter never invents a balance — the PDF says what the bank's file said, in a shape people can read.
          </p>
          <h2 className={H2M}>Format notes and where to go next</h2>
          <p className={P}>
            Treat the pair as source and copy. The QBO still imports into QuickBooks exactly as before, and if you need its data rather than a document, the <a href="/tools/qbo-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to CSV converter</a> lays the same transactions out as spreadsheet rows. Before importing any QBO that matters, the <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a> verifies its structure without changing it.
          </p>
          <p className={P}>
            The sibling renderers cover the rest of the family: the <a href="/tools/ofx-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to PDF converter</a> for bank OFX files and the <a href="/tools/qfx-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to PDF converter</a> for Quicken downloads.
          </p>
        </>
      }
    />
  );
}
