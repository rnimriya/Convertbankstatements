/**
 * Simple-English copy for convertstatement.in tool pages (owner order
 * 2026-11-27: "Website ka pura content indian audience ke hisab se kr
 * do, easy word, easy to understand, no heavy word").
 *
 * Short sentences, common words only. Every fact is the same as the
 * shared (.online) copy — file limits, placeholder account fields, no
 * invented balances, real format behaviour. Used ONLY when
 * isIndiaSite() (see ToolPageLayout); .online copy is untouched.
 */

export interface IndiaToolCopy {
  subtitle: string;
  howToSteps: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
}

/** Simple one-line descriptions for the tool cards on the .in
    homepage and tools index (keyed by href). */
export const INDIA_TOOL_DESCS: Record<string, string> = {
  "/tools/csv-to-ofx": "Change a spreadsheet of transactions into an OFX file — the format banks and finance apps use.",
  "/tools/csv-to-qfx": "Make a QFX file from CSV rows. QFX is Quicken's version of OFX, ready to import.",
  "/tools/csv-to-qif": "Change CSV transactions into a QIF file for older Quicken and old apps.",
  "/tools/ofx-to-csv": "Read a bank OFX file as a clean CSV — one row for every transaction.",
  "/tools/ofx-to-qfx": "Change an OFX file into QFX for Quicken. Your bank details stay in the file.",
  "/tools/ofx-to-pdf": "Make a neat PDF from an OFX statement. You can print it, file it or share it.",
  "/tools/qfx-to-csv": "Open a Quicken QFX file as a spreadsheet — every transaction in its own row.",
  "/tools/qfx-to-excel": "Change a QFX file into an Excel file you can sort and filter.",
  "/tools/qfx-to-ofx": "Change Quicken's QFX back into plain OFX for other finance software.",
  "/tools/qfx-to-pdf": "Make a clean PDF statement from a QFX file, for your records.",
  "/tools/qfx-to-qif": "Change QFX transactions into old QIF format for older apps.",
  "/tools/qif-to-csv": "Bring old QIF data into a clean CSV spreadsheet.",
  "/tools/qif-to-excel": "Change a QIF file into an Excel file you can sort and filter.",
  "/tools/qif-to-pdf": "Make a readable PDF statement from a QIF file. Print it or share it.",
  "/tools/1099-checker": "See how much you paid each vendor this year, and who crosses the limit you set.",
};

