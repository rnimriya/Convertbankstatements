from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # App
    app_name: str = "BankStatements API"
    debug: bool = False
    backend_api_key: str  # shared secret with Next.js

    # Database
    database_url: str

    # Supabase (JWT verification)
    supabase_url: str
    supabase_service_role_key: str

    # Stripe
    stripe_secret_key: str
    stripe_price_payg: str
    stripe_webhook_secret: str

    # LLM
    anthropic_api_key: str

    # Billing constants
    free_page_limit: int = 8
    payg_price_cents: int = 199        # $1.99
    pro_page_limit: int = 200          # pages per billing period
    business_page_limit: int = 500

    # File handling
    max_upload_size_mb: int = 50
    temp_file_ttl_seconds: int = 300   # delete temp files after 5 min


@lru_cache
def get_settings() -> Settings:
    return Settings()
