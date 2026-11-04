import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qfx-to-excel";

export const metadata: Metadata = {
  title: "QFX to Excel Converter — Free | Convert Statement",
  description: "Turn a Quicken QFX download into a formatted Excel workbook — one row per transaction, ready to sort, filter and annotate. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QFX to Excel Converter — Free",
    description: "Upload a QFX file and download it as Excel — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a QFX file to Excel?",
    a: "Upload the .qfx above and press Convert to Excel. You download an .xlsx workbook with one row per transaction — date, description and amount. Fully free, no account.",
  },
  {
    q: "What is the difference between the Excel and CSV downloads?",
    a: "Same transactions, two wrappings. Excel opens formatted and ready for a person to sort, filter and annotate; CSV is the plain-text form other software imports most reliably.",
  },
  {
    q: "Are amounts changed during conversion?",
    a: "No. Amounts are copied exactly as they appear in the QFX, with no currency conversion.",
  },
  {
    q: "What is a QFX file?",
    a: "QFX is Quicken's variant of OFX, the standard format banks export — identical in structure plus an Intuit institution ID (INTU.BID) that Quicken uses to tie the file to a bank.",
  },
  {
    q: "Can I edit the workbook and convert it back?",
    a: "You can edit freely — it is an ordinary spreadsheet. To return data to Quicken format, the CSV to QFX converter rebuilds a QFX from a CSV export of your edited sheet.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the workbook and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Get your QFX file", body: "Use the .qfx file you already have, or export a fresh one from the bank or app that produced it." },
  { title: "Upload it here", body: "Drop the QFX file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to Excel", body: "Press Convert to Excel. The transactions are read and rebuilt in Excel format, with amounts copied exactly." },
  { title: "Download the Excel file", body: "Save the converted file — fully free — and open or import it wherever you need the Excel version." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QfxToExcelPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QFX to Excel Converter"
      subtitle="Turn a Quicken QFX download into a formatted Excel workbook — one row per transaction, ready to sort, filter and annotate. Fully free with no account."
      tool={<FormatConverter tool="qfx-to-excel" fromLabel="QFX" toLabel="Excel" accept=".qfx" outputExt="xlsx" />}
      currentPath="/tools/qfx-to-excel"
      faqs={FAQS}
      howToName="How to convert QFX to Excel"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why convert a QFX to Excel?</h2>
          <p className={P}>
            Quicken downloads are written for Quicken. When the audience is a person — you reviewing a year of spending, an accountant checking activity, a partner who just wants the numbers in front of them — a formatted Excel workbook is the friendliest possible shape: it opens ready, sorts and filters natively, and takes notes in the next column.
          </p>
          <p className={P}>
            This converter takes the QFX straight to that workbook, skipping the detour of converting to CSV and tidying it up by hand.
          </p>
          <h2 className={H2M}>What the conversion does</h2>
          <p className={P}>
            Every transaction in the QFX becomes one row in the workbook with its date, description and amount — QFX is Quicken's variant of OFX, and the converter reads that transaction list directly. Amounts are copied exactly, with no currency conversion.
          </p>
          <p className={P}>
            The result is the same data the <a href="/tools/qfx-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to CSV converter</a> produces, in the wrapping meant for reading rather than re-importing: an .xlsx file that opens formatted in Excel and compatible spreadsheet apps.
          </p>
          <h2 className={H2M}>Format notes and where the workbook goes next</h2>
          <p className={P}>
            Pick the wrapping by destination. People read Excel; systems import CSV. If this workbook later needs to feed other software, save a CSV copy from your spreadsheet app, or convert the original QFX with the CSV converter directly so nothing passes through manual edits.
          </p>
          <p className={P}>
            Staying inside the Quicken and QuickBooks world instead? The <a href="/tools/qfx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to QBO converter</a> moves the download into QuickBooks, and the <a href="/tools/qfx-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to PDF converter</a> renders it as a printable statement for records.
          </p>
        </>
      }
    />
  );
}
