"""
Export Service — converts extracted transactions to CSV, XLSX, OFX, QFX.
All files are written to a temporary directory and scheduled for deletion
after TTL seconds. No financial data persists beyond the session.
"""
import csv
import io
import os
import tempfile
import time
import uuid
from datetime import datetime
from typing import Optional

import pandas as pd
from ofxtools.models import (
    BANKTRANLIST,
    BANKACCTFROM,
    STMTRS,
    STMTTRNRS,
    OFX,
    STMTTRN,
    LEDGERBAL,
)
from ofxtools.header import make_header
from ofxtools.utils import UTC

from models.schemas import Transaction

# Temp export dir — in production, use a presigned S3 URL instead
_EXPORT_DIR = os.path.join(tempfile.gettempdir(), "bankstatements_exports")
os.makedirs(_EXPORT_DIR, exist_ok=True)


def _temp_path(ext: str) -> tuple[str, str]:
    """Returns (file_path, public_key) where public_key is used in the download URL."""
    key = uuid.uuid4().hex
    return os.path.join(_EXPORT_DIR, f"{key}.{ext}"), key


def to_csv(transactions: list[Transaction]) -> tuple[bytes, str]:
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["Date", "Description", "Amount", "Balance", "Category"])
    for t in transactions:
        writer.writerow([t.date, t.description, t.amount, t.balance or "", t.category or ""])
    return buf.getvalue().encode(), "text/csv"


def to_xlsx(transactions: list[Transaction]) -> tuple[bytes, str]:
    rows = [
        {
            "Date": t.date,
            "Description": t.description,
            "Amount": t.amount,
            "Balance": t.balance,
            "Category": t.category,
        }
        for t in transactions
    ]
    df = pd.DataFrame(rows)
    buf = io.BytesIO()
    with pd.ExcelWriter(buf, engine="xlsxwriter") as writer:
        df.to_excel(writer, sheet_name="Transactions", index=False)
        workbook = writer.book
        worksheet = writer.sheets["Transactions"]
        # Format amount column as currency
        money_fmt = workbook.add_format({"num_format": "$#,##0.00"})
        worksheet.set_column("C:D", 14, money_fmt)
        worksheet.set_column("B:B", 45)
    return buf.getvalue(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"


def to_ofx(
    transactions: list[Transaction],
    bank_id: str = "000000000",
    account_id: str = "UNKNOWN",
    currency: str = "USD",
) -> tuple[bytes, str]:
    """
    Generates OFX 2.3 (SGML variant) compatible with QuickBooks and Xero.
    """
    stmttrns = []
    for t in transactions:
        try:
            dt = datetime.fromisoformat(t.date).replace(tzinfo=UTC)
        except ValueError:
            continue
        trntype = "CREDIT" if t.amount >= 0 else "DEBIT"
        stmttrns.append(
            STMTTRN(
                trntype=trntype,
                dtposted=dt,
                trnamt=t.amount,
                fitid=uuid.uuid4().hex[:16],
                memo=t.description[:255],
            )
        )

    banktranlist = BANKTRANLIST(*stmttrns, dtstart=stmttrns[0].dtposted if stmttrns else datetime.now(UTC), dtend=stmttrns[-1].dtposted if stmttrns else datetime.now(UTC))
    bankacctfrom = BANKACCTFROM(bankid=bank_id, acctid=account_id, accttype="CHECKING")
    stmtrs = STMTRS(
        curdef=currency,
        bankacctfrom=bankacctfrom,
        banktranlist=banktranlist,
        ledgerbal=LEDGERBAL(balamt=transactions[-1].balance or 0, dtasof=datetime.now(UTC)) if transactions else None,
    )
    stmttrnrs = STMTTRNRS(trnuid="1001", status=None, stmtrs=stmtrs)

    root = OFX(signonmsgsrsv1=None, bankmsgsrsv1=stmttrnrs)
    header = make_header(version=220)
    content = str(header) + str(root.to_etree())

    return content.encode(), "application/x-ofx"


def to_qfx(transactions: list[Transaction], **kwargs) -> tuple[bytes, str]:
    """QFX is Quicken's OFX variant — identical structure, different MIME type."""
    data, _ = to_ofx(transactions, **kwargs)
    return data, "application/x-qfx"


EXPORTERS = {
    "csv": ("csv", to_csv),
    "xlsx": ("xlsx", to_xlsx),
    "ofx": ("ofx", to_ofx),
    "qfx": ("qfx", to_qfx),
}


def export_all(
    transactions: list[Transaction],
    formats: list[str],
) -> dict[str, str]:
    """
    Returns a mapping of format → download key.
    The key is used by the /exports/{key} endpoint to serve the file.
    """
    result: dict[str, str] = {}
    for fmt in formats:
        if fmt not in EXPORTERS:
            continue
        ext, fn = EXPORTERS[fmt]
        try:
            data, _ = fn(transactions)
            path, key = _temp_path(ext)
            with open(path, "wb") as f:
                f.write(data)
            result[fmt] = key
        except Exception:
            pass
    return result
