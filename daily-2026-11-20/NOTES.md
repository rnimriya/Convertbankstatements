# Daily blog run — 2026-11-20 (Fri)

## Rotation
- `bankIndex` 140 → Bank Sinarmas, 141 → Bank Windhoek (deduped SUPPORTED_BANKS). `angleIndex` 2 → import-to-xero. `qbTopicIndex` 28 = queue length (28 topics, 0–27) → **QB queue EXHAUSTED, no QB post today; slot 5 = second bank post** (bankIndex advances by 2). Mix today: 3 trending + 2 bank.
- IndexNow key: fe4e1ad6ecd7fc8c0f83f40e5faddc5a (web/public/fe4e1ad6ecd7fc8c0f83f40e5faddc5a.txt).

## Trend scan (2026-11-20 ~06:30 IST)
- Google Trends US daily RSS: celebrity/politics only (Harrison Ford, Bo French) — nothing domain-relevant.
- Google autocomplete (suggestqueries.google.com, client=firefox), exact suggestions seen:
  - seed "import bank statement" → "import bank statements into quickbooks online", "import bank statement into excel", "import bank statement xero", "import bank statement pdf in tally prime".
  - seed "csv to quickbooks" → "csv to quickbooks converter", "csv to quickbooks desktop", "upload csv to quickbooks", "import csv to quickbooks online".
  - seed "small business tax deductions" → "small business tax deductions checklist", "small business tax deductions worksheet", "small business tax deductions 2026", "small business tax deductions 2025".
  - also checked: "bank statement" (template slug exists — rejected; "bank statements on chime" — near-duplicate of Nov 6 post "bank-statement-from-chime", rejected), "quickbooks online" (login/pricing only), "xero" (shoes dominate; "xero accounting vs quickbooks" — slug "xero-vs-quickbooks" already exists, rejected), "stripe"/"paypal" (login/support only), "pdf to excel" (covered Nov 18–19), "1099" ("1099 vs w2" — slug "1099-vs-w2" already exists, rejected), "tax filing" ("tax filing deadline 2026" — Nov 16 post exists, rejected), "bank reconciliation" (slug exists, rejected), "year end tax" ("year end tax planning 2026" — slug exists, rejected), "receipt to excel" (Nov 16 post exists, rejected), "bookkeeping for small business" (kept as backup — too close to Nov 17 "small-business-accounting-software-free", not used).
- Web search (2026 tax facts, verified 2026-11-20): standard deduction 2026 = $16,100 single / $32,200 MFJ / $24,150 head of household (IRS IR-2025-103, Rev. Proc. 2025-32); business mileage 72.5 cents Jan–Jun 2026, 76 cents Jul–Dec 2026 after mid-year revision; Section 179 limit $2,560,000, phase-out from $4,090,000; QBI 20%, thresholds $201,750 single / $403,500 joint; 1099-NEC threshold $2,000; business meals 50% deductible. Sources: IRS Rev. Proc. 2025-32, IRS Notice 2026-10, multiple CPA roundups agreeing.

## Trending picks
- 01 import-bank-statement-into-xero — kw "import bank statement into xero", evidence: Google autocomplete seed "import bank statement" → "import bank statement xero".
- 02 csv-to-quickbooks — kw "csv to quickbooks", evidence: Google autocomplete seed "csv to quickbooks" → "csv to quickbooks converter", "upload csv to quickbooks".
- 03 small-business-tax-deductions-2026 — kw "small business tax deductions 2026", evidence: Google autocomplete seed "small business tax deductions" → "small business tax deductions 2026" + web search (2026 figures verified above).
- Dedupe: none of the 3 trending slugs/titles appear in SEED+GENERATED posts (exact-slug check), and none repeats or near-duplicates the last 7 days of trending picks (Nov 19: convert-pdf-to-csv-for-quickbooks, w2-form-2026, tax-season-2026-start-date; Nov 18: pdf-to-excel-converter-free, 1099-nec-form-2026, excel-template-for-small-business-accounting; Nov 17: bank-statement-pdf-to-excel, small-business-accounting-software-free; Nov 16: bank-statements-for-rental-application, tax-filing-2026-deadline, receipt-to-excel; Nov 15: small-business-taxes-for-beginners, estimated-tax-payments-2026, bank-statement-meaning; Nov 14: 1099-k-threshold-2026, home-office-deduction-2026, payroll-tax-cap-2026; Nov 13: expense-report-template-excel, small-business-saturday-2026, balance-sheet-template-excel). "import-bank-statement-into-xero" is a Xero how-to, distinct from the Nov 19 QuickBooks CSV post; "csv-to-quickbooks" covers CSV→QBO import (vs Nov 19 PDF→CSV conversion); "small-business-tax-deductions-2026" is a deductions checklist, distinct from Nov 15's beginner taxes overview and Nov 16's deadline post.

## Posts
- 01 import-bank-statement-into-xero — kw "import bank statement into xero", body count 4 (limit 6), H2-with-kw 2, 2134 words, title 53, excerpt 157.
- 02 csv-to-quickbooks — kw "csv to quickbooks", body count 4 (limit 6), H2-with-kw 2, 1915 words, title 50, excerpt 159.
- 03 small-business-tax-deductions-2026 — kw "small business tax deductions 2026", body count 5 (limit 6), H2-with-kw 2, 2077 words, title 54, excerpt 159 (fixed 164→159 during run).
- 04 bank-sinarmas-import-to-xero — kw "bank sinarmas import to xero", 1714 words, title 50, excerpt 151 (fixed 167→151 during run).
- 05 bank-windhoek-import-to-xero — kw "bank windhoek import to xero", 1660 words, title 50, excerpt 157.
- Gates: all 10 pass on all 5 (gates.py FAILS={}).

## Images
- 15/15 generated via media pipeline (3 subagents × 5), all verified on disk 1920×1280 WebP before convert. Convert.py: 15/15, features 1600px, inlines 1200px, all <150 KB (largest: deductions feature 71,752 B).

## Deploy
(TODO — fill after push + live checks)

## GSC
(TODO)
