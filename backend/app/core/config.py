import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Core Server Config
    PROJECT_NAME: str = "WhisperType Voice OS Backend"
    API_V1_STR: str = "/api/v1"
    
    # Database Settings
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/whispertype"
    
    # Redis & Celery
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Supabase (Authentication)
    SUPABASE_URL: str = "https://your-project.supabase.co"
    SUPABASE_ANON_KEY: str = "your-supabase-anon-key"
    SUPABASE_JWT_SECRET: str = "your-supabase-jwt-secret"
    
    # Payments (Stripe)
    STRIPE_API_KEY: str = "sk_test_mock"
    STRIPE_WEBHOOK_SECRET: str = "whsec_mock"
    STRIPE_PRO_PRICE_ID: str = "price_mock"
    
    # AI Engine Keys
    OPENAI_API_KEY: str = "sk-mock"
    DEEPGRAM_API_KEY: str = "dg-mock"
    ASSEMBLYAI_API_KEY: str = "assembly-mock"
    
    # Encryption key for integration tokens (32-byte url-safe base64 Fernet key)
    INTEGRATION_ENCRYPTION_KEY: str = "b'vYt1bL_NqX6Ueb9319k6jYn86J8t267n6L067z3R2k0='"
    
    # OAuth Configurations
    NOTION_CLIENT_ID: Optional[str] = None
    NOTION_CLIENT_SECRET: Optional[str] = None
    CLICKUP_CLIENT_ID: Optional[str] = None
    CLICKUP_CLIENT_SECRET: Optional[str] = None
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    
    # Analytics & Monitoring
    POSTHOG_API_KEY: Optional[str] = None
    SENTRY_DSN: Optional[str] = None
    
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
