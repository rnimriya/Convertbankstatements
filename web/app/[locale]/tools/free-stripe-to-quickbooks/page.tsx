import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { PayoutConverter } from "@/components/tools/PayoutConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/free-stripe-to-quickbooks";

export const metadata: Metadata = {
  title: "Stripe QBO Converter — Free Stripe Payouts to QuickBooks | Convert Statement",
  description:
    "Free Stripe QBO converter: turn a Stripe payout CSV into QuickBooks-ready books — gross sales, refunds, and fees split through a clearing account with a payout tie-out check. Free per-payout summary with no account needed, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Stripe QBO Converter — Stripe Payouts to QuickBooks",
    description:
      "Upload a Stripe payout CSV — get gross, fees, and refunds split correctly for QuickBooks with a tie-out check. Free.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "Why doesn't my Stripe payout match my sales in QuickBooks?",
    a: "A payout is not a sale. It is gross sales minus fees, minus refunds and disputes, bundled into one deposit. Your bank feed shows only the net, so booking the deposit as income understates revenue and hides fees. This tool unpacks each payout through a clearing account instead.",
  },
  {
    q: "Which Stripe export should I upload?",
    a: "The Payout Reconciliation (itemized) report for one payout gives the full breakdown. Stripe's Balance transactions CSV also works. The Payouts list alone only has payout totals — the tool will list them but can't build the clearing entries without the itemized detail.",
  },
  {
    q: "How do refunds and disputes appear in the export?",
    a: "Refunds appear as contra-income lines that reduce gross sales, processing fees become expense lines, and disputes appear as separate lines plus the dispute fee Stripe charges — returned only if you win. A fully refunded charge still costs you the $0.30 fixed fee, and that flows through to the fee line.",
  },
  {
    q: "What is the payout tie-out check?",
    a: "The tool verifies Gross − Fees − Refunds − Disputes = Payout for every payout. A green 'Ties out' badge means the payout reconciles to the penny. If it shows a difference, check Stripe for reserve holds, instant-payout fees, or activity from other days swept into the payout before importing.",
  },
  {
    q: "How do I import the QBO into QuickBooks?",
    a: "First create a bank account in QuickBooks named 'Stripe Clearing'. Import the QBO there, then match the transfer line against the payout deposit in your bank feed. When the clearing account nets to zero, the payout is fully reconciled. The CSV works the same way through QuickBooks Online's manual upload.",
  },
  {
    q: "Can Stripe connect to QuickBooks Online?",
    a: "Not natively — Stripe and QuickBooks Online have no two-way connection, so businesses use a sync app or a file-based workflow. Sync apps push each payout in as a lump sum, which hides fees and refunds. This converter takes the file route: the payout CSV becomes clearing-account entries you import once.",
  },
  {
    q: "How do I record Stripe fees in QuickBooks?",
    a: "Stripe fees never arrive as separate transactions — they are deducted inside each payout, so recording only the net understates both revenue and expenses. This tool splits every payout into gross sales, refunds, and the exact fees charged, and posts the fees as expense lines through the clearing account.",
  },
  {
    q: "How much does Stripe charge per transaction?",
    a: "For US online card payments, Stripe's standard pricing is 2.9% of the charge plus a $0.30 fixed fee per successful charge. The percentage part comes back on a refund; the $0.30 does not. Rates vary by country and plan — this converter reads the fee from each row of your export.",
  },
  {
    q: "Why is my payout smaller than fees and refunds explain?",
    a: "Usually one of three: a reserve hold, a dispute, or an instant-payout fee. Stripe may hold back part of a payout, deduct a dispute before you respond, or carry a balance forward from a refund-heavy week. The tie-out check flags the difference per payout so you can find it.",
  },
  {
    q: "Is my data uploaded to your servers?",
    a: "No. Your CSV is processed in memory to build the payout summary and the download files, and it is not stored on our servers afterwards. Nothing is kept between sessions, and we never sell, share, or use your financial data for anything else.",
  },
];

