import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { QboCleanupChecker } from "@/components/tools/QboCleanupChecker";

const PAGE_URL = "https://www.convertstatement.online/tools/free-qbo-cleanup-checker";

export const metadata: Metadata = {
  title: "Free QBO Duplicate Finder & Cleanup Checker | Convert Statement",
  description:
    "QBO Duplicate Finder: find duplicate transactions in your QuickBooks books before they break reconciliation — upload a .qbo, .ofx or .csv, get a health score, exact and near-duplicate report, and a cleaned QBO. No account needed to scan, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Free QBO Duplicate Finder & Cleanup Checker",
    description:
      "Upload a QBO or CSV, get a 0–100 health score and a duplicate report in seconds. Free and private.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I find duplicates inside a QBO file before I import it?",
    a: "Upload the .qbo, .ofx, .qfx or .csv file here — the scan is free and needs no account. The report groups repeated transaction IDs (FITIDs), identical date/amount/payee rows, and near-duplicates (same amount within 3 days under a similar payee name), with a 0–100 health score. Everything is found inside the file, before QuickBooks ever sees it.",
  },
  {
    q: "What counts as a duplicate — and what does not?",
    a: "Two rows sharing one FITID are the same transaction seen twice: a true duplicate. Rows with the same date, amount and payee but different IDs are probable duplicates to review. The same amount on different days is usually genuine — subscriptions and habits repeat. Only repeated IDs are treated as certain.",
  },
  {
    q: "Can this tool delete the duplicates for me?",
    a: "The scan itself only reports. On Pro, the cleaned QBO download drops the exact duplicates and regenerates missing or repeated transaction IDs, ready to import instead of the original. Near-duplicates are never removed automatically — they can be genuine repeat purchases, so they stay flagged for your judgment.",
  },
  {
    q: "What does the health score mean?",
    a: "It starts at 100 and subtracts 10 per error (structural problems, balance breaks), 5 per duplicate instance, and 2 per warning. A score of 90 or above is a clean file; anything under 70 deserves a cleanup pass before you import it.",
  },
  {
    q: "Is this the same as deleting duplicates inside QuickBooks?",
    a: "No. This checker works on the file before import — it never connects to your QuickBooks company and cannot remove anything already in your books. If the messy file was already imported, the duplicates have to be excluded or deleted inside QuickBooks itself; if it has not been imported yet, clean the file and import the cleaned version once.",
  },
  {
    q: "Is my file uploaded or stored, and what is free?",
    a: "Your file is processed in memory to build the report and is not stored afterwards. The scan, the report and the CSV report download are free with no account; only the cleaned QBO download is on Pro. We never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Upload your file", body: "Drop in a .qbo, .ofx, .qfx, or .csv export from QuickBooks or your bank." },
  { title: "Read the report", body: "Get a 0–100 health score, every duplicate group with its rows, and all structural findings." },
  { title: "Clean the file", body: "Download the cleaned QBO on Pro — exact duplicates removed, missing or repeated IDs regenerated — and import it instead of the original. If the original was already imported, the copies inside QuickBooks have to be removed there." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QboCleanupCheckerPage() {
  return (
    <ToolPageLayout
      eyebrow="Free Tool"
      title="QBO Duplicate Finder & Cleanup Checker"
      subtitle="Upload a QBO, OFX, or CSV export and find the duplicates, broken balance chains, and stale uncleared items that keep your QuickBooks reconciliation from tying out."
      tool={<QboCleanupChecker />}
      currentPath="/tools/free-qbo-cleanup-checker"
      faqs={FAQS}
      howToName="How to find duplicate transactions in QuickBooks"
      howToSteps={HOWTO}
      privacyLine="No account needed · Checked in memory, never stored"
      content={
        <>
          <h2 className={H2}>How duplicates get into QuickBooks</h2>
          <p className={P}>
            Almost nobody types a transaction twice. Duplicates arrive through process, not
            carelessness: a statement imported for a date range the live bank feed had already
            covered, so every row lands a second time. A QBO file re-imported after an edit, with
            its transaction IDs regenerated, so QuickBooks cannot recognize its own transactions.
            A manual entry made to "fix" a missing charge that the feed delivered a day later.
            Each cause leaves the same evidence — transactions that exist twice — and the same
            symptom: totals that are too high and a reconciliation difference that will not die.
          </p>
          <p className={P}>
            This checker reads the file the way QuickBooks does and groups the evidence for you: a
            0–100 health score, every repeated transaction ID, every identical row, and the
            near-duplicates that deserve a human look. The scan is free and needs no account; your
            file is checked in memory and never stored.
          </p>

          <h2 className={H2M}>What counts as a duplicate — and what does not</h2>
          <p className={P}>
            The whole game is telling a true duplicate from a coincidence. QuickBooks itself makes
            that call on one thing: the transaction ID (FITID) inside each QBO row. This checker
            applies the same standard, in four grades:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Finding</th>
                  <th className={TH}>Example</th>
                  <th className={TH}>Verdict</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Same transaction ID twice</strong></td><td className={TD}>FITID 88412047 on two identical rows</td><td className={TD}>True duplicate — the same transaction seen twice; one copy must go</td></tr>
                <tr><td className={TD}><strong>Same date, amount and payee — different IDs</strong></td><td className={TD}>Two −$84.20 office-supply rows on one day, different FITIDs</td><td className={TD}>Probable duplicate — review it; two separate purchases are possible</td></tr>
                <tr><td className={TD}><strong>Same amount within 3 days, similar payee</strong></td><td className={TD}>"AMZN" and "Amazon" at −$29.99, two days apart</td><td className={TD}>Near-duplicate — flagged for your judgment, never auto-removed</td></tr>
                <tr><td className={TD}><strong>Same amount on different days</strong></td><td className={TD}>−$4.50 coffee on Monday and again on Thursday</td><td className={TD}>Usually genuine — habits and subscriptions repeat; different IDs confirm it</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            The distinction is not pedantry. Deleting a genuine repeat removes a real transaction
            and breaks your balance by exactly its amount; keeping a true duplicate inflates your
            totals by the same. The ID is the only witness that never lies, which is why the report
            leads with it.
          </p>

          <h2 className={H2M}>The cleanup workflow</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li><strong className="text-zinc-900 dark:text-white">Scan the file.</strong> Drop in a .qbo, .ofx, .qfx or .csv export — from QuickBooks or your bank — and read the health score.</li>
            <li><strong className="text-zinc-900 dark:text-white">Review each group.</strong> Repeated IDs are listed with their rows side by side; near-duplicates wait for your call.</li>
            <li><strong className="text-zinc-900 dark:text-white">Remove one copy — never both.</strong> Delete confirmed duplicates inside QuickBooks, or download the cleaned QBO on Pro with exact duplicates already removed and IDs regenerated.</li>
            <li><strong className="text-zinc-900 dark:text-white">Import once.</strong> The cleaned file replaces the messy original; importing both would recreate the problem you just fixed.</li>
          </ol>
          <p className={P}>
            The score keeps you honest about scope: 100 minus 10 per structural error, 5 per
            duplicate instance, 2 per warning. Ninety or above is a file you can import with
            confidence; under 70, clean first and reconcile after.
          </p>

          <h2 className={H2M}>Also in the report: broken chains and stale uncleared items</h2>
          <p className={P}>
            Duplicates are the headline act, but the scan reads the whole file. When the export
            carries running balances, every link of the balance chain is verified — previous balance
            plus the transaction must equal the next — and the exact row where the chain breaks is
            reported, because a break with no duplicate nearby means a missing row instead. From CSV
            exports with a cleared/status column, uncleared entries older than 90 days are flagged:
            they are the other classic reason a reconciliation difference never reaches zero, old
            checks and deposits that were entered, never matched, and quietly forgotten. Structural
            problems are reported too — transactions dated outside the statement period the file
            declares, or a missing ledger balance — the defects that make QuickBooks reject or
            mis-post a file before duplicates even get the chance. One scan, the file's whole bill
            of health.
          </p>

          <h2 className={H2M}>A worked example: one messy file</h2>
          <p className={P}>
            Take a small business checking export (sample file, shown for illustration): 214
            transactions scanned, and the report finds three repeated transaction IDs:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Transaction ID</th><th className={TH}>Transaction</th><th className={TH}>Copies in file</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}>88412047</td><td className={TD}>Office supplies, −$84.20</td><td className={TD}>2</td></tr>
                <tr><td className={TD}>88412063</td><td className={TD}>Fuel, −$52.10</td><td className={TD}>2</td></tr>
                <tr><td className={TD}>88412102</td><td className={TD}>Software subscription, −$29.99</td><td className={TD}>3</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            That is four extra rows inflating expenses by $196.28 — and four duplicate instances
            cost the file 20 health points, taking it to 80 before any other warning. Remove one
            copy of the first two and two copies of the third, and every total in the file drops
            back to the truth. If this file had been imported as-is, the bank reconciliation would
            have carried a $196.28 difference with no visible cause.
          </p>
          <p className={P}>
            The same report also flagged two near-duplicates in this file — a −$29.99 software
            charge under a slightly different payee name, three days after the subscription above.
            Those stayed in: different transaction IDs, and the second charge turned out to be a
            genuine add-on seat billed separately. That restraint is deliberate. A checker that
            cries duplicate at every repeated amount trains you to ignore it; one that reserves
            certainty for repeated IDs earns the right to be believed.
          </p>
          <figure className="mt-6 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-review.webp" alt="A bookkeeper reviewing a duplicate report and comparing repeated transactions before cleaning a QBO file" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">Reviewing flagged duplicate groups before anything is removed.</figcaption>
          </figure>

          <h2 className={H2M}>What removing duplicates does to the balance chain</h2>
          <p className={P}>
            A statement file with running balances is a chain: previous balance plus the transaction
            must equal the next balance, link after link. A duplicated row forges an extra link —
            the amount is counted twice, and every balance after it sits off by that amount, which
            is why this checker verifies the chain and reports exactly where it breaks. Remove the
            extra copy and the chain closes again: each step adds up, and the final balance lands
            on the closing balance the bank declared.
          </p>
          <p className={P}>
            The cleaned QBO protects that arithmetic. It preserves the original closing balance as
            the ledger target inside the file, so if a removal ever overshoots — a genuine row
            deleted by mistake — the ledger comparison in QuickBooks exposes the gap instead of
            silently absorbing it. And if you clean inside QuickBooks after reconciling, re-check
            the reconciliation: deleting a reconciled duplicate moves the difference until the
            remaining copy is the one marked reconciled.
          </p>

          <h2 className={H2M}>Mistakes people make while cleaning up</h2>
          <h3 className={H3}>Deleting both copies</h3>
          <p className={P}>
            The duplicate is one extra copy, not two bad rows. Delete both and a real transaction
            vanishes — your balance is now off by exactly that amount, in the opposite direction.
            Every group in the report keeps one survivor; mirror that in QuickBooks.
          </p>
          <h3 className={H3}>Importing the cleaned file on top of the original</h3>
          <p className={P}>
            The cleaned QBO is a replacement, not a patch. If the original file already went into
            QuickBooks, importing the cleaned version adds a second, tidier copy of everything.
            Clean first, import once — or clean inside QuickBooks when the rows are already there.
          </p>
          <h3 className={H3}>"Fixing" near-duplicates that are real</h3>
          <p className={P}>
            Two identical coffees, a subscription billed twice in a catch-up month, fuel at the
            same pump at the same price — life repeats itself. Near-duplicates are flagged for
            judgment precisely because only you know whether both happened. When in doubt, check
            the receipt, not the amount.
          </p>
          <h3 className={H3}>Cleaning the file but not the habit</h3>
          <p className={P}>
            A cleanup that leaves the import routine untouched buys you one clean month. The
            overlap that created the duplicates — feed and file covering the same dates — will
            recreate them with the next statement, and you will be back here reading the same
            report.
          </p>

          <h2 className={H2M}>Stop duplicates at the source</h2>
          <p className={P}>
            Three habits prevent nearly all of it. Give each period one route in: the live bank
            feed or file imports, never both over the same dates. Start every export the day after
            the last import ended, so ranges touch but never overlap. Write the last imported date
            somewhere you will see it — a note in the chart of accounts beats a good memory. And
            prefer files whose
            transaction IDs are derived from the transaction itself — like the ones our{" "}
            <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO Converter</a>{" "}
            builds — because QuickBooks then recognizes a re-import instead of duplicating it. When
            a difference survives anyway, the{" "}
            <a href="/tools/reconciliation-finder" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Reconciliation Difference Finder</a>{" "}
            compares your statement against QuickBooks and names the entries responsible, and the{" "}
            <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a>{" "}
            verifies a file's structure and balance chain before it is imported.
          </p>

          <h2 className={H2M}>Scanning every month? Make it a system</h2>
          <p className={P}>
            The scan on this page stays free, with no account needed — run it before every import
            and duplicates stop being a month-end surprise. What an account adds is the system
            around it: a free account keeps every scan and conversion in one searchable history,
            so last quarter's report is still there when a client asks. The dashboard adds bulk
            conversion when a whole month of statements lands at once, and client portals if you
            collect files from other people. On Pro, the cleaned QBO download is included — exact
            duplicates removed, IDs regenerated, closing balance preserved. And if a scan shows
            books that are months behind rather than one messy file, ask about a full{" "}
            <a href="/contact" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">cleanup</a>{" "}
            instead of fighting it one duplicate at a time.
          </p>
        </>
      }
    />
  );
}
