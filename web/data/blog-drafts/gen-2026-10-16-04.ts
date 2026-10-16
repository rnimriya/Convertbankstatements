export const post = {
  id: "gen-2026-10-16-04",
  slug: "unicredit-import-to-xero",
  title: "How to Import UniCredit Bank Statement PDF to Xero",
  excerpt:
    "Paid in euros through UniCredit? Import your UniCredit bank statement PDF to Xero with a clean CSV, multi-currency setup, and a fast monthly close routine.",
  content: `<p>If your business touches Europe, there is a good chance some of your money moves through UniCredit, the Italy-based banking group that serves millions of customers across the continent. When month-end rolls around, those euro-denominated transactions have to land in your accounting system, and retyping them is not an option. The fastest, most reliable route is to <strong>import UniCredit bank statement PDF to Xero</strong> with a clean CSV conversion: download the PDF from UniCredit online banking, convert it to Xero-ready CSV, and import it through the bank account settings in a few minutes.</p>
<p>This guide is written for the two groups who hit this problem most often. First, US companies with European subsidiaries or branch operations that bank with UniCredit and need to consolidate euro activity into a USD home-currency set of books. Second, freelancers, consultants, and remote workers who get paid in euros through a UniCredit account and want those payments reconciled properly in Xero without paying a bookkeeper to rekey every line. The steps below cover the download, the conversion, the import, Xero's multi-currency setup, and a monthly close routine that keeps USD and EUR accounts in sync.</p>
<h2>Downloading your UniCredit statement PDF from online banking</h2>
<p>Everything starts with a clean source file. UniCredit statements downloaded directly from online banking convert far more accurately than scanned printouts or screenshots, because the transaction table in the original PDF stays intact. Work through these steps:</p>
<ol>
<li>Sign in to <strong>UniCredit online banking</strong> and open the account whose activity you need.</li>
<li>Go to the statements or documents section and choose the statement period &mdash; a single month for a monthly close, or several months if you are catching up.</li>
<li>Download the statement as a <strong>PDF</strong>, not as a print-to-PDF or image export, so the table structure survives.</li>
<li>If the PDF is password protected, keep the password handy &mdash; you will need it at the conversion step.</li>
<li>Download every period you need in one sitting. A close built on January through November always comes back for December.</li>
</ol>
<p>For consultants paid in euros, one tip: download statements for the full quarter your invoices cover, not just the months with client payments. Bank fees, currency charges, and small transfers all matter at reconciliation time, and missing months create gaps Xero cannot fill. For more background on this bank, see our <a href="/banks/unicredit">UniCredit conversion guide</a>.</p>
<h2>Why euro statements and SEPA descriptions need extra care</h2>
<p>Euro-denominated UniCredit statements have three quirks that trip up US-based bookkeepers. The first is number formatting: many European statements print amounts with a period as the thousands separator and a comma as the decimal mark, like &euro;1.234,56. Xero expects US-style numbers (1,234.56), so those formats have to be normalized in the CSV before import or your amounts will be wrong by orders of magnitude.</p>
<p>The second quirk is SEPA transfer descriptions. Euro payments arrive with terse, machine-generated references &mdash; a mix of truncated payer names, SEPA reference codes, and purpose strings that read like alphabet soup. A line such as &ldquo;SEPA CT / REF 88412 / MULLER&rdquo; tells you far less than it should. Plan to expand the important ones into plain descriptions (client name, invoice number) during cleanup; your future self will thank you at audit time.</p>
<p>The third quirk is dates. European statements commonly use DD/MM/YYYY ordering, so 03/04/2026 means April 3, not March 4. A conversion tool that detects and normalizes the date format saves you from a month of misdated transactions. Review the first few rows of every converted file before importing &mdash; if dates and amounts look right on rows one through five, they are almost always right throughout.</p>
<figure><img src="/blog/unicredit-import-to-xero-inline-1.jpg" alt="Printed euro bank statement pages and a laptop on a desk, reviewed before conversion" width="1200" height="800" loading="lazy" /><figcaption>Euro statements and SEPA transfer descriptions deserve a careful review before you convert them.</figcaption></figure>
<h2>Converting the PDF into a Xero-ready CSV</h2>
<p>Xero cannot import a PDF statement directly, so the conversion step is where this workflow either succeeds or fails. A browser-based converter reads the transaction table in your UniCredit PDF and rebuilds it as rows and columns:</p>
<ol>
<li>Open the converter and drop in your UniCredit statement PDF (enter the PDF password if prompted).</li>
<li>Check the detected table: every transaction should be one row with date, description, and amount in the right columns.</li>
<li>Normalize the number format: convert European-style amounts (1.234,56) to US-style (1,234.56) so Xero reads them correctly.</li>
<li>Make sure dates are in a consistent MM/DD/YYYY or YYYY-MM-DD format that Xero will accept.</li>
<li>Download the result as <strong>CSV</strong> &mdash; Xero's statement import works with CSV files.</li>
</ol>
<p>With Convert Statement, the conversion runs in your browser and the free tier covers the first 8 pages of every file &mdash; enough for most monthly statements. Before you trust the file, add up the deposits and withdrawals columns and compare them against the printed totals on the PDF. If the numbers match, the table converted cleanly. Our <a href="/guides/convert-bank-statement-to-csv">guide to converting bank statements to CSV</a> walks through column mapping in more detail.</p>
<h2>Importing the statement into Xero step by step</h2>
<p>With a clean CSV in hand, the Xero import takes about five minutes. Xero's flow is the same regardless of which bank the statement came from:</p>
<ol>
<li>In Xero, go to <strong>Accounting &gt; Bank accounts</strong> and find your euro bank account (set this up first &mdash; see the next section if you have not).</li>
<li>Click <strong>Manage account</strong>, then choose <strong>Import a statement</strong>.</li>
<li>Upload your converted CSV file. Xero shows a preview of the first few rows.</li>
<li>Map the columns: assign Date, Description, and Amount (or separate debit/credit columns) to the right fields.</li>
<li>Confirm the import. Xero pulls the transactions into the bank account as unreconciled statement lines.</li>
</ol>
<p>After import, head to the Reconcile tab. This is where the SEPA descriptions you expanded earlier pay off: Xero's bank rules can auto-match recurring payees, so a monthly retainer from the same EU client reconciles itself after the first month. Create a rule for each recurring payer the first time you see them &mdash; five minutes now saves five minutes every month. For the full reconciliation workflow, see <a href="/blog/how-to-reconcile-bank-statement">how to reconcile a bank statement</a>.</p>
<h2>Setting up multi-currency for your euro bank account</h2>
<p>Importing euro transactions only works properly if Xero knows the account is denominated in euros. If multi-currency is not set up, stop and do this before importing anything:</p>
<ol>
<li>In Xero, enable multi-currency in your organization settings (available on the plans that support it).</li>
<li>Add <strong>EUR</strong> as a foreign currency alongside your USD home currency.</li>
<li>Create a bank account for your UniCredit account and set its currency to <strong>EUR</strong>, not USD. This is the step most people get wrong.</li>
<li>Let Xero pull automatic exchange rates for the statement dates &mdash; it updates rates daily and applies the rate for each transaction's date.</li>
</ol>
<p>Reconcile the euro account in euros and let Xero translate to USD for reporting. The small differences between the rate on the transaction date and the rate on the payment date show up as foreign currency gains or losses &mdash; that is normal accounting, not an error, and Xero posts them automatically. Review the FX gain/loss line at month-end so it never surprises you. A similar multi-currency setup is covered in our <a href="/blog/standard-chartered-import-to-xero">Standard Chartered to Xero import guide</a>, which deals with the same euro and pound statement quirks.</p>
<figure><img src="/blog/unicredit-import-to-xero-inline-2.jpg" alt="Desk with a calculator, euro notes, and reconciliation papers for multi-currency bookkeeping" width="1200" height="800" loading="lazy" /><figcaption>Reconciling USD and EUR accounts side by side is the heart of a clean multi-currency month-end close.</figcaption></figure>
<h2>A monthly close routine for USD and EUR books</h2>
<p>Juggling a US dollar operating account and a UniCredit euro account? Run this routine on the same day each month and your books stay clean:</p>
<ol>
<li><strong>Download both statements.</strong> Pull the UniCredit euro statement and your USD bank statement for the closed month, as PDFs, in one session.</li>
<li><strong>Convert both to CSV.</strong> Normalize European number and date formats in the euro file before anything else.</li>
<li><strong>Import USD first, then EUR.</strong> Import each file into its own currency-denominated bank account in Xero &mdash; never mix currencies in one account.</li>
<li><strong>Run your bank rules.</strong> Let Xero auto-match recurring SEPA payees and domestic vendors, then handle the leftovers manually.</li>
<li><strong>Reconcile each account in its own currency.</strong> Match every statement line to a Xero transaction; investigate anything unmatched before moving on.</li>
<li><strong>Review FX gains and losses.</strong> Check the foreign currency gain/loss account for the month &mdash; large swings usually mean a misdated transaction, not a market move.</li>
<li><strong>Lock the period.</strong> Once both accounts reconcile to the penny, lock the month so nothing shifts underneath your reports.</li>
</ol>
<p>Freelancers with a simpler setup can compress this: one euro account, one monthly import, fifteen minutes of reconciliation. The discipline that matters is the same &mdash; same day each month, every statement line matched, period locked. Consistency beats complexity in bookkeeping every time.</p>
<h2>Frequently asked questions</h2>
<h3>Can Xero import a UniCredit PDF statement directly?</h3>
<p>No. Xero's statement import accepts CSV (and a few other formats) but not PDF. Convert the UniCredit PDF to CSV first, normalize the European number and date formats, then import the CSV through Accounting &gt; Bank accounts &gt; Manage account &gt; Import a statement.</p>
<h3>How do I fix European number formats like 1.234,56 before importing?</h3>
<p>Convert them to US format (1,234.56) in the CSV before upload. Most converters handle this during export &mdash; check the amount column in a spreadsheet first. If Xero imports an amount a hundred times too large, the decimal mark is the culprit; delete the import, fix the format, and re-import.</p>
<h3>Do I really need a separate euro bank account in Xero?</h3>
<p>Yes. Xero requires each bank account to have one currency. Create your UniCredit account in Xero denominated in EUR, import euro statements there, and reconcile in euros. Xero translates everything to USD for your home-currency reports automatically.</p>
<h3>What should I do with SEPA descriptions I cannot identify?</h3>
<p>Do not guess. Leave the description as-is, reconcile the amount against your invoices or contracts, and add a note in Xero. If it is a client payment, match it to the invoice; if it is truly unknown, flag it for follow-up rather than booking it to the wrong account. An honest question mark is cheaper than a misclassified transaction.</p>
<p>Stop retyping euro transactions by hand. <a href="/">Convert Statement</a> turns your UniCredit PDF into a Xero-ready CSV in seconds &mdash; free for the first 8 pages, no install needed &mdash; so you can import, reconcile, and close the month while the coffee is still warm.</p>`,
  featureImage: "/blog/unicredit-import-to-xero.jpg",
  author: "James Park",
  tags: ["unicredit", "xero", "multi-currency accounting", "european banking"],
  published: true,
  createdAt: "2026-10-16T06:30:00Z",
  updatedAt: "2026-10-16T06:30:00Z",
};
