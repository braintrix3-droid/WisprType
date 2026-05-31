from fastapi import APIRouter
from app.api.v1 import transcription, billing, user_assets

api_router = APIRouter()

# Grouping all v1 sub-routers neatly
api_router.include_router(transcription.router, tags=["transcription"])
api_router.include_router(billing.router, prefix="/billing", tags=["billing"])
api_router.include_router(user_assets.router, tags=["customization"])
