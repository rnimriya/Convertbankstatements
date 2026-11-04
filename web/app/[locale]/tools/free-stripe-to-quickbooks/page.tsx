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
    q: "How do I record Stripe fees in QuickBooks?",
    a: "Fees never arrive as separate bank transactions — Stripe deducts them inside each payout. This converter reads the fee recorded on each row of your export and posts each payout's total as its own expense line through the clearing account, so gross sales stay at gross and fees land in a merchant-fees expense account instead of silently shrinking revenue.",
  },
  {
    q: "Which Stripe export should I upload?",
    a: "The Payout Reconciliation (itemized) report is best: every row carries a payout ID, so charges, refunds, and fees group into their real payouts. The Balance transactions CSV also works and is grouped into a single summary for the file. The plain Payouts list holds totals only — the tool lists them, but cannot build clearing entries from totals, and will tell you to use the itemized report.",
  },
  {
    q: "Why doesn't my Stripe payout match my sales in QuickBooks?",
    a: "Because a payout is not a sale. It is the gross charges in a payout window, minus processing fees, minus refunds and disputes settled in that window. Your bank feed shows only the net deposit, so booking the deposit as income understates revenue and hides the fees. The clearing-account split books the contents of the payout, then lets the deposit clear them.",
  },
  {
    q: "What is a Stripe clearing account in QuickBooks?",
    a: "A bank-type account you create in QuickBooks, named Stripe Clearing here, that holds Stripe money in transit. Gross sales, refunds, and fees are posted into it per payout; one transfer line then moves the net payout to your checking account, where you match it to the bank-feed deposit. When a payout's lines net to zero in clearing, that payout is fully explained.",
  },
  {
    q: "Is this Stripe to QuickBooks converter free?",
    a: "The scan, the per-payout summary, the tie-out check, and the clearing-entries CSV download are free with no account. The .QBO download is on Pro — that is the file you import into the clearing account through QuickBooks' Web Connect route. The free scan is not limited: you see every payout's gross, refunds, fees, and tie-out result before deciding.",
  },
  {
    q: "Will importing the same file twice create duplicates?",
    a: "Through the QBO file, no. Every clearing entry carries a unique transaction ID derived from its payout, and QuickBooks skips IDs it has already imported. The duplicate risk is mixing routes — running a sync app for the same payouts and also importing files — so pick one route per Stripe account and stay with it.",
  },
];

