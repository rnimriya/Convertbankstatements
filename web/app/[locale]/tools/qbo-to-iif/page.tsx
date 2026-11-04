import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qbo-to-iif";

export const metadata: Metadata = {
  title: "QBO to IIF Converter — Free | Convert Statement",
  description: "Convert a QuickBooks Web Connect (QBO) file into an IIF for QuickBooks Desktop company files — Desktop's own import format. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QBO to IIF Converter — Free",
    description: "Upload a QBO file and download it as IIF — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a QBO file to IIF?",
    a: "Upload the .qbo above and press Convert to IIF. The transactions inside are written out in QuickBooks Desktop's IIF format, ready for Desktop's IIF import. Fully free, no account.",
  },
  {
    q: "What is an IIF file?",
    a: "IIF is Intuit Interchange Format — QuickBooks Desktop's own tab-separated import format. Transactions are expressed as TRNS and SPL lines, the two sides of a double entry, which is the structure Desktop's importer expects.",
  },
  {
    q: "How do I import the IIF into QuickBooks Desktop?",
    a: "In QuickBooks Desktop, use File, then Utilities, then Import, then IIF Files, and choose the downloaded file. Back up your company file first — IIF imports cannot be undone in one step.",
  },
  {
    q: "Are amounts changed during conversion?",
    a: "No. Amounts are copied exactly as they appear in the QBO, with no currency conversion.",
  },
  {
    q: "Can I convert a spreadsheet to IIF instead?",
    a: "Yes — the CSV to IIF converter builds Desktop IIF files from bank CSV exports and asks for the Desktop account names to post against. This page starts from a QBO you already have.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the IIF and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Get your QBO file", body: "Use the .qbo file you already have, or export a fresh one from the bank or app that produced it." },
  { title: "Upload it here", body: "Drop the QBO file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to IIF", body: "Press Convert to IIF. The transactions are read and rebuilt in IIF format, with amounts copied exactly." },
  { title: "Download the IIF file", body: "Save the converted file — fully free — and open or import it wherever you need the IIF version." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QboToIifPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QBO to IIF Converter"
      subtitle="Convert a QuickBooks Web Connect (QBO) file into an IIF for QuickBooks Desktop company files — Desktop's own import format. Fully free with no account."
      tool={<FormatConverter tool="qbo-to-iif" fromLabel="QBO" toLabel="IIF" accept=".qbo" outputExt="iif" />}
      currentPath="/tools/qbo-to-iif"
      faqs={FAQS}
      howToName="How to convert QBO to IIF"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why convert a QBO to IIF?</h2>
          <p className={P}>
            QBO and IIF serve two different QuickBooks worlds. A QBO is a Web Connect file — OFX 1.02 underneath — built for bank-feed imports, while QuickBooks Desktop company files have their own native import route: IIF, Intuit Interchange Format, a tab-separated file of TRNS and SPL double-entry lines.
          </p>
          <p className={P}>
            When the transactions live in a Web Connect download but the books live in a Desktop company file, this converter carries them across: out of the OFX wrapping, into the format Desktop's IIF importer speaks.
          </p>
          <h2 className={H2M}>What the conversion does</h2>
          <p className={P}>
            The converter reads the transactions inside the QBO — date, description and amount for each — and writes them as IIF transactions in Desktop's tab-separated TRNS/SPL structure, so each entry arrives with the double-entry shape the importer expects.
          </p>
          <p className={P}>
            Amounts are copied exactly, with no currency conversion. The source QBO's bank identity belongs to the Web Connect world, so what crosses over is the transaction data itself, expressed in Desktop's own terms.
          </p>
          <h2 className={H2M}>Format notes and where the IIF goes next</h2>
          <p className={P}>
            Back up the company file before any IIF import — IIF imports cannot be undone in one step, so a backup is the standard advice before importing anything into Desktop. Review the imported transactions against your chart of accounts afterwards, as with any bulk entry.
          </p>
          <p className={P}>
            Related routes: the <a href="/tools/csv-to-iif" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to IIF converter</a> builds the same Desktop format from a spreadsheet, the <a href="/tools/iif-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">IIF to CSV converter</a> flattens an IIF back into rows for review, and the <a href="/tools/qbo-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to CSV converter</a> lays this same QBO out as a spreadsheet when you want to check it before importing anywhere.
          </p>
        </>
      }
    />
  );
}
