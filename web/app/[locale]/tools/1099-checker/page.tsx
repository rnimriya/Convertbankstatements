import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { VendorChecker1099 } from "@/components/tools/VendorChecker1099";

const PAGE_URL = "https://www.convertstatement.online/tools/1099-checker";

export const metadata: Metadata = {
  title: "1099 Vendor Checker — Total Payments by Vendor from CSV or QBO | Convert Statement",
  description:
    "Free 1099 vendor checker: upload a bank CSV or QBO file and see total payments grouped by vendor, with name variants combined and vendors at or above a threshold you set highlighted. Informational report only — not tax filing or tax advice. No account needed.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "1099 Vendor Checker — Payments by Vendor",
    description:
      "Group outgoing payments by vendor from a bank CSV or QBO file and see who sits at or above a threshold you choose. Free informational report, no account.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "What does the 1099 vendor checker do?",
    a: "It reads a bank CSV or QBO file, takes only the money-out rows, and groups them by vendor — total paid, payment count, and last payment date for each. Vendors at or above the threshold you set are highlighted. It is an informational report only, not tax filing or advice.",
  },
  {
    q: "What threshold should I use?",
    a: "The tool's default threshold is $600, the familiar cutoff for reporting payments for services, and you can change it to any amount. Rules have exceptions and they change, so treat the default as a starting point for your review and confirm the current rules with your tax professional.",
  },
  {
    q: "How are vendor name variants handled?",
    a: "Names are normalized before grouping: capitalization and punctuation are ignored, and common entity suffixes such as LLC and Inc, plus trailing store or location numbers, are stripped. “ACME LLC”, “Acme, LLC”, and “ACME” therefore total as one vendor instead of three small ones slipping under your threshold.",
  },
  {
    q: "Does it count deposits and money in?",
    a: "No. Only money-out rows (negative amounts) count as payments to vendors. Deposits, refunds in, and other money-in rows are ignored, so a vendor who also paid you does not inflate the total you review at year end.",
  },
  {
    q: "Which files does it accept?",
    a: "A bank transaction CSV with date, description, and amount columns, or a QBO, OFX, or QFX file exported from your bank or QuickBooks. Both go through the same grouping, so you get the same vendor list either way — use whichever export you already have.",
  },
  {
    q: "Is this tax filing or tax advice?",
    a: "No. This is an informational report only — not tax filing and not tax advice. Thresholds and rules have real exceptions: payments to corporations and payments made by card are often treated differently, for example. Confirm your actual filing obligations with your tax professional before January deadlines.",
  },
  {
    q: "What kinds of payments count toward the $600 threshold?",
    a: "Generally, payments of $600 or more to an unincorporated vendor or contractor for services — the payments Form 1099-NEC exists to report. Merchandise and goods generally do not count, most payments to corporations are excepted, and money your business received never counts. Exceptions are common; confirm with your tax professional.",
  },
  {
    q: "One vendor appears under two names. Will the totals combine?",
    a: "Yes, when the names are variants of each other. The checker ignores capitalization, punctuation, and entity suffixes, so “ACME LLC” at $400.00 and “Acme, LLC” at $350.00 combine into one vendor at $750.00 across two payments — above the $600 threshold, even though neither spelling reaches it alone.",
  },
  {
    q: "When should I collect a W-9 from a vendor?",
    a: "Before you pay them the first time — that is the habit that prevents the January scramble. With a W-9 on file you already hold the vendor's legal name and tax ID when forms are due, instead of chasing signatures while deadlines approach. The checker shows you who to ask.",
  },
  {
    q: "What should I do with the vendor report?",
    a: "Share it with your bookkeeper or tax professional, then work the highlighted list: request a W-9 from any vendor missing one, verify legal names and totals against your records, and keep the CSV with your year-end file. Vendors just below the threshold are worth a note for next year.",
  },
];

