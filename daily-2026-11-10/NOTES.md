# Daily blogs 2026-11-10

## Rotation
- bankIndex 125 -> 126 (Bank of Bahrain and Kuwait, deduped SUPPORTED_BANKS index 125)
- angleIndex 2 -> 3 (angle today: import-to-xero; next: password-protected-pdf)
- qbTopicIndex 22 -> 23 (topic 22: "How to Undo a Reconciliation in QuickBooks Online", kw "how to undo reconciliation quickbooks online", linkTo /quickbooks)
- totalPublished 157 -> 162

## Bank-index correction (important)
- The spec (task body + BLOG_PIPELINE.md) says dedupe SUPPORTED_BANKS by slug, then take bankIndex. Dedupe-by-slug gives: 118 Bank Alfalah, 119 Bank AL Habib, 120 Bank Central Asia, 121 Bank Gaborone, 122 Bank Mandiri — matching the 2026-11-03..07 run notes exactly.
- The 2026-11-08 run (Apple Card) and 2026-11-09 run (Arnagar Bank) instead used the RAW list index (Apple Card raw 123, Arnagar raw 124), deviating from the spec. That skipped deduped banks 123 (Bank Mega) and 124 (Bank Neo Commerce) — they were never published.
- This run follows the spec: deduped index 125 = Bank of Bahrain and Kuwait. Bank Mega / Bank Neo Commerce remain skipped unless the owner orders a catch-up.

## Trend scan (evidence)
- Google Trends US daily RSS 2026-11-10: only sports/entertainment (top: "justin jefferson", "adrian peterson", "mlb awards") — no domain-usable trend, same as 2026-11-04..09.
- Google autocomplete (client=firefox, 2026-11-10):
  - seed "irs transcript" -> "irs transcripts online", "irs transcript request", "irs transcript login"
  - seed "xero vs quickbooks" -> "xero vs quickbooks for small business", "xero vs quickbooks online", "xero vs quickbooks reddit"
  - seed "irs direct pay" -> "irs direct pay estimated tax", "irs direct pay login", "irs direct pay look up a payment"
- News/fact checks (browser search, 2026-11-10): IRS Direct Pay free, no account, Estimated Tax -> 1040ES -> tax period 2026, identity verified against a prior-year return, checking/savings only, schedule up to 365 days ahead, change/cancel up to 2 business days before with confirmation number; EFTPS stopped new individual enrollments Oct 17, 2025. Xero US prices from Oct 1, 2026: Early $27, Growing $59, Established $97, unlimited users; QBO Simple Start $38, Essentials $85, Plus $140, Advanced $340 (Aug 1, 2026 renewal change); Xero Payroll powered by Gusto $36/mo + $6/person. IRS transcript: 5 types free, online via IRS Individual Online Account (ID.me/Login.gov), return transcript current + 3 prior years, account transcript current + 9 prior online, by mail 5-10 days, phone 800-908-9946, Form 4506-T.
- Dedupe: none of the 3 slugs/titles appear in SEED+GENERATED posts, and none repeats or near-duplicates the last 7 days of trending picks (Nov 9: irs mileage rate 2026, year end tax planning 2026, december 15 tax deadline; Nov 8: 2027 tax brackets, bank statement template, 1099 vs w2; Nov 7: quickbooks online pricing, bank statement as proof of address, bookkeeping certification; Nov 6: bank statement from chime, quickbooks payroll, quickbooks desktop; Nov 5: bank statement mortgage loan, bookkeeping software for small business, pdf to csv converter; Nov 4: quarterly tax due dates, bank statement converter to excel, W-2; Nov 3: 1099-NEC threshold, rental application, stripe payout reconciliation). Note: "irs direct pay" is a payment-method angle, distinct from Nov 9's "december 15 tax deadline" (corporate deadline dates, EFTPS).

## Posts (all gates + no-stuffing passed, tsc clean)
- 01 irs-transcript — kw "irs transcript", body count 6, H2-with-kw 3, 1172 words, title 52, excerpt 157. Gate fix: H2 "IRS Transcript by Mail or Phone" renamed to "Getting Your Transcript by Mail or Phone" (count was 7).
- 02 xero-vs-quickbooks — kw "xero vs quickbooks", body count 5, H2-with-kw 3, 1114 words, title 51, excerpt 157.
- 03 irs-direct-pay — kw "irs direct pay", body count 6, H2-with-kw 3, 1190 words, title 51, excerpt 157. Gate fix: H2 "Proving the Payment: IRS Direct Pay and Your Records" renamed, Step 1 "IRS Direct Pay page" -> "Direct Pay page on IRS.gov", FAQ "Can I schedule a payment in advance with IRS Direct Pay?" -> "Can I schedule a payment in advance?" (count was 9).
- 04 bank-of-bahrain-and-kuwait-import-to-xero — kw "import bank of bahrain and kuwait statement to xero", 1201 words, title 51, excerpt 152.
- 05 how-to-undo-reconciliation-in-quickbooks-online — kw "how to undo reconciliation quickbooks online", H2-with-kw 2, 1281 words, title 49 (exact topic title, exempted from 50-60 rule per pipeline), excerpt 153. Gate fix: 2 H2s rewritten to carry the exact keyword phrase (topic keyword lacks "in", so the natural "in QuickBooks" H2s did not match).

## Images
- 15/15 generated via media pipeline (5 feature 1600px + 10 inline 1200px), converted WebP q80, all <150 KB (largest: irs-direct-pay feature 85,998 B). Mapping done by UUID from tool results (call order), not mtime.
- posts.py repair note: an edit-tool mishap inserted posts 03-05 inside post 01's tags line; the file was reassembled with a Python marker-based repair and re-verified by import + gates before appending.

## Deploy
- Commit f08d5ac pushed via HTTPS to main (ed0d47b..f08d5ac).
- Live-verify: all 5 URLs returned HTTP 200 after the Vercel wait.
- GitHub deployments API check: deployment 7670729391 for f08d5ac, state success ("Deployment has completed"), environment Production.
- IndexNow: HTTP 200 accepted, all 5 URLs in one submission; key file returns 200.
- GSC (browser task, signed in as xookad@gmail.com, property convertstatement.online; note: browser first opened under alablafla007/aivideoprompt.online and was switched to xookad/convertstatement.online): priority-queue override — 11/12 submitted, each "Indexing requested" (barclays, bbva, canara-bank, cibc, commerzbank, commonwealth-bank-cba, ing-bank, intesa-sanpaolo, lloyds-bank, national-australia-bank-nab, nationwide). Stopped at #12 punjab-national-bank: Google "Quota Exceeded" daily-quota message (inspection completed, "URL is not on Google"). Yesterday's generic "Oops! Something went wrong" error did NOT recur — barclays accepted today. Queue now 107 pending / 22 submitted; next top: punjab-national-bank, rabobank, royal-bank-of-canada-rbc. Today's 5 new blog URLs sit at the END of pending (submitted via IndexNow today; GSC turn comes when the queue drains).
