# Daily blog run — 2026-11-22 (Sun)

## Rotation
- `bankIndex` 144 → Banque CIC, 145 → Banque Laurentienne (deduped SUPPORTED_BANKS, verified mapping matches prior runs: 142 Banner Bank, 143 Banorte). `angleIndex` 4 → statements-for-tax-filing. `qbTopicIndex` 28 = queue length (28 topics, 0–27) → **QB queue EXHAUSTED, no QB post today; slot 5 = second bank post** (bankIndex advances by 2). Mix today: 3 trending + 2 bank.
- IndexNow key: fe4e1ad6ecd7fc8c0f83f40e5faddc5a (web/public/fe4e1ad6ecd7fc8c0f83f40e5faddc5a.txt).

## Trend scan (2026-11-22 ~06:30 IST)
- Google Trends US daily RSS: sports/celebrity only (college football, NBA, Chris Hemsworth) — nothing domain-relevant.
- Google autocomplete (suggestqueries.google.com, client=firefox), exact suggestions seen:
  - seed "tax season 2027" → "tax season 2027", "tax season 2027 start date", "tax season 2027 dates", "tax season 2027 deadline", "tax season 2027 child tax credit".
  - seed "bookkeeping for freelancers" → "bookkeeping for freelancers", "bookkeeping software for freelancers", "bookkeeping app for freelancers", "best bookkeeping for freelancers", "free bookkeeping for freelancers".
  - seed "1099 deadline" → "1099 deadline", "1099 deadline 2026", "1099 deadline 2027", "1099 deadline for employers", "1099 deadline to send out".
  - rejected: "year end bookkeeping checklist" (slug already exists), "expense report template excel" (near-duplicate of Nov 21 business-expense-tracker-excel), "pdf to csv" (near-duplicate of Nov 19 convert-pdf-to-csv-for-quickbooks), "year end close checklist" (near-duplicate of existing year-end-bookkeeping-checklist), "self employed taxes" / "sole proprietor bookkeeping" (audience overlap with today's freelancer pick — kept as backups), "schedule c" (backup), "1099 form" (1099-NEC form + threshold posts already exist).
- Web search (2026/2027 tax facts, verified 2026-11-22): 1099-NEC/MISC recipient copies + IRS filing due **Feb 1, 2027** (Jan 31 is a Sunday); 1099 reporting threshold rises to **$2,000** for 2026 payments (was $600); 1099-K stays $20,000 + 200 transactions; tips deduction up to $25,000 and overtime up to $12,500 for 2025–2028; 2026 W-2 box 12 codes TP (tips) and TT (overtime); standard deduction $16,100 single / $32,200 married for 2026; SALT cap $40,400; Section 179 ~$2.56M; 100% bonus depreciation permanent; 20% QBI deduction permanent. Sources: Avance Accounting (Nov 9, 2026), Nathan Pecher Accounting (Nov 15, 2026), OMA Services (Nov 2026). IRS has NOT announced the official 2027 filing-season opening date yet — articles say so honestly and do not invent one.

## Trending picks
- 01 tax-season-2027 — kw "tax season 2027", evidence: Google autocomplete seed "tax season 2027" → "tax season 2027 start date" / "tax season 2027 dates" / "tax season 2027 deadline"; news: IRS 2026/2027 changes (Avance, Nov 9 2026).
- 02 bookkeeping-for-freelancers — kw "bookkeeping for freelancers", evidence: Google autocomplete seed "bookkeeping for freelancers" → "bookkeeping for freelancers" / "bookkeeping software for freelancers" / "free bookkeeping for freelancers".
- 03 1099-deadline-2027 — kw "1099 deadline 2027", evidence: Google autocomplete seed "1099 deadline" → "1099 deadline 2027"; news: 1099-NEC/MISC due Feb 1, 2027, $2,000 threshold (Avance; Nathan Pecher, Nov 15 2026).
- Dedupe: none of the 3 trending slugs/titles appear in SEED+GENERATED posts (exact-slug check), and none repeats or near-duplicates the last 7 days of trending picks (Nov 21: small-business-accounting-software-without-subscription, business-expense-tracker-excel, receipt-scanner-for-taxes; Nov 20: import-bank-statement-into-xero, csv-to-quickbooks, small-business-tax-deductions-2026; Nov 19: convert-pdf-to-csv-for-quickbooks, w2-form-2026, tax-season-2026-start-date; Nov 18: pdf-to-excel-converter-free, 1099-nec-form-2026, excel-template-for-small-business-accounting; Nov 17: bank-statement-pdf-to-excel, small-business-accounting-software-free; Nov 16: bank-statements-for-rental-application, tax-filing-2026-deadline, receipt-to-excel; Nov 15: small-business-taxes-for-beginners, estimated-tax-payments-2026, bank-statement-meaning). "tax-season-2027" is the next season, distinct from Nov 19's 2026-season post; "1099-deadline-2027" is a deadline calendar, distinct from Nov 18's 1099-NEC form guide and Nov 14's threshold post.

## Posts
- 01 tax-season-2027 (Sarah Mitchell) — 1,906 words, kw "tax season 2027" count 6 (at limit, passes), H2s with kw 3. All gates PASS.
- 02 bookkeeping-for-freelancers (James Park) — 1,658 words, kw count 4. Fixed: FAQ Q1 reworded to contain exact keyword. All gates PASS.
- 03 1099-deadline-2027 (David Chen, CPA) — 1,685 words, kw count 4. Fixed: intro first sentence + FAQ Q1 reworded to contain exact keyword "1099 deadline 2027". All gates PASS.
- 04 banque-cic-statements-for-tax-filing (Sarah Mitchell) — 1,611 words. All gates PASS.
- 05 banque-laurentienne-statements-for-tax-filing (James Park) — 1,601 words. All gates PASS.
- Rotation after run: bankIndex 146, angleIndex 0 (wraps to convert-to-excel), qbTopicIndex 28 (exhausted), totalPublished 221. tsc --noEmit PASS (exit 0).

## Images
- 15/15 generated (5 feature 1600px + 10 inline 1200px), all WebP q80, all <150 KB (34–90 KB), all unique photorealistic scenes, no text/logos. Converted via daily-2026-11-22/convert.py.

## Deploy
- Commit e02a399 pushed to origin main (HTTPS) — "Daily blogs 2026-11-22: 3 trending + 2 bank articles (statements-for-tax-filing); QB queue exhausted".
- Live check after ~4 min: all 5 URLs return HTTP 200: /blog/tax-season-2027, /blog/bookkeeping-for-freelancers, /blog/1099-deadline-2027, /blog/banque-cic-statements-for-tax-filing, /blog/banque-laurentienne-statements-for-tax-filing.
- GitHub deployments API (unauthenticated) showed latest deployment record dated 2026-11-14 — stale/unreliable via that endpoint; live 200s are the verification.
- IndexNow: HTTP 200 accepted for all 5 new URLs (key fe4e1ad6ecd7fc8c0f83f40e5faddc5a).
- GSC: browser task submitted (task browser-task:6fe136bb-8531-53f8-a972-307620ce5f44) — recovery queue top-down; today's 5 new URLs appended to END of pending (134 pending total after append; 54 already submitted).

## GSC
- Browser task 6:52–6:55 AM IST: signed in as xookad@gmail.com (session initially opened under seowalabhai009@gmail.com; switched via account menu, no login needed). Property https://www.convertstatement.online/ selected.
- 0 submitted — daily quota ALREADY EXHAUSTED. First URL (kotak-811-account-statement) inspected OK ("URL is not on Google — Crawled - currently not indexed", last crawl Aug 18, 2026), but "Request indexing" returned Google's "Quota Exceeded" dialog ("you've exceeded your daily quota. Please try submitting this again tomorrow"). Stopped immediately per instructions; URLs 2–15 not attempted.
- No URLs moved from pending to submitted (none accepted). Queue unchanged: 134 pending (incl. today's 5 new URLs appended at the end), 54 submitted. Retry tomorrow.
- IndexNow (step 13) already accepted all 5 new URLs (HTTP 200), so Bing/Yandex indexing is covered despite the GSC quota block.
