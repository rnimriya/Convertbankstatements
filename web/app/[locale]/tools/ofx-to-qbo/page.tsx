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
    a: "Three things: the header is normalized to OFX 1.02, the version QuickBooks Web Connect expects; short date values are expanded to full timestamps; and transactions with a missing or duplicated FITID get a new unique ID generated from the transaction itself. The report lists every fix and its count.",
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
    q: "Will the fixed file create duplicates if I import it twice?",
    a: "No. Kept FITIDs stay as they were, and regenerated FITIDs are derived deterministically from each transaction's date, description, and amount — re-running the fixer on the same file produces the same IDs, so QuickBooks recognizes a re-import as already imported.",
  },
  {
    q: "Does fixing the file change my transactions?",
    a: "Dates, descriptions, and amounts are carried over exactly as parsed from your file. Only the file structure, the timestamp format, and broken transaction IDs change. The report shows what the checker found in the original file before any fix, so you can compare.",
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
    q: "My file is OFX 2.x XML. Can it still be fixed?",
    a: "Yes. OFX 2.x writes the same data as XML, while QuickBooks Web Connect expects the older OFX 1.02 tag format. The fixer parses the XML, keeps every transaction and balance, and rewrites the file in 1.02 form — the transactions themselves are not altered in the process.",
  },
  {
    q: "What if QuickBooks still rejects the fixed file?",
    a: "Then the problem is usually outside the file structure: the account in QuickBooks is still linked to online services, or the file's bank ID does not match the account. The import-error decoder explains each message, and the QBO File Checker can verify the repaired file before you try again.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the fixed QBO and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account; the before-and-after report is free too.",
  },
];