const HOWTO = [
  { title: "Export from Stripe", body: "In Stripe, download the Payout Reconciliation (itemized) report as CSV — or a Balance transactions export. The plain Payouts list has totals only and cannot be split." },
  { title: "Upload it here", body: "Drop the CSV in (max 10 MB, no account). The tool auto-detects which Stripe format you gave it and groups the rows into payouts." },
  { title: "Review the tie-out", body: "Check each payout's gross, refunds, disputes, and fees, and confirm it ties out against the amount Stripe actually sent before you download anything." },
  { title: "Download and import", body: "Download the clearing-entries CSV free, or the .QBO on Pro, and import it into a Stripe Clearing account in QuickBooks. Match the transfer line to the real deposit in your bank feed." },
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
          <h2 className={H2}>A Stripe payout is a bundle, not a sale</h2>
          <p className={P}>
            A customer pays you the moment a charge succeeds. Stripe pays you later, and what it
            sends is not that charge — it is every charge in a payout window, added together, with
            Stripe's processing fees taken out, refunds deducted, and any dispute amounts pulled
            back, all compressed into one deposit. Your bank feed shows only that final net number.
            Book it as income and your books take three hits at once: revenue is understated by
            every fee and refund inside the bundle, your processing costs never reach the profit
            and loss statement at all, and the deposit itself can never be matched to any day's
            sales, because it was never a day's sales.
          </p>
          <p className={P}>
            The standard fix is a clearing account. Instead of booking the deposit, you book the
            payout's contents — gross charges in as income, fees out as expense, refunds against
            income — into a Stripe Clearing account in QuickBooks, and record the payout itself as
            a simple transfer from that clearing account to your checking account. The transfer is
            the one line that has to match the bank feed, and it matches exactly, because it is the
            same net amount Stripe sent. When the clearing lines for a payout sum to the transfer,
            the clearing balance for that payout returns to zero and the deposit is explained to
            the penny. This converter builds exactly those lines from your Stripe export.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Row in the Stripe export</th>
                  <th className={TH}>What it really is</th>
                  <th className={TH}>Line it becomes</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Charge</strong></td><td className={TD}>A successful payment, at its gross amount, with its fee recorded beside it</td><td className={TD}>Income into Stripe Clearing; the fee goes to the fees line</td></tr>
                <tr><td className={TD}><strong>Refund</strong></td><td className={TD}>Money returned to a customer, settled in the payout where the refund was processed</td><td className={TD}>Contra-income, reducing gross sales</td></tr>
                <tr><td className={TD}><strong>Dispute</strong></td><td className={TD}>A chargeback opened by the customer's bank, plus the dispute fee on the same row</td><td className={TD}>Its own contra line, plus a separate dispute-fee line</td></tr>
                <tr><td className={TD}><strong>Fee / adjustment</strong></td><td className={TD}>Processing fees and balance adjustments Stripe posts to the account</td><td className={TD}>Fee expense lines and adjustment lines, kept visible</td></tr>
                <tr><td className={TD}><strong>Payout</strong></td><td className={TD}>The net amount that actually reached your bank</td><td className={TD}>Transfer from Stripe Clearing to checking — the tie-out target</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>How to convert a Stripe payout export, step by step</h2>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 1 — Export the right report from Stripe.</strong>{" "}
            The Payout Reconciliation report in its itemized form is the file this tool is built
            for: every row carries its charge amount, its fee, and the payout it belongs to. The
            Balance transactions CSV works too — it has the same amount and fee columns, but no
            payout ID, so the converter groups the whole file into one summary. Do not use the
            plain Payouts list: it contains payout totals and nothing inside them, so there is
            nothing to split, and the tool will say so rather than invent a breakdown.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 2 — Upload the CSV.</strong>{" "}
            Drop the file into the tool above (CSV, up to 10 MB). The scan is free and needs no
            account; the file is processed in memory and never stored. The tool detects which of
            the three Stripe formats you uploaded and groups the rows — by payout ID where the
            export provides one.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 3 — Review the summary and the tie-out.</strong>{" "}
            For each payout you see gross sales, refunds, disputes, dispute fees, other fees, and
            adjustments, totalled separately. Disputes get special handling: the dispute amount and
            its fee are split into two lines, because the fee is only returned if you win the
            dispute, while the amount follows the case. The tie-out check then compares the
            computed net — gross minus refunds, disputes, fees, and adjustments — against the
            payout amount in your file. "Ties out" means the payout reconciles exactly; a
            difference is shown per payout, before anything reaches QuickBooks.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 4 — Download and import.</strong>{" "}
            The clearing-entries CSV is free. The .QBO download is on Pro. Before your first
            import, create a bank account in QuickBooks named Stripe Clearing. Import the file
            into that account — in QuickBooks Online, through Bank transactions and Upload from
            file; the entries land as the gross, refund, fee, and transfer lines you reviewed.
            Then match the transfer line against the real Stripe deposit in your checking feed.
            Selling through another channel as well? The same clearing model runs the{" "}
            <a href="/tools/free-paypal-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">PayPal payout converter</a>{" "}
            and the{" "}
            <a href="/tools/shopify-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Shopify payout converter</a>,
            so each platform's deposit reconciles against its own clearing account.
          </p>

          <figure className="mt-10 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-review.webp" alt="A bookkeeper reviewing a Stripe payout breakdown line by line against the bank deposit" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">Checking a payout's gross, fees, and refunds against the deposit before it is imported.</figcaption>
          </figure>

          <h2 className={H2M}>When a Stripe payout will not tie out: problems and fixes</h2>
          <h3 className={H3}>The deposit was booked as income</h3>
          <p className={P}>
            The root problem this page exists to fix. The symptom is a business whose Stripe sales
            in QuickBooks are always lower than Stripe's own gross volume, with no merchant-fees
            expense anywhere. The fix is not an adjusting journal at year-end; it is to stop
            booking deposits and start booking payout contents through the clearing account, so
            revenue, refunds, and fees each land where they belong from the start.
          </p>
          <h3 className={H3}>A refund landed in a different payout than its charge</h3>
          <p className={P}>
            Stripe settles a refund in the payout that is open when the refund is processed, which
            may be days or weeks after the original charge — possibly in a different month. Sellers
            hunting for the refund next to its charge conclude the export is wrong. It is not: the
            converter counts each row in the payout where Stripe put it, which is also where the
            money actually moved. Note the fee column on refund rows, too: a refund is not
            cost-free, and this tool reads the fee Stripe recorded on the row rather than assuming
            the original fee came back in full.
          </p>
          <h3 className={H3}>The payout is short by a dispute, a hold, or an instant-payout fee</h3>
          <p className={P}>
            A tie-out difference usually has a shape. Short by the amount of a chargeback plus a
            fee: a dispute was deducted before you responded. Short by a percentage-like slice: a
            reserve hold. Short by a small fee on every payout: instant payouts. The per-payout
            difference the tool shows is the amount to match against your Stripe activity for that
            window — find the cause and give it its own line rather than forcing the payout to fit,
            because a difference buried in the clearing account will sit in every reconciliation
            that follows.
          </p>
          <h3 className={H3}>Fees netted away, or two routes posting the same money</h3>
          <p className={P}>
            If fees are folded into the sales line, your gross margin is wrong on every report and
            a fee change is invisible. And if a connector app is already posting Stripe activity
            while you also import converted files, the same sales exist twice. Fees get their own
            expense line here, and the rule for routes is simple: one route per account.
          </p>

          <h2 className={H2M}>Three ways to get Stripe payouts into QuickBooks, compared</h2>
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
                <tr><td className={TD}><strong>Connector / sync apps</strong></td><td className={TD}>A monthly subscription, plus setup and mapping time; syncs run on their schedule</td><td className={TD}>Convenient when they post the full split — but check yours: apps that push each payout in as one lump sum hide fees and refunds exactly like booking the deposit does, and a sync running alongside file imports double-counts</td></tr>
                <tr><td className={TD}><strong>Spreadsheet hand-entry</strong></td><td className={TD}>Free, and workable for a handful of payouts</td><td className={TD}>Every payout is re-typed by hand; fee and refund lines get skipped under time pressure; a re-typed file is no audit trail, and nothing checks your arithmetic before it reaches the books</td></tr>
                <tr><td className={TD}><strong>This file-based converter</strong></td><td className={TD}>The scan, summary, and CSV are free; the .QBO download is on Pro. No live connection to QuickBooks is offered or needed</td><td className={TD}>You export and import a file per period — a few minutes of routine instead of a sync — and you still review the tie-out, because no converter can know your chart of accounts</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            For a general bank CSV rather than a payout export, the{" "}
            <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a>{" "}
            is the matching tool, and point-of-sale sellers get the same clearing treatment from the{" "}
            <a href="/tools/square-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Square payout converter</a>.
          </p>
        </>
      }
    />
  );
}
