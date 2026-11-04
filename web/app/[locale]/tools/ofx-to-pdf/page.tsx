import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/ofx-to-pdf";

export const metadata: Metadata = {
  title: "OFX to PDF Converter — Free | Convert Statement",
  description: "Turn a bank OFX file into a readable, printable PDF statement — for records, sharing and sign-off, not for importing. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "OFX to PDF Converter — Free",
    description: "Upload a OFX file and download it as PDF — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert an OFX file to PDF?",
    a: "Upload the .ofx above and press Convert to PDF. The transactions are laid out as a readable statement document you can save, print or share. Fully free, no account.",
  },
  {
    q: "Can I import the PDF back into accounting software?",
    a: "No — and that is by design. A PDF is a readable, printable document for records and sharing, not an import format. Keep your original OFX for importing; use the PDF for people.",
  },
  {
    q: "What appears in the PDF?",
    a: "The transactions themselves — date, description and amount for each — rendered as a statement. If the source file carries a closing balance it is carried over; otherwise none is shown, because the converter never invents one.",
  },
  {
    q: "Are amounts changed during conversion?",
    a: "No. Amounts are copied exactly as they appear in the OFX, with no currency conversion.",
  },
  {
    q: "Is a PDF statement acceptable for records?",
    a: "A PDF preserves the statement in a fixed, printable form that reads identically everywhere, which is why it suits archiving and sharing. Keep the original OFX alongside it as the importable source file.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the PDF and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Get your OFX file", body: "Use the .ofx file you already have, or export a fresh one from the bank or app that produced it." },
  { title: "Upload it here", body: "Drop the OFX file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to PDF", body: "Press Convert to PDF. The transactions are read and rebuilt in PDF format, with amounts copied exactly." },
  { title: "Download the PDF file", body: "Save the converted file — fully free — and open or import it wherever you need the PDF version." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function OfxToPdfPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="OFX to PDF Converter"
      subtitle="Turn a bank OFX file into a readable, printable PDF statement — for records, sharing and sign-off, not for importing. Fully free with no account."
      tool={<FormatConverter tool="ofx-to-pdf" fromLabel="OFX" toLabel="PDF" accept=".ofx" outputExt="pdf" />}
      currentPath="/tools/ofx-to-pdf"
      faqs={FAQS}
      howToName="How to convert OFX to PDF"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why convert an OFX to PDF?</h2>
          <p className={P}>
            OFX is built for software; people who need to see a statement — a client, a manager approving expenses, your own year-end file — need a document. A PDF is the archiving and sharing format: it prints cleanly, attaches to email, and reads the same on every device, years from now.
          </p>
          <p className={P}>
            This converter lays the transactions inside your OFX out as that document. Be clear about the trade: a PDF is for records and sharing, not for importing back into accounting software. The data journey ends at the page, on purpose — that permanence is what makes it good evidence.
          </p>
          <h2 className={H2M}>What the conversion does</h2>
          <p className={P}>
            Every transaction in the OFX becomes a line in the PDF with its date, description and amount, copied exactly — no currency conversion, nothing reworded. The document is a faithful rendering of the file's transaction list in statement form.
          </p>
          <p className={P}>
            If the source OFX carries a closing balance, it is carried over into the document; if it does not, none is shown — the converter never invents a balance to make the page look complete. What the bank's file said is what the PDF says.
          </p>
          <h2 className={H2M}>Format notes and where to go next</h2>
          <p className={P}>
            Keep both files. The OFX remains your importable original — it can still go to QuickBooks via the <a href="/tools/ofx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QBO converter</a> or to a spreadsheet via the <a href="/tools/ofx-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to CSV converter</a> — while the PDF becomes the copy you circulate. Data in one, document in the other.
          </p>
          <p className={P}>
            The same treatment exists for the other members of the family: the <a href="/tools/qbo-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to PDF converter</a> renders a QuickBooks Web Connect file, and the <a href="/tools/qfx-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to PDF converter</a> renders a Quicken download, each as a printable statement.
          </p>
        </>
      }
    />
  );
}
