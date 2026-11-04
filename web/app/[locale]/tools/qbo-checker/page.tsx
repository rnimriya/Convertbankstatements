import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QboChecker } from "@/components/tools/QboChecker";
import { SimilarToolsSection } from "@/components/tools/SimilarTools";
import { BUILD_NONCE } from "@/lib/csp-nonce";

const FAQS = [
  {
    q: "Which file types can I check?",
    a: "Any Web Connect or OFX-family file: .qbo, .ofx and .qfx, for bank or credit-card accounts. CSV and PDF statements are not OFX files — convert those first with the CSV to QBO converter or the statement converter, then check the result here.",
  },
  {
    q: "Is the check really free?",
    a: "Yes. Scanning a file needs no account and costs nothing, and this checker has no download to gate — the report is the whole product. The file is processed in memory to build the report and is never stored afterwards. We never sell or share financial data.",
  },
  {
    q: "Will checking my file change it?",
    a: "No. The checker only reads — the report describes problems, it does not repair them. Repairs live in their own tools, so you always decide what gets changed: the OFX to QBO fixer for bank IDs and structure, the QBO Duplicate Finder for a cleaned file with repeated transaction IDs dropped.",
  },
  {
    q: "The report says the closing balance is wrong, but my statement looks right. Which do I trust?",
    a: "The statement. The balance inside a file can be mistyped by whatever generated it, or dated at the wrong day. If the rows add up to the statement but the file's closing balance disagrees, the file is the problem — regenerate or fix it, never 'correct' your books to match a bad file.",
  },
  {
    q: "How is this different from the QBO Duplicate Finder?",
    a: "This checker validates the whole file before import — structure, bank identity, balances, statement period, transaction IDs and totals — and gives a verdict. The Duplicate Finder does one job deeply: it groups repeated FITIDs and repeated rows inside the file and, on Pro, builds a cleaned QBO. Use the checker for the verdict, the finder for the cleanup.",
  },
  {
    q: "QuickBooks already rejected my file. Can the checker still help?",
    a: "Yes — that is its best use. QuickBooks shows one generic refusal (OL-222, or 'unable to verify financial institution'); the checker names the specific cause in the file: a broken tag, a missing or delisted bank ID, the wrong format flavour. Once you know which one it is, the fix is usually a minute in the fixer or a fresh download from your bank.",
  },
];

const PAGE_URL = "https://www.convertstatement.online/tools/qbo-checker";

export const metadata: Metadata = {
  title: "Free QBO File Checker — Validate QuickBooks Web Connect Files | Convert Statement",
  description:
    "Upload a .qbo, .ofx or .qfx file and check it before importing into QuickBooks: structure, ledger balance, statement period, duplicate FITIDs and transactions. No account needed to scan, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Free QBO File Checker",
    description:
      "Validate a QBO/OFX file before QuickBooks does: balances, duplicates, FITIDs, period dates. Free and private.",
    url: PAGE_URL,
    type: "website",
  },
};

