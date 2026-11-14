# Daily blogs 2026-11-12

## Rotation
- bankIndex 127 -> 128 (Bank of Cyprus, DEDUPED SUPPORTED_BANKS index 127 — raw index 127 is Asia Commercial Bank, but that slug's angle was already published; dedupe-by-slug per spec + 2026-11-10 precedent)
- angleIndex 4 -> 0 (angle today: statements-for-tax-filing; next: convert-to-excel)
- qbTopicIndex 24 -> 25 (topic 24: "QuickBooks Online Reconciliation Beginning Balance Is Wrong — Here's Why", kw "quickbooks online reconciliation beginning balance wrong", linkTo /quickbooks)
- totalPublished 167 -> 172

## Trend scan (evidence)
- Google Trends US daily RSS 2026-11-12: only sports/lawsuit (top: "colin mizuo toenail lawsuit portland", "rob dillingham", college basketball) — no domain-usable trend, same as 2026-11-04..11.
- Google autocomplete (client=firefox, 2026-11-12):
  - seed "w-9 form" -> "w-9 form 2026", "w-9 form 2026 printable", "w-9 form 2026 pdf", "w-9 form download", "w-9 form 2026 fillable"
  - seed "profit and loss statement" -> "profit and loss statement template", "profit and loss statement example", "profit and loss statement template excel", "profit and loss statement pdf"
  - seed "cash flow statement" -> "cash flow statement example", "cash flow statement format", "cash flow statement template", "cash flow statement format in excel"
  - seed "irs 1099" -> "irs 1099 threshold 2026", "irs 1099 form 2026", "irs 1099 limit 2026"
  - seed "stripe payouts" -> "stripe payouts paused", "stripe payouts time", "stripe payouts fees"
- News/fact checks (browser search, 2026-11-12): 1099-NEC threshold $2,000 for 2026 (OBBBA, up from $600); W-9 never filed with IRS, collect before first payment, 24% backup withholding; 1099-NEC due Jan 31, 2027 (Sunday) -> Feb 1, 2027.
- Rejected picks: "1099 form 2026" / "irs 1099 threshold 2026" — 3rd 1099 topic in 9 days, near-duplicate of Nov 3 threshold post + Nov 8 1099-vs-w2; "stripe payouts" — near-duplicate of Nov 3 stripe-payout-reconciliation; "business bank account" — weak product link (we offer no accounts); "sales tax filing" / "expense tracker app" — no matching tool; "quickbooks online reconciliation" — overlaps today's QB post.
- Dedupe: none of the 3 slugs/titles appear in SEED+GENERATED posts, and none repeats or near-duplicates the last 7 days of trending picks (Nov 11: bank statement example, bank statement in spanish, bank reconciliation; Nov 10: irs transcript, xero vs quickbooks, irs direct pay; Nov 9: irs mileage rate 2026, year end tax planning 2026, december 15 tax deadline; Nov 8: 2027 tax brackets, bank statement template, 1099 vs w2; Nov 7: quickbooks online pricing, bank statement as proof of address, bookkeeping certification; Nov 6: bank statement from chime, quickbooks payroll, quickbooks desktop; Nov 5: bank statement mortgage loan, bookkeeping software for small business, pdf to csv converter).

## Posts
- 01 w-9-form-2026 — kw "w-9 form 2026", body count 4, H2-with-kw 2, 1452 words, title 51, excerpt 156.
- 02 profit-and-loss-statement-template-excel — kw "profit and loss statement template excel", body count 4, H2-with-kw 2, 1443 words, title 51, excerpt 160.
- 03 cash-flow-statement — kw "cash flow statement", body count 5, H2-with-kw 3, 1375 words, title 50, excerpt 159.
- 04 bank-of-cyprus-statements-for-tax-filing — kw "bank of cyprus statements for tax filing", 1374 words, title 52, excerpt 159.
- 05 quickbooks-online-reconciliation-beginning-balance-wrong — kw "quickbooks online reconciliation beginning balance wrong", H2-with-kw 2, 1457 words, title 72 (exact topic title, exempted per pipeline), excerpt 152.

## Images
- 15/15 generated via media pipeline (5 feature 1600px + 10 inline 1200px), PIL WebP q80, all <150 KB (largest: cash-flow-statement feature 75,336 B).
- CAUGHT + FIXED: media files land in completion order, NOT call order — the first mtime-sorted conversion mapped 4 images to the wrong posts (w-9 feature/inline-1 swapped; cash-flow-inline-2 <-> bank-of-cyprus-feature/inline-2). Re-did the conversion with an explicit uuid->target map taken from the media tool results; all 15 verified mapped. LESSON: never map generated images by mtime; always use the filename/uuid from the tool result.
- Gate fixes: 4 excerpts trimmed (184/182/174/174 -> 156/160/159/152), re-run clean.

## Deploy — PUSH HELD (see below)
- Commit cd616be created LOCALLY (17 files: generated.ts + rotation + 15 images). tsc clean, all 10 gates pass.
- PUSH NOT DONE: local main sits on top of the unpushed AutoPay Khoj commit 4f1d81e (2026-11-11, "Days 1-8"), and /autopay-audit is still 404 live. Memory/plan says AutoPay is "code local, deploy Day 10" with the Razorpay webhook-secret rotation still awaiting the owner's authenticator verification. Pushing now would deploy AutoPay (incl. live ₹99/₹699 Pro checkout + webhook route change) a day early, before that verification. Held deliberately; push goes with the Day-10 deploy decision (expected 2026-11-13).
- Consequence: today's 5 URLs are NOT live yet (no Vercel deploy, no 200 check, no GitHub deployment record). After the push, verify all 5 URLs return 200, then submit via IndexNow + GSC.
- IndexNow: NOT submitted today (URLs not live yet — submitting now would point Bing at 404s). Submit after the push.
- GSC: 0 submitted — still BLOCKED, unchanged from 2026-11-11: xookad@gmail.com signed out in browser profile, saved password rejected by Google ("Wrong password"), only user-in-person verification left (tap Yes on phone / code to recovery email/phone). Retrying the same rejected password risks lockout, so no new attempt made today. Queue: 117 pending / 22 submitted (today's 5 blog URLs appended to the END of pending per the priority-override rule; punjab-national-bank still on top).
