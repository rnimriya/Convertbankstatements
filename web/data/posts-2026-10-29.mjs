// Daily blog posts for 2026-10-29. Angle: convert-to-excel (bank posts 1-4),
// QB keyword post 5: how-to-record-stripe-payments-in-quickbooks.
// Authors rotate: Sarah Mitchell, James Park, David Chen, CPA, Sarah Mitchell, James Park.
export const posts = [
  {
    id: "gen-2026-10-29-01",
    slug: "attijariwafa-bank-convert-to-excel",
    title: "Convert Attijariwafa Bank Statement PDF to Excel Fast",
    excerpt: "Convert your Attijariwafa Bank statement PDF to Excel in minutes: download the right monthly file, clean up French labels and dirham formatting, and build a budget.",
    featureImage: "/blog/attijariwafa-bank-convert-to-excel.webp",
    author: "Sarah Mitchell",
    tags: ["attijariwafa bank", "pdf to excel", "bank statement", "excel conversion"],
    published: true,
    createdAt: "2026-10-29T06:30:00.000Z",
    updatedAt: "2026-10-29T06:30:00.000Z",
    keyword: "convert attijariwafa bank statement pdf to excel",
    content: `<p>If you bank with Morocco's largest bank, you know the monthly statement is rich in detail and hard to work with as a PDF. When you <strong>convert Attijariwafa Bank statement PDF to Excel</strong>, every transaction becomes a sortable row: date, description, debit, credit, and running balance in separate columns you can filter, total, and chart. This guide shows you how to download the correct statement file, convert it cleanly, and handle the two quirks that trip people up most — French or Arabic transaction labels and Moroccan dirham number formatting.</p>
<h2>Download the right Attijariwafa statement PDF</h2>
<p>Start in Attijariwafa Bank's online banking or mobile app and open the account you want to work with. Statements are issued monthly, so pick the month you need and download the PDF version rather than printing to PDF from the screen view, which can split rows across pages and break the table structure a converter reads. Save the file with a clear name, such as attijariwafa-january-2026.pdf, so a folder of twelve months stays easy to navigate. Before converting, open the PDF and confirm it shows the full month: the opening balance, every transaction, and the closing balance. If a page is missing, re-download the file before you convert, because a gap in the middle of the month is much harder to spot later in a spreadsheet.</p>
<p>Also check which language your statement uses. Attijariwafa statements commonly show French labels, and some customers receive Arabic versions. Either way, the numbers and dates convert the same; only the description text differs, and you will translate the handful of recurring labels in the next step. If you hold more than one account, download one statement per account and convert them separately — mixing accounts in one spreadsheet makes reconciliation a headache.</p>
<figure><img src="/blog/attijariwafa-bank-convert-to-excel-inline-1.webp" alt="convert Attijariwafa Bank statement PDF to Excel — hands sorting printed statements on desk" width="1200" height="800" loading="lazy" /><figcaption>Gather the full monthly statement before you convert it.</figcaption></figure>
<h2>Convert the PDF to a clean Excel workbook</h2>
<p>Upload the statement PDF to a converter that reads the table structure instead of asking you to retype anything. A good conversion keeps dates in a real date column, amounts as numbers (not text), and debits and credits in separate columns, so you can sort and total immediately. After conversion, do a quick sanity check before you trust the sheet: add up the transactions and confirm the result matches the difference between the opening and closing balances. If the totals disagree, look for a row the converter split or merged, usually a long description that wrapped onto two lines.</p>
<p>Keep the original PDF untouched as your source record and treat the spreadsheet as your working copy. That habit matters if you ever need to prove a transaction to the bank or to an accountant: the PDF is the evidence, and the spreadsheet is the analysis. For a general walkthrough of the conversion process, see our guide on how to <a href="/blog/convert-bank-statement-pdf-to-excel">convert a bank statement PDF to Excel</a>.</p>
<h2>Clean up French labels and dirham formatting</h2>
<p>Most Attijariwafa statements use a small set of recurring French terms, and learning them once makes every month faster. Virement means a transfer, prelevement is a direct debit, carte covers card purchases, and solde is the balance. Add a category column next to the description and translate each recurring label into a plain category such as rent, groceries, transfer, or fee. After two or three months, most of your rows will categorize themselves by description, and you will only need to handle new merchants by hand.</p>
<p>Dirham formatting needs one pass of attention. Moroccan statements often show amounts with spaces as thousand separators and a comma as the decimal mark, which Excel in a US locale reads as text. Select the amount columns, remove the spaces, and replace the decimal comma with a period, then set the column format to number or currency. Once the amounts are true numbers, you can sum by category, filter by size, and build a monthly total that actually adds up.</p>
<figure><img src="/blog/attijariwafa-bank-convert-to-excel-inline-2.webp" alt="Attijariwafa Bank statement to Excel — laptop spreadsheet with monthly transactions on screen" width="1200" height="800" loading="lazy" /><figcaption>Once amounts are real numbers, totals and filters work properly.</figcaption></figure>
<h2>Turn the spreadsheet into a monthly budget check</h2>
<p>With a converted month in Excel, the useful work takes ten minutes. Total each category and compare it with the previous month: card spending up sharply, ATM withdrawals creeping higher, or a new recurring fee you had not noticed. Attijariwafa accounts can carry account maintenance fees, card fees, and charges on international transactions, and a spreadsheet makes those visible in a way a PDF never does. Flag any transaction you do not recognize and check it against receipts or the bank's app before the month ends.</p>
<p>Repeat the process monthly and keep one workbook per year with a sheet per month plus a summary sheet. Over a year, that workbook shows your real spending pattern, which is exactly what you need for a loan application, a visa file, or a simple household budget. It also makes tax or accounting work far easier, since your income and deductible expenses are already totaled by category.</p>
<h2>Frequently asked questions</h2>
<h3>Can I convert an Attijariwafa statement that is in French or Arabic?</h3>
<p>Yes. The conversion reads the table structure and the numbers, so the language of the labels does not block it. You translate only the recurring description labels into your own categories, which takes a few minutes the first month and almost none after that.</p>
<h3>Why do my dirham amounts show up as text in Excel?</h3>
<p>Because the statement uses spaces for thousands and a comma for decimals. Strip the spaces and swap the decimal comma for a period, then format the column as a number. After that, sums and filters work normally.</p>
<h3>Is it safe to upload my statement to an online converter?</h3>
<p>Choose a converter that processes files without storing them, delete downloads from shared computers, and never email an unredacted statement. Our <a href="/blog/bank-statement-data-security-best-practices">data security best practices</a> article has the full checklist.</p>
<h3>Should I convert one month or the whole year at once?</h3>
<p>Convert one month at a time and combine the months into a single workbook. That keeps errors easy to find and gives you one clean sheet per month for comparison.</p>
<p>Stop scrolling through PDFs and start working with your money. <a href="/banks/attijariwafa-bank">Convert your Attijariwafa Bank statements to Excel</a> today, or see <a href="/pricing">pricing</a> if you have more than 8 pages to convert.</p>`,
  },
  {
    id: "gen-2026-10-29-02",
    slug: "axess-convert-to-excel",
    title: "Convert Axess Bank Statement PDF to Excel in Minutes",
    excerpt: "Convert your Axess bank statement PDF to Excel: handle installment purchases, bonus points, and interest rows so your card spending becomes a clear monthly spreadsheet.",
    featureImage: "/blog/axess-convert-to-excel.webp",
    author: "James Park",
    tags: ["axess", "pdf to excel", "credit card statement", "excel conversion"],
    published: true,
    createdAt: "2026-10-29T06:30:00.000Z",
    updatedAt: "2026-10-29T06:30:00.000Z",
    keyword: "convert axess bank statement pdf to excel",
    content: `<p>Axess card statements pack a lot into one document: purchases, installment plans, bonus points, cash advances, and interest, all in Turkish lira. When you <strong>convert Axess bank statement PDF to Excel</strong>, that dense document becomes a working spreadsheet where you can separate real spending from installment leftovers, track how much of each purchase is still unpaid, and see exactly what interest and fees cost you each month. Here is how to do it cleanly.</p>
<h2>Download your Axess statement from Akbank</h2>
<p>Axess is Akbank's card brand, so your statement lives in Akbank's mobile app or internet banking under your card accounts. Choose the card and the statement month, then download the PDF version of the statement rather than a screenshot or a printed web page. Name the file by card and month, for example axess-january-2026.pdf, because many people hold more than one Axess card and the statements look identical at a glance. Open the PDF before converting and confirm it includes the full cycle: previous balance, new purchases, payments you made, interest and fees, and the new balance.</p>
<p>If the statement period does not match the calendar month, do not worry — card cycles run from one statement date to the next. Keep your spreadsheet in statement-cycle order and label each sheet with the cycle dates, so a payment that lands on the boundary between two cycles is never counted twice.</p>
<figure><img src="/blog/axess-convert-to-excel-inline-1.webp" alt="convert Axess bank statement PDF to Excel — credit cards and paper statement on table" width="1200" height="800" loading="lazy" /><figcaption>Download the full PDF statement for the card and cycle you need.</figcaption></figure>
<h2>Convert the PDF and separate installments from spending</h2>
<p>Upload the PDF to a converter and check the result column by column: transaction date, description, amount, and any installment notation. The trickiest rows on an Axess statement are installment purchases. A single purchase made in installments shows up as one row per month for the installment amount, plus a note of the original total. In Excel, add a column for installment status and mark each row as full payment, installment part, or fee, so a 2,000 lira purchase split over four months does not look like four separate purchases.</p>
<p>Also separate bonus point entries from cash amounts. Points and chip-money lines are not money spent, and mixing them into your spending totals inflates the month. Keep a notes column for them instead, so you can track rewards without distorting the budget. For the general conversion method, see our guide on how to <a href="/blog/convert-bank-statement-pdf-to-excel">convert a bank statement PDF to Excel</a>.</p>
<h2>Track interest, fees, and cash advances honestly</h2>
<p>Once the rows are in Excel, filter for interest and fee rows and total them for the month. Axess statements show interest on carried balances, late payment fees, and cash advance charges as separate lines, and seeing them totaled is often the moment people change how they use the card. If you paid only the minimum last month, the interest row tells you the price of that choice in plain numbers. Add a simple summary at the top of each sheet: total purchases, total installments due, total interest and fees, and total payments made.</p>
<p>Cash advances deserve their own category. They usually carry higher interest from day one and no grace period, so lumping them with purchases hides their real cost. In your spreadsheet, label them clearly and keep a running total across months — a cash advance habit is easy to miss in a PDF and impossible to miss in a sorted spreadsheet.</p>
<figure><img src="/blog/axess-convert-to-excel-inline-2.webp" alt="Axess bank statement to Excel — person checking card transactions on laptop at home" width="1200" height="800" loading="lazy" /><figcaption>Sort by category to see interest and fees as their own totals.</figcaption></figure>
<h2>Build a payoff plan from the spreadsheet</h2>
<p>With several months converted, you can see the full picture: which installment plans are still running, when each one ends, and how much of next month's payment is already committed before you spend anything new. That is the real value of converting card statements — the PDF shows one month, while the workbook shows the commitment you carry forward. List every active installment plan with its remaining months and monthly amount, and subtract that committed total from next month's budget before you plan new spending.</p>
<p>Keep one workbook per card per year, with a sheet per statement cycle and a summary sheet showing monthly totals for purchases, interest, fees, and payments. Review it for ten minutes when each new statement arrives, and you will catch double charges, forgotten subscriptions, and fee increases while they are still easy to dispute.</p>
<h2>Frequently asked questions</h2>
<h3>How do installment purchases appear after conversion?</h3>
<p>As one row per installment month, usually with a note of the original purchase. Mark these rows as installment parts in a status column so you do not mistake them for new purchases.</p>
<h3>Why is my Axess statement total different from my spreadsheet total?</h3>
<p>Usually because a bonus point line or a wrapped description row was counted as money. Check point entries first, then look for rows the converter split across two lines, and verify the result against the statement's closing balance.</p>
<h3>Can I convert several months at once?</h3>
<p>Convert one statement cycle at a time and combine them into a workbook. That keeps cycle boundaries clean and makes it easy to find any month that does not reconcile.</p>
<h3>Is uploading my card statement safe?</h3>
<p>Use a converter that does not store your files, work on your own computer, and delete converted files from shared machines. Our <a href="/blog/bank-statement-data-security-best-practices">data security best practices</a> article covers the precautions that matter.</p>
<p>Turn a dense card statement into a spreadsheet you can actually use. <a href="/banks/axess">Convert your Axess bank statements to Excel</a> today, or see <a href="/pricing">pricing</a> if you have more than 8 pages to convert.</p>`,
  },
  {
    id: "gen-2026-10-29-03",
    slug: "banamex-convert-to-excel",
    title: "Convert Banamex Bank Statement PDF to Excel Easily",
    excerpt: "Convert your Banamex bank statement PDF to Excel: download the right estado de cuenta, translate Spanish labels, fix peso formatting, and track spending by category.",
    featureImage: "/blog/banamex-convert-to-excel.webp",
    author: "David Chen, CPA",
    tags: ["banamex", "pdf to excel", "bank statement", "excel conversion"],
    published: true,
    createdAt: "2026-10-29T06:30:00.000Z",
    updatedAt: "2026-10-29T06:30:00.000Z",
    keyword: "convert banamex bank statement pdf to excel",
    content: `<p>Banamex statements record everything from SPEI transfers to OXXO deposits, but as a PDF they are hard to analyze. When you <strong>convert Banamex bank statement PDF to Excel</strong>, you get a sortable ledger of your pesos: every deposit, withdrawal, transfer, and fee in its own row, ready for budgeting, tax preparation, or a loan application. This guide covers downloading the right file, converting it, and handling the Spanish labels and peso number formats that cause the most confusion.</p>
<h2>Download your estado de cuenta from Banamex</h2>
<p>Log in to BancaNet or the Banamex mobile app and open the account you want. Banamex issues a monthly estado de cuenta for checking and savings accounts, and you can usually download several months back without visiting a branch. Choose the PDF download option for the month you need, not a screen print, because the PDF preserves the table layout that converters read. Save each month with a clear name, such as banamex-january-2026.pdf, and keep one folder per account if you hold both a checking account and a savings account.</p>
<p>Before converting, open the PDF and verify it is complete: opening balance, all movements for the month, and closing balance. Banamex statements can run long when an account is active, so confirm no page is missing in the middle. A missing page usually means a missing week of transactions, and that gap will break any total you build later.</p>
<figure><img src="/blog/banamex-convert-to-excel-inline-1.webp" alt="convert Banamex bank statement PDF to Excel — hands holding printed statement near laptop" width="1200" height="800" loading="lazy" /><figcaption>Download the complete monthly estado de cuenta before converting.</figcaption></figure>
<h2>Convert the PDF and translate the Spanish labels</h2>
<p>Upload the PDF to a converter and confirm the columns came out right: date, description, charges, deposits, and balance. Banamex descriptions use a compact set of Spanish terms, and translating them once makes every month easy. Saldo is the balance, cargo is a charge or debit, abono is a credit or deposit, transferencia is a transfer, and SPEI marks an interbank electronic transfer. Add a category column in Excel and map each recurring description to a plain category: salary, rent, groceries, utilities, transfer, or fee.</p>
<p>Watch for two description quirks. First, long merchant names sometimes wrap onto a second line, which can split one transaction into two rows — merge those rows and check the total against the closing balance. Second, ATM and branch codes appear in descriptions and are not spending categories; replace them with the real purpose of the withdrawal where you know it. For the general method, see our guide on how to <a href="/blog/convert-bank-statement-pdf-to-excel">convert a bank statement PDF to Excel</a>.</p>
<h2>Fix peso formatting so totals actually add up</h2>
<p>Mexican statements format amounts with commas for thousands and a period for decimals in many exports, but some show the reverse or include the peso sign and spaces. Either way, Excel must see real numbers, not text. After conversion, select the amount columns, strip currency symbols and spaces, and make sure the decimal separator matches your Excel locale. Then format the columns as numbers with two decimals. A quick test: sum the month's deposits and withdrawals and confirm the result equals the change between opening and closing balances.</p>
<p>Once the numbers are clean, the spreadsheet starts paying off. Sort by amount to find your largest expenses, filter by description to total a single merchant or a recurring subscription, and build a monthly summary of income versus spending. If you run a small business through a personal Banamex account, this step alone separates deductible business costs from personal spending — a distinction that matters at tax time.</p>
<figure><img src="/blog/banamex-convert-to-excel-inline-2.webp" alt="Banamex bank statement to Excel — spreadsheet of peso transactions on computer screen" width="1200" height="800" loading="lazy" /><figcaption>Clean number formatting is what makes category totals trustworthy.</figcaption></figure>
<h2>Use the workbook for budgets, taxes, and loan files</h2>
<p>A converted year of Banamex statements is a ready-made financial record. For a household budget, total each category by month and compare months to spot drift, such as dining or delivery spending creeping upward. For taxes, your spreadsheet totals give your accountant clean income and expense figures instead of a stack of PDFs. For a loan or mortgage application, a bank often asks for several months of statements, and a categorized workbook next to the original PDFs shows the lender an organized borrower.</p>
<p>Keep the original PDFs as your source documents and the workbook as your working file, backed up in a second location. Review each new month within a few days of arrival: flag unknown charges while they are fresh, confirm SPEI transfers you expected actually landed, and note any fee change. Ten minutes a month keeps the record accurate all year.</p>
<h2>Frequently asked questions</h2>
<h3>What does SPEI mean on my Banamex statement?</h3>
<p>SPEI is Mexico's interbank electronic transfer system. A SPEI line is a transfer to or from another bank, and the description usually includes a tracking key you can use if a transfer ever needs tracing.</p>
<h3>Can I convert a Banamex statement in Spanish?</h3>
<p>Yes. Conversion reads the numbers and table layout regardless of language. You only translate the recurring description labels into your own categories, which is a one-time job for the most common terms.</p>
<h3>Why do my amounts show as text after conversion?</h3>
<p>Currency symbols, spaces, or a mismatched decimal separator turn numbers into text. Clean those characters out, set the column to number format, and verify the total against the closing balance.</p>
<h3>Is it safe to upload my statement to a converter?</h3>
<p>Use a converter that does not store your files, avoid shared computers for the download step, and never email an unredacted statement. Our <a href="/blog/bank-statement-data-security-best-practices">data security best practices</a> article has the full checklist.</p>
<p>Stop paging through PDFs and start using your statement data. <a href="/banks/banamex">Convert your Banamex bank statements to Excel</a> today, or see <a href="/pricing">pricing</a> if you have more than 8 pages to convert.</p>`,
  },
  {
    id: "gen-2026-10-29-04",
    slug: "banca-monte-dei-paschi-di-siena-convert-to-excel",
    title: "Convert Banca Monte dei Paschi di Siena Bank Statement PDF to Excel",
    excerpt: "Convert your Banca Monte dei Paschi di Siena statement PDF to Excel: download the estratto conto, translate Italian labels, fix euro formatting, and reconcile monthly.",
    featureImage: "/blog/banca-monte-dei-paschi-di-siena-convert-to-excel.webp",
    author: "Sarah Mitchell",
    tags: ["banca monte dei paschi di siena", "pdf to excel", "bank statement", "excel conversion"],
    published: true,
    createdAt: "2026-10-29T06:30:00.000Z",
    updatedAt: "2026-10-29T06:30:00.000Z",
    keyword: "convert banca monte dei paschi di siena bank statement pdf to excel",
    content: `<p>Founded in 1472, Banca Monte dei Paschi di Siena is the world's oldest surviving bank, and its monthly statements carry centuries of tradition in one very modern problem: a long PDF that is painful to analyze. When you <strong>convert Banca Monte dei Paschi di Siena bank statement PDF to Excel</strong>, every movement becomes a sortable row — date, description, debit, credit, and balance — so you can reconcile the month, categorize spending, and prepare documents for your accountant without retyping a single line. Here is the clean way to do it.</p>
<h2>Download your estratto conto from MPS internet banking</h2>
<p>Log in to the MPS internet banking portal or mobile app and open the account you need. Monthly statements, the estratto conto, are available as PDF downloads for recent months, and older statements can usually be requested from the same documents section. Download the PDF for the month you want rather than printing the on-screen view, which can break rows across pages. Name the file clearly, such as mps-january-2026.pdf, and keep separate folders per account if you hold a current account and a savings account.</p>
<p>Open the PDF before converting and check the essentials: opening balance, every movement in date order, and closing balance. Italian statements often include a summary block of totals at the end; note those figures, because they are your reconciliation targets after conversion. If a page is missing, download the statement again before converting — a gap in the middle of the month is far harder to detect in a spreadsheet than in the PDF.</p>
<figure><img src="/blog/banca-monte-dei-paschi-di-siena-convert-to-excel-inline-1.webp" alt="convert Banca Monte dei Paschi statement PDF to Excel — person reading printed statement at desk" width="1200" height="800" loading="lazy" /><figcaption>Check the full estratto conto, opening to closing balance, first.</figcaption></figure>
<h2>Convert the PDF and translate the Italian labels</h2>
<p>Upload the PDF to a converter and verify the columns: date, description, debits, credits, and balance. MPS descriptions use a small set of Italian terms worth learning once. Saldo is the balance, bonifico is a bank transfer, addebito is a debit, accredito is a credit, prelievo is an ATM withdrawal, and RID or SDD marks a direct debit such as a utility bill. Add a category column and map each recurring description to a plain category like salary, rent, groceries, utilities, or fee. After the first month, most rows will categorize by description alone.</p>
<p>Watch for wrapped descriptions: long merchant names can split across two lines and produce a split row. Merge those rows and re-check the month's total against the statement's closing balance. For the general conversion approach, see our guide on how to <a href="/blog/convert-bank-statement-pdf-to-excel">convert a bank statement PDF to Excel</a>.</p>
<h2>Fix euro formatting and reconcile the month</h2>
<p>Italian statements typically show euro amounts with a period for thousands and a comma for decimals, plus the euro sign — the reverse of US formatting. Excel in a US locale reads those as text, so clean them: remove the euro sign and thousand separators, swap the decimal comma for a period, and set the column to number format. Then reconcile: sum all credits, sum all debits, and confirm opening balance plus credits minus debits equals the closing balance. If it does not, a row was missed or split, and the difference usually points straight at it.</p>
<p>Reconciliation is the step most people skip, and it is the step that makes the spreadsheet trustworthy. A reconciled month can go to an accountant, a lender, or a tax file with confidence. An unreconciled month is just a prettier version of the PDF. Take the extra two minutes and check the totals every time.</p>
<figure><img src="/blog/banca-monte-dei-paschi-di-siena-convert-to-excel-inline-2.webp" alt="Banca Monte dei Paschi statement to Excel — laptop showing spreadsheet beside paper statements" width="1200" height="800" loading="lazy" /><figcaption>A reconciled spreadsheet is one you can hand to an accountant.</figcaption></figure>
<h2>Build a year-long record from monthly sheets</h2>
<p>Convert one month at a time and combine the months into a single workbook with a sheet per month and a summary sheet. The summary is where the value appears: total spending by category per month, income versus outgo, and any fee trend, such as account charges or card fees rising over the year. Direct debits deserve a special look — list every RID or SDD line across the year and you will find subscriptions you forgot, duplicated charges, and bills that changed amount without notice.</p>
<p>Keep the original PDFs as source records and the workbook as your working document, stored in two locations. When tax season or a loan application arrives, you will hand over a categorized year instead of a pile of PDFs, and your accountant or lender will notice the difference.</p>
<h2>Frequently asked questions</h2>
<h3>What is a bonifico on my MPS statement?</h3>
<p>A bonifico is a bank transfer, incoming or outgoing. The description usually names the other party, which makes it easy to categorize once you map the recurring ones.</p>
<h3>Can I convert an Italian-language MPS statement?</h3>
<p>Yes. Conversion reads the table and numbers regardless of language. You translate only the recurring Italian labels into your own categories, a one-time task for the common terms.</p>
<h3>Why do my euro amounts appear as text in Excel?</h3>
<p>Because Italian formatting uses a period for thousands and a comma for decimals. Clean those out, use a period as the decimal mark, and format the column as a number.</p>
<h3>Is uploading my statement to a converter safe?</h3>
<p>Choose a converter that does not store files, work on your own device, and never email an unredacted statement. Our <a href="/blog/bank-statement-data-security-best-practices">data security best practices</a> article covers the full checklist.</p>
<p>Turn the world's oldest bank's statements into a modern spreadsheet. <a href="/banks/banca-monte-dei-paschi-di-siena">Convert your Banca Monte dei Paschi di Siena statements to Excel</a> today, or see <a href="/pricing">pricing</a> if you have more than 8 pages to convert.</p>`,
  },
  {
    id: "gen-2026-10-29-05",
    slug: "how-to-record-stripe-payments-in-quickbooks",
    title: "How to Record Stripe Payments in QuickBooks Online",
    excerpt: "Learn how to record Stripe payments in QuickBooks Online: gross sales, processing fees, and payout deposits matched through a clearing account, with month-end checks.",
    featureImage: "/blog/how-to-record-stripe-payments-in-quickbooks.webp",
    author: "James Park",
    tags: ["quickbooks", "stripe", "qbo", "reconciliation"],
    published: true,
    createdAt: "2026-10-29T06:30:00.000Z",
    updatedAt: "2026-10-29T06:30:00.000Z",
    keyword: "how to record stripe payments in quickbooks",
    content: `<p>If Stripe processes your sales, your bank account never shows the full amount a customer paid — it shows the payout, which is sales minus Stripe's fees, minus refunds, and sometimes net of several days of sales at once. Learning <strong>how to record Stripe payments in QuickBooks</strong> correctly means recording the gross sale, the fee, and the payout as three separate facts, so your revenue, your expenses, and your bank balance all reconcile. This walkthrough covers the full method: gross sales first, a clearing account for payouts, matching the bank deposit, and the month-end checks that catch mistakes.</p>
<h2>How to record Stripe payments in QuickBooks: start with the gross sale</h2>
<p>The most common Stripe bookkeeping mistake is recording the net payout as income. If a customer paid $100 and Stripe took a $3 fee, your income is $100 and your processing expense is $3 — not $97 of income. Booking $97 understates revenue, hides your fee expense, and makes sales tax or income reporting wrong. The correct first entry is the gross sale: debit your Stripe clearing account for $100 and credit sales income for $100. Do this for each day's sales or for each payout batch, whichever matches how you review Stripe's reports.</p>
<p>Next, record the fee separately. Stripe reports fees per transaction in its dashboard and in its payout reports, and your accounting should show total processing fees as their own expense line. Enter the fee as a debit to merchant processing fees and a credit to the same clearing account. Refunds and disputes work the same way in reverse: a refund reduces sales income and returns money through the clearing account, while a dispute that Stripe holds temporarily stays visible there until it resolves. Keeping fees and refunds out of the sales line is what makes your profit and loss statement honest.</p>
<h2>Use an undeposited funds or clearing account for Stripe payouts</h2>
<p>A clearing account is the bridge between Stripe's world and your bank's world. Sales go in gross, fees and refunds come out, and the payout moves the net remainder to your bank account. In QuickBooks Online, you can use the built-in Undeposited Funds account or create a dedicated Stripe clearing bank account; a dedicated account is easier to reconcile because it holds only Stripe activity. The rule is simple: the clearing account should return to zero after each payout is matched, except for sales that have been charged but not yet paid out.</p>
<p>This method also fixes the timing problem. Stripe pays out on its own schedule, often two days after the sale, and a single payout can combine several days of sales. Without a clearing account, you would be tempted to book income on the payout date, which shifts revenue into the wrong month at every month-end. With the clearing account, income is dated when the sale happened, and the payout is just a transfer of money that was already recorded.</p>
<figure><img src="/blog/how-to-record-stripe-payments-in-quickbooks-inline-1.webp" alt="how to record Stripe payments in QuickBooks — person reviewing payout report on laptop" width="1200" height="800" loading="lazy" /><figcaption>Review the payout report before you match anything to the bank.</figcaption></figure>
<h2>How to record Stripe payments in QuickBooks payouts: match the deposit to your bank feed</h2>
<p>When the payout lands in your bank account, QuickBooks will usually show it in the bank feed. Match it to the transfer out of your Stripe clearing account, not to a sales receipt — the sale was already recorded when it happened. The amount you match is the net payout: gross sales minus fees minus refunds for that batch. If the feed shows a payout that does not match any single batch, check Stripe's payout report: payouts sometimes combine partial days, hold back a reserve, or arrive split across two deposits.</p>
<p>Never force a match by editing the payout amount to fit. If the payout differs from your clearing balance by a small amount, the difference is almost always a fee you missed, a refund processed after the batch, or a currency conversion adjustment on an international sale. Find the item in Stripe's reports, record it, and the match will fall into place. Forcing the number hides the error and breaks the next reconciliation.</p>
<h2>Month-end checks that catch Stripe mistakes</h2>
<p>Run three checks at each month-end. First, reconcile the Stripe clearing account: its balance should equal exactly the sales charged but not yet paid out, and nothing else. A leftover balance that grows month after month means fees or refunds are being missed. Second, total your Stripe fees for the month and compare them with Stripe's monthly summary; a mismatch means a fee batch was skipped. Third, reconcile your bank account and confirm every Stripe payout in the feed is matched to a clearing transfer, with no payout booked directly to income.</p>
<p>One practical shortcut makes all of this far less manual: <a href="/tools/free-stripe-to-quickbooks">how to record Stripe payments in QuickBooks with our free converter</a> — it turns your Stripe CSV export into a QBO file you can import into QuickBooks, with sales, fees, and refunds structured for the clearing-account method — it is a file-based converter for your exports, not a live sync connection, so you stay in control of what gets imported and when. Pair it with our <a href="/quickbooks">QuickBooks tools hub</a> and the earlier guide on <a href="/blog/how-to-record-stripe-fees-in-quickbooks">how to record Stripe fees in QuickBooks</a> for the fee side in detail.</p>
<figure><img src="/blog/how-to-record-stripe-payments-in-quickbooks-inline-2.webp" alt="record Stripe payments in QuickBooks — spreadsheet of Stripe payouts matched to bank deposit" width="1200" height="800" loading="lazy" /><figcaption>Match each payout to its clearing transfer, never directly to income.</figcaption></figure>
<h2>Frequently asked questions</h2>
<h3>How to record Stripe payments in QuickBooks when the payout arrives days later?</h3>
<p>Record the gross sale on the sale date into your Stripe clearing account, then record the payout as a transfer from the clearing account to your bank account on the payout date. Income stays in the right month even though the cash arrives later.</p>
<h3>Should I record the net payout as income?</h3>
<p>No. Record gross sales as income and Stripe fees as a separate expense. Booking only the net amount understates revenue and hides what processing actually costs you.</p>
<h3>What if a Stripe payout does not match my clearing balance?</h3>
<p>Check Stripe's payout report for a missed fee, a late refund, or a reserve hold before you match. Record the missing item first; do not adjust the payout amount to force a match.</p>
<h3>Does your converter connect directly to Stripe or QuickBooks?</h3>
<p>No. Our tools convert files you export — Stripe CSV in, QBO file out — for import into QuickBooks. There is no live sync connection, which means you review everything before it enters your books.</p>
<p>Clean Stripe books start with gross sales, separate fees, and a clearing account that returns to zero. Try our <a href="/tools/free-stripe-to-quickbooks">free Stripe to QuickBooks converter</a> for your next payout batch, or see <a href="/pricing">pricing</a> for larger volumes.</p>`,
  },
];
