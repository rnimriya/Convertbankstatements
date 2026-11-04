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
    q: "Why doesn't my Shopify payout match the orders report for the same days?",
    a: "The two reports answer different questions. The orders report shows what customers bought, on order dates. A payout shows what Shopify Payments sent, grouped by payout, net of processing fees, including refunds of much older orders and adjustments that have no order at all. They are supposed to differ. Reconcile the bank against payouts; run the store against orders.",
  },
  {
    q: "Which Shopify export should I upload?",
    a: "The Shopify Payments payout export as a CSV, with the columns payout-id, date, type, gross, fee, and net. In Shopify admin, go to Settings, then Payments, open Shopify Payments, choose View payouts, open one payout, and export its transactions. Export at the individual payout level, where those columns exist — an orders export does not carry the payout grouping the converter needs.",
  },
  {
    q: "Does this converter split out the sales tax I collected?",
    a: "Not as its own line, and it is important to know that. The payout export this tool reads has no separate tax column — charge rows arrive at gross, and any sales tax collected inside those amounts stays inside the gross line. Categorize with that in mind: tax collected is a liability you owe the state, not product revenue, so the whole gross line should not sit in a sales account if your charges include tax.",
  },
  {
    q: "What are adjustment lines in a Shopify payout?",
    a: "Adjustments are corrections Shopify posts after the fact: a fee recalculated, a chargeback resolved in your favor, a reserve released, a payout corrected. They carry no order reference, which is why order-based imports quietly drop them — and why payouts then refuse to reconcile. This converter keeps every adjustment row as its own line inside the payout where it appears.",
  },
  {
    q: "Is this Shopify to QuickBooks converter free?",
    a: "The scan, the per-payout summary, the tie-out check, and the clearing-entries CSV download are free with no account. The .QBO download is on Pro. Sales taken through a third-party gateway at checkout — PayPal, Stripe, or another gateway — never pass through Shopify Payments, so they are not in this export and not part of its tie-out.",
  },
  {
    q: "How do I handle Shopify orders paid through PayPal or Stripe?",
    a: "Convert them with the matching converter, into that gateway's own clearing account. A PayPal checkout settles through PayPal and a Stripe checkout settles through Stripe, so each deposit reconciles against the platform that actually held the money. Forcing gateway sales into the Shopify payout would break both tie-outs.",
  },
];

