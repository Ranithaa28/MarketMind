"""
Centralized application configuration.
All values are loaded from environment variables (see .env.example).
"""
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "dev-secret"
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/marketmind"

    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    CLERK_JWKS_URL: str = ""
    CLERK_ISSUER: str = ""
    CLERK_SECRET_KEY: str = ""

    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "llama-3.3-70b-versatile"
    # Defaults to Groq's free, OpenAI-compatible endpoint. Set this to
    # "https://api.openai.com/v1" (and use a real OpenAI key + model) if you
    # want to use OpenAI directly instead.
    OPENAI_BASE_URL: str = "https://api.groq.com/openai/v1"

    TAVILY_API_KEY: str = ""
    GOOGLE_CSE_API_KEY: str = ""
    GOOGLE_CSE_ENGINE_ID: str = ""
    NEWSAPI_KEY: str = ""

    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_PRICE_PRO: str = ""
    STRIPE_PRICE_ENTERPRISE: str = ""

    RESEND_API_KEY: str = ""
    CLOUDINARY_URL: str = ""
    SENTRY_DSN: str = ""

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
