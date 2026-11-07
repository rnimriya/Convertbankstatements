# Daily blogs 2026-11-05

## Rotation
- bankIndex 120 -> 121 (Bank Central Asia, deduped SUPPORTED_BANKS index 120)
- angleIndex 2 -> 3 (angle today: import-to-xero; next: password-protected-pdf)
- qbTopicIndex 17 -> 18 (topic 17 published)
- totalPublished 132 -> 137

## Trend scan (evidence)
- Google Trends US daily RSS 2026-11-05: only entertainment/celebrity items
  (top item "rob lowe", 500+ traffic) — no domain-usable trend, same as 2026-11-04.
- Google autocomplete (client=firefox, 2026-11-05):
  - seed "bank statement" -> "bank statement mortgage loan" (also via
    "bank statement mortgage" -> "bank statement mortgage loan", "bank statement
    mortgage lenders", "bank statement mortgage loan requirements")
  - seed "small business accounting" -> "bookkeeping software for small business"
    (via "bookkeeping software for small" -> "bookkeeping software for small
    business", "... free", "... with payroll")
  - seed "pdf to csv" -> "pdf to csv converter", "pdf to csv converter free"
- Dedupe: none of the 3 slugs/titles appear in SEED+GENERATED posts, and none
  repeats or near-duplicates the last 7 days of trending picks (Nov 4: quarterly
  tax due dates, bank statement converter to excel, W-2; Nov 3: 1099-NEC, rental
  application, Stripe payout reconciliation; Nov 2: tax extension deadline,
  year-end bookkeeping checklist, bank statement loans for self-employed).

## Posts (all gates + no-stuffing passed, tsc clean)
- 01 bank-statement-mortgage-loan — kw "bank statement mortgage loan",
  body count 5, H2-with-kw 2, 1181 words, title 54, excerpt 154
- 02 bookkeeping-software-for-small-business — kw "bookkeeping software for
  small business", body count 4, H2-with-kw 2, 1133 words, title 54, excerpt 154
- 03 pdf-to-csv-converter — kw "pdf to csv converter", body count 5,
  H2-with-kw 2, 1034 words, title 52, excerpt 154 (first gates run failed it:
  keyword in only 1 H2; fixed by retitling one H2 to "Choosing a PDF to CSV
  Converter for Accounting Imports", re-run clean)
- 04 bank-central-asia-import-to-xero — Bank Central Asia, angle import-to-xero,
  kw "import bank central asia statements into xero", 987 words, title 58,
  excerpt 153
- 05 how-to-scan-receipts-into-quickbooks-online — QB topic 17, kw "how to scan
  receipts into quickbooks online", linkTo /tools/free-receipt-to-quickbooks
  with keyword anchor text, honest file-based wording (no live sync claim),
  1065 words, title 43 (exact topic title), excerpt 159

## Images
- 15/15 generated via media pipeline (5 feature 1600px + 10 inline 1200px),
  converted WebP q80, all <150 KB (largest: QB feature 148,626 B;
  mortgage inline-1 needed q70, 151,686 B < 153,600 B cap).

## Deploy
- Commit 62688d2 pushed via HTTPS to main (a850dcb..62688d2).
- Live-verify: all 5 URLs returned HTTP 200 after the Vercel wait.
- GitHub deployments API check: unauthenticated request was rate-limited
  (no status returned); the live 200s on all 5 new URLs are the proof the
  deploy served the new commit. No deployment failure evidence.
- IndexNow: HTTP 200 accepted, all 5 URLs in one submission.
- GSC (browser task, signed in as xookad@gmail.com, property already
  selected, no sign-in code needed): all 5 submitted in order QB -> trending
  x3 -> bank, each "Indexing requested". No quota message. 5/5.
- Daily pipeline for 2026-11-05 FULLY closed.
