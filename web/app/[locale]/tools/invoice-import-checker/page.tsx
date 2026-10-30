import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { InvoiceChecker } from "@/components/tools/InvoiceChecker";

const PAGE_URL = "https://www.convertstatement.online/tools/invoice-import-checker";

export const metadata: Metadata = {
  title: "Invoice Import Checker — Validate & Format Invoices for QuickBooks | Convert Statement",
  description:
    "Free invoice import validator and formatter: check an invoice CSV row by row before QuickBooks Online sees it, fix date and amount formatting automatically, catch missing customers and duplicate invoice numbers, and download a QuickBooks-ready CSV. No account needed.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Invoice Import Checker — Validate Invoices for QuickBooks",
    description:
      "Upload an invoice CSV, see every error and automatic fix row by row, and download a cleaned CSV in the layout QuickBooks Online invoice import accepts. Free, no account.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "What does the invoice import checker validate?",
    a: "Every row is checked for the things QuickBooks Online invoice import needs: a customer name, a readable invoice date, a product/service (item), and an amount greater than zero. It also flags duplicate invoice numbers, non-numeric quantities and rates, and amounts it cannot read — before any of them can fail your import or land in the wrong place.",
  },
  {
    q: "What fixes does it apply automatically?",
    a: "Three safe fixes: dates are reformatted to MM/DD/YYYY (the format QuickBooks expects), currency symbols and thousands separators are cleaned out of amounts, and a missing amount is calculated from quantity × rate when both are present. Every fix is shown on its row, and the fixes are applied in the downloaded CSV.",
  },
  {
    q: "Which columns does my invoice CSV need?",
    a: "At minimum a customer column and an invoice date column — the checker accepts common header names such as Customer, Customer Name, Client, Invoice Date, and Txn Date. Invoice number, due date, item (Product/Service, Description), quantity, rate, and amount columns are all picked up when present. If the customer or date column cannot be found at all, the checker tells you exactly what is missing.",
  },
  {
    q: "What happens to rows with errors?",
    a: "They are listed with the error on the row, and they are left out of the downloaded QuickBooks-ready CSV. That way one bad row cannot fail the whole import — you import the clean rows now and fix the flagged rows in your source file at your own pace.",
  },
  {
    q: "What format is the downloaded CSV in?",
    a: "The download uses the column layout QuickBooks Online's invoice import accepts: InvoiceNo, Customer, InvoiceDate, DueDate, ItemName, ItemQuantity, ItemRate, and ItemAmount, with dates in MM/DD/YYYY. Map those columns in the QuickBooks import screen and the invoices go in as single-line invoices.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "No. Your CSV is processed in memory to build the report and the cleaned file, and it is not stored afterwards. We never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Export your invoices", body: "Save your invoice list as a CSV from your spreadsheet or billing tool — it needs at least a customer column and an invoice date column." },
  { title: "Upload it here", body: "Drop the CSV in. Every row is checked against what QuickBooks Online invoice import needs." },
  { title: "Review errors and fixes", body: "Read the row-by-row table: errors in red need your attention, fixes in amber were already applied for you." },
  { title: "Download and import", body: "Download the QuickBooks-ready CSV — clean rows only — and import it through QuickBooks Online's invoice import." },
];

export default function InvoiceImportCheckerPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="Invoice Import Validator + Formatter"
      subtitle="Check an invoice CSV before QuickBooks does: catch missing customers, duplicate invoice numbers and bad amounts, fix dates and formatting automatically, and download a clean file ready to import."
      tool={<InvoiceChecker />}
      currentPath="/tools/invoice-import-checker"
      faqs={FAQS}
      howToName="How to validate invoices for QuickBooks import"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Why invoice imports fail at the worst moment</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            QuickBooks Online checks an invoice file only when you import it — and one bad row
            can stall the whole batch. A date in ISO format, an amount typed as $1,250.00, a
            blank customer, or the same invoice number used twice are all easy to miss in a
            spreadsheet and painful to untangle inside QuickBooks afterwards. This checker
            moves that review earlier: you see every problem on its own row, with the safe
            fixes already made, before the file goes anywhere near your books.
          </p>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-12">What this tool checks and fixes</h2>
          <ul className="mt-4 space-y-2.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <li><strong className="text-zinc-900 dark:text-white">Missing customers and items</strong> — rows with no customer name or no product/service are flagged as errors.</li>
            <li><strong className="text-zinc-900 dark:text-white">Date formatting</strong> — any readable date that is not already MM/DD/YYYY is reformatted automatically.</li>
            <li><strong className="text-zinc-900 dark:text-white">Amount cleanup and calculation</strong> — $ signs and commas are stripped, and a missing amount is calculated from quantity × rate when both are present.</li>
            <li><strong className="text-zinc-900 dark:text-white">Duplicate invoice numbers</strong> — the second use of a number is flagged with the line where it first appeared.</li>
            <li><strong className="text-zinc-900 dark:text-white">Clean download</strong> — the QuickBooks-ready CSV contains only error-free rows, with every fix applied.</li>
          </ul>
          <p className="mt-5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Working with bank transactions instead of invoices? The{" "}
            <a href="/tools/csv-to-qbo" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">CSV to QBO converter</a>{" "}
            turns a bank CSV into a QuickBooks-ready QBO file, and the{" "}
            <a href="/tools/qbo-import-errors" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">QBO import-error decoder</a>{" "}
            explains the errors QuickBooks shows when an import does go wrong.
          </p>
        </>
      }
    />
  );
}
