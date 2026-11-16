# Daily blog run — 2026-11-16 (Mon)

## Rotation
- `bankIndex` 132 → Bank of Melbourne (deduped SUPPORTED_BANKS idx 132), 133 → Bank of New Zealand. `angleIndex` 3 → password-protected-pdf. `qbTopicIndex` 28 = queue length (28 topics, 0–27) → **QB queue EXHAUSTED, no QB post today; slot 5 = second bank post** (bankIndex advances by 2). Mix today: 3 trending + 2 bank.
- Repo: `git pull --rebase` blocked by unstaged yesterday-notes edit in daily-2026-11-15/NOTES.md → stashed, pulled (already up to date), popped. Will commit that file with today's commit.
- Production domain LIVE again: https://www.convertstatement.online/ 200 and yesterday's /blog/small-business-taxes-for-beginners 200 (domain move to Amit-team project completed 2026-11-15 ~10:30 IST; yesterday's 402 is gone).
- IndexNow key: fe4e1ad6ecd7fc8c0f83f40e5faddc5a (web/public/fe4e1ad6ecd7fc8c0f83f40e5faddc5a.txt).

## Trend scan (2026-11-16 ~06:35 IST)
- Google Trends US daily RSS: all sports (steelers schedule, cowboys coach, carmelo anthony) — nothing domain-relevant.
- Google autocomplete (suggestqueries.google.com, client=firefox), exact suggestions seen:
  - seed "bank statement" → "bank statements for rental application", "bank statements for apartment application", "bank statement as proof of address" (latter slug already exists), "bank statement converter", "bank statement meaning".
  - seed "tax filing 2026" → "tax filing 2026 deadline", "tax filing 2026 dates", "tax filing 2026 guide".
  - seed "receipt to excel" → "receipt to excel converter", "receipt to excel app", "receipt to excel scanner", "scan receipt to excel", "receipt photo to excel", "convert receipt to excel free".
  - also checked: "1099" → 1099 nec (slug 1099-nec-filing-threshold-2026 already exists), "quickbooks online pricing" (pricing roundup, no converter angle), "xero" (no accounting suggestions in top 8 — shoes/xerostomia), "w2 form 2026" (slug w-2-form-2026 exists).
- Web search (accounting news Nov 2026): IRS Rev. Proc. 2026-35 (2027 inflation adjustments, IR-2026-133); 1099-NEC threshold $2,000 for 2026; 1099-NEC/W-2 due Feb 1, 2027 (Jan 31 is a Sunday); Form 1040 due Apr 15, 2027, 1120-S/1065 Mar 15, 2027 (IRS Pub 509); Q4 2026 estimated tax due Jan 15, 2027. Weekdays verified with `date -d`: 2027-01-15 Fri, 2027-01-31 Sun, 2027-02-01 Mon, 2027-03-15 Mon, 2027-04-15 Thu.

## Trending picks
- 01 bank-statements-for-rental-application — kw "bank statements for rental application", evidence: Google autocomplete seed "bank statement" + full-query autocomplete ("bank statements for rental application reddit/example", "bank statements for apartment application").
- 02 tax-filing-2026-deadline — kw "tax filing 2026 deadline", evidence: Google autocomplete seed "tax filing 2026" + web search (IRS Pub 509 dates above). Distinct from Nov 9 "december-15-tax-deadline" (Q4 estimated payment) — this is the full 2026 tax-year filing calendar.
- 03 receipt-to-excel — kw "receipt to excel", evidence: Google autocomplete seed "receipt to excel" ("receipt to excel converter", "scan receipt to excel", "receipt photo to excel").
- Dedupe: none of the 3 trending slugs/titles appear in SEED+GENERATED posts, and none repeats or near-duplicates the last 7 days of trending picks (Nov 15: small-business-taxes-for-beginners, estimated-tax-payments-2026, bank-statement-meaning; Nov 14: 1099-k-threshold-2026, home-office-deduction-2026, payroll-tax-cap-2026; Nov 13: expense-report-template-excel, small-business-saturday-2026, balance-sheet-template-excel; Nov 12: w-9-form-2026, profit-and-loss-statement-template-excel, cash-flow-statement; Nov 11: bank-statement-example, bank-statement-in-spanish, bank-reconciliation; Nov 10: irs-transcript, xero-vs-quickbooks, irs-direct-pay; Nov 9: irs-mileage-rate-2026, year-end-tax-planning-2026, december-15-tax-deadline). "bank-statements-for-rental-application" is a different intent from Nov 11's "bank-statement-example" (rental application use vs. a sample document).

## Posts
- 01 bank-statements-for-rental-application — kw "bank statements for rental application", body count 4, H2-with-kw 2, 1797 words, title 52, excerpt 160.
- 02 tax-filing-2026-deadline — kw "tax filing 2026 deadline", body count 4, H2-with-kw 2, 1822 words, title 53, excerpt 157.
- 03 receipt-to-excel — kw "receipt to excel", body count 5, H2-with-kw 2, 1558 words, title 56, excerpt 160.
- 04 bank-of-melbourne-password-protected-pdf — kw "bank of melbourne password protected pdf", 1555 words, title 51, excerpt 156.
- 05 bank-of-new-zealand-password-protected-pdf — kw "bank of new zealand password protected pdf", 1612 words, title 53, excerpt 160.
- Gates: all 10 gates pass on all 5 (gates.py FAILS: {}). One fix during the run: post 01 shipped with only 1 inline figure — added the 2nd figure, re-ran gates clean.

## Images
- 15/15 generated via media pipeline (4 subagents, <=4 calls each; 5 feature 1600px + 10 inline 1200px), PIL WebP q80, all <150 KB (largest: bank-statements-for-rental-application feature 92,802 B).
- Mapping by explicit name stem from media tool results (convert.py MAP), never mtime.
- Gate fixes: 4 excerpts trimmed to 150-160 (were 171/174/163/175).

## Deploy
- (to fill after push)
