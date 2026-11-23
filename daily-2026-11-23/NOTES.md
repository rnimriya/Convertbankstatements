# Daily blog run — 2026-11-23 (Mon)

## Rotation
- `bankIndex` 146 → Banque Populaire, 147 → Banque Populaire Doujda (deduped SUPPORTED_BANKS, verified mapping matches prior runs: 144 Banque CIC, 145 Banque Laurentienne). `angleIndex` 0 → convert-to-excel. `qbTopicIndex` 28 = queue length (28 topics, 0–27) → **QB queue EXHAUSTED, no QB post today; slot 5 = second bank post** (bankIndex advances by 2). Mix today: 3 trending + 2 bank.
- IndexNow key: fe4e1ad6ecd7fc8c0f83f40e5faddc5a (web/public/fe4e1ad6ecd7fc8c0f83f40e5faddc5a.txt).

## Trend scan (2026-11-23 ~06:30 IST)
- Google Trends US daily RSS: sports/celebrity + Black Friday shopping only (college football, NBA, Marvel trailer, Lowes Black Friday deals) — nothing domain-relevant.
- Google autocomplete (suggestqueries.google.com, client=firefox), exact suggestions seen:
  - seed "bank statement for" → "bank statement for proof of address", "bank statement for proof of residency", "bank statement for apartment application", "bank statement for rental application".
  - seed "bookkeeping for" → "bookkeeping for beginners", "bookkeeping for small business", "bookkeeping for nonprofits", "bookkeeping for dummies".
  - seed "quickbooks payroll" → "quickbooks payroll pricing", "quickbooks payroll login", "quickbooks payroll support phone number".
  - rejected: "how to reconcile a bank statement" (seed post how-to-reconcile-bank-statement already exists — near-duplicate), "bank statement for apartment application" (near-duplicate of Nov 16 bank-statements-for-rental-application), "bookkeeping certification" (slug exists), "bank statement mortgage loan" (slug exists), "quickbooks online pricing" (slug live since 2026-11-07), "receipt scanner app free" (near-duplicate of Nov 21 receipt-scanner-for-taxes).
- Web search (QuickBooks Payroll pricing, verified 2026-11-23): list prices Core $50/mo base, Premium $88, Elite $134; per-employee figures vary by source ($6.50–$7 / $10–$13 / $12–$17) after Intuit's mid-2026 rebrand of QuickBooks Online Payroll to QuickBooks Workforce. Article presents ranges + "check Intuit's page" caveat; no single figure stated as certain.

## Trending picks
- 01 bank-statement-for-proof-of-address — kw "bank statement for proof of address", evidence: Google autocomplete seed "bank statement for" → "bank statement for proof of address" / "bank statement for proof of residency".
- 02 bookkeeping-for-beginners — kw "bookkeeping for beginners", evidence: Google autocomplete seed "bookkeeping for" → "bookkeeping for beginners".
- 03 quickbooks-payroll-pricing — kw "quickbooks payroll pricing", evidence: Google autocomplete seed "quickbooks payroll" → "quickbooks payroll pricing"; pricing verified via web search (see above).
- Dedupe: none of the 3 trending slugs/titles appear in SEED+GENERATED posts (exact-slug check), and none repeats or near-duplicates the last 7 days of trending picks (Nov 22: tax-season-2027, bookkeeping-for-freelancers, 1099-deadline-2027; Nov 21: small-business-accounting-software-without-subscription, business-expense-tracker-excel, receipt-scanner-for-taxes; Nov 20: import-bank-statement-into-xero, csv-to-quickbooks, small-business-tax-deductions-2026; Nov 19: convert-pdf-to-csv-for-quickbooks, w2-form-2026, tax-season-2026-start-date; Nov 18: pdf-to-excel-converter-free, 1099-nec-form-2026, excel-template-for-small-business-accounting; Nov 17: bank-statement-pdf-to-excel, small-business-accounting-software-free; Nov 16: bank-statements-for-rental-application, tax-filing-2026-deadline, receipt-to-excel).

## Posts
- 01 bank-statement-for-proof-of-address (David Chen, CPA) — 2,041 words, kw count 6 (at limit, passes), H2s with kw 3. All gates PASS.
- 02 bookkeeping-for-beginners (Sarah Mitchell) — 1,830 words, kw count 4. All gates PASS.
- 03 quickbooks-payroll-pricing (James Park) — 1,702 words, kw count 4. All gates PASS.
- 04 banque-populaire-convert-to-excel (David Chen, CPA) — 1,582 words. All gates PASS.
- 05 banque-populaire-doujda-convert-to-excel (Sarah Mitchell) — 1,549 words. All gates PASS.
- Rotation after run: bankIndex 148, angleIndex 1 (convert-to-csv-quickbooks), qbTopicIndex 28 (exhausted), totalPublished 226. tsc --noEmit PASS (exit 0).
- Fixes during run: 4 excerpts out of 150–160 range on first check (163, 174, 162, 146) — trimmed/expanded before gates; gates re-run clean. convert.py/gates.py MAP patches glued `}` to the next line (same one-char bug twice) — fixed with a newline insert before running.

## Images
- 15/15 generated (5 feature 1600px + 10 inline 1200px), all WebP q80, all <150 KB (27–87 KB), all unique photorealistic scenes, no text/logos. Converted via daily-2026-11-23/convert.py. Note: image agent B hit the 4-images-per-response cap and missed t04-feature-banque-populaire; parent generated it directly with media.generate_image.

## Deploy
- Commit b733cc8 pushed to origin main (HTTPS) — "Daily blogs 2026-11-23: 3 trending + 2 bank articles (convert-to-excel); QB queue exhausted".
- Live check after ~4 min: all 5 URLs return HTTP 200: /blog/bank-statement-for-proof-of-address, /blog/bookkeeping-for-beginners, /blog/quickbooks-payroll-pricing, /blog/banque-populaire-convert-to-excel, /blog/banque-populaire-doujda-convert-to-excel.
- IndexNow: HTTP 200 accepted for all 5 new URLs (key fe4e1ad6ecd7fc8c0f83f40e5faddc5a; key file itself 200).
- GSC: browser task 6:49–6:52 AM IST, signed in as xookad@gmail.com (switched from seowalabhai009@gmail.com via account menu), property https://www.convertstatement.online/ (290 indexed, 345 not indexed). 0 submitted — first queue URL (kotak-811-account-statement) inspected OK ("Crawled - currently not indexed", last crawl Aug 18, 2026) but "Request indexing" returned Google's generic "Oops! Something went wrong" error; stopped per spec, URLs 2–12 not attempted. Queue unchanged: 139 pending / 54 submitted (today's 5 new URLs at the END of pending). Retry tomorrow. IndexNow already accepted all 5 new URLs, so Bing/Yandex indexing is covered despite the GSC error.
