/**
 * Curated content for the top-20 US bank landing pages.
 *
 * Every `name` below is an EXACT display name from SUPPORTED_BANKS
 * (web/lib/config/banks.ts) — verified by hand against that list — and every
 * `slug` is what generateBankSlug(name) in web/lib/seo/banks.ts produces, so
 * these entries line up 1:1 with getBankBySlug().
 *
 * Honesty rules for this file:
 * - Download steps are phrased generically on purpose. Menu labels differ
 *   between the website, the mobile app and account types, so no exact
 *   button names or portal URLs are claimed here.
 * - No accuracy percentages, no user counts, no invented bank features.
 * - Pricing facts only: 8 pages free; plans $0 / $5 (25 pages) /
 *   $20 (500 pages) / $75 (2,000 pages).
 */

export interface TopBankFaq {
  q: string;
  a: string;
}

export interface TopBank {
  /** Exact SUPPORTED_BANKS display name. */
  name: string;
  /** generateBankSlug(name) — the /banks/<slug> route segment. */
  slug: string;
  /** Short, truthful paragraph shown under the hero / above the steps. */
  about: string;
  /** 4–6 generic-safe steps for downloading the statement PDF. */
  downloadSteps: string[];
  /** Note about the statement format and the export formats we produce. */
  formatsNote: string;
  faqs: TopBankFaq[];
  /** Slugs of other top-20 banks (all real /banks/<slug> routes). */
  related: string[];
}

const pricingAnswer = (bank: string) =>
  `Converting ${bank} statements starts free: your first 8 pages are free, with no credit card required. Paid plans are $5/month for 25 pages, $20/month for 500 pages, and $75/month for 2,000 pages. Excel and CSV exports are included on every plan; QBO and OFX downloads are on the Pro plan and above.`;

const privacyAnswer = (bank: string) =>
  `No. Your ${bank} statement is processed in memory and deleted immediately after conversion — nothing is written to disk or kept in a database. We never sell or share your financial data.`;

const passwordAnswer = (bank: string) =>
  `Yes. Upload the ${bank} PDF and enter the document password when prompted during upload. The password is used only to open the file for that one conversion and is never stored.`;

const qbAnswer = (bank: string) =>
  `Convert the ${bank} PDF to QBO (or OFX) here, then use your accounting software's bank-feed / Web Connect import to bring the file in. The converted file carries dates, descriptions and signed amounts in the shape QuickBooks expects, so the import takes a couple of minutes. QBO and OFX downloads are on the Pro plan and above.`;