const HOWTO = [
  { title: "Export from Shopify", body: "In Shopify admin, go to Settings → Payments → Shopify Payments → View payouts, open a payout, and export its transactions as a CSV (payout-id, date, type, gross, fee, net)." },
  { title: "Upload it here", body: "Drop the CSV in (max 10 MB, no account). The tool groups every row by its payout ID automatically." },
  { title: "Review the tie-out", body: "Check each payout's gross, refunds, fees, and adjustments, and confirm the payout ties out to the deposit total recorded in the payout rows." },
  { title: "Download and import", body: "Download the clearing-entries CSV free, or the .QBO on Pro, and import it into a Shopify Clearing account in QuickBooks. Match the transfer line to the payout deposit in your bank feed." },
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
          <h2 className={H2}>One Shopify payout contains four different kinds of money</h2>
          <p className={P}>
            A single Shopify Payments payout bundles at least four things that belong in four
            different places in QuickBooks: the sales themselves, the Shopify Payments processing
            fees deducted from them, refunds — often for orders placed weeks earlier — and, inside
            the charge amounts, any sales tax you collected for a state. It then arrives days after
            the orders it covers. Book that one deposit as a single sales figure and all four are
            corrupted at once: revenue is understated by the fees and refunds buried in it, the fee
            expense never appears, refunds are invisible as a trend, and tax you collected and owe
            can end up reported as if it were income.
          </p>
          <p className={P}>
            The payout, not the day and not the order, is the unit your bank recognizes — so it is
            the unit the books should be built from. This converter rebuilds each payout from its
            own transaction lines: charges in as income through a Shopify Clearing account, fees
            out as expense, refunds against income, adjustments on their own lines, and the payout
            itself as one transfer to checking that matches the bank feed exactly. When those lines
            net the clearing account to zero for that payout, the deposit is fully explained.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Row in the payout export</th>
                  <th className={TH}>What it really is</th>
                  <th className={TH}>Line it becomes</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Charge</strong></td><td className={TD}>A card payment captured for an order, at gross, with its processing fee beside it</td><td className={TD}>Income into Shopify Clearing; the fee goes to the fees line</td></tr>
                <tr><td className={TD}><strong>Refund</strong></td><td className={TD}>Money returned on an order — possibly an order from an earlier payout</td><td className={TD}>Contra-income, reducing gross sales</td></tr>
                <tr><td className={TD}><strong>Fee</strong></td><td className={TD}>A Shopify Payments charge that appears as a row of its own</td><td className={TD}>Merchant-fees expense</td></tr>
                <tr><td className={TD}><strong>Adjustment</strong></td><td className={TD}>A correction posted later — fee recalculated, chargeback resolved, reserve released</td><td className={TD}>Its own line, inside the payout where it appears</td></tr>
                <tr><td className={TD}><strong>Chargeback / dispute</strong></td><td className={TD}>A payment reversed through the card networks</td><td className={TD}>Its own contra line, kept out of ordinary refunds</td></tr>
                <tr><td className={TD}><strong>Payout</strong></td><td className={TD}>The net that actually reaches your bank, recorded in the export's net column</td><td className={TD}>Transfer from Shopify Clearing to checking — the tie-out target</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>How to convert a Shopify payout export, step by step</h2>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 1 — Export one payout's transactions from Shopify.</strong>{" "}
            In Shopify admin, go to Settings, then Payments, open Shopify Payments, and choose View
            payouts. Open the payout you want and export its transactions as a CSV. The file the
            converter reads carries six columns — payout-id, date, type, gross, fee, and net — so
            export at the payout level, where those columns exist, rather than from the orders
            list. If your export's headers differ, rename them to match before uploading.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 2 — Upload the CSV.</strong>{" "}
            Drop the file into the tool above (CSV, up to 10 MB). The scan is free, needs no
            account, and the file is processed in memory and never stored. A file without a
            payout-id or gross column is rejected with an explanation, not guessed at. Every row is
            then grouped by its payout ID, so a file containing several payouts still produces one
            summary per payout.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 3 — Review each payout and its tie-out.</strong>{" "}
            For every payout you see gross charges, refunds, disputes, fees, and adjustments
            totalled separately, and the net the converter computed. The tie-out compares that net
            against the deposit total recorded in the payout rows of your file. "Ties out" means
            the rebuild matches Shopify's own total to the penny. Read the sales-tax note in the
            FAQ before you categorize: this export shape has no tax column, so tax collected stays
            inside the gross charge amounts and needs the right home in QuickBooks at
            categorization time.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 4 — Download and import.</strong>{" "}
            The clearing-entries CSV is free; the .QBO download is on Pro. Create a bank account in
            QuickBooks named Shopify Clearing once, import the file into it, and match the transfer
            line against the payout deposit in your checking feed. Each entry carries a unique
            transaction ID derived from its payout, so re-importing a file is recognized rather
            than duplicated. Marketplace sellers get the same treatment for Amazon from the{" "}
            <a href="/tools/amazon-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Amazon settlement converter</a>.
          </p>

          <figure className="mt-10 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-spreadsheet.webp" alt="A Shopify payout spreadsheet with charge, refund, fee, and net columns ready to split for QuickBooks" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">A payout export — charges, refunds, fees, and adjustments, one payout per group.</figcaption>
          </figure>

          <h2 className={H2M}>Shopify payout problems and their fixes</h2>
          <h3 className={H3}>Reconciling the bank against the orders report</h3>
          <p className={P}>
            This is the mismatch that brings most Shopify sellers to a page like this. An order
            enters the payout of the day its payment is captured; a refund leaves in the payout of
            the day it is issued, even if the order is a month old; an adjustment lands whenever
            Shopify posts it. A single payout therefore mixes this week's sales with last month's
            return and a correction from the week before — which is exactly the mixture your bank
            statement shows. The fix is to reconcile money against payouts and let the orders
            report do its own job: running the store.
          </p>
          <h3 className={H3}>Adjustment lines quietly dropped by order-based imports</h3>
          <p className={P}>
            Adjustments often carry no order reference, so any workflow that keys every line to an
            order has nowhere to put them and leaves them out — a few dollars here, a released
            reserve there — and the clearing account drifts by precisely those amounts, forever
            unexplained. In this converter an adjustment is a first-class row type with its own
            line in the payout summary, flagged for a manual look because Shopify rarely explains
            it further in the export itself.
          </p>
          <h3 className={H3}>A payout comes up short, or goes negative</h3>
          <p className={P}>
            Look first at timing and holds. A chargeback deducted in this payout may be released in
            a later one if you win the dispute. A reserve hold reduces one payout and inflates
            another when it frees up. And when refunds outrun new charges, a payout can go
            negative — Shopify then nets the shortfall against the following payout rather than
            billing your card. Books kept by payout absorb all of this naturally, because the
            clearing account simply carries the balance; books kept by order date chase it for
            weeks. The tie-out names the difference per payout so you can match it to one of these
            causes before importing.
          </p>
          <h3 className={H3}>Third-party gateway sales forced into the Shopify payout</h3>
          <p className={P}>
            Orders paid through PayPal, Stripe, or another gateway at checkout are real Shopify
            orders, but the money never passes through Shopify Payments — so they are not in the
            payout export, and adding them in by hand breaks the tie-out you just proved. Convert
            each gateway separately, with the{" "}
            <a href="/tools/free-paypal-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">PayPal payout converter</a>{" "}
            or the{" "}
            <a href="/tools/free-stripe-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Stripe payout converter</a>,
            so every deposit reconciles against the clearing account that actually settled it.
          </p>

          <h2 className={H2M}>Three ways to get Shopify payouts into QuickBooks, compared</h2>
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
                <tr><td className={TD}><strong>Connector / sync apps</strong></td><td className={TD}>A monthly subscription, plus mapping setup for orders, taxes, and fees</td><td className={TD}>Order-level syncs are powerful but heavy: they post at order grain, so payout-level reconciliation against the bank still has to be assembled, and a mis-mapped tax or fee account repeats its error on every order until someone notices</td></tr>
                <tr><td className={TD}><strong>Spreadsheet hand-entry</strong></td><td className={TD}>Free, and fine for a store with a payout or two a month</td><td className={TD}>Adjustment lines and cross-period refunds are exactly the rows hand-entry drops, and no spreadsheet checks that your entries sum to the deposit before they reach QuickBooks</td></tr>
                <tr><td className={TD}><strong>This file-based converter</strong></td><td className={TD}>The scan, summary, and CSV are free; the .QBO download is on Pro. No live connection to QuickBooks is offered or needed</td><td className={TD}>It works at payout grain, not order grain — if you need per-order detail in QuickBooks, that is a different workflow — and it reads the six-column payout export, so gateway sales stay with their own converters</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Keep the original payout exports, named by payout ID — months later,
            when a deposit is questioned, the file that explains it can be re-run and will produce
            the same entries. A plain bank CSV, rather than a payout export, belongs in the{" "}
            <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a>,
            and in-person sellers can use the{" "}
            <a href="/tools/square-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Square payout converter</a>{" "}
            for the same clearing method at the till.
          </p>
        </>
      }
    />
  );
}
