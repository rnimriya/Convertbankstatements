import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { PayrollJournal } from "@/components/tools/PayrollJournal";

const PAGE_URL = "https://www.convertstatement.online/tools/payroll-journal-generator";

export const metadata: Metadata = {
  title: "Payroll Journal Entry Generator — Balanced Entry for QuickBooks | Convert Statement",
  description:
    "Free payroll journal entry generator: enter gross pay, withholdings, and employer taxes and get a balanced payroll journal entry, checked against net pay, ready to download as a QuickBooks Online journal CSV or a QuickBooks Desktop IIF file. Runs in your browser, no account needed.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Payroll Journal Entry Generator — For QuickBooks",
    description:
      "Build a balanced payroll journal entry from your payroll totals, verify net pay, and download it as a QBO journal CSV or Desktop IIF file. Free, in your browser.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "What does a payroll journal entry include?",
    a: "The standard entry debits Wages Expense for gross pay and Payroll Tax Expense for the employer's share (employer Social Security and Medicare, FUTA, and SUTA). It credits the withholding payables (federal, state, and the combined employee + employer Social Security and Medicare payables), the FUTA and SUTA payables, and Wages Payable for the net pay your employees received.",
  },
  {
    q: "How does the generator check net pay?",
    a: "It computes net pay as gross wages minus the employee deductions — federal withholding, state withholding, employee Social Security, and employee Medicare — and compares it with the net pay you entered. If they differ, the entry is marked out of balance and the expected net pay is shown, because a journal entry cannot balance with the wrong net pay credit.",
  },
  {
    q: "Why must debits equal credits before import?",
    a: "QuickBooks rejects a journal entry whose debits and credits do not match. The generator totals both sides live as you type and only enables the downloads when the two totals are equal and net pay checks out, so the file you download is one QuickBooks will accept.",
  },
  {
    q: "What is the difference between the CSV and the IIF download?",
    a: "The CSV is the journal format for QuickBooks Online: one row per line with the journal date, account, debit, credit, and a payroll description. The IIF file is the tab-delimited import format for QuickBooks Desktop, written as a GENERAL JOURNAL transaction with signed amounts (debits positive, credits negative). Pick the one that matches your QuickBooks product.",
  },
  {
    q: "Can I use my own account names?",
    a: "Yes. The account fields are prefilled with the usual names — Wages Expense, Payroll Tax Expense, the withholding and tax payables, and Wages Payable — and you can change any of them to match your chart of accounts before downloading. The amounts and the balancing checks do not change.",
  },
  {
    q: "Is my payroll data uploaded or stored?",
    a: "No. This tool runs entirely in your browser: there is no upload and no API call, and nothing you type is sent or stored. Close the tab and the numbers are gone.",
  },
];

const HOWTO = [
  { title: "Get your payroll totals", body: "From your payroll report for the period: gross wages, each withholding, the employer taxes, and the net pay that was actually paid." },
  { title: "Enter the totals", body: "Type the period dates and the amounts into the form, and adjust any account names to match your chart of accounts." },
  { title: "Check the balance", body: "Watch the live preview: the status turns green when debits equal credits and net pay matches gross minus employee deductions." },
  { title: "Download and import", body: "Download the QuickBooks Online journal CSV or the QuickBooks Desktop IIF file and import it into QuickBooks." },
];

export default function PayrollJournalGeneratorPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="Payroll Journal Entry Generator"
      subtitle="Turn your payroll totals into a balanced journal entry: check net pay against gross minus deductions as you type, then download the entry for QuickBooks Online or Desktop."
      tool={<PayrollJournal />}
      currentPath="/tools/payroll-journal-generator"
      faqs={FAQS}
      howToName="How to build a payroll journal entry"
      howToSteps={HOWTO}
      privacyLine="No account needed · Runs in your browser, nothing is uploaded"
      content={
        <>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Why payroll entries end up out of balance</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            A payroll journal entry has a lot of moving parts: gross wages, two kinds of
            withholding, employee and employer shares of Social Security and Medicare, FUTA,
            SUTA, and net pay. Miss one employer share, or type a net pay that does not match
            gross minus the employee deductions, and the entry will not balance — and
            QuickBooks will not take it. This generator does the arithmetic as you type,
            combines the employee and employer shares into the right payable lines, and
            tells you exactly which figure is off when the entry does not balance.
          </p>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-12">What this tool handles</h2>
          <ul className="mt-4 space-y-2.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <li><strong className="text-zinc-900 dark:text-white">The full standard entry</strong> — wage and payroll-tax expense debits, and credits for every withholding, tax payable, and net wages payable.</li>
            <li><strong className="text-zinc-900 dark:text-white">Net-pay check</strong> — computed net pay (gross minus employee deductions) is compared with the net pay you entered, live.</li>
            <li><strong className="text-zinc-900 dark:text-white">Balance gate</strong> — downloads stay disabled until debits equal credits, with the reason shown.</li>
            <li><strong className="text-zinc-900 dark:text-white">Both QuickBooks formats</strong> — a journal CSV for QuickBooks Online and a GENERAL JOURNAL IIF file for QuickBooks Desktop.</li>
            <li><strong className="text-zinc-900 dark:text-white">Your account names</strong> — every account field is editable, prefilled with the usual names.</li>
          </ul>
          <p className="mt-5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Reconciling payroll against the bank account afterwards? The{" "}
            <a href="/tools/reconciliation-finder" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">Reconciliation Difference Finder</a>{" "}
            hunts down the amount a reconciliation is off by, and the{" "}
            <a href="/tools/csv-to-qbo" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">CSV to QBO converter</a>{" "}
            brings the bank activity itself into QuickBooks.
          </p>
        </>
      }
    />
  );
}
