import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/ofx-to-qfx";

export const metadata: Metadata = {
  title: "OFX to QFX Converter — Free | Convert Statement",
  description: "Convert a bank OFX file into Quicken's QFX variant — same transactions, same structure, with the source file's bank identity carried over. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "OFX to QFX Converter — Free",
    description: "Upload a OFX file and download it as QFX — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "Can I just rename my .ofx file to .qfx?",
    a: "Renaming changes nothing inside the file. This converter rebuilds the contents as a clean OFX 1.02 statement — full timestamps, transactions in chronological order, the account number and closing balance carried over when the source has them — and then gives it the .qfx extension Quicken asks for. A renamed file keeps whatever shape, ordering and short dates the bank originally wrote.",
  },
  {
    q: "Does this converter add my bank’s INTU.BID if the OFX does not have one?",
    a: "No, and any tool that promises to guess one should be treated with suspicion. If your source OFX carries an institution ID — an INTU.BID tag or an FID inside its FI block — that value is preserved and written into the QFX. If it carries none, the QFX has none either, because an invented ID can point Quicken at the wrong bank.",
  },
  {
    q: "Does the closing balance carry over to the QFX?",
    a: "Yes, when the source OFX carries a ledger balance: the same amount and its as-of date are written into the rebuilt file, so Quicken has the same reconciliation target the bank stated. If the source has no ledger balance, the output has none — a balance is never invented.",
  },
  {
    q: "Quicken still says it cannot verify my financial institution. Why?",
    a: "That message is about the institution ID, not your transactions. It usually means the original OFX carried no ID for Quicken to verify against, and this converter does not fabricate one. Download the QFX directly from your bank if it offers one for Quicken; a bank-issued QFX carries the bank’s registered ID.",
  },
  {
    q: "Can I convert a credit card OFX for a Quicken card account?",
    a: "Be careful here. The rebuilt file is written as a bank statement for a checking account, whatever the source described, so it suits bank accounts. Importing it against a Quicken credit card account asks Quicken to treat card activity as a checking account — use your card issuer’s own Quicken download for card accounts instead.",
  },
  {
    q: "Is this converter free, and is my file stored?",
    a: "Yes, it is fully free with no account. Your file is processed in memory to build the QFX and is never stored afterwards.",
  },
];

