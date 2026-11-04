import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/iif-to-csv";

export const metadata: Metadata = {
  title: "IIF to CSV Converter — Free | Convert Statement",
  description: "Flatten a QuickBooks Desktop IIF file into a plain CSV — one row per transaction — so you can review, share or migrate the data anywhere. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "IIF to CSV Converter — Free",
    description: "Upload a IIF file and download it as CSV — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert an IIF file to CSV?",
    a: "Upload the .iif above and press Convert to CSV. The transactions inside — date, description, amount — come out as one spreadsheet row each. Fully free, no account.",
  },
  {
    q: "What is an IIF file?",
    a: "IIF is Intuit Interchange Format, QuickBooks Desktop's own tab-separated import format. Transactions are written as paired TRNS and SPL lines — the two sides of a double entry — which is why the files are hard to read outside Desktop.",
  },
  {
    q: "What happens to the double-entry SPL lines?",
    a: "A CSV cannot express debit-and-credit pairings, so the output is the flattened transaction list: one row per transaction. For review, totals and migration that is the part that matters; the original IIF keeps its full structure untouched.",
  },
  {
    q: "Are amounts changed during conversion?",
    a: "No. Amounts are copied exactly as recorded in the IIF, with no currency conversion.",
  },
  {
    q: "Can I turn the CSV back into an IIF?",
    a: "Yes — the CSV to IIF converter builds a fresh Desktop import file from a spreadsheet. Note it asks for the QuickBooks Desktop account names to post against, because an IIF import needs them.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the CSV and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Get your IIF file", body: "Use the .iif file you already have, or export a fresh one from the bank or app that produced it." },
  { title: "Upload it here", body: "Drop the IIF file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to CSV", body: "Press Convert to CSV. The transactions are read and rebuilt in CSV format, with amounts copied exactly." },
  { title: "Download the CSV file", body: "Save the converted file — fully free — and open or import it wherever you need the CSV version." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function IifToCsvPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="IIF to CSV Converter"
      subtitle="Flatten a QuickBooks Desktop IIF file into a plain CSV — one row per transaction — so you can review, share or migrate the data anywhere. Fully free with no account."
      tool={<FormatConverter tool="iif-to-csv" fromLabel="IIF" toLabel="CSV" accept=".iif" outputExt="csv" />}
      currentPath="/tools/iif-to-csv"
      faqs={FAQS}
      howToName="How to convert IIF to CSV"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why convert an IIF to CSV?</h2>
          <p className={P}>
            IIF — Intuit Interchange Format — is QuickBooks Desktop's own import format, and it shows. An IIF file is tab-separated text built around TRNS and SPL double-entry lines: correct for Desktop's importer, painful for a human to read, and unreadable to almost any other software.
          </p>
          <p className={P}>
            Converting it to CSV flattens those paired entry lines into the shape everything else understands — one row per transaction with its date, description and amount — ready for review in a spreadsheet, a migration out of Desktop, or a hand-off to someone without QuickBooks.
          </p>
          <h2 className={H2M}>What the conversion does</h2>
          <p className={P}>
            The converter reads the transactions recorded in the IIF and writes them out as plain spreadsheet rows. Dates, descriptions and amounts are carried over exactly as the file records them, with no currency conversion.
          </p>
          <p className={P}>
            The double-entry structure stays behind, deliberately: a CSV has no debits-and-credits pairing to express it in, so the output is the transaction list itself — the part you review, total and migrate — in a form any spreadsheet or importer can open.
          </p>
          <h2 className={H2M}>Format notes and where the CSV goes next</h2>
          <p className={P}>
            Going back the other way is a different tool with a different job: the <a href="/tools/csv-to-iif" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to IIF converter</a> builds Desktop-ready TRNS and SPL lines from a spreadsheet, including the account names the import needs. And the <a href="/tools/qbo-to-iif" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to IIF converter</a> brings QuickBooks Web Connect data into the same Desktop format.
          </p>
          <p className={P}>
            For a formatted workbook instead of plain text, the <a href="/tools/iif-to-excel" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">IIF to Excel converter</a> lays the same IIF data out as a spreadsheet file. Whichever wrapping you choose, the rows underneath are the transactions from your file.
          </p>
        </>
      }
    />
  );
}
