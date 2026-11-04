import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qif-to-excel";

export const metadata: Metadata = {
  title: "QIF to Excel Converter — Free | Convert Statement",
  description: "Turn legacy Quicken QIF data into a formatted Excel workbook — one row per transaction — for review, sharing and archiving. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QIF to Excel Converter — Free",
    description: "Upload a QIF file and download it as Excel — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a QIF file to Excel?",
    a: "Upload the .qif above and press Convert to Excel. You download an .xlsx workbook with one row per transaction — date, description and amount. Fully free, no account.",
  },
  {
    q: "What is the difference between the Excel and CSV versions?",
    a: "Same transactions, two wrappings. Excel opens formatted for a person to sort, filter and annotate; CSV is the plain-text form other software imports most reliably. The QIF to CSV converter makes that version.",
  },
  {
    q: "Are amounts changed during conversion?",
    a: "No. Amounts are copied exactly as recorded in the QIF, with no currency conversion.",
  },
  {
    q: "What is a QIF file?",
    a: "QIF is Quicken Interchange Format, Quicken's legacy plain-text format with one record per transaction, each ended by a ^ line. Many older and other apps still read and write it, even though Intuit moved Quicken to QFX in the mid-2000s.",
  },
  {
    q: "Can I edit the workbook afterwards?",
    a: "Yes — it is an ordinary spreadsheet. Edit, sort and annotate freely; keep the original QIF as the untouched source of the same history.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the workbook and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Get your QIF file", body: "Use the .qif file you already have, or export a fresh one from the bank or app that produced it." },
  { title: "Upload it here", body: "Drop the QIF file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to Excel", body: "Press Convert to Excel. The transactions are read and rebuilt in Excel format, with amounts copied exactly." },
  { title: "Download the Excel file", body: "Save the converted file — fully free — and open or import it wherever you need the Excel version." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QifToExcelPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QIF to Excel Converter"
      subtitle="Turn legacy Quicken QIF data into a formatted Excel workbook — one row per transaction — for review, sharing and archiving. Fully free with no account."
      tool={<FormatConverter tool="qif-to-excel" fromLabel="QIF" toLabel="Excel" accept=".qif" outputExt="xlsx" />}
      currentPath="/tools/qif-to-excel"
      faqs={FAQS}
      howToName="How to convert QIF to Excel"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why convert a QIF to Excel?</h2>
          <p className={P}>
            A QIF file is plain text from another era: Quicken's legacy interchange format, records separated by ^ lines, readable by eye only with patience and by modern software hardly at all since Intuit discontinued QIF imports in favour of QFX in the mid-2000s. Yet the transactions inside are often exactly what someone needs — old history, requested for a review, a dispute or a migration.
          </p>
          <p className={P}>
            An Excel workbook is the most comfortable place for a person to meet that data: formatted on open, sortable, filterable, and easy to annotate or share. This converter takes legacy QIF straight there.
          </p>
          <h2 className={H2M}>What the conversion does</h2>
          <p className={P}>
            Each QIF record becomes one row in the workbook with its date, description and amount, copied exactly — no currency conversion, no reworded descriptions. The result is an .xlsx file that opens ready in Excel and compatible spreadsheet apps.
          </p>
          <p className={P}>
            It is the same rescued data the <a href="/tools/qif-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to CSV converter</a> produces, in the wrapping meant for people rather than systems: choose Excel when the file will be read, CSV when it will be imported.
          </p>
          <h2 className={H2M}>Format notes and where the workbook goes next</h2>
          <p className={P}>
            If the real destination for this legacy data is QuickBooks, skip the spreadsheet detour: the <a href="/tools/qif-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to QBO converter</a> converts the same QIF directly into a Web Connect file. For a fixed document instead of an editable workbook, the <a href="/tools/qif-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to PDF converter</a> renders the transactions as a printable statement.
          </p>
          <p className={P}>
            However you convert it, keep the original QIF untouched alongside the output. Legacy files are often the only copy of that history, and the original is your proof of what the source actually said.
          </p>
        </>
      }
    />
  );
}