const HOWTO = [
  { title: "Download the OFX from your bank", body: "Use the OFX option in your bank’s export area for the account and period you need in Quicken." },
  { title: "Upload the .ofx file here", body: "Drop it into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Press Convert to QFX", body: "The statement is rebuilt in clean OFX 1.02 form: transactions sorted chronologically, full timestamps, and the source file’s account number, institution ID and closing balance carried over when present." },
  { title: "Import the .qfx in Quicken", body: "In Quicken, use the import for bank or brokerage statement files, open the downloaded .qfx, and confirm it is being linked to the account the statement actually belongs to." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function OfxToQfxPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="OFX to QFX Converter"
      subtitle="Convert a bank OFX file into Quicken's QFX variant — same transactions, same structure, with the source file's bank identity carried over. Fully free with no account."
      tool={<FormatConverter tool="ofx-to-qfx" fromLabel="OFX" toLabel="QFX" accept=".ofx" outputExt="qfx" />}
      currentPath="/tools/ofx-to-qfx"
      faqs={FAQS}
      howToName="How to convert OFX to QFX"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Your bank downloads OFX, but Quicken is asking for a QFX file</h2>
          <p className={P}>
            The download page offers OFX. Quicken’s import asks for a Web Connect file with a .qfx name. The two formats are close relatives — QFX is Quicken’s variant of OFX, built on the same statement structure — but the mismatch is enough to strand a perfectly good bank download outside the program you actually keep your accounts in. This page exists for that specific gap: a bank that still exports generic OFX, and a Quicken register that needs its own variant.
          </p>
          <p className={P}>
            One part of that story needs saying plainly, because it decides whether the import works. What makes a QFX feel like a Quicken file to Quicken is partly the institution identity inside it — the FID, also surfaced as INTU.BID. This converter preserves that identity when your source OFX carries one and writes it into the rebuilt file. It does not add an ID your file does not have, and it never guesses a bank’s number: a wrong ID is worse than a missing one, because it ties your statement to someone else’s bank. If your bank’s OFX is a bare generic export with no institution block, the conversion still rebuilds the statement cleanly as QFX — but Quicken’s institution check is then a question only a bank-issued download can fully answer.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Part of the statement</th><th className={TH}>What happens in the QFX</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Transactions</strong></td><td className={TD}>Every transaction read from the file, written in chronological order with full 14-digit posting timestamps</td></tr>
                <tr><td className={TD}><strong>Transaction IDs (FITID)</strong></td><td className={TD}>Kept exactly as the bank wrote them; a transaction with no ID is given one generated from its own date, description and amount, so reconverting the same file produces the same ID</td></tr>
                <tr><td className={TD}><strong>Account number</strong></td><td className={TD}>Carried over from the source file, so Quicken can match the statement to the right account</td></tr>
                <tr><td className={TD}><strong>Institution ID (INTU.BID / FID)</strong></td><td className={TD}>Preserved when the source carries one; left absent when it does not — never invented</td></tr>
                <tr><td className={TD}><strong>Closing balance</strong></td><td className={TD}>Carried over with its as-of date when the source states one; absent when it does not</td></tr>
                <tr><td className={TD}><strong>Separate memo text</strong></td><td className={TD}>Not carried as its own field — the transaction name is what the rebuilt file holds, so a memo that differs from the name stays only in the source</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>How to convert OFX to QFX with this converter</h2>
          <p className={P}>
            <strong>Step 1 — Download the OFX for the right account and period.</strong> Use your bank’s export area and keep the period to what Quicken is missing. Overlapping a period Quicken already has is the easiest way to create cleanup work, even with transaction IDs present.
          </p>
          <p className={P}>
            <strong>Step 2 — Upload the .ofx above.</strong> One file, up to 10 MB, no account. The converter reads the bank statement or credit-card statement blocks inside the file directly — there is no mapping step, because OFX carries its own labels.
          </p>
          <p className={P}>
            <strong>Step 3 — Press Convert to QFX and note the count.</strong> The result panel reports how many transactions the rebuilt file holds. The rebuild sorts transactions chronologically, expands posting dates to full timestamps, writes the account number from your file (with a placeholder of zeros only if the source stated none), and carries the closing balance across when there is one.
          </p>
          <p className={P}>
            <strong>Step 4 — Import it in Quicken and link the account deliberately.</strong> In Quicken, use the import for bank or brokerage statement files and open the .qfx. When Quicken asks which account the statement belongs to, choose the existing account that matches the account number in the file rather than letting it create a new one — a converted statement linked to a fresh register duplicates your history in a second place instead of filling the gap in the first.
          </p>
          <p className={P}>
            <strong>Step 5 — Reconcile to the statement, not to the download.</strong> Check Quicken’s ending balance for the period against the bank statement. If the QFX carried the bank’s closing balance, that comparison is built in; if it did not, the paper or PDF statement remains your target figure.
          </p>

          <h2 className={H2M}>When Quicken still will not take the file</h2>
          <h3 className={H3}>“Cannot verify the financial institution”</h3>
          <p className={P}>
            This is the institution-ID problem described above, surfacing at import. Inspect the source first: if the OFX has no FI block, no converter can honestly supply the missing registration. Your routes are the bank’s own QFX download if one exists, or connecting the account in Quicken so the bank delivers the identity itself. What you should not do is copy an ID from a different bank’s file — Quicken would then file your transactions under the wrong institution.
          </p>
          <h3 className={H3}>Quicken offers to create a new account</h3>
          <p className={P}>
            That happens when Quicken cannot match the statement’s account number to a register it knows, or when the account was set up under a slightly different number. Link it manually to the existing account. Creating the new account and merging later is far more work than choosing the right register at import.
          </p>
          <h3 className={H3}>Transactions arrive, but as a checking statement from a card file</h3>
          <p className={P}>
            The rebuilt file is written in bank-statement form with a checking account type, regardless of what the source described. For a genuine bank account that is exactly right. For a credit card OFX it is the wrong shape, and no setting on this page changes it — card accounts should come from the issuer’s own Quicken download.
          </p>
          <h3 className={H3}>The import is missing the end of a long period</h3>
          <p className={P}>
            The reader takes up to 500 transactions from one file. Download the account from your bank in shorter periods, convert each OFX separately, and import them in date order, oldest first, so Quicken’s running balance builds the way the bank’s did.
          </p>
          <h3 className={H3}>The same month imports twice</h3>
          <p className={P}>
            Transaction IDs are the defence here, and they survive this conversion: IDs from the source are kept unchanged, and an ID generated for a transaction that had none is derived from that transaction’s own data, so converting the same OFX twice produces the same IDs both times. If duplicates still appear, compare periods before deleting anything — an overlap of a few days at the boundary is the usual cause, and only the overlapping rows should go.
          </p>

          <h2 className={H2M}>Your other routes into Quicken, compared</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Route</th><th className={TH}>What it costs you</th><th className={TH}>Where it breaks</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Download the QFX from the bank directly</strong></td><td className={TD}>Nothing — when it exists, it is the first choice, with the bank’s registered institution ID inside</td><td className={TD}>Many banks offer OFX without the Quicken variant, and older periods are often no longer downloadable at all</td></tr>
                <tr><td className={TD}><strong>Rename .ofx to .qfx</strong></td><td className={TD}>Ten seconds</td><td className={TD}>Nothing inside changes: short dates, original ordering and any structural untidiness all go to Quicken as they were</td></tr>
                <tr><td className={TD}><strong>Convert the OFX here</strong></td><td className={TD}>A few minutes per file, fully free</td><td className={TD}>The institution ID can only be preserved, never created — a source with none can still trip Quicken’s verification</td></tr>
                <tr><td className={TD}><strong>Connect the account inside Quicken</strong></td><td className={TD}>No files to handle once it works</td><td className={TD}>Connections fetch a limited history window and cannot recover the older periods a stored OFX file already holds</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Working in the other direction later, the <a href="/tools/qfx-to-ofx" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to OFX converter</a> turns a Quicken download back into generic OFX. If the same transactions are headed for QuickBooks instead, go straight to the <a href="/tools/qfx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to QBO converter</a>; for a spreadsheet view of either file, the <a href="/tools/ofx-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to CSV converter</a> and the <a href="/tools/qfx-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to CSV converter</a> lay the same transactions out as rows. Building a QFX from a spreadsheet rather than a bank file is the <a href="/tools/csv-to-qfx" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QFX converter</a>’s job.
          </p>
        </>
      }
    />
  );
}
