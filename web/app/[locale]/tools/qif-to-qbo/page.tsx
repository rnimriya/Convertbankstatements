import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qif-to-qbo";

export const metadata: Metadata = {
  title: "QIF to QBO Converter — Free | Convert Statement",
  description: "Bring legacy Quicken QIF data forward into QuickBooks as a QBO Web Connect file — rescuing transactions modern Quicken left behind. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QIF to QBO Converter — Free",
    description: "Upload a QIF file and download it as QBO — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a QIF file to QBO?",
    a: "Upload the .qif above and press Convert to QBO. Each legacy record becomes a transaction in a Web Connect file you can import into QuickBooks. Fully free, no account.",
  },
  {
    q: "Why can QuickBooks not import QIF directly?",
    a: "QuickBooks imports QBO Web Connect files — OFX 1.02 underneath. QIF is Quicken's legacy plain-text format, which Intuit itself discontinued in favour of QFX in the mid-2000s. Converting bridges the two eras.",
  },
  {
    q: "Does the QBO include a bank ID or closing balance?",
    a: "Your QIF carries neither, and the converter never invents a bank identity or a closing balance. The converted file holds the transactions themselves; check its structure with the QBO File Checker before importing if you want a second opinion.",
  },
  {
    q: "Are amounts changed during conversion?",
    a: "No. Amounts are copied exactly as recorded in the QIF, with no currency conversion.",
  },
  {
    q: "My QIF is decades old — is it worth converting?",
    a: "That is exactly the case this tool is for. QIF's plain-text structure barely changed over its life, so old files convert like newer ones — and once in QuickBooks, that history becomes searchable, reportable data again.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the QBO and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Get your QIF file", body: "Use the .qif file you already have, or export a fresh one from the bank or app that produced it." },
  { title: "Upload it here", body: "Drop the QIF file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to QBO", body: "Press Convert to QBO. The transactions are read and rebuilt in QBO format, with amounts copied exactly." },
  { title: "Download the QBO file", body: "Save the converted file — fully free — and open or import it wherever you need the QBO version." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QifToQboPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QIF to QBO Converter"
      subtitle="Bring legacy Quicken QIF data forward into QuickBooks as a QBO Web Connect file — rescuing transactions modern Quicken left behind. Fully free with no account."
      tool={<FormatConverter tool="qif-to-qbo" fromLabel="QIF" toLabel="QBO" accept=".qif" outputExt="qbo" />}
      currentPath="/tools/qif-to-qbo"
      faqs={FAQS}
      howToName="How to convert QIF to QBO"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why convert a QIF to QBO?</h2>
          <p className={P}>
            This conversion rescues stranded history. QIF was Quicken's original interchange format, but Intuit discontinued QIF imports in favour of QFX in the mid-2000s, and QuickBooks never imported QIF at all — it takes QBO Web Connect files. Years of transactions saved as QIF therefore have no direct door into the software people use now.
          </p>
          <p className={P}>
            Converting the QIF to QBO builds that door: the legacy records become a Web Connect file — OFX 1.02 underneath, like every QBO — that QuickBooks imports the normal way, so old Quicken data can take its place in current books.
          </p>
          <h2 className={H2M}>What the conversion does</h2>
          <p className={P}>
            Each QIF record — the plain-text entries separated by ^ lines — becomes a transaction in the QBO with its date, description and amount, copied exactly with no currency conversion. The transactions themselves are what QIF kept, and they cross over complete.
          </p>
          <p className={P}>
            Be clear about what a QIF cannot give: it carries no bank identity, no institution ID and no closing balance, and the converter invents none of them. Before importing, the <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a> can verify the converted file's structure without changing it.
          </p>
          <h2 className={H2M}>Format notes and where the QBO goes next</h2>
          <p className={P}>
            Import the converted file through QuickBooks' Web Connect or bank-feed import like any bank-downloaded QBO, and review the imported period against the original QIF — which you should keep, untouched, as the source record of the rescue.
          </p>
          <p className={P}>
            Other ways out of QIF: the <a href="/tools/qif-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to CSV converter</a> and the <a href="/tools/qif-to-excel" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to Excel converter</a> lay the same records out as spreadsheets for review, and the <a href="/tools/qif-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to PDF converter</a> renders them as a printable statement for the file.
          </p>
        </>
      }
    />
  );
}
