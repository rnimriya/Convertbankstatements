"""
BankStatements FastAPI Backend
Extracts transactions from Indian bank statement PDFs.

Strategy (in order):
  1. pdfplumber  — text-based PDFs (SBI, HDFC, ICICI, Axis, Kotak…)
  2. Claude Vision — scanned / image-only PDFs (claude-sonnet-4-6)
"""

import base64
import csv
import hashlib
import io
import json
import logging
import os
import time
from typing import Optional

import fitz  # PyMuPDF
import pdfplumber
from anthropic import Anthropic
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()
logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

app = FastAPI(title="BankStatements API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", os.getenv("WEB_URL", "")],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ─── Models ──────────────────────────────────────────────────────────────────

class Transaction(BaseModel):
    date: str
    description: str
    amount: float
    balance: Optional[float] = None
    category: Optional[str] = None
    reference: Optional[str] = None


class ProcessResponse(BaseModel):
    success: bool
    file_name: str
    page_count: int
    transaction_count: int
    bank_name: Optional[str]
    transactions: list[Transaction]
    export_urls: dict[str, str]
    processing_ms: int


# ─── Page counting ────────────────────────────────────────────────────────────

def count_pages(data: bytes) -> int:
    with fitz.open(stream=data, filetype="pdf") as doc:
        return doc.page_count


# ─── pdfplumber extraction ────────────────────────────────────────────────────

HEADER_CANDIDATES = {
    "date":        ["date", "txn date", "transaction date", "value date", "posting date"],
    "description": ["description", "particulars", "narration", "details", "remarks", "transaction details"],
    "debit":       ["debit", "withdrawal", "dr", "debit amount", "amount debited"],
    "credit":      ["credit", "deposit", "cr", "credit amount", "amount credited"],
    "amount":      ["amount", "txn amount", "transaction amount"],
    "balance":     ["balance", "closing balance", "available balance", "running balance"],
}


def _find_col(header: list[str], field: str) -> Optional[int]:
    candidates = HEADER_CANDIDATES[field]
    for i, cell in enumerate(header):
        clean = cell.lower().strip().replace("\n", " ")
        if any(c in clean for c in candidates):
            return i
    return None


def _parse_amount(raw: str) -> Optional[float]:
    if not raw:
        return None
    cleaned = raw.strip().replace(",", "").replace("₹", "").replace("Rs.", "").replace("INR", "").strip()
    if cleaned in ("-", "—", "", "N/A", "NIL"):
        return None
    try:
        return float(cleaned)
    except ValueError:
        return None


def _categorise(desc: str) -> str:
    d = desc.upper()
    rules = [
        (["SALARY", "PAYROLL", "NEFT CR", "RTGS CR"], "Income"),
        (["EMI", "LOAN", "HOUSING", "HOME LOAN", "CAR LOAN"], "Loan EMI"),
        (["SIP", "MUTUAL FUND", "ZERODHA", "GROWW", "NSDL", "CDSL"], "Investments"),
        (["LIC", "INSURANCE", "HDFC LIFE", "BAJAJ", "STAR HEALTH", "ICICI PRU"], "Insurance"),
        (["ELECTRICITY", "WATER BILL", "GAS", "JIO", "AIRTEL", "BSNL", "VODAFONE", "MSEDCL", "BESCOM"], "Utilities"),
        (["SWIGGY", "ZOMATO", "DOMINOS", "PIZZA", "RESTAURANT", "FOOD"], "Food & Dining"),
        (["AMAZON", "FLIPKART", "MYNTRA", "MEESHO", "SNAPDEAL", "NYKAA"], "Shopping"),
        (["IRCTC", "RAILWAY", "FLIGHT", "MAKEMYTRIP", "GOIBIBO", "REDBUS", "OYO"], "Travel"),
        (["OLA", "UBER", "RAPIDO", "AUTO", "METRO", "PETROL", "HPCL", "BPCL", "HP GAS"], "Transport"),
        (["ATM", "CASH WDL", "CASH WITHDRAWAL"], "Cash"),
        (["UPI", "NEFT", "RTGS", "IMPS", "TRANSFER"], "Transfer"),
    ]
    for keywords, category in rules:
        if any(k in d for k in keywords):
            return category
    return "Others"