export default function QboCheckerPage() {
  const nonce = BUILD_NONCE;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <div className="agri-sans">
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <main className="min-h-screen bg-white">
        <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #E9F5E4 0%, #F4FAF1 60%, #FFFFFF 100%)" }}>
          <div className="absolute left-1/2 -translate-x-1/2 -top-[420px] w-[1100px] h-[800px] pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(44,160,28,0.18), transparent 72%)" }} />
          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-[124px] pb-24">
            <div className="text-center mb-6 max-w-4xl mx-auto">
          <p className="relative inline-flex items-center gap-2 rounded-full bg-white border border-[#D8E8D2] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#007A33] mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
            Free Tool
          </p>
          <h1 className="relative font-display text-2xl sm:text-[2.4rem] font-bold text-[#0B1F16] leading-[1.08] max-w-4xl mx-auto">
            QBO File <span className="text-[#2CA01C]">Checker</span>
          </h1>
          <p className="relative mt-4 text-lg text-zinc-600 max-w-2xl mx-auto">
            About to import a QBO file into QuickBooks? Check it first. We validate the file&apos;s
            structure, closing balance, statement period, and the duplicate risks QuickBooks
            won&apos;t warn you about until reconciliation breaks.
          </p>
            </div>
          </div>
        </section>

        <div className="relative z-20 w-full max-w-6xl mx-auto px-6 -mt-20">
          <QboChecker />
        </div>

        <section className="mx-auto max-w-6xl px-6 pb-12">

          <div className="mt-14">
            <h2 className="font-display text-2xl font-bold text-zinc-900">What this checker looks for</h2>
            <ul className="mt-4 space-y-2.5 text-zinc-600 leading-relaxed">
              <li><strong className="text-zinc-900">Valid OFX structure</strong> — a .qbo file is OFX underneath; if the message set is missing, QuickBooks rejects the import outright.</li>
              <li><strong className="text-zinc-900">Ledger (closing) balance</strong> — reconciliation aims at this number. If it&apos;s missing or dated differently from the statement period, expect a fight at month-end.</li>
              <li><strong className="text-zinc-900">Duplicate FITIDs</strong> — QuickBooks treats a repeated transaction ID as already-imported and can silently skip real transactions.</li>
              <li><strong className="text-zinc-900">Look-alike transactions</strong> — same date, amount, and name appearing twice: sometimes genuine, often a double export.</li>
              <li><strong className="text-zinc-900">Dates outside the period</strong> — transactions dated outside the file&apos;s declared statement period are a common cause of beginning-balance mismatches.</li>
            </ul>
            <p className="mt-5 text-zinc-600 leading-relaxed">
              Files converted with Convert Statement are built to pass every one of these checks —
              the running balances are verified against the statement itself before the QBO is
              generated. <a href="/quickbooks" className="text-[#007A33] font-semibold hover:underline">See how the QuickBooks converter works</a>.
            </p>
          </div>

          <div className="mt-14">
            <h2 className="font-display text-2xl font-bold text-zinc-900">How to check a file, step by step</h2>
            <p className="mt-3 text-zinc-600 leading-relaxed">
              <strong className="text-zinc-900">Step 1 — Upload the file you were about to import.</strong>{" "}
              Drop in the .qbo, .ofx or .qfx file (up to 10 MB). The scan is free, needs no
              account, and the file is read in memory — nothing is stored.
            </p>
            <p className="mt-3 text-zinc-600 leading-relaxed">
              <strong className="text-zinc-900">Step 2 — Read the verdict, then the findings.</strong>{" "}
              The report leads with whether the file is safe to import, then lists each finding
              with the row or field responsible — structure and bank identity first, because
              those decide whether QuickBooks accepts the file at all.
            </p>
            <p className="mt-3 text-zinc-600 leading-relaxed">
              <strong className="text-zinc-900">Step 3 — Fix the file, or re-export it.</strong>{" "}
              Identity and detail problems are repaired in the file; missing rows and truncated
              downloads mean going back to the bank for a fresh export. Either way, the fix
              happens before import, not inside your books afterwards.
            </p>
            <p className="mt-3 text-zinc-600 leading-relaxed">
              <strong className="text-zinc-900">Step 4 — Re-check, then import.</strong>{" "}
              Run the repaired file through this checker again. A clean report is the signal to
              import — and worth keeping with the statement as the record that the file was
              verified first.
            </p>
          </div>

          <div className="mt-14">
            <h2 className="font-display text-2xl font-bold text-zinc-900">Six checks, one verdict</h2>
            <p className="mt-3 text-zinc-600 leading-relaxed">
              A QBO file can fail in ways QuickBooks never describes — it either refuses the file
              with a generic message or imports it and lets reconciliation discover the damage.
              The checker reads the file the way QuickBooks will, across six areas, and reports
              each problem with the row it belongs to:
            </p>
            <p className="mt-5 text-zinc-600 leading-relaxed">
              The areas are ordered by consequence: structure and identity decide whether the
              file imports at all; balances and totals decide whether it imports <em>correctly</em>;
              IDs and dates decide whether importing the same period twice is safe.
            </p>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="text-left text-xs text-zinc-500 bg-zinc-50 border-b border-zinc-200">
                    <th className="px-5 py-3 font-semibold">Area</th>
                    <th className="px-5 py-3 font-semibold">What gets checked</th>
                    <th className="px-5 py-3 font-semibold">What breaks if it is wrong</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-100 align-top"><td className="px-5 py-3 font-bold text-zinc-900 whitespace-nowrap">File structure</td><td className="px-5 py-3 text-zinc-600 leading-relaxed">OFX header, message sets, and every tag closed and complete</td><td className="px-5 py-3 text-zinc-600 leading-relaxed">QuickBooks refuses the file outright (OL-222)</td></tr>
                  <tr className="border-b border-zinc-100 align-top"><td className="px-5 py-3 font-bold text-zinc-900 whitespace-nowrap">Bank identity</td><td className="px-5 py-3 text-zinc-600 leading-relaxed">An INTU.BID bank ID is present and plausible for the account</td><td className="px-5 py-3 text-zinc-600 leading-relaxed">"Unable to verify financial institution"</td></tr>
                  <tr className="border-b border-zinc-100 align-top"><td className="px-5 py-3 font-bold text-zinc-900 whitespace-nowrap">Balance chain</td><td className="px-5 py-3 text-zinc-600 leading-relaxed">Each running balance equals the previous balance plus its transaction, and the closing balance matches the last one</td><td className="px-5 py-3 text-zinc-600 leading-relaxed">Reconciliation is off by exactly the break</td></tr>
                  <tr className="border-b border-zinc-100 align-top"><td className="px-5 py-3 font-bold text-zinc-900 whitespace-nowrap">Transaction IDs</td><td className="px-5 py-3 text-zinc-600 leading-relaxed">Every row carries a FITID and no FITID repeats</td><td className="px-5 py-3 text-zinc-600 leading-relaxed">Real transactions skipped as "already imported" — or imported twice</td></tr>
                  <tr className="border-b border-zinc-100 align-top"><td className="px-5 py-3 font-bold text-zinc-900 whitespace-nowrap">Dates</td><td className="px-5 py-3 text-zinc-600 leading-relaxed">All transactions fall inside the declared statement period, in a sane order</td><td className="px-5 py-3 text-zinc-600 leading-relaxed">Beginning-balance mismatches and silently skipped rows</td></tr>
                  <tr className="align-top"><td className="px-5 py-3 font-bold text-zinc-900 whitespace-nowrap">Totals</td><td className="px-5 py-3 text-zinc-600 leading-relaxed">Credits minus debits equals the net change between the opening and closing balances</td><td className="px-5 py-3 text-zinc-600 leading-relaxed">Amount errors hide inside a file that otherwise looks fine</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-14">
            <h2 className="font-display text-2xl font-bold text-zinc-900">What a healthy file looks like</h2>
            <p className="mt-3 text-zinc-600 leading-relaxed">
              Most of a QBO file is transactions, but five fields decide whether QuickBooks trusts
              it. In a healthy file they look like this:
            </p>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="text-left text-xs text-zinc-500 bg-zinc-50 border-b border-zinc-200">
                    <th className="px-5 py-3 font-semibold">Field</th>
                    <th className="px-5 py-3 font-semibold">In a healthy file</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-100 align-top"><td className="px-5 py-3 font-bold text-zinc-900 whitespace-nowrap">DTPOSTED</td><td className="px-5 py-3 text-zinc-600 leading-relaxed">Date in YYYYMMDD form, inside the statement period, one per transaction</td></tr>
                  <tr className="border-b border-zinc-100 align-top"><td className="px-5 py-3 font-bold text-zinc-900 whitespace-nowrap">TRNAMT</td><td className="px-5 py-3 text-zinc-600 leading-relaxed">Signed amount — money out negative, money in positive, no currency symbols</td></tr>
                  <tr className="border-b border-zinc-100 align-top"><td className="px-5 py-3 font-bold text-zinc-900 whitespace-nowrap">FITID</td><td className="px-5 py-3 text-zinc-600 leading-relaxed">Present on every row and never repeated anywhere in the file</td></tr>
                  <tr className="border-b border-zinc-100 align-top"><td className="px-5 py-3 font-bold text-zinc-900 whitespace-nowrap">INTU.BID</td><td className="px-5 py-3 text-zinc-600 leading-relaxed">Your bank's ID, the one QuickBooks checks against Intuit's list</td></tr>
                  <tr className="align-top"><td className="px-5 py-3 font-bold text-zinc-900 whitespace-nowrap">LEDGERBAL</td><td className="px-5 py-3 text-zinc-600 leading-relaxed">Equals the statement's closing balance, dated at the period end</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-5 text-zinc-600 leading-relaxed">
              If your report flags one field on every row, the export itself is systematically
              wrong — re-export rather than repairing row by row.
            </p>
          </div>

          <div className="mt-14">
            <h2 className="font-display text-2xl font-bold text-zinc-900">Symptom: QuickBooks refuses the file outright</h2>
            <p className="mt-3 text-zinc-600 leading-relaxed">
              A refusal that happens before any transaction is read is never about the
              transactions. It is structure or identity: a truncated download or a hand-edited tag
              breaks the OFX (Desktop calls it OL-222; Online says the file is not a valid Web
              Connect file); a Quicken QFX file renamed to .qbo or a non-USD currency tag fails
              the format check; a missing bank ID fails the "verify financial institution" check.
              The checker separates the three, because each has a different fix — re-download for
              truncation, re-export for the wrong format, and the{" "}
              <a href="/tools/ofx-to-qbo" className="text-[#007A33] font-semibold hover:underline">OFX to QBO fixer</a>{" "}
              for a bank ID that needs repair. Renaming a file's extension fixes none of them.
            </p>
          </div>

          <div className="mt-14">
            <h2 className="font-display text-2xl font-bold text-zinc-900">Symptom: it imports, but the balance is wrong</h2>
            <p className="mt-3 text-zinc-600 leading-relaxed">
              This is the expensive failure, because it is discovered at reconciliation, weeks
              later. The usual causes are a break in the balance chain — the bank's export dropped
              a row, or one amount was keyed twice — a closing balance dated at a different day
              than the period end, or the file imported into the wrong account entirely. The size
              of the disagreement is the clue: if QuickBooks is off by exactly one transaction,
              that row is missing or doubled; if it is off by the amount the checker reports as
              the chain break, the file itself disagrees with its own balances, and no amount of
              reconciling inside QuickBooks will fix it — the file has to be corrected and
              re-imported.
            </p>
          </div>

          <div className="mt-14">
            <h2 className="font-display text-2xl font-bold text-zinc-900">Symptom: transactions land in the wrong month</h2>
            <p className="mt-3 text-zinc-600 leading-relaxed">
              Sometimes the import succeeds, the balance is right, and the entries still pollute
              the wrong period: a January statement whose file declares a February period, or a
              handful of rows dated outside the file's own DTSTART–DTEND range. QuickBooks files
              transactions by their dates, so a wrong declared period mostly causes confusion at
              the boundaries — beginning balances that do not match the previous month's close,
              and rows that look missing because they were posted a month early or late. The
              checker flags every date outside the declared period and any period that disagrees
              with the statement's actual first and last transactions, so the file can be
              regenerated with the right range before it spreads entries across two months.
            </p>
          </div>

          <div className="mt-14">
            <h2 className="font-display text-2xl font-bold text-zinc-900">Symptom: transactions appear twice — or not at all</h2>
            <p className="mt-3 text-zinc-600 leading-relaxed">
              Both symptoms come from transaction IDs. When two rows share one FITID, QuickBooks
              treats the second as already imported and skips it without telling you — the file
              imports "successfully" with transactions missing. When a converter regenerates
              fresh IDs on every export, the opposite happens: the same rows arrive as strangers
              and import twice. The checker lists repeated IDs and look-alike rows (same date,
              amount, and name) separately, because the fixes differ. For a file with either
              problem, the{" "}
              <a href="/tools/free-qbo-cleanup-checker" className="text-[#007A33] font-semibold hover:underline">QBO Duplicate Finder</a>{" "}
              produces a cleaned version with duplicates dropped and IDs regenerated.
            </p>
          </div>

          <div className="mt-14">
            <h2 className="font-display text-2xl font-bold text-zinc-900">Reading the report</h2>
            <p className="mt-3 text-zinc-600 leading-relaxed">
              The report leads with the verdict — whether the file is safe to import — then lists
              findings by area, each with the row or field responsible. Work from the top:
              structure and identity findings block the import itself, balance and date findings
              corrupt it quietly, and duplicate findings decide whether it is safe to import the
              same period twice.
            </p>
            <figure className="mt-6 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
              <img src="/tools/csv-to-qbo-review.webp" alt="A bookkeeper comparing a QBO checker report against the original bank statement before importing the file into QuickBooks" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
              <figcaption className="text-sm leading-relaxed text-[#33502F]">Two minutes with a checker report beats an afternoon repairing a bad import.</figcaption>
            </figure>
          </div>

          <div className="mt-14">
            <h2 className="font-display text-2xl font-bold text-zinc-900">Fix it, or re-export it?</h2>
            <p className="mt-3 text-zinc-600 leading-relaxed">
              Fix the file when its structure is sound but details are off: a bank ID that is
              missing or wrong, dates that fall outside the period, a closing balance that was
              mistyped, duplicate transaction IDs. The{" "}
              <a href="/tools/ofx-to-qbo" className="text-[#007A33] font-semibold hover:underline">OFX to QBO fixer</a>{" "}
              repairs IDs and dates in place, and the cleanup checker rebuilds files whose IDs
              collide — in both cases the transactions themselves, which are correct, stay
              untouched.
            </p>
            <p className="mt-5 text-zinc-600 leading-relaxed">
              Re-export when the damage is in the data: transactions missing from the middle of
              the period, a file truncated halfway through, or a file that belongs to a different
              account altogether. No editor can invent rows the bank's export dropped — go back
              to the bank and download the period again. And if your bank only offers CSV, do not
              hand-build a QBO from it: convert it with the{" "}
              <a href="/tools/csv-to-qbo" className="text-[#007A33] font-semibold hover:underline">CSV to QBO Converter</a>,
              which verifies the balances against the statement before the file is generated.
            </p>
            <ul className="mt-4 space-y-2.5 text-zinc-600 leading-relaxed">
              <li><strong className="text-zinc-900">Fix:</strong> wrong or missing bank ID, dates outside the period, a mistyped closing balance, colliding transaction IDs.</li>
              <li><strong className="text-zinc-900">Re-export:</strong> rows missing mid-period, a truncated file, the wrong account's statement, a period that was never downloaded in full.</li>
              <li><strong className="text-zinc-900">Either way:</strong> run the result through this checker again before importing — the fix is only real when the report says so.</li>
            </ul>
          </div>

          <div className="mt-14">
            <h2 className="font-display text-2xl font-bold text-zinc-900">Three routes when a file fails, honestly compared</h2>
            <p className="mt-3 text-zinc-600 leading-relaxed">
              <strong className="text-zinc-900">Fix the file</strong> when its structure is sound but its
              details are off — a bank ID, a closing balance, dates outside the period. Cheapest
              route, and the transactions stay exactly as the bank issued them.{" "}
              <strong className="text-zinc-900">Re-export from the bank</strong> when the data itself is
              damaged — rows missing mid-period, a truncated download, the wrong account's file.
              Slower, but no editor can invent rows the export dropped.{" "}
              <strong className="text-zinc-900">Import anyway and repair inside QuickBooks</strong> is
              the route to avoid: every problem the checker names here becomes manual cleanup
              inside live books, with the reconciliation difference as your only map. The check
              exists so the third route is never necessary.
            </p>
          </div>

          <div className="mt-14">
            <h2 className="font-display text-2xl font-bold text-zinc-900">What the checker cannot see</h2>
            <p className="mt-3 text-zinc-600 leading-relaxed">
              Honesty about scope: this checker validates the file, not your bookkeeping. It
              cannot tell whether a transaction belongs in Office Expenses or Cost of Goods Sold
              — categorization happens inside QuickBooks, after import. It cannot know whether
              your bank quietly omitted a transaction from the export before the file was
              created; a file can be internally perfect and still incomplete against the paper
              statement, which is why the closing balance is compared with the statement itself.
              And it cannot repair an account that was already damaged by earlier bad imports —
              for that, compare the statement against QuickBooks directly with the{" "}
              <a href="/tools/reconciliation-finder" className="text-[#007A33] font-semibold hover:underline">Reconciliation Difference Finder</a>.
              What it does guarantee is narrower and valuable: the file you are about to import
              is structurally sound, internally consistent, and safe to bring into your books.
            </p>
          </div>

          <div className="mt-14">
            <h2 className="font-display text-2xl font-bold text-zinc-900">Make it a habit: check before every import</h2>
            <p className="mt-3 text-zinc-600 leading-relaxed">
              The check takes seconds and needs no account, so there is no reason for it to be a
              rescue operation. Build it into the month-end routine — download the file, check
              it, import it, reconcile — and keep the report with the statement it belongs to.
              Months later, when a balance is questioned, the report shows the file was verified
              before it ever touched your books, which turns an audit question into a thirty-second
              answer.
            </p>
          </div>

        </section>

        <SimilarToolsSection currentPath="/tools/qbo-checker" />

        <section className="mx-auto max-w-6xl px-6 pb-12">
          <div className="mt-14">
            <h2 className="font-display text-2xl font-bold text-zinc-900">QBO checker questions, answered</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {FAQS.map((f) => (
                <div key={f.q} className="rounded-2xl border border-zinc-200 p-5">
                  <h3 className="font-bold text-zinc-900">{f.q}</h3>
                  <p className="mt-2 text-zinc-600 leading-relaxed text-[15px]">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
