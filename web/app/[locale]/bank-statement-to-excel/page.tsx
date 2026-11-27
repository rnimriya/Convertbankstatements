import type { Metadata } from "next";
import { withoutQbTools } from "@/lib/tools/qb-filter";
import { isIndiaSite } from "@/lib/site-region";

const IN = isIndiaSite();
import Link from "next/link";
import {
  FormatLanding,
  H2, H2M, P, TH, TD, INLINE_LINK,
  type LandingFaq, type LandingStep,
} from "@/components/landing/FormatLanding";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.convertstatement.online";

const PAGE_URL = `${BASE}/bank-statement-to-excel`;

export const metadata: Metadata = {
  title: "Bank Statement to Excel Converter — PDF to XLSX | Convert Statement",
  description: IN
    ? "Convert an Indian bank statement PDF (SBI, HDFC, ICICI, Axis, Kotak and more) to Excel (.xlsx): one row per transaction with dates, descriptions, amounts and the running balance where the statement shows one. First 8 pages free, no account needed; Excel export is included on every plan."
    : "Convert a PDF bank statement to Excel (.xlsx): one row per transaction with dates, descriptions, amounts and the running balance where the statement shows one. First 8 pages free, no account needed; Excel export is included on every plan.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Bank Statement to Excel Converter — PDF to XLSX",
    description:
      "Upload a statement PDF and download a clean Excel file — dates, descriptions, amounts and balances in proper columns. First 8 pages free.",
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
    title: "Download the Excel file",
    body: "Pick the Excel format and download the .xlsx file: one row per transaction, ready to sort, filter and total in Excel or any spreadsheet app.",
  },
];

// .in: same steps in simple words (owner order 2026-11-27). No cloud
// import options are mentioned — on .in the drop box has no source menu.
const STEPS_IN: LandingStep[] = [
  {
    title: "Upload your statement PDF",
    body: "Drop the PDF in the box above, or click the box to choose a file from your device. PDFs with a password also work — just type the password when asked. PDF only, up to 50 MB.",
  },
  {
    title: "Check the preview",
    body: "The converter reads your statement and shows the first transactions it found — date, description, amount and balance. We check the balance on every conversion, before you download.",
  },
  {
    title: "Download the Excel file",
    body: "Pick the Excel format and download the .xlsx file. One row for every transaction. Ready to sort, filter and total in Excel or any spreadsheet app.",
  },
];

const FAQS: LandingFaq[] = [
  {
    q: "How do I convert a bank statement PDF to Excel?",
    a: "Upload the statement PDF in the converter above, check the preview of the transactions it found, pick the Excel format and download the .xlsx file. Each transaction lands on its own row with its date, description and amount, plus the running balance where the statement shows one.",
  },
  {
    q: "Is converting a bank statement to Excel free?",
    a: IN
      ? "Your first 8 pages are free and no account is needed, and Excel export is included on the Free plan. If your statements run longer, the paid plans add more pages: Basic is ₹499/month for 25 pages, Pro is ₹1,999/month for 500 pages, and Business is ₹6,999/month for 2,000 pages."
      : "Your first 8 pages are free and no account is needed, and Excel export is included on the Free plan. If your statements run longer, the paid plans add more pages: Basic is $5/month for 25 pages, Pro is $20/month for 500 pages, and Business is $75/month for 2,000 pages.",
  },
  {
    q: "Which banks does this work with?",
    a: IN
      ? "The converter works with statement PDFs from Indian banks including SBI, HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra Bank, Punjab National Bank and Bank of Baroda — their converter pages are linked above. If your bank issues a standard PDF statement, upload it and check the preview before downloading."
      : "The converter works with statement PDFs from hundreds of banks, including JPMorgan Chase, Bank of America and Wells Fargo — their converter pages are linked above. If your bank issues a standard PDF statement, upload it and check the preview before downloading.",
  },
  {
    q: "My statement PDF is password-protected. Can I still convert it?",
    a: "Yes. The converter accepts password-protected PDFs — the same PDFs banks email or offer for download from online banking. Upload it the same way as any other statement.",
  },
  {
    q: "Are my statements stored after conversion?",
    a: "No. Files are processed in memory and deleted immediately after conversion — statement content is not stored. We never sell or share your financial data.",
  },
  {
    q: IN ? "Can I get CSV or other formats instead of Excel?" : "Can I get CSV or QuickBooks formats instead of Excel?",
    a: IN
      ? "Yes. The same converter also exports CSV on every plan, and OFX for Tally, QFX and Google Sheets on the Pro plan. If you only need plain text, the bank statement to CSV converter on this site uses the same upload; if your books are in Tally, export OFX and import it into Tally."
      : "Yes. The same converter also exports CSV on every plan, and QBO, QFX, OFX and Google Sheets on the Pro plan. If you only need plain text, the bank statement to CSV converter on this site uses the same upload; if your books are in QuickBooks, the PDF to QBO converter is the direct route.",
  },
];

