import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { PayoutConverterFree } from "@/components/tools/PayoutConverterFree";

const PAGE_URL = "https://www.convertstatement.online/tools/square-to-quickbooks";

export const metadata: Metadata = {
  title: "Square to QuickBooks Converter — Free Square Payout to QBO | Convert Statement",
  description:
    "Free Square to QuickBooks converter: turn a Square payout CSV into clearing-account entries (gross sales, refunds, fees) with a payout tie-out check. Both the CSV and QBO downloads are free, with no account needed.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Square to QuickBooks Converter — Square Payout to QBO",
    description:
      "Upload a Square payout CSV — get gross, refunds, and fees split correctly for QuickBooks with a tie-out check. CSV and QBO downloads are both free.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I record Square payouts in QuickBooks?",
    a: "Record by payout, not by day. A Square payout bundles card sales from the till with processing fees and refunds already deducted, and the deposit lands after the sales it covers. This tool unpacks each payout into gross sales, refunds, and fees through a Square Clearing account, then transfers the net to checking. When clearing nets to zero for a payout, that deposit is reconciled.",
  },
  {
    q: "Which Square export should I upload?",
    a: "A Square payout CSV with the columns payout-id, date, type, gross, fee, and net. In Square Dashboard, open your reports or your balance and payout views and export the payout detail as a CSV. The converter also recognizes a few alternate header names — gross sales, net total, event type — and if yours still differ, rename the headers to the six above before uploading.",
  },
  {
    q: "Is this Square to QuickBooks converter really free?",
    a: "Yes — completely, on this page. The scan, the per-payout summary, the tie-out check, the clearing-entries CSV, and the .QBO download are all free, and no account is needed for any of them. Your file is processed in memory to build the summary and the downloads, and it is not stored afterwards.",
  },
  {
    q: "Does the converter separate the sales tax I collected through Square?",
    a: "Not as its own line. The payout export this tool reads has no tax column — sale rows arrive at gross, so any sales tax collected at the till stays inside the gross line. Keep that in mind when you categorize: tax collected is a liability owed to the state, not revenue, so the gross line should not sit entirely in a sales account if your totals include tax.",
  },
  {
    q: "Why did my Square payout not tie out?",
    a: "Compare the difference amount with your Square activity for the payout dates — it usually matches one item exactly: a fee row missing from the export, a reserve hold, a chargeback settled after the payout closed, or a deduction Square takes outside the payout rows, such as a loan repayment or an instant-transfer fee, which needs its own line. Fix the cause before importing rather than forcing the payout to fit.",
  },
  {
    q: "Can I convert several months of Square payouts at once?",
    a: "Yes. Export a longer date range and upload the single CSV — rows are grouped by payout ID, so every payout still gets its own summary and tie-out. Review any payout flagged with a difference before importing, and consider importing month by month anyway, so the review inside QuickBooks stays manageable.",
  },
];

