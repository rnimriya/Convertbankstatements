# Daily blog run — 2026-11-21 (Sat)

## Rotation
- `bankIndex` 142 → Banner Bank, 143 → Banorte (deduped SUPPORTED_BANKS, tolerant parser incl. 34 space-padded entries; verified mapping matches prior runs: dedup 126 Bank of China (Hong Kong), 127 Bank Of Cyprus, 129 Bank of Ireland, 140 Bank Sinarmas, 141 Bank Windhoek). `angleIndex` 3 → password-protected-pdf. `qbTopicIndex` 28 = queue length (28 topics, 0–27) → **QB queue EXHAUSTED, no QB post today; slot 5 = second bank post** (bankIndex advances by 2). Mix today: 3 trending + 2 bank.
- IndexNow key: fe4e1ad6ecd7fc8c0f83f40e5faddc5a (web/public/fe4e1ad6ecd7fc8c0f83f40e5faddc5a.txt).

## Trend scan (2026-11-21 ~06:30 IST)
- Google Trends US daily RSS: sports/celebrity only (Ferris State football, Jalen Johnson, Iowa vs Xavier, Pitt basketball, Martha Stewart, Trump portfolio trades, Peru earthquake) — nothing domain-relevant.
- Google autocomplete (suggestqueries.google.com, client=firefox), exact suggestions seen:
  - seed "small business accounting" → "small business accounting software", "small business accounting software free", "small business accounting software without subscription", "small business accounting software other than quickbooks".
  - seed "business expense tracker" → "business expense tracker app", "business expense tracker google sheets", "business expense tracker excel", "business expense tracker free", "business expense tracker template", "business expense tracker spreadsheet".
  - seed "receipt scanner" → "receipt scanner app", "receipt scanner and organizer", "receipt scanner for business", "receipt scanner for taxes", "receipt scanner for quickbooks", "receipt scanner that categorizes".
  - also checked: "bank statement" (all top suggestions covered: example, in spanish, meaning, mortgage loan, rental application — all published already), "quickbooks" (login/payroll only), "pdf to excel" (covered Nov 18–19), "tax filing" ("tax filing deadline 2026" published Nov 16; "tax filing extension deadline 2026" published Nov 2 — rejected as duplicate), "xero" (shoes dominate), "stripe"/"paypal" (login/support only), "bookkeeping" ("bookkeeping software" — slug exists; "bookkeeping certification" — post exists), "invoice template" (weak product link, not used), "year end tax" ("year end tax planning 2026" slug exists — rejected), "payroll tax" (calculator angle, no product — not used), "convert pdf to" (off-domain: word/jpg — not used).
- Web search (2026 tax facts, verified 2026-11-21): Oct 15, 2026 extended filing deadline has PASSED (1040 + 1120 filers; S-corp/partnership extended deadline was Sep 15, 2026); extension gives more time to file, not to pay; failure-to-file 5%/mo up to 25%, failure-to-pay 0.5%/mo; IRS interest 7% Q4 2026. Sources: Pilot, Senvora Group, Giles FC, Rho (search results 2026-11-21). Used only as background — the extension topic itself was rejected as a duplicate (published Nov 2).