def extract_with_pdfplumber(data: bytes) -> tuple[list[Transaction], Optional[str]]:
    transactions: list[Transaction] = []
    bank_name: Optional[str] = None
    full_text_lines: list[str] = []

    with pdfplumber.open(io.BytesIO(data)) as pdf:
        first_text = (pdf.pages[0].extract_text() or "") if pdf.pages else ""
        bank_name = detect_bank(first_text)

        for page in pdf.pages:
            # ── Strategy 1: table extraction ────────────────────────────
            tables = page.extract_tables()
            for table in tables:
                if not table or len(table) < 2:
                    continue

                header = [str(c or "").lower().strip().replace("\n", " ") for c in table[0]]
                date_idx  = _find_col(header, "date")
                desc_idx  = _find_col(header, "description")
                debit_idx = _find_col(header, "debit")
                credit_idx = _find_col(header, "credit")
                amt_idx   = _find_col(header, "amount")
                bal_idx   = _find_col(header, "balance")

                if date_idx is None or desc_idx is None:
                    continue

                for row in table[1:]:
                    try:
                        date = str(row[date_idx] or "").strip()
                        desc = str(row[desc_idx] or "").strip()
                        if not date or not desc:
                            continue

                        amount: Optional[float] = None
                        if debit_idx is not None and credit_idx is not None:
                            debit  = _parse_amount(str(row[debit_idx] or ""))
                            credit = _parse_amount(str(row[credit_idx] or ""))
                            if debit:
                                amount = -abs(debit)
                            elif credit:
                                amount = abs(credit)
                        elif amt_idx is not None:
                            amount = _parse_amount(str(row[amt_idx] or ""))

                        if amount is None:
                            continue

                        balance: Optional[float] = None
                        if bal_idx is not None and bal_idx < len(row):
                            balance = _parse_amount(str(row[bal_idx] or ""))

                        transactions.append(Transaction(
                            date=date, description=desc,
                            amount=round(amount, 2),
                            balance=round(balance, 2) if balance is not None else None,
                            category=_categorise(desc),
                        ))
                    except Exception:
                        continue

            # ── Collect text for fallback ───────────────────────────────
            text = page.extract_text() or ""
            full_text_lines.extend(text.splitlines())

    # ── Strategy 2: regex on raw text (many Indian bank PDFs) ───────────
    if not transactions and full_text_lines:
        transactions = extract_from_text(full_text_lines)

    return transactions, bank_name


# Matches: DD/MM/YYYY or DD-MM-YYYY or YYYY-MM-DD
DATE_RE = r"(\d{2}[/\-]\d{2}[/\-]\d{4}|\d{4}[/\-]\d{2}[/\-]\d{2}|\d{2}\s+\w{3}\s+\d{4})"
# Amount: optional ₹/Rs., digits with commas, optional decimal
AMOUNT_RE = r"(?:₹|Rs\.?)?\s*([\d,]+(?:\.\d{1,2})?)"


def extract_from_text(lines: list[str]) -> list[Transaction]:
    """
    Parse columnar text rows from Indian bank statements.
    Handles formats like:
      DD/MM/YYYY  DESCRIPTION  DEBIT   CREDIT   BALANCE
      DD/MM/YYYY  DESCRIPTION  AMOUNT  BALANCE
    """
    import re
    txns: list[Transaction] = []

    date_pattern = re.compile(DATE_RE)
    num_pattern  = re.compile(r"[\d,]+\.\d{2}")

    for line in lines:
        line = line.strip()
        if len(line) < 20:
            continue

        date_m = date_pattern.search(line)
        if not date_m:
            continue

        date_str = date_m.group(1)
        after_date = line[date_m.end():].strip()

        # Extract all numbers from the rest of the line
        numbers = num_pattern.findall(after_date)
        if not numbers:
            continue

        # Description is everything before the first number
        first_num_pos = num_pattern.search(after_date)
        desc = after_date[:first_num_pos.start()].strip() if first_num_pos else after_date

        # Clean up description
        desc = re.sub(r"\s{2,}", " ", desc).strip()
        if not desc or len(desc) < 3:
            continue

        # Parse amounts
        floats = []
        for n in numbers:
            try:
                floats.append(float(n.replace(",", "")))
            except ValueError:
                pass

        if not floats:
            continue

        # Heuristic: last float = balance, second-to-last or lone float = amount
        if len(floats) >= 3:
            # debit  credit  balance pattern
            debit, credit, balance = floats[-3], floats[-2], floats[-1]
            amount = -debit if debit > 0 and credit == 0 else credit
        elif len(floats) == 2:
            amount, balance = floats[0], floats[1]
            # Determine sign from keywords
            if any(kw in desc.upper() for kw in ["CREDIT", "SALARY", "NEFT CR", "UPI CR", "RTGS CR"]):
                amount = abs(amount)
            else:
                amount = -abs(amount)
        else:
            amount = floats[0]
            balance = None
            if any(kw in desc.upper() for kw in ["CREDIT", "SALARY", "NEFT CR", "UPI CR"]):
                amount = abs(amount)
            else:
                amount = -abs(amount)
            txns.append(Transaction(
                date=date_str, description=desc, amount=round(amount, 2),
                balance=None, category=_categorise(desc)
            ))
            continue

        txns.append(Transaction(
            date=date_str, description=desc,
            amount=round(amount, 2),
            balance=round(balance, 2),
            category=_categorise(desc),
        ))

    return txns


# ─── Claude Vision extraction (scanned PDFs) ──────────────────────────────────

