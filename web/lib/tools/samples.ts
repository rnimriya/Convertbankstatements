/**
 * Downloadable sample files for the free tools and the QBO import-error
 * decoder page. Static strings on purpose: importing the QBO generator here
 * would pull the xlsx bundle into client pages. Every sample below is also
 * used by the fixture script, so a sample that stops parsing fails loudly.
 */

export interface SampleFile {
  id: string;
  filename: string;
  label: string;
  description: string;
  content: string;
}

export const SAMPLE_CLEAN_QBO = `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:UTF-8
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

<OFX>
<SIGNONMSGSRSV1>
<SONRS>
<STATUS><CODE>0</CODE><SEVERITY>INFO</SEVERITY></STATUS>
<DTSERVER>20260110000000</DTSERVER>
<LANGUAGE>ENG</LANGUAGE>
</SONRS>
</SIGNONMSGSRSV1>
<BANKMSGSRSV1>
<STMTTRNRS>
<TRNUID>1001</TRNUID>
<STATUS><CODE>0</CODE><SEVERITY>INFO</SEVERITY></STATUS>
<STMTRS>
<CURDEF>USD</CURDEF>
<BANKACCTFROM>
<BANKID>000000000</BANKID>
<ACCTID>0000000000</ACCTID>
<ACCTTYPE>CHECKING</ACCTTYPE>
</BANKACCTFROM>
<BANKTRANLIST>
<DTSTART>20260102</DTSTART>
<DTEND>20260109</DTEND>
<STMTTRN>
<TRNTYPE>CREDIT</TRNTYPE>
<DTPOSTED>20260102</DTPOSTED>
<TRNAMT>2500.00</TRNAMT>
<FITID>SMP001</FITID>
<NAME>ACME PAYROLL</NAME>
<MEMO>Salary</MEMO>
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT</TRNTYPE>
<DTPOSTED>20260105</DTPOSTED>
<TRNAMT>-42.10</TRNAMT>
<FITID>SMP002</FITID>
<NAME>AMAZON MKTPLACE</NAME>
<MEMO>Shopping</MEMO>
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT</TRNTYPE>
<DTPOSTED>20260109</DTPOSTED>
<TRNAMT>-86.25</TRNAMT>
<FITID>SMP003</FITID>
<NAME>WHOLE FOODS MARKET</NAME>
<MEMO>Groceries</MEMO>
</STMTTRN>
</BANKTRANLIST>
<LEDGERBAL>
<BALAMT>2371.65</BALAMT>
<DTASOF>20260109</DTASOF>
</LEDGERBAL>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>`;

export const SAMPLE_DUPLICATE_QBO = `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:UTF-8
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

<OFX>
<SIGNONMSGSRSV1>
<SONRS>
<STATUS><CODE>0</CODE><SEVERITY>INFO</SEVERITY></STATUS>
<DTSERVER>20260110000000</DTSERVER>
<LANGUAGE>ENG</LANGUAGE>
</SONRS>
</SIGNONMSGSRSV1>
<BANKMSGSRSV1>
<STMTTRNRS>
<TRNUID>1001</TRNUID>
<STATUS><CODE>0</CODE><SEVERITY>INFO</SEVERITY></STATUS>
<STMTRS>
<CURDEF>USD</CURDEF>
<BANKACCTFROM>
<BANKID>000000000</BANKID>
<ACCTID>0000000000</ACCTID>
<ACCTTYPE>CHECKING</ACCTTYPE>
</BANKACCTFROM>
<BANKTRANLIST>
<DTSTART>20260102</DTSTART>
<DTEND>20260102</DTEND>
<STMTTRN>
<TRNTYPE>CREDIT</TRNTYPE>
<DTPOSTED>20260102</DTPOSTED>
<TRNAMT>100.00</TRNAMT>
<FITID>DUP001</FITID>
<NAME>ACME PAYROLL</NAME>
<MEMO>Salary</MEMO>
</STMTTRN>
<STMTTRN>
<TRNTYPE>CREDIT</TRNTYPE>
<DTPOSTED>20260102</DTPOSTED>
<TRNAMT>100.00</TRNAMT>
<FITID>DUP001</FITID>
<NAME>ACME PAYROLL</NAME>
<MEMO>Salary</MEMO>
</STMTTRN>
</BANKTRANLIST>
<LEDGERBAL>
<BALAMT>200.00</BALAMT>
<DTASOF>20260102</DTASOF>
</LEDGERBAL>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>`;

// Stripe balance-transactions export. Hand-computed tie-out:
// gross 150.00 (100 + 50) − refunds 20.00 − fees 4.65 (2.90 + 1.75) = payout 125.35.
export const SAMPLE_STRIPE_CSV = `Balance Transaction ID,Type,Amount,Fee,Net,Created,Description
txn_001,charge,100.00,2.90,97.10,2026-01-02,Online order
txn_002,charge,50.00,1.75,48.25,2026-01-03,Online order
txn_003,refund,-20.00,0.00,-20.00,2026-01-04,Refund
po_001,payout,125.35,0.00,125.35,2026-01-05,Stripe payout`;

// Amazon settlement report. Hand-computed tie-out:
// gross 180.00 (120 + 60) − refunds 30.00 − fees 27.00 (18 + 9) = payout 123.00.
export const SAMPLE_AMAZON_CSV = `settlement-id,date,transaction-type,order-id,amount,fee
SET-1001,2026-01-02,Order,ORD-111,120.00,18.00
SET-1001,2026-01-03,Order,ORD-112,60.00,9.00
SET-1001,2026-01-04,Refund,ORD-111,-30.00,0.00
SET-1001,2026-01-05,Payout,,123.00,0.00`;

