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
    q: "How do I record PayPal payouts in QuickBooks correctly?",
    a: "Do not book the net transfer as sales — it understates revenue and hides fees. Use a clearing account: gross payments in as income, refunds against it, fees as an expense against it, then each transfer as a move to checking. This tool builds that split from your activity CSV.",
  },
  {
    q: "Which PayPal export should I upload?",
    a: "In PayPal, go to Activity → Statements → Activity download and choose CSV. That file has the Date, Type, Gross, Fee, and Net columns the tool needs. Bank transfers in the file are used to split activity into payout periods.",
  },
  {
    q: "How are PayPal fees and refunds handled?",
    a: "Processing fees become expense lines, refunds reduce gross sales (PayPal keeps its fixed fee on refunded payments, and that flows through to the fee line), and chargebacks are broken out separately. The tie-out check verifies everything nets to the transfer amount.",
  },
  {
    q: "Are withdrawals to my bank account income?",
    a: "No. A withdrawal moves money you already earned from your PayPal balance to your own bank account — it is a transfer between your accounts, not new revenue. Book it as a transfer out of the PayPal clearing account into checking. Treating it as income double-counts sales you recorded at gross.",
  },
  {
    q: "How do I import the QBO into QuickBooks?",
    a: "First create a bank account in QuickBooks named 'PayPal Clearing'. Import the QBO there, then match each transfer line against the real PayPal transfer deposit in your bank feed. When the clearing account nets to zero, the period is fully reconciled.",
  },
  {
    q: "What's the difference from the Stripe converter?",
    a: "The accounting is the same clearing-account model, but the parsing is built for PayPal's activity export — including its transfer-to-bank rows, which the tool uses to split your activity into payout periods automatically, each one tied out to its own transfer.",
  },
  {
    q: "Can I import the same activity period twice?",
    a: "Re-running a file is safe: every clearing entry carries a unique transaction ID, and QuickBooks ignores rows it has already imported. The risk is mixing routes — importing overlapping exports through the bank feed and through this converter in the same period. Pick one route per period and overlaps stop mattering.",
  },
  {
    q: "What do currency conversion lines mean for my books?",
    a: "When a payment arrives in another currency, PayPal converts it at its own rate before it reaches your balance. Those rows are conversion lines, not sales: the converter treats them as movements between currency balances inside the clearing account, so the converted amount is what your income reflects.",
  },
  {
    q: "How do I connect PayPal to QuickBooks Online?",
    a: "PayPal's QuickBooks connector exists, but it syncs summarized activity and is a common source of miscategorized fees and duplicates. The file route is easier to audit: download the activity CSV, convert it into gross, refund, and fee lines through a clearing account, and import once — no sync to break.",
  },
  {
    q: "Is my data uploaded to your servers?",
    a: "No. Your CSV is processed in memory to build the payout summary and the download files, and it is not stored on our servers afterwards. Nothing is kept between sessions, and we never sell, share, or use your financial data for anything else.",
  },
];

