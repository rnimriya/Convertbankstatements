import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { PayoutConverterFree } from "@/components/tools/PayoutConverterFree";

const PAGE_URL = "https://www.convertstatement.online/tools/etsy-to-quickbooks";

export const metadata: Metadata = {
  title: "Etsy to QuickBooks Converter — Free Etsy Statement to QBO | Convert Statement",
  description:
    "Free Etsy to QuickBooks converter: turn an Etsy monthly statement CSV into clearing-account entries (gross sales, refunds, fees) with a deposit tie-out check. Both the CSV and QBO downloads are free, with no account needed.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Etsy to QuickBooks Converter — Etsy Statement to QBO",
    description:
      "Upload an Etsy statement CSV — get gross, refunds, and fees split correctly for QuickBooks with a tie-out check. CSV and QBO downloads are both free.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "Which Etsy export should I upload?",
    a: "The monthly statement CSV from Etsy Shop Manager, under Finance and Monthly statements — the payment-account statement that carries the fee detail. The converter reads date, type, gross, fee, and net, and uses a deposit-id column to group rows by deposit when one is present. Skip the orders and sales reports: they describe what you sold, but not what Etsy charged or paid.",
  },
  {
    q: "Why is my Etsy deposit so much smaller than my sales?",
    a: "Because Etsy settles net. Before money reaches your bank, Etsy deducts transaction fees on every order, listing fees and renewals, other statement charges, and refunds — and newer shops may have a reserve held back. The monthly statement shows every deduction; this converter turns the sales, refunds, and fee totals into separate lines so the whole gap is explained, and the tie-out proves it against the deposit.",
  },
  {
    q: "What is the difference between Etsy transaction fees and listing fees?",
    a: "A listing fee is charged per item listed, and again when a listing renews — it can arrive in a week when nothing sold. A transaction fee is a percentage of a sale's total, including shipping, and only exists when a sale does. In the converted summary both land in the statement's fee total, as one fees line per deposit; keep the original statement CSV when you want the listing-versus-transaction split for pricing decisions.",
  },
  {
    q: "Is this Etsy to QuickBooks converter really free?",
    a: "Yes — completely, on this page. The scan, the per-deposit summary, the tie-out check, the clearing-entries CSV, and the .QBO download are all free, and no account is needed for any of them. Your statement is processed in memory to build the summary and the downloads, and it is not stored afterwards.",
  },
  {
    q: "Can I convert a full year of Etsy statements?",
    a: "Etsy issues statements monthly, so download each month's CSV and convert them one month at a time. That keeps every deposit's tie-out separate and matches how you close the books, which makes any problem far easier to find than in a year-long file. Download each statement when Etsy issues it, even if you convert later, so year-end never becomes a scavenger hunt through Shop Manager.",
  },
  {
    q: "Why does a deposit not tie out against its statement rows?",
    a: "Usually timing, not error. A reserve release puts money from an earlier selling period into this deposit; a deposit below Etsy's minimum rolls forward and arrives combined with the next one; a sale refunded after the month closed reduces a later deposit instead. Compare the difference the tool shows against those items — and note that deposits are grouped by the deposit-id in the file when one is present, so a statement with no deposit rows has no bank total to check against.",
  },
];

