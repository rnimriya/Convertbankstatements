# Daily blogs 2026-11-13

## Rotation
- bankIndex 128 -> 129 (Atlantic Union Bank, angle convert-to-excel; slug atlantic-union-bank-convert-to-excel not previously published)
- angleIndex 0 -> 1 (angle today: convert-to-excel; next: convert-to-csv-quickbooks)
- qbTopicIndex 25 -> 27 (REPAIR — see below)
- totalPublished 172 -> 177

## QB queue desync — FOUND + REPAIRED
- qbTopicIndex 25 points at "How to Undo a Reconciliation in QuickBooks Online", but that slug was ALREADY published 2026-11-10 as gen-2026-11-10-05. Root cause: the 2026-11-10 run published topic 25 while recording "qbTopicIndex 22 -> 23" (its NOTES claim topic 22 was undo-reconciliation, but qb-topics.json order is unchanged since then — index 22 has always been "quickbooks-online-reconciliation-discrepancy"). So the pointer lagged the actual published queue by 3, and 11-11/11-12 then published 23/24 correctly, leaving 25 as a duplicate.
- Fix applied today: skipped already-published index 25, published index 26 "The QuickBooks Reconciliation Report, Explained" (kw "quickbooks reconciliation report", linkTo /quickbooks), qbTopicIndex set to 27. Index 22 (discrepancy) remains unpublished and is skipped by the pointer — flagging for the record; the pointer now tracks the queue correctly from 27 (last topic).
- Per spec, a failed QB topic stays at its index — but this topic did not fail gates, it was already live; retrying it daily would stall the slot forever. Skipping the duplicate preserves "one fresh QB topic per day, in queue order".

## Trend scan (evidence)
- Google Trends US daily RSS 2026-11-13: only celebrity/sports (top: "charlie sheen", "ryan seacrest") — no domain-usable trend, same as 2026-11-04..12.
- Google autocomplete (client=firefox, 2026-11-13):
  - seed "expense report template" -> "expense report template excel", "expense report template excel free download"
  - seed "black friday small business" -> "black friday small business saturday", "black friday small business saturday cyber monday"
  - seed "small business saturday" -> "small business saturday 2026", "small business saturday", "small business saturday amex"
  - seed "balance sheet template" -> "balance sheet template excel", "balance sheet template for small business"
  - seed "tax season 2026" -> "tax season 2026 start date", "tax season 2026 deadline" (not picked — overlaps Nov 9 year-end tax planning + Nov 4 W-2/1099 posts)
- News/fact checks (browser search, 2026-11-13): Small Business Saturday 2026 = Saturday, November 28, 2026 (Thanksgiving Nov 26, Black Friday Nov 27); founded by American Express in 2010. IRS mileage 2026 split (72.5c Jan 1–Jun 30, 76c Jul 1–Dec 31) reused from the Nov 9 mileage post.
- Rejected picks: "year end bookkeeping checklist" — slug ALREADY published (in generated.ts); "tax deductions 2026" — overlaps Nov 9 year-end tax planning; "estimated tax payments 2026" — overlaps Nov 4 quarterly-tax-due-dates-2026; "w2 form 2026" — published Nov 4; "1099 nec" — 1099 over-covered (Nov 3/8/12); "bank statement chase" — near-duplicate of Nov 6 chime post; "invoice template" — no matching tool; "receipt scanner" — overlaps QB receipt topics 17-21; "bank reconciliation" — published Nov 11.
- Dedupe: none of the 3 slugs/titles appear in SEED+GENERATED posts, and none repeats or near-duplicates the last 7 days of trending picks (Nov 12: w-9-form-2026, profit-and-loss-statement-template-excel, cash-flow-statement; Nov 11: bank-statement-example, bank-statement-in-spanish, bank-reconciliation; Nov 10: irs-transcript, xero-vs-quickbooks, irs-direct-pay; Nov 9: irs-mileage-rate-2026, year-end-tax-planning-2026, december-15-tax-deadline; Nov 8: 2027-tax-brackets, bank-statement-template, 1099-vs-w2; Nov 7: quickbooks-online-pricing, bank-statement-as-proof-of-address, bookkeeping-certification; Nov 6: bank-statement-from-chime, quickbooks-payroll, quickbooks-desktop).

## Posts
- 01 expense-report-template-excel — kw "expense report template excel", body count 4, H2-with-kw 2, 1564 words, title 51, excerpt 156.
- 02 small-business-saturday-2026 — kw "small business saturday 2026", body count 5, H2-with-kw 2, 1490 words, title 56, excerpt 160.
- 03 balance-sheet-template-excel — kw "balance sheet template excel", body count 4, H2-with-kw 2, 1500 words, title 55, excerpt 153.
- 04 atlantic-union-bank-convert-to-excel — kw "convert atlantic union bank statement pdf to excel", 1393 words, title 50, excerpt 157.
- 05 quickbooks-reconciliation-report-explained — kw "quickbooks reconciliation report", H2-with-kw 2, 1399 words, title 47 (exact topic title, exempted per pipeline), excerpt 155.

## Images
- 15/15 generated via media pipeline (5 feature 1600px + 10 inline 1200px), PIL WebP q80, all <150 KB (largest: small-business-saturday-2026 feature 147,600 B).
- Mapping by explicit uuid from media tool results (convert.py MAP), never mtime — yesterday's lesson applied.
- Gate fixes: all 5 excerpts trimmed to 150-160 (were 164-182), re-run clean.

## Deploy
- (to fill after push) Commit + push + Vercel verification + IndexNow + GSC queue.
- PUSH NOTE: local main carries the unpushed AutoPay Khoj commit 4f1d81e (Days 1-8). Yesterday's hold was explicitly "a day early" with Day-10 deploy expected 2026-11-13 = today, and this run's body orders the push. Pushing today deploys AutoPay (incl. live ₹99/₹699 Pro checkout) together with the Nov 12 + Nov 13 blog batches (10 posts). The webhook-secret rotation + real ₹99 test order still await the owner.

## Deploy — DONE
- Push SUCCEEDED (commit 2ee9fc2 -> origin/main, includes AutoPay 4f1d81e + Nov 12 cd616be + Nov 13 2ee9fc2). GitHub deployment 7754461794, Production, status success ("Deployment has completed").
- Live verify (~4 min after push): ALL 10 blog URLs HTTP 200 (Nov 12's 5 + Nov 13's 5). /autopay-audit HTTP 200 — AutoPay Khoj is LIVE (Day-10 deploy). Webhook-secret rotation + real ₹99 test order still await the owner.
- IndexNow: HTTP 200 accepted for all 10 new blog URLs.
- GSC: browser task delegated (task browser-task:1a2f896c-2fd1-5413-a409-560f2f440c3b) — recovery queue top 11 first; login check first, stop + report if sign-in needed (no password retry). Result pending.
- Indexing queue: 117 pending (Nov 12's 5 were already appended yesterday) + today's 5 appended to END of pending = 122 pending / 22 submitted (before GSC result).
- GSC RESULT: 0/11 submitted — BLOCKED. Browser opened Search Console signed in as r.nimriya@gmail.com (not xookad@gmail.com); the convertstatement.online property is not listed under that account. Per instructions, no sign-in attempt was made (saved xookad password already rejected twice; retry risks lockout). Owner must sign in to Search Console as xookad@gmail.com in person (or grant the property to r.nimriya@gmail.com) before queue submissions can resume. Queue unchanged: 122 pending / 22 submitted.