const HOWTO = [
  { title: "Export from Square", body: "In Square Dashboard, open your reports or balance/payout views, export the payout detail as a CSV, and check it carries payout-id, date, type, gross, fee, and net columns — rename headers if yours differ." },
  { title: "Upload it here", body: "Drop the CSV in (max 10 MB, no account). The tool groups everything into payouts by payout ID automatically." },
  { title: "Review the tie-out", body: "Check each payout's gross, refunds, and fees, and confirm the payout ties out to the deposit total recorded in the payout rows." },
  { title: "Download and import", body: "Download the CSV or the .QBO — both are free on this tool — and import it into a Square Clearing account in QuickBooks. Match the transfer line to the real deposit in your bank feed." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function SquareToQuickBooksPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="Square Payout to QuickBooks"
      subtitle="Turn a Square payout CSV into QuickBooks-ready books: gross sales, refunds, and fees correctly split through a clearing account — with a payout tie-out check. Both downloads are free, no account needed."
      tool={<PayoutConverterFree provider="square" />}
      currentPath="/tools/square-to-quickbooks"
      faqs={FAQS}
      howToName="How to record Square payouts in QuickBooks"
      howToSteps={HOWTO}
      privacyLine="No account needed · Both downloads free · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>A Square deposit is card sales with the fees already taken out</h2>
          <p className={P}>
            For a shop, café, salon, or market stall running on Square, the rhythm is familiar:
            customers tap and swipe all day, and the bank shows a deposit later that is close to
            the day's takings but never equal to them. That deposit is what remains of a batch of
            card sales after Square has deducted its processing fees and handed refunds back to
            customers — net money, arriving on Square's schedule rather than the till's. Book it as
            sales and revenue is understated by every fee and refund inside it, while the fees —
            a real, deductible cost of taking cards — vanish from the books entirely.
          </p>
          <p className={P}>
            The daily sales report says one number, the bank says another, and neither is wrong — they measure different things. The payout export is the bridge — it
            lists the sales inside each deposit together with the fees and refunds that separate
            the two numbers. This converter rebuilds each payout from that export through a Square
            Clearing account: gross sales in as income, refunds against income, fees out as
            expense, and the payout itself as a transfer to checking that matches the bank feed to
            the penny. This tool is fully free — summary, CSV, and QBO alike.
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
                <tr><td className={TD}><strong>Sale / charge</strong></td><td className={TD}>A card sale rung up at the till, at gross, with its processing fee beside it</td><td className={TD}>Income into Square Clearing; the fee goes to the fees line</td></tr>
                <tr><td className={TD}><strong>Refund</strong></td><td className={TD}>Money returned to a customer</td><td className={TD}>Contra-income, reducing gross sales</td></tr>
                <tr><td className={TD}><strong>Fee</strong></td><td className={TD}>A Square charge that appears as a row of its own</td><td className={TD}>A Square fees expense line</td></tr>
                <tr><td className={TD}><strong>Chargeback / dispute</strong></td><td className={TD}>A disputed payment Square pulled back</td><td className={TD}>Its own contra line, kept out of ordinary refunds</td></tr>
                <tr><td className={TD}><strong>Adjustment</strong></td><td className={TD}>A correction Square posts against the payout</td><td className={TD}>Its own line, flagged for a manual look</td></tr>
                <tr><td className={TD}><strong>Payout</strong></td><td className={TD}>The net Square actually sent to your bank, in the export's net column</td><td className={TD}>Transfer from Square Clearing to checking — the tie-out target</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>How to convert a Square payout export, step by step</h2>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 1 — Export the payout detail from Square.</strong>{" "}
            In Square Dashboard, open your reports, or your balance view and its payout list, and
            export the payout detail as a CSV. Before uploading, check the columns: the tool reads
            payout-id, date, type, gross, fee, and net. It also recognizes Square's alternate
            header names — gross sales, net total, event type — and anything else can be renamed
            in a spreadsheet in a minute. A file with no type or gross column is rejected with an
            explanation rather than guessed at.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 2 — Upload the CSV.</strong>{" "}
            Drop the file into the tool above (CSV, up to 10 MB). No account is needed, and the
            file is processed in memory and never stored. One export can cover many payouts at
            once: the rows are grouped by payout ID, so a month of daily deposits converts in a
            single pass while each payout keeps its own summary.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 3 — Review each payout's tie-out.</strong>{" "}
            For every payout you see gross sales, refunds, disputes, fees, and adjustments totalled
            separately, the computed net, and — where your file's payout rows carry the deposit
            total — a tie-out verdict against the amount Square actually sent. The fee figures are
            read from your export's fee column exactly as given; the tool never estimates what
            Square's fee schedule should have charged. A payout that does not tie out shows its
            difference before you import anything.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 4 — Download and import.</strong>{" "}
            Both downloads on this tool are free: the clearing-entries CSV and the .QBO file.
            Create a bank account in QuickBooks named Square Clearing once. Import the QBO into it
            — in QuickBooks Online, through Bank transactions and Upload from file; in Desktop,
            through File, Utilities, Import, Web Connect Files — then categorize the lines and
            match the transfer against the real deposit in your checking feed. Every entry carries
            a unique transaction ID derived from its payout, so an accidental re-import is
            recognized instead of duplicated.
          </p>

          <figure className="mt-6 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-spreadsheet.webp" alt="A Square payout spreadsheet with gross, fee and net columns ready to split into QuickBooks entries" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">A Square payout export, before it is split into sales, refunds and fees.</figcaption>
          </figure>

          <h2 className={H2M}>Square problems that break reconciliation, and their fixes</h2>
          <h3 className={H3}>The daily report and the bank deposit never agree</h3>
          <p className={P}>
            This is the POS version of the payout problem: the daily summary counts sales when
            they are rung up, while the deposit counts a payout batch, net of fees and refunds,
            settling later. Sellers burn hours trying to force one to equal the other. The fix is
            to stop comparing them directly. Let the daily report run the shop — staffing,
            best-sellers, busy hours — and let payouts run the books, because the payout is what
            the bank actually received.
          </p>
          <h3 className={H3}>Daily sales entries and payout entries running at the same time</h3>
          <p className={P}>
            There are two legitimate ways to keep Square books and they must never overlap. If your
            routine already enters daily sales summaries into QuickBooks, importing payout entries
            as well counts the same sales twice — once at the till's total, once inside the payout.
            Pick one system: daily summaries, using payouts only to reconcile, or payout-based
            entries like this tool builds, which are fewer, self-proving, and far quicker to
            reconcile, at the cost of recognizing the income on the payout rather than the sale
            date. Consistency is what makes either auditable.
          </p>
          <h3 className={H3}>Fees buried, or tax treated as revenue</h3>
          <p className={P}>
            Fees lumped into cost of goods sold, or netted silently against sales, distort your
            margins and make a fee increase invisible — for a card-heavy business, the fees line is
            often the first number worth renegotiating, and it can only be negotiated if it exists.
            The same care applies at the till's tax: this export shape carries no separate tax
            column, so sales tax collected sits inside the gross amounts. Fees get their own
            expense line from this converter; the tax inside gross is yours to route to a
            sales-tax payable account when you categorize, not to leave inflating revenue.
          </p>
          <h3 className={H3}>A clearing balance that will not return to zero</h3>
          <p className={P}>
            A leftover balance in Square Clearing is not rounding — it is an unexplained piece of a
            payout: a missed fee row, a hold, a deduction taken outside the payout rows. Left
            alone, every later reconciliation inherits it. Chase the difference while the payout is
            in front of you, using the per-payout amount the tool reports; it almost always matches
            one Square item exactly. That returning-to-zero is the control that makes the whole
            method trustworthy.
          </p>

          <h2 className={H2M}>Three ways to get Square payouts into QuickBooks, compared</h2>
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
                <tr><td className={TD}><strong>Connector / sync apps</strong></td><td className={TD}>A monthly subscription, plus setup for each location and account mapping</td><td className={TD}>Daily-grain syncs bring every sale into QuickBooks whether you need it there or not, and the deposit still has to be reconciled against the synced detail; a sync overlapping manual entries double-counts the same sales</td></tr>
                <tr><td className={TD}><strong>Spreadsheet hand-entry</strong></td><td className={TD}>Free, and fine for a single quiet location</td><td className={TD}>Daily payouts mean daily typing; fee rows get skipped on busy weeks, and nothing verifies that a hand-built entry sums to the deposit before it posts</td></tr>
                <tr><td className={TD}><strong>This file-based converter</strong></td><td className={TD}>Free in full — scan, summary, CSV, and QBO, with no account. No live connection to QuickBooks is offered or needed</td><td className={TD}>You export and import a file per period instead of syncing, and entries are dated from the payout, so day-level sales reporting stays in Square's own reports where it belongs</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Convert the same range you will reconcile, and never a range that overlaps your last import. Selling online as well as at the till? The{" "}
            <a href="/tools/shopify-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Shopify payout converter</a>{" "}
            and the{" "}
            <a href="/tools/free-paypal-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">PayPal payout converter</a>{" "}
            use the same clearing method, and a marketplace shop can add the{" "}
            <a href="/tools/etsy-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Etsy statement converter</a>{" "}
            — while a plain bank CSV belongs in the{" "}
            <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a>.
          </p>
        </>
      }
    />
  );
}
