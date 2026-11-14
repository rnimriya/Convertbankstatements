# Daily blogs 2026-11-14

## Rotation
- bankIndex 129 -> 130 (Bank of Ireland, angle convert-to-csv-quickbooks; slug bank-of-ireland-convert-to-csv-quickbooks not previously published)
- angleIndex 1 -> 2 (angle today: convert-to-csv-quickbooks; next: import-to-xero)
- qbTopicIndex 27 -> 28 (LAST topic: "How to Reconcile in QuickBooks Online: A Step-by-Step Routine", kw "quickbooks reconciliation how to", linkTo /quickbooks). Queue EXHAUSTED after today — from tomorrow, slot 5 reverts to a bank post per spec (bankIndex then advances by 5/day total).
- totalPublished 177 -> 182 (if 5/5)

## BANK INDEX NOTE — spec followed, one skip recorded
- bankIndex 129 is taken DEDUPED per spec (generateBankSlug + dedupe): Bank of Ireland.
- Yesterday's run (11-13) used the RAW index 128 = Atlantic Union Bank, so deduped 128 = Bank of Hope was skipped (same class of skip as Bank Mega / Bank Neo Commerce on 11-08/09). Bank of Hope now joins the skipped list for owner catch-up decision; it is NOT re-published today. Verified: Atlantic Union Bank is deduped index 100, Bank of Hope deduped 128, Bank of Ireland deduped 129.

## Trend scan (evidence)
- Google Trends US daily RSS 2026-11-14 (fetched ~06:30 IST): only sports (top: "auburn basketball", "pascal siakam") — no domain-usable trend, same as 2026-11-04..13.
- Google autocomplete (client=firefox, 2026-11-14):
  - seed "1099" -> "1099 form", "1099 nec", "1099 vs w2", "1099 misc", "1099-r", "1099 nec form"
  - seed "1099-k" -> "1099-k", "1099-k form", "1099-k threshold 2026", "1099-k threshold 2025", "1099-k threshold", "1099-k vs 1099-nec"
  - seed "home office deduction" -> "home office deduction", "home office deduction 2025", "home office deduction 2026", "home office deduction simplified method", "home office deduction calculator"
  - seed "payroll tax" -> "payroll taxes", "payroll tax calculator", "payroll tax cap", "payroll tax rates", "payroll tax cap 2026", "payroll taxes paid by employer"
  - seed "tax deductions 2026" -> "tax deductions 2026", "...married jointly", "...for seniors", "...over 65", "...calculator"
  - seed "small business tax" -> "small business taxes", "small business tax deductions", "small business tax deductions checklist"
  - seed "w2 form" -> "w2 form 2026", "w2 form pdf" (not picked — W-2 published Nov 4)
  - seed "bank statement" -> "bank statement example", "bank statement in spanish" (both published Nov 11), "bank statement loans", "bank statement mortgage loan" (slug bank-statement-mortgage-loan ALREADY published — rejected), "bank statement template" (published Nov 8)
- News/fact checks (browser search, 2026-11-14):
  - 1099-K: 2026 threshold = over $20,000 AND over 200 transactions, both required; OBBBA (Jul 4, 2025, Sec 70432) restored it retroactively, $600 ARPA rule repealed before it ever applied; recipient copies due Jan 31 (Feb 1, 2027 — Jan 31 is a Sunday); card transactions reportable in any amount; Zelle issues no 1099-K; several states lower (MA/MD/VT/VA $600, IL $1,000 + 4 txns). Sources: Fidelity, IRS FAQ, TaxBandits.
  - Home office: simplified $5/sq ft, max 300 sq ft ($1,500), Schedule C line 30, no Form 8829, no depreciation/recapture, capped by business gross income (excess lost); regular method Form 8829, business % of actual costs + depreciation; W-2 employees get nothing (TCJA suspended, OBBBA made permanent, IRS Notice 2026-10); 2026 standard deduction $16,100 single / $32,200 joint. Sources: IRS Pub 587 / Topic 509, selfemploylab, taxbrew.
  - Payroll tax cap: 2026 Social Security wage base $184,500 (up from $176,100 in 2025, +$8,400 / ~4.8%); 6.2% employee + 6.2% employer; max employee $11,439; self-employed 12.4% max $22,878; Medicare 1.45% no cap; extra 0.9% Medicare over $200,000 single / $250,000 joint. Sources: SSA 2026 COLA fact sheet via Paycor/legalclarity.
- Rejected picks: "bank statement mortgage loan" — slug already published; "tax deductions 2026" — overlaps Nov 9 year-end tax planning; "small business tax deductions checklist" — overlaps Nov 9 year-end tax planning; "w2 form 2026" — published Nov 4; "1099 vs w2" — published Nov 8; "bank statement example / in spanish" — published Nov 11; "year end bookkeeping checklist" — slug already published.
- Dedupe: none of the 3 slugs/titles appear in SEED+GENERATED posts, and none repeats or near-duplicates the last 7 days of trending picks (Nov 13: expense-report-template-excel, small-business-saturday-2026, balance-sheet-template-excel; Nov 12: w-9-form-2026, profit-and-loss-statement-template-excel, cash-flow-statement; Nov 11: bank-statement-example, bank-statement-in-spanish, bank-reconciliation; Nov 10: irs-transcript, xero-vs-quickbooks, irs-direct-pay; Nov 9: irs-mileage-rate-2026, year-end-tax-planning-2026, december-15-tax-deadline; Nov 8: 2027-tax-brackets, bank-statement-template, 1099-vs-w2; Nov 7: quickbooks-online-pricing, bank-statement-as-proof-of-address, bookkeeping-certification). "Home office" appears only as incidental mentions inside other posts (no dedicated post); 1099-K is a different form from the 1099-NEC/1099-vs-W2 posts.

## Posts
- (to fill after gates)

## Images
- (to fill after generation)

## Deploy
- (to fill after push)
