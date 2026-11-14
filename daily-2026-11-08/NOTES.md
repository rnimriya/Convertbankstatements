# Daily blogs 2026-11-08

## Rotation
- bankIndex 123 -> 124 (Apple Card, deduped SUPPORTED_BANKS index 123)
- angleIndex 0 -> 1 (angle today: convert-to-excel; next: convert-to-csv-quickbooks)
- qbTopicIndex 20 -> 21 (topic 20: "Receipt Scanner for QuickBooks: How to Choose the Right Option", kw "best receipt scanner for quickbooks online", linkTo /tools/free-receipt-to-quickbooks)
- totalPublished 147 -> 152

## Trend scan (evidence)
- Google Trends US daily RSS 2026-11-08: only sports/entertainment items (top: "magic vs warriors", "vanderbilt football", "michigan football score") — no domain-usable trend, same as 2026-11-04/05/06/07.
- Google autocomplete (client=firefox, 2026-11-08):
  - seed "irs" -> "irs 2027 tax brackets" (drill: "irs 2027 tax brackets" in suggestions)
  - seed "bank statement" -> "bank statement template" (drill: "bank statement template pdf", "bank statement template free", "bank statement template excel")
  - seed "1099" -> "1099 vs w2" (drill: "1099 vs w2 which is better for employee 2026", "1099 vs w2 calculator", "1099 vs w2 taxes")
- News check (browser search, 2026-11-08): IRS announced tax year 2027 inflation adjustments on Nov 5, 2026 (IR-2026-133, Rev. Proc. 2026-35) — standard deduction $16,600 single / $33,200 joint / $24,925 head of household; top 37% rate above $661,375 single / $793,650 joint; child tax credit max $2,300; applies to income earned in 2027 (returns filed in 2028). Figures used in the 2027-tax-brackets post are from that announcement.
- Dedupe: none of the 3 slugs/titles appear in SEED+GENERATED posts, and none repeats or near-duplicates the last 7 days of trending picks (Nov 7: quickbooks online pricing, bank statement as proof of address, bookkeeping certification; Nov 6: bank statement from chime, quickbooks payroll, quickbooks desktop; Nov 5: bank statement mortgage loan, bookkeeping software for small business, pdf to csv converter; Nov 4: quarterly tax due dates, bank statement converter to excel, W-2; Nov 3: 1099-NEC threshold, rental application, stripe payout reconciliation; Nov 2: tax extension deadline, year-end bookkeeping checklist, bank statement loans for self-employed).

## Posts (all gates + no-stuffing passed, tsc clean)
- 01 2027-tax-brackets — kw "2027 tax brackets", body count 4, H2-with-kw 2, 1115 words, title 58, excerpt 156
- 02 bank-statement-template — kw "bank statement template", body count 5, H2-with-kw 2, 1047 words, title 56, excerpt 152
- 03 1099-vs-w2 — kw "1099 vs w2", body count 4, H2-with-kw 2, 1057 words, title 50, excerpt 151
- 04 apple-card-convert-to-excel — kw "convert apple card bank statement pdf to excel", 991 words, title 53, excerpt 160
- 05 receipt-scanner-for-quickbooks-how-to-choose — kw "best receipt scanner for quickbooks online", H2-with-kw 2, 1134 words, title 62 (exact topic title, exempted from 50-60 rule per pipeline), excerpt 157

## Images
- 15/15 generated via media pipeline (5 feature 1600px + 10 inline 1200px), converted WebP q80, all <150 KB (largest: 1099-vs-w2 feature 63,502 B).

## Deploy
- Commit 707e838 pushed via HTTPS to main (98f665c..707e838).
- Live-verify: all 5 URLs returned HTTP 200 after the Vercel wait.
- GitHub deployments API check: deployment 7629584808 for 707e838, state success ("Deployment has completed"), environment Production.
- IndexNow: HTTP 200 accepted, all 5 URLs in one submission; key file returns 200.
- GSC (browser task, signed in as xookad@gmail.com, property convertstatement.online): priority-queue override — 11/12 submitted, each "Indexing requested" (pricing, hdfc-bank, jpmorgan-chase, bank-of-america, citibank, hsbc, state-bank-of-india-sbi, icici-bank, kotak-mahindra-bank, axis-bank, bank-of-baroda). Stopped at #12 barclays: Google "Quota Exceeded" daily-quota message (barclays was already indexed, so only its re-request was skipped). Queue now 108 pending / 11 submitted; next top: barclays, bbva, canara-bank. Today's 5 new blog URLs sit at the END of pending (submitted via IndexNow today; GSC turn comes when the queue drains).
