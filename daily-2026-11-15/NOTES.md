# Daily blogs 2026-11-15

## Rotation
- bankIndex 130 -> 132 (TWO bank posts today: Bank of Kigali deduped 130 + Bank of Maharashtra deduped 131, angle import-to-xero)
- angleIndex 2 -> 3 (angle today: import-to-xero; next: password-protected-pdf)
- qbTopicIndex 28 — QUEUE EXHAUSTED (28 topics, indices 0-27; last published 2026-11-14). Slot 5 reverts to a bank post per spec; bankIndex advances past it too. qbTopicIndex stays 28.
- totalPublished 182 -> 187 (if 5/5)

## Trend scan (evidence)
- Google Trends US daily RSS 2026-11-15 (fetched ~06:30 IST): only sports (top: "lane kiffin", "archie manning") — no domain-usable trend, same as 2026-11-04..14.
- Google autocomplete (client=firefox, 2026-11-15):
  - seed "small business tax" -> "small business taxes", "small business tax deductions", "small business taxes for beginners", "small business tax deductions checklist", "small business tax rate", "small business tax credits", "small business tax calculator"
  - seed "estimated tax" -> "estimated tax payments 2026", "estimated tax payments", "estimated tax payment dates", "estimated taxes due dates", "estimated tax due dates 2026", "estimated tax calculator"
  - seed "quarterly taxes" -> "quarterly taxes", "quarterly taxes due dates", "quarterly taxes 2026", "quarterly taxes due dates 2026", "quarterly taxes for llc"
  - seed "bank statement" -> "bank statement example", "bank statement loans", "bank statement in spanish", "bank statement meaning", "bank statements on chime", "bank statement mortgage loan", "bank statement capital one", "bank statement template", "bank statement for rental application"
  - seed "quickbooks" -> "quickbooks online", "quickbooks online login", "quickbooks login", "quickbooks payroll", "quickbooks time" (payroll slug already published — rejected)
  - seed "1099" -> "1099 form", "1099 nec", "1099 vs w2", "1099 threshold 2026" (near-duplicate of Nov 14 1099-k post — rejected)
  - seed "pdf to excel" -> "pdf to excel", "pdf to excel converter", "pdf to excel converter free", "pdf to excel converter free online"
  - seed "1099-nec" -> "1099-nec threshold 2026" (near-duplicate: 1099-nec-filing-threshold-2026 already published — rejected)
  - seed "invoice template" -> "invoice template", "invoice template excel", "invoice template free" (held as backup, not picked)
  - seed "xero" -> shoes/xerostomia noise only — no usable suggestion
- News/fact checks (browser search, 2026-11-15):
  - Estimated tax: 2026 Form 1040-ES dates Apr 15 / Jun 15 / Sep 15 2026 + Jan 15, 2027 (Friday, covers Sep 1–Dec 31, 2026); safe harbor smaller of 90% of 2026 tax or 100% of 2025 tax (110% if 2025 AGI over $150,000); $1,000 owe threshold; Jan payment not required if you file by Feb 1, 2027 and pay in full; underpayment rate 7% Oct–Dec 2026. Sources: IRS Form 1040-ES (2026), Pub 505, via Taxstra/bookkeeply/skipandgrow.
  - Small business taxes: SE tax 15.3% on 92.35% of net earnings, Social Security part capped at $184,500 wage base; QBI (Section 199A) up to 20% now PERMANENT (OBBBA, Jul 4 2025), 2026 thresholds $201,750 single / $403,500 joint, $400 minimum if QBI >= $1,000; standard deduction 2026 $16,100 single / $32,200 joint; C-corp rate 21%. Sources: IRS Rev. Proc. 2025-32, SSA 2026 wage base.
  - Bank of Kigali: Rwanda's largest commercial bank, incorporated Dec 22, 1966; BK Mobile app + *334# USSD + Internet Banking; listed Rwanda Stock Exchange 2011. Sources: Wikipedia, bk.rw, Euromoney.
  - Bank of Maharashtra: registered Sep 16, 1935, operations began Feb 8, 1936, Pune; nationalized 1969; ~2,641 branches, 35M customers (Jun 2025); net banking "Operative Account Statement" PDF download, Zen Lyfe app, MahaConnect. Sources: bankofmaharashtra.in, Wikipedia, loansjagat.
