# Daily blog run — 2026-11-17 (Tue)

## Rotation
- `bankIndex` 134 → Bank of Scotland (deduped SUPPORTED_BANKS idx 134), 135 → Bank of the West. `angleIndex` 4 → statements-for-tax-filing. `qbTopicIndex` 28 = queue length (28 topics, 0–27) → **QB queue EXHAUSTED, no QB post today; slot 5 = second bank post** (bankIndex advances by 2). Mix today: 3 trending + 2 bank.
- Yesterday's 5 posts verified live 200 this morning (the 2026-11-16 404 fix in commit 835b991 held). Local main is 1 commit ahead of origin (8db1e9a, notes only) — will push with today's commit.
- IndexNow key: fe4e1ad6ecd7fc8c0f83f40e5faddc5a (web/public/fe4e1ad6ecd7fc8c0f83f40e5faddc5a.txt).

## Trend scan (2026-11-17 ~06:35 IST)
- Google Trends US daily RSS: sports/politics only (butch jones, james comer) — nothing domain-relevant.
- Google autocomplete (suggestqueries.google.com, client=firefox), exact suggestions seen:
  - seed "quickbooks online" → "quickbooks online pricing", "quickbooks online login", "quickbooks online accountant", "quickbooks online test drive".
  - seed "bank statement pdf" → "bank statement pdf to excel", "bank statement pdf to excel converter", "bank statement pdf to csv", "bank statement pdf password".
  - seed "small business accounting" → "small business accounting software free", "small business accounting software", "small business accounting services".
  - also checked: "xero" (no accounting suggestions in top 8 — shoes/xerostomia), "stripe payouts" ("stripe payouts paused", "stripe payouts time"), "1099" ("1099 threshold 2026" — covered 2026-11-14), "tax filing 2026" ("tax filing 2026 deadline" — covered 2026-11-16).
- Web search (QuickBooks pricing Nov 2026): NerdWallet + CFOpresso + Booke AI agree — Simple Start $38, Essentials $85, Plus $140, Advanced $340/mo list; 50% off first 3 months; Essentials/Plus/Advanced raised Aug 1, 2026. First-year totals $399/$892.50/$1,470/$3,570.

## Trending picks
- 01 quickbooks-online-pricing — kw "quickbooks online pricing", evidence: Google autocomplete seed "quickbooks online" + web search (Nov 2026 list prices, sources above).
- 02 bank-statement-pdf-to-excel — kw "bank statement pdf to excel", evidence: Google autocomplete seed "bank statement pdf".
- 03 small-business-accounting-software-free — kw "small business accounting software free", evidence: Google autocomplete seed "small business accounting".
- Dedupe: none of the 3 trending slugs/titles appear in SEED+GENERATED posts, and none repeats or near-duplicates the last 7 days of trending picks (Nov 16: bank-statements-for-rental-application, tax-filing-2026-deadline, receipt-to-excel; Nov 15: small-business-taxes-for-beginners, estimated-tax-payments-2026, bank-statement-meaning; Nov 14: 1099-k-threshold-2026, home-office-deduction-2026, payroll-tax-cap-2026; Nov 13: expense-report-template-excel, small-business-saturday-2026, balance-sheet-template-excel; Nov 12: w-9-form-2026, profit-and-loss-statement-template-excel, cash-flow-statement; Nov 11: bank-statement-example, bank-statement-in-spanish, bank-reconciliation; Nov 10: irs-transcript, xero-vs-quickbooks, irs-direct-pay). "bank-statement-pdf-to-excel" is a different intent from Nov 16's "receipt-to-excel" (bank statements vs receipts) and Nov 11's "bank-statement-example" (conversion vs a sample document).

## Posts
- (to fill after gates)

## Images
- (to fill)

## Deploy
- (to fill)