// Shopify Payments payout export. Hand-computed tie-out:
// gross 300.00 (200 + 100) − refunds 50.00 − fees 8.70 (5.80 + 2.90) = payout 241.30.
export const SAMPLE_SHOPIFY_CSV = `payout-id,date,type,gross,fee,net
PO-2001,2026-01-02,Charge,200.00,5.80,194.20
PO-2001,2026-01-03,Charge,100.00,2.90,97.10
PO-2001,2026-01-04,Refund,-50.00,0.00,-50.00
PO-2001,2026-01-05,Payout,0.00,0.00,241.30`;

// Square payout export. Hand-computed tie-out:
// gross 350.00 (200 + 150) − refunds 40.00 − fees 10.75 (6.10 + 4.65) = payout 299.25.
export const SAMPLE_SQUARE_CSV = `payout-id,date,type,gross,fee,net
SQ-1001,2026-01-02,Charge,200.00,6.10,193.90
SQ-1001,2026-01-03,Charge,150.00,4.65,145.35
SQ-1001,2026-01-04,Refund,-40.00,0.00,-40.00
SQ-1001,2026-01-05,Payout,0.00,0.00,299.25`;

// Etsy monthly statement. Hand-computed tie-out:
// gross 200.00 (120 + 80) − refunds 20.00 − fees 14.00 (8.40 + 5.60) = deposit 166.00.
export const SAMPLE_ETSY_CSV = `date,type,gross,fee,net,deposit-id
2026-01-02,Sale,120.00,8.40,111.60,DEP-3001
2026-01-03,Sale,80.00,5.60,74.40,DEP-3001
2026-01-04,Refund,-20.00,0.00,-20.00,DEP-3001
2026-01-05,Deposit,0.00,0.00,166.00,DEP-3001`;

// PayPal activity download (subset of columns the parser reads).
export const SAMPLE_PAYPAL_CSV = `Date,Name,Type,Gross,Fee,Net
2026-01-02,Online Store,Express Checkout Payment,100.00,2.90,97.10
2026-01-03,Online Store,Express Checkout Payment,50.00,1.75,48.25
2026-01-04,Customer,Refund,-20.00,0.00,-20.00
2026-01-05,PayPal,General Withdrawal,0.00,0.00,125.35`;

// Generic bank CSV. Balances chain: 2500.00 − 42.10 = 2457.90 − 86.25 = 2371.65.
export const SAMPLE_GENERIC_CSV = `Date,Description,Amount,Balance
2026-01-02,ACME PAYROLL,2500.00,2500.00
2026-01-05,AMAZON MKTPLACE,-42.10,2457.90
2026-01-09,WHOLE FOODS MARKET,-86.25,2371.65`;

export const SAMPLES: SampleFile[] = [
  {
    id: "clean-qbo",
    filename: "sample-clean.qbo",
    label: "Clean QBO (imports fine)",
    description: "Three transactions, unique transaction IDs, closing balance included. Run it through the QBO checker or the cleanup checker to see a clean report.",
    content: SAMPLE_CLEAN_QBO,
  },
  {
    id: "duplicate-qbo",
    filename: "sample-duplicate-fitid.qbo",
    label: "QBO with a duplicate transaction ID",
    description: "The same FITID (DUP001) appears twice. QuickBooks may silently skip the second copy — the cleanup checker flags it as an exact duplicate.",
    content: SAMPLE_DUPLICATE_QBO,
  },
  {
    id: "stripe-csv",
    filename: "sample-stripe-payouts.csv",
    label: "Stripe payout CSV",
    description: "Balance-transactions export: two charges, one refund, and the payout row. Ties out at $125.35.",
    content: SAMPLE_STRIPE_CSV,
  },
  {
    id: "amazon-csv",
    filename: "sample-amazon-settlement.csv",
    label: "Amazon settlement CSV",
    description: "One settlement: two orders, one refund, and the payout row. Ties out at $123.00.",
    content: SAMPLE_AMAZON_CSV,
  },
  {
    id: "shopify-csv",
    filename: "sample-shopify-payout.csv",
    label: "Shopify payout CSV",
    description: "One payout: two charges, one refund, and the payout row. Ties out at $241.30.",
    content: SAMPLE_SHOPIFY_CSV,
  },
  {
    id: "square-csv",
    filename: "sample-square-payout.csv",
    label: "Square payout CSV",
    description: "One payout: two charges, one refund, and the payout row. Ties out at $299.25.",
    content: SAMPLE_SQUARE_CSV,
  },
  {
    id: "etsy-csv",
    filename: "sample-etsy-statement.csv",
    label: "Etsy statement CSV",
    description: "One deposit: two sales, one refund, and the deposit row. Ties out at $166.00.",
    content: SAMPLE_ETSY_CSV,
  },
  {
    id: "paypal-csv",
    filename: "sample-paypal-activity.csv",
    label: "PayPal activity CSV",
    description: "Activity download with two payments, one refund, and the bank transfer. Use it on the PayPal converter page.",
    content: SAMPLE_PAYPAL_CSV,
  },
  {
    id: "generic-csv",
    filename: "sample-bank-transactions.csv",
    label: "Generic bank CSV",
    description: "Date, description, amount, and running balance columns. Use it on the CSV to QBO converter — the mapping is auto-detected.",
    content: SAMPLE_GENERIC_CSV,
  },
];

export function getSample(id: string): SampleFile | undefined {
  return SAMPLES.find((s) => s.id === id);
}