export const TOP_20_BANKS: TopBank[] = [
  {
    name: "JPMorgan Chase",
    slug: "jpmorgan-chase",
    about:
      "Chase issues a PDF statement for every statement period on its checking, savings and credit card accounts. If you do your books in Excel or QuickBooks, that PDF is the wrong shape — this page turns it into a clean spreadsheet or a QuickBooks-ready file, with dates, descriptions, amounts and running balances kept in order.",
    downloadSteps: [
      "Sign in to JPMorgan Chase online banking or the Chase mobile app.",
      "Open the account you need — checking, savings or a Chase credit card.",
      "Find the Statements or Documents section for that account.",
      "Choose the statement period (month) you want.",
      "Download the statement and save it as a PDF.",
      "If the PDF asks for a password when you open it, keep that password handy — you will enter it once when you upload the file here.",
    ],
    formatsNote:
      "Chase statements arrive as monthly PDFs. ConvertStatement reads the PDF and exports Excel (.xlsx), CSV, OFX, QBO for QuickBooks, and Google Sheets — pick one format or several, and you get a separate download for each.",
    faqs: [
      {
        q: "Can I convert a Chase credit card statement, or only bank accounts?",
        a: "Both. Chase checking, savings and credit card statements are all monthly PDFs, and they convert the same way — upload the PDF and pick your export format.",
      },
      { q: "Can I convert a password-protected JPMorgan Chase statement?", a: passwordAnswer("JPMorgan Chase") },
      { q: "How do I get my Chase transactions into QuickBooks?", a: qbAnswer("Chase") },
      { q: "Is my Chase statement data stored on your servers?", a: privacyAnswer("Chase") },
      { q: "How much does it cost to convert Chase statements?", a: pricingAnswer("Chase") },
    ],
    related: ["bank-of-america", "wells-fargo", "citibank", "capital-one"],
  },
  {
    name: "Bank of America",
    slug: "bank-of-america",
    about:
      "Bank of America provides PDF statements (eStatements) for its checking, savings and card accounts. Typing those transactions into a spreadsheet by hand is slow and error-prone — this converter extracts them for you, so the file you download is ready for Excel, CSV-based tools or QuickBooks.",
    downloadSteps: [
      "Sign in to Bank of America online banking or the Bank of America mobile app.",
      "Open the account you need — checking, savings or a credit card.",
      "Find the Statements & Documents (eStatements) area for that account.",
      "Choose the statement period (month) you want.",
      "Download the statement and save it as a PDF.",
      "If the PDF is password-protected, keep the password handy — you will enter it once when you upload the file here.",
    ],
    formatsNote:
      "Bank of America statements arrive as monthly PDFs. ConvertStatement reads the PDF and exports Excel (.xlsx), CSV, OFX, QBO for QuickBooks, and Google Sheets — pick one format or several, and you get a separate download for each.",
    faqs: [
      {
        q: "Does this work for Bank of America business accounts too?",
        a: "Yes — if the account gives you a PDF statement, it converts the same way as a personal account. Business and personal Bank of America PDFs use the same statement layout.",
      },
      { q: "Can I convert a password-protected Bank of America statement?", a: passwordAnswer("Bank of America") },
      { q: "How do I import a Bank of America statement into QuickBooks?", a: qbAnswer("Bank of America") },
      { q: "Is my Bank of America statement data stored?", a: privacyAnswer("Bank of America") },
      { q: "How much does it cost to convert Bank of America statements?", a: pricingAnswer("Bank of America") },
    ],
    related: ["jpmorgan-chase", "wells-fargo", "citibank", "truist"],
  },
  {
    name: "Wells Fargo",
    slug: "wells-fargo",
    about:
      "Wells Fargo delivers account statements as PDFs through online banking. Whether you reconcile in Excel, share transactions with an accountant as CSV, or import into QuickBooks as QBO, this page converts the PDF for you — no re-typing, and the running balance is checked as part of the conversion.",
    downloadSteps: [
      "Sign in to Wells Fargo online banking or the Wells Fargo mobile app.",
      "Open the account you need — checking, savings or a credit card.",
      "Find the Statements and Documents section for that account.",
      "Choose the statement period (month) you want.",
      "Download the statement and save it as a PDF.",
      "If the PDF is password-protected, keep the password handy — you will enter it once when you upload the file here.",
    ],
    formatsNote:
      "Wells Fargo statements arrive as monthly PDFs. ConvertStatement reads the PDF and exports Excel (.xlsx), CSV, OFX, QBO for QuickBooks, and Google Sheets — pick one format or several, and you get a separate download for each.",
    faqs: [
      {
        q: "Can I convert several months of Wells Fargo statements?",
        a: "Yes. Download each month's PDF from Wells Fargo and convert them one at a time on this page — or, with an account, use bulk conversion when a whole set of statements lands at once. Your page allowance is counted across all conversions in the month.",
      },
      { q: "Can I convert a password-protected Wells Fargo statement?", a: passwordAnswer("Wells Fargo") },
      { q: "How do I import a Wells Fargo statement into QuickBooks?", a: qbAnswer("Wells Fargo") },
      { q: "Is my Wells Fargo statement data stored?", a: privacyAnswer("Wells Fargo") },
      { q: "How much does it cost to convert Wells Fargo statements?", a: pricingAnswer("Wells Fargo") },
    ],
    related: ["jpmorgan-chase", "bank-of-america", "u-s-bank", "citibank"],
  },
  {
    name: "Citibank",
    slug: "citibank",
    about:
      "Citibank (Citi) provides PDF statements for its bank accounts and Citi credit cards. This page converts those PDFs into spreadsheets and QuickBooks files, keeping dates, descriptions and amounts in clean columns you can reconcile against.",
    downloadSteps: [
      "Sign in to Citibank online banking or the Citi mobile app.",
      "Open the account you need — a Citi bank account or a Citi credit card.",
      "Find the Statements or Documents section for that account.",
      "Choose the statement period (month) you want and download the PDF.",
      "If the PDF is password-protected, keep the password handy — you will enter it once when you upload the file here.",
    ],
    formatsNote:
      "Citibank statements arrive as monthly PDFs. ConvertStatement exports Excel (.xlsx), CSV, OFX, QBO for QuickBooks, and Google Sheets — pick one format or several, and you get a separate download for each.",
    faqs: [
      {
        q: "Does this work for Citi credit card statements as well as Citibank accounts?",
        a: "Yes. Citi card statements and Citibank deposit-account statements are both monthly PDFs, and both convert here the same way.",
      },
      { q: "Can I convert a password-protected Citibank statement?", a: passwordAnswer("Citibank") },
      { q: "How do I import a Citibank statement into QuickBooks?", a: qbAnswer("Citibank") },
      { q: "Is my Citibank statement data stored?", a: privacyAnswer("Citibank") },
      { q: "How much does it cost to convert Citibank statements?", a: pricingAnswer("Citibank") },
    ],
    related: ["jpmorgan-chase", "bank-of-america", "capital-one", "discover-card"],
  },
  {
    name: "Capital One",
    slug: "capital-one",
    about:
      "Capital One provides PDF statements for its bank accounts (including 360 accounts) and its credit cards. This converter turns those PDFs into Excel, CSV, OFX, QBO or Google Sheets files, so you can reconcile, share or import your transactions without manual entry.",
    downloadSteps: [
      "Sign in to Capital One online banking or the Capital One mobile app.",
      "Open the account you need — a bank account or a Capital One credit card.",
      "Find the Statements or Documents section for that account.",
      "Choose the statement period (month) you want and download the PDF.",
      "If the PDF is password-protected, keep the password handy — you will enter it once when you upload the file here.",
    ],
    formatsNote:
      "Capital One statements arrive as monthly PDFs. ConvertStatement exports Excel (.xlsx), CSV, OFX, QBO for QuickBooks, and Google Sheets — pick one format or several, and you get a separate download for each.",
    faqs: [
      {
        q: "Can I convert both Capital One bank and credit card statements?",
        a: "Yes. Capital One issues PDF statements for both its bank accounts and its cards, and both convert here — upload whichever statement you have.",
      },
      { q: "Can I convert a password-protected Capital One statement?", a: passwordAnswer("Capital One") },
      { q: "How do I import a Capital One statement into QuickBooks?", a: qbAnswer("Capital One") },
      { q: "Is my Capital One statement data stored?", a: privacyAnswer("Capital One") },
      { q: "How much does it cost?", a: pricingAnswer("Capital One") },
    ],
    related: ["citibank", "discover-card", "jpmorgan-chase", "usaa"],
  },
  {
    name: "U.S. Bank",
    slug: "u-s-bank",
    about:
      "U.S. Bank provides PDF statements (eStatements) for its checking, savings and card accounts. This page converts a U.S. Bank PDF into a structured spreadsheet or QuickBooks file — dates, descriptions, amounts and balances in clean columns, ready to reconcile.",
    downloadSteps: [
      "Sign in to U.S. Bank online banking or the U.S. Bank mobile app.",
      "Open the account you need — checking, savings or a credit card.",
      "Find the Statements or Documents (eStatements) section for that account.",
      "Choose the statement period (month) you want and download the PDF.",
      "If the PDF is password-protected, keep the password handy — you will enter it once when you upload the file here.",
    ],
    formatsNote:
      "U.S. Bank statements arrive as monthly PDFs. ConvertStatement exports Excel (.xlsx), CSV, OFX, QBO for QuickBooks, and Google Sheets — pick one format or several, and you get a separate download for each.",
    faqs: [
      {
        q: "Does this work for U.S. Bank business accounts?",
        a: "Yes — any U.S. Bank account that gives you a PDF statement converts the same way, personal or business.",
      },
      { q: "Can I convert a password-protected U.S. Bank statement?", a: passwordAnswer("U.S. Bank") },
      { q: "How do I import a U.S. Bank statement into QuickBooks?", a: qbAnswer("U.S. Bank") },
      { q: "Is my U.S. Bank statement data stored?", a: privacyAnswer("U.S. Bank") },
      { q: "How much does it cost?", a: pricingAnswer("U.S. Bank") },
    ],
    related: ["wells-fargo", "pnc-bank", "truist", "regions-bank"],
  },
  {
    name: "Truist",
    slug: "truist",
    about:
      "Truist provides PDF statements for its checking, savings and card accounts through online banking. This converter turns a Truist PDF into Excel, CSV, OFX, QBO or Google Sheets output, so month-end reconciliation stops depending on manual typing.",
    downloadSteps: [
      "Sign in to Truist online banking or the Truist mobile app.",
      "Open the account you need — checking, savings or a credit card.",
      "Find the Statements or Documents section for that account.",
      "Choose the statement period (month) you want and download the PDF.",
      "If the PDF is password-protected, keep the password handy — you will enter it once when you upload the file here.",
    ],
    formatsNote:
      "Truist statements arrive as monthly PDFs. ConvertStatement exports Excel (.xlsx), CSV, OFX, QBO for QuickBooks, and Google Sheets — pick one format or several, and you get a separate download for each.",
    faqs: [
      {
        q: "Can I convert Truist statements for more than one account?",
        a: "Yes. Download the PDF for each Truist account separately and convert each one — the output file keeps that account's transactions and balances together.",
      },
      { q: "Can I convert a password-protected Truist statement?", a: passwordAnswer("Truist") },
      { q: "How do I import a Truist statement into QuickBooks?", a: qbAnswer("Truist") },
      { q: "Is my Truist statement data stored?", a: privacyAnswer("Truist") },
      { q: "How much does it cost?", a: pricingAnswer("Truist") },
    ],
    related: ["bank-of-america", "regions-bank", "citizens-bank", "fifth-third"],
  },
  {
    name: "TD Bank",
    slug: "td-bank",
    about:
      "TD Bank provides PDF statements for its US checking, savings and card accounts. This page converts a TD Bank PDF into a spreadsheet or QuickBooks file with clean columns — the format your books actually need, instead of a PDF you have to re-type.",
    downloadSteps: [
      "Sign in to TD Bank online banking or the TD Bank mobile app.",
      "Open the account you need — checking, savings or a credit card.",
      "Find the Statements or Documents section for that account.",
      "Choose the statement period (month) you want and download the PDF.",
      "If the PDF is password-protected, keep the password handy — you will enter it once when you upload the file here.",
    ],
    formatsNote:
      "TD Bank statements arrive as monthly PDFs. ConvertStatement exports Excel (.xlsx), CSV, OFX, QBO for QuickBooks, and Google Sheets — pick one format or several, and you get a separate download for each.",
    faqs: [
      {
        q: "Is this page for TD Bank in the US or Canada?",
        a: "This page covers US TD Bank statements. TD also operates in Canada under a separate listing — Canadian TD statement PDFs convert through the same uploader, and the converter detects the bank from the file itself.",
      },
      { q: "Can I convert a password-protected TD Bank statement?", a: passwordAnswer("TD Bank") },
      { q: "How do I import a TD Bank statement into QuickBooks?", a: qbAnswer("TD Bank") },
      { q: "Is my TD Bank statement data stored?", a: privacyAnswer("TD Bank") },
      { q: "How much does it cost?", a: pricingAnswer("TD Bank") },
    ],
    related: ["citizens-bank", "pnc-bank", "bmo", "capital-one"],
  },
  {
    name: "PNC Bank",
    slug: "pnc-bank",
    about:
      "PNC Bank provides PDF statements for its checking, savings and card accounts. Convert a PNC PDF here into Excel, CSV, OFX, QBO or Google Sheets — structured transactions you can sort, share and import, instead of a document you have to copy by hand.",
    downloadSteps: [
      "Sign in to PNC Bank online banking or the PNC mobile app.",
      "Open the account you need — checking, savings or a credit card.",
      "Find the Statements or Documents section for that account.",
      "Choose the statement period (month) you want and download the PDF.",
      "If the PDF is password-protected, keep the password handy — you will enter it once when you upload the file here.",
    ],
    formatsNote:
      "PNC Bank statements arrive as monthly PDFs. ConvertStatement exports Excel (.xlsx), CSV, OFX, QBO for QuickBooks, and Google Sheets — pick one format or several, and you get a separate download for each.",
    faqs: [
      {
        q: "Does this work for PNC business accounts?",
        a: "Yes — any PNC account with a PDF statement converts the same way, whether it is a personal or a business account.",
      },
      { q: "Can I convert a password-protected PNC Bank statement?", a: passwordAnswer("PNC Bank") },
      { q: "How do I import a PNC Bank statement into QuickBooks?", a: qbAnswer("PNC Bank") },
      { q: "Is my PNC Bank statement data stored?", a: privacyAnswer("PNC Bank") },
      { q: "How much does it cost?", a: pricingAnswer("PNC Bank") },
    ],
    related: ["u-s-bank", "citizens-bank", "huntington-bank", "fifth-third"],
  },
  {
    name: "Citizens Bank",
    slug: "citizens-bank",
    about:
      "Citizens Bank provides PDF statements for its checking, savings and card accounts. This converter extracts the transactions into Excel, CSV, OFX, QBO or Google Sheets files — clean, reconcilable data without manual entry.",
    downloadSteps: [
      "Sign in to Citizens Bank online banking or the Citizens mobile app.",
      "Open the account you need — checking, savings or a credit card.",
      "Find the Statements or Documents section for that account.",
      "Choose the statement period (month) you want and download the PDF.",
      "If the PDF is password-protected, keep the password handy — you will enter it once when you upload the file here.",
    ],
    formatsNote:
      "Citizens Bank statements arrive as monthly PDFs. ConvertStatement exports Excel (.xlsx), CSV, OFX, QBO for QuickBooks, and Google Sheets — pick one format or several, and you get a separate download for each.",
    faqs: [
      {
        q: "Is Citizens Bank the same as First Citizens Bank?",
        a: "No — they are two different banks, and both are supported. This page is for Citizens Bank statements; First Citizens Bank has its own page. If you upload a statement, the converter detects which bank issued it from the file itself.",
      },
      { q: "Can I convert a password-protected Citizens Bank statement?", a: passwordAnswer("Citizens Bank") },
      { q: "How do I import a Citizens Bank statement into QuickBooks?", a: qbAnswer("Citizens Bank") },
      { q: "Is my Citizens Bank statement data stored?", a: privacyAnswer("Citizens Bank") },
      { q: "How much does it cost?", a: pricingAnswer("Citizens Bank") },
    ],
    related: ["first-citizens-bank", "td-bank", "pnc-bank", "truist"],
  },
  {
    name: "Regions Bank",
    slug: "regions-bank",
    about:
      "Regions Bank provides PDF statements for its checking, savings and card accounts. Convert a Regions PDF here into Excel, CSV, OFX, QBO or Google Sheets — every transaction in clean columns, ready for reconciliation or for your accountant.",
    downloadSteps: [
      "Sign in to Regions Bank online banking or the Regions mobile app.",
      "Open the account you need — checking, savings or a credit card.",
      "Find the Statements or Documents section for that account.",
      "Choose the statement period (month) you want and download the PDF.",
      "If the PDF is password-protected, keep the password handy — you will enter it once when you upload the file here.",
    ],
    formatsNote:
      "Regions Bank statements arrive as monthly PDFs. ConvertStatement exports Excel (.xlsx), CSV, OFX, QBO for QuickBooks, and Google Sheets — pick one format or several, and you get a separate download for each.",
    faqs: [
      {
        q: "Can I convert Regions Bank statements from earlier months?",
        a: "Yes — as long as you can download the month's PDF statement from Regions online banking, you can convert it here. Older statements convert exactly like the current month's.",
      },
      { q: "Can I convert a password-protected Regions Bank statement?", a: passwordAnswer("Regions Bank") },
      { q: "How do I import a Regions Bank statement into QuickBooks?", a: qbAnswer("Regions Bank") },
      { q: "Is my Regions Bank statement data stored?", a: privacyAnswer("Regions Bank") },
      { q: "How much does it cost?", a: pricingAnswer("Regions Bank") },
    ],
    related: ["truist", "fifth-third", "u-s-bank", "cadence-bank"],
  },
  {
    name: "Fifth Third",
    slug: "fifth-third",
    about:
      "Fifth Third provides PDF statements for its checking, savings and card accounts. This page converts a Fifth Third PDF into Excel, CSV, OFX, QBO or Google Sheets output — structured transactions instead of a document you have to re-type at month-end.",
    downloadSteps: [
      "Sign in to Fifth Third online banking or the Fifth Third mobile app.",
      "Open the account you need — checking, savings or a credit card.",
      "Find the Statements or Documents section for that account.",
      "Choose the statement period (month) you want and download the PDF.",
      "If the PDF is password-protected, keep the password handy — you will enter it once when you upload the file here.",
    ],
    formatsNote:
      "Fifth Third statements arrive as monthly PDFs. ConvertStatement exports Excel (.xlsx), CSV, OFX, QBO for QuickBooks, and Google Sheets — pick one format or several, and you get a separate download for each.",
    faqs: [
      {
        q: "Does this work for Fifth Third business accounts?",
        a: "Yes — any Fifth Third account that provides a PDF statement converts the same way, personal or business.",
      },
      { q: "Can I convert a password-protected Fifth Third statement?", a: passwordAnswer("Fifth Third") },
      { q: "How do I import a Fifth Third statement into QuickBooks?", a: qbAnswer("Fifth Third") },
      { q: "Is my Fifth Third statement data stored?", a: privacyAnswer("Fifth Third") },
      { q: "How much does it cost?", a: pricingAnswer("Fifth Third") },
    ],
    related: ["huntington-bank", "pnc-bank", "regions-bank", "citizens-bank"],
  },
  {
    name: "BMO",
    slug: "bmo",
    about:
      "BMO provides PDF statements for its US checking, savings and card accounts. Convert a BMO PDF here into Excel, CSV, OFX, QBO or Google Sheets — clean transaction data you can reconcile and share, with no manual entry.",
    downloadSteps: [
      "Sign in to BMO online banking or the BMO mobile app.",
      "Open the account you need — checking, savings or a credit card.",
      "Find the Statements or Documents section for that account.",
      "Choose the statement period (month) you want and download the PDF.",
      "If the PDF is password-protected, keep the password handy — you will enter it once when you upload the file here.",
    ],
    formatsNote:
      "BMO statements arrive as monthly PDFs. ConvertStatement exports Excel (.xlsx), CSV, OFX, QBO for QuickBooks, and Google Sheets — pick one format or several, and you get a separate download for each.",
    faqs: [
      {
        q: "Does this cover BMO accounts in the US?",
        a: "Yes — this page is for BMO statement PDFs, including US accounts. Upload the PDF and the converter detects the bank from the file itself before extracting your transactions.",
      },
      { q: "Can I convert a password-protected BMO statement?", a: passwordAnswer("BMO") },
      { q: "How do I import a BMO statement into QuickBooks?", a: qbAnswer("BMO") },
      { q: "Is my BMO statement data stored?", a: privacyAnswer("BMO") },
      { q: "How much does it cost?", a: pricingAnswer("BMO") },
    ],
    related: ["td-bank", "pnc-bank", "u-s-bank", "wells-fargo"],
  },
  {
    name: "USAA",
    slug: "usaa",
    about:
      "USAA provides PDF statements for its bank accounts and cards, and most members manage everything online or in the app. This page converts a USAA PDF statement into Excel, CSV, OFX, QBO or Google Sheets — ready for budgeting, taxes or your books.",
    downloadSteps: [
      "Sign in to USAA online banking or the USAA mobile app.",
      "Open the account you need — checking, savings or a USAA credit card.",
      "Find the Statements or Documents section for that account.",
      "Choose the statement period (month) you want and download the PDF.",
      "If the PDF is password-protected, keep the password handy — you will enter it once when you upload the file here.",
    ],
    formatsNote:
      "USAA statements arrive as monthly PDFs. ConvertStatement exports Excel (.xlsx), CSV, OFX, QBO for QuickBooks, and Google Sheets — pick one format or several, and you get a separate download for each.",
    faqs: [
      {
        q: "Can I convert USAA credit card statements as well as bank accounts?",
        a: "Yes. USAA bank-account and credit card statements are both PDFs, and both convert here in the same way.",
      },
      { q: "Can I convert a password-protected USAA statement?", a: passwordAnswer("USAA") },
      { q: "How do I import a USAA statement into QuickBooks?", a: qbAnswer("USAA") },
      { q: "Is my USAA statement data stored?", a: privacyAnswer("USAA") },
      { q: "How much does it cost?", a: pricingAnswer("USAA") },
    ],
    related: ["capital-one", "discover-card", "jpmorgan-chase", "wells-fargo"],
  },
  {
    name: "Discover Card",
    slug: "discover-card",
    about:
      "Discover issues a PDF statement for every billing cycle on its credit cards. This page converts a Discover Card PDF into Excel, CSV, OFX, QBO or Google Sheets — so card spending lands in your books or budget as clean rows, not a document to re-type.",
    downloadSteps: [
      "Sign in to Discover online banking or the Discover mobile app.",
      "Open the credit card account you need.",
      "Find the Statements or Documents section for the card.",
      "Choose the billing period (month) you want and download the PDF.",
      "If the PDF is password-protected, keep the password handy — you will enter it once when you upload the file here.",
    ],
    formatsNote:
      "Discover Card statements arrive as monthly PDFs. ConvertStatement exports Excel (.xlsx), CSV, OFX, QBO for QuickBooks, and Google Sheets — pick one format or several, and you get a separate download for each.",
    faqs: [
      {
        q: "What transactions does a converted Discover statement include?",
        a: "The purchases, payments, credits and charges listed on that billing cycle's statement, in date order with their amounts — the same rows you see on the PDF, in spreadsheet columns.",
      },
      { q: "Can I convert a password-protected Discover Card statement?", a: passwordAnswer("Discover Card") },
      { q: "How do I import a Discover Card statement into QuickBooks?", a: qbAnswer("Discover Card") },
      { q: "Is my Discover Card statement data stored?", a: privacyAnswer("Discover Card") },
      { q: "How much does it cost?", a: pricingAnswer("Discover Card") },
    ],
    related: ["capital-one", "citibank", "usaa", "jpmorgan-chase"],
  },
  {
    name: "Huntington Bank",
    slug: "huntington-bank",
    about:
      "Huntington Bank provides PDF statements for its checking, savings and card accounts. Convert a Huntington PDF here into Excel, CSV, OFX, QBO or Google Sheets — structured, reconcilable transactions without the manual typing.",
    downloadSteps: [
      "Sign in to Huntington Bank online banking or the Huntington mobile app.",
      "Open the account you need — checking, savings or a credit card.",
      "Find the Statements or Documents section for that account.",
      "Choose the statement period (month) you want and download the PDF.",
      "If the PDF is password-protected, keep the password handy — you will enter it once when you upload the file here.",
    ],
    formatsNote:
      "Huntington Bank statements arrive as monthly PDFs. ConvertStatement exports Excel (.xlsx), CSV, OFX, QBO for QuickBooks, and Google Sheets — pick one format or several, and you get a separate download for each.",
    faqs: [
      {
        q: "Does this work for Huntington business accounts?",
        a: "Yes — any Huntington account with a PDF statement converts the same way, whether it is personal or business.",
      },
      { q: "Can I convert a password-protected Huntington Bank statement?", a: passwordAnswer("Huntington Bank") },
      { q: "How do I import a Huntington Bank statement into QuickBooks?", a: qbAnswer("Huntington Bank") },
      { q: "Is my Huntington Bank statement data stored?", a: privacyAnswer("Huntington Bank") },
      { q: "How much does it cost?", a: pricingAnswer("Huntington Bank") },
    ],
    related: ["fifth-third", "pnc-bank", "first-citizens-bank", "webster-bank"],
  },
  {
    name: "First Citizens Bank",
    slug: "first-citizens-bank",
    about:
      "First Citizens Bank provides PDF statements for its personal and business accounts. This page converts a First Citizens PDF into Excel, CSV, OFX, QBO or Google Sheets — clean transaction data for reconciliation, reporting or your accountant.",
    downloadSteps: [
      "Sign in to First Citizens Bank online banking or the First Citizens mobile app.",
      "Open the account you need — checking, savings or a credit card.",
      "Find the Statements or Documents section for that account.",
      "Choose the statement period (month) you want and download the PDF.",
      "If the PDF is password-protected, keep the password handy — you will enter it once when you upload the file here.",
    ],
    formatsNote:
      "First Citizens Bank statements arrive as monthly PDFs. ConvertStatement exports Excel (.xlsx), CSV, OFX, QBO for QuickBooks, and Google Sheets — pick one format or several, and you get a separate download for each.",
    faqs: [
      {
        q: "Is First Citizens Bank the same as Citizens Bank?",
        a: "No — they are two different banks, and both are supported. This page is for First Citizens Bank statements; Citizens Bank has its own page. The converter also detects the issuing bank from the uploaded file itself.",
      },
      { q: "Can I convert a password-protected First Citizens Bank statement?", a: passwordAnswer("First Citizens Bank") },
      { q: "How do I import a First Citizens Bank statement into QuickBooks?", a: qbAnswer("First Citizens Bank") },
      { q: "Is my First Citizens Bank statement data stored?", a: privacyAnswer("First Citizens Bank") },
      { q: "How much does it cost?", a: pricingAnswer("First Citizens Bank") },
    ],
    related: ["citizens-bank", "truist", "huntington-bank", "first-horizon"],
  },
  {
    name: "First Horizon",
    slug: "first-horizon",
    about:
      "First Horizon provides PDF statements for its checking, savings and card accounts. Convert a First Horizon PDF here into Excel, CSV, OFX, QBO or Google Sheets — every transaction in order, ready to reconcile or import.",
    downloadSteps: [
      "Sign in to First Horizon online banking or the First Horizon mobile app.",
      "Open the account you need — checking, savings or a credit card.",
      "Find the Statements or Documents section for that account.",
      "Choose the statement period (month) you want and download the PDF.",
      "If the PDF is password-protected, keep the password handy — you will enter it once when you upload the file here.",
    ],
    formatsNote:
      "First Horizon statements arrive as monthly PDFs. ConvertStatement exports Excel (.xlsx), CSV, OFX, QBO for QuickBooks, and Google Sheets — pick one format or several, and you get a separate download for each.",
    faqs: [
      {
        q: "Does this work for First Horizon business accounts?",
        a: "Yes — any First Horizon account that provides a PDF statement converts the same way, personal or business.",
      },
      { q: "Can I convert a password-protected First Horizon statement?", a: passwordAnswer("First Horizon") },
      { q: "How do I import a First Horizon statement into QuickBooks?", a: qbAnswer("First Horizon") },
      { q: "Is my First Horizon statement data stored?", a: privacyAnswer("First Horizon") },
      { q: "How much does it cost?", a: pricingAnswer("First Horizon") },
    ],
    related: ["first-citizens-bank", "regions-bank", "truist", "cadence-bank"],
  },
  {
    name: "Webster Bank",
    slug: "webster-bank",
    about:
      "Webster Bank provides PDF statements for its personal and business accounts. This converter turns a Webster Bank PDF into Excel, CSV, OFX, QBO or Google Sheets files — structured transactions you can work with, instead of a document to copy by hand.",
    downloadSteps: [
      "Sign in to Webster Bank online banking or the Webster Bank mobile app.",
      "Open the account you need — checking, savings or a credit card.",
      "Find the Statements or Documents section for that account.",
      "Choose the statement period (month) you want and download the PDF.",
      "If the PDF is password-protected, keep the password handy — you will enter it once when you upload the file here.",
    ],
    formatsNote:
      "Webster Bank statements arrive as monthly PDFs. ConvertStatement exports Excel (.xlsx), CSV, OFX, QBO for QuickBooks, and Google Sheets — pick one format or several, and you get a separate download for each.",
    faqs: [
      {
        q: "Can I convert Webster Bank statements for a business account?",
        a: "Yes — Webster Bank business and personal statements are both PDFs, and both convert here in the same way.",
      },
      { q: "Can I convert a password-protected Webster Bank statement?", a: passwordAnswer("Webster Bank") },
      { q: "How do I import a Webster Bank statement into QuickBooks?", a: qbAnswer("Webster Bank") },
      { q: "Is my Webster Bank statement data stored?", a: privacyAnswer("Webster Bank") },
      { q: "How much does it cost?", a: pricingAnswer("Webster Bank") },
    ],
    related: ["citizens-bank", "td-bank", "huntington-bank", "first-citizens-bank"],
  },
  {
    name: "Cadence Bank",
    slug: "cadence-bank",
    about:
      "Cadence Bank provides PDF statements for its personal and business accounts. Convert a Cadence Bank PDF here into Excel, CSV, OFX, QBO or Google Sheets — clean, ordered transactions for reconciliation, reporting or tax time.",
    downloadSteps: [
      "Sign in to Cadence Bank online banking or the Cadence Bank mobile app.",
      "Open the account you need — checking, savings or a credit card.",
      "Find the Statements or Documents section for that account.",
      "Choose the statement period (month) you want and download the PDF.",
      "If the PDF is password-protected, keep the password handy — you will enter it once when you upload the file here.",
    ],
    formatsNote:
      "Cadence Bank statements arrive as monthly PDFs. ConvertStatement exports Excel (.xlsx), CSV, OFX, QBO for QuickBooks, and Google Sheets — pick one format or several, and you get a separate download for each.",
    faqs: [
      {
        q: "Does this work for Cadence Bank business accounts?",
        a: "Yes — any Cadence Bank account with a PDF statement converts the same way, whether it is a personal or a business account.",
      },
      { q: "Can I convert a password-protected Cadence Bank statement?", a: passwordAnswer("Cadence Bank") },
      { q: "How do I import a Cadence Bank statement into QuickBooks?", a: qbAnswer("Cadence Bank") },
      { q: "Is my Cadence Bank statement data stored?", a: privacyAnswer("Cadence Bank") },
      { q: "How much does it cost?", a: pricingAnswer("Cadence Bank") },
    ],
    related: ["regions-bank", "first-horizon", "truist", "u-s-bank"],
  },
];

export const TOP_20_SLUGS: string[] = TOP_20_BANKS.map((b) => b.slug);

const BY_SLUG = new Map(TOP_20_BANKS.map((b) => [b.slug, b] as const));

export function getTopBankBySlug(slug: string): TopBank | null {
  return BY_SLUG.get(slug) ?? null;
}

export function getTopBankByName(name: string): TopBank | null {
  return TOP_20_BANKS.find((b) => b.name === name) ?? null;
}
