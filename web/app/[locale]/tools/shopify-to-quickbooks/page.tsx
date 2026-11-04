import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { PayoutConverter } from "@/components/tools/PayoutConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/shopify-to-quickbooks";

export const metadata: Metadata = {
  title: "Shopify to QuickBooks Converter — Free Shopify Payout to QBO | Convert Statement",
  description:
    "Free Shopify payout to QuickBooks converter: turn a Shopify Payments payout CSV into clearing-account entries (gross sales, refunds, fees) with a payout tie-out check. Free per-payout summary with no account; QBO download is on Pro.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Shopify to QuickBooks Converter — Shopify Payout to QBO",
    description:
      "Upload a Shopify Payments payout CSV — get gross, refunds, and fees split correctly for QuickBooks with a tie-out check. Free to scan.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I record Shopify payouts in QuickBooks?",
    a: "Record by payout, not by day. Each payout bundles orders with fees and refunds deducted, and deposit dates rarely match order dates. This tool unpacks payouts through a Shopify clearing account — gross sales, refunds, and fees in, the net transferred to checking. Zero clearing balance means the payout is reconciled.",
  },
  {
    q: "Which Shopify export should I upload?",
    a: "The Shopify Payments payout export as a CSV, with columns: payout-id, date, type, gross, fee, and net. In Shopify admin, go to Settings → Payments → Shopify Payments → View payouts, open a payout, and export its transactions.",
  },
  {
    q: "Why doesn't my payout match the orders report for the same days?",
    a: "The two reports answer different questions. The orders report shows what customers bought; the payout shows what Shopify Payments sent, grouped by payout date, net of fees, refunds of older orders, and adjustments. They are supposed to differ — reconcile the bank against the payout, and let orders run the store.",
  },
  {
    q: "What is the payout tie-out check?",
    a: "The tool verifies Gross − Fees − Refunds = Payout for every payout, against the deposit total in your payout rows. A green 'Ties out' badge means the payout reconciles to the penny. If it shows a difference, check Shopify for reserves, chargebacks, or orders from other days swept in before importing.",
  },
  {
    q: "What are adjustment lines in a payout export?",
    a: "Adjustments are corrections Shopify posts after the fact: a fee recalculated, a chargeback resolved in your favor, a reserve released, a payout corrected. They carry no order reference, which is why order-based imports drop them — and why payouts refuse to reconcile. This converter keeps each adjustment as a clearing line.",
  },
  {
    q: "Does this handle Shopify's own fees and third-party gateways?",
    a: "It handles what is in the Shopify Payments export: Shopify Payments processing fees, refunds, and chargebacks. Sales through a third-party gateway (Stripe, PayPal, and others) settle through that gateway, not through Shopify Payments — convert those with the matching tool (Stripe or PayPal) so each deposit reconciles against the clearing account.",
  },
  {
    q: "How long does a Shopify payout take to reach my bank?",
    a: "Shopify Payments pays out on a set schedule — for US stores, a day's charges typically arrive grouped into one payout a few business days later, and weekends and holidays shift the timing. Your schedule is under Settings → Payments. What matters for the books: record by payout, not by order date.",
  },
  {
    q: "Should I record sales daily or by payout?",
    a: "By payout, if you want the bank to reconcile. Daily entries follow the orders report, but no daily figure equals a bank deposit, so every day becomes a reconciliation problem. One entry set per payout — gross, refunds, fees, transfer — matches the deposit and nets the clearing account to zero.",
  },
  {
    q: "How do I import the QBO into QuickBooks?",
    a: "First create a bank account in QuickBooks named 'Shopify Clearing'. Import the QBO there, then match the transfer line against the payout deposit in your bank feed. When the clearing account nets to zero, the payout is fully reconciled. The CSV works the same way through QuickBooks Online's manual upload.",
  },
  {
    q: "Is my data uploaded to your servers?",
    a: "No. Your CSV is processed in memory to build the payout summary and the download files, and it is not stored on our servers afterwards. Nothing is kept between sessions, and we never sell, share, or use your financial data for anything else.",
  },
];

