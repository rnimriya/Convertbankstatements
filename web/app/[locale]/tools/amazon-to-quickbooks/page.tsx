import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { PayoutConverter } from "@/components/tools/PayoutConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/amazon-to-quickbooks";

export const metadata: Metadata = {
  title: "Amazon to QuickBooks Converter — Free Amazon Settlement to QBO | Convert Statement",
  description:
    "Free Amazon settlement to QuickBooks converter: turn an Amazon settlement CSV into clearing-account entries (gross sales, refunds, fees) with a settlement tie-out check. Free per-settlement summary with no account; QBO download is on Pro.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Amazon to QuickBooks Converter — Amazon Settlement to QBO",
    description:
      "Upload an Amazon settlement CSV — get gross, refunds, and fees split correctly for QuickBooks with a tie-out check. Free to scan.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How often does Amazon settle and pay out?",
    a: "Amazon closes a settlement every 14 days for most seller accounts, then disburses the net a few days later. That rhythm is why the deposit never matches a calendar week or month: each settlement covers its own window, on Amazon's cycle. The books should follow the settlement window rather than the calendar — which is why this converter groups strictly by settlement ID, never by date.",
  },
  {
    q: "Which Amazon export should I upload?",
    a: "The settlement report in its transaction view, as a CSV, with the columns settlement-id, date, transaction-type, order-id, amount, and fee. Settlement layouts vary by marketplace and report version, so rename differently-named headers to match before uploading. Download the transaction view, not the summary view — the summary shows totals only, and there is nothing in it to split or tie out.",
  },
  {
    q: "Does this converter separate referral fees from FBA fees?",
    a: "Not into separate lines. The converter reads the fee recorded on each row and totals a settlement's fees into one fees line — referral fees, FBA fees, and fee-type rows together. That is enough to reconcile the deposit exactly. For the referral-versus-FBA split, which matters when diagnosing whether pricing or fulfilment costs are creeping, keep the original settlement report, where transaction types still distinguish them.",
  },
  {
    q: "Why does my settlement span two calendar months?",
    a: "Because settlements run on Amazon's 14-day cycle, not on month boundaries — a settlement that opens on January 28 closes in February. Splitting it by order date to force it into one month breaks its tie-out and strands half-entries in two periods. Record the whole settlement as its own unit; monthly reports can still be produced from the clearing account's activity.",
  },
  {
    q: "Can an Amazon settlement come out negative?",
    a: "Yes. A refund-heavy period, or one large chargeback, can exceed the period's sales, and Amazon then carries the shortfall into the next settlement instead of paying out. In the clearing-account method nothing special is needed: the settlement's lines leave Amazon Clearing negative, and the next settlement covers it — exactly how Amazon itself carries the balance. The tie-out still has to hold for each settlement on its own.",
  },
  {
    q: "Is this Amazon to QuickBooks converter free?",
    a: "The scan, the per-settlement summary, the tie-out check, and the clearing-entries CSV download are free with no account. The .QBO download is on Pro. Your settlement file is processed in memory and is not stored afterwards. Grouping is by settlement ID, so a file containing two settlements produces two summaries, each tied out on its own.",
  },
];