VISION_PROMPT = """You are extracting Indian bank statement transactions.
Return ONLY a valid JSON object — no markdown, no explanation:

{
  "bank_name": "Bank Name or null",
  "transactions": [
    {
      "date": "DD/MM/YYYY or YYYY-MM-DD",
      "description": "transaction narration",
      "amount": -1234.56,
      "balance": 50000.00
    }
  ]
}

Rules:
- Debits / withdrawals → NEGATIVE amount
- Credits / deposits → POSITIVE amount
- Skip header rows, totals, and page footers
- Indian merchants: Swiggy, Zomato, Jio, Amazon.in etc. are common
- If no transactions found return empty array
"""


def extract_with_vision(data: bytes) -> tuple[list[Transaction], Optional[str]]:
    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    if not api_key:
        log.warning("ANTHROPIC_API_KEY not set — Vision extraction unavailable")
        return [], None

    client = Anthropic(api_key=api_key)
    pdf_b64 = base64.standard_b64encode(data).decode()

    try:
        message = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=8192,
            messages=[{
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": "application/pdf",
                            "data": pdf_b64,
                        },
                    },
                    {"type": "text", "text": VISION_PROMPT},
                ],
            }],
        )

        raw = message.content[0].text.strip()
        if raw.startswith("```"):
            raw = "\n".join(raw.split("\n")[1:-1])

        parsed = json.loads(raw)
        bank_name = parsed.get("bank_name")
        txns = [
            Transaction(
                date=t.get("date", ""),
                description=t.get("description", ""),
                amount=float(t.get("amount", 0)),
                balance=float(t["balance"]) if t.get("balance") is not None else None,
                category=_categorise(t.get("description", "")),
            )
            for t in parsed.get("transactions", [])
        ]
        return txns, bank_name

    except Exception as e:
        log.error("Vision extraction failed: %s", e)
        return [], None


# ─── Bank detection ───────────────────────────────────────────────────────────

INDIAN_BANKS = [
    ("state bank", "State Bank of India (SBI)"), ("sbi", "State Bank of India (SBI)"),
    ("hdfc", "HDFC Bank"), ("icici", "ICICI Bank"),
    ("axis bank", "Axis Bank"), ("kotak", "Kotak Mahindra Bank"),
    ("punjab national", "Punjab National Bank"), ("pnb", "Punjab National Bank"),
    ("bank of baroda", "Bank of Baroda"),
    ("canara", "Canara Bank"), ("union bank", "Union Bank of India"),
    ("indusind", "IndusInd Bank"), ("yes bank", "Yes Bank"),
    ("idfc", "IDFC FIRST Bank"), ("federal bank", "Federal Bank"),
    ("south indian bank", "South Indian Bank"), ("rbl", "RBL Bank"),
    ("bandhan", "Bandhan Bank"), ("indian bank", "Indian Bank"),
    ("central bank", "Central Bank of India"), ("uco bank", "UCO Bank"),
    ("bank of india", "Bank of India"), ("au small finance", "AU Small Finance Bank"),
    ("paytm", "Paytm Payments Bank"), ("airtel", "Airtel Payments Bank"),
]


def detect_bank(text: str) -> Optional[str]:
    t = text.lower()
    for key, name in INDIAN_BANKS:
        if key in t:
            return name
    return None


# ─── CSV export ───────────────────────────────────────────────────────────────

def to_csv_b64(txns: list[Transaction]) -> str:
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(["Date", "Description", "Amount (INR)", "Balance (INR)", "Category", "Reference"])
    for t in txns:
        w.writerow([t.date, t.description, t.amount, t.balance or "", t.category or "", t.reference or ""])
    return base64.b64encode(buf.getvalue().encode()).decode()


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "backend": "fastapi", "pdf_engine": "pdfplumber+vision"}


@app.post("/api/process-statement", response_model=ProcessResponse)
async def process_statement(
    file: UploadFile = File(...),
    export_formats: str = Form("csv"),
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=415, detail="Only PDF files are accepted.")

    start = time.monotonic()
    data = await file.read()

    if len(data) > 50 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File exceeds 50 MB.")

    page_count = count_pages(data)
    log.info("Processing %s (%d pages)", file.filename, page_count)

    # Try pdfplumber first (fast, no API cost)
    transactions, bank_name = extract_with_pdfplumber(data)

    if not transactions:
        log.info("pdfplumber found no transactions → trying Claude Vision")
        transactions, bank_name = extract_with_vision(data)

    log.info("Extracted %d transactions in %.1fs", len(transactions), time.monotonic() - start)

    export_urls: dict[str, str] = {}
    formats = [f.strip().lower() for f in export_formats.split(",")]
    if "csv" in formats:
        export_urls["csv"] = f"data:text/csv;base64,{to_csv_b64(transactions)}"

    return ProcessResponse(
        success=True,
        file_name=file.filename,
        page_count=page_count,
        transaction_count=len(transactions),
        bank_name=bank_name,
        transactions=transactions[:20],   # preview; full data in CSV
        export_urls=export_urls,
        processing_ms=int((time.monotonic() - start) * 1000),
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, log_level="info")
