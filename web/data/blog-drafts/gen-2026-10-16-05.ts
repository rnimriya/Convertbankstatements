import { BlogPost } from "../../lib/blog/types";

/**
 * DAILY BLOG DRAFT — gen-2026-10-16-05
 * Bank: Intesa Sanpaolo | Angle: import bank statements to Xero
 * Author: David Chen, CPA
 */
export const post: BlogPost = {
  id: "gen-2026-10-16-05",
  slug: "intesa-sanpaolo-import-to-xero",
  title: "Import Intesa Sanpaolo Statement PDF to Xero Quickly",
  excerpt:
    "Move Intesa Sanpaolo euro statements into Xero fast: download the PDF, convert to a Xero-ready CSV, import it, and match wire transfers to trade invoices.",
  featureImage: "/blog/intesa-sanpaolo-import-to-xero.jpg",
  author: "David Chen, CPA",
  tags: ["intesa sanpaolo", "xero", "how-to", "international trade"],
  published: true,
  createdAt: "2026-10-16T06:30:00Z",
  updatedAt: "2026-10-16T06:30:00Z",
  content: `<p>If your US business buys from or sells to Italian partners, an Intesa Sanpaolo euro account probably sits at the heart of your payment flow. The ability to import Intesa Sanpaolo statement PDF to Xero turns those euro-denominated wire transfers, supplier payments, and settlement credits into books your accountant can actually use — without retyping a single line by hand.</p>
<p>This walkthrough is written for US trade businesses and the bookkeepers who serve them: wine importers paying Tuscan wineries, fashion buyers settling invoices with Milan suppliers, and machinery exporters collecting from Italian distributors. You will download the right statement from Intesa's online banking, convert it to a Xero-ready CSV, import it through Xero's bank-account tools, and match every wire to the correct trade invoice.</p>
<h2>Why US trade businesses bank with Intesa Sanpaolo</h2>
<p>Italy's largest bank is the natural choice when your supply chain runs through Italy. An Intesa Sanpaolo euro account lets US importers pay Italian suppliers in euros without routing every transfer through a US correspondent bank, which keeps settlement fast and predictable. For exporters, receiving euro payments directly into an Intesa account avoids the cost of forced conversion on arrival.</p>
<p>A wine importer in New Jersey wiring funds to a Barolo producer, an apparel buyer in Los Angeles settling a Milan fabric invoice, or a Chicago equipment maker collecting from a distributor in Turin all generate the same bookkeeping headache: monthly statements packed with international wires, each one tied to a specific purchase order or sales invoice. Xero handles multi-currency accounts well, but only if the transaction data gets in cleanly. That is what the workflow below solves. If you want the background on our converter first, see our <a href="/banks/intesa-sanpaolo">Intesa Sanpaolo statement converter page</a>.</p>
<h2>Step 1 — download your Intesa Sanpaolo PDF statement</h2>
<p>Start in Intesa's online banking — many business clients use the Inbiz portal — and open your euro account's statement archive. Select the full month you need and download the PDF version. Do not use a print-to-PDF from the on-screen transaction list, which often drops columns or splits rows across pages.</p>
<p>Check two things before you go further. First, confirm the file is the bank's native PDF rather than a scan; native PDFs carry real text that converters read with near-perfect accuracy. Second, see whether the file is password-protected. Italian banks commonly lock statements, and a locked file needs its password entered at conversion time so the tool can read the tables. The password is used only to decrypt the file in memory — it is never stored.</p>
<p>One more tip: download the complete monthly statement instead of a custom date range whenever you can. Full statements include opening and closing balances, which you will use to verify the conversion in the next step.</p>
<figure><img src="/blog/intesa-sanpaolo-import-to-xero-inline-1.jpg" alt="Hands sorting printed Intesa Sanpaolo bank statements at a desk before converting them for Xero" width="1200" height="800" loading="lazy" /><figcaption>Sort and check your Intesa Sanpaolo PDFs before converting — native PDFs convert most accurately.</figcaption></figure>
<h2>Step 2 — convert the PDF to a Xero-ready CSV</h2>
<p>Xero imports bank statements from CSV files, so the conversion step is where the real time savings happen. <a href="/">Convert Statement</a> turns your Intesa Sanpaolo PDF into a clean CSV in seconds: upload the file, and the tool reads the statement's underlying table structure — dates, descriptions, debits, credits, and running balances — and rebuilds it as spreadsheet columns. It is free for your first 8 pages, which covers most monthly statements.</p>
<p>Euro amounts land in the CSV exactly as the bank printed them, so do not pre-convert anything to dollars. Xero's multi-currency account applies exchange rates itself during import and reconciliation. Before moving on, run the thirty-second sanity check: compare the opening and closing balances in the CSV against the PDF. If both match, every row between them converted correctly. For a deeper look at formats, see our <a href="/guides/convert-bank-statement-to-csv">guide to converting bank statements to CSV</a>.</p>
<p>Watch for one quirk of international statements: long wire references sometimes wrap across two lines in the PDF. A good converter stitches them back together, but if a row shows a blank description, glance at the PDF to confirm it belongs to the transfer above it.</p>
<h2>Step 3 — import the statement into Xero</h2>
<p>With your CSV ready, open Xero and go to Accounting, then Bank accounts. Find your Intesa Sanpaolo euro account, click Manage account, and choose Import a statement. Select your CSV file and Xero will walk you through column mapping.</p>
<p>This is the step where Italian statements trip up the unprepared: date formats. Intesa prints dates in European order (day/month/year), while many US bookkeepers expect month/day/year. During the import wizard, choose the date format that matches your file — picking the wrong one shifts every transaction to a nonsense date, so double-check the first three rows before confirming. Then map the columns: Date, Description, and Amount (or separate Debit and Credit columns if your CSV split them). Click import and Xero loads the transactions into the account's bank-statement lines, ready for matching.</p>
<h2>Step 4 — match wire transfers to trade invoices in Xero</h2>
<p>Now the part that actually pays for the effort. Xero scans your open sales and purchase invoices and suggests matches for each imported line. A 12,400 euro wire to a Tuscan winery should line up with the purchase invoice for that shipment; a 48,000 euro receipt from a Turin distributor should match the sales invoice you issued. Click OK on the correct suggestion and the invoice is marked paid — no manual journal entry needed.</p>
<p>Trade payments rarely match to the penny, so expect to handle the exceptions:</p>
<ul>
<li><strong>Partial payments:</strong> when a wire covers half an invoice, use Xero's split option and match the amount that actually arrived.</li>
<li><strong>Bank fees:</strong> incoming and outgoing wires often carry small fees. Record these as a separate spend-money line to a bank-fees account rather than fudging the invoice amount.</li>
<li><strong>Overpayments and short payments:</strong> apply the difference as a credit or overpayment on the contact record, not as a plug to revenue.</li>
</ul>
<p>When every line is matched or coded, reconcile the account. A clean reconciliation report at month end is exactly what your CPA wants to see. The process is the same one UK businesses use with their own banks — see <a href="/blog/natwest-import-to-xero">how a NatWest statement moves into Xero</a> for a second example of the matching workflow.</p>
<figure><img src="/blog/intesa-sanpaolo-import-to-xero-inline-2.jpg" alt="Accountant matching Intesa Sanpaolo wire transfers to trade invoices at a desk" width="1200" height="800" loading="lazy" /><figcaption>Match each imported wire to its trade invoice inside Xero's bank reconciliation screen.</figcaption></figure>
<h2>Keeping clean books across trade cycles</h2>
<p>Import cycles get easier when you treat them as a monthly routine rather than a quarterly rescue mission. Import each month's statement within a few days of month end, while the invoices and shipping documents are still fresh in everyone's mind. Your future self, staring down a December close with four months of unmatched wires, will be grateful.</p>
<p>Multi-currency deserves a standing appointment too. Xero revalues your euro account at current rates and books the difference as an unrealized gain or loss, which is correct — but review the realized foreign-exchange lines when wires settle, especially if the euro moved sharply between invoice date and payment date. Big swings can distort a month's margin if nobody looks.</p>
<p>Finally, keep a simple naming habit for contacts. Italian supplier names appear in wires with abbreviations, missing vowels, and truncated suffixes. Standardize each contact in Xero once — "Cantina Rossi SRL" rather than the three variants the bank prints — and future matching becomes nearly automatic.</p>
<h2>Frequently asked questions</h2>
<p><strong>Can Xero import a CSV converted from an Intesa Sanpaolo PDF?</strong><br />Yes. Xero's statement import accepts CSV files from any bank as long as the columns are clean — date, description, and amount. Converting the PDF with a statement converter first gives you exactly that format, including euro amounts and European date ordering.</p>
<p><strong>My Intesa statement uses European date formats. Will that break the import?</strong><br />Not if you select the right format during Xero's import wizard. Choose day/month/year to match the Italian layout, and verify the first few rows before confirming. Picking the US order by mistake is the most common cause of scrambled transaction dates.</p>
<p><strong>Should I convert euro amounts to dollars before importing?</strong><br />No — import the euro values as they are. Xero's multi-currency bank account stores the original euro amounts and converts for reporting using its own exchange rates. Converting beforehand would destroy the audit trail and double-count currency gains or losses.</p>
<p><strong>Is it safe to upload my Intesa Sanpaolo statement to a converter?</strong><br />Files are processed in memory and deleted immediately after conversion — nothing is stored on disk or in a database. Your first 8 pages are free with no credit card required, so a typical monthly statement costs nothing to try.</p>
<p><strong>Can I do this every month, or is it a one-time setup?</strong><br />Monthly is the ideal rhythm. The download-convert-import-match cycle takes about ten minutes once you have done it twice, and staying current means every wire is matched to its invoice while the paperwork is still on your desk.</p>
<p>Ready to stop retyping euro wires by hand? <a href="/pricing">See plans on our pricing page</a> — your first 8 pages are free, and most trade businesses convert a full month of Intesa Sanpaolo statements in under a minute.</p>`,
};