export const INDIA_TOOL_COPY: Record<string, IndiaToolCopy> = {
  "/tools/csv-to-ofx": {
    subtitle:
      "Change your bank CSV file into an OFX file that finance and accounting apps can import. Dates, descriptions and amounts stay the same. Fully free, no account needed.",
    howToSteps: [
      { title: "Download the CSV from your bank", body: "Download the dates you need as a CSV file. Keep the first row with the column names — the converter reads Date, Description and Amount (or Debit and Credit) from it." },
      { title: "Upload it here", body: "Drop the .csv file in the box above. One file at a time, up to 10 MB. No account needed. Your file is never stored." },
      { title: "Convert to OFX", body: "Press Convert to OFX. Every row becomes one OFX transaction with its date, description, amount and a transaction ID made by the tool." },
      { title: "Download and import the OFX", body: "The .ofx file downloads on its own. Check the number of transactions shown, then import the file in the app that asked for OFX." },
    ],
    faqs: [
      {
        q: "How do I convert a CSV file to OFX?",
        a: "Download a CSV from your bank. The file should have a first row with column names. Drop it in the converter above (one .csv file, up to 10 MB) and press Convert to OFX. The file downloads on its own, and the message tells you how many transactions were converted. It is fully free, needs no account, and your file is never stored.",
      },
      {
        q: "What does my CSV need for the conversion to work?",
        a: "A first row with column names the converter can read: a date column (Date, Posted or Transaction Date), a description column (Description, Payee or Name), and either one Amount column or a Debit and Credit pair. Rows with a date or amount that cannot be read are skipped. So check the converted count against the rows you expected.",
      },
      {
        q: "What is inside the OFX file?",
        a: "A standard OFX 1.02 statement: an account block and one entry for every transaction. Each entry has its type (CREDIT or DEBIT), date, amount, description, memo and a unique transaction ID (FITID). The ID is made from the transaction's own date, description and amount. So if you convert the same CSV again, you get the same IDs — not new duplicates.",
      },
      {
        q: "Does the OFX have my real account number or closing balance?",
        a: "No. A plain CSV does not have these, and the converter does not make them up. The account ID is written as a dummy number (0000000000), and there is no closing balance, because your CSV has none. Your transactions, dates and amounts are fully yours. Only the bank details are general — that is the honest limit of a CSV file.",
      },
      {
        q: "Is OFX the same as QBO or QFX?",
        a: "They are one family. QBO is OFX as QuickBooks uses it. QFX is Quicken's version of the same format. Plain OFX is the general form. Pick OFX when your software asks for OFX by name.",
      },
      {
        q: "Is this converter really free? What happens to my file?",
        a: "Yes — the conversion and the download are fully free. No account needed. Your file is used only to make the OFX. It is never stored, sold or shared.",
      },
    ],
  },
  "/tools/csv-to-qfx": {
    subtitle:
      "Change your bank CSV file into a QFX file that Quicken can import. Same transactions, in Quicken's own format. Fully free, no account needed.",
    howToSteps: [
      { title: "Download the CSV from your bank", body: "Download the dates you need as CSV. Keep the first row with column names — Date, Description and Amount (or Debit and Credit) are what the converter reads." },
      { title: "Upload it here", body: "Drop the .csv file in the box above. One file, up to 10 MB, no account needed. Your file is never stored." },
      { title: "Convert to QFX", body: "Press Convert to QFX. Every row becomes one Quicken transaction with its date, description, amount and a transaction ID made by the tool." },
      { title: "Download and import into Quicken", body: "The .qfx file downloads on its own. Note the transaction count. Then in Quicken, use File → Import → Web Connect (.QFX) File." },
    ],
    faqs: [
      {
        q: "How do I convert a CSV file to QFX?",
        a: "Download a CSV from your bank, with a first row of column names. Drop it in the converter above (one .csv file, up to 10 MB) and press Convert to QFX. The QFX downloads on its own, and the message shows how many transactions were converted. Fully free, no account, and your file is never stored.",
      },
      {
        q: "Why won't Quicken import my bank's CSV directly?",
        a: "Quicken takes bank transactions through Web Connect — that means the QFX file. New Quicken versions do not import a CSV into a bank account. A CSV is a spreadsheet. Quicken is waiting for a statement file. This conversion makes that statement file for you.",
      },
      {
        q: "Will Quicken accept a QFX made from a CSV?",
        a: "The file is a real QFX — OFX 1.02 in Quicken's statement form, one entry per transaction, each with its own transaction ID. One thing a CSV cannot give is your bank's institution ID (INTU.BID). The converter never makes one up, so the file has no bank ID block. Many Quicken imports still work and let you link the transactions to your account. But if Quicken wants a bank-issued file for your bank, only your bank's own QFX download has that ID.",
      },
      {
        q: "What does the QFX contain, exactly?",
        a: "Your transactions and nothing made up. For each row: the date, a CREDIT or DEBIT type from the amount's sign, the amount, your description and memo text, and a transaction ID made by the tool. The account block uses dummy values, because a CSV has no account number. There is no closing balance, because a CSV has none. Amounts are copied exactly — no currency change.",
      },
      {
        q: "Can I convert a credit card CSV for Quicken?",
        a: "You can convert it, but know what comes out. This converter makes a bank account statement, because that is the form the shared engine writes. A card CSV will come out as a bank statement, not a credit card statement. Check how Quicken shows it before you use it for a card account. Keep the original CSV either way.",
      },
      {
        q: "Is this converter free? Is my data stored?",
        a: "Yes, fully free. The conversion and the QFX download cost nothing and need no account. Your file is used only to make the QFX. It is never stored, sold or shared.",
      },
    ],
  },
  "/tools/csv-to-qif": {
    subtitle:
      "Change a spreadsheet of transactions into a QIF file for older apps that still use Quicken's old format. Fully free, no account needed.",
    howToSteps: [
      { title: "Get the CSV you need converted", body: "Download the transactions from your bank or current app as CSV. Keep the first row with column names — Date, Description and Amount (or Debit and Credit)." },
      { title: "Upload it here", body: "Drop the .csv file in the box above. One file, up to 10 MB, no account needed. Your file is never stored." },
      { title: "Convert to QIF", body: "Press Convert to QIF. Every row becomes a QIF record — D date, T amount, P payee, M memo — under a !Type:Bank header." },
      { title: "Download and import once, carefully", body: "Save the .qif file — fully free — and import it into the right account. QIF has no duplicate check, so import each file only once." },
    ],
    faqs: [
      {
        q: "How do I convert a CSV file to QIF?",
        a: "Download a CSV with a first row of column names. Drop it in the converter above (one .csv file, up to 10 MB) and press Convert to QIF. The QIF downloads on its own, and the message shows how many transactions were converted. Fully free, no account, and your file is never stored.",
      },
      {
        q: "What do the letters at the start of each QIF line mean?",
        a: "QIF is plain text. The first letter of each line is a tag. The records made here use D for date, T for amount, P for payee, and M for a memo when your CSV has one. Each record ends with a line that has only ^. The format also has an L tag for category. This converter does not write categories, because a bank CSV does not map to them well. Add categories after import instead.",
      },
      {
        q: "What happens if I import the same QIF file twice?",
        a: "You get every transaction twice. QIF has no transaction IDs and no statement identity. So the receiving software cannot tell that it has seen the file before. There is no duplicate protection at all. Import each converted file once, into the right account. If you convert overlapping dates, you will have to delete the overlap by hand.",
      },
      {
        q: "Which programs still read QIF?",
        a: "Older Quicken versions, from before QIF was replaced by QFX. GnuCash — its QIF import is still a standard way to bring in bank data. And some long-running finance and bookkeeping apps that never moved to OFX. If a program's import menu lists QIF, it is asking for this format. Current Quicken is not one of them — it uses QFX, so use the CSV to QFX converter for Quicken.",
      },
      {
        q: "Why does the file start with !Type:Bank?",
        a: "That first line tells the reader what kind of account the records belong to. This converter writes bank account records, because that is the statement form it builds. A credit card CSV will convert, but it will be marked as a bank account. Check that your software gives you the right account at import. Keep the original CSV as the record of what the data really was.",
      },
      {
        q: "Is this converter free? What happens to my data?",
        a: "Yes — fully free, no account, no paid step behind the download. Your file is used only to make the QIF. It is never stored, sold or shared.",
      },
    ],
  },
  "/tools/ofx-to-csv": {
    subtitle:
      "Change a bank OFX file into a clean CSV spreadsheet — one row for every transaction, with dates, descriptions and amounts. Good for checking, sharing or moving your data. Fully free, no account needed.",
    howToSteps: [
      { title: "Download the OFX from your bank", body: "In your bank's download area, pick the OFX format and the dates you need. Do not pick the PDF statement — that is a different file." },
      { title: "Upload the .ofx file here", body: "Drop it in the box above. One file at a time, up to 10 MB. No account, and no columns to set up." },
      { title: "Press Convert to CSV", body: "The converter reads the transactions inside the OFX and writes one CSV row for each, in the order the file gives them." },
      { title: "Check the count, then open the CSV", body: "The result shows how many transactions were converted. Open the download in your spreadsheet. Check that count and the Amount total before you use it." },
    ],
    faqs: [
      {
        q: "How do I open an OFX file without QuickBooks or Quicken?",
        a: "Convert it here. Upload the .ofx, press Convert to CSV, and open the download in Excel, Google Sheets or LibreOffice. You get one row per transaction instead of tagged text. No accounting software is needed at any step.",
      },
      {
        q: "What columns does the CSV have?",
        a: "Five, in this order: Date (in yyyy-mm-dd form), Type (the type as written in the file, like DEBIT or CREDIT), Description, Amount (with sign, to two decimal places) and Transaction ID (the FITID from the source file — blank only when the file had none).",
      },
      {
        q: "Does the CSV include my account number or closing balance?",
        a: "No. Account number, bank name, statement period and closing balance sit in the OFX wrapper, not in the transaction list. This CSV is the transaction list only. If you need the closing balance, read it from the original OFX. It is never copied into the spreadsheet and never made up.",
      },
      {
        q: "Why did Excel turn my Transaction IDs into numbers like 2.02611E+11?",
        a: "Excel guesses cell types when it opens a CSV, and a long ID looks like a number to it. Use Data → From Text/CSV and set the Transaction ID column to Text before loading. Or open the file in Google Sheets. The ID in the CSV itself is unchanged — only Excel's display of it went wrong.",
      },
      {
        q: "How many transactions can one OFX file hold here?",
        a: "The reader takes up to 500 transactions from one file, and the file can be up to 10 MB. For a longer period, download the OFX from your bank in smaller parts — a quarter at a time, say. Convert each one and join the CSVs in your spreadsheet.",
      },
      {
        q: "Is this converter free? Is my file stored?",
        a: "Yes, fully free with no account, and no paid step behind the download. Your file is used only to make the CSV. It is never stored afterwards.",
      },
    ],
  },
  "/tools/ofx-to-qfx": {
    subtitle:
      "Change a bank OFX file into Quicken's QFX format — same transactions, same structure, and your bank details from the file are carried over. Fully free, no account needed.",
    howToSteps: [
      { title: "Download the OFX from your bank", body: "Use the OFX option in your bank's export area, for the account and period you need in Quicken." },
      { title: "Upload the .ofx file here", body: "Drop it in the box above. One file, up to 10 MB, no account needed." },
      { title: "Press Convert to QFX", body: "The statement is rebuilt in clean OFX 1.02 form: transactions in date order, full timestamps, and the source file's account number, institution ID and closing balance carried over when they are present." },
      { title: "Import the .qfx in Quicken", body: "In Quicken, use the import for bank statement files. Open the downloaded .qfx and check that it is linked to the account the statement belongs to." },
    ],
    faqs: [
      {
        q: "Can I just rename my .ofx file to .qfx?",
        a: "Renaming changes nothing inside the file. This converter rebuilds the contents as a clean OFX 1.02 statement — full timestamps, transactions in date order, account number and closing balance carried over when the source has them — and then gives it the .qfx name Quicken asks for. A renamed file keeps the shape, order and short dates your bank wrote.",
      },
      {
        q: "Does this converter add my bank's INTU.BID if the OFX does not have one?",
        a: "No. If your OFX has an institution ID — an INTU.BID tag or an FID in its FI block — that value is kept and written into the QFX. If it has none, the QFX has none either. A made-up ID can point Quicken at the wrong bank, so we never invent one.",
      },
      {
        q: "Does the closing balance carry over to the QFX?",
        a: "Yes, when the source OFX has a ledger balance. The same amount and its date are written into the new file, so Quicken gets the same balance target your bank stated. If the source has no ledger balance, the output has none. A balance is never made up.",
      },
      {
        q: "Quicken still says it cannot verify my financial institution. Why?",
        a: "That message is about the institution ID, not your transactions. It usually means the original OFX had no ID for Quicken to check, and this converter does not make one up. Download the QFX directly from your bank if it offers one for Quicken. A bank-issued QFX carries the bank's registered ID.",
      },
      {
        q: "Can I convert a credit card OFX for a Quicken card account?",
        a: "Be careful here. The rebuilt file is written as a bank statement for a checking account, whatever the source said. So it suits bank accounts. Importing it into a Quicken credit card account asks Quicken to treat card activity as a checking account. Use your card issuer's own Quicken download for card accounts instead.",
      },
      {
        q: "Is this converter free? Is my file stored?",
        a: "Yes, fully free with no account. Your file is used only to make the QFX. It is never stored afterwards.",
      },
    ],
  },
  "/tools/ofx-to-pdf": {
    subtitle:
      "Change a bank OFX file into a readable PDF statement you can print — for your records, for sharing, or for approval. It is not made for importing. Fully free, no account needed.",
    howToSteps: [
      { title: "Get the OFX for the period you need to show", body: "Download it from your bank, or use the OFX file already in your records for that account and period." },
      { title: "Upload the .ofx file here", body: "Drop it in the box above. One file, up to 10 MB, no account needed." },
      { title: "Press Convert to PDF", body: "The transactions are laid out as a Letter-size document: date, description and amount on each line. Total in, Total out and Net are calculated at the end." },
      { title: "File the PDF with the original OFX", body: "Save both together. The PDF is the copy people read, print and approve. The OFX stays as the source that holds the account details and closing balance." },
    ],
    faqs: [
      {
        q: "What exactly appears in the PDF?",
        a: "A title made from your source file's name. Then one line per transaction with three columns — Date, Description and Amount — in the order the OFX gives them. At the end there are three totals made from those rows: Total in, Total out and Net. Every page has a ConvertStatement footer and a page number. Nothing else is added.",
      },
      {
        q: "Does the PDF show my closing balance or account number?",
        a: "No. The PDF does not print the account number, the bank name or the closing balance from the OFX, even when the source file has them. Its totals are sums of the converted transactions, not the bank's stated balance. Keep the original OFX with the PDF whenever the balance itself is part of the proof.",
      },
      {
        q: "Is this PDF an official bank statement?",
        a: "No. It is a readable copy of your OFX download, made by this converter. The title and footer say so on the page. That is fine for client files, internal approvals and your own records. A lender, auditor or agency that asks for a bank-issued statement needs the statement your bank itself issued — not a conversion.",
      },
      {
        q: "Can I import the PDF back into QuickBooks or a spreadsheet?",
        a: "Not in a useful way. A PDF is the end of the data journey — a document for people, not a format software imports. Keep your OFX for importing. If you need the same transactions as data, convert the OFX to CSV instead of trying to take them back out of the PDF.",
      },
      {
        q: "Why is a long description cut off with an ellipsis?",
        a: "Each transaction gets one printed line. A description wider than its column is shortened with an ellipsis so the Amount column stays in line and readable. The full name stays in your source OFX. Only the printed copy is trimmed.",
      },
      {
        q: "Is this converter free? Is my file stored?",
        a: "Yes, fully free with no account. Your file is used only to make the PDF. It is never stored afterwards.",
      },
    ],
  },
  "/tools/qfx-to-csv": {
    subtitle:
      "Change a Quicken QFX download into a clean CSV spreadsheet — one row for every transaction. Good for checking, sharing, or moving away from Quicken. Fully free, no account needed.",
    howToSteps: [
      { title: "Find the QFX download", body: "Use the Quicken-format file from your bank's download page, or the .qfx already saved from your Quicken years." },
      { title: "Upload the .qfx file here", body: "Drop it in the box above. One file, up to 10 MB. No account and no Quicken needed." },
      { title: "Press Convert to CSV", body: "Every transaction in the QFX becomes one row — date, type, description, amount and transaction ID — in the order the file gives them." },
      { title: "Open the CSV and check the count", body: "The result shows how many transactions were converted. Open the download in your spreadsheet. Check the row count and the Amount total before you share or import it." },
    ],
    faqs: [
      {
        q: "How do I open a QFX file if I do not have Quicken?",
        a: "Convert it here and open the CSV. A QFX is a tagged OFX-family document. Windows and macOS have no built-in reader for it. As a CSV it opens in Excel, Google Sheets or LibreOffice, one row per transaction. You never need Quicken installed.",
      },
      {
        q: "What columns does the CSV have?",
        a: "Five, in this order: Date (yyyy-mm-dd), Type (the transaction type as written in the file, like DEBIT or CREDIT), Description, Amount (with sign, to two decimal places) and Transaction ID (the FITID from the QFX — blank only when the transaction had none).",
      },
      {
        q: "Does the CSV include the account number, bank name or closing balance?",
        a: "No. Those sit in the QFX wrapper around the transactions, and the CSV is the transactions only. Keep the original QFX with the spreadsheet whenever the closing balance or account details might be questioned later.",
      },
      {
        q: "Can I turn the CSV back into a QFX later?",
        a: "A spreadsheet can be rebuilt into a QFX with the CSV to QFX converter. But treat the trip as one-way for identity: the CSV has no account number or institution ID. So a rebuilt file cannot get back the bank identity the original QFX carried. Keep the original if Quicken might need it again.",
      },
      {
        q: "Why are there two rows that look exactly the same?",
        a: "Usually because two bank downloads overlapped, and both copies were converted and joined. The spreadsheet holds what it was given — twice. Sort by Transaction ID: rows with the same ID are the same bank transaction appearing twice. Two rows with different IDs, the same amount and the same description may be a real repeat purchase. Check the IDs before deleting anything.",
      },
      {
        q: "Is this converter free? Is my file stored?",
        a: "Yes, fully free with no account. Your file is used only to make the CSV. It is never stored afterwards.",
      },
    ],
  },
  "/tools/qfx-to-excel": {
    subtitle:
      "Change a Quicken QFX download into a formatted Excel file — one row for every transaction, ready to sort, filter and add notes. Fully free, no account needed.",
    howToSteps: [
      { title: "Get the QFX from your bank or archive", body: "Use the Quicken-format download for the account and period you need to work on in Excel." },
      { title: "Upload the .qfx file here", body: "Drop it in the box above. One file, up to 10 MB. No account and no Quicken needed." },
      { title: "Press Convert to Excel", body: "The transactions are written into a workbook with a sheet named Transactions: five columns, amounts stored as numbers, dates in ISO text form." },
      { title: "Open it and check the total", body: "Add up the Amount column in Excel. Compare a few rows against the bank statement or Quicken register before you sort, filter or add notes." },
    ],
    faqs: [
      {
        q: "Are the amounts in the workbook real numbers I can sum?",
        a: "Yes. Amount is stored in the workbook as a number, not as text. So SUM, filters and totals work on it at once. Money out is negative and money in is positive, exactly as the QFX recorded it. That is the main practical difference from opening a raw CSV, where your spreadsheet has to guess each cell's type.",
      },
      {
        q: "Are the dates real Excel dates?",
        a: "Honestly, no — and for most uses it does not matter. Dates are written as yyyy-mm-dd text, the same ISO form as the CSV version. Text in that form sorts in date order, filters cleanly and reads clearly. If you need true Excel date values for date sums or month grouping, add a helper column that converts the text with DATEVALUE. Keep the original column as the record of what the file stated.",
      },
      {
        q: "What does the workbook contain, exactly?",
        a: "One sheet named Transactions, with five columns — Date, Type, Description, Amount and Transaction ID — and one row per transaction, in the order the QFX gives them. Column widths are set for those contents. There is no second sheet for account details or balances, because the workbook is the transaction list only.",
      },
      {
        q: "Does the workbook include the closing balance?",
        a: "No. The closing balance sits in the QFX wrapper, not in its transaction list, and this workbook holds the transactions. Adding up Amount gives you the net movement across the rows converted. That is useful, but it is not the bank's stated balance, and the workbook does not pretend otherwise.",
      },
      {
        q: "Can I edit the workbook and convert it back to QFX?",
        a: "You can edit it freely — it is a normal .xlsx workbook. To go back toward Quicken, save a CSV copy from Excel and use the CSV to QFX converter. Know the limit first: the workbook has no account number or institution ID. So a rebuilt QFX cannot get back the bank identity the original carried. Keep the original QFX untouched.",
      },
      {
        q: "Is this converter free? Is my file stored?",
        a: "Yes, fully free with no account. Your file is used only to make the workbook. It is never stored afterwards.",
      },
    ],
  },
  "/tools/qfx-to-ofx": {
    subtitle:
      "Change a Quicken QFX file back into plain OFX — the standard form other finance apps import. Your bank details from the file are kept. Fully free, no account needed.",
    howToSteps: [
      { title: "Take the QFX your bank or Quicken gave you", body: "Use the Quicken-format download for the account and period your other software needs." },
      { title: "Upload the .qfx file here", body: "Drop it in the box above. One file, up to 10 MB, no account needed." },
      { title: "Press Convert to OFX", body: "The statement is rebuilt as a clean OFX 1.02 file: date order, full timestamps, and the source file's account number, institution identity and closing balance carried over when they are present." },
      { title: "Import the .ofx into your other software", body: "Use that program's OFX or bank-statement import. When it asks, match the statement to the existing account for the account number the file carries." },
    ],
    faqs: [
      {
        q: "What is the difference between QFX and OFX?",
        a: "OFX — Open Financial Exchange — is the general standard banks and finance software use to exchange statements. QFX is Quicken's version of that same structure. It carries an Intuit institution identity that Quicken uses to tie the file to a bank. The transaction content is the same family of data. The version decides which programs accept the file by name.",
      },
      {
        q: "Does converting remove the Quicken institution ID from the file?",
        a: "No, and this page will not pretend otherwise. The rebuilt OFX keeps the source file's account number. And when the QFX carries an institution ID, that identity is written into the output as an FI block. What changes is the form: a clean OFX 1.02 statement with a .ofx name, transactions in date order and full timestamps. If your target software rejects files with an institution block, this conversion does not remove it. That is a different edit.",
      },
      {
        q: "Does the account number and closing balance carry over?",
        a: "Yes to both, on the same condition: they are carried over when the source QFX states them. The account number is written into the OFX so an importer can match the statement to the account you already have set up. A stated ledger balance is written with its date. Neither is ever made up when the source leaves it out.",
      },
      {
        q: "Will other finance software definitely import the result?",
        a: "Software that imports OFX 1.02 bank statements gets a file in exactly that form — the widest-read version of the standard. No converter can promise a particular app's importer will accept it, because programs differ in how strictly they read the format. But converting to the general standard removes the Quicken-version objection, which is the one this page can honestly remove.",
      },
      {
        q: "Can I just rename the .qfx file to .ofx?",
        a: "You can, and some easy-going importers will read the result, because the structure is one family. What renaming cannot do is rebuild the statement: order, date precision and header shape all stay as Quicken's exporter wrote them. This converter rebuilds the contents into a clean OFX 1.02 statement and then names it .ofx.",
      },
      {
        q: "Is this converter free? Is my file stored?",
        a: "Yes, fully free with no account. Your file is used only to make the OFX. It is never stored afterwards.",
      },
    ],
  },
  "/tools/qfx-to-pdf": {
    subtitle:
      "Make a readable PDF statement from a Quicken QFX download — for your records, for sharing, or for expense approval. Fully free, no account needed.",
    howToSteps: [
      { title: "Download the QFX from your bank", body: "In your bank's portal, choose the Quicken or Web Connect download for the account and dates you need. Save the .qfx file it gives you." },
      { title: "Upload it here", body: "Drop the .qfx file in the box above. One file, up to 10 MB, no account needed." },
      { title: "Convert to PDF", body: "Press Convert to PDF. The transactions are read out of the QFX and laid out as Date, Description and Amount lines. Total in, Total out and Net are added at the end." },
      { title: "Check the count, then file it", body: "The result shows how many transactions were converted. Open the PDF and check that the period and totals look right. Then print it or attach it where it is needed." },
    ],
    faqs: [
      {
        q: "What exactly appears in the PDF?",
        a: "Three columns — Date, Description and Amount — one line for every transaction in the QFX, on Letter-size pages. At the end the PDF adds three totals made from those lines: Total in, Total out and Net. It does not show your account number, bank name or a closing balance, even if the QFX carries them.",
      },
      {
        q: "Can I send this PDF to a lender or auditor instead of a bank statement?",
        a: "You can send it as a readable record of the transactions in your download. Lenders and auditors often work from documents like it. But be clear about what it is: a copy of a QFX file, not a statement issued by your bank. It has no bank letterhead, account number or official balance. If the request asks for an official statement, get that from the bank.",
      },
      {
        q: "Will the amounts in the PDF match my QFX exactly?",
        a: "Yes. Amounts are copied with no currency change and no rounding beyond the two decimal places already in the file. Money in and money out keep their signs. The Total in, Total out and Net lines at the end are sums of those same amounts, so you can check them against the lines above.",
      },
      {
        q: "My PDF is missing transactions I can see in Quicken. Why?",
        a: "The PDF can only show what is inside the QFX file you uploaded. If Quicken shows a longer history than the download covers, the bank exported a shorter date range than you expected. Download the QFX again for the full period and convert that file. If the file is not really an OFX-family file, the converter says so instead of making an empty PDF.",
      },
      {
        q: "Can someone import this PDF back into Quicken or QuickBooks?",
        a: "No. The PDF is a fixed document for reading, printing and filing. It has no transaction IDs or import structure. Keep the original QFX beside it: the QFX is still the file Quicken reads, and it is the file you would convert onward to a spreadsheet or to QuickBooks.",
      },
      {
        q: "Is this converter really free? Is my file stored?",
        a: "Yes — the conversion is fully free with no account, for files up to 10 MB. Your file is used only to make the PDF. It is never stored, and we never sell or share your financial data.",
      },
    ],
  },
  "/tools/qfx-to-qif": {
    subtitle:
      "Change a Quicken QFX download into the old QIF format, for older apps that still import it. Fully free, no account needed.",
    howToSteps: [
      { title: "Get your QFX file", body: "Use the Quicken (.qfx) download from your bank, for the account and period the older app needs. Convert one statement period at a time." },
      { title: "Upload it here", body: "Drop the .qfx file in the box above. One file, up to 10 MB, no account needed." },
      { title: "Convert to QIF", body: "Press Convert to QIF. Every transaction is rewritten as a QIF record — D date, T amount, P payee, closed by a ^ line — under a !Type:Bank header." },
      { title: "Import it once, into the old app", body: "Save the .qif file and import it into the older app a single time. QIF has no duplicate check. So do not re-import the same file to fix a mistake — delete the bad import first." },
    ],
    faqs: [
      {
        q: "What exactly is lost when a QFX becomes a QIF?",
        a: "Everything except the transaction lines. The QIF made here carries each transaction's date, amount and payee under a !Type:Bank header — and nothing else. The QFX's institution ID (INTU.BID), bank and account details, currency, closing balance and per-transaction IDs (FITIDs) have no place in the output. So none of them cross over.",
      },
      {
        q: "Why does losing the transaction IDs matter?",
        a: "A FITID is how Quicken knows a transaction it has already imported. QIF has no such field. So a QIF file has no duplicate protection: import the same QIF twice into an app that does not check dates and amounts itself, and you can end up with two of everything. Convert only the period you need, and import each converted file once.",
      },
      {
        q: "Can current Quicken import the QIF I get here?",
        a: "Current Quicken is built around QFX for bank accounts. QIF import into bank accounts has been restricted since Intuit moved Quicken to QFX in the mid-2000s. Keep your original QFX for Quicken itself. This conversion is for older Quicken versions, GnuCash-style work, and specialist apps that still ask for QIF by name.",
      },
      {
        q: "Do memos and check numbers survive?",
        a: "In this direction there is nothing to survive. The QFX reading used here takes each transaction's date, type, name and amount. It does not carry a separate memo or check number into the conversion. So the QIF records hold date, amount and payee only, each closed by a ^ line — which is what QIF-importing apps expect to read.",
      },
      {
        q: "Are amounts or dates changed during conversion?",
        a: "No. Amounts are copied exactly, to two decimal places, with money out negative. Dates are written in QIF's MM/DD/YYYY form, converted from the dates in the QFX. No currency change is applied. Note that QIF records carry no currency mark, so the receiving app will assume its own default currency.",
      },
      {
        q: "Is this converter really free? Is my file stored?",
        a: "Yes — fully free with no account, for files up to 10 MB. Your file is used only to make the QIF. It is never stored, and we never sell or share your financial data.",
      },
    ],
  },
  "/tools/qif-to-csv": {
    subtitle:
      "Bring old Quicken QIF data into a clean CSV spreadsheet — one row for every transaction — that any modern tool can read. Fully free, no account needed.",
    howToSteps: [
      { title: "Find or export the QIF", body: "Use the .qif you already have, or export a Bank, CCard or Cash QIF from the old Quicken or app. Investment QIF files are not supported." },
      { title: "Look at the D lines first", body: "Open the file as text. Dates with four-digit years convert as written. But two-digit years are read as 2000s years. If your history is older, expand the years to four digits in the text before converting." },
      { title: "Upload and convert to CSV", body: "Drop the .qif in the box above and press Convert to CSV. Every readable record becomes one row — Date, Type, Description, Amount, Transaction ID — with the ID left blank, because QIF carries none." },
      { title: "Open, count and keep the original", body: "Open the CSV in any spreadsheet app. Check the row count and a few amounts against the old records. Keep the untouched QIF beside it — it still holds the categories and splits the CSV does not." },
    ],
    faqs: [
      {
        q: "What do the QIF field tags mean — D, T, P, L and the rest?",
        a: "Each QIF record is a stack of one-letter lines. D is the date, T is the amount, P is the payee, M is a memo, N is a check number and L is the category. A line with only ^ ends the record. This converter reads D, T, P, M and N. The CSV it writes keeps only the date, a CREDIT or DEBIT type, the payee as the description, and the amount. So the L category and the M and N details do not appear in the spreadsheet.",
      },
      {
        q: "Why is the Transaction ID column empty in my CSV?",
        a: "Because QIF has no transaction IDs to fill it with. The CSV uses the shared statement layout — Date, Type, Description, Amount, Transaction ID. For a QIF source the ID is honestly blank rather than made up. One result: a CSV has no duplicate protection either. So importing the same sheet twice into another app can duplicate rows.",
      },
      {
        q: "My dates came out in the wrong century. What happened?",
        a: "Your QIF almost certainly uses two-digit years. The reader takes a two-digit year as a 2000s year. So a record dated 11/02/98 becomes 2098-11-02 in the CSV. Four-digit dates, including Quicken's MM/DD'YYYY apostrophe form, convert as written. Fix the years in the QIF text — expand them to four digits — and convert again.",
      },
      {
        q: "What happens to split transactions and categories?",
        a: "They are left behind, on purpose and visibly. The reader ignores the L category line, the cleared-status line and all split lines (S, E and $). So a split transaction appears in the CSV as a single row at its full T amount. The total is right; the breakdown is not in the sheet. If the splits themselves are what you need, work from the original Quicken data.",
      },
      {
        q: "Can I convert an investment QIF to CSV here?",
        a: "No. Bank, Cash and CCard QIF files are supported. An investment QIF (!Type:Invst) is refused with a message explaining why. Holdings, buys and sells are not simple dated amounts. They would mislead as spreadsheet rows of bank activity.",
      },
      {
        q: "Is this converter really free? Is my file stored?",
        a: "Yes — fully free with no account, for files up to 10 MB. Your file is used only to make the CSV. It is never stored, and we never sell or share your financial data.",
      },
    ],
  },
  "/tools/qif-to-excel": {
    subtitle:
      "Change old Quicken QIF data into a formatted Excel file — one row for every transaction — for checking, sharing and keeping records. Fully free, no account needed.",
    howToSteps: [
      { title: "Find or export the QIF", body: "Use the .qif you already have, or export a Bank, CCard or Cash QIF from the old Quicken or app that holds the records. Investment QIF files are not supported." },
      { title: "Check the years in the source", body: "Open the QIF as text and read the D lines. Four-digit years convert as written. Two-digit years are read as 2000s years. So expand truly old years to four digits before converting." },
      { title: "Upload and convert to Excel", body: "Drop the .qif in the box above and press Convert to Excel. You get an .xlsx workbook with a Transactions sheet — ISO dates and numeric amounts, one row for every readable record." },
      { title: "Clean up in the workbook, keep the QIF safe", body: "Sort, filter and add notes in Excel. Use the row count in the result to confirm nothing readable was left behind. Keep the original QIF untouched as the source of the history." },
    ],
    faqs: [
      {
        q: "What columns does the workbook have? Are they typed?",
        a: "One sheet named Transactions with five columns: Date, Type, Description, Amount and Transaction ID. Dates are written in uniform ISO form (YYYY-MM-DD), which sorts in date order. Amounts are written as real numbers to two decimal places. So Excel filters the rows and sums the Amount column correctly as soon as you open the file. The Transaction ID column is empty for QIF data — QIF carries no IDs, and none are made up.",
      },
      {
        q: "How is this different from the QIF to CSV converter?",
        a: "The rows are the same — same reader, same fields, same things left behind. The difference is the wrapping. CSV is plain text for importing onward. The .xlsx workbook opens formatted for a person, with set column widths and typed values ready for sorting, filtering, pivot tables and notes. Choose CSV for systems, Excel for people.",
      },
      {
        q: "Where did the categories and split transactions go?",
        a: "They were never read into the workbook. The QIF reader keeps each record's date, amount and payee for this output. The category line (L), cleared status and split lines are ignored. The memo and check-number lines have no column here. A split transaction appears once, at its full amount. If your audit turns on categories or splits, work from the original QIF and Quicken. This workbook is a transaction list, not a category ledger.",
      },
      {
        q: "My workbook shows dates in 2098. How do I fix that?",
        a: "Your QIF uses two-digit years, which the reader takes as 2000s years — a 1998 record becomes 2098. Four-digit years, including Quicken's MM/DD'YYYY apostrophe form, convert correctly. Correct the years in the QIF text file and convert again. Then sort the new workbook by Date to confirm the history sits in the century you meant.",
      },
      {
        q: "Can I edit the workbook and still trust it as an audit copy?",
        a: "You can edit it freely — it is an ordinary spreadsheet, and adding notes is a normal audit step. But an edited workbook is a working paper, not proof of the source. Keep the original QIF untouched alongside it. Note your edits in the workbook itself, so anyone reviewing later can trace every changed cell back to the source record.",
      },
      {
        q: "Is this converter really free? Is my file stored?",
        a: "Yes — fully free with no account, for files up to 10 MB. Your file is used only to make the workbook. It is never stored, and we never sell or share your financial data.",
      },
    ],
  },
  "/tools/qif-to-pdf": {
    subtitle:
      "Make a readable PDF statement from old Quicken QIF data — so old history can be kept safely and shared in a fixed form. Fully free, no account needed.",
    howToSteps: [
      { title: "Find or export the QIF", body: "Use the .qif archive you already have, or export a Bank, CCard or Cash QIF from the old Quicken or app. Investment QIF files are not supported." },
      { title: "Check the years before you render", body: "Open the file as text and read the D lines. Four-digit years print as written. But two-digit years are read as 2000s years — a 1998 record becomes 2098. Expand old years in the text first if your archive uses them." },
      { title: "Upload and convert to PDF", body: "Drop the .qif in the box above and press Convert to PDF. Every readable record becomes a Date, Description and Amount line. Total in, Total out and Net are computed at the end." },
      { title: "File the PDF with the QIF", body: "Check the transaction count and the printed period. Then store the PDF as the readable copy alongside the untouched QIF — the PDF for people, the QIF for any future data conversion." },
    ],
    faqs: [
      {
        q: "What exactly appears in the PDF?",
        a: "Three columns — Date, Description and Amount — one line for every readable QIF record, on Letter-size pages. It ends with three totals made from those lines: Total in, Total out and Net. Memos, check numbers and categories from the QIF do not appear. There is no closing balance, because a QIF carries none and the PDF does not invent one.",
      },
      {
        q: "Why do some of my dates show years like 2098?",
        a: "Your QIF uses two-digit years, which the reader takes as 2000s years — a record from 1998 prints as 2098. Four-digit years, including Quicken's MM/DD'YYYY apostrophe form, print as written. Expand the years to four digits in the QIF text and convert again. Check the printed dates on a one-month test file before rendering a whole archive.",
      },
      {
        q: "My split transactions print as single lines. Is that right?",
        a: "For this document, yes. The reader ignores QIF split lines and category lines. So each transaction prints once, at its full amount, with its payee as the description. The PDF is a faithful statement of transactions and totals. If a reader needs the split breakdown or the categories, those live only in the original QIF and in Quicken — not in any rendering of this kind.",
      },
      {
        q: "Can the PDF be imported into QuickBooks or back into Quicken?",
        a: "No. The PDF is the fixed, readable end of the road — for filing, printing and sharing. The data routes stay open through the original QIF, which converts onward to a spreadsheet or to a QuickBooks QBO file. Keep the two together: PDF as the readable copy, QIF as the data.",
      },
      {
        q: "What if my QIF is an investment file?",
        a: "Investment QIF files (!Type:Invst) are not supported. They are refused with a message saying so — holdings and lots cannot be honestly shown as a bank-style statement. Bank, Cash and CCard QIF files convert normally. Export the investment account's cash activity separately if that is the history you need in document form.",
      },
      {
        q: "Is this converter really free? Is my file stored?",
        a: "Yes — fully free with no account, for files up to 10 MB. Your file is used only to make the PDF. It is never stored, and we never sell or share your financial data.",
      },
    ],
  },
  "/tools/1099-checker": {
    subtitle:
      "See what you paid each vendor this year. Upload a bank CSV or QBO file and get payments grouped by vendor — name variants combined, deposits ignored, and vendors at or above your limit highlighted.",
    howToSteps: [
      { title: "Export your payments", body: "Download a bank CSV for the year, or a QBO/OFX file, covering the accounts you pay vendors from." },
      { title: "Upload it here", body: "Drop the file in. Money-out rows are grouped by vendor, with name variants combined into one total per vendor." },
      { title: "Set your limit", body: "The default limit in the tool is $600 and you can change it. Vendors at or above it are highlighted. Confirm the current rules with your tax professional." },
      { title: "Download the report", body: "Save the vendor report CSV for your records. Share it with your bookkeeper or tax professional." },
    ],
    faqs: [
      {
        q: "What does the 1099 vendor checker do?",
        a: "It reads a bank CSV or QBO/OFX file, takes only the money-out rows, and groups them by vendor — total paid across the year, payment count, and last payment date for each. Vendors at or above the limit you set are highlighted. Per-vendor totals are the whole point: the $600 rule is cumulative. So twelve $75 payments to one contractor are a filing question, even though no single payment looks like one. It is an informational report only, not tax filing or advice.",
      },
      {
        q: "What limit should I use?",
        a: "The tool's default is $600 — the well-known Form 1099-NEC limit for payments for services to one vendor in a calendar year. You can change it to any amount. The table and the downloadable report update at once. Run it lower, say $400, to see who is one ordinary job away from crossing next year. Confirm the current rules with your tax professional.",
      },
      {
        q: "Do payments by card or PayPal count toward my 1099-NEC total?",
        a: "Generally no. Payments made by credit or debit card, or through a third-party payment network such as PayPal, are reported by the payment processor on Form 1099-K. You do not also report them on Form 1099-NEC. The checker totals what is in the file you upload. So for a filing-ready list, work from payments made by check, ACH or cash. Let your tax professional make the final call on anything mixed.",
      },
      {
        q: "Are payments to corporations exempt?",
        a: "Generally yes — payments to corporations are the standing exception to 1099-NEC reporting. The exception to the exception is attorneys: fees paid to an attorney or law firm are reportable even when the firm is incorporated. LLCs are not automatically exempt either. How an LLC is taxed (sole proprietor, partnership or corporation) decides — which is one reason the W-9 matters.",
      },
      {
        q: "How are vendor name variants handled?",
        a: "Names are cleaned up before grouping: capitalization and punctuation are ignored, and common entity suffixes such as LLC and Inc, plus trailing store or location numbers, are removed. “ACME LLC”, “Acme, LLC”, and “ACME” therefore total as one vendor instead of three small ones slipping under your limit.",
      },
      {
        q: "Is this tax filing or tax advice?",
        a: "No. This is an informational report only — not tax filing and not tax advice. Limits and rules have real exceptions, and they change. Share the report with your bookkeeper or tax professional. Request a W-9 from any highlighted vendor missing one. Confirm your actual filing duties before the January deadlines.",
      },
    ],
  },
};
