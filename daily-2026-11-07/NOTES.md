# Daily blogs 2026-11-07

## Rotation
- bankIndex 122 -> 123 (Bank Mandiri, deduped SUPPORTED_BANKS index 122)
- angleIndex 4 -> 0 (angle today: statements-for-tax-filing; next: convert-to-excel)
- qbTopicIndex 19 -> 20 (topic 19: "How to Upload Receipts to QuickBooks Online (App, Email, and File Import)", kw "how to upload receipts to quickbooks online", linkTo /tools/free-receipt-to-quickbooks)
- totalPublished 142 -> 147

## Trend scan (evidence)
- Google Trends US daily RSS 2026-11-07: only entertainment/sports items (top: "atlanta hawks", "the day after tomorrow", "ncaa men's basketball") — no domain-usable trend, same as 2026-11-04/05/06.
- Google autocomplete (client=firefox, 2026-11-07):
  - seed "quickbooks online" -> "quickbooks online pricing" (drill: "quickbooks online pricing plans", "quickbooks online pricing tiers", "quickbooks online pricing comparison")
  - seed "bank statement" -> "bank statement as proof of address" (drill: "bank statement proof of address example", "bank statement proof of address dmv", "bank statement proof of address redact")
  - seed "bookkeeping" -> "bookkeeping certification" (drill: "bookkeeping certification online", "bookkeeping certification online free", "bookkeeping certification cost", "bookkeeping certification quickbooks")
- News check (browser search, 2026-11-07): Intuit raised QBO prices for renewals on/after Aug 1, 2026 — Simple Start $38, Essentials $85 (was $75), Plus $140 (was $115), Advanced $340 (was $275); 50% off first 3 months for new customers; Advanced now includes Bill Pay Elite. Multiple Oct 2026 sources (cfopresso, stackscout, booksgpt). Used as the pricing post's current hook. Prices framed as "list prices shown on Intuit's pricing page in October 2026" with a confirm-before-you-buy note.
- Dedupe: none of the 3 slugs/titles appear in SEED+GENERATED posts, and none repeats or near-duplicates the last 7 days of trending picks (Nov 6: bank statement from chime, quickbooks payroll, quickbooks desktop; Nov 5: bank statement mortgage loan, bookkeeping software for small business, pdf to csv converter; Nov 4: quarterly tax due dates, bank statement converter to excel, W-2; Nov 3: 1099-NEC, rental application, stripe payout reconciliation; Nov 2: tax extension deadline, year-end bookkeeping checklist, bank statement loans for self-employed).

## Posts (all gates + no-stuffing passed, tsc clean)
- 01 quickbooks-online-pricing — kw "quickbooks online pricing", body count 5, H2-with-kw 2, 1172 words, title 51, excerpt 155
- 02 bank-statement-as-proof-of-address — kw "bank statement as proof of address", body count 4, H2-with-kw 2, 1126 words, title 54, excerpt 154
- 03 bookkeeping-certification — kw "bookkeeping certification", body count 5, H2-with-kw 2, 1057 words, title 50, excerpt 158
- 04 bank-mandiri-statements-for-tax-filing — kw "bank mandiri statements for tax filing", 1078 words, title 50, excerpt 154
- 05 how-to-upload-receipts-to-quickbooks-online — kw "how to upload receipts to quickbooks online", H2-with-kw 2, 1096 words, title 73 (exact topic title, exempted from title-length gate per pipeline), excerpt 159

## Images
- 15/15 generated via media pipeline (5 feature 1600px + 10 inline 1200px), converted WebP q80, all <150 KB (largest: quickbooks-online-pricing feature 101,598 B).

## Deploy
- Commit f8abe00 pushed via HTTPS to main (bee8005..f8abe00).
- Live-verify: all 5 URLs returned HTTP 200 after the Vercel wait.
- GitHub deployments API check: deployment 7614496501 for f8abe00, state success ("Deployment has completed"), environment Production.
- IndexNow: HTTP 200 accepted, all 5 URLs in one submission; key file returns 200.
- GSC (browser task, signed in as xookad@gmail.com, property convertstatement.online): 0/5 submitted — every "Request indexing" click failed with Google's own error "Oops! Something went wrong. We had a problem submitting your indexing request. Please try again later." Inspections themselves completed ("URL is not on Google" for all 5); QB + trending #1 retried once, same error. NO daily quota/limit message appeared. Likely a Google-side issue; retry all 5 as backlog in the next run.
