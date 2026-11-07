# Daily blog run notes — 2026-11-04

## Trend scan (before writing)
- Google Trends US daily RSS (2026-11-04 ~06:30 IST): only election/politics items
  (new york times, cbs news, chris christie, nc board of elections, etc.) —
  nothing domain-relevant.
- Google autocomplete (suggestqueries.google.com, client=firefox), verified this run:
  - "quarterly tax" -> "quarterly tax dates 2026", "quarterly tax payments 2026",
    "quarterly tax due dates 2026"
  - "estimated taxes" -> "estimated taxes due dates 2026", "estimated taxes due"
  - "bank statement converter" -> "bank statement converter to excel",
    "bank statement converter to csv", "bank statement converter pdf to excel"
  - "w2 form" -> "w2 form 2026", "w2 form 2026 printable"
  - Also seen: "bank statement mortgage loan" (rejected again — near-duplicate of
    2026-11-02 bank-statement-loans post), "how to reconcile a bank statement"
    (rejected — seed post how-to-reconcile-bank-statement already covers it).
- News/seasonal check: Q4 estimated-tax installment due Jan 15, 2027; W-2
  furnishing deadline shifts Jan 31 -> Feb 1, 2027 (Jan 31 is a Sunday).
- Dedupe: all 3 trending slugs absent from SEED + GENERATED; distinct from
  2026-11-02 picks (tax extension, year-end checklist, bank-statement loans)
  and 2026-11-03 picks (1099-NEC threshold, rental application, stripe payout).

## Picks
1. TRENDING — "quarterly tax due dates 2026" (autocomplete)
   slug quarterly-tax-due-dates-2026, keyword count in body 4 (<=6).
2. TRENDING — "bank statement converter to excel" (autocomplete)
   slug bank-statement-converter-to-excel, keyword count in body 4.
3. TRENDING — "w-2 form 2026" (autocomplete)
   slug w-2-form-2026, keyword count in body 5.
4. BANK — Bank AL Habib (deduped SUPPORTED_BANKS index 119),
   angle convert-to-csv-quickbooks (angleIndex 1).
   Slug bank-al-habib-convert-to-csv-quickbooks.
5. QB — qbTopicIndex 16: "How to Categorize PayPal Transactions in QuickBooks Online",
   keyword "how to categorize paypal in quickbooks",
   linkTo /tools/free-paypal-to-quickbooks.
   Angle: map PayPal transaction types to chart-of-accounts categories,
   rules to automate, multi-currency handling, cleanup of miscategorized books.

## Gates
- All 5 passed all 10 gates + trending no-stuffing checks (gates.py in this folder).
  First pass: 4 excerpts 1-4 chars over 160 — trimmed (157/159/154/158), re-run clean.
  Titles 50-58 chars, excerpts 154-159 chars, 1045-1396 words,
  5-6 h2 each, 2 inline images each, feature 1600px + inline 1200px WebP q80,
  all <150 KB. tsc --noEmit clean.
- Rotation after run: bankIndex 120, angleIndex 2, qbTopicIndex 17, totalPublished 132.

## Deploy + indexing
- Commit 74b5d79 pushed to main via HTTPS (ccc7054..74b5d79).
- All 5 URLs verified 200 after ~4 min wait; home page 200.
- GitHub deployment 7535049160 for 74b5d79: state success.
- IndexNow: HTTP 200 accepted for all 5 URLs.
- GSC (xookad, convertstatement.online property, browser task 06:42-06:58 IST):
  all 5 submitted in order QB, trending x3, bank; each showed "Indexing requested",
  no quota message. Browser profile was initially signed out, so sign-in was
  completed via the login agent as xookad@gmail.com first; property switched
  from tools.aivideoprompt.online to convertstatement.online. Daily pipeline
  for 2026-11-04 FULLY closed.
