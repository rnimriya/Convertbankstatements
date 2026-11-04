import type { Metadata } from "next";
import Link from "next/link";
import {
  FormatLanding,
  H2, H2M, P, TH, TD, INLINE_LINK,
  type LandingFaq, type LandingStep,
} from "@/components/landing/FormatLanding";

const PAGE_URL = "https://www.convertstatement.online/bank-statement-to-csv";

export const metadata: Metadata = {
  title: "Bank Statement to CSV Converter — PDF to CSV | Convert Statement",
  description:
    "Convert a PDF bank statement to CSV: plain text, one row per transaction with dates, descriptions and amounts. Opens in any spreadsheet and imports into accounting tools. First 8 pages free, no account needed; CSV export is included on every plan.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Bank Statement to CSV Converter — PDF to CSV",
    description:
      "Upload a statement PDF and download a plain-text CSV — one row per transaction, ready for spreadsheets and accounting imports. First 8 pages free.",
    url: PAGE_URL,
    type: "website",
  },
};

const STEPS: LandingStep[] = [
  {
    title: "Upload your statement PDF",
    body: "Drop the PDF in above, or add it from your device, Google Drive, Dropbox or a link. Password-protected statement PDFs are accepted — PDF only, up to 50 MB.",
  },
  {
    title: "Check the preview",
    body: "The converter reads the statement and shows the first transactions it found — date, description, amount and balance — and runs a balance check on every conversion before you download anything.",
  },
  {
    title: "Download the CSV file",
    body: "CSV is the converter's default format. Download the plain-text file: one row per transaction, ready to open in a spreadsheet or import into your accounting tool.",
  },
];

const FAQS: LandingFaq[] = [
  {
    q: "How do I convert a bank statement PDF to CSV?",
    a: "Upload the statement PDF in the converter above, check the preview of the transactions it found, and download the CSV — CSV is the default format. Each transaction lands on its own row with its date, description and amount, plus the running balance where the statement shows one.",
  },
  {
    q: "Is converting a bank statement to CSV free?",
    a: "Your first 8 pages are free and no account is needed, and CSV export is included on the Free plan. If your statements run longer, the paid plans add more pages: Basic is $5/month for 25 pages, Pro is $20/month for 500 pages, and Business is $75/month for 2,000 pages.",
  },
  {
    q: "What exactly is a CSV file?",
    a: "CSV is plain text: each row of the table is one line, and the values in that row are separated by commas. There is no formatting, no fonts and no formulas — which is exactly why almost every spreadsheet and accounting tool can read it, and why a CSV still opens decades later.",
  },
  {
    q: "Can I open the CSV in Excel or Google Sheets?",
    a: "Yes. A CSV opens directly in Excel, Google Sheets and every other spreadsheet app, with each value in its own cell. If you want the file to keep formulas or formatting after you work on it, download the Excel (.xlsx) version from the same converter instead.",
  },
  {
    q: "Can I import the CSV into my accounting software?",
    a: "In most cases, yes — CSV is the standard exchange format for transactions, and accounting and bookkeeping tools generally accept a CSV import with date, description and amount columns. Check your tool's import screen for the column order it expects before uploading. If your books are in QuickBooks, the PDF to QBO converter on this site produces the Web Connect format QuickBooks prefers.",
  },
  {
    q: "Are my statements stored after conversion?",
    a: "No. Files are processed in memory and deleted immediately after conversion — statement content is not stored. We never sell or share your financial data.",
  },
];

