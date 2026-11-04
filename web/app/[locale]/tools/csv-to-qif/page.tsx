import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/csv-to-qif";

export const metadata: Metadata = {
  title: "CSV to QIF Converter — Free | Convert Statement",
  description: "Turn a spreadsheet of transactions into a QIF file for the older and specialist apps that still import Quicken's legacy format. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "CSV to QIF Converter — Free",
    description: "Upload a CSV file and download it as QIF — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a CSV file to QIF?",
    a: "Upload the .csv above and press Convert to QIF. Every row becomes a QIF record with its date, description and amount, ready to import into an app that reads QIF. Fully free, no account.",
  },
  {
    q: "Why would anything still need QIF?",
    a: "QIF was Quicken's original interchange format. Intuit discontinued QIF imports in favour of QFX in the mid-2000s, but many older and other apps still read and write it — for them, QIF is the only import route.",
  },
  {
    q: "What does a QIF file look like inside?",
    a: "It is plain text: a short header naming the account type, then one record per transaction, each record ended by a line containing only a caret (^). Dates, descriptions and amounts sit on their own labelled lines inside each record.",
  },
  {
    q: "Are amounts changed during conversion?",
    a: "No. Amounts are copied exactly as they appear in your CSV, with no currency conversion.",
  },
  {
    q: "Can current Quicken import the QIF I make here?",
    a: "Current Quicken versions are built around QFX, not QIF. If Quicken is your destination, use the CSV to QFX converter instead — QIF is for the older and other apps that still ask for it.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the QIF and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Get your CSV file", body: "Use the .csv file you already have, or export a fresh one from the bank or app that produced it." },
  { title: "Upload it here", body: "Drop the CSV file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to QIF", body: "Press Convert to QIF. The transactions are read and rebuilt in QIF format, with amounts copied exactly." },
  { title: "Download the QIF file", body: "Save the converted file — fully free — and open or import it wherever you need the QIF version." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function CsvToQifPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="CSV to QIF Converter"
      subtitle="Turn a spreadsheet of transactions into a QIF file for the older and specialist apps that still import Quicken's legacy format. Fully free with no account."
      tool={<FormatConverter tool="csv-to-qif" fromLabel="CSV" toLabel="QIF" accept=".csv" outputExt="qif" />}
      currentPath="/tools/csv-to-qif"
      faqs={FAQS}
      howToName="How to convert CSV to QIF"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why convert a CSV to QIF?</h2>
          <p className={P}>
            QIF — Quicken Interchange Format — is Quicken's legacy plain-text format, and some software never moved on from it. Intuit discontinued QIF imports in favour of QFX in the mid-2000s, but many older and other apps still read and write QIF, and for those apps a modern bank CSV is unusable until it is reshaped.
          </p>
          <p className={P}>
            This converter does that reshaping: your spreadsheet rows become QIF records, so data you downloaded today can enter a tool whose import menu has not changed in years.
          </p>
          <h2 className={H2M}>What the conversion does</h2>
          <p className={P}>
            Each CSV row — one row per transaction — becomes one QIF record carrying its date, description and amount, with records separated by the ^ lines the QIF format uses. Amounts are copied exactly, with no currency conversion.
          </p>
          <p className={P}>
            QIF is a deliberately simple format: no bank identity, no transaction IDs, no closing balance. The converter adds none of those, because the source CSV does not carry them and inventing them would corrupt the record. What goes in as transactions comes out as transactions.
          </p>
          <h2 className={H2M}>Format notes and where the QIF goes next</h2>
          <p className={P}>
            Choose QIF only when the receiving app actually asks for it. Current Quicken versions import QFX instead — the <a href="/tools/csv-to-qfx" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QFX converter</a> covers that route — and QuickBooks takes QBO via the <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a>. QIF is the legacy door, still the only door some apps have.
          </p>
          <p className={P}>
            To move data back out of QIF later, the <a href="/tools/qif-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to CSV converter</a> returns it to a spreadsheet, and the <a href="/tools/qif-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to QBO converter</a> brings legacy Quicken data forward into QuickBooks.
          </p>
        </>
      }
    />
  );
}