// .in: same questions in simple words, Indian context (owner order
// 2026-11-27). Facts unchanged — 8 free pages, real ₹ prices, formats.
const FAQS_IN: LandingFaq[] = [
  {
    q: "How do I convert a bank statement PDF to Excel?",
    a: "Upload the statement PDF in the converter above. Check the preview of the transactions it found. Pick the Excel format and download the .xlsx file. Each transaction gets its own row with its date, description and amount — plus the running balance where your statement shows one.",
  },
  {
    q: "Is converting a bank statement to Excel free?",
    a: "Your first 8 pages are free and no account is needed. Excel export is included on the Free plan. If your statements run longer, the paid plans add more pages: Basic is ₹499/month for 25 pages, Pro is ₹1,999/month for 500 pages, and Business is ₹6,999/month for 2,000 pages.",
  },
  {
    q: "Which banks does this work with?",
    a: "The converter works with statement PDFs from Indian banks — SBI, HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra Bank, Punjab National Bank and Bank of Baroda. Their converter pages are linked above. If your bank gives a standard PDF statement, upload it and check the preview before downloading.",
  },
  {
    q: "My statement PDF has a password. Can I still convert it?",
    a: "Yes. The converter accepts password PDFs — the same PDFs banks email you or give for download from online banking. Upload it the same way as any other statement, and type the password when asked.",
  },
  {
    q: "Are my statements stored after conversion?",
    a: "No. Your file is converted in memory and deleted at once. We do not store your statement, and we never sell or share your financial data.",
  },
  {
    q: "Can I get CSV or other formats instead of Excel?",
    a: "Yes. The same converter also gives CSV on every plan. OFX for Tally, QFX and Google Sheets come on the Pro plan. If you only need plain text, the bank statement to CSV converter on this site uses the same upload. If your books are in Tally, download OFX and import it into Tally.",
  },
];

