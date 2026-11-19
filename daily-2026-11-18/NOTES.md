# Daily blog run — 2026-11-18 (Wed)

## Rotation
- `bankIndex` 136 → Bank of Travelers Rest (deduped SUPPORTED_BANKS idx 136), 137 → Bank Pekao. `angleIndex` 0 → convert-to-excel. `qbTopicIndex` 28 = queue length (28 topics, 0–27) → **QB queue EXHAUSTED, no QB post today; slot 5 = second bank post** (bankIndex advances by 2). Mix today: 3 trending + 2 bank.
- IndexNow key: fe4e1ad6ecd7fc8c0f83f40e5faddc5a (web/public/fe4e1ad6ecd7fc8c0f83f40e5faddc5a.txt).

## Trend scan (2026-11-18 ~06:35 IST)
- Google Trends US daily RSS: sports only (CFP rankings, Kennesaw St vs Alabama) — nothing domain-relevant.
- Google autocomplete (suggestqueries.google.com, client=firefox), exact suggestions seen:
  - seed "pdf to excel" → "pdf to excel converter", "pdf to excel converter free", "pdf to excel converter free online", "pdf to excel spreadsheet".
  - seed "1099 nec form" → "1099 nec form 2026", "1099 nec form 2025", "1099 nec form pdf", "1099 nec form printable".
  - seed "excel template" → "excel template for small business accounting", "excel template for budget", "excel templates free".
  - also checked: "quickbooks" (login/workforce only), "bank statement" (example/spanish/meaning already published), "small business accounting" (software free published 11-17), "bookkeeping" (jobs/certification — weak tool link), "tax filing" (deadline 2026 published 11-16; extension deadline already past Oct 15), "xero" (shoes only), "stripe"/"paypal" (login/support only), "1099" (form/nec/vs w2 — vs w2 slug already exists), "bank statement mortgage" (mortgage-loan slug already exists), "chime bank statement" (near-duplicate of existing "bank-statement-from-chime" post — rejected), "pdf to csv" (converter free — too close to today's pick 01, rejected as same-day near-duplicate).
- Web search (1099-NEC 2026 facts): Xero + Bunker Bookkeeping + IRS Instructions for Forms 1099-MISC and 1099-NEC (Rev. Dec 2026) agree — $2,000 threshold for 2026 payments (OBBBA P.L. 119-21, signed Jul 4, 2025; $600 prior years), due Feb 1, 2027 (Jan 31, 2027 is a Sunday), 24% backup withholding, e-file required at 10+ returns, card/PayPal/Stripe payments excluded (1099-K).

## Trending picks
- 01 pdf-to-excel-converter-free — kw "pdf to excel converter free", evidence: Google autocomplete seed "pdf to excel".
- 02 1099-nec-form-2026 — kw "1099 nec form 2026", evidence: Google autocomplete seed "1099 nec form" + web search (facts above).
- 03 excel-template-for-small-business-accounting — kw "excel template for small business accounting", evidence: Google autocomplete seed "excel template".
- Dedupe: none of the 3 trending slugs/titles appear in SEED+GENERATED posts (exact-slug check), and none repeats or near-duplicates the last 7 days of trending picks (Nov 17: bank-statement-pdf-to-excel, small-business-accounting-software-free; Nov 16: bank-statements-for-rental-application, tax-filing-2026-deadline, receipt-to-excel; Nov 15: small-business-taxes-for-beginners, estimated-tax-payments-2026, bank-statement-meaning; Nov 14: 1099-k-threshold-2026, home-office-deduction-2026, payroll-tax-cap-2026; Nov 13: expense-report-template-excel, small-business-saturday-2026, balance-sheet-template-excel; Nov 12: w-9-form-2026, profit-and-loss-statement-template-excel, cash-flow-statement; Nov 11: bank-statement-example, bank-statement-in-spanish, bank-reconciliation). "pdf-to-excel-converter-free" is a different intent from Nov 17's "bank-statement-pdf-to-excel" (general free converter vs bank-statement conversion); "1099-nec-form-2026" is a different form from Nov 14's "1099-k-threshold-2026"; "excel-template-for-small-business-accounting" is a workbook-level topic vs Nov 12/13's single-template posts (P&L, balance sheet, expense report).

## Posts
- 01 pdf-to-excel-converter-free — kw "pdf to excel converter free", body count 5 (limit 6), H2-with-kw 2, 1552 words, title 53, excerpt 153.
- 02 1099-nec-form-2026 — kw "1099 nec form 2026", body count 4, H2-with-kw 2, 1500 words, title 51, excerpt 158.
- 03 excel-template-for-small-business-accounting — kw "excel template for small business accounting", body count 5, H2-with-kw 2, 1636 words, title 55, excerpt 159.
- 04 bank-of-travelers-rest-convert-to-excel — kw "bank of travelers rest convert to excel", 1185 words, title 54, excerpt 157.
- 05 bank-pekao-convert-to-excel — kw "bank pekao convert to excel", 1152 words, title 51, excerpt 158.
- Gates: all 10 pass on all 5 (excerpt fixes during run: 01 176→153, 03 171→163→159, 04 180→157, 05 170→158).

## Images
- 15/15 generated via media pipeline (3 subagents × 5). CAUGHT: first image subagent (A) reported 5 images "saved" that did NOT exist on disk — full-filesystem find confirmed they were never written; replacement subagent regenerated all 5 with on-disk `ls` verification. B and C agents' files verified on disk. PIL WebP q80, all <150 KB (largest: bank-of-travelers-rest feature 76,628 B).
- Convert.py: 15/15, features 1600px, inlines 1200px.

## Deploy
- Commit 3645647 pushed via HTTPS (8c3bd52..3645647 main -> main). tsc clean.
- Live checks ~5 min after push: all 5 new blog URLs 200 on www.convertstatement.online; homepage 200.
- GitHub deployments API (authenticated): newest deployment still 5f48b31 (2026-11-14) — NO deployment record for 3645647. The new Amit-team project does not create GitHub deployment records (same as Nov 15/16/17); live URL checks are the proof of deploy.
- IndexNow: HTTP 200 accepted for all 5 new URLs.
- Rotation: bankIndex 136→138, angleIndex 0→1, qbTopicIndex stays 28 (QB queue exhausted), totalPublished 196→201.
- Indexing queue: 130 pending / 33 submitted → 135 pending (today's 5 at END of pending).
- GSC: 0/12 submitted — STOPPED on first queue URL (https://www.convertstatement.online/banks/westpac) with Google's generic error "Oops! Something went wrong. We had a problem submitting your indexing request" (after inspection finished, "URL is on Google"). Per spec, stopped for the day; URL stays on top for tomorrow. Queue unchanged: 135 pending / 33 submitted. NEW: xookad@gmail.com IS now signed in to the browser (switched from the account switcher, no password/code needed) — the login blocker is GONE. Also found: xookad has NO access to the domain property sc-domain:convertstatement.online, but HAS access to the URL-prefix property https://www.convertstatement.online/ (287 indexed, 331 not indexed, 27 clicks) — submissions run there. No quota message shown.
