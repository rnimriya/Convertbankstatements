import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { PayoutConverter } from "@/components/tools/PayoutConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/free-paypal-to-quickbooks";

export const metadata: Metadata = {
  title: "PayPal Payout to QBO Converter — Free | Convert Statement",
  description:
    "Free PayPal Payout to QBO converter: turn a PayPal activity CSV into QuickBooks-ready books — gross sales, refunds, and fees split through a clearing account with a payout tie-out check. No account needed to scan, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "PayPal Payout to QBO Converter — Free",
    description:
      "Upload a PayPal activity CSV — get gross, fees, and refunds split correctly for QuickBooks with a tie-out check. Free.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "Which PayPal export should I upload?",
    a: "In PayPal, go to Activity, then Statements, and choose the Activity download as CSV. The converter needs the Date, Type, Gross, Fee, and Net columns that file carries. Leave the bank transfer rows in — the tool uses each transfer to a bank account to close one payout period and start the next.",
  },
  {
    q: "Are PayPal withdrawals to my bank account income?",
    a: "No. A withdrawal moves money you already earned from your PayPal balance to your own bank account — a transfer between two of your accounts, not new revenue. The income happened when buyers paid, at gross. This converter treats every withdrawal row as the transfer line out of the PayPal clearing account, so sales are counted once, when received.",
  },
  {
    q: "How do I record PayPal fees in QuickBooks?",
    a: "PayPal prints the fee on every activity row, in its own Fee column — the mistake is importing only Gross or only Net and throwing that column away. The converter reads the fee on each row and posts each period's total as an expense line through the clearing account, so revenue stays gross and the cost of taking PayPal payments shows as a real expense.",
  },
  {
    q: "Why doesn't one of my periods tie out to its withdrawal?",
    a: "Usually timing inside PayPal. A payment under a temporary hold, or an eCheck that had not cleared, appears in your activity before the money can be part of a withdrawal; it settles in a later period. A refund issued after the withdrawal was calculated lands in the next period too. The tool shows the difference per period so you can match it to the hold, the pending payment, or the late refund.",
  },
  {
    q: "Is this PayPal to QuickBooks converter free?",
    a: "The scan, the per-period summary, the tie-out check, and the clearing-entries CSV download are free with no account. The .QBO download is on Pro. Activity not yet withdrawn is reported as an open period with no transfer to check against — nothing is dropped just because the money is still sitting in PayPal.",
  },
  {
    q: "Can I import the same PayPal period twice?",
    a: "The converted entries carry unique transaction IDs derived from the period, and QuickBooks skips IDs it has already imported. The real duplicate risk with PayPal is overlapping downloads — one file ending on the 31st and the next starting on the 28th to be safe — fed through different routes. Keep date ranges non-overlapping and use one route per period.",
  },
];