- Rejected picks: "1099 threshold 2026" (near-duplicate of Nov 14 1099-k-threshold-2026); "1099-nec threshold 2026" (1099-nec-filing-threshold-2026 already published); "quickbooks payroll" (slug already published); "quarterly taxes 2026" (quarterly-tax-due-dates-2026 already published); "tax deductions 2026" (overlaps Nov 9 year-end tax planning); "bank statement mortgage loan" (slug already published); "bank statement example / in spanish / template" (published Nov 11 / Nov 8).
- Dedupe: none of the 3 trending slugs/titles appear in SEED+GENERATED posts, and none repeats or near-duplicates the last 7 days of trending picks (Nov 14: 1099-k-threshold-2026, home-office-deduction-2026, payroll-tax-cap-2026; Nov 13: expense-report-template-excel, small-business-saturday-2026, balance-sheet-template-excel; Nov 12: w-9-form-2026, profit-and-loss-statement-template-excel, cash-flow-statement; Nov 11: bank-statement-example, bank-statement-in-spanish, bank-reconciliation; Nov 10: irs-transcript, xero-vs-quickbooks, irs-direct-pay; Nov 9: irs-mileage-rate-2026, year-end-tax-planning-2026, december-15-tax-deadline; Nov 8: 2027-tax-brackets, bank-statement-template, 1099-vs-w2). "bank statement meaning" is a different search intent from Nov 11's "bank statement example" (what it is vs. a sample document); "estimated tax payments 2026" covers payment mechanics/safe harbor, distinct from the earlier due-dates list post.

## Posts
- 01 small-business-taxes-for-beginners — kw "small business taxes for beginners", body count 4, H2-with-kw 2, 2087 words, title 50, excerpt 153.
- 02 estimated-tax-payments-2026 — kw "estimated tax payments 2026", body count 4, H2-with-kw 2, 2172 words, title 54, excerpt 156.
- 03 bank-statement-meaning — kw "bank statement meaning", body count 4, H2-with-kw 2, 2154 words, title 55, excerpt 154.
- 04 bank-of-kigali-import-to-xero — kw "import bank of kigali bank statement to xero", 1710 words, title 55, excerpt 156.
- 05 bank-of-maharashtra-import-to-xero — kw "import bank of maharashtra bank statement to xero", 1756 words, title 54, excerpt 157.

## Images
- 15/15 generated via media pipeline (5 feature 1600px + 10 inline 1200px), PIL WebP q80, all <150 KB (largest: bank-of-kigali feature 106,612 B).
- Mapping by explicit name stem from media tool results (convert.py MAP), never mtime.
- Gate fixes: 3 excerpts trimmed to 150-160 (were 166/164/163), re-run clean.

## Deploy
- Commit dc54b54 pushed via HTTPS (5f48b31..dc54b54 main -> main). tsc clean.
- PRODUCTION DOMAIN DOWN: https://www.convertstatement.online returns 402 DEPLOYMENT_DISABLED ("Payment required") on homepage AND all 5 new blog URLs — Vercel paused the old 'rakesh kumar's projects' team. Yesterday (Nov 14) the same URLs returned 200, so the 402 started sometime after Nov 14 ~07:23 IST.
- NEW PROJECT IS LIVE: https://convertbankstatements-web-beta.vercel.app returns 200 on homepage AND all 5 new blog URLs — the Amit-team project deployed dc54b54 and serves the new posts. The production domain still points at the old paused project; the domain move (migration Stage B/C) is pending.
- GitHub deployments API: NO deployment record for dc54b54 yet (newest is 7780408338 for 5f48b31, success). The old Vercel integration appears dead while the team is paused; the beta URL is the live proof the new project deployed.
- IndexNow: SKIPPED deliberately — production URLs return 402, so submitting them would point Bing at dead pages. Will submit once the domain move restores 200s.
- GSC: browser task browser-task:8a1ce266-0573-5d67-8472-635a3fc978b6 running (queue top-down). Queue file: 121 pending / 33 submitted after appending today's 5 blog URLs to the END of pending. NOTE: queue file was last modified Nov 14 07:23 IST and shows 11 URLs moved pending->submitted since yesterday's notes (127/22 -> 116/33 before today's append) — that move is NOT explained by yesterday's run notes, which said GSC was blocked; recorded here as an open discrepancy.

## Deploy — DONE
- GSC: 0/12 submitted — BLOCKED on sign-in, but the state CHANGED since Nov 14: a Google account IS now signed in, but it is the WRONG one — BrightDoor Media (social@brightdoormedia.online). xookad@gmail.com is not signed in and did not appear in the account menu. No sign-in attempted, saved password NOT retried. Owner must sign in to Search Console as xookad@gmail.com (or make it the active account), then the queue can resume. Queue unchanged by this run: 121 pending / 33 submitted (today's 5 blog URLs at the END of pending).
