import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qfx-to-qif";

export const metadata: Metadata = {
  title: "QFX to QIF Converter — Free | Convert Statement",
  description: "Convert a modern Quicken QFX download into the legacy QIF format for older and specialist apps that still import it. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QFX to QIF Converter — Free",
    description: "Upload a QFX file and download it as QIF — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a QFX file to QIF?",
    a: "Upload the .qfx above and press Convert to QIF. Each transaction becomes a QIF record with its date, description and amount. Fully free, no account.",
  },
  {
    q: "What is QIF, and why does it still exist?",
    a: "QIF is Quicken Interchange Format, Quicken's legacy plain-text format with records separated by ^ lines. Intuit discontinued QIF imports in favour of QFX in the mid-2000s, but many older and other apps still read and write it.",
  },
  {
    q: "What is lost going from QFX to QIF?",
    a: "The wrapping, not the transactions. QIF has no institution ID (INTU.BID) and no closing balance, so those do not cross over. Dates, descriptions and amounts — the transactions themselves — are complete.",
  },
  {
    q: "Are amounts changed during conversion?",
    a: "No. Amounts are copied exactly as they appear in the QFX, with no currency conversion.",
  },
  {
    q: "Can current Quicken import the QIF?",
    a: "Current Quicken is built around QFX, so keep your original QFX for Quicken itself. This conversion is for the older and other apps that still ask for QIF.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the QIF and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Get your QFX file", body: "Use the .qfx file you already have, or export a fresh one from the bank or app that produced it." },
  { title: "Upload it here", body: "Drop the QFX file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to QIF", body: "Press Convert to QIF. The transactions are read and rebuilt in QIF format, with amounts copied exactly." },
  { title: "Download the QIF file", body: "Save the converted file — fully free — and open or import it wherever you need the QIF version." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QfxToQifPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QFX to QIF Converter"
      subtitle="Convert a modern Quicken QFX download into the legacy QIF format for older and specialist apps that still import it. Fully free with no account."
      tool={<FormatConverter tool="qfx-to-qif" fromLabel="QFX" toLabel="QIF" accept=".qfx" outputExt="qif" />}
      currentPath="/tools/qfx-to-qif"
      faqs={FAQS}
      howToName="How to convert QFX to QIF"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why convert a QFX to QIF?</h2>
          <p className={P}>
            Sometimes data has to travel backwards. Your transactions are in QFX — Quicken's current download format — but the app that needs them is older or more specialised and only imports QIF, Quicken's legacy plain-text format. Intuit discontinued QIF imports in favour of QFX in the mid-2000s, yet many older and other apps still read and write QIF today.
          </p>
          <p className={P}>
            This converter steps a modern download down into that legacy shape, so a file from your bank's current portal can enter a tool from an earlier era without manual retyping.
          </p>
          <h2 className={H2M}>What the conversion does</h2>
          <p className={P}>
            Each transaction in the QFX becomes a QIF record with its date, description and amount, records separated by the ^ lines the QIF format uses. Amounts are copied exactly, with no currency conversion.
          </p>
          <p className={P}>
            QIF is a simpler format than QFX: it has no place for an institution ID or a closing balance, so those parts of the QFX stay behind. What crosses over is the transaction list itself — which is what a QIF-importing app can use.
          </p>
          <h2 className={H2M}>Format notes and where the QIF goes next</h2>
          <p className={P}>
            If the receiving app is current Quicken, you do not need this page at all — keep the QFX as it is. QIF is specifically the legacy door. For QuickBooks, the <a href="/tools/qfx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to QBO converter</a> is the direct route from the same starting file.
          </p>
          <p className={P}>
            Once data is in QIF form it can come forward again: the <a href="/tools/qif-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to CSV converter</a> lays it out as a spreadsheet, and the <a href="/tools/qif-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to QBO converter</a> brings legacy Quicken data into QuickBooks.
          </p>
        </>
      }
    />
  );
}
