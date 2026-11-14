# Daily blogs 2026-11-09

## Rotation
- bankIndex 124 -> 125 (Arnagar Bank, deduped SUPPORTED_BANKS index 124)
- angleIndex 1 -> 2 (angle today: convert-to-csv-quickbooks; next: import-to-xero)
- qbTopicIndex 21 -> 22 (topic 21: "How to Add Receipts to QuickBooks Online and Attach Them to Expenses", kw "how to add receipts to quickbooks online", linkTo /tools/free-receipt-to-quickbooks)
- totalPublished 152 -> 157

## QB queue correction (important)
- qbTopicIndex 21 is topic "How to Add Receipts to QuickBooks Online" — NOT "How to Scan Receipts into QuickBooks Online" (that is topic 17, already published 2026-11-05 as gen-2026-11-05-05). The first QB draft was written for the wrong topic and caught by gate 1 (slug duplicate). Rewrote for topic 21. The three receipts images generated for the wrong draft were reused for topic 21 (same photo subjects fit) and saved under the new slug; the Nov 5 images were restored via git checkout after being briefly overwritten.

## Trend scan (evidence)
- Google Trends US daily RSS 2026-11-09: only sports/entertainment (top: "chris godwin", "macaulay culkin") — no domain-usable trend, same as 2026-11-04..08.
- Google autocomplete (client=firefox, 2026-11-09):
  - seed "irs" -> "irs mileage rate 2026" (drill: "irs mileage rate 2026 calculator", "irs mileage rate 2026 per mile", "irs mileage rate 2026 vs 2025")
  - seed "year end tax" -> "year end tax planning 2026" (also "year end tax planning checklist", "year end tax strategies")
  - seed "december tax deadline" -> "december 15 tax deadline" (also "dec 15 tax deadline", "december 31 tax deadline")
- News check (browser search, 2026-11-09): IRS 2026 mileage rates are split-year — 72.5c Jan 1-Jun 30 (Notice 2026-10, IR-2025-128, Dec 29 2025), 76c Jul 1-Dec 31 (Announcement 2026-11, IR-2026-29, Jul 13 2026, higher fuel prices); medical/moving 20.5c H1 / 23.5c H2, charitable 14c; 2025 business rate was 70c. Dec 15, 2026 (Tuesday) is the 4th estimated tax installment for calendar-year C corporations (Apr 15 / Jun 15 / Sep 15 / Dec 15; §6655; $500 threshold; EFTPS; Form 2220; Q4 2026 underpayment rate 7% corp / 9% large corp, IR-2026-98); individuals' Q4 estimate is due Jan 15, 2027.
- Dedupe: none of the 3 slugs/titles appear in SEED+GENERATED posts, and none repeats or near-duplicates the last 7 days of trending picks (Nov 8: 2027 tax brackets, bank statement template, 1099 vs w2; Nov 7: quickbooks online pricing, bank statement as proof of address, bookkeeping certification; Nov 6: bank statement from chime, quickbooks payroll, quickbooks desktop; Nov 5: bank statement mortgage loan, bookkeeping software for small business, pdf to csv converter; Nov 4: quarterly tax due dates, bank statement converter to excel, W-2; Nov 3: 1099-NEC threshold, rental application, stripe payout reconciliation; Nov 2: tax extension deadline, year-end bookkeeping checklist, bank statement loans for self-employed). Note: "year end tax planning 2026" is a tax-strategy angle, distinct from Nov 2's bookkeeping close-out checklist.

## Posts (all gates + no-stuffing passed, tsc clean)
- 01 irs-mileage-rate-2026 — kw "irs mileage rate 2026", body count 5, H2-with-kw 2, 1236 words, title 54, excerpt 153
- 02 year-end-tax-planning-2026 — kw "year end tax planning 2026", body count 4, H2-with-kw 2, 1148 words, title 54, excerpt 158
- 03 december-15-tax-deadline — kw "december 15 tax deadline", body count 6, H2-with-kw 3, 1118 words, title 54, excerpt 157
- 04 arnagar-bank-convert-to-csv-quickbooks — kw "convert arnagar bank statement pdf to csv", 1170 words, title 56, excerpt 156
- 05 how-to-add-receipts-to-quickbooks-online — kw "how to add receipts to quickbooks online", H2-with-kw 2, 1277 words, title 68 (exact topic title, exempted from 50-60 rule per pipeline), excerpt 152

## Images
- 15/15 generated via media pipeline (5 feature 1600px + 10 inline 1200px), converted WebP q80, all <150 KB (largest: december-15-tax-deadline feature 79,412 B). Mapping done by raw-file UUID (parallel generation made mtime order unreliable — first mtime-based pass mismapped several images and was redone with the UUID map from the tool results).

## Deploy
- Commit ed0d47b pushed via HTTPS to main (707e838..ed0d47b).
- Live-verify: all 5 URLs returned HTTP 200.
- GitHub deployments API: deployment 7644687307 for ed0d47b, state success ("Deployment has completed"), environment Production.
- IndexNow: HTTP 200 accepted, all 5 URLs in one submission; key file returns 200.
- GSC: priority-queue override — 0/12 submitted. Browser task (xookad@gmail.com, convertstatement.online property, 125 indexed / 259 not indexed): URL #1 barclays inspected OK ('URL is on Google', last crawl Nov 5, 2026) but 'Request indexing' returned Google's generic error 'Oops! Something went wrong. We had a problem submitting your indexing request' — per pipeline rule, stopped for the day and NOTHING was moved to submitted. Queue stays 113 pending / 11 submitted; barclays still on top for tomorrow. Today's 5 blog URLs sit at the END of pending (IndexNow covered today).