const HOWTO = [
  { title: "Export from Stripe", body: "In Stripe, export the Payout Reconciliation (itemized) report or Balance transactions as CSV." },
  { title: "Upload it here", body: "Drop the CSV in — the tool auto-detects the format and groups everything into payouts." },
  { title: "Review the tie-out", body: "Check each payout's gross, fees, and refunds, and confirm the payout ties out to the bank deposit." },
  { title: "Import into QuickBooks", body: "Download the CSV free, or the QBO on Pro, and import it into a Stripe Clearing account in QuickBooks." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function StripeToQuickBooksPage() {
  return (
    <ToolPageLayout
      eyebrow="Free Tool"
      title="Stripe QBO Converter"
      subtitle="Turn a Stripe payout CSV into QuickBooks-ready books: gross sales, refunds, and fees correctly split through a clearing account — with a payout tie-out check."
      tool={<PayoutConverter provider="stripe" />}
      currentPath="/tools/free-stripe-to-quickbooks"
      faqs={FAQS}
      howToName="How to record Stripe payouts in QuickBooks"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why your Stripe deposit is not your revenue</h2>
          <p className={P}>
            When a customer pays you through Stripe, two different things happen on two different
            clocks. The sale happens the moment the charge succeeds; the money arrives days later,
            bundled with every other charge in that payout window, after Stripe has taken its cut
            and settled the refunds. Your bank feed only ever shows the final bundled number — a
            figure that is neither a day's sales nor a week's. If that deposit is what you book as
            income, your revenue is understated by every fee and refund inside it, your processing
            costs never reach the P&L, and month-end turns into archaeology: digging through Stripe
            to explain why QuickBooks and the bank disagree.
          </p>
          <p className={P}>
            Accountants who handle Stripe every month solve this the same way: they never book the
            deposit at all. They book the payout's contents — gross sales, refunds, and fees — into
            a clearing account, and let the deposit simply clear it. The sections below walk through
            what is inside a payout, how the clearing method works, and a worked example with the
            arithmetic shown.
          </p>

          <h2 className={H2M}>Inside a Stripe payout</h2>
          <p className={P}>
            A payout CSV is a bundle of different kinds of movement, and each kind belongs somewhere
            different in QuickBooks. The itemized reports expose six; the converter sorts every row
            into one of them before building any entries:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Line in the export</th>
                  <th className={TH}>What it really is</th>
                  <th className={TH}>Where it belongs in QuickBooks</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Charge (gross)</strong></td><td className={TD}>A successful card payment, before any deductions</td><td className={TD}>Income, posted into the clearing account</td></tr>
                <tr><td className={TD}><strong>Processing fee</strong></td><td className={TD}>Stripe's charge for the payment — 2.9% plus $0.30 per successful charge at US standard rates</td><td className={TD}>Merchant fees expense</td></tr>
                <tr><td className={TD}><strong>Refund</strong></td><td className={TD}>Money returned to a customer; the percentage fee comes back, the $0.30 fixed fee does not</td><td className={TD}>Contra-income, reducing gross sales</td></tr>
                <tr><td className={TD}><strong>Dispute</strong></td><td className={TD}>A chargeback opened by the customer's bank, plus the dispute fee Stripe charges</td><td className={TD}>Contra-income and expense, tracked on its own lines</td></tr>
                <tr><td className={TD}><strong>Reserve hold or release</strong></td><td className={TD}>Part of a payout Stripe withholds, or an earlier hold paid out later</td><td className={TD}>Clearing account only — never income or expense</td></tr>
                <tr><td className={TD}><strong>Net payout</strong></td><td className={TD}>The amount that actually lands in your bank account</td><td className={TD}>A transfer from clearing to checking</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>The fee, in detail: 2.9% + 30¢</h2>
          <p className={P}>
            Stripe's standard US pricing for online card payments takes 2.9% of every successful
            charge, plus a fixed $0.30. The two halves behave differently when money moves
            backwards. Refund a charge and the 2.9% comes back to you; the $0.30 never does — a
            fully refunded order still costs you thirty cents. Disputes cost more: the amount is
            pulled from your balance first and a dispute fee added on top, and both are returned
            only if you win the case.
          </p>
          <p className={P}>
            International cards and currency conversion add their own percentages on top of the
            standard rate, which is why this converter never estimates fees from a rate card. It
            reads the fee Stripe actually recorded on each row of your export — the only version
            of the number your books should ever contain.
          </p>

          <h2 className={H2M}>How this converter rebuilds each payout</h2>
          <p className={P}>
            Upload the itemized export and the tool reads every balance transaction, groups the rows
            by the payout they belong to, and totals each group. Gross charges become income lines,
            fees become expense lines, and refunds and disputes become their own contra lines — all
            pointed at a Stripe Clearing account in the output file, followed by one transfer line
            for the net amount. Every entry carries a unique transaction ID derived from the payout,
            so importing the same file twice cannot double the books.
          </p>
          <p className={P}>
            Before anything is downloaded, the tie-out check re-adds each payout: gross minus fees
            minus refunds minus disputes must equal the amount Stripe actually sent. If a reserve
            hold, an instant-payout fee, or a stray row from another day is hiding in the file, the
            check flags the difference on that payout instead of letting it surface in your bank
            reconciliation weeks later. The per-payout summary is free to view with no account; the
            CSV download is free, and the QBO file is on Pro.
          </p>

          <h2 className={H2M}>The clearing-account method, step by step</h2>
          <p className={P}>
            A clearing account is a bank-type account in QuickBooks that exists only to hold money
            in transit. Stripe money passes through it; your real bank account only ever sees the
            transfer. Set it up once and every payout follows the same five steps:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li>Create a bank account in QuickBooks named <strong className="text-zinc-900 dark:text-white">Stripe Clearing</strong> (one-time setup).</li>
            <li>Record gross charges as income into Stripe Clearing — revenue is recognized in full, on the sale dates.</li>
            <li>Record processing fees as an expense and refunds as contra-income against the same account.</li>
            <li>When the payout lands, record a transfer from Stripe Clearing to your checking account for the exact net amount.</li>
            <li>Match that transfer to the deposit in your bank feed.</li>
          </ol>
          <p className={P}>
            After step five, the clearing account's balance for that payout is zero — proof, inside
            QuickBooks itself, that every cent of the deposit has been explained.
          </p>

          <h2 className={H2M}>Getting the right file out of Stripe</h2>
          <p className={P}>
            In the Stripe Dashboard, open the reports area and run the <strong className="text-zinc-900 dark:text-white">Payout
            Reconciliation</strong> report in its itemized form for the payout you want, then download the CSV.
            The <strong className="text-zinc-900 dark:text-white">Balance transactions</strong> export works too — it carries the same per-charge
            gross, fee, and net columns, and the converter groups it into payouts for you. What does
            not work is the plain Payouts list: it holds totals only, with no per-charge detail, so
            there is nothing to split. Export one payout at a time while you build the habit; a
            month at a time works once the routine is set.
          </p>

          <figure className="mt-10">
            <img src="/tools/csv-to-qbo-review.webp" alt="A bookkeeper reviewing a Stripe payout breakdown line by line against the bank deposit" className="w-full rounded-[20px] border border-[#E3EDE0]" loading="lazy" />
            <figcaption className="mt-2 text-center text-xs text-zinc-400">Illustration: checking a payout's gross, fees, and refunds against the deposit before it is imported.</figcaption>
          </figure>

          <h2 className={H2M}>A worked example: one payout, tied out</h2>
          <p className={P}>
            Sample numbers, simplified on purpose. A small store takes 40 successful charges inside
            one payout window:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Line</th><th className={TH}>Amount</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}>Gross charges (40 charges)</td><td className={TD}>$2,500.00</td></tr>
                <tr><td className={TD}>Refunds (2 orders)</td><td className={TD}>−$200.00</td></tr>
                <tr><td className={TD}>Processing fees (2.9% of gross = $72.50, plus 40 × $0.30 = $12.00)</td><td className={TD}>−$84.50</td></tr>
                <tr><td className={TD}>Disputes</td><td className={TD}>$0.00</td></tr>
                <tr><td className={TD}><strong>Net payout to the bank</strong></td><td className={TD}><strong>$2,215.50</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            The tie-out: $2,500.00 − $200.00 − $84.50 = $2,215.50. In the clearing account that
            becomes $2,500.00 of income, $200.00 of contra-income, and $84.50 of fee expense — a
            balance of exactly $2,215.50, which the transfer then moves to checking, leaving zero.
            Booked the lazy way, the same week would have shown $2,215.50 of "sales": revenue
            understated by $284.50 and the fees invisible. (Sample figures, shown for illustration.)
          </p>

          <h2 className={H2M}>Mistakes that quietly wreck Stripe bookkeeping</h2>
          <h3 className={H3}>Recording the deposit as income</h3>
          <p className={P}>
            The most common error, and the root of most of the others. The deposit is a bundle, not
            a sale: booking it as revenue understates income by every fee and refund inside it and
            makes your effective tax and reporting wrong in both directions — sales too low, expenses
            missing entirely.
          </p>
          <h3 className={H3}>Running a sync app and importing files too</h3>
          <p className={P}>
            Two routes posting the same money is worse than one imperfect route. If a connector is
            already pushing payouts into QuickBooks and you also import converted files, the second
            copy lands as extra revenue that only surfaces at reconciliation. Pick one route per
            account and stay with it.
          </p>
          <h3 className={H3}>Ignoring disputes and reserve holds</h3>
          <p className={P}>
            A payout that comes up short by exactly a dispute amount is not a mystery — Stripe
            deducted it before you ever saw the money. Holds behave the same way in reverse,
            releasing into a later payout. If these lines are never booked, the clearing account
            never quite reaches zero and every reconciliation inherits the difference.
          </p>
          <h3 className={H3}>Dropping refunds into an expense account</h3>
          <p className={P}>
            A refund is not a cost of doing business; it is a sale that un-happened. Booked as an
            expense it inflates both your revenue and your costs, and your gross margin — the number
            lenders and buyers actually look at — is wrong on every report.
          </p>

          <h2 className={H2M}>When a payout refuses to tie out</h2>
          <p className={P}>
            A difference is information, and its shape usually names the cause. Short by a
            percentage-like amount: a reserve hold. Short by a small fixed fee on every payout:
            instant payouts. A negative week after heavy refunds: Stripe carried the balance into
            the next payout instead of billing you. Charges near the window's edge: payout windows
            rarely align with calendar weeks. The tie-out on this page names the difference on each
            payout so you can match it to one of these causes; if the books and the bank still
            disagree after importing, the{" "}
            <a href="/tools/reconciliation-finder" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Reconciliation Difference Finder</a>{" "}
            compares your statement against QuickBooks entry by entry.
          </p>

          <h2 className={H2M}>Doing this every week? Make it a system</h2>
          <p className={P}>
            One payout is a task; a year of weekly payouts is a process. A free account keeps every
            conversion in one searchable history, so the file behind last quarter's numbers is never
            lost in a downloads folder. The dashboard adds bulk conversion when several exports land
            at once, and client portals if clients send you their Stripe exports — each client
            uploads through their own link and the conversion bills to you. QBO downloads sit on{" "}
            <a href="/pricing" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Pro</a>,
            together with higher limits across the statement tools. Before importing anything new,
            the{" "}
            <a href="/tools/free-qbo-cleanup-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO Duplicate Finder</a>{" "}
            will scan a file for repeated transaction IDs. However you run it, keep the rule that
            makes all of it work: the deposit is never the sale — the payout's contents are.
          </p>
        </>
      }
    />
  );
}
