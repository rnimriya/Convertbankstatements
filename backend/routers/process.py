"""
POST /api/process-statement

Flow:
  1. Receive PDF upload
  2. Count pages (fast — metadata only)
  3. Check user's billing context
  4. If payment required → 402 with Stripe checkout URL
  5. Extract transactions (pdfplumber → Vision LLM fallback)
  6. Export to requested formats
  7. Log usage
  8. Return results (never persist raw PDF or transaction data)
"""
import logging
import time
from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import FileResponse

from core.config import get_settings
from core.security import get_verified_user_id
from models.schemas import (
    BillingType,
    PaymentRequiredError,
    ProcessStatementResponse,
    SubTier,
    UserBillingContext,
)
from services.billing_service import decide_billing, fetch_user_billing_context, record_usage
from services.export_service import export_all
from services.pdf_service import count_pages, extract_transactions, sha256_hash
from services.stripe_service import create_payg_checkout_session

router = APIRouter(prefix="/api", tags=["processing"])
logger = logging.getLogger(__name__)

MAX_UPLOAD_BYTES = 50 * 1024 * 1024  # 50 MB


@router.post(
    "/process-statement",
    response_model=ProcessStatementResponse,
    responses={
        402: {"model": PaymentRequiredError, "description": "Payment required"},
        413: {"description": "File too large"},
        415: {"description": "Only PDF files accepted"},
    },
)
async def process_statement(
    file: Annotated[UploadFile, File(description="Bank statement PDF")],
    export_formats: Annotated[str, Form()] = "csv",
    user_id: str = Depends(get_verified_user_id),
):
    settings = get_settings()
    start_ms = time.monotonic()

    # ── Validate upload ───────────────────────────────────────────────────────
    if file.content_type not in ("application/pdf", "application/x-pdf"):
        raise HTTPException(status_code=415, detail="Only PDF files are accepted.")

    file_bytes = await file.read()

    if len(file_bytes) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds {settings.max_upload_size_mb}MB limit.",
        )

    file_name = file.filename or "statement.pdf"
    formats = [f.strip().lower() for f in export_formats.split(",")]

    # ── Page count (fast — read metadata only) ────────────────────────────────
    page_count = count_pages(file_bytes)
    file_hash = sha256_hash(file_bytes)

    # ── Billing decision ──────────────────────────────────────────────────────
    billing_ctx: UserBillingContext = await fetch_user_billing_context(user_id)

    checkout_url = None
    if billing_ctx.tier in (SubTier.FREE, SubTier.PAYG) or (
        billing_ctx.tier in (SubTier.PRO, SubTier.BUSINESS)
        and billing_ctx.pages_used_this_period >= billing_ctx.monthly_page_limit
    ):
        checkout_url = await create_payg_checkout_session(
            customer_id=billing_ctx.stripe_customer_id,
            user_id=user_id,
            file_name=file_name,
            page_count=page_count,
        )

    billing = decide_billing(billing_ctx, page_count, checkout_url)

    if billing.payment_required:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=PaymentRequiredError(
                message=billing.message,
                page_count=page_count,
                price_usd=settings.payg_price_cents / 100,
                stripe_checkout_url=billing.stripe_checkout_url or "",
            ).model_dump(),
        )

    # ── Extract transactions ──────────────────────────────────────────────────
    transactions, bank_name = await extract_transactions(file_bytes, file_name)

    # ── Export ────────────────────────────────────────────────────────────────
    export_keys = export_all(transactions, formats)
    export_urls = {fmt: f"/api/exports/{key}" for fmt, key in export_keys.items()}

    processing_ms = int((time.monotonic() - start_ms) * 1000)

    # ── Log usage (fire-and-forget) ───────────────────────────────────────────
    await record_usage(
        user_id=user_id,
        file_name=file_name,
        file_hash=file_hash,
        page_count=page_count,
        pages_charged=billing.pages_charged,
        billing_type=billing.billing_type,
        transaction_count=len(transactions),
        processing_ms=processing_ms,
        bank_name=bank_name,
        export_formats=formats,
    )

    # ── Never store file_bytes beyond this point ──────────────────────────────
    del file_bytes

    return ProcessStatementResponse(
        success=True,
        file_name=file_name,
        page_count=page_count,
        transaction_count=len(transactions),
        bank_name=bank_name,
        billing=billing,
        transactions=transactions,
        export_urls=export_urls,
        processing_ms=processing_ms,
    )


@router.get("/exports/{key}")
async def download_export(key: str, _: str = Depends(get_verified_user_id)):
    """Serve a previously generated export file. Files are auto-deleted after TTL."""
    import glob
    import os

    matches = glob.glob(f"/tmp/bankstatements_exports/{key}.*")
    if not matches:
        raise HTTPException(status_code=404, detail="Export not found or expired.")
    return FileResponse(matches[0])
