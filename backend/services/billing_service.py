"""
Billing Service — determines what a user can process and at what cost.

Decision tree:
  1. FREE tier with pages_used < 8         → FREE_TIER, no charge
  2. FREE tier with pages_used >= 8         → PAYMENT_REQUIRED ($1.99 PAYG)
  3. PRO/BUSINESS with pages remaining      → SUBSCRIPTION, deduct from allotment
  4. PRO/BUSINESS with pages exhausted      → PAYMENT_REQUIRED ($1.99 PAYG overage)
  5. PAYG tier                              → PAYMENT_REQUIRED ($1.99 per doc)
"""
import logging
from typing import Optional

import httpx

from core.config import get_settings
from models.schemas import BillingDecision, BillingType, SubTier, UserBillingContext

logger = logging.getLogger(__name__)

FREE_PAGE_CAP = 8


def decide_billing(
    ctx: UserBillingContext,
    page_count: int,
    stripe_checkout_url: Optional[str] = None,
) -> BillingDecision:
    settings = get_settings()

    if ctx.tier == SubTier.FREE:
        free_remaining = max(0, FREE_PAGE_CAP - ctx.pages_used_this_period)

        if free_remaining >= page_count:
            return BillingDecision(
                billing_type=BillingType.FREE_TIER,
                pages_charged=page_count,
                payment_required=False,
                message=f"{free_remaining - page_count} free pages remaining after this document.",
            )

        if free_remaining > 0:
            # Partial free coverage — still require payment for the whole doc
            # (simpler UX than splitting a document across billing types)
            pass

        return BillingDecision(
            billing_type=BillingType.PAY_AS_YOU_GO,
            pages_charged=page_count,
            payment_required=True,
            stripe_checkout_url=stripe_checkout_url,
            message=f"You've used all {FREE_PAGE_CAP} free pages. Pay ${settings.payg_price_cents / 100:.2f} to process this document.",
        )

    if ctx.tier in (SubTier.PRO, SubTier.BUSINESS):
        sub_remaining = max(0, ctx.monthly_page_limit - ctx.pages_used_this_period)

        if sub_remaining >= page_count:
            return BillingDecision(
                billing_type=BillingType.SUBSCRIPTION,
                pages_charged=page_count,
                payment_required=False,
                message=f"{sub_remaining - page_count} subscription pages remaining this month.",
            )

        return BillingDecision(
            billing_type=BillingType.PAY_AS_YOU_GO,
            pages_charged=page_count,
            payment_required=True,
            stripe_checkout_url=stripe_checkout_url,
            message=f"Monthly page limit reached. Pay ${settings.payg_price_cents / 100:.2f} to continue.",
        )

    # PAYG tier — always requires payment per document
    return BillingDecision(
        billing_type=BillingType.PAY_AS_YOU_GO,
        pages_charged=page_count,
        payment_required=True,
        stripe_checkout_url=stripe_checkout_url,
        message=f"Pay ${settings.payg_price_cents / 100:.2f} to process this document.",
    )


async def fetch_user_billing_context(user_id: str) -> UserBillingContext:
    """
    Fetch the user's current billing state from the Next.js API (which owns
    the Prisma/PostgreSQL connection). The backend stays stateless.
    """
    settings = get_settings()
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{settings.nextjs_internal_url}/api/internal/billing-context",
            headers={"x-api-key": settings.backend_api_key},
            params={"userId": user_id},
            timeout=5.0,
        )
        resp.raise_for_status()
        data = resp.json()
        return UserBillingContext(**data)


async def record_usage(
    user_id: str,
    file_name: str,
    file_hash: str,
    page_count: int,
    pages_charged: int,
    billing_type: BillingType,
    transaction_count: int,
    processing_ms: int,
    bank_name: Optional[str],
    export_formats: list[str],
    payment_id: Optional[str] = None,
) -> None:
    """Write a UsageLog record via the Next.js internal API."""
    settings = get_settings()
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{settings.nextjs_internal_url}/api/internal/record-usage",
            headers={"x-api-key": settings.backend_api_key},
            json={
                "userId": user_id,
                "fileName": file_name,
                "fileHash": file_hash,
                "pageCount": page_count,
                "pagesCharged": pages_charged,
                "billingType": billing_type.value,
                "transactionCount": transaction_count,
                "processingMs": processing_ms,
                "bankName": bank_name,
                "exportFormats": export_formats,
                "paymentId": payment_id,
            },
            timeout=5.0,
        )
