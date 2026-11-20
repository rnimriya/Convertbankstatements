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
- 01 convert-pdf-to-csv-for-quickbooks — kw "convert pdf to csv for quickbooks", body count 4 (limit 6), H2-with-kw 2, 1642 words, title 52, excerpt 155.
- 02 w2-form-2026 — kw "w2 form 2026", body count 4, H2-with-kw 2, 1480 words, title 51, excerpt 151.
- 03 tax-season-2026-start-date — kw "tax season 2026 start date", body count 4, H2-with-kw 2, 1393 words, title 51, excerpt 155 (fixed 148→155 during run).
- 04 bank-polski-convert-to-csv-quickbooks — kw "bank polski convert to csv quickbooks", 1282 words, title 51, excerpt 150.
- 05 banksa-convert-to-csv-quickbooks — kw "banksa convert to csv quickbooks", 1253 words, title 52, excerpt 152.
- Gates: all 10 pass on all 5 (gates.py FAILS={}).

## Images
- 15/15 generated via media pipeline (3 subagents × 5), all verified on disk 1920×1280 WebP before convert. Convert.py: 15/15, features 1600px, inlines 1200px, all <150 KB (largest: banksa feature 100,232 B).

## Deploy
- Commit 794117c pushed via HTTPS (3645647..794117c main -> main). tsc clean.
- Live checks ~4 min after push: all 5 new blog URLs 200 on www.convertstatement.online; homepage 200.
- GitHub deployments API: unauthenticated request rate-limited (shared egress IP) — no deployment record checked. Live URL checks are the proof of deploy (same as Nov 15–18; Amit-team project creates no GitHub deployment records).
- IndexNow: HTTP 200 accepted for all 5 new URLs (key fe4e1ad6ecd7fc8c0f83f40e5faddc5a verified live).
- Rotation: bankIndex 138→140, angleIndex 1→2, qbTopicIndex stays 28 (QB queue exhausted), totalPublished 201→206.
- Indexing queue: 135 pending / 33 submitted → 140 pending (today's 5 at END of pending).

## GSC
- Browser opened on seowalabhai009@gmail.com (calcunit.net) — switched to xookad@gmail.com via account menu, then selected URL-prefix property https://www.convertstatement.online/ (no access to sc-domain property, as before).
- 10/12 queue URLs ACCEPTED (indexing requested, "added to a priority crawl queue"): /banks/westpac (no "Oops!" error this time — yesterday's blocker is GONE), /banks/paytm-payments-bank, /banks/td-bank-canada, /banks/deutsche-bank, /banks/natwest, /guides/bank-statement-for-loans-and-visas, /guides/bank-statement-reconciliation-accountants, /guides/convert-bank-statement-to-csv, /compare/nanonets, /blog/quickbooks-online-pricing.
- Quota hit on #11 /blog/how-to-upload-receipts-to-quickbooks-online — Google dialog "Quota Exceeded... exceeded your daily quota. Please try submitting this again tomorrow." Stopped per rule; #12 /blog/bank-statement-as-proof-of-address not attempted. Both stay at top of queue for tomorrow.
- Queue after: 130 pending / 43 submitted. Today's 5 new blog URLs remain at END of pending (submitted via IndexNow only today).
