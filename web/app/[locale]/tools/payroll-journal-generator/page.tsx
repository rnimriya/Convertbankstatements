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
    a: "One balanced entry per pay period: gross wages debited to Wages Expense, employer payroll taxes debited to Payroll Tax Expense, and credits for each amount held back or owed — federal and state withholding, Social Security and Medicare, FUTA and SUTA payable — with net pay credited to Wages Payable (or your bank account when it has been paid). Debits and credits always total the same.",
  },
  {
    q: "Can I build the entry from a Gusto, ADP or Paychex report?",
    a: "Yes — that is the workflow this generator exists for. When payroll runs outside QuickBooks, the provider's payroll report for the period already holds every total you need: gross pay, each employee withholding, the employer taxes, and net pay. Type those totals in here and download one balanced entry instead of re-deriving the accounting from a pay stub.",
  },
  {
    q: "What happens if my entry is out of balance?",
    a: "The downloads stay locked. The generator totals debits and credits as you type and also checks that net pay equals gross wages minus employee deductions; until both hold, it names the difference instead of letting you export. QuickBooks refuses an unbalanced journal entry anyway — the generator simply refuses first, while the payroll report is still open.",
  },
  {
    q: "How do employer taxes appear in the entry?",
    a: "As their own debit and their own credits, never folded into wages. The employer's share of Social Security and Medicare, plus FUTA and SUTA, is debited to Payroll Tax Expense — a real cost of employing people, separate from gross wages — and credited to the matching tax payable accounts until the taxes are remitted.",
  },
  {
    q: "What is the difference between the CSV and the IIF download?",
    a: "Same entry, two doors. The CSV is the journal-import shape for QuickBooks Online; the IIF file is for QuickBooks Desktop, built with TRNS/SPL rows. Both are free, and both unlock only when the entry balances. Account names in either file are the ones you set in the form, so match them to your chart of accounts first.",
  },
  {
    q: "Is my payroll data uploaded or stored?",
    a: "No. The entry is calculated in your browser from the totals you type, and the downloads are generated locally — nothing is uploaded or stored. The generator is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Get your payroll totals", body: "From your payroll report for the period: gross wages, each withholding, the employer taxes, and the net pay that was actually paid." },
  { title: "Enter the totals", body: "Type the period dates and the amounts into the form, and adjust any account names to match your chart of accounts." },
  { title: "Check the balance", body: "Watch the live preview: the status turns green when debits equal credits and net pay matches gross minus employee deductions." },
  { title: "Download and import", body: "Download the QuickBooks Online journal CSV or the QuickBooks Desktop IIF file and import it into QuickBooks." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

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
          <h2 className={H2}>Why payroll entries end up out of balance</h2>
          <p className={P}>
            A payroll journal entry has more moving parts than any other routine entry: gross
            wages, federal and state withholding, employee and employer shares of Social
            Security and Medicare, FUTA, SUTA, and net pay. Miss one employer share,
            double-count an employee share, or type a net pay that does not equal gross minus
            the employee deductions, and the two sides disagree — and QuickBooks will not post
            a journal entry whose debits and credits do not match.
          </p>
          <p className={P}>
            This generator does the arithmetic as you type. It combines the employee and
            employer shares into the right payable lines, checks your net pay against the
            computed figure live, and tells you exactly which number is off when the entry does
            not balance — here, before the file exists, instead of inside QuickBooks at
            month-end.
          </p>

          <h2 className={H2M}>Anatomy of a balanced payroll entry</h2>
          <p className={P}>
            Strip away the payroll register and every payroll entry has the same skeleton.
            Gross wages are the expense. Everything withheld from the employee is a liability
            the business holds briefly on its way to the tax authorities. Employer taxes are a
            second, smaller expense of their own. And net pay is what actually leaves for the
            employees' bank accounts.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Line</th>
                  <th className={TH}>Side</th>
                  <th className={TH}>What it represents</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Gross wages</strong></td><td className={TD}>Debit</td><td className={TD}>Total pay before deductions — the Wages Expense line.</td></tr>
                <tr><td className={TD}><strong>Federal withholding</strong></td><td className={TD}>Credit</td><td className={TD}>Employee income tax withheld from wages, held for remittance.</td></tr>
                <tr><td className={TD}><strong>State withholding</strong></td><td className={TD}>Credit</td><td className={TD}>Employee state tax withheld from wages, held for remittance.</td></tr>
                <tr><td className={TD}><strong>Employee FICA</strong></td><td className={TD}>Credit</td><td className={TD}>Employee Social Security and Medicare — part of gross wages, redirected.</td></tr>
                <tr><td className={TD}><strong>Net pay</strong></td><td className={TD}>Credit</td><td className={TD}>What employees actually receive — Wages Payable until the money moves.</td></tr>
                <tr><td className={TD}><strong>Employer FICA</strong></td><td className={TD}>Debit</td><td className={TD}>The employer's matching Social Security and Medicare — a Payroll Tax Expense.</td></tr>
                <tr><td className={TD}><strong>Payroll taxes payable</strong></td><td className={TD}>Credit</td><td className={TD}>Employer shares (FICA, FUTA, SUTA) owed until they are deposited.</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Notice the asymmetry the skeleton explains: employee FICA is carved out of gross
            wages — it was always part of that debit, just redirected to a payable — while
            employer FICA is new money on top of wages, which is why it needs a debit of its
            own. Confusing those two is the single most common reason payroll entries refuse to
            balance.
          </p>
          <p className={P}>
            Two smaller lines complete the picture. FUTA — the federal unemployment tax — and
            SUTA, its state counterpart, are employer-only: no part of them is ever withheld
            from an employee, so they behave exactly like employer FICA, a debit to Payroll Tax
            Expense against a payable. And every payable in the entry is temporary by design.
            Withholding and tax payables are not the business's money; they are amounts in
            transit, and their balances should fall back as each deposit is remitted after the
            pay date.
          </p>
          <figure className="mt-6 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-review.webp" alt="A bookkeeper reviewing a payroll journal entry against the payroll report before posting it" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">Reviewing the entry line by line before it posts.</figcaption>
          </figure>

          <h2 className={H2M}>The balancing rule, and how this tool enforces it</h2>
          <p className={P}>
            Double-entry bookkeeping has one non-negotiable rule: total debits equal total
            credits. An entry that breaks it is not "close" — it is unpostable, and QuickBooks
            will refuse it. The generator totals both sides as you type and keeps the downloads
            locked until the rule holds and net pay checks out.
          </p>
          <p className={P}>
            The tool's own sample figures show the gate working (sample data): with the period
            totals entered correctly, the sides agree at total debits $5,547.50 = total credits
            $5,547.50, and net pay is $3,817.50 — exactly gross wages minus the employee
            deductions. Now mistype net pay as $3,800.00 and the credit side falls to
            $5,530.00. Nothing else changed, yet the entry is off by $17.50, the downloads
            lock, and the page names the reason — net pay does not match gross minus
            deductions. That is the mistake caught in the browser: free, instant, and before it
            can reach your books.
          </p>
          <p className={P}>
            The size of the difference is itself a clue, and experienced bookkeepers read it
            before they read anything else. A difference equal to one of the lines means that
            line is missing or doubled. A difference equal to twice a line usually means the
            line was posted to the wrong side. And a difference that matches no line at all is
            almost always net pay, which is why this generator checks net pay separately from
            the totals instead of leaving you to guess which of the three it is.
          </p>

          <h2 className={H2M}>Before you generate: getting your payroll totals</h2>
          <p className={P}>
            Work from the payroll report for the period, not from the bank statement — the bank
            only ever shows you net pay and tax deposits, never the gross story behind them.
            Pull these figures:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li><strong className="text-zinc-900 dark:text-white">Gross wages</strong> for the period, before any deduction.</li>
            <li><strong className="text-zinc-900 dark:text-white">Federal and state withholding</strong> totals for the period.</li>
            <li><strong className="text-zinc-900 dark:text-white">Employee FICA</strong> — the Social Security and Medicare withheld from employees.</li>
            <li><strong className="text-zinc-900 dark:text-white">Employer taxes</strong> — employer FICA, FUTA, and SUTA for the same period.</li>
            <li><strong className="text-zinc-900 dark:text-white">Net pay actually paid</strong> — it should tie to the payroll report and, later, to the bank withdrawal.</li>
          </ol>
          <p className={P}>
            Date the entry consistently — pay date or period end, the same choice every cycle —
            and rename any account fields to match your chart of accounts before you download,
            so the import never stops on an account QuickBooks has never heard of.
          </p>

          <h2 className={H2M}>Recording the entry in QuickBooks Online</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li>Download the journal CSV from this page.</li>
            <li>In QuickBooks Online, import it through the Import data screen — or open <strong className="text-zinc-900 dark:text-white">+ New → Journal entry</strong> and key the lines in from the on-screen preview.</li>
            <li>Create any missing accounts first if prompted; an import that names an unknown account will fail.</li>
            <li>Save, then confirm the trial balance did not move unexpectedly — the entry adds expenses and payables, never revenue.</li>
          </ol>

          <h2 className={H2M}>Recording the entry in QuickBooks Desktop</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li>Back up the company file — IIF imports are easy to make and tedious to unwind.</li>
            <li>Go to <strong className="text-zinc-900 dark:text-white">File → Utilities → Import → IIF Files</strong> and select the downloaded file.</li>
            <li>Open the journal (Reports → Accountant & Taxes → Journal) and review the GENERAL JOURNAL entry line by line before closing the period.</li>
          </ol>
          <p className={P}>
            Whichever product you use, finish with the same check: once the net pay clears the
            bank, Wages Payable should return to zero. A balance left sitting there means the
            entry and the actual payment have drifted apart.
          </p>

          <h2 className={H2M}>When the entry will not balance</h2>
          <h3 className={H3}>Net pay does not match</h3>
          <p className={P}>
            By far the most common cause. Net pay is not a free input — it is gross wages minus
            the employee deductions, and nothing else. If you typed the amount from a different
            period, or after a manual adjustment the payroll report does not show, the entry
            will be off by exactly that adjustment. The generator shows the net pay it expects;
            reconcile the difference there.
          </p>
          <h3 className={H3}>An employer share is missing</h3>
          <p className={P}>
            Leave out employer FICA — or FUTA and SUTA — and the debit side falls short by
            precisely that tax. The entry is not wrong about anything else; add the missing
            employer tax lines and the two sides meet.
          </p>
          <h3 className={H3}>An employee share is counted twice</h3>
          <p className={P}>
            Employee withholding is already inside gross wages. Entering it again as an
            additional expense debit double-counts it and pushes debits too high by the full
            amount of the share. Employee shares appear once in this entry: as credits, carved
            out of wages on their way to the payables.
          </p>
          <h3 className={H3}>You are off by a few cents</h3>
          <p className={P}>
            Per-employee rounding in the payroll system — each employee's FICA rounded to the
            cent, then totaled — can leave a cent or two against a figure computed from the
            period totals in one pass. The generator shows the exact difference; trace it to
            the payroll report's rounding rather than forcing a line to fit.
          </p>

          </>
      }
    />
  );
}