const HOWTO = [
  { title: "Export from Amazon", body: "In Seller Central, go to Reports → Payments and download the settlement report (transaction view) as a CSV, with settlement-id, date, transaction-type, order-id, amount, and fee columns — rename headers if your marketplace's layout differs." },
  { title: "Upload it here", body: "Drop the CSV in (max 10 MB, no account). The tool groups everything into settlements by settlement ID automatically." },
  { title: "Review the tie-out", body: "Check each settlement's gross, refunds, and fees, and confirm the settlement ties out to the deposit total recorded in the file." },
  { title: "Download and import", body: "Download the clearing-entries CSV free, or the .QBO on Pro, and import it into an Amazon Clearing account in QuickBooks. Match the transfer line to the settlement deposit in your bank feed." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function AmazonToQuickBooksPage() {
  return (
    <ToolPageLayout
      eyebrow="Free Tool"
      title="Amazon Settlement to QuickBooks"
      subtitle="Turn an Amazon settlement CSV into QuickBooks-ready books: gross sales, refunds, and fees correctly split through a clearing account — with a settlement tie-out check."
      tool={<PayoutConverter provider="amazon" />}
      currentPath="/tools/amazon-to-quickbooks"
      faqs={FAQS}
      howToName="How to record Amazon settlements in QuickBooks"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>An Amazon settlement is fourteen days of business compressed into one deposit</h2>
          <p className={P}>
            Amazon does not pay you per order, per day, or per month. Roughly every two weeks it
            closes a settlement: every order in the window, every refund, the referral fee on each
            sale, the FBA fulfilment and storage charges, and any reserve Amazon decides to hold
            back are netted against each other, and only the remainder reaches your bank. On Amazon
            those deductions are not small change — fees and refunds together routinely take a
            substantial share of gross. Sellers who book the deposit as revenue understate sales by
            all of it, keep no fee record they can analyze, and have nothing to reconcile against
            when a settlement looks wrong.
          </p>
          <p className={P}>
            The settlement report itself tells the full story, row by row; it is just written in
            Amazon's dialect — transaction types, signed amounts, a fee column — rather than your
            chart of accounts. This converter translates it, settlement by settlement: sales in as
            income through an Amazon Clearing account, refunds against income, the fees out as
            expense, and the deposit as the transfer that clears the account and matches the bank
            feed. When a settlement's lines net the clearing account back to where it started, the
            deposit is explained in full.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Row in the settlement report</th>
                  <th className={TH}>What it really is</th>
                  <th className={TH}>Line it becomes</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Order / sale rows</strong></td><td className={TD}>Item prices and buyer charges, order by order, each with its fee in the fee column</td><td className={TD}>Income into Amazon Clearing; the fees join the fees line</td></tr>
                <tr><td className={TD}><strong>Refund</strong></td><td className={TD}>Money returned to a buyer for a returned or cancelled item</td><td className={TD}>Contra-income, reducing gross sales</td></tr>
                <tr><td className={TD}><strong>Fee rows</strong></td><td className={TD}>Charges Amazon posts as rows of their own — referral, FBA, and other settlement charges</td><td className={TD}>Counted into the settlement's fees total</td></tr>
                <tr><td className={TD}><strong>Chargeback / claim</strong></td><td className={TD}>A payment reversed or claimed back through Amazon or the card issuer</td><td className={TD}>Its own contra line, kept out of ordinary refunds</td></tr>
                <tr><td className={TD}><strong>Adjustment</strong></td><td className={TD}>Corrections Amazon posts against the account inside the settlement</td><td className={TD}>Its own line, flagged for a manual look</td></tr>
                <tr><td className={TD}><strong>Payout / settlement row</strong></td><td className={TD}>The net Amazon will actually deposit for this settlement</td><td className={TD}>Transfer from Amazon Clearing to checking — the tie-out target</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>How to convert an Amazon settlement report, step by step</h2>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 1 — Download the settlement report from Seller Central.</strong>{" "}
            Go to Reports, then Payments, open the settlement view for the period, and download the
            report as a CSV — the transaction view, which lists every order, refund, and fee as its
            own row. The converter reads six columns: settlement-id, date, transaction-type,
            order-id, amount, and fee. Settlement layouts vary by marketplace and report version,
            so if your headers are named differently, rename them to match; separators do not matter, since settlement-id, settlement_id, and settlement id are all recognized.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 2 — Upload the CSV.</strong>{" "}
            Drop the file into the tool above (CSV, up to 10 MB). The scan is free, needs no
            account, and the file is processed in memory and never stored. Every row is grouped by
            its settlement ID — not by date — so a file that happens to contain two settlements
            produces two summaries, and a settlement is never cut in half at a month boundary.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 3 — Review each settlement's tie-out.</strong>{" "}
            For every settlement you see gross sales, refunds, disputes and claims, fees, and
            adjustments totalled separately, and the computed net. Where the file carries a payout
            or settlement row with the deposit total, the tie-out compares the computed net against
            it and shows any difference per settlement. Fees are read from the fee column and the
            fee-type rows exactly as Amazon recorded them — the tool never estimates Amazon's fee
            schedule — and they are totalled into one fees line per settlement, as the FAQ explains.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 4 — Download and import.</strong>{" "}
            The clearing-entries CSV is free; the .QBO download is on Pro. Create a bank account in
            QuickBooks named Amazon Clearing once, import the file into it, and match the transfer
            line against the settlement deposit in your checking feed. Every entry carries a unique
            transaction ID derived from its settlement, so importing the same settlement file twice
            is recognized rather than duplicated. Download each settlement once and keep the
            originals: the original file is your evidence if a number is ever questioned. Own-store
            sellers get the same clearing method from the{" "}
            <a href="/tools/shopify-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Shopify payout converter</a>.
          </p>

          <figure className="mt-10 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-review.webp" alt="A seller reviewing an Amazon settlement breakdown against the deposit that reached the bank" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">Reviewing one settlement's sales, refunds, and fees before it is imported.</figcaption>
          </figure>

          <h2 className={H2M}>Amazon settlement problems and their fixes</h2>
          <h3 className={H3}>The settlement total booked as sales</h3>
          <p className={P}>
            The deposit is what is left after Amazon has paid itself. Treating it as revenue makes
            the top line a fiction — too low by every refund and fee — and leaves no fee expense to
            price against. Sellers routinely discover that a "profitable" product line never was,
            the first month its settlement is properly split and the full fee bill gets a line of
            its own. The fix is the clearing-account split on this page, applied settlement by
            settlement, every settlement, so the record is complete rather than sampled.
          </p>
          <h3 className={H3}>A reserve makes the deposit smaller than the rows explain</h3>
          <p className={P}>
            Amazon sometimes withholds an account-level reserve from a settlement to cover possible
            refunds and chargebacks, releasing it in a later settlement. That money is yours in
            transit, not a fee — but a withheld reserve is also a classic reason a settlement's
            computed net and its actual disbursement disagree, alongside a chargeback posted just
            after the cutoff, one settlement split into two disbursements, or orders from the tail
            of the previous period swept into this one. The tie-out names the difference per
            settlement; match it to one of those causes and give it its own line in the clearing
            account rather than burying it in sales or fees.
          </p>
          <h3 className={H3}>Settlements forced into calendar months, or counted twice</h3>
          <p className={P}>
            Two bookkeeping habits wreck Amazon records quietly. Splitting a settlement at the
            month boundary to make reports look tidy breaks its tie-out and strands half-entries in
            two periods. And date-range transaction reports can re-include orders that already
            appeared inside a settlement file — import both and those orders exist twice. Work
            settlement by settlement: one file, one settlement ID, one import, and neither error
            can happen. The settlement period is Amazon's unit; respect it and the calendar takes
            care of itself in reporting.
          </p>
          <h3 className={H3}>The summary view downloaded instead of the transaction view</h3>
          <p className={P}>
            When Seller Central offers both, the summary view is the tempting download — it is
            short and readable. It is also useless for bookkeeping: totals with no rows behind
            them cannot be split, tied out, or audited. If a converted file comes back with almost
            nothing in it, this is the first thing to check. Always download the transaction view
            for conversion; keep the summary for a glance.
          </p>

          <h2 className={H2M}>Three ways to get Amazon settlements into QuickBooks, compared</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Route</th>
                  <th className={TH}>What it costs you</th>
                  <th className={TH}>Where it breaks</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Connector / sync apps</strong></td><td className={TD}>A monthly subscription, plus setup across marketplaces, tax, and fulfilment settings</td><td className={TD}>Order-level syncs are powerful inventory tools, but the settlement still has to reconcile to the bank, and reserves, split disbursements, and negative settlements are exactly the cases automated posting handles worst without review</td></tr>
                <tr><td className={TD}><strong>Spreadsheet hand-entry</strong></td><td className={TD}>Free, and just about survivable for one small settlement</td><td className={TD}>A real settlement is hundreds or thousands of rows; hand-totalling them invites transposition errors, and nothing checks the result against the disbursement before it enters the books</td></tr>
                <tr><td className={TD}><strong>This file-based converter</strong></td><td className={TD}>The scan, summary, and CSV are free; the .QBO download is on Pro. No live connection to QuickBooks is offered or needed</td><td className={TD}>It works at settlement grain, not order grain, reads the six-column transaction view — so headers may need renaming on some marketplace layouts — and totals fees into one line per settlement</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Twenty-six settlements a year, each with the same anatomy, is a routine waiting to be
            standardized: download, convert, check the tie-out, import, match. The same clearing
            model covers a seller's other channels through the{" "}
            <a href="/tools/etsy-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Etsy statement converter</a>{" "}
            and the{" "}
            <a href="/tools/free-stripe-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Stripe payout converter</a>,
            and a plain bank CSV — as opposed to a settlement report — belongs in the{" "}
            <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a>.
          </p>
        </>
      }
    />
  );
}
