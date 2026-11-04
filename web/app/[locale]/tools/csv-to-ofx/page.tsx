import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/csv-to-ofx";

export const metadata: Metadata = {
  title: "CSV to OFX Converter — Free | Convert Statement",
  description: "Turn a bank CSV export into a standard OFX file that finance and accounting apps can import — dates, descriptions and amounts carried over exactly. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "CSV to OFX Converter — Free",
    description: "Upload a CSV file and download it as OFX — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a CSV file to OFX?",
    a: "Upload your .csv file above and press Convert to OFX. The converter reads each row — date, description and amount — and downloads an OFX file holding the same transactions. It is fully free and needs no account.",
  },
  {
    q: "What does my CSV need for the conversion to work?",
    a: "One row per transaction with a date, a description and an amount — the shape a normal bank CSV export already has. Amounts are copied exactly, so a signed amount column works as-is.",
  },
  {
    q: "Does the OFX file include a closing balance or account number?",
    a: "Only if your source carried one — and a plain CSV does not. The converter never invents a closing balance or bank identity, so the output holds your transactions without made-up account details.",
  },
  {
    q: "Is any amount changed or converted to another currency?",
    a: "No. Amounts are copied exactly, with no currency conversion. A row that says -96.40 in the CSV is -96.40 in the OFX.",
  },
  {
    q: "My app is QuickBooks or Quicken — is OFX the right target?",
    a: "QuickBooks imports QBO files, so use the CSV to QBO converter for QuickBooks. Quicken uses QFX, its own OFX variant, so the CSV to QFX converter is the closer match there. Plain OFX suits apps that ask for OFX by name.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the conversion and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Get your CSV file", body: "Use the .csv file you already have, or export a fresh one from the bank or app that produced it." },
  { title: "Upload it here", body: "Drop the CSV file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to OFX", body: "Press Convert to OFX. The transactions are read and rebuilt in OFX format, with amounts copied exactly." },
  { title: "Download the OFX file", body: "Save the converted file — fully free — and open or import it wherever you need the OFX version." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function CsvToOfxPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="CSV to OFX Converter"
      subtitle="Turn a bank CSV export into a standard OFX file that finance and accounting apps can import — dates, descriptions and amounts carried over exactly. Fully free with no account."
      tool={<FormatConverter tool="csv-to-ofx" fromLabel="CSV" toLabel="OFX" accept=".csv" outputExt="ofx" />}
      currentPath="/tools/csv-to-ofx"
      faqs={FAQS}
      howToName="How to convert CSV to OFX"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why convert a CSV to OFX?</h2>
          <p className={P}>
            A CSV is a spreadsheet, not an import file. Many banks hand you one because it opens anywhere, but the app you actually keep your books in often expects OFX — Open Financial Exchange, the standard format banks export for software to read. When the download and the destination disagree on format, the transactions are stuck in the middle.
          </p>
          <p className={P}>
            Converting the CSV to OFX bridges that gap without retyping anything. The rows you already have become a structured OFX statement the receiving app can read in one import, instead of a spreadsheet it cannot open at all.
          </p>
          <h2 className={H2M}>What the conversion does</h2>
          <p className={P}>
            The converter reads your spreadsheet rows — one row per transaction — and writes each one into the OFX as a transaction with its date, description and amount. Amounts are copied exactly as they appear in the CSV, with no currency conversion and no rounding beyond what is already in the file.
          </p>
          <p className={P}>
            A CSV carries no bank identity and no closing balance, and the converter invents neither. The OFX you download holds the transactions themselves; if you need a QuickBooks Web Connect file with a balance check instead, the <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a> is built for that destination.
          </p>
          <h2 className={H2M}>Format notes and where the OFX goes next</h2>
          <p className={P}>
            OFX is the family format underneath several better-known names: QBO files for QuickBooks are OFX 1.02 underneath, and QFX is Quicken's variant of the same structure. An OFX file is therefore a good neutral hand-off — most finance apps that import anything import OFX.
          </p>
          <p className={P}>
            If your destination is Quicken rather than a general OFX reader, use the <a href="/tools/csv-to-qfx" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QFX converter</a> so the file arrives in Quicken's own variant. And if you later need the data back in a spreadsheet, the <a href="/tools/ofx-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to CSV converter</a> reverses this conversion row for row.
          </p>
        </>
      }
    />
  );
}