const HOWTO = [
  { title: "Export your payments", body: "Download a bank CSV for the year, or a QBO/OFX file, covering the accounts you pay vendors from." },
  { title: "Upload it here", body: "Drop the file in. Money-out rows are grouped by vendor, with name variants combined into one total per vendor." },
  { title: "Set your threshold", body: "The default threshold in the tool is $600 and you can change it — vendors at or above it are highlighted. Confirm the current rules with your tax professional." },
  { title: "Download the report", body: "Save the vendor report CSV for your records and share it with your bookkeeper or tax professional." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function VendorChecker1099Page() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="1099 Vendor Checker"
      subtitle="See what you paid each vendor this year: upload a bank CSV or QBO file and get payments grouped by vendor — name variants combined, deposits ignored, and vendors at or above your threshold highlighted."
      tool={<VendorChecker1099 />}
      currentPath="/tools/1099-checker"
      faqs={FAQS}
      howToName="How to total payments by vendor"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>The January scramble, and why it happens</h2>
          <p className={P}>
            Every January, the same question lands on bookkeepers: who did we pay this year,
            and how much? The answer is buried in a year of bank transactions where the same
            vendor never appears the same way twice — "ACME LLC" on one line, "Acme, LLC" on
            the next, a store number trailing a third. Totals built by eye miss those variants,
            and a vendor split across three spellings can slip under a reporting threshold
            that the combined total clearly crosses.
          </p>
          <p className={P}>
            This checker removes the manual part. Upload a bank CSV or QBO file and it groups
            the money-out rows by vendor — names normalized, deposits ignored — and totals each
            vendor with a payment count and a last payment date. Run it in January if you must;
            run it quarterly and January stops being an event at all.
          </p>
          <p className="mt-4 rounded-[20px] border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
            Informational report only — this is not tax filing or tax advice. Thresholds and rules have exceptions (for example, payments to corporations and payments made by card are often treated differently). Confirm your filing obligations with your tax professional.
          </p>

          <h2 className={H2M}>What counts toward the $600 threshold — and what does not</h2>
          <p className={P}>
            Form 1099-NEC exists to report payments for services, and the familiar threshold
            is $600 in a year to a single vendor. But not every dollar that leaves the account
            counts, and this checker deliberately totals payments, not conclusions — your tax
            professional makes the final call. The general shape of the rules:
          </p>
          <p className={P}>
            The threshold is per vendor, per calendar year — not per payment, and not per
            account. A vendor paid $250 from each of three accounts has been paid $750, and
            the rules look at the $750. That is why the threshold in this tool is yours to
            set: run it at $600 for the filing question, then run it lower — $400, say — to
            see who is one ordinary job away from crossing next year.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Payment</th>
                  <th className={TH}>Generally counts?</th>
                  <th className={TH}>Why</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Services by a freelancer or contractor</strong></td><td className={TD}>Yes</td><td className={TD}>The core case Form 1099-NEC exists to report.</td></tr>
                <tr><td className={TD}><strong>Services by an LLC taxed as a sole proprietor or partnership</strong></td><td className={TD}>Often yes</td><td className={TD}>The suffix on the name is not the whole story; how the vendor is taxed matters.</td></tr>
                <tr><td className={TD}><strong>Merchandise and goods</strong></td><td className={TD}>No</td><td className={TD}>The form reports payments for services, not for products.</td></tr>
                <tr><td className={TD}><strong>Payments to corporations</strong></td><td className={TD}>Usually no</td><td className={TD}>Most corporate payments are excepted — though some categories, such as legal services, are treated differently.</td></tr>
                <tr><td className={TD}><strong>Payments made by credit or debit card</strong></td><td className={TD}>Not on your 1099</td><td className={TD}>The card processor reports those payments on its own form.</td></tr>
                <tr><td className={TD}><strong>Money your business received</strong></td><td className={TD}>Never</td><td className={TD}>Deposits are not payments to vendors; this checker counts money out only.</td></tr>
              </tbody>
            </table>
          </div>
          <figure className="mt-6 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-desk.webp" alt="A desk with a laptop, calculator and vendor paperwork during a year-end payment review" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">A year-end vendor review, minus the spreadsheet marathon.</figcaption>
          </figure>

          <h2 className={H2M}>How the checker builds your vendor list</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li><strong className="text-zinc-900 dark:text-white">Read the file.</strong> A bank CSV or a QBO/OFX/QFX export — both produce the same vendor list.</li>
            <li><strong className="text-zinc-900 dark:text-white">Keep money out only.</strong> Deposits, refunds in, and transfers in are set aside before any totaling happens.</li>
            <li><strong className="text-zinc-900 dark:text-white">Normalize the names.</strong> Capitalization and punctuation are ignored, entity suffixes like LLC and Inc are stripped, and trailing store or location numbers come off.</li>
            <li><strong className="text-zinc-900 dark:text-white">Total each vendor.</strong> Total paid, number of payments, and the last payment date, per combined vendor.</li>
            <li><strong className="text-zinc-900 dark:text-white">Apply your threshold.</strong> The default is $600 and you can change it; vendors at or above it are highlighted in the table and in the downloaded report.</li>
          </ol>
          <p className={P}>
            Because the grouping is mechanical, the same file always produces the same list.
            Send the report to your tax professional and you are both working from identical
            numbers — no second spreadsheet with slightly different totals.
          </p>

          <h2 className={H2M}>Why one vendor hides under three names</h2>
          <p className={P}>
            Name drift is not a cosmetic problem; it changes who crosses the threshold. This
            extract from a sample year shows the effect (sample data, shown for illustration):
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Name on the statement</th><th className={TH}>Payments</th><th className={TH}>Total</th><th className={TH}>Against $600</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}>ACME LLC</td><td className={TD}>1</td><td className={TD}>$400.00</td><td className={TD}>Below — on its own</td></tr>
                <tr><td className={TD}>Acme, LLC</td><td className={TD}>1</td><td className={TD}>$350.00</td><td className={TD}>Below — on its own</td></tr>
                <tr><td className={TD}><strong>ACME (combined)</strong></td><td className={TD}><strong>2</strong></td><td className={TD}><strong>$750.00</strong></td><td className={TD}><strong>Above — the total that matters</strong></td></tr>
                <tr><td className={TD}>Beta Design Co</td><td className={TD}>3</td><td className={TD}>$599.99</td><td className={TD}>Below — by one cent</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Read separately, neither ACME spelling reaches $600, and a manual review would
            wave both through. Combined — the way the filing rules see the vendor — it is one
            vendor paid $750.00, and it belongs on the list. Beta Design Co is the other
            January trap in miniature: one more small job in December and it crosses too, which
            is exactly why a quarterly check beats a yearly one.
          </p>

          <h2 className={H2M}>Preparing a clean payments file</h2>
          <p className={P}>
            Export the full calendar year, from every account you pay vendors from — a vendor
            paid out of two accounts has two partial totals sitting in two files, and neither
            one is the truth. Do not pre-filter the export in a spreadsheet: the checker
            ignores money in on its own, and rows deleted by hand are how payments quietly go
            missing. If some vendors are paid by card, expect them to be absent here and note
            that on the report rather than hunting for them later — card payments live in a
            different reporting lane in any case.
          </p>
          <p className={P}>
            And if you start mid-year, resist the temptation to export only from today
            onward. The threshold is annual, so a vendor paid $500 in February and $200 in
            October is a $700 vendor — a partial-year file will report them as safely under
            the line, and it will be wrong. Always pull January 1 forward, even when the
            review itself happens in July; the extra rows cost nothing, because the checker
            does the reading.
          </p>

          <h2 className={H2M}>When the totals look wrong</h2>
          <h3 className={H3}>A vendor is missing entirely</h3>
          <p className={P}>
            They were not paid from this account, in this file. The usual reasons: paid by
            card, paid in cash, or paid from a second bank account. Re-run the checker with
            the other account's export and compare the two reports before combining anything
            by hand.
          </p>
          <h3 className={H3}>One vendor is still split into two totals</h3>
          <p className={P}>
            Normalization merges spelling, punctuation, and suffix variants — but a genuinely
            different name, such as a trade name versus a legal name, will not merge, and
            should not: only you know the two are the same business. Note the pair on the
            report for your tax professional rather than forcing a merge that might be wrong.
          </p>
          <h3 className={H3}>A total looks too high</h3>
          <p className={P}>
            Check the source file for duplicate rows — an export run twice with overlapping
            date ranges is the classic cause, and it inflates every vendor it touches. The{" "}
            <a href="/tools/free-qbo-cleanup-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO Duplicate Finder</a>{" "}
            flags repeated transactions in a QBO file before you total anything.
          </p>
          <h3 className={H3}>The report includes employees or the owner</h3>
          <p className={P}>
            The checker totals every money-out row with a name on it, and a bank export does
            not label which payments were wages or owner draws. If salaries or draws run
            through the same account, those names appear in the report too. They do not belong
            in vendor totals — set them aside in your review, and treat their presence as a
            reminder that the report is a starting list, not a filing.
          </p>
          <h3 className={H3}>A contractor is also on payroll</h3>
          <p className={P}>
            Wages belong in payroll, not in vendor totals. If someone appears in both worlds,
            their contractor payments belong in this report and their wages belong in the
            payroll records — two separate stories that should stay separate in your review
            as well. The{" "}
            <a href="/tools/payroll-journal-generator" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Payroll Journal Generator</a>{" "}
            builds the entry for the payroll side.
          </p>

          <h2 className={H2M}>The W-9 habit that ends the scramble</h2>
          <p className={P}>
            Totals are only half of a filing. For each vendor over the line you also need a
            legal name and a tax ID, and both live on Form W-9. Collected before the first
            payment — as a routine condition of getting paid — a W-9 costs one email.
            Collected in January, it costs twenty, plus the vendors who have moved, closed,
            or stopped answering. Use this report as the request list: everyone above the
            threshold, plus everyone close enough to cross it next year, gets the request
            while there is still time to be polite about it.
          </p>
          <p className={P}>
            There is a second reason to collect the form early: the legal name on the W-9 is
            the name the filing has to match. A vendor you know by a trade name may file taxes
            under a different legal name entirely, and a mismatch between the name and tax ID
            on a form can draw follow-up notices that take far longer to resolve than the
            original request would have. The report gives you the payment facts; the W-9 gives
            you the filing facts; January goes smoothly when both are already in the drawer.
          </p>

          <h2 className={H2M}>Checking vendors every quarter? Make it a system</h2>
          <p className={P}>
            Run quarterly, this report stops being a tax-season artifact and becomes a
            bookkeeping habit — thresholds crossed in March are W-9s collected in April, not
            surprises in January. The checker itself is completely free with no account.
            Around it, a free account keeps your statement conversions in one searchable
            history, the dashboard adds bulk conversion when statements land for several
            accounts at once, and client portals let bookkeepers gather files from clients
            through their own upload links. The bank activity behind these totals comes from
            the same exports as the{" "}
            <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a>{" "}
            — check the vendors here, convert the statements there, and the year closes
            itself a quarter at a time.
          </p>
        </>
      }
    />
  );
}
