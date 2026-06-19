from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class BillingType(str, Enum):
    FREE_TIER = "FREE_TIER"
    SUBSCRIPTION = "SUBSCRIPTION"
    PAY_AS_YOU_GO = "PAY_AS_YOU_GO"


class SubTier(str, Enum):
    FREE = "FREE"
    PAYG = "PAYG"
    PRO = "PRO"
    BUSINESS = "BUSINESS"


# ─── Billing Context ─────────────────────────────────────────────────────────

class UserBillingContext(BaseModel):
    user_id: str
    tier: SubTier
    pages_used_this_period: int
    monthly_page_limit: int   # 0 = PAYG, 8 = FREE cap, 200/500 for subs
    stripe_customer_id: Optional[str] = None

    @property
    def free_pages_remaining(self) -> int:
        if self.tier != SubTier.FREE:
            return 0
        return max(0, 8 - self.pages_used_this_period)

    @property
    def subscription_pages_remaining(self) -> int:
        if self.tier not in (SubTier.PRO, SubTier.BUSINESS):
            return 0
        return max(0, self.monthly_page_limit - self.pages_used_this_period)


# ─── Transaction ─────────────────────────────────────────────────────────────

class Transaction(BaseModel):
    date: str                         # ISO 8601 string
    description: str
    amount: float                     # positive = credit, negative = debit
    balance: Optional[float] = None
    category: Optional[str] = None   # LLM-inferred category
    reference: Optional[str] = None


# ─── Process Statement ───────────────────────────────────────────────────────

class ProcessStatementRequest(BaseModel):
    user_id: str
    export_formats: list[str] = Field(default=["csv"])
    google_sheet_id: Optional[str] = None


class BillingDecision(BaseModel):
    billing_type: BillingType
    pages_charged: int
    payment_required: bool
    stripe_checkout_url: Optional[str] = None
    message: str


class ProcessStatementResponse(BaseModel):
    success: bool
    file_name: str
    page_count: int
    transaction_count: int
    bank_name: Optional[str]
    billing: BillingDecision
    transactions: list[Transaction]
    export_urls: dict[str, str]        # {"csv": "/exports/xxx.csv", ...}
    processing_ms: int


class PaymentRequiredError(BaseModel):
    error: str = "PAYMENT_REQUIRED"
    message: str
    page_count: int
    price_usd: float
    stripe_checkout_url: str
