"""
Stripe webhook handler.
Verifies the Stripe-Signature header before processing any event.
"""
import logging
from typing import Annotated

import stripe
from fastapi import APIRouter, Header, HTTPException, Request, status

from core.config import get_settings
from services.billing_service import record_usage

router = APIRouter(prefix="/webhooks", tags=["webhooks"])
logger = logging.getLogger(__name__)


@router.post("/stripe")
async def stripe_webhook(
    request: Request,
    stripe_signature: Annotated[str, Header(alias="stripe-signature")],
):
    settings = get_settings()
    stripe.api_key = settings.stripe_secret_key

    payload = await request.body()

    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, settings.stripe_webhook_secret
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid Stripe signature.")

    event_type = event["type"]
    data = event["data"]["object"]
    logger.info("Stripe webhook received: %s", event_type)

    if event_type == "checkout.session.completed":
        await _handle_checkout_completed(data)

    elif event_type == "invoice.paid":
        await _handle_invoice_paid(data)

    elif event_type == "customer.subscription.deleted":
        await _handle_subscription_deleted(data)

    elif event_type == "customer.subscription.updated":
        await _handle_subscription_updated(data)

    return {"received": True}


async def _handle_checkout_completed(session: dict):
    """
    PAYG payment succeeded. Notify Next.js to mark the payment as succeeded
    so the frontend can retry the upload with a payment_id.
    """
    import httpx
    from core.config import get_settings

    settings = get_settings()
    metadata = session.get("metadata", {})

    async with httpx.AsyncClient() as client:
        await client.post(
            f"{settings.nextjs_internal_url}/api/internal/payment-succeeded",
            headers={"x-api-key": settings.backend_api_key},
            json={
                "stripeSessionId": session["id"],
                "userId": metadata.get("user_id"),
                "fileName": metadata.get("file_name"),
                "pageCount": int(metadata.get("page_count", 0)),
                "amountCents": session.get("amount_total", 0),
            },
        )


async def _handle_invoice_paid(invoice: dict):
    """Subscription period renewed — reset pagesUsedThisPeriod."""
    import httpx
    from core.config import get_settings

    settings = get_settings()
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{settings.nextjs_internal_url}/api/internal/subscription-renewed",
            headers={"x-api-key": settings.backend_api_key},
            json={
                "stripeSubscriptionId": invoice.get("subscription"),
                "periodStart": invoice.get("period_start"),
                "periodEnd": invoice.get("period_end"),
            },
        )


async def _handle_subscription_deleted(subscription: dict):
    import httpx
    from core.config import get_settings

    settings = get_settings()
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{settings.nextjs_internal_url}/api/internal/subscription-canceled",
            headers={"x-api-key": settings.backend_api_key},
            json={"stripeSubscriptionId": subscription["id"]},
        )


async def _handle_subscription_updated(subscription: dict):
    import httpx
    from core.config import get_settings

    settings = get_settings()
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{settings.nextjs_internal_url}/api/internal/subscription-updated",
            headers={"x-api-key": settings.backend_api_key},
            json={
                "stripeSubscriptionId": subscription["id"],
                "status": subscription["status"],
                "priceId": subscription["items"]["data"][0]["price"]["id"],
            },
        )
