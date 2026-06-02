"""
PDF Service — page counting and extraction.

Strategy (in order of preference):
  1. pdfplumber  — text-based PDFs with detectable tables
  2. Camelot     — lattice/stream tables in complex PDFs
  3. Vision LLM  — scanned / image-only PDFs (Claude claude-sonnet-4-6)

Page counting uses PyMuPDF (fitz) — it reads only PDF metadata, never
renders or extracts content, so it's nearly instant even for large files.
"""
import hashlib
import io
import json
import logging
import time
from pathlib import Path
from typing import Optional

import fitz  # PyMuPDF
import pdfplumber
from anthropic import AsyncAnthropic

from core.config import get_settings
from models.schemas import Transaction

logger = logging.getLogger(__name__)


def count_pages(file_bytes: bytes) -> int:
    """Read page count from PDF metadata without rendering any page."""
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        return doc.page_count


def sha256_hash(file_bytes: bytes) -> str:
    return hashlib.sha256(file_bytes).hexdigest()


async def extract_transactions(
    file_bytes: bytes,
    file_name: str,
) -> tuple[list[Transaction], Optional[str]]:
    """
    Returns (transactions, bank_name).
    Tries pdfplumber first; falls back to Vision LLM for scanned PDFs.
    """
    start = time.monotonic()

    transactions, bank_name = _extract_with_pdfplumber(file_bytes)

    if not transactions:
        logger.info("pdfplumber found no transactions — falling back to Vision LLM")
        transactions, bank_name = await _extract_with_vision_llm(file_bytes)

    elapsed_ms = int((time.monotonic() - start) * 1000)
    logger.info(
        "Extracted %d transactions from %s in %dms",
        len(transactions),
        file_name,
        elapsed_ms,
    )
    return transactions, bank_name


# ─── pdfplumber path ─────────────────────────────────────────────────────────

def _extract_with_pdfplumber(
    file_bytes: bytes,
) -> tuple[list[Transaction], Optional[str]]:
    transactions: list[Transaction] = []
    bank_name: Optional[str] = None

    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            # Try to read bank name from first page text
            first_page_text = pdf.pages[0].extract_text() or ""
            bank_name = _infer_bank_name(first_page_text)

            for page in pdf.pages:
                tables = page.extract_tables()
                for table in tables:
                    transactions.extend(_parse_table_rows(table))
    except Exception as e:
        logger.warning("pdfplumber extraction failed: %s", e)

    return transactions, bank_name


def _parse_table_rows(table: list[list]) -> list[Transaction]:
    """
    Heuristically map table columns to (date, description, amount, balance).
    Banks vary wildly — this covers the common column orderings.
    """
    transactions = []
    if not table or len(table) < 2:
        return transactions

    header = [str(c).lower().strip() if c else "" for c in table[0]]
    date_idx = _find_col(header, ["date", "txn date", "transaction date", "value date"])
    desc_idx = _find_col(header, ["description", "particulars", "narration", "details", "memo"])
    amt_idx = _find_col(header, ["amount", "debit", "credit", "withdrawal", "deposit"])
    bal_idx = _find_col(header, ["balance", "running balance", "closing balance"])

    if date_idx is None or desc_idx is None or amt_idx is None:
        return transactions

    for row in table[1:]:
        try:
            date = str(row[date_idx]).strip()
            desc = str(row[desc_idx]).strip()
            raw_amt = str(row[amt_idx]).replace(",", "").replace("$", "").strip()
            if not date or not raw_amt or raw_amt in ("", "-", "N/A"):
                continue
            amount = float(raw_amt)
            balance = None
            if bal_idx is not None and row[bal_idx]:
                balance = float(str(row[bal_idx]).replace(",", "").replace("$", "").strip())
            transactions.append(Transaction(date=date, description=desc, amount=amount, balance=balance))
        except (ValueError, IndexError):
            continue

    return transactions


def _find_col(header: list[str], candidates: list[str]) -> Optional[int]:
    for i, h in enumerate(header):
        if any(c in h for c in candidates):
            return i
    return None


def _infer_bank_name(text: str) -> Optional[str]:
    known_banks = [
        "Chase", "Bank of America", "Wells Fargo", "Citibank", "US Bank",
        "HSBC", "Barclays", "HDFC", "ICICI", "State Bank", "TD Bank",
        "Capital One", "PNC", "Ally", "Charles Schwab", "Fidelity",
    ]
    text_lower = text.lower()
    for bank in known_banks:
        if bank.lower() in text_lower:
            return bank
    return None


# ─── Vision LLM path (handles scanned / 1000+ bank formats) ──────────────────

_EXTRACTION_PROMPT = """You are a financial data extraction specialist.
Extract ALL transactions from this bank statement image into a JSON array.

Return ONLY a valid JSON object with this exact structure:
{
  "bank_name": "Bank Name or null",
  "transactions": [
    {
      "date": "YYYY-MM-DD",
      "description": "transaction description",
      "amount": -123.45,
      "balance": 1234.56
    }
  ]
}

Rules:
- Debits/withdrawals must be NEGATIVE amounts
- Credits/deposits must be POSITIVE amounts
- Use null for missing balance
- Skip header rows, footers, and summary rows
- Return empty transactions array if no transactions found
"""


async def _extract_with_vision_llm(
    file_bytes: bytes,
) -> tuple[list[Transaction], Optional[str]]:
    settings = get_settings()
    client = AsyncAnthropic(api_key=settings.anthropic_api_key)

    import base64
    pdf_b64 = base64.standard_b64encode(file_bytes).decode("utf-8")

    try:
        message = await client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=8192,
            messages=[
                {
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
                        {"type": "text", "text": _EXTRACTION_PROMPT},
                    ],
                }
            ],
        )

        raw = message.content[0].text.strip()
        # Strip markdown fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        data = json.loads(raw)
        bank_name = data.get("bank_name")
        transactions = [Transaction(**t) for t in data.get("transactions", [])]
        return transactions, bank_name

    except Exception as e:
        logger.error("Vision LLM extraction failed: %s", e)
        return [], None