const HOWTO = [
  { title: "Export from Shopify", body: "In Shopify admin, open a Shopify Payments payout and export its transactions as a CSV (payout-id, date, type, gross, fee, net)." },
  { title: "Upload it here", body: "Drop the CSV in — the tool groups everything into payouts automatically." },
  { title: "Review the tie-out", body: "Check each payout's gross, fees, and refunds, and confirm the payout ties out to the bank deposit." },
  { title: "Import into QuickBooks", body: "Download the CSV free, or the QBO on Pro, and import it into a Shopify Clearing account in QuickBooks." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function ShopifyToQuickBooksPage() {
  return (
    <ToolPageLayout
      eyebrow="Free Tool"
      title="Shopify Payout to QuickBooks"
      subtitle="Turn a Shopify Payments payout CSV into QuickBooks-ready books: gross sales, refunds, and fees correctly split through a clearing account — with a payout tie-out check."
      tool={<PayoutConverter provider="shopify" />}
      currentPath="/tools/shopify-to-quickbooks"
      faqs={FAQS}
      howToName="How to record Shopify payouts in QuickBooks"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why your Shopify payout never matches the day's orders</h2>
          <p className={P}>
            Two reports in Shopify tell two different stories. The orders report describes what
            customers bought; the payout report describes what Shopify Payments actually sent your
            bank — later, and net of processing fees, refunds that may belong to much older orders,
            and adjustments you may never have seen itemized anywhere. Reconcile the bank against
            the orders report and the numbers will disagree every single week, through no error of
            yours.
          </p>
          <p className={P}>
            The payout is the document that matches the money. This converter rebuilds each payout
            from its own transaction lines — charges, refunds, fees, and adjustments — so
            QuickBooks records the money the way it actually moved, and the bank deposit becomes
            the easiest line in the file to match instead of the hardest.
          </p>

          <h2 className={H2M}>Inside a Shopify Payments payout</h2>
          <p className={P}>
            A payout export breaks into a few line types, and each one has a proper home in
            QuickBooks:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Line in the payout export</th>
                  <th className={TH}>What it really is</th>
                  <th className={TH}>How it should be booked</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Charge</strong></td><td className={TD}>A card payment captured for an order, shown at gross</td><td className={TD}>Income, into the clearing account</td></tr>
                <tr><td className={TD}><strong>Refund</strong></td><td className={TD}>Money returned on an order — possibly an order from an earlier payout</td><td className={TD}>Contra-income, reducing gross sales</td></tr>
                <tr><td className={TD}><strong>Fee</strong></td><td className={TD}>The Shopify Payments processing charge for that charge</td><td className={TD}>Merchant fees expense</td></tr>
                <tr><td className={TD}><strong>Adjustment</strong></td><td className={TD}>A correction Shopify posts later — a fee recalculated, a chargeback resolved, a reserve released</td><td className={TD}>Its own line, inside the payout where it appears</td></tr>
                <tr><td className={TD}><strong>Chargeback / reserve</strong></td><td className={TD}>Amounts held back or reversed through the card networks</td><td className={TD}>Tracked separately inside the clearing account</td></tr>
                <tr><td className={TD}><strong>Net payout</strong></td><td className={TD}>What actually reaches your bank account</td><td className={TD}>Transfer from clearing to checking</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>Payouts are not orders — and that is the point</h2>
          <p className={P}>
            An order enters the payout of the day its payment is captured. A refund leaves in the
            payout of the day it is issued, even if the order is a month old. An adjustment lands
            whenever Shopify posts it. So a single payout mixes this week's sales with last month's
            return and a correction from the week before — which feels wrong until you notice that
            your bank statement shows exactly the same mixture. Booking by payout keeps QuickBooks
            aligned with the bank; the orders report stays free to do its own job, which is running
            the store, not settling the money.
          </p>
          <p className={P}>
            There is a second consequence worth knowing: because refunds and adjustments ride in
            later payouts, a payout can occasionally be negative — refunds outrunning new charges —
            and Shopify then nets the shortfall against the following payout rather than billing
            your card. Books kept by payout absorb this naturally; books kept by order date chase
            it for weeks.
          </p>

          <h2 className={H2M}>How this converter rebuilds each payout</h2>
          <p className={P}>
            Upload the payout CSV and the tool groups every row by its payout ID, then splits each
            group into charges, refunds, fees, and adjustments. Those become clearing-account
            entries — income, contra-income, and expense lines into a Shopify Clearing account,
            followed by one transfer line for the net. Every entry carries a unique transaction ID
            derived from the payout, so a re-import is recognized by QuickBooks rather than
            duplicated. Before you download, the tie-out check re-adds each payout against the
            deposit total in the file and flags any difference per payout. The per-payout summary
            is free to view with no account; the CSV download is free, and the QBO file is on Pro.
          </p>
          <p className={P}>
            One habit worth copying from the converter itself: it never edits a row to make a
            payout fit. An unfamiliar line type — a tax or marketplace-facilitator line, say — is
            carried through as its own entry rather than folded into fees, so the file you import
            explains itself line by line.
          </p>

          <h2 className={H2M}>The clearing-account method for Shopify</h2>
          <p className={P}>
            The clearing account is a bank-type account that mirrors your Shopify Payments balance
            inside QuickBooks. Set it up once; every payout then follows the same pattern:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li>Create a bank account in QuickBooks named <strong className="text-zinc-900 dark:text-white">Shopify Clearing</strong> (one-time setup).</li>
            <li>Record the payout's gross charges as income into Shopify Clearing.</li>
            <li>Record fees as an expense and refunds as contra-income against the same account, keeping adjustments on their own lines.</li>
            <li>Record the payout itself as a transfer from Shopify Clearing to your checking account.</li>
            <li>Match the transfer to the deposit in your bank feed.</li>
          </ol>
          <p className={P}>
            After the match, that payout's activity in the clearing account is zero — the deposit
            is explained in full, inside QuickBooks, with nothing left to remember.
          </p>

          <h2 className={H2M}>Exporting the payout file from Shopify</h2>
          <p className={P}>
            In Shopify admin, go to <strong className="text-zinc-900 dark:text-white">Settings → Payments</strong>, open Shopify Payments, and choose{" "}
            <strong className="text-zinc-900 dark:text-white">View payouts</strong>. Open the payout you want and export its transactions as a CSV. The file
            the converter reads carries six columns — payout-id, date, type, gross, fee, and net —
            so export at the individual payout level, where those columns exist, rather than from
            the orders list. Work one payout at a time while the routine is new; a month of payouts
            converts just as well once it is familiar. Keep the original exports, named by payout ID:
            months later, when a deposit is questioned, the file that explains it can be re-run
            through this converter and will produce the same entries — an audit trail a re-typed
            spreadsheet can never give you.
          </p>

          <figure className="mt-10 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-spreadsheet.webp" alt="A Shopify payout spreadsheet with charge, refund, fee, and net columns ready to split for QuickBooks" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">A payout export — charges, refunds, fees, and adjustments, one payout per group.</figcaption>
          </figure>

          <h2 className={H2M}>A worked example: one payout, tied out</h2>
          <p className={P}>
            Sample figures, rounded on purpose. One payout for a small store:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Line</th><th className={TH}>Amount</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}>Gross charges</td><td className={TD}>$1,650.00</td></tr>
                <tr><td className={TD}>Refunds</td><td className={TD}>−$120.00</td></tr>
                <tr><td className={TD}>Processing fees</td><td className={TD}>−$50.00</td></tr>
                <tr><td className={TD}>Adjustments</td><td className={TD}>−$30.00</td></tr>
                <tr><td className={TD}><strong>Net payout to the bank</strong></td><td className={TD}><strong>$1,450.00</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            The tie-out: $1,650.00 − $120.00 − $50.00 − $30.00 = $1,450.00. In the clearing account
            that is $1,650.00 of income against $200.00 of refunds, fees, and adjustments, leaving
            exactly $1,450.00 to transfer to checking. Booked as a single deposit-as-sale, the same
            payout would understate revenue by $200.00 — and the $30.00 adjustment, the line most
            likely to be questioned later, would never appear anywhere. (Sample figures, shown for
            illustration.)
          </p>

          <h2 className={H2M}>Shopify mistakes that distort the books</h2>
          <h3 className={H3}>Reconciling against the orders report</h3>
          <p className={P}>
            The orders report is a sales document, not a settlement document. Forcing it to explain
            bank deposits guarantees a weekly difference, because refunds, fees, and adjustments
            live on payout time, not order time. Reconcile money against payouts; analyze products
            against orders.
          </p>
          <h3 className={H3}>Missing the adjustment lines</h3>
          <p className={P}>
            Adjustments often carry no order reference, so imports that key everything to an order
            quietly drop them — a few dollars here, a released reserve there — and the clearing
            account drifts by exactly those amounts. Every adjustment is a real movement of your
            money and needs its own line.
          </p>
          <h3 className={H3}>Mixing in third-party gateway sales</h3>
          <p className={P}>
            Orders paid through PayPal, Stripe, or another gateway at checkout never pass through
            Shopify Payments, so they are not in the payout export — and they should not be forced
            into it. Convert each gateway with its own converter so every deposit reconciles
            against the clearing account that actually settled it.
          </p>
          <h3 className={H3}>Splitting one payout across days</h3>
          <p className={P}>
            Posting "daily sales" carved out of a payout total spreads one deposit across dates it
            never had, and no day's entry will ever match anything at the bank. The payout is the
            smallest unit the bank recognizes; keep it whole.
          </p>

          <h2 className={H2M}>When a payout will not tie out</h2>
          <p className={P}>
            Look first at holds and timing. A chargeback deducted in this payout may be released in
            a later one when you win the dispute. A reserve hold reduces one payout and inflates
            another when it frees up. A payout that went negative — refunds exceeding charges —
            carries its balance into the next payout instead of producing a deposit. And a holiday
            weekend shifts which charges fall inside the window at all. The tie-out names the
            difference per payout; if QuickBooks and the bank still disagree afterwards, the{" "}
            <a href="/tools/reconciliation-finder" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Reconciliation Difference Finder</a>{" "}
            compares your statement against QuickBooks entry by entry.
          </p>
          <p className={P}>
            The tie-out performs this check mechanically for every payout before you import: it
            re-adds the charges, refunds, fees, and adjustments in the file and compares the result
            with the payout total Shopify recorded. A green badge is not a courtesy — it is the
            arithmetic closing. When it does not close, the difference is printed per payout,
            because one wrong payout should never block a month of correct ones.
          </p>

          <h2 className={H2M}>Make it a system, not a monthly rescue</h2>
          <p className={P}>
            Payouts arrive whether the books are ready or not; a fixed routine is what keeps them
            boring. A free account keeps every conversion in one searchable history, so the payout
            behind any deposit is findable months later. The dashboard adds bulk conversion when
            several payouts land at once, and client portals if you run books for other stores —
            each client uploads through their own link. QBO downloads sit on{" "}
            <a href="/pricing" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Pro</a>,
            the same clearing model runs your other channels through the{" "}
            <a href="/tools/amazon-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Amazon Settlement Converter</a>{" "}
            and the{" "}
            <a href="/tools/free-paypal-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">PayPal Payout Converter</a>,
            and the{" "}
            <a href="/tools/free-qbo-cleanup-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO Duplicate Finder</a>{" "}
            will scan any file for repeated IDs before you import it. That is the whole method:
            nothing hidden, nothing lumped, every deposit explained.
          </p>
        </>
      }
    />
  );
}
