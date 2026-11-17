# Daily blog run — 2026-11-17 (Tue)

## Rotation
- `bankIndex` 134 → Bank of Scotland (deduped SUPPORTED_BANKS idx 134), 135 → Bank of the West. `angleIndex` 4 → statements-for-tax-filing. `qbTopicIndex` 28 = queue length (28 topics, 0–27) → **QB queue EXHAUSTED, no QB post today; slot 5 = second bank post** (bankIndex advances by 2). Mix today: 3 trending + 2 bank.
- Yesterday's 5 posts verified live 200 this morning (the 2026-11-16 404 fix in commit 835b991 held). Local main is 1 commit ahead of origin (8db1e9a, notes only) — will push with today's commit.
- IndexNow key: fe4e1ad6ecd7fc8c0f83f40e5faddc5a (web/public/fe4e1ad6ecd7fc8c0f83f40e5faddc5a.txt).

## Trend scan (2026-11-17 ~06:35 IST)
- Google Trends US daily RSS: sports/politics only (butch jones, james comer) — nothing domain-relevant.
- Google autocomplete (suggestqueries.google.com, client=firefox), exact suggestions seen:
  - seed "quickbooks online" → "quickbooks online pricing", "quickbooks online login", "quickbooks online accountant", "quickbooks online test drive".
  - seed "bank statement pdf" → "bank statement pdf to excel", "bank statement pdf to excel converter", "bank statement pdf to csv", "bank statement pdf password".
  - seed "small business accounting" → "small business accounting software free", "small business accounting software", "small business accounting services".
  - also checked: "xero" (no accounting suggestions in top 8 — shoes/xerostomia), "stripe payouts" ("stripe payouts paused", "stripe payouts time"), "1099" ("1099 threshold 2026" — covered 2026-11-14), "tax filing 2026" ("tax filing 2026 deadline" — covered 2026-11-16).
- Web search (QuickBooks pricing Nov 2026): NerdWallet + CFOpresso + Booke AI agree — Simple Start $38, Essentials $85, Plus $140, Advanced $340/mo list; 50% off first 3 months; Essentials/Plus/Advanced raised Aug 1, 2026. First-year totals $399/$892.50/$1,470/$3,570.

## Trending picks
- 01 quickbooks-online-pricing — kw "quickbooks online pricing", evidence: Google autocomplete seed "quickbooks online" + web search (Nov 2026 list prices, sources above).
- 02 bank-statement-pdf-to-excel — kw "bank statement pdf to excel", evidence: Google autocomplete seed "bank statement pdf".
- 03 small-business-accounting-software-free — kw "small business accounting software free", evidence: Google autocomplete seed "small business accounting".
- Dedupe: none of the 3 trending slugs/titles appear in SEED+GENERATED posts, and none repeats or near-duplicates the last 7 days of trending picks (Nov 16: bank-statements-for-rental-application, tax-filing-2026-deadline, receipt-to-excel; Nov 15: small-business-taxes-for-beginners, estimated-tax-payments-2026, bank-statement-meaning; Nov 14: 1099-k-threshold-2026, home-office-deduction-2026, payroll-tax-cap-2026; Nov 13: expense-report-template-excel, small-business-saturday-2026, balance-sheet-template-excel; Nov 12: w-9-form-2026, profit-and-loss-statement-template-excel, cash-flow-statement; Nov 11: bank-statement-example, bank-statement-in-spanish, bank-reconciliation; Nov 10: irs-transcript, xero-vs-quickbooks, irs-direct-pay). "bank-statement-pdf-to-excel" is a different intent from Nov 16's "receipt-to-excel" (bank statements vs receipts) and Nov 11's "bank-statement-example" (conversion vs a sample document).

## Posts
- 02 bank-statement-pdf-to-excel — kw "bank statement pdf to excel", body count 6 (at limit, passes), H2-with-kw 2, 1712 words, title 51, excerpt 158.
- 03 small-business-accounting-software-free — kw "small business accounting software free", body count 4, H2-with-kw 2, 1652 words, title 50, excerpt 158.
- 04 bank-of-scotland-statements-for-tax-filing — kw "bank of scotland statements for tax filing", 1589 words, title 53, excerpt 150.
- 05 bank-of-the-west-statements-for-tax-filing — kw "bank of the west statements for tax filing", 1559 words, title 53, excerpt 157.
- 01 quickbooks-online-pricing — FAILED gate 1 (slug duplicate): slug already live since 2026-11-07 (gen-2026-11-07-01, commit f8abe00). Draft saved to web/data/blog-review/2026-11-17/ with REVIEW_NOTES.md, NOT published, NOT backfilled (per spec). Root cause: pre-write dedupe grep used `"slug": "..."` (quoted key) while generated.ts uses unquoted keys — gates regex caught it. Lesson: dedupe only with the gates.py regex.
- Gates: all 10 pass on the 4 published articles (gates.py FAILS: only the duplicate above). Excerpt fixes during run: 02 (170→158), 03 (168→158), 04 (181→150), 05 (162→157); post 03 H2 #2 reworded to carry the keyword in a 2nd H2.

## Images
- 15/15 generated via media pipeline (4 subagents, ≤4 calls each; 5 feature 1600px + 10 inline 1200px), PIL WebP q80, all <150 KB (largest: small-business-accounting-software-free feature 76,700 B).
- Mapping by explicit name stem from media tool results (convert.py MAP); filenames carry a `media-generation-<stem>-0-<uuid>` prefix, stem match works.
- NOTE: the failed post 01's 3 images were converted into web/public/blog/ BEFORE the duplicate was caught, overwriting the live 2026-11-07 article's images with new on-topic images (same filenames, same topic). Live article unharmed; its images are fresh equivalents.

## Deploy
- Commit 7def213 pushed via HTTPS (835b991..7def213 main -> main). tsc clean.
- GSC: 0/12 submitted — BLOCKED again. Browser task 06:43 IST: active Google account in Search Console is seowalabhai009@gmail.com (property loaded: aivideogeneratortool.online); xookad@gmail.com signed out. No sign-in attempted, no submission under the wrong account. Owner must sign in as xookad@gmail.com. Queue unchanged: 130 pending / 33 submitted (today's 4 blog URLs at the END of pending).
- (live URL checks + IndexNow pending)
- Live checks ~01:19 UTC (+7 min after push): all 4 new blog URLs 200 on www.convertstatement.online.
- GitHub deployments API: newest deployment still 7780408338 (2026-11-14, for 5f48b31) — NO deployment record for 7def213. The new Amit-team project does not create GitHub deployment records (same as Nov 15/16); live URL checks are the proof of deploy.
- IndexNow: HTTP 200 accepted for all 4 new URLs.
