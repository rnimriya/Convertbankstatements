# Daily blogs 2026-11-06

## Rotation
- bankIndex 121 -> 122 (Bank Gaborone, deduped SUPPORTED_BANKS index 121)
- angleIndex 3 -> 4 (angle today: password-protected-pdf; next: statements-for-tax-filing)
- qbTopicIndex 18 -> 19 (topic 18 published: "QuickBooks Receipt Capture: How It Works and When You Need More", kw "quickbooks receipt capture", linkTo /tools/free-receipt-to-quickbooks)
- totalPublished 137 -> 142

## Trend scan (evidence)
- Google Trends US daily RSS 2026-11-06: only entertainment/sports items (top: "erin burnett", "nate boerkircher", "pitt basketball") — no domain-usable trend, same as 2026-11-04/05.
- Google autocomplete (client=firefox, 2026-11-06):
  - seed "bank statement" -> "bank statement from chime" (drill: "get bank statement from chime", "download bank statement from chime")
  - seed "quickbooks" -> "quickbooks payroll" (drill: "quickbooks payroll pricing", "quickbooks payroll login") and "quickbooks desktop" (drill: "quickbooks desktop pricing", "quickbooks desktop download")
- News check (browser search, 2026-11-06): Intuit's 2026 federal withholding tax tables page (quickbooks.intuit.com/payroll/federal-withholding-tax-table/) — OBBBA changes, Social Security wage base projected $184,500 in 2026 (up from $176,100 in 2025), new Form W-4, Q3 941 due Nov 2 2026, year-end reporting Feb 2 2027. Used as the payroll post's current hook. Also noted: 1099-NEC threshold $2,000 for 2026, forms due Feb 1 2027 (adminbooks.com 2026 guide).
- Dedupe: none of the 3 slugs/titles appear in SEED+GENERATED posts, and none repeats or near-duplicates the last 7 days of trending picks (Nov 5: bank statement mortgage loan, bookkeeping software for small business, pdf to csv converter; Nov 4: quarterly tax due dates, bank statement converter to excel, W-2; Nov 3: 1099-NEC, rental application, Stripe payout reconciliation; Nov 2: tax extension deadline, year-end bookkeeping checklist, bank statement loans for self-employed).

## Posts (all gates + no-stuffing passed, tsc clean)
- 01 bank-statement-from-chime — kw "bank statement from chime", body count 5, H2-with-kw 2, 1145 words, title 55, excerpt 156
- 02 quickbooks-payroll — kw "quickbooks payroll", body count 6, H2-with-kw 2, 1125 words, title 58, excerpt 159 (initial gate fail: stuffing count 9 — 3 FAQ questions reworded to drop the phrase, kept 1 FAQ use)
- 03 quickbooks-desktop — kw "quickbooks desktop", body count 5, H2-with-kw 2, 1114 words, title 58, excerpt 152 (initial gate fail: stuffing count 10 — 3 body + 3 FAQ uses reworded)
- 04 bank-gaborone-password-protected-pdf — kw "convert bank gaborone password protected pdf to excel", 1123 words, title 53, excerpt 155 (passed first run)
- 05 quickbooks-receipt-capture-how-it-works — kw "quickbooks receipt capture", H2-with-kw 2, 1167 words, title 63 (exact topic title), excerpt 160

## Images
- 15/15 generated via media pipeline (5 feature 1600px + 10 inline 1200px), converted WebP q80, all <150 KB (largest: chime feature 90,990 B).

## Deploy
- Commit bee8005 pushed via HTTPS to main (2ad5180..bee8005).
- Live-verify: all 5 URLs returned HTTP 200 after the Vercel wait.
- GitHub deployments API check: deployment 7589668986 for bee8005, state success ("Deployment has completed"), environment Production.
- IndexNow: HTTP 200 accepted, all 5 URLs in one submission.
- GSC (browser task, signed in as xookad@gmail.com, property switched from naukrihelp.com to convertstatement.online): all 5 submitted in order QB -> trending x3 -> bank, each "Indexing requested". No quota message. 5/5.
- Daily pipeline for 2026-11-06 FULLY closed.
