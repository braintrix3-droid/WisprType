import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api import api_router

# 1. Setup Sentry Error Monitoring in production
if settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        integrations=[FastApiIntegration()],
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
    )

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Production-ready FastAPI backend for WhisperType AI Voice Operating System."
)

# 2. Configure CORS Middleware
# Allows secure cross-origin communication from Tauri native applications (tauri://localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", # Dev Next.js local server
        "tauri://localhost",     # Production Tauri macOS webview
        "http://tauri.localhost",# Production Tauri Windows webview
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Mount all API Routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def health_check():
    """
    Service health check endpoint.
    """
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "api_version": "v1"
    }
