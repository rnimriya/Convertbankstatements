# Daily blog run notes — 2026-11-02 (first run of the 3 trending + 1 bank + 1 QB mix)

## Trend scan (before writing)
- Google Trends US daily RSS (2026-11-02 ~06:30 IST): only sports/celebrity items
  (jayden daniels stats, denver broncos schedule, tradingview, clippers vs warriors,
  patriots schedule, snf tonight) — nothing domain-relevant, so no Trends-RSS pick.
- Google autocomplete (suggestqueries.google.com, client=firefox), verified this run:
  - "tax filing" -> "tax filing extension deadline 2026", "tax filing deadline 2026"
  - "year end bookkeeping" -> "year end bookkeeping checklist", "year end accounting checklist"
  - "bank statement loan" -> "bank statement loan rates today", "bank statement loans for self employed",
    "bank statement loan requirements"
  - Also seen: "1099 threshold 2026", "quickbooks payroll pricing", "irs tax brackets 2026",
    "small business accounting software free"
- News check (web search): Oct 15, 2026 was the extended deadline for 2025 federal
  returns; multiple current articles (mid/late Oct 2026) cover missed-deadline penalties
  (5%/month failure-to-file, 0.5%/month failure-to-pay, $525 minimum if >60 days late)
  and automatic first-time relief — the missed-deadline angle is current, not invented.
- Dedupe: no trending posts ran in the prior 7 days (2026-11-01 run was the old
  4-bank + 1-QB mix); all 3 trending slugs checked absent from SEED + GENERATED posts.

## Picks
1. TRENDING — "tax filing extension deadline 2026" (autocomplete + post-Oct-15 news)
   slug tax-filing-extension-deadline-2026, keyword count in body 4 (<=6, no stuffing).
2. TRENDING — "year end bookkeeping checklist" (autocomplete, seasonal November close)
   slug year-end-bookkeeping-checklist, keyword count 4.
3. TRENDING — "bank statement loans for self employed" (autocomplete, incl. "rates today")
   slug bank-statement-loans-for-self-employed, keyword count 4.
4. BANK — Banistmo (deduped SUPPORTED_BANKS index 117), angle statements-for-tax-filing
   (angleIndex 4). Slug banistmo-statements-for-tax-filing.
5. QB — qbTopicIndex 14: "How to Record PayPal Transactions in QBO the Right Way",
   keyword "how to record paypal transactions in qbo", linkTo /tools/free-paypal-to-quickbooks.
   Angle: clearing-account model (gross sales, refunds, fees, transfers to bank).

## Gates
- All 5 passed all 10 gates + trending no-stuffing checks (gates.py in this folder).
  Titles 53-57 chars, excerpts 151-157 chars, 1116-1294 words, 5 h2 each, 2 inline images
  each, feature 1600px + inline 1200px WebP q80, all <150 KB.
- Rotation after run: bankIndex 118, angleIndex 0, qbTopicIndex 15, totalPublished 122.
- Commit 436a617 pushed to main via HTTPS.

## Indexing — NOT DONE (blocked by failed deploy)
- Vercel deployment dpl_5qGVMpMPa4wS4ivBLw6XuNdsxYKT for commit 436a617 FAILED
  (GitHub deployment 7481960802, failure recorded 2026-11-02T01:14:14Z, 1s after creation).
  All 5 new URLs return 404; previous build still serves 200.
- Local `next build` passes, so content/tsc are not the cause.
- GSC and IndexNow submissions were NOT made: both require live 200 URLs.
  Retry both (GSC order: QB, trending, bank) once a deploy succeeds.
- Vercel connector could not inspect logs: its team scope is alablafla007-2010 only,
  not the convertbankstatements project team.