export default function BankStatementToCsvPage() {
  return (
    <FormatLanding
      eyebrow="Bank statement converter"
      title={<>Bank statement to <span className="text-[#2CA01C]">CSV</span> converter</>}
      subtitle="Upload a PDF bank statement and download a plain-text CSV — one row per transaction with dates, descriptions and amounts. It opens in any spreadsheet and imports into accounting tools. First 8 pages free, no account needed."
      pageUrl={PAGE_URL}
      softwareDescription="Convert PDF bank statements to CSV with Convert Statement: plain text, one row per transaction with dates, descriptions, amounts and the running balance where the statement shows one. First 8 pages free."
      howToName="How to convert a bank statement to CSV"
      steps={STEPS}
      faqs={FAQS}
      showBanks
      related={[
        { href: "/bank-statement-to-excel", label: "Bank Statement to Excel", desc: "The same converter with an .xlsx workbook download — keeps formulas and formatting." },
        { href: "/pdf-to-qbo", label: "PDF to QBO Converter", desc: "Turn a statement PDF straight into a QuickBooks QBO (Web Connect) file." },
        { href: "/tools/qbo-to-csv", label: "QBO to CSV Converter", desc: "Already have a QBO file? Turn it back into a plain CSV." },
      ]}
    >
      <h2 className={H2}>What the CSV file contains</h2>
      <p className={P}>
        The download is a plain-text CSV built from the transactions on your statement. One row
        per transaction, with the values in separate columns:
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className={TH}>Column</th>
              <th className={TH}>What it holds</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className={TD}><strong>Date</strong></td><td className={TD}>The transaction date as shown on the statement.</td></tr>
            <tr><td className={TD}><strong>Description</strong></td><td className={TD}>The payee or transaction description from the statement — the text imports match and categorize on.</td></tr>
            <tr><td className={TD}><strong>Amount</strong></td><td className={TD}>The transaction amount as a plain number, ready for the importing tool to total.</td></tr>
            <tr><td className={TD}><strong>Balance</strong></td><td className={TD}>The running balance after that transaction, where the statement itself prints one. If your statement has no balance column, the CSV leaves it out rather than inventing one.</td></tr>
          </tbody>
        </table>
      </div>
      <p className={P}>
        Before the download, the converter also runs a balance check on every conversion: where
        the statement carries balances, the preview shows the opening and closing position so a
        missing or doubled row is visible before you import anything.
      </p>

      <h2 className={H2M}>Why CSV is the format that goes anywhere</h2>
      <p className={P}>
        CSV is the lowest common denominator of financial data — deliberately. Because the file
        is plain text with one row per transaction, it is not tied to any one app: the same file
        opens in a spreadsheet today, imports into your accounting tool tomorrow, and can be read
        by a script or a database years from now. There is nothing proprietary to break and no
        formatting to lose. That portability is why banks, bookkeepers and software all speak
        CSV even when they prefer their own formats at home.
      </p>
      <p className={P}>
        Typical next steps for the file you download here: open it in Excel or Google Sheets to
        review and categorize a month of spending; import it into your accounting or bookkeeping
        tool to skip manual entry; or archive it alongside the original PDF as the searchable,
        sortable copy of the statement.
      </p>

      <h2 className={H2M}>CSV or Excel — which should you download?</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className={TH}></th>
              <th className={TH}>CSV</th>
              <th className={TH}>Excel (.xlsx)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className={TD}><strong>What it is</strong></td><td className={TD}>Plain text, one row per transaction</td><td className={TD}>A spreadsheet workbook</td></tr>
            <tr><td className={TD}><strong>Best for</strong></td><td className={TD}>Importing into accounting tools and other software</td><td className={TD}>Working in the file yourself — sorting, filtering, totals</td></tr>
            <tr><td className={TD}><strong>Formulas &amp; formatting</strong></td><td className={TD}>None — values only</td><td className={TD}>Kept when you add them and save</td></tr>
            <tr><td className={TD}><strong>Opens in</strong></td><td className={TD}>Any spreadsheet, text editor or import tool</td><td className={TD}>Excel, Google Sheets and other spreadsheet apps</td></tr>
          </tbody>
        </table>
      </div>
      <p className={P}>
        Both come from the same converter above — pick CSV here, or use the{" "}
        <Link href="/bank-statement-to-excel" className={INLINE_LINK}>bank statement to Excel converter</Link>{" "}
        if the workbook is the destination. Going the other way with a QuickBooks file? The{" "}
        <Link href="/tools/qbo-to-csv" className={INLINE_LINK}>QBO to CSV converter</Link>{" "}
        turns an existing QBO file back into a CSV. And if your statement is headed for
        QuickBooks in the first place, the{" "}
        <Link href="/pdf-to-qbo" className={INLINE_LINK}>PDF to QBO converter</Link>{" "}
        skips the spreadsheet step entirely.
      </p>
    </FormatLanding>
  );
}