export default function BankStatementToExcelPage() {
  return (
    <FormatLanding
      eyebrow="Bank statement converter"
      title={<>Bank statement to <span className="text-[#2CA01C]">Excel</span> converter</>}
      subtitle={IN
        ? "Upload an Indian bank statement PDF — SBI, HDFC, ICICI, Axis, Kotak and more — and download a clean Excel (.xlsx) file. Every transaction gets its own row. Ready for Tally, GST and tax filing. First 8 pages free, no account needed."
        : "Upload a PDF bank statement and download a clean Excel (.xlsx) file — every transaction on its own row, with dates, descriptions and amounts in proper columns. First 8 pages free, no account needed."}
      pageUrl={PAGE_URL}
      softwareDescription="Convert PDF bank statements to Excel (.xlsx) with Convert Statement: one row per transaction with dates, descriptions, amounts and the running balance where the statement shows one. First 8 pages free."
      howToName="How to convert a bank statement to Excel"
      steps={IN ? STEPS_IN : STEPS}
      faqs={IN ? FAQS_IN : FAQS}
      showBanks
      sample1Hero
      related={withoutQbTools([
        { href: "/bank-statement-to-csv", label: "Bank Statement to CSV", desc: "The same converter with a plain-text CSV download — the most portable format." },
        { href: "/pdf-to-qbo", label: "PDF to QBO Converter", desc: "Skip the spreadsheet and turn a statement PDF straight into a QuickBooks QBO file." },
        { href: "/tools/qbo-to-csv", label: "QBO to CSV Converter", desc: "Already have a QBO file? Turn it back into a spreadsheet-ready CSV." },
      ])}
    >
      <h2 className={H2}>What the Excel file contains</h2>
      <p className={P}>
        {IN
          ? "The download is a normal Excel (.xlsx) file made from the transactions on your statement. It is not a photo of the PDF, and not a pasted table that breaks when you sort it. Every transaction gets its own row. Values sit in separate columns, so Excel can sort, filter and add them up:"
          : "The download is a regular .xlsx workbook built from the transactions on your statement — not a screenshot of the PDF and not a pasted table that falls apart when you sort it. Each transaction gets its own row, and the values sit in separate columns so Excel can sort, filter and add them up:"}
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
            <tr><td className={TD}><strong>Date</strong></td><td className={TD}>The transaction date as shown on the statement, so you can sort a month into order or filter to a single week.</td></tr>
            <tr><td className={TD}><strong>Description</strong></td><td className={TD}>The payee or transaction description from the statement — the text you search and categorize by.</td></tr>
            <tr><td className={TD}><strong>Amount</strong></td><td className={TD}>The transaction amount as a number, so totals, sums and averages work without re-typing or cleaning up currency symbols.</td></tr>
            <tr><td className={TD}><strong>Balance</strong></td><td className={TD}>The running balance after that transaction, where the statement itself prints one. If your statement has no balance column, the file simply leaves it out rather than inventing one.</td></tr>
          </tbody>
        </table>
      </div>
      <p className={P}>
        {IN
          ? "Before the download, we also check the balance on every conversion. Where your statement shows balances, the preview shows the opening and closing position. So a missing or doubled row is visible before the file reaches your books."
          : "Before the download, the converter also runs a balance check on every conversion: where the statement carries balances, the preview shows the opening and closing position so a missing or doubled row is visible before the file reaches your books."}
      </p>

      <h2 className={H2M}>What people do with the Excel file</h2>
      <div className="grid md:grid-cols-3 gap-5 mt-5">
        {[
          IN
            ? {
                title: "Bookkeeping",
                body: "Sort and filter a month of transactions. Group spending by description. Match the totals with your books — without typing a single line by hand.",
              }
            : {
                title: "Bookkeeping",
                body: "Sort and filter a month of transactions, group spending by description, and reconcile the totals against your accounting records — without typing a single line by hand.",
              },
          IN
            ? {
                title: "GST & tax filing",
                body: "Total income and expenses category by category in the spreadsheet, so the numbers behind your GST returns and ITR start from the statement itself — no re-typing for your CA.",
              }
            : {
                title: "Tax preparation",
                body: "Total income and deductible spending category by category in the spreadsheet, so the numbers you hand to your accountant or tax software start from the statement itself.",
              },
          IN
            ? {
                title: "Loan applications",
                body: "Check your own statement totals before you share the official PDF with a bank or lender. A spreadsheet makes a month of income and spending easy to check line by line.",
              }
            : {
                title: "Loan applications",
                body: "Check your own statement totals and spot anything unexpected before you share the official PDF with a lender — a spreadsheet makes a month of income and outgoings easy to review line by line.",
              },
        ].map((c) => (
          <div key={c.title} className="rounded-[24px] border border-[#D8E8D2] bg-white p-6">
            <h3 className="font-bold text-zinc-900">{c.title}</h3>
            <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{c.body}</p>
          </div>
        ))}
      </div>

      <h2 className={H2M}>Why not just retype or copy-paste the PDF?</h2>
      <p className={P}>
        {IN
          ? "A statement PDF is made for reading, not for data. If you copy-paste its table into a spreadsheet, descriptions break across rows, columns merge, and minus signs get lost. Every such mistake stays hidden until a total does not match. Typing by hand avoids that, but it takes hours for one statement and brings its own typing mistakes. Converting reads the statement once and gives you numbers already in columns. So in Excel, you check the bank's figures — not your typing."
          : "A statement PDF is made for reading, not for data. Copy-pasting its table into a spreadsheet splits descriptions across rows, merges columns and drops minus signs — and every error survives silently until a total does not match. Retyping avoids that but costs hours per statement and introduces its own typos. Converting reads the statement's structure once and hands you numbers that are already in columns, so the checking you do in Excel is checking the bank's figures, not your typing."}
      </p>
      <p className={P}>
        Prefer plain text over a workbook? The{" "}
        <Link href="/bank-statement-to-csv" className={INLINE_LINK}>bank statement to CSV converter</Link>{" "}
        runs the same conversion and downloads a CSV instead — better for importing into other
        tools.{IN ? " And if your books are in Tally, export OFX from the same converter — Tally accepts OFX for bank statement import." : <> And if the end destination is QuickBooks rather than a spreadsheet, go straight
        to the{" "}
        <Link href="/pdf-to-qbo" className={INLINE_LINK}>PDF to QBO converter</Link>.</>}
      </p>
    </FormatLanding>
  );
}
