import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/csv-to-qfx";

export const metadata: Metadata = {
  title: "CSV to QFX Converter — Free | Convert Statement",
  description: "Turn a bank CSV export into a QFX file Quicken can import — the same transactions, in Quicken's own variant of OFX. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "CSV to QFX Converter — Free",
    description: "Upload a CSV file and download it as QFX — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a CSV file to QFX?",
    a: "Upload the .csv above and press Convert to QFX. Each row — date, description, amount — becomes a transaction in a QFX file you can import into Quicken. Fully free, no account.",
  },
  {
    q: "What is the difference between QFX and OFX?",
    a: "Almost nothing structurally: QFX is Quicken's variant of OFX, identical in structure plus an Intuit institution ID (INTU.BID) that Quicken uses to tie the file to a bank. OFX is the generic form other apps import.",
  },
  {
    q: "Will the QFX include an INTU.BID?",
    a: "Your CSV does not carry one, and the converter never invents a bank's institution ID. If Quicken needs the ID tied to your bank, a QFX downloaded from the bank itself carries the authoritative value.",
  },
  {
    q: "Are amounts changed during conversion?",
    a: "No. Amounts are copied exactly as they appear in your CSV, with no currency conversion and no rounding beyond the file itself.",
  },
  {
    q: "Does the file include a closing balance?",
    a: "A CSV has no closing balance, so the QFX has none either — the converter never invents one. The transactions themselves are complete.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the QFX and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Get your CSV file", body: "Use the .csv file you already have, or export a fresh one from the bank or app that produced it." },
  { title: "Upload it here", body: "Drop the CSV file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to QFX", body: "Press Convert to QFX. The transactions are read and rebuilt in QFX format, with amounts copied exactly." },
  { title: "Download the QFX file", body: "Save the converted file — fully free — and open or import it wherever you need the QFX version." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function CsvToQfxPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="CSV to QFX Converter"
      subtitle="Turn a bank CSV export into a QFX file Quicken can import — the same transactions, in Quicken's own variant of OFX. Fully free with no account."
      tool={<FormatConverter tool="csv-to-qfx" fromLabel="CSV" toLabel="QFX" accept=".csv" outputExt="qfx" />}
      currentPath="/tools/csv-to-qfx"
      faqs={FAQS}
      howToName="How to convert CSV to QFX"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why convert a CSV to QFX?</h2>
          <p className={P}>
            Quicken imports QFX files — its licensed variant of OFX — but plenty of banks only offer a plain CSV download, especially for older accounts, cards and custom date ranges. A CSV is fine for reading in a spreadsheet; Quicken cannot import it as a statement.
          </p>
          <p className={P}>
            This converter rebuilds your spreadsheet rows as a QFX file, so a download your bank aimed at Excel can go into Quicken instead, with every transaction intact and nothing retyped by hand.
          </p>
          <h2 className={H2M}>What the conversion does</h2>
          <p className={P}>
            Each CSV row becomes one QFX transaction with its date, description and amount, copied exactly — no currency conversion, no cleanup of payee text. QFX has the identical structure to OFX, plus an Intuit institution ID (INTU.BID) that Quicken uses to tie a file to a bank.
          </p>
          <p className={P}>
            A CSV has no INTU.BID and no closing balance to carry, and the converter never invents either. The downloaded file holds your transactions in Quicken's format; the institution ID from a bank-issued QFX remains the authoritative one when you have it.
          </p>
          <h2 className={H2M}>Format notes and where the QFX goes next</h2>
          <p className={P}>
            Because QFX and OFX share one structure, the choice between them is about the reader, not the data. Apps that ask for OFX by name are served by the <a href="/tools/csv-to-ofx" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to OFX converter</a>; QuickBooks, which imports its own Web Connect variant, is served by the <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a>.
          </p>
          <p className={P}>
            Working in the other direction later is covered too: the <a href="/tools/qfx-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to CSV converter</a> lays a Quicken download back out as a spreadsheet, and the <a href="/tools/qfx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to QBO converter</a> moves a QFX file into QuickBooks.
          </p>
        </>
      }
    />
  );
}