const HOWTO = [
  { title: "Export from your bank", body: "Download the OFX, QFX, or QBO file your bank or accounting software gave you — even one QuickBooks already rejected." },
  { title: "Upload it here", body: "Drop the file in, optionally adding an INTU.BID and bank name if you have them from a working bank-downloaded QBO." },
  { title: "Review the report", body: "See what was wrong with the original file and exactly which fixes were applied, with counts." },
  { title: "Download and import", body: "Save the fixed .qbo — fully free — and import it into QuickBooks through the bank-feed import." },
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
          <h2 className={H2}>Why a file that opens fine still fails in QuickBooks</h2>
          <p className={P}>
            An OFX file can look perfectly healthy in a text editor — every transaction present,
            every amount right — and still be refused by QuickBooks, because QuickBooks is not
            reading the transactions first. It is reading the wrapping: the OFX version, the
            sign-on block that names your bank, the shape of the dates, and the transaction
            IDs. Web Connect expects one specific dialect, OFX 1.02, and files drift from it
            constantly. Banks export the newer OFX 2.x XML. Other software writes dates in
            shorthand, drops IDs, or reuses the same ID twice. Each flaw produces a different
            refusal — and one of them, the duplicated ID, produces no refusal at all:
            QuickBooks silently skips a real transaction it believes it has already seen.
          </p>
          <p className={P}>
            This fixer rebuilds the file in the dialect QuickBooks expects and shows you a
            report of everything that was wrong and everything that changed, with counts,
            before you download the repaired QBO.
          </p>

          <h2 className={H2M}>Anatomy of a broken file: what the fixer looks for</h2>
          <p className={P}>
            Six structural problems account for nearly every rejected or mis-imported file.
            The fixer checks for all six on every upload:
          </p>
          <div className="mt-4 overflow-x-auto">
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
                <tr><td className={TD}><strong>Missing bank ID</strong></td><td className={TD}>No INTU.BID in the sign-on block</td><td className={TD}>"Unable to verify financial institution"</td></tr>
                <tr><td className={TD}><strong>Short dates</strong></td><td className={TD}>DTPOSTED as 20261003, or with a timezone tail it cannot parse</td><td className={TD}>Rejects the transaction or misreads its date</td></tr>
                <tr><td className={TD}><strong>Missing FITID</strong></td><td className={TD}>A transaction with no ID element at all</td><td className={TD}>Can duplicate that transaction on every re-import</td></tr>
                <tr><td className={TD}><strong>Duplicate FITID</strong></td><td className={TD}>Two different transactions sharing one ID</td><td className={TD}>Silently skips the second one as a "duplicate"</td></tr>
                <tr><td className={TD}><strong>Malformed tags</strong></td><td className={TD}>Unclosed or mismatched OFX tags</td><td className={TD}>OL-222 — the response cannot be read at all</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>OFX, QFX and QBO: three names, one family</h2>
          <p className={P}>
            The three extensions cause endless confusion, so it is worth being precise. OFX —
            Open Financial Exchange — is the underlying format: a standard way for a bank to
            hand transactions to software. QFX is Quicken's licensed variant of the same
            format. QBO is Intuit's Web Connect variant for QuickBooks, written in the older
            OFX 1.02 dialect. The transactions inside all three are described the same way;
            what differs is the wrapping — the header, the dialect, and the institution ID
            each variant carries. That is why a fixer is possible at all: nothing about your
            financial data needs to change for a file to move from one member of the family to
            another. Only the wrapping is rebuilt, to the specification of the member
            QuickBooks actually accepts. When a bank offers you "OFX" and QuickBooks asks for
            "QBO," you do not have the wrong data — you have the right data in the wrong
            envelope.
          </p>

          <h2 className={H2M}>How the repair works, step by step</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li><strong className="text-zinc-900 dark:text-white">Upload the file QuickBooks refused.</strong> OFX, QFX or QBO — a rejection is exactly what this tool is for.</li>
            <li><strong className="text-zinc-900 dark:text-white">Add a bank ID only if you have one.</strong> If the file lacks INTU.BID and you can copy one from a working QBO your bank issued, type it in. Otherwise leave it blank — it will not be invented for you.</li>
            <li><strong className="text-zinc-900 dark:text-white">Read the report.</strong> It lists the problems found in the original file and the fixes applied, each with a count, so nothing changes silently.</li>
            <li><strong className="text-zinc-900 dark:text-white">Download and import.</strong> The rebuilt QBO goes in through the normal bank-feed or Web Connect import — fully free.</li>
          </ol>
          <p className={P}>
            Before importing the repaired file into QuickBooks Desktop, back up the company
            file. And if the target account is still linked to your bank's online services,
            disconnect it first — Desktop can refuse a Web Connect import, or post it to the
            wrong place, while that link is active. Keep the original file untouched
            alongside the repaired one — together they are your audit trail if anyone later
            asks what changed and why.
          </p>

          <h2 className={H2M}>What the fixer never changes</h2>
          <p className={P}>
            A repair tool earns trust by what it refuses to touch. Amounts are carried over to
            the cent. Payee and memo text is copied word for word. A date is only ever
            reformatted — a short date is expanded into the full timestamp of the same day,
            never moved to a different day. A FITID that is present and unique is kept exactly
            as it was, so your bank's own IDs stay stable across the repair. And the bank ID
            follows the strictest rule of all: <strong className="text-zinc-900 dark:text-white">your file's INTU.BID is
            preserved exactly as it is, or replaced only by a value you type in yourself — it
            is never guessed or invented</strong>. That matters because INTU.BID is how QuickBooks
            decides which institution a file belongs to; a made-up ID can point your books at
            the wrong bank and turn a small repair into a long cleanup.
          </p>
          <p className={P}>
            The regenerated IDs follow the same discipline. A replacement FITID is derived
            from the transaction itself — its date, description, and amount — rather than
            assigned at random. Run the same broken file through the fixer twice and you get
            the same repaired file, byte for byte in the places that matter. That determinism
            is what keeps a repaired file safe to re-import: QuickBooks sees the same IDs it
            saw the first time, not a fresh set of strangers.
          </p>

          <h2 className={H2M}>Before and after: repairing one file</h2>
          <p className={P}>
            Here is one small file's repair, line by line — the kind of summary the report
            gives you for your own file:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
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
            Five structural repairs; zero transactions altered. The amounts, dates, and payees
            in the after column are the same ones the file started with. (Sample file, shown
            for illustration.)
          </p>
          <figure className="mt-6 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-review.webp" alt="A bookkeeper comparing the repair report against the original file before importing the fixed QBO" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">Every repair is listed in the report before you download the file.</figcaption>
          </figure>

          <h2 className={H2M}>The error messages, decoded</h2>
          <h3 className={H3}>OL-222 — "not a valid Web Connect file"</h3>
          <p className={P}>
            QuickBooks Desktop's verdict when it cannot read the OFX response at all: the
            structure is malformed, the version is wrong, or the tags do not nest the way the
            format requires. Because the cause is structural, the cure is structural too —
            rebuilding the same transactions as clean OFX 1.02 resolves the great majority of
            OL-222 cases without touching the data inside.
          </p>
          <h3 className={H3}>OL-155 — the connection type is not supported</h3>
          <p className={P}>
            OL-155 appears when QuickBooks does not accept the way the file or connection
            identifies itself — the response type is not one it supports for that institution.
            A rebuilt Web Connect file carrying the correct bank ID sidesteps the unsupported
            route entirely: instead of connecting the way the original file tried to, you
            import a standard file manually, and manual import is always supported.
          </p>
          <h3 className={H3}>"Unable to verify financial institution"</h3>
          <p className={P}>
            This one is about identity, not data. QuickBooks compares the INTU.BID inside the
            file against the institutions it knows, and a missing or unrecognized ID stops the
            import before a single transaction is read. If your original file came from a
            bank-issued download, its ID is preserved by the fixer; if the ID was never there,
            the value from a working QBO your own bank gave you is the one to enter. The{" "}
            <a href="/tools/qbo-import-errors" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">import-error decoder</a>{" "}
            walks through this and the other refusal messages in the same terms QuickBooks
            shows them.
          </p>

          <h2 className={H2M}>Diagnose first when you are not sure what is wrong</h2>
          <p className={P}>
            The fixer changes your file; sometimes you want to understand it first. The{" "}
            <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a>{" "}
            runs the same structural examination and reports the problems without altering a
            byte — the right first step when a file came from a client and you need to explain
            what is wrong with it, or when you want a baseline before and after a repair.
            Diagnosis and repair use the same checklist, so the checker's report maps directly
            onto the fixer's report. The checker also verifies the file's balance chain —
            that the closing balance equals the opening position plus every transaction in
            between — which catches a different class of problem entirely: files that are
            structurally perfect but quietly missing a row. Structure from the fixer, arithmetic
            from the checker, and a file has nowhere left to hide.
          </p>

          <h2 className={H2M}>Fixing files every month? Make it a system</h2>
          <p className={P}>
            Some banks hand you a broken export every single month, and some clients send the
            same malformed file every quarter. When repair becomes routine, a free account
            keeps every original and every fixed file in one searchable history, so you can
            show a client exactly what was wrong with the file they sent in March. The
            dashboard adds bulk conversion when several statements land at once, and client
            portals let clients upload through their own link instead of emailing files. The
            fixer itself stays fully free, with or without an account — the account is for
            the paper trail around it.
          </p>
          <p className={P}>
            Once a file is repaired, the{" "}
            <a href="/tools/qbo-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to CSV converter</a>{" "}
            can lay its transactions out as a spreadsheet — often the quickest way to eyeball
            that the repaired file contains what you expected.
          </p>
        </>
      }
    />
  );
}
