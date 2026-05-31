import jwt
import logging
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, WebSocket, WebSocketDisconnect, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.config import settings
from app.db.session import get_db
from app.models.models import User, Subscription, SubscriptionTier, SubscriptionStatus, UsageLog
from app.core.security import get_current_user
from app.services.transcription import transcribe_audio
from app.services.ai_pipeline import run_ai_pipeline

logger = logging.getLogger(__name__)

router = APIRouter()

def has_active_billing_minutes(user: User, db: Session) -> bool:
    """
    Checks if a user has active metered transcription minutes remaining in their tier.
    """
    sub = db.query(Subscription).filter(Subscription.user_id == user.id).first()
    tier = SubscriptionTier.FREE
    if sub:
        # Check active status
        if sub.status in [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING]:
            tier = sub.tier
            
    # Limits mapping (seconds)
    limits_map = {
        SubscriptionTier.FREE: 30 * 60,         # 30 mins
        SubscriptionTier.PRO: 1200 * 60,        # 1,200 mins
        SubscriptionTier.TEAM: 5000 * 60,       # 5,000 mins
        SubscriptionTier.ENTERPRISE: 99999999   # Unlimited
    }
    
    max_allowed = limits_map.get(tier, 30 * 60)
    
    # Query transcription usage in current 30-day window
    start_window = datetime.utcnow() - timedelta(days=30)
    used_seconds = db.query(func.sum(UsageLog.transcription_seconds)).filter(
        UsageLog.user_id == user.id,
        UsageLog.created_at >= start_window
    ).scalar() or 0
    
    return used_seconds < max_allowed

@router.post("/transcribe")
async def REST_transcribe_audio(
    file: UploadFile = File(...),
    provider: str = Form("deepgram"),
    language: str = Form("en"),
    active_app: str = Form("Notepad"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    REST endpoint to process single uploaded audio files.
    Validates limits, transcribes, passes through AI clean/automation, and logs usage.
    """
    # 1. Enforce Billing Guards
    if not has_active_billing_minutes(current_user, db):
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Transcription monthly limits reached. Please upgrade inside your dashboard."
        )
        
    audio_content = await file.read()
    if not audio_content:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty audio payload")
        
    start_time = datetime.utcnow()
    
    # 2. Transcribe Audio
    raw_transcript = await transcribe_audio(audio_content, provider, language)
    
    # 3. Process through AI Pipeline
    pipeline_res = await run_ai_pipeline(raw_transcript, current_user, active_app, db)
    
    # 4. Log Transcription Usage
    duration = 5 # Default approximate fallback duration if metadata missing
    usage = UsageLog(
        user_id=current_user.id,
        transcription_seconds=duration,
        provider=provider,
        device_platform="desktop",
        intent=pipeline_res.get("action_summary", "clean_text")
    )
    db.add(usage)
    db.commit()
    
    return {
        "raw_transcript": raw_transcript,
        "processed_text": pipeline_res["processed_text"],
        "action_executed": pipeline_res["action_executed"],
        "action_summary": pipeline_res["action_summary"]
    }

@router.websocket("/stream")
async def websocket_transcribe_stream(websocket: WebSocket, db: Session = Depends(get_db)):
    """
    Real-time WebSocket streaming endpoint.
    Accepts raw binary audio chunks and pipes them through the AI pipeline upon release signals.
    """
    await websocket.accept()
    
    # 1. Authenticate over WebSocket query parameters
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Missing token")
        return
        
    try:
        payload = jwt.decode(token, settings.SUPABASE_JWT_SECRET, algorithms=["HS256"], options={"verify_aud": False})
        supabase_uid = payload.get("sub")
        email = payload.get("email")
        if not supabase_uid:
            raise ValueError()
    except Exception:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Authentication failed")
        return
        
    user = db.query(User).filter(User.supabase_uid == supabase_uid).first()
    if not user:
        # Provision user record dynamically
        user = User(supabase_uid=supabase_uid, email=email)
        db.add(user)
        db.commit()
        db.refresh(user)
        
    # Verify Billing Limits
    if not has_active_billing_minutes(user, db):
        await websocket.send_json({"error": "Billing limits reached. Upgrade subscription."})
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
        
    audio_buffer = bytearray()
    active_app = "Notepad"
    provider = "deepgram"
    language = "en"
    
    try:
        while True:
            # Receive text instruction settings or binary audio data chunks
            message = await websocket.receive()
            
            if "text" in message:
                text_data = message["text"]
                try:
                    data = json.loads(text_data)
                    # Settings sent by client (active app, language, provider)
                    if "active_app" in data:
                        active_app = data["active_app"]
                    if "provider" in data:
                        provider = data["provider"]
                    if "language" in data:
                        language = data["language"]
                        
                    # Stop signal sent: Process full accumulated buffer
                    if data.get("command") == "stop":
                        if len(audio_buffer) == 0:
                            await websocket.send_json({"processed_text": "", "action_executed": False})
                            continue
                            
                        # Transcribe accumulated bytes
                        raw_transcript = await transcribe_audio(bytes(audio_buffer), provider, language)
                        
                        # Process through AI OS pipeline
                        pipeline_res = await run_ai_pipeline(raw_transcript, user, active_app, db)
                        
                        # Record Usage
                        usage = UsageLog(
                            user_id=user.id,
                            transcription_seconds=max(3, len(audio_buffer) // 32000), # 16khz mono is 32kb/s
                            provider=provider,
                            device_platform="desktop",
                            intent=pipeline_res.get("action_summary", "clean_text")
                        )
                        db.add(usage)
                        db.commit()
                        
                        # Send finalized text block to Tauri Desktop for virtual injection
                        await websocket.send_json({
                            "raw_transcript": raw_transcript,
                            "processed_text": pipeline_res["processed_text"],
                            "action_executed": pipeline_res["action_executed"],
                            "action_summary": pipeline_res["action_summary"]
                        })
                        
                        # Clear buffer for next talk press
                        audio_buffer.clear()
                        
                except json.JSONDecodeError:
                    pass
                    
            elif "bytes" in message:
                # Accumulate raw binary PCM audio bytes
                audio_buffer.extend(message["bytes"])
                
    except WebSocketDisconnect:
        logger.info("Tauri client disconnected from transcription stream")
    except Exception as e:
        logger.error(f"WebSocket execution error: {str(e)}")