## Trending picks
- 01 small-business-accounting-software-without-subscription — kw "small business accounting software without subscription", evidence: Google autocomplete seed "small business accounting" → "small business accounting software without subscription".
- 02 business-expense-tracker-excel — kw "business expense tracker excel", evidence: Google autocomplete seed "business expense tracker" → "business expense tracker excel".
- 03 receipt-scanner-for-taxes — kw "receipt scanner for taxes", evidence: Google autocomplete seed "receipt scanner" → "receipt scanner for taxes".
- Dedupe: none of the 3 trending slugs/titles appear in SEED+GENERATED posts (exact-slug check), and none repeats or near-duplicates the last 7 days of trending picks (Nov 20: import-bank-statement-into-xero, csv-to-quickbooks, small-business-tax-deductions-2026; Nov 19: convert-pdf-to-csv-for-quickbooks, w2-form-2026, tax-season-2026-start-date; Nov 18: pdf-to-excel-converter-free, 1099-nec-form-2026, excel-template-for-small-business-accounting; Nov 17: bank-statement-pdf-to-excel, small-business-accounting-software-free; Nov 16: bank-statements-for-rental-application, tax-filing-2026-deadline, receipt-to-excel; Nov 15: small-business-taxes-for-beginners, estimated-tax-payments-2026, bank-statement-meaning; Nov 14: 1099-k-threshold-2026, home-office-deduction-2026, payroll-tax-cap-2026). "small-business-accounting-software-without-subscription" is a one-time-purchase/no-monthly-fee angle, distinct from Nov 17's free-software post; "receipt-scanner-for-taxes" is a tax-record angle, distinct from the QBO receipt-import posts.

## Posts
- 01 small-business-accounting-software-without-subscription — kw "small business accounting software without subscription", body count 4 (limit 6), H2-with-kw 2, 2373 words, title 55, excerpt 155.
- 02 business-expense-tracker-excel — kw "business expense tracker excel", body count 4 (limit 6), H2-with-kw 2, 2153 words, title 50, excerpt 154.
- 03 receipt-scanner-for-taxes — kw "receipt scanner for taxes", body count 5 (limit 6), H2-with-kw 2, 2043 words, title 52, excerpt 160.
- 04 banner-bank-password-protected-pdf — kw "banner bank password protected pdf", 1862 words, title 56, excerpt 158.
- 05 banorte-password-protected-pdf — kw "banorte password protected pdf", 2034 words, title 52, excerpt 159.
- Gates: all 10 pass on all 5 (gates.py FAILS={}). One fix during run: Banner Bank post initially had only 1 inline image in content (2nd figure missing) — added the inline-2 figure, re-ran gates clean. Excerpts 01 (174) and 02 (164) trimmed to 155/154 before gates.

## Images
- 15/15 generated via media pipeline (3 subagents × 5), all verified on disk 1920×1200/1280 WebP before convert. Convert.py: 15/15, features 1600px, inlines 1200px, all <150 KB (largest: banorte feature 113,438 B).

## Deploy
- Commit 3aad03b pushed via HTTPS (7eeeb6b..3aad03b main -> main). Also pushed yesterday's unpushed notes commit 31f0808. tsc clean.
- Live checks ~4 min after push: all 5 new blog URLs 200 on www.convertstatement.online; homepage 200.
- GitHub deployments API: not checked (unauthenticated requests rate-limited on shared egress IP; Amit-team project creates no GitHub deployment records — same as Nov 15–20). Live URL checks are the proof of deploy.
- IndexNow: HTTP 200 accepted for all 5 new URLs (key fe4e1ad6ecd7fc8c0f83f40e5faddc5a verified live).
- Rotation: bankIndex 142→144, angleIndex 3→4, qbTopicIndex stays 28 (QB queue exhausted), totalPublished 211→216.
- Indexing queue: 135 pending / 43 submitted → 140 pending (today's 5 at END of pending) → after GSC: 129 pending / 54 submitted.

## GSC
- Browser opened on seowalabhai009@gmail.com — switched to xookad@gmail.com via account menu (no password needed), selected URL-prefix property https://www.convertstatement.online/ (no access to sc-domain property, as before).
- 11/14 submitted: queue URLs #1–11 accepted ("Indexing requested — URL was added to a priority crawl queue"). URL #12 /blog/kotak-811-account-statement hit Google's daily quota ("Quota Exceeded... try submitting this again tomorrow"); stopped per rule; #13–14 not attempted. No generic "Oops!" error today.
- Queue after: 129 pending / 54 submitted. Top pending now: kotak-811-account-statement, indian-bank-statement-formats-differences, how-to-download-statement-for-all-accounts.
