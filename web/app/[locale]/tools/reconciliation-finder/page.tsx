import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { ReconciliationFinder } from "@/components/tools/ReconciliationFinder";

const PAGE_URL = "https://www.convertstatement.online/tools/reconciliation-finder";

export const metadata: Metadata = {
  title: "Reconciliation Difference Finder — Why QuickBooks Doesn't Reconcile | Convert Statement",
  description:
    "Free reconciliation difference finder: upload a bank statement and a QuickBooks export, and see exactly which entries are missing, extra, amount-mismatched, or date-drifted. Free CSV difference report with no account; matched-only QBO on Pro.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Reconciliation Difference Finder",
    description:
      "Compare a bank statement against QuickBooks and find the exact entries behind the difference. Free to scan.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "Why doesn't my QuickBooks account reconcile?",
    a: "Almost always one of four things: a transaction recorded in QuickBooks but not on the statement (or the reverse), an amount that differs by a fee or a partial payment, a transaction posted on a different date than it cleared, or a duplicate. This tool separates those cases instead of giving you one lump difference to hunt through.",
  },
  {
    q: "What files should I upload?",
    a: "Two exports for the same period: your bank statement as CSV (or QBO/OFX) and your QuickBooks transactions as CSV (or QBO). In QuickBooks Online, export from the account register or a transaction report. Both files need date, description, and amount columns.",
  },
  {
    q: "How does the matching decide two entries are the same?",
    a: "In passes. First, exact matches: same date, same amount, and a matching payee or description. Then near matches: the same amount and payee a few days apart becomes a date-drift pair, and the same date and payee with a different amount becomes an amount mismatch. Whatever is left over is reported as missing or extra.",
  },
  {
    q: "What is a date-drift entry? Is it a real problem?",
    a: "Usually not. A date-drift entry has the same amount and payee on both sides but posted a few days apart — the difference between when you recorded it and when it cleared the bank. It explains a timing difference at month-end but is not an error to fix.",
  },
  {
    q: "What does the matched-only QBO contain?",
    a: "Only the entries that agreed on both sides, with fresh transaction IDs. It is for importing into a clean account — not for re-importing the whole month, which would duplicate entries that already imported correctly. The matched-only download is on Pro; the full difference report (CSV) is free.",
  },
  {
    q: "My difference is exactly one transaction. What do I do?",
    a: "Look at the missing or extra list for that amount. A missing entry means it was never recorded in QuickBooks — record it. An extra entry means it was recorded twice, voided, or belongs to another period — delete or void it in QuickBooks, after checking the statement.",
  },
  {
    q: "My difference is exactly twice one transaction. What happened?",
    a: "One entry was recorded with its sign reversed — money out entered as money in, or the reverse. The difference is that transaction counted twice: once wrongly added, and once missing where it should have been subtracted. Find the entry with that amount in the mismatch or extra lists and correct its direction in QuickBooks.",
  },
  {
    q: "Can I compare files from QuickBooks Desktop?",
    a: "Yes. Export the account register or a transaction report from Desktop and save it as CSV, then upload it as the QuickBooks side. The statement side can be a CSV, QBO, or OFX file from your bank. Both sides just need date, description, and amount columns.",
  },
  {
    q: "What do I get to download?",
    a: "The full difference report as a CSV — every finding with its kind, and both sides' dates, payees, and amounts — is free. On Pro you can also download a matched-only QBO: just the entries that agreed, with fresh transaction IDs, for importing into a clean account.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "No. Both files are processed in memory to build the comparison and are not stored afterwards. We never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Export both sides", body: "Download the bank statement and the QuickBooks transactions for the same period, as CSV or QBO." },
  { title: "Upload both files", body: "Drop the statement on the left and the QuickBooks export on the right, then run the comparison." },
  { title: "Read the findings", body: "Missing, extra, amount-mismatch, and date-drift entries are listed separately, with totals for each side." },
  { title: "Fix and re-check", body: "Fix the entries in QuickBooks, then re-run the comparison until the difference is zero." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function ReconciliationFinderPage() {
  return (
    <ToolPageLayout
      eyebrow="Free Tool"
      title="Reconciliation Difference Finder"
      subtitle="Your QuickBooks balance is off — but by which entries? Compare the statement against QuickBooks and see every missing, extra, and mismatched entry."
      tool={<ReconciliationFinder />}
      currentPath="/tools/reconciliation-finder"
      faqs={FAQS}
      howToName="How to find a reconciliation difference"
      howToSteps={HOWTO}
      privacyLine="No account needed to scan · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>A difference is a list, not a number</h2>
          <p className={P}>
            A reconciliation difference of, say, $142.50 tells you nothing by itself — it
            could be one missing deposit, three small fees, or a duplicate that happens to
            net out. This tool turns the difference into a list: entries on the statement
            but not in QuickBooks, entries in QuickBooks but not on the statement, entries
            whose amounts disagree, and entries whose dates drifted by a few days. Fix the
            list and the difference goes to zero; there is no step where you adjust the
            books to force it.
          </p>
          <p className={P}>
            That distinction matters because QuickBooks only shows you the total. Hunting a
            total means re-reading every line of two documents and hoping the culprit looks
            familiar. Working from a list means each finding names its entry, its amount, and
            what to do about it — most differences turn out to be two or three entries, not
            the whole month.
          </p>

          <h2 className={H2M}>How matching works</h2>
          <p className={P}>
            The comparison runs in passes, strictest first. The first pass pairs exact
            matches: the same date, the same amount, and a matching payee or description on
            both sides. Only when every exact pair is taken does the second pass look for
            near matches — the same amount and payee a few days apart, or the same date and
            payee with a different amount. The order is deliberate: if near matches went
            first, a drifted entry could steal the partner of an exact one and leave two
            false findings behind.
          </p>
          <p className={P}>
            Whatever remains unpaired after both passes is reported as missing (on the
            statement, not in QuickBooks) or extra (in QuickBooks, not on the statement).
            Amounts are compared to the cent, and money out must be negative on both sides —
            if one export shows withdrawals as positive numbers, fix that first, or every
            row will mismatch.
          </p>
          <p className={P}>
            Payee names rarely match word for word — banks truncate them ("AMZN MKTP" for a
            purchase you recorded as "Amazon"), and QuickBooks may hold a renamed version
            from a bank rule. The matcher therefore weighs date and amount first and treats
            the payee as supporting evidence, so a shortened bank description does not
            orphan an otherwise exact entry. When two entries share a date and amount but
            name genuinely different payees, they are left unpaired for you to judge —
            a deliberate false alarm is cheaper than a silent wrong match.
          </p>
          <figure className="mt-6 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-review.webp" alt="A bookkeeper comparing a bank statement line by line against accounting records to find why the balances disagree" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">Reconciliation is a line-by-line comparison — this tool simply does the comparing for you.</figcaption>
          </figure>

          <h2 className={H2M}>The five kinds of findings</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Finding</th>
                  <th className={TH}>What it means</th>
                  <th className={TH}>What to do</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Matched</strong></td><td className={TD}>Same date, amount, and payee on both sides.</td><td className={TD}>Nothing — these entries agree and reconcile cleanly.</td></tr>
                <tr><td className={TD}><strong>Missing from QuickBooks</strong></td><td className={TD}>On the statement, but never recorded in QuickBooks.</td><td className={TD}>Record it in QuickBooks from the statement line.</td></tr>
                <tr><td className={TD}><strong>Extra in QuickBooks</strong></td><td className={TD}>In QuickBooks, but not on the statement: a duplicate, a voided item, or another period's entry.</td><td className={TD}>Check the statement, then delete or void it in QuickBooks.</td></tr>
                <tr><td className={TD}><strong>Amount mismatch</strong></td><td className={TD}>Same date and payee, different amount — a fee taken, a partial payment, or a typo.</td><td className={TD}>Correct the QuickBooks amount to the statement; record fees separately.</td></tr>
                <tr><td className={TD}><strong>Date drift</strong></td><td className={TD}>Same amount and payee within 7 days, posted on different dates.</td><td className={TD}>Usually nothing — it is the gap between recording and clearing, and reconciles next period.</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>Read the difference by its shape</h2>
          <p className={P}>
            Before you open the findings, the size of the total difference already narrows
            the search:
          </p>
          <h3 className={H3}>Off by exactly one transaction</h3>
          <p className={P}>
            A single entry is missing or doubled. Search the missing and extra lists for
            that exact amount first — it is almost always sitting there.
          </p>
          <h3 className={H3}>Off by exactly twice one transaction</h3>
          <p className={P}>
            That entry's sign is flipped: money out recorded as money in counts once as a
            wrong addition and once as a missing subtraction. Find the amount in the
            mismatch list and correct its direction.
          </p>
          <h3 className={H3}>Off by a round number</h3>
          <p className={P}>
            Round differences ($50, $200, $1,000) rarely come from bank activity. Look for a
            manual journal entry, an edited opening balance, or a transaction typed from
            memory rather than imported.
          </p>
          <h3 className={H3}>Off by a few cents</h3>
          <p className={P}>
            Rounding, a small bank fee recorded net instead of gross, or a partial payment.
            The amount-mismatch list, sorted by size, usually surfaces it in seconds.
          </p>

          <h2 className={H2M}>A worked example: the $142.50 difference</h2>
          <p className={P}>
            A bookkeeper reconciling a March checking account is off by $142.50. The
            statement lists 214 entries; QuickBooks has 211 for the same period. Running the
            comparison produces three findings that matter and one that does not. A bank
            fee of $12.50 is on the statement but was never recorded — missing. A customer
            payment was recorded in QuickBooks as $1,240.00, but the statement shows
            $1,370.00 — an amount mismatch worth $130.00, a transposed figure from manual
            entry. Together: $12.50 + $130.00 = $142.50, the whole difference. The fourth
            finding is a check recorded on March 29 that cleared on April 2 — date drift,
            worth zero, left alone.
          </p>
          <p className={P}>
            The fixes take minutes: record the fee, correct the payment to $1,370.00, and
            re-run the comparison. The findings list comes back empty, both totals agree,
            and the reconciliation closes without a single adjusting entry. Note what did
            not happen: nobody scrolled through 214 statement lines by eye, and nobody
            plugged the difference with a journal entry "to be investigated later" — the
            two real errors are fixed, and the timing difference explains itself next month.
          </p>

          <h2 className={H2M}>Getting the two files</h2>
          <p className={P}>
            Both sides cover the same period — that one detail prevents most false findings.
            For the statement side, export from your bank as CSV, QBO, or OFX for the month
            you are reconciling. For the QuickBooks side, in QuickBooks Online open the
            account register (or run a transaction report for the account), set the same
            date range, and export to CSV; in QuickBooks Desktop, export the register or a
            transaction report and save it as CSV. Each file needs just three things per
            row: a date, a description, and an amount.
          </p>
          <h3 className={H3}>Two export traps that create false findings</h3>
          <p className={P}>
            If every row comes back as a mismatch, suspect the exports before the entries.
            Some banks export withdrawals as positive numbers while QuickBooks exports them
            negative — flip one side's signs (or re-export with the signed option) and run
            it again. And if the statement period is a bank month (say, March 3 to April 2)
            while the QuickBooks export is a calendar month, the edge entries will report
            as missing and extra even though nothing is wrong; align the date ranges and
            the phantom findings disappear.
          </p>

          <h2 className={H2M}>Fixing each kind of finding</h2>
          <p className={P}>
            Work the list in this order. Record the missing entries from the statement —
            they are real bank activity your books never saw. Then deal with the extras:
            verify each against the statement before deleting, because an "extra" is
            occasionally a legitimate entry dated in the wrong period; move those instead
            of deleting them. Correct amount mismatches to the statement figure, and if a
            fee explains the gap, record the fee as its own entry so next month matches
            cleanly. Leave date-drift pairs alone unless the drift crosses a period
            boundary that matters for reporting. Then re-run the comparison: the findings
            list should shrink to zero, and the totals for both sides should agree to the
            cent.
          </p>
          <p className={P}>
            Save the final, empty-findings report with the month's statement. It is a
            one-page audit trail showing the two records were compared line by line and
            agreed — far stronger evidence than a reconciliation that was forced to zero
            with an adjustment nobody can explain later.
          </p>

          <h2 className={H2M}>Keeping next month clean</h2>
          <p className={P}>
            Differences are cheapest in the month they happen. Reconcile monthly at worst —
            weekly if the account is busy — while the entries are still recognizable.
            Import transactions instead of typing them: manual entry is where transposed
            amounts and flipped signs come from, and the amount-mismatch list above is
            mostly a catalogue of typing. Check files before they are imported (the{" "}
            <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a>{" "}
            catches broken files at the door), record bank fees as their own entries instead
            of netting them against deposits, and never let a difference be "plugged" with
            an unexplained adjustment — a plugged difference does not disappear, it moves
            to next month and brings friends. Do those four things and most months, the
            comparison on this page comes back empty on the first run.
          </p>

          <h2 className={H2M}>Downloads: the free report and the matched-only QBO</h2>
          <p className={P}>
            The findings download as a CSV report — every entry with its kind, both sides'
            dates, payees, and amounts — free, with no account. On Pro, you can also
            download a matched-only QBO: just the entries that agreed on both sides, with
            fresh transaction IDs, built for importing into a clean account. It is
            deliberately not a whole-month replacement file — re-importing everything would
            duplicate the entries that already imported correctly.
          </p>

          <h2 className={H2M}>When the difference will not go to zero</h2>
          <p className={P}>
            If the list is empty but QuickBooks still shows a difference, the problem is
            outside the two files: an opening balance that was edited after a previous
            reconciliation, an uncleared transaction from an earlier period, or a
            reconciliation report discrepancy carried forward. Undo the last reconciliation
            in QuickBooks and redo it with the clean list in hand. And if the gap spans
            several months of accumulated entries, our{" "}
            <a href="/services/quickbooks-cleanup" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QuickBooks cleanup service</a>{" "}
            handles it with a free assessment first. Checking a single file before import
            instead? Use the{" "}
            <a href="/tools/free-qbo-cleanup-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO Duplicate Finder</a>{" "}
            or the{" "}
            <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a>.
          </p>
        </>
      }
    />
  );
}