const HOWTO = [
  { title: "Export from Etsy", body: "In Etsy Shop Manager, go to Finance → Monthly statements, choose the month, and download the statement CSV, with date, type, gross, fee, and net columns." },
  { title: "Upload it here", body: "Drop the CSV in (max 10 MB, no account). The tool groups the statement rows into deposits — by deposit ID when the file carries one." },
  { title: "Review the tie-out", body: "Check each deposit's gross, refunds, and fees, and confirm the deposit ties out to the deposit total recorded in the statement rows." },
  { title: "Download and import", body: "Download the CSV or the .QBO — both are free on this tool — and import it into an Etsy Clearing account in QuickBooks. Match the transfer line to the real Etsy deposit in your bank feed." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function EtsyToQuickBooksPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="Etsy Statement to QuickBooks"
      subtitle="Turn an Etsy monthly statement CSV into QuickBooks-ready books: gross sales, refunds, and fees correctly split through a clearing account — with a deposit tie-out check. Both downloads are free, no account needed."
      tool={<PayoutConverterFree provider="etsy" />}
      currentPath="/tools/etsy-to-quickbooks"
      faqs={FAQS}
      howToName="How to record Etsy deposits in QuickBooks"
      howToSteps={HOWTO}
      privacyLine="No account needed · Both downloads free · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>An Etsy deposit is what is left after a month of small fees</h2>
          <p className={P}>
            An Etsy deposit never looks like a month of selling, because it is not one. It is what
            remains after Etsy has taken a transaction fee on every order, listing fees when items
            were listed and renewed — including renewals in weeks when nothing sold — any other
            charges the statement carries, and the refunds you issued along the way. Newer shops
            may have a reserve held back on top. The deposit date matches none of the sale dates,
            and its amount matches none of your order totals. Treat that deposit as your sales
            figure and the books understate revenue by every deduction, while the fees — real,
            deductible costs of selling — never appear anywhere at all.
          </p>
          <p className={P}>
            Etsy's monthly statement is the one export where all of it appears together: sales,
            every fee type, refunds, and the deposits themselves, row by row. That makes it the
            right source for the books — and a maze to read by hand, which is why it so often goes
            unreconciled. This converter reads the statement, groups its rows into deposits, and
            rebuilds each one through an Etsy Clearing account: gross sales in as income, the
            statement's fees out as expense, refunds against income, and the deposit as a transfer
            to checking. When the pieces sum exactly to what hit your bank, the deposit is
            explained, not approximated — and this tool is fully free, summary, CSV, and QBO alike.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Row in the monthly statement</th>
                  <th className={TH}>What it really is</th>
                  <th className={TH}>Line it becomes</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Sale</strong></td><td className={TD}>An order paid through Etsy's payment account, at gross</td><td className={TD}>Income into Etsy Clearing</td></tr>
                <tr><td className={TD}><strong>Fee rows</strong></td><td className={TD}>Transaction fees, listing fees and renewals, and other statement charges, each with its amount in the fee or gross column</td><td className={TD}>The deposit's fees line — one expense total per deposit</td></tr>
                <tr><td className={TD}><strong>Tax rows</strong></td><td className={TD}>Rows Etsy labels as tax in the statement's type column</td><td className={TD}>Counted with the fee rows, as the converter's type mapping treats them</td></tr>
                <tr><td className={TD}><strong>Refund</strong></td><td className={TD}>Money returned to a buyer</td><td className={TD}>Contra-income, reducing gross sales</td></tr>
                <tr><td className={TD}><strong>Chargeback / dispute</strong></td><td className={TD}>A payment dispute pulled back through the payment account</td><td className={TD}>Its own contra line, kept out of ordinary refunds</td></tr>
                <tr><td className={TD}><strong>Deposit / payout</strong></td><td className={TD}>The net Etsy actually sent to your bank, in the statement's net column</td><td className={TD}>Transfer from Etsy Clearing to checking — the tie-out target</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>How to convert an Etsy monthly statement, step by step</h2>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 1 — Download the monthly statement from Etsy.</strong>{" "}
            In Etsy Shop Manager, open Finance, then Monthly statements, choose the month, and
            download its CSV — the payment-account statement, the one that carries fee detail. The
            converter reads date, type, gross, fee, and net, and uses a deposit-id (or payout-id)
            column to group rows when the file carries one. If the headers differ, rename them to
            match. A file with no type or gross column is rejected with an explanation.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 2 — Upload the CSV.</strong>{" "}
            Drop the file into the tool above (CSV, up to 10 MB). No account is needed; the file is
            processed in memory and never stored. Rows are grouped into deposits by the deposit ID
            in the file when one is present; without one, the statement converts as a single
            summary, and there is no separate deposit total in the file to tie out against — the
            summary will say so rather than pretend a check happened.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 3 — Review each deposit's tie-out.</strong>{" "}
            For every deposit you see gross sales, refunds, disputes, fees, and adjustments
            totalled separately, the computed net, and a tie-out verdict against the deposit amount
            recorded in the statement rows. Fee and tax rows are totalled from the amounts in your
            file exactly as given — the converter does not estimate Etsy's fee schedule, and it
            sums the statement's fee types into one fees line per deposit, so keep the original
            CSV if you later want the listing-versus-transaction breakdown.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 4 — Download and import.</strong>{" "}
            Both downloads on this tool are free: the clearing-entries CSV and the .QBO file.
            Create a bank account in QuickBooks named Etsy Clearing once, import the QBO into it,
            categorize the lines — sales to income, fees to their expense account, refunds against
            income — and match the transfer to the real Etsy deposit in your checking feed. Every
            entry carries a unique transaction ID derived from its deposit, so re-importing a month
            is recognized instead of duplicated. Your tax return reports gross receipts, not
            deposits; this split is what makes the gross figure provable.
          </p>

          <figure className="mt-6 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-review.webp" alt="A seller reviewing an Etsy monthly statement against converted QuickBooks entries before importing them" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">Reviewing the month's Etsy statement before it becomes bookkeeping.</figcaption>
          </figure>

          <h2 className={H2M}>Etsy statement problems and their fixes</h2>
          <h3 className={H3}>Fees that arrive without any sale attached</h3>
          <p className={P}>
            Listing renewals and auto-renewals charge your payment account on their own schedule,
            including quiet weeks with no orders at all. A month reconstructed from the orders list
            will therefore never tie out — some of its fees bought no sale. This is the deepest
            reason the statement, not the order list, has to be the source document: the statement
            is the complete record of what Etsy charged, whether or not a sale was involved.
          </p>
          <h3 className={H3}>All the fees lumped into one vague number — or into cost of goods sold</h3>
          <p className={P}>
            Two opposite mistakes, both common. Booking the deposit as sales deletes the fees
            entirely; booking them inside cost of goods sold keeps them but corrupts your per-item
            margins, the numbers you price from. Transaction and listing fees are selling expenses,
            not product costs. In the converted file they land as one fees expense line per deposit
            — honest at deposit level, with the original statement retained whenever you need the
            finer split between fee types for a pricing review.
          </p>
          <h3 className={H3}>A deposit that contains another month's money</h3>
          <p className={P}>
            Even a perfectly kept statement produces surprising deposits. A reserve held on a newer
            shop releases earlier sales into a later deposit, so one deposit contains money from
            two selling periods and the next looks short. A deposit below Etsy's minimum threshold
            rolls forward and arrives combined. A refund issued after the month closed lands in the
            following statement. None of these are errors — but all of them break bookkeeping that expects a deposit to equal a month's sales. The clearing-account method absorbs every one, because it rebuilds each deposit from the rows Etsy actually settled.
          </p>
          <h3 className={H3}>Two shops, or personal spending, sharing one trail</h3>
          <p className={P}>
            Running two shops through one clearing account, or paying for supplies from the account
            Etsy deposits into, turns every tie-out into an argument about whose money a line
            belongs to. One shop, one clearing account, business spending on business rails: the
            monthly proof only works when the trail is clean.
          </p>

          <h2 className={H2M}>Three ways to get Etsy statements into QuickBooks, compared</h2>
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
                <tr><td className={TD}><strong>Connector / sync apps</strong></td><td className={TD}>A monthly subscription, plus order-level mapping to maintain</td><td className={TD}>Order-grain syncs import a great deal of detail the books may not need, and the deposit still has to be reconciled against it; the fees that arrive without orders are exactly the lines order-based workflows handle worst</td></tr>
                <tr><td className={TD}><strong>Spreadsheet hand-entry</strong></td><td className={TD}>Free, and tempting at tax time</td><td className={TD}>A monthly statement is dozens of small rows; hand-entry skips the fee-only rows, and a year of statements typed in January has no tie-out proving any single deposit along the way</td></tr>
                <tr><td className={TD}><strong>This file-based converter</strong></td><td className={TD}>Free in full — scan, summary, CSV, and QBO, with no account. No live connection to QuickBooks is offered or needed</td><td className={TD}>You work month by month, as Etsy issues statements, and fee types are summed into one fees line per deposit — the statement itself stays your source for the finer breakdown</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            The monthly habit is the whole system: download the statement when Etsy issues it,
            convert it, import it, watch the clearing account return to zero. Sellers who also run
            their own storefront can apply the same method with the{" "}
            <a href="/tools/shopify-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Shopify payout converter</a>,
            in-person sellers with the{" "}
            <a href="/tools/square-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Square payout converter</a>,
            marketplace sellers on Amazon with the{" "}
            <a href="/tools/amazon-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Amazon settlement converter</a>,
            and a plain bank CSV belongs in the{" "}
            <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a>.
          </p>
        </>
      }
    />
  );
}
