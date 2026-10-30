import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { CsvToIif } from "@/components/tools/CsvToIif";

const PAGE_URL = "https://www.convertstatement.online/tools/csv-to-iif";

export const metadata: Metadata = {
  title: "CSV to IIF Converter — Free CSV to QuickBooks Desktop | Convert Statement",
  description:
    "Free CSV to IIF converter for QuickBooks Desktop: turn any bank transaction CSV into an import-ready IIF file with a column-mapping step and your own bank, income, and expense account names. Fully free download, no account needed.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "CSV to IIF Converter — Bank CSV to QuickBooks Desktop",
    description:
      "Upload a bank CSV, map its columns, set your QuickBooks Desktop accounts, and download a free IIF file ready to import.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a CSV file to IIF for QuickBooks Desktop?",
    a: "Upload your bank's CSV export, check the auto-detected column mapping (date, payee, and either a signed amount column or a debit/credit pair), and set the bank, income, and expense account names exactly as they appear in your QuickBooks Desktop chart of accounts. Download the IIF file — it is fully free and needs no account — then import it in QuickBooks Desktop from File, then Utilities, then Import, then IIF Files.",
  },
  {
    q: "Should I back up my company file before importing an IIF?",
    a: "Yes. Make a backup first (File, then Back Up Company in QuickBooks Desktop). IIF imports cannot be undone in one step, so a backup is the standard way to protect your books before any import. If anything looks wrong after importing, you can restore the backup and try again.",
  },
  {
    q: "How are deposits and payments handled in the IIF file?",
    a: "A positive amount becomes a DEPOSIT: the bank account line carries the positive amount and the offset line carries the negative amount against your income account. A negative amount becomes a CHECK: the bank account line carries the negative amount and the offset line carries the positive amount against your expense account. Each pair sums to zero, which is the double-entry convention IIF expects.",
  },
  {
    q: "What if my CSV uses debit and credit columns instead of one amount column?",
    a: "Map both columns. Debit rows (money out) become negative amounts and credit rows (money in) stay positive. A row that fills neither side is skipped and counted in the warnings so you can check it.",
  },
  {
    q: "What happens if an account name does not exist in QuickBooks Desktop?",
    a: "Type account names exactly as they appear in your chart of accounts, including spelling. If a name does not exist yet, QuickBooks Desktop will typically ask whether to create it during import. Checking the names here first avoids creating duplicate or misspelled accounts in your books.",
  },
  {
    q: "Is this tool really free, and is my data stored?",
    a: "Yes — the IIF download is fully free, with no account and no Pro plan required. Your CSV is processed in memory to build the conversion and is not stored afterwards. We never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Export from your bank", body: "Download your transactions as a CSV from your bank's website — any export with date, description, and amount columns works." },
  { title: "Upload and map columns", body: "Drop the CSV in. The tool auto-detects the column mapping from your header row, and you can correct any column here." },
  { title: "Set your account names", body: "Enter your QuickBooks Desktop bank account, income account for deposits, and expense account for payments, exactly as named in your chart of accounts." },
  { title: "Download and import", body: "Download the free IIF file, back up your company file, then import it in QuickBooks Desktop from File, then Utilities, then Import, then IIF Files." },
];

export default function CsvToIifPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="CSV to IIF Converter"
      subtitle="Turn any bank transaction CSV into a QuickBooks Desktop IIF file: map your columns, set your account names, and download it free — no account needed."
      tool={<CsvToIif />}
      currentPath="/tools/csv-to-iif"
      faqs={FAQS}
      howToName="How to convert a CSV to IIF"
      howToSteps={HOWTO}
      privacyLine="Fully free, no account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Why QuickBooks Desktop users still need IIF</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            QuickBooks Desktop does not import a plain bank CSV the way QuickBooks Online does.
            For many Desktop workflows, an IIF (Intuit Interchange Format) file is still the
            practical way to bring bank transactions in without typing them by hand. Building
            that file by hand in a spreadsheet is error-prone: the header block has to be exact,
            the file must be tab-separated, dates must be in month/day/year form, and every
            transaction needs a balancing offset line or the import will not reflect your books
            correctly. This converter handles all of that formatting for you.
          </p>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-12">What this tool handles</h2>
          <ul className="mt-4 space-y-2.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <li><strong className="text-zinc-900 dark:text-white">Column mapping</strong> — auto-detected from your headers, editable when your bank names things differently.</li>
            <li><strong className="text-zinc-900 dark:text-white">Your own account names</strong> — set the bank, income, and expense accounts the file posts against, exactly as named in your chart of accounts.</li>
            <li><strong className="text-zinc-900 dark:text-white">Balanced entries</strong> — every deposit and payment is written as a pair of lines that sum to zero, as IIF double-entry requires.</li>
            <li><strong className="text-zinc-900 dark:text-white">Signed amounts or debit/credit pairs</strong> — both CSV conventions are understood, with deposits positive and payments negative.</li>
          </ul>
          <p className="mt-5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Using QuickBooks Online instead of Desktop? The{" "}
            <a href="/tools/csv-to-qbo" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">CSV to QBO converter</a>{" "}
            turns the same kind of CSV into a Web Connect file. Already have a QBO that will not
            import cleanly? The{" "}
            <a href="/tools/qbo-checker" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">QBO File Checker</a>{" "}
            reviews its structure and balances before you import it.
          </p>
        </>
      }
    />
  );
}