const HOWTO = [
  { title: "Download from PayPal", body: "In PayPal, go to Activity → Statements → Activity download and choose CSV — the file with Date, Type, Gross, Fee, and Net columns, including its bank transfer rows." },
  { title: "Upload it here", body: "Drop the CSV in (max 10 MB, no account). The tool parses PayPal's activity layout and splits the activity into periods at each withdrawal to your bank." },
  { title: "Review the tie-out", body: "Check each period's gross, fees, refunds, and chargebacks, and confirm the period ties out to its withdrawal amount. Activity not yet withdrawn shows as an open period." },
  { title: "Download and import", body: "Download the clearing-entries CSV free, or the .QBO on Pro, and import it into a PayPal Clearing account in QuickBooks. Match each transfer line to the real withdrawal deposit in your bank feed." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function PayPalToQuickBooksPage() {
  return (
    <ToolPageLayout
      eyebrow="Free Tool"
      title="PayPal Payout to QBO Converter"
      subtitle="Turn a PayPal activity CSV into QuickBooks-ready books: gross sales, refunds, and fees correctly split through a clearing account — with a payout tie-out check."
      tool={<PayoutConverter provider="paypal" />}
      currentPath="/tools/free-paypal-to-quickbooks"
      faqs={FAQS}
      howToName="How to record PayPal payouts in QuickBooks"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>A PayPal withdrawal is a transfer, not a sale</h2>
          <p className={P}>
            PayPal pays you on two different clocks. Buyers pay the moment they check out, and the
            money lands in your PayPal balance at gross, with PayPal's fee taken on each payment.
            You get paid when you withdraw — and a withdrawal is simply everything that has
            accumulated since the last one: this week's sales, minus fees, minus a refund you
            issued for last month's order, minus a chargeback, with nothing in the bank-feed line
            to say which is which. Book that withdrawal as revenue and income is understated by
            every fee and refund inside it, fee expense disappears from the profit and loss
            statement, and money that was never a sale at all gets reported as if it were.
          </p>
          <p className={P}>
            PayPal's own activity download is the document that untangles this, because it records
            every payment at gross with its fee and its net printed beside it, and it records every
            withdrawal as a row of its own. Run that file through a clearing account — payments in
            at gross, fees and refunds against them, each withdrawal out as a transfer to checking
            — and the withdrawal stops being a mystery number. It becomes the proof: if a period's
            activity nets exactly to the withdrawal that closed it, the period is reconciled. That
            is the split this converter builds, period by period.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Row in the activity download</th>
                  <th className={TH}>What it really is</th>
                  <th className={TH}>Line it becomes</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Payment received</strong></td><td className={TD}>A buyer's payment — website payment, express checkout, or invoice payment — shown at gross with its fee</td><td className={TD}>Income into PayPal Clearing; the fee goes to the fees line</td></tr>
                <tr><td className={TD}><strong>Refund or reversal</strong></td><td className={TD}>Money returned to a buyer</td><td className={TD}>Contra-income, reducing gross sales</td></tr>
                <tr><td className={TD}><strong>Chargeback / dispute</strong></td><td className={TD}>A payment reversed through the buyer's bank or card issuer</td><td className={TD}>Its own contra line, tracked separately from ordinary refunds</td></tr>
                <tr><td className={TD}><strong>Fee rows</strong></td><td className={TD}>PayPal charges that appear as rows of their own rather than in a payment's Fee column</td><td className={TD}>Expense lines through the clearing account</td></tr>
                <tr><td className={TD}><strong>Transfer / withdrawal to bank</strong></td><td className={TD}>Your own money moving to your own bank account</td><td className={TD}>Transfer from PayPal Clearing to checking — the tie-out target for the period it closes</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>How to convert a PayPal activity download, step by step</h2>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 1 — Download the activity file from PayPal.</strong>{" "}
            Go to Activity, then Statements (in some accounts, Reports and then Statements), choose
            the Activity download, set your date range, and select CSV. The converter needs a file
            with Gross and Type columns — the standard activity download, which carries Date, Type,
            name, Gross, Fee, and Net. Leave the transfer rows in: they look like clutter, but they
            are how the tool knows where one payout period ends and the next begins.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 2 — Upload the CSV.</strong>{" "}
            Drop the file into the tool above (CSV, up to 10 MB). The scan is free, needs no
            account, and the file is processed in memory and never stored. If the file does not
            look like a PayPal activity export — no Gross or Type column — the tool stops and tells
            you which download to use instead of guessing.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 3 — Review the periods and their tie-outs.</strong>{" "}
            PayPal never labels a payout, so the converter reconstructs periods from your own
            behaviour: it sorts the activity, takes each transfer-to-bank row in date order, and
            assigns every row since the previous transfer to the period that transfer closed.
            Each period is totalled — gross in, refunds, chargebacks, fees — and checked against
            that period's withdrawal amount. Activity after your last withdrawal is reported as an
            open period with no bank total to check against, which is correct: that money is still
            in PayPal, and the clearing account should still be holding it.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 4 — Download and import.</strong>{" "}
            The clearing-entries CSV is free; the .QBO download is on Pro. Create a bank account in
            QuickBooks named PayPal Clearing once, import the file into it, and match each transfer
            line against the withdrawal deposit in your checking feed. Whatever balance remains in
            the clearing account afterwards should equal the money still sitting in your PayPal
            balance — a check you can run at any month-end. Take card payments directly as well?
            The{" "}
            <a href="/tools/free-stripe-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Stripe payout converter</a>{" "}
            applies the same clearing model to Stripe's exports.
          </p>

          <figure className="mt-10 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-spreadsheet.webp" alt="A PayPal activity spreadsheet in which every row carries its own gross, fee, and net amounts" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">A PayPal activity export — the gross, fee, and net columns are what make a clean split possible.</figcaption>
          </figure>

          <h2 className={H2M}>PayPal problems that break the tie-out: symptoms and fixes</h2>
          <h3 className={H3}>Withdrawals booked as income, so sales count twice</h3>
          <p className={P}>
            The withdrawal is the most visible PayPal number in a bank feed, which is why it gets
            categorized as sales — and if the underlying payments were also recorded anywhere, the
            same money is now revenue twice. Even on its own it is wrong: it reports the net, not
            the gross, and it dates income by when you withdrew rather than when you sold. The fix
            is structural: withdrawals are only ever transfers out of the clearing account.
          </p>
          <h3 className={H3}>Holds and pending payments make a period come up short</h3>
          <p className={P}>
            Not every payment in the activity file was final when it downloaded. An eCheck clears
            days after the sale; PayPal can place a temporary hold on a payment under review. That
            money appears in your activity before it can be part of a withdrawal, so the period
            that contains the sale can show a difference against the withdrawal that closed it —
            and the held money then settles inside a later period's arithmetic. The converter
            counts each row in the period where it appears in the file, which is the same place
            your withdrawal puts it; when a period flags a difference, check PayPal for holds and
            pending payments in that window first, before assuming an error.
          </p>
          <h3 className={H3}>The Fee column never made it into QuickBooks</h3>
          <p className={P}>
            PayPal does the hard part for you — the fee is printed on every row — and imports still
            lose it by mapping only one money column. Map Gross alone and fees vanish from the
            profit and loss statement; map Net as the sale amount and revenue is understated by
            exactly the fees. Either way the business looks more profitable per sale than it is.
            The converter reads all three columns: Gross to income, Fee to expense, Net as the
            arithmetic that has to tie to the withdrawal.
          </p>
          <h3 className={H3}>Overlapping downloads duplicate a few days every month</h3>
          <p className={P}>
            The classic PayPal duplicate is a date range chosen "to be safe": last month's file
            ended on the 31st, this month's starts on the 28th, and three days now exist in two
            files. Converted QBO entries carry unique IDs that protect the import, but the clean
            habit costs nothing: download contiguous, non-overlapping ranges, and let each
            withdrawal close exactly one period.
          </p>

          <h2 className={H2M}>Three ways to get PayPal activity into QuickBooks, compared</h2>
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
                <tr><td className={TD}><strong>Connector / sync apps</strong></td><td className={TD}>A monthly subscription, and a live connection to maintain</td><td className={TD}>A sync is only as good as its mapping: summarized syncs are a common source of fees posted to the wrong account and of duplicates when a sync overlaps a manual import. Check what yours actually posts, line by line, before trusting it</td></tr>
                <tr><td className={TD}><strong>Spreadsheet hand-entry</strong></td><td className={TD}>Free, and survivable for a quiet month</td><td className={TD}>PayPal activity is row after row of small payments; hand-entry skips fee rows, mistypes amounts, and gives you no period tie-out to prove the month before it enters the books</td></tr>
                <tr><td className={TD}><strong>This file-based converter</strong></td><td className={TD}>The scan, summary, and CSV are free; the .QBO download is on Pro. No live connection to QuickBooks is offered or needed</td><td className={TD}>You download and import a file per period — routine instead of automatic — and periods are reconstructed from your withdrawal rows, so an export with no withdrawals yet comes back as one open period</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Sellers who also run a storefront can keep the same discipline with the{" "}
            <a href="/tools/etsy-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Etsy statement converter</a>{" "}
            or the{" "}
            <a href="/tools/square-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Square payout converter</a>,
            and a plain bank CSV belongs in the{" "}
            <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a>.
          </p>
        </>
      }
    />
  );
}
