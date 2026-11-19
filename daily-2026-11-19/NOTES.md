# Daily blog run — 2026-11-19 (Thu)

## Rotation
- `bankIndex` 138 → Bank Polski, 139 → BankSA (deduped SUPPORTED_BANKS). `angleIndex` 1 → convert-to-csv-quickbooks. `qbTopicIndex` 28 = queue length (28 topics, 0–27) → **QB queue EXHAUSTED, no QB post today; slot 5 = second bank post** (bankIndex advances by 2). Mix today: 3 trending + 2 bank.
- IndexNow key: fe4e1ad6ecd7fc8c0f83f40e5faddc5a (web/public/fe4e1ad6ecd7fc8c0f83f40e5faddc5a.txt).

## Trend scan (2026-11-19 ~06:30 IST)
- Google Trends US daily RSS: sports/celebrity only (Sophie Cunningham, soldier/GTA VI) — nothing domain-relevant.
- Google autocomplete (suggestqueries.google.com, client=firefox), exact suggestions seen:
  - seed "convert pdf to csv" → "convert pdf to csv for quickbooks", "convert pdf to csv bank statement free", "convert pdf to csv for free", "convert pdf to csv google sheets".
  - seed "w2 form" → "w2 form 2026", "w2 form 2026 printable", "w2 form pdf", "w2 form for employee to fill out".
  - seed "tax season 2026" → "tax season 2026 start date", "tax season 2026 deadline", "tax season 2026 schedule", "tax season 2026 child tax credit".
  - also checked: "bank statement" (template slug already exists in generated.ts — rejected), "quickbooks" (login/workforce only), "1099 form" (1099 form 2026 — too close to yesterday's 1099-NEC post, rejected), "1099 misc" (misc vs nec — near-duplicate of yesterday, rejected), "receipt scanner" ("receipt scanner for quickbooks" — backup, not used; receipt-to-excel published Nov 16), "pdf to excel" (converter free — yesterday's pick 01, rejected), "small business accounting" (software free published Nov 17 — rejected), "bookkeeping" (jobs/certification — weak tool link), "excel budget template" (too generic, weak tool link), "quickbooks online pricing" (pricing-page intent, no honest tool link — rejected).
- Web search (tax season facts, verified): IRS has NOT announced the 2027 filing-season opening date yet (checked Nov 1, 2026 — fedratecalc, The College Investor, govtschemes agree). Last four seasons opened on a Monday Jan 23–29: Jan 26, 2026 (IR-2026-02, announced Jan 8, 2026), Jan 27, 2025, Jan 29, 2024, Jan 23, 2023. Expected 2027 opening ~Jan 25–27, 2027 (estimate, NOT confirmed). Deadline Apr 15, 2027 (Thursday). W-2 copies due to employees Feb 1, 2027 (Jan 31 is a Sunday).

## Trending picks
- 01 convert-pdf-to-csv-for-quickbooks — kw "convert pdf to csv for quickbooks", evidence: Google autocomplete seed "convert pdf to csv".
- 02 w2-form-2026 — kw "w2 form 2026", evidence: Google autocomplete seed "w2 form" + web search (W-2 due Feb 1, 2027).
- 03 tax-season-2026-start-date — kw "tax season 2026 start date", evidence: Google autocomplete seed "tax season 2026" + web search (IRS not yet announced; 2026 season opened Jan 26, 2026; 2027 opening expected late Jan 2027; Apr 15, 2027 deadline).
- Dedupe: none of the 3 trending slugs/titles appear in SEED+GENERATED posts (exact-slug check), and none repeats or near-duplicates the last 7 days of trending picks (Nov 18: pdf-to-excel-converter-free, 1099-nec-form-2026, excel-template-for-small-business-accounting; Nov 17: bank-statement-pdf-to-excel, small-business-accounting-software-free; Nov 16: bank-statements-for-rental-application, tax-filing-2026-deadline, receipt-to-excel; Nov 15: small-business-taxes-for-beginners, estimated-tax-payments-2026, bank-statement-meaning; Nov 14: 1099-k-threshold-2026, home-office-deduction-2026, payroll-tax-cap-2026; Nov 13: expense-report-template-excel, small-business-saturday-2026, balance-sheet-template-excel; Nov 12: w-9-form-2026, profit-and-loss-statement-template-excel, cash-flow-statement). "convert-pdf-to-csv-for-quickbooks" is a different format/intent from Nov 18's PDF-to-Excel converter post; "w2-form-2026" is a different form from Nov 12's W-9 and yesterday's 1099-NEC; "tax-season-2026-start-date" covers the season opening (vs Nov 16's deadline post) and states clearly the 2027 date is not yet announced.

## Posts
(TODO — fill after gates)

## Images
(TODO)

## Deploy
(TODO)
