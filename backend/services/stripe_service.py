import stripe
from core.config import get_settings
from typing import Optional


async def create_payg_checkout_session(
    customer_id: Optional[str],
    user_id: str,
    file_name: str,
    page_count: int,
) -> str:
    settings = get_settings()
    stripe.api_key = settings.stripe_secret_key

    params: dict = {
        "mode": "payment",
        "line_items": [
            {
                "price": settings.stripe_price_payg,
                "quantity": 1,
            }
        ],
        "success_url": f"{settings.web_url}/dashboard?session_id={{CHECKOUT_SESSION_ID}}&status=success",
        "cancel_url": f"{settings.web_url}/dashboard?status=cancelled",
        "metadata": {
            "user_id": user_id,
            "file_name": file_name,
            "page_count": str(page_count),
            "type": "payg",
        },
    }

    if customer_id:
        params["customer"] = customer_id
    else:
        params["customer_creation"] = "always"

    session = stripe.checkout.Session.create(**params)
    return session.url
