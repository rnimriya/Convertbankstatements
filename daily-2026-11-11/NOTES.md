# Daily blogs 2026-11-11

## Rotation
- bankIndex 126 -> 127 (Bank of China (Hong Kong), deduped SUPPORTED_BANKS index 126)
- angleIndex 3 -> 4 (angle today: password-protected-pdf; next: statements-for-tax-filing)
- qbTopicIndex 23 -> 24 (topic 23: "QuickBooks Reconciliation Not Matching? Work Through This Checklist", kw "quickbooks reconciliation not matching", linkTo /quickbooks)
- totalPublished 162 -> 167

## Trend scan (evidence)
- Google Trends US daily RSS 2026-11-11: only sports (top: "unc basketball", "ku basketball") — no domain-usable trend, same as 2026-11-04..10.
- Google autocomplete (client=firefox, 2026-11-11):
  - seed "bank statement" -> "bank statement example", "bank statement for rental application", "bank statement in spanish", "bank statement mortgage loan"
  - seed "bank statement example" -> "bank statement example pdf", "bank statement example chase", "bank statement example for apartment"
  - seed "bank statement in spanish" -> "bank statement in spanish translation", "bank statement in spanish example"
  - seed "bank reconciliation" -> "bank reconciliation example", "bank reconciliation template", "bank reconciliation template excel"
  - seed "chase bank statement" -> "chase bank statement pdf", "chase bank statement example", "chase bank statement pdf password"
  - seed "1099 threshold" -> "1099 threshold 2026", "1099 threshold 2026 irs", "1099 threshold changes"
- News/fact checks (browser search, 2026-11-11): 2026 year-end bookkeeping checklists circulating; new 1099-NEC $2,000 threshold for payments made in 2026 (was $600), filing deadline Feb 1, 2027 (podcast 2026-11-10); Q3 Form 941 due Nov 2, 2026 (Oct 31 Saturday), extended Nov 10 if deposits timely; Q4 Form 941 due Feb 1, 2027.
- Rejected picks: "bank statement for rental application" — slug already exists (published earlier); "chase bank statement" — "convert-chase-bank-statement-pdf-to-excel" already exists, near-duplicate; "1099 threshold 2026" — "1099-nec-filing-threshold-2026" already exists (Nov 3); "tax filing deadline 2026" — near-duplicate of Nov 9 "december-15-tax-deadline"; "chase bank statement pdf password" — overlaps today's bank angle (password-protected-pdf).
- Dedupe: none of the 3 slugs/titles appear in SEED+GENERATED posts, and none repeats or near-duplicates the last 7 days of trending picks (Nov 10: irs transcript, xero vs quickbooks, irs direct pay; Nov 9: irs mileage rate 2026, year end tax planning 2026, december 15 tax deadline; Nov 8: 2027 tax brackets, bank statement template, 1099 vs w2; Nov 7: quickbooks online pricing, bank statement as proof of address, bookkeeping certification; Nov 6: bank statement from chime, quickbooks payroll, quickbooks desktop; Nov 5: bank statement mortgage loan, bookkeeping software for small business, pdf to csv converter; Nov 4: quarterly tax due dates, bank statement converter to excel, W-2).

## Posts
- 01 bank-statement-example — kw "bank statement example", body count 4, H2-with-kw 2, 1271 words, title 54, excerpt 155.
- 02 bank-statement-in-spanish — kw "bank statement in spanish", body count 4, H2-with-kw 2, 1218 words, title 55, excerpt 157.
- 03 bank-reconciliation — kw "bank reconciliation", body count 4, H2-with-kw 2, 1379 words, title 50, excerpt 157.
- 04 bank-of-china-hong-kong-password-protected-pdf — kw "bank of china hong kong password protected pdf", 1249 words, title 51, excerpt 152.
- 05 quickbooks-reconciliation-not-matching — kw "quickbooks reconciliation not matching", H2-with-kw 2, 1342 words, title 67 (exact topic title, exempted from 50-60 rule per pipeline), excerpt 154.

## Images
- 15/15 generated via media pipeline (5 feature 1600px + 10 inline 1200px), PIL WebP q80, all <150 KB (largest: quickbooks-reconciliation-not-matching feature 89,568 B). One gate fix: "cheque" removed from post 02 (British spelling), re-run clean.
- Note: my `rm -f web/public/blog/media-generation-*.json` briefly deleted one TRACKED file (media-generation-amex-australia-inline-2-new-1792979023.json); restored with `git checkout --` before committing — not in the commit.

## Deploy
- Commit 0e8bfef pushed via HTTPS to main (f08d5ac..0e8bfef).
- Live-verify: all 5 URLs returned HTTP 200 after the Vercel wait.
- GitHub deployments API check: deployment 7698875837 for 0e8bfef, state success ("Deployment has completed"), environment Production.
- IndexNow: HTTP 200 accepted, all 5 URLs in one submission; key file returns 200.
- GSC (browser task, priority-queue override): 0/12 submitted — BLOCKED on sign-in. Browser was signed in as r.nimriya@gmail.com (no properties); xookad@gmail.com listed as "Signed out". Login agent tried the saved xookad login; Google rejected it ("Wrong password") and now offers only user-in-person verification (tap "Yes" on phone, or code to recovery email ala•••••••••@gmail.com / phone ending •••00). Nothing submitted under either account; no quota message, no generic "Oops!" error. Queue UNCHANGED: 112 pending / 22 submitted; punjab-national-bank still on top; today's 5 blog URLs remain at the END of pending. Owner must sign in to xookad on the browser (or update the saved password) before GSC submissions can resume — retry tomorrow's run after that.
