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
    a: "Record by payout, not by day. Each Square payout bundles many sales with processing fees and refunds already deducted, and the deposit date rarely matches the sale dates. This tool unpacks each payout into gross sales, refunds, and fees through a Square clearing account, then transfers the net to checking — when the clearing account nets to zero, the payout is reconciled.",
  },
  {
    q: "Which Square export should I upload?",
    a: "A Square payout CSV with columns: payout-id, date, type, gross, fee, and net. In Square Dashboard, open your reports and export the payout detail as a CSV. If your export uses different headers, rename them to match — the tool reads exactly these six columns.",
  },
  {
    q: "What is the payout tie-out check?",
    a: "The tool verifies Gross − Fees − Refunds = Payout for every payout, against the deposit total in your payout rows. A green 'Ties out' badge means the payout reconciles to the penny. If it shows a difference, check Square for reserve holds, chargebacks, or sales from other periods swept into the payout before importing.",
  },
  {
    q: "How are Square fees handled?",
    a: "Processing fees are expense lines through the clearing account, refunds are contra-income lines reducing gross sales, and chargebacks appear as their own lines. The fee column in your export is taken as given — the tool does not estimate Square's fee schedule.",
  },
  {
    q: "How do I import the QBO into QuickBooks?",
    a: "First create a bank account in QuickBooks named 'Square Clearing'. Import the QBO there, then match the transfer line against the real payout deposit in your bank feed. When the clearing account nets to zero, the payout is fully reconciled. The CSV works the same way through QuickBooks Online's manual upload.",
  },
  {
    q: "Why did my payout not tie out?",
    a: "A difference usually has a name: a Square reserve hold, a chargeback settled after the payout closed, a Square Loans payment, or an instant-transfer fee taken outside the payout rows. Compare the difference amount with your Square activity for those dates — it almost always matches one of those items exactly.",
  },
  {
    q: "Can I convert several months of Square payouts at once?",
    a: "Yes. Export a longer date range from Square and upload the single CSV — the tool groups rows by payout ID, so every payout still ties out separately. Review any payout flagged with a difference before importing, and consider importing month by month so your QuickBooks review stays manageable.",
  },
  {
    q: "Do I need a separate clearing account for each Square location?",
    a: "One clearing account per payout stream is the clean rule. If two locations settle into the same bank account under different payout IDs, separate clearing accounts keep each location's tie-out provable. If they share one payout, one clearing account is enough — the payout, not the location, is the unit.",
  },
  {
    q: "What about the sales tax I collected through Square?",
    a: "Tax collected is part of gross sales in your export, not income. The converter keeps tax visible as its own line when your export breaks it out, so it can sit in a sales-tax payable account instead of inflating revenue. Check the line before importing and map it to your tax account.",
  },
  {
    q: "Is this tool really free?",
    a: "Yes. The payout summary, the CSV download, and the QBO download are all free on this tool, and no account is needed. Your CSV is processed in memory to build the summary and is not stored afterwards — we never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Export from Square", body: "In Square Dashboard, open your reports, export the payout detail as a CSV, with payout-id, date, type, gross, fee, and net columns." },
  { title: "Upload it here", body: "Drop the CSV in — the tool groups everything into payouts automatically." },
  { title: "Review the tie-out", body: "Check each payout's gross, fees, and refunds, and confirm the payout ties out to the bank deposit." },
  { title: "Import into QuickBooks", body: "Download the CSV or the QBO — both are free — and import it into a Square Clearing account in QuickBooks." },
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
          <h2 className={H2}>Why a Square payout is not a sales figure</h2>
          <p className={P}>
            The amount Square sends to your bank looks like income, but it is not your sales. It is
            what remains of several days of selling after Square has already taken its processing
            fees and handed refunds back to customers — and it lands a day or more after the sales
            themselves, so the dates never line up with your daily reports. Book the deposit as
            sales and two things go quietly wrong: your revenue is understated by every fee and
            refund, and the fees themselves disappear from your books, taking an expense record —
            and a tax deduction — with them.
          </p>
          <p className={P}>
            The fix is to unpack each payout before it touches your books. This converter reads your
            Square payout CSV, groups the rows by payout, and rebuilds what actually happened:
            gross sales as income, refunds against income, fees as an expense, taxes kept visible,
            and the payout itself as a plain transfer of the net. Nothing is estimated — every line
            comes straight from your export.
          </p>

          <h2 className={H2M}>What the converter builds for each payout</h2>
          <p className={P}>
            Every payout becomes a small set of entries routed through a Square clearing account —
            a holding account whose only job is to prove the payout adds up before the money is
            treated as deposited:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Entry</th>
                  <th className={TH}>What it is</th>
                  <th className={TH}>Where it lands</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Gross sales</strong></td><td className={TD}>Every sale row in the payout, before deductions</td><td className={TD}>Income, into Square Clearing</td></tr>
                <tr><td className={TD}><strong>Refunds</strong></td><td className={TD}>Money returned to customers</td><td className={TD}>Contra-income — reduces gross sales</td></tr>
                <tr><td className={TD}><strong>Processing fees</strong></td><td className={TD}>The fee column from your export, taken as given</td><td className={TD}>A Square fees expense line</td></tr>
                <tr><td className={TD}><strong>Sales tax</strong></td><td className={TD}>The tax portion, when your export breaks it out</td><td className={TD}>Sales tax payable — it is never income</td></tr>
                <tr><td className={TD}><strong>Chargebacks</strong></td><td className={TD}>Disputed payments Square pulled back</td><td className={TD}>Their own line, so they never hide inside refunds</td></tr>
                <tr><td className={TD}><strong>Net transfer</strong></td><td className={TD}>The amount Square actually sent to your bank</td><td className={TD}>Transfer from Square Clearing to checking</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Two properties of the output matter as much as the lines themselves. Every entry
            carries a unique transaction ID derived from the payout it belongs to, so importing the
            same payout twice — the classic month-end accident — is recognized by QuickBooks
            instead of duplicated. And because the entries are dated from the payout, your income,
            refunds and fees all land in the period the money actually moved, which keeps monthly
            reports honest even when a payout straddles two months of selling.
          </p>
          <figure className="mt-6">
            <img src="/tools/csv-to-qbo-spreadsheet.webp" alt="A Square payout spreadsheet with gross, fee and net columns ready to split into QuickBooks entries" className="w-full rounded-[20px] border border-[#E3EDE0]" loading="lazy" />
            <figcaption className="mt-2 text-center text-xs text-zinc-400">Illustration: a Square payout export, before it is split into sales, refunds and fees.</figcaption>
          </figure>

          <h2 className={H2M}>Exporting the payout report from Square</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li>In Square Dashboard, open <strong className="text-zinc-900 dark:text-white">Reports</strong> — or <strong className="text-zinc-900 dark:text-white">Balance → View all payouts</strong> — and pick the date range you want to convert.</li>
            <li>Export the payout detail as a CSV.</li>
            <li>Check the columns before you upload: the tool reads <strong className="text-zinc-900 dark:text-white">payout-id, date, type, gross, fee, net</strong>. Rename headers in a spreadsheet if yours differ.</li>
            <li>Drop the file into the converter above and review the payout summary.</li>
          </ol>
          <p className={P}>
            One export can cover many payouts at once. The tool groups rows by payout ID, so a month
            of daily payouts converts in a single pass — and each payout still ties out on its own,
            which is what makes the result safe to import.
          </p>
          <p className={P}>
            A practical rhythm: convert weekly if your volume is high, monthly if it is not, but
            always convert the same range you will reconcile. Converting a range that overlaps your
            last import is how duplicate entries are born — and while the transaction IDs on these
            files protect you, a clean range is still the cheapest protection of all.
          </p>

          <h2 className={H2M}>A worked example: the sample file on this page</h2>
          <p className={P}>
            The sample payout file you can download above contains a single payout. Here is exactly
            what the converter makes of it:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Line</th><th className={TH}>Amount</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}>Gross sales</td><td className={TD}>$350.00</td></tr>
                <tr><td className={TD}>Refunds</td><td className={TD}>−$40.00</td></tr>
                <tr><td className={TD}>Processing fees</td><td className={TD}>−$10.75</td></tr>
                <tr><td className={TD}><strong>Net payout</strong></td><td className={TD}><strong>$299.25</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Follow it through the clearing account: it starts at zero, takes in $350.00 of sales,
            pays out $40.00 of refunds and $10.75 of fees, and is left holding exactly $299.25 — the
            amount Square deposited. The transfer moves that $299.25 to checking and the clearing
            account returns to zero. That zero is the whole point: it proves every cent of the payout
            is explained, which is what the "Ties out" badge on this page certifies.
          </p>

          <h2 className={H2M}>Importing the result into QuickBooks</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li>Create a bank account in QuickBooks named <strong className="text-zinc-900 dark:text-white">Square Clearing</strong> — once only; you will reuse it for every payout.</li>
            <li>Import the QBO into that account: in Online, <strong className="text-zinc-900 dark:text-white">Bank transactions → Upload from file</strong>; in Desktop, <strong className="text-zinc-900 dark:text-white">File → Utilities → Import → Web Connect Files</strong>.</li>
            <li>Categorize the lines: sales to your income account, fees to a Square fees expense, refunds against income.</li>
            <li>Match the transfer line against the real deposit in your checking feed. When the clearing balance reads zero, the payout is reconciled.</li>
          </ol>
          <p className={P}>
            Prefer CSV? The download works through QuickBooks Online's manual upload the same way —
            both files are free on this tool.
          </p>

          <h2 className={H2M}>Daily summaries or payout entries? Pick one system</h2>
          <p className={P}>
            There are two legitimate ways to keep Square books, and they must never overlap. The
            daily-summary method enters each day's sales from your Square reports and lets the bank
            feed handle the deposits; it suits businesses that need day-level reporting. The
            payout method — what this converter builds — enters nothing until money moves, then
            records each payout's full anatomy through the clearing account; it suits anyone whose
            real question is "did I get paid correctly, and what did it cost?" Payout entries are
            fewer, self-proving, and far quicker to reconcile, but they report income on the payout
            date rather than the sale date. Choose based on how you actually review your numbers —
            then convert every payout the same way, because consistency is what makes either system
            auditable.
          </p>

          <h2 className={H2M}>Mistakes that quietly wreck Square bookkeeping</h2>
          <h3 className={H3}>Recording the bank deposit as sales</h3>
          <p className={P}>
            The deposit is net, so income is understated and fees vanish entirely. Month after month
            this understates revenue on your reports and overstates nothing — the worst kind of
            error, because nothing ever looks broken. Always record the payout's components, never
            the deposit alone.
          </p>
          <h3 className={H3}>Recording daily sales and the payout too</h3>
          <p className={P}>
            If your point-of-sale routine already enters daily sales summaries, importing payout
            entries as well counts the same sales twice. Pick one system: either daily summaries
            (and use the payout only to reconcile fees) or payout-based entries like this tool
            builds. Never both for the same period.
          </p>
          <h3 className={H3}>Burying the fees</h3>
          <p className={P}>
            Fees lumped into cost of goods sold, or netted against sales with no line of their own,
            distort your margins and make fee increases invisible. A dedicated Square fees expense
            line shows exactly what card acceptance costs you each month — often the first number a
            growing business renegotiates.
          </p>
          <h3 className={H3}>Ignoring a clearing balance that will not zero</h3>
          <p className={P}>
            A leftover balance in the clearing account is not a rounding error; it is an unexplained
            piece of a payout — a missed fee, a hold, or a refund that settled late. Leave it and
            every later reconciliation inherits the confusion. The balance returning to zero is the
            control that makes the whole method trustworthy.
          </p>

          <h2 className={H2M}>When a payout does not tie out</h2>
          <p className={P}>
            A tie-out difference almost always has a shape, and the shape names the cause. A
            difference equal to a fee means a fee row never made it into the export. A round amount
            usually means a reserve hold. A difference that exactly matches a sale from the payout's
            first day suggests the sale settled into the next payout instead. And deductions that
            appear in Square but not in your payout rows — Square Loans repayments, instant-transfer
            fees — are taken outside the payout and need their own line. Compare the difference
            against your Square activity for the payout dates before importing. It is worth fixing
            the cause rather than forcing the import: an unexplained difference carried into
            QuickBooks becomes a clearing balance that never zeroes, and it will sit in every
            reconciliation from then on, disguised as your mistake instead of Square's timing. If a
            converted file itself is refused by QuickBooks, the{" "}
            <a href="/tools/qbo-import-errors" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO import-error decoder</a>{" "}
            explains the message and its fix.
          </p>

          <h2 className={H2M}>Every payout, every week? Make it a system</h2>
          <p className={P}>
            This converter stays free — the summary, the CSV and the QBO are all free, with no
            account needed. What an account adds is the system around it: a free account keeps every
            conversion in one searchable history, so last quarter's payout files are never lost in a
            downloads folder. The dashboard adds bulk conversion when a whole month of statements
            lands at once, and client portals if you keep books for other people — each client
            uploads through their own link and the conversion bills to you.
          </p>
          <p className={P}>
            Selling through other channels too? The same clearing-account model powers our{" "}
            <a href="/tools/free-stripe-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Stripe QBO Converter</a>,{" "}
            <a href="/tools/shopify-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Shopify Payout Converter</a>,{" "}
            <a href="/tools/etsy-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Etsy Payout Converter</a>, and{" "}
            <a href="/tools/free-paypal-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">PayPal Payout Converter</a>{" "}
            — one method, learned once, applied everywhere you sell.
          </p>
        </>
      }
    />
  );
}
