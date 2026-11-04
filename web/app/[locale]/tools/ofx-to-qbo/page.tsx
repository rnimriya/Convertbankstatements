import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { OfxFixer } from "@/components/tools/OfxFixer";

const PAGE_URL = "https://www.convertstatement.online/tools/ofx-to-qbo";

export const metadata: Metadata = {
  title: "OFX / QFX to QBO Converter + QBO Fixer — Free | Convert Statement",
  description:
    "Free OFX/QFX to QBO converter and QBO fixer: rebuild a broken OFX, QFX or QBO file as a clean OFX 1.02 QBO — header normalized, dates fixed, missing and duplicate transaction IDs regenerated. Fully free, no account, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "OFX / QFX to QBO Converter + QBO Fixer",
    description:
      "Upload a broken OFX, QFX or QBO file and download a repaired QBO that QuickBooks accepts. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "What does this fixer actually repair?",
    a: "Three things: the header is normalized to OFX 1.02, the version QuickBooks Web Connect expects; short date values are expanded to full timestamps; and transactions with a missing or duplicated FITID get a new unique ID generated from the transaction itself. The report lists every fix and its count, and your file is processed in memory and never stored.",
  },
  {
    q: "What is INTU.BID, and does this tool change it?",
    a: "INTU.BID identifies your bank to QuickBooks, and this tool preserves the one in your file — it never guesses a bank's ID. If your file has none and QuickBooks calls your bank unsupported, type one in, copied from a working QBO your bank gave you.",
  },
  {
    q: "My bank only gives me OFX or QFX files. Can QuickBooks use them?",
    a: "QuickBooks imports Web Connect (.qbo) files, and a QBO is OFX 1.02 underneath. This tool rebuilds your OFX or QFX transactions as a proper .qbo file with the header, currency, and structure QuickBooks expects, so you can import it through the normal bank-feed import.",
  },
  {
    q: "What does error OL-222 mean?",
    a: "OL-222 is QuickBooks Desktop's message for a Web Connect file whose OFX response it cannot read — usually malformed structure, a wrong OFX version, or damaged tags. Rebuilding the file as clean OFX 1.02, which is what this fixer does, resolves the great majority of OL-222 cases.",
  },
  {
    q: "Why does QuickBooks say it cannot verify my financial institution?",
    a: "That message means QuickBooks could not match the bank ID (INTU.BID) inside the file to a bank it knows. This fixer preserves a valid ID already present; if the file has none, enter the ID from a working QBO your own bank issued — the tool never invents one.",
  },
  {
    q: "Will the fixed file create duplicates if I import it twice?",
    a: "No. Kept FITIDs stay as they were, and regenerated FITIDs are derived deterministically from each transaction's date, description, and amount — re-running the fixer on the same file produces the same IDs, so QuickBooks recognizes a re-import as already imported. The download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Add a bank ID only if you have one", body: "If your file lacks INTU.BID, copy one from a working QBO your bank issued and type it in first — otherwise leave it blank; it will not be invented for you." },
  { title: "Upload the rejected file", body: "Drop in the OFX, QFX, or QBO file your bank or software gave you — even one QuickBooks already refused." },
  { title: "Review the report", body: "See what was wrong with the original file and exactly which fixes were applied, with counts." },
  { title: "Download and import", body: "Save the fixed .qbo — fully free — and import it into QuickBooks through the bank-feed or Web Connect import." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function OfxToQboPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="OFX to QBO Converter and QBO Fixer"
      subtitle="Rebuild a broken OFX, QFX, or QBO file as a clean QBO QuickBooks accepts: header normalized to OFX 1.02, dates fixed, and missing or duplicate transaction IDs regenerated."
      tool={<OfxFixer />}
      currentPath="/tools/ofx-to-qbo"
      faqs={FAQS}
      howToName="How to convert and fix an OFX file for QuickBooks"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why QuickBooks rejects a perfectly good OFX file</h2>
          <p className={P}>
            This is the fixer page, and it exists because of a frustrating truth: an OFX file can
            look perfectly healthy in a text editor — every transaction present, every amount
            right — and still be refused by QuickBooks. That is because QuickBooks is not reading
            the transactions first. It is reading the wrapping: the OFX version, the sign-on block
            that names your bank, the shape of the dates, and the transaction IDs. Web Connect
            expects one specific dialect, OFX 1.02, and files drift from it constantly.
          </p>
          <p className={P}>
            The drift has ordinary causes. Banks export the newer OFX 2.x XML instead of the 1.02
            tag format. Other software writes dates in shorthand, drops transaction IDs, or reuses
            the same ID twice. And a growing number of banks have dropped QuickBooks support from
            their downloads altogether, leaving customers holding a plain OFX or a Quicken QFX
            file that QuickBooks will not take as it stands. The three extensions are one family —
            OFX is the underlying format, QFX is Quicken&rsquo;s licensed variant, and QBO is Intuit&rsquo;s
            Web Connect variant — and the transactions inside all three are described the same
            way. What differs is the wrapping, which is exactly what a fixer can rebuild.
          </p>
          <p className={P}>
            Each flaw produces a different refusal — and one of them, the duplicated ID, produces
            no refusal at all: QuickBooks silently skips a real transaction it believes it has
            already seen. This fixer rebuilds the file in the dialect QuickBooks expects, repairs
            the bank ID (INTU.BID) only from your file or your own input — never by guessing — and
            shows you a report of everything that was wrong and everything that changed, with
            counts, before you download the repaired QBO.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Problem</th>
                  <th className={TH}>What it looks like in the file</th>
                  <th className={TH}>What QuickBooks does with it</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Wrong OFX version</strong></td><td className={TD}>OFX 2.x XML, or a non-standard header block</td><td className={TD}>Refuses the file, or reads nothing from it</td></tr>
                <tr><td className={TD}><strong>Missing bank ID</strong></td><td className={TD}>No INTU.BID in the sign-on block</td><td className={TD}>&ldquo;Unable to verify financial institution&rdquo;</td></tr>
                <tr><td className={TD}><strong>Short dates</strong></td><td className={TD}>DTPOSTED as 20261003, or with a timezone tail it cannot parse</td><td className={TD}>Rejects the transaction or misreads its date</td></tr>
                <tr><td className={TD}><strong>Missing FITID</strong></td><td className={TD}>A transaction with no ID element at all</td><td className={TD}>Can duplicate that transaction on every re-import</td></tr>
                <tr><td className={TD}><strong>Duplicate FITID</strong></td><td className={TD}>Two different transactions sharing one ID</td><td className={TD}>Silently skips the second one as a &ldquo;duplicate&rdquo;</td></tr>
                <tr><td className={TD}><strong>Malformed tags</strong></td><td className={TD}>Unclosed or mismatched OFX tags</td><td className={TD}>OL-222 — the response cannot be read at all</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>How to fix an OFX or QFX file for QuickBooks, step by step</h2>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 1 — Set the bank identity first, if you have one.</strong>{" "}
            The optional fields above the upload are read when the file is processed, so fill them
            in before dropping the file in. If the file lacks an INTU.BID and you can copy one
            from a working QBO your bank issued (open it in a text editor and search for
            INTU.BID), type it in, with the bank name if you have it. Otherwise leave both blank —
            an ID already in your file is preserved exactly, and a missing one is left unset
            rather than invented.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 2 — Upload the file QuickBooks refused.</strong>{" "}
            OFX, QFX or QBO, up to 10 MB — a rejection is exactly what this tool is for. The fixer
            parses the transactions and balances and rebuilds them as a clean OFX 1.02 QBO.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 3 — Read the report.</strong>{" "}
            It has two halves: what was wrong with the original file, and the fixes applied, each
            with a count, so nothing changes silently. A repair tool earns trust by what it
            refuses to touch: amounts are carried over to the cent, payee and memo text is copied
            word for word, and a date is only ever reformatted — a short date is expanded into
            the full timestamp of the same day, never moved to a different day. A FITID that is
            present and unique is kept exactly as it was.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 4 — Download and import.</strong>{" "}
            Save the fixed .QBO — fully free — and import it through the normal bank-feed or Web
            Connect route. If you type a bank ID in after uploading, download again: the values
            are re-sent with the download, so the late entry still lands in the file. Before
            importing into QuickBooks Desktop, back up the company file, and if the target
            account is still linked to your bank&rsquo;s online services, disconnect it first —
            Desktop can refuse a Web Connect import, or post it to the wrong place, while that
            link is active. Keep the original file untouched alongside the repaired one; together
            they are your audit trail.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <caption className="pb-3 text-left font-semibold text-zinc-900 dark:text-white">Before and after: repairing one small file</caption>
              <thead>
                <tr>
                  <th className={TH}>Line in the file</th>
                  <th className={TH}>Before</th>
                  <th className={TH}>After the fix</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Format header</strong></td><td className={TD}>OFX 2.1 XML</td><td className={TD}>OFXHEADER 1.02 — the QBO / Web Connect format</td></tr>
                <tr><td className={TD}><strong>INTU.BID</strong></td><td className={TD}>Absent</td><td className={TD}>Left unset — or the value you entered; never invented</td></tr>
                <tr><td className={TD}><strong>First DTPOSTED</strong></td><td className={TD}>20261003</td><td className={TD}>20261003000000 — same day, full timestamp</td></tr>
                <tr><td className={TD}><strong>FITID, row 2</strong></td><td className={TD}>Missing</td><td className={TD}>Generated from the transaction itself</td></tr>
                <tr><td className={TD}><strong>FITID, rows 4 and 5</strong></td><td className={TD}>The same ID on both</td><td className={TD}>The second regenerated — both now unique</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Five structural repairs; zero transactions altered. (Sample file, shown for
            illustration.)
          </p>

          <h2 className={H2M}>The refusal messages, decoded — and what still blocks a fixed file</h2>
          <h3 className={H3}>OL-222 — &ldquo;not a valid Web Connect file&rdquo;</h3>
          <p className={P}>
            QuickBooks Desktop&rsquo;s verdict when it cannot read the OFX response at all: the
            structure is malformed, the version is wrong, or the tags do not nest the way the
            format requires. Because the cause is structural, the cure is structural too —
            rebuilding the same transactions as clean OFX 1.02 resolves the great majority of
            OL-222 cases without touching the data inside.
          </p>
          <h3 className={H3}>&ldquo;Unable to verify financial institution&rdquo;</h3>
          <p className={P}>
            This one is about identity, not data. QuickBooks compares the INTU.BID inside the file
            against the institutions it knows, and a missing or unrecognized ID stops the import
            before a single transaction is read. If your original file came from a bank-issued
            download, its ID is preserved by the fixer; if the ID was never there, the value from
            a working QBO your own bank gave you is the one to enter. The{" "}
            <a href="/tools/qbo-import-errors" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO import-error decoder</a>{" "}
            walks through this and the other refusal messages in the same terms QuickBooks shows
            them.
          </p>
          <h3 className={H3}>OL-155 — the connection type is not supported</h3>
          <p className={P}>
            OL-155 appears when QuickBooks does not accept the way the file or connection
            identifies itself. A rebuilt Web Connect file carrying the correct bank ID sidesteps
            the unsupported route entirely: instead of connecting the way the original file tried
            to, you import a standard file manually, and manual import is always supported.
          </p>
          <h3 className={H3}>The silent failure: a transaction that never arrives</h3>
          <p className={P}>
            No error message at all — the import &ldquo;succeeds&rdquo; and one transaction is simply
            missing. That is the duplicate-FITID flaw: two different transactions sharing one ID,
            and QuickBooks skipping the second as a duplicate it has supposedly seen. The fixer&rsquo;s
            report counts regenerated IDs, so you can see whether your file had the flaw before
            you wonder where a payment went. If a repaired file still will not import, run it
            through the{" "}
            <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a>{" "}
            — it examines the same file without changing a byte, and also verifies the balance
            chain, which catches files that are structurally perfect but quietly missing a row.
          </p>
          <figure className="mt-10 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-review.webp" alt="A bookkeeper comparing the repair report against the original file before importing the fixed QBO" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">Every repair is listed in the report before you download the file — nothing changes silently.</figcaption>
          </figure>

          <h2 className={H2M}>Fix it here, check it first, or go back to the bank?</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Route</th>
                  <th className={TH}>Best for</th>
                  <th className={TH}>Where it breaks</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Re-download the file from your bank</strong></td><td className={TD}>A download that was simply cut short or corrupted in transit</td><td className={TD}>If the bank&rsquo;s export itself is OFX 2.x, ID-less, or no longer offered for QuickBooks, the fresh download carries the same flaw</td></tr>
                <tr><td className={TD}><strong>Diagnose first, then fix</strong></td><td className={TD}>A client&rsquo;s file, when you need to explain what is wrong before changing anything</td><td className={TD}>Two steps instead of one — the checker reports, but only the fixer repairs</td></tr>
                <tr><td className={TD}><strong>Fix it here (this page)</strong></td><td className={TD}>A structurally broken OFX, QFX or QBO whose transactions are sound</td><td className={TD}>It cannot invent a bank ID your file never had, and it cannot fix an account-side problem, such as an account still linked to online services</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            The same rescue works in reverse for Quicken users holding the mirror-image problem —
            the{" "}
            <a href="/tools/qfx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to QBO converter</a>{" "}
            is dedicated to that one direction. And once a file is repaired, the{" "}
            <a href="/tools/qbo-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to CSV converter</a>{" "}
            can lay its transactions out as a spreadsheet — often the quickest way to eyeball that
            the repaired file contains what you expected.
          </p>
        </>
      }
    />
  );
}
