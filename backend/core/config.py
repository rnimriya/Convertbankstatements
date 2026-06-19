from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # App
    app_name: str = "BankStatements API"
    debug: bool = False
    backend_api_key: str = ""  # shared secret with Next.js (required in production)

    # LLM
    anthropic_api_key: str = ""

    # File handling
    max_upload_size_mb: int = 50
    temp_file_ttl_seconds: int = 300   # delete temp files after 5 min


@lru_cache
def get_settings() -> Settings:
    return Settings()