const HOWTO = [
  { title: "Download from PayPal", body: "In PayPal, go to Activity → Statements → Activity download and choose CSV." },
  { title: "Upload it here", body: "Drop the CSV in — the tool parses it and splits activity into payout periods at each bank transfer." },
  { title: "Review the tie-out", body: "Check gross, fees, and refunds per period, and confirm each period ties out to its transfer." },
  { title: "Import into QuickBooks", body: "Download the CSV free, or the QBO on Pro, and import it into a PayPal Clearing account in QuickBooks." },
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
          <h2 className={H2}>Why the transfer in your bank is not the sale</h2>
          <p className={P}>
            PayPal collects money the moment a buyer pays, but it pays you on your schedule, not the
            sale's. When you withdraw, what lands in your bank is everything since the last
            withdrawal — sales, minus PayPal's fees, minus refunds you issued, plus a few lines that
            were never sales at all. Book that transfer as revenue and three errors land at once:
            income is understated by the fees and refunds buried inside it, fee expense disappears
            from the P&L, and any non-sale movement in the account gets dressed up as business
            income at tax time.
          </p>
          <p className={P}>
            The way out is already sitting in PayPal's own reports: the activity download records
            every payment at gross, with its fee and net beside it. Run that file through a clearing
            account — income in at gross, fees and refunds against it, withdrawals out as transfers —
            and the transfer stops being a mystery number and becomes the one line that has to
            match. That is the split this converter builds.
          </p>

          <h2 className={H2M}>Anatomy of a PayPal activity download</h2>
          <p className={P}>
            Unlike a per-payout bundle, PayPal's export is one continuous ledger in which every row
            carries three money columns — Gross, Fee, and Net. What separates a clean import from a
            mess is the row types:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Row in the export</th>
                  <th className={TH}>What it really is</th>
                  <th className={TH}>How it should be booked</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Payment received</strong></td><td className={TD}>A buyer's payment, shown at its full gross amount</td><td className={TD}>Income, into the clearing account</td></tr>
                <tr><td className={TD}><strong>Payment fee</strong></td><td className={TD}>PayPal's processing charge, already shown as its own column</td><td className={TD}>Merchant fees expense</td></tr>
                <tr><td className={TD}><strong>Refund or reversal</strong></td><td className={TD}>Money returned to a buyer; PayPal keeps its fixed fee on the original payment</td><td className={TD}>Contra-income, with the kept fee staying in expense</td></tr>
                <tr><td className={TD}><strong>Chargeback</strong></td><td className={TD}>A payment reversed by the buyer's bank or card issuer</td><td className={TD}>Contra-income, tracked on its own line</td></tr>
                <tr><td className={TD}><strong>Currency conversion</strong></td><td className={TD}>A balance converted between currencies at PayPal's rate</td><td className={TD}>A movement between currency balances — not a sale</td></tr>
                <tr><td className={TD}><strong>Withdrawal to bank</strong></td><td className={TD}>Your own money moving to your own bank account</td><td className={TD}>Transfer from clearing to checking — never income</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>How this converter splits activity into payout periods</h2>
          <p className={P}>
            PayPal never labels a "payout" the way other platforms do, so the converter reconstructs
            them: it scans the activity file for withdrawal-to-bank rows and treats each withdrawal
            as the end of a period. Everything since the previous withdrawal belongs to the transfer
            that followed it. Each period is then totalled — gross in, fees, refunds, chargebacks —
            and checked against the withdrawal amount before any entries are built.
          </p>
          <p className={P}>
            Periods with no withdrawal — money still sitting in PayPal when the file ends — are reported as an open period, so nothing is silently dropped. The result has the same shape as any other platform's payout: a set of clearing-account
            entries per period, each row carrying a unique transaction ID derived from the period,
            so QuickBooks recognizes a re-import instead of duplicating it. The per-period summary
            is free to view with no account; the CSV download is free, and the QBO file is on Pro.
          </p>

          <h2 className={H2M}>The clearing-account method for PayPal</h2>
          <p className={P}>
            The clearing account stands in for your PayPal balance inside QuickBooks. Money enters
            it when buyers pay, leaves it when you withdraw, and whatever sits in it at month-end is
            simply PayPal money you have not withdrawn yet — which is correct, and provable:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li>Create a bank account in QuickBooks named <strong className="text-zinc-900 dark:text-white">PayPal Clearing</strong> (one-time setup).</li>
            <li>Record gross payments received as income into PayPal Clearing.</li>
            <li>Record fees as an expense and refunds as contra-income against the same account.</li>
            <li>Record each withdrawal as a transfer from PayPal Clearing to your checking account.</li>
            <li>Match the transfer to the deposit that appears in your bank feed.</li>
          </ol>
          <p className={P}>
            When a period is fully posted, its activity in the clearing account nets to zero and the
            remaining balance is just the money still sitting in PayPal — no unexplained difference
            to chase.
          </p>

          <h2 className={H2M}>Downloading the right report from PayPal</h2>
          <p className={P}>
            In PayPal, go to <strong className="text-zinc-900 dark:text-white">Activity</strong>, then <strong className="text-zinc-900 dark:text-white">Statements</strong> (in some accounts,
            Reports → Statements), choose <strong className="text-zinc-900 dark:text-white">Activity download</strong>, set your date range, and select
            CSV. The standard activity download already includes the Date, Type, Gross, Fee, and Net
            columns the converter needs. Match the range to how you actually withdraw — weekly
            withdrawals inside a monthly file are fine, because the converter splits at each
            withdrawal anyway. One discipline matters: never re-download a range you have already
            imported and feed both files in; overlapping exports are the number one cause of
            duplicated PayPal income. If your account holds more than one currency, the converter keeps
            conversion lines as movements between balances instead of mistaking them for income.
          </p>

          <figure className="mt-10">
            <img src="/tools/csv-to-qbo-spreadsheet.webp" alt="A PayPal activity spreadsheet in which every row carries its own gross, fee, and net amounts" className="w-full rounded-[20px] border border-[#E3EDE0]" loading="lazy" />
            <figcaption className="mt-2 text-center text-xs text-zinc-400">Illustration: a PayPal activity export — the gross, fee, and net columns are what make a clean split possible.</figcaption>
          </figure>

          <h2 className={H2M}>A worked example: one withdrawal period, tied out</h2>
          <p className={P}>
            Sample figures, rounded on purpose. One week of activity, closed out by a single
            withdrawal:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Line</th><th className={TH}>Amount</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}>Gross payments received</td><td className={TD}>$1,800.00</td></tr>
                <tr><td className={TD}>Refunds issued</td><td className={TD}>−$150.00</td></tr>
                <tr><td className={TD}>Processing fees (from the Fee column)</td><td className={TD}>−$62.00</td></tr>
                <tr><td className={TD}>Chargebacks</td><td className={TD}>$0.00</td></tr>
                <tr><td className={TD}><strong>Withdrawal to the bank</strong></td><td className={TD}><strong>$1,588.00</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            The tie-out: $1,800.00 − $150.00 − $62.00 = $1,588.00. In the clearing account that is
            $1,800.00 of income, $150.00 of contra-income, and $62.00 of fee expense, leaving exactly
            $1,588.00 — which the withdrawal transfers to checking and zeroes the period. Booked as
            a single "sale" of $1,588.00, the same week would understate revenue by $212.00 and make
            the fees vanish entirely. (Sample figures, shown for illustration.)
          </p>

          <h2 className={H2M}>PayPal mistakes that distort the books</h2>
          <h3 className={H3}>Booking withdrawals as income</h3>
          <p className={P}>
            The withdrawal is the most visible PayPal number in your bank feed, which is exactly why
            it gets booked — and why it is wrong. It is a movement of money you already own, between
            two of your own accounts. Income was earned when the buyers paid, at gross; the
            withdrawal is only the transfer that proves it arrived.
          </p>
          <h3 className={H3}>Ignoring the Fee column</h3>
          <p className={P}>
            PayPal is generous enough to print the fee on every row — and imports still throw it
            away by mapping only Gross, or only Net. Map Gross alone and fees disappear from the
            P&L; map Net as the sale and revenue is understated by the same amount. The fee column
            has to land in its own expense account.
          </p>
          <h3 className={H3}>Importing the same period twice</h3>
          <p className={P}>
            Overlapping date ranges are the classic PayPal duplicate: last month's file ended on the
            31st, this month's started on the 28th "to be safe", and three days now exist twice.
            Converted entries carry unique IDs that protect you here; bank-feed imports of the same
            rows often do not.
          </p>
          <h3 className={H3}>Treating currency conversions as sales</h3>
          <p className={P}>
            A conversion row looks like money arriving, and booked as income it manufactures revenue
            out of your own balance. It is a movement between currency balances at PayPal's rate —
            the income was the original payment, counted once, in the currency it settled in.
          </p>

          <h2 className={H2M}>Pending payments, holds, and eChecks</h2>
          <p className={P}>
            Not every payment in the activity file was final when it downloaded. A buyer paying by
            eCheck clears days after the sale; PayPal can place a temporary hold on a payment under
            review; a payment sent to an unconfirmed address can sit pending. Those rows appear in
            the export before the money is truly yours, and they settle in whichever period they
            clear — not the period of the original sale.
          </p>
          <p className={P}>
            The converter counts each row in the period where it appears in the file, which is the
            same place your withdrawal arithmetic puts it. If you re-download a range after a hold
            releases, import the newer file for that period rather than adding its rows a second
            time — the periods are reconstructed from the file you give it.
          </p>

          <h2 className={H2M}>When a period will not tie out</h2>
          <p className={P}>
            Most differences have ordinary causes. A payment was still pending or on hold when the
            withdrawal was calculated, so it belongs to the next period. An eCheck cleared days after
            the sale date. A refund was issued in a later period than the payment it reverses — the
            sale sits in one period, the contra-income in the next, and each period still ties on
            its own. Foreign-currency rows settled at PayPal's conversion rate, not the rate on the
            invoice. The tie-out names the difference per period; if QuickBooks and the bank still
            disagree after importing, the{" "}
            <a href="/tools/reconciliation-finder" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Reconciliation Difference Finder</a>{" "}
            compares your statement against QuickBooks entry by entry.
          </p>

          <h2 className={H2M}>Make it a system, not a monthly rescue</h2>
          <p className={P}>
            PayPal bookkeeping breaks when it is done from memory at month-end; it holds up when
            each period follows the same five steps. A free account keeps every conversion in one
            searchable history, so the activity file behind a questioned number is always findable.
            The dashboard adds bulk conversion when several months land at once, and client portals
            if clients send you their own PayPal exports — each client uploads through their own
            link. QBO downloads sit on{" "}
            <a href="/pricing" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Pro</a>,
            and if you also take card payments directly, the{" "}
            <a href="/tools/free-stripe-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Stripe to QuickBooks converter</a>{" "}
            applies the same clearing model there. Run the{" "}
            <a href="/tools/free-qbo-cleanup-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO Duplicate Finder</a>{" "}
            over any file you are unsure about — with PayPal, the cheapest error is the duplicate
            you catch before importing.
          </p>
        </>
      }
    />
  );
}
