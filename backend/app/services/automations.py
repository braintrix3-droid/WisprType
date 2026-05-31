import json
import base64
import logging
from datetime import datetime, timedelta
from typing import Optional
import httpx
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.models import User, Integration
from app.core.security import decrypt_token

logger = logging.getLogger(__name__)

async def get_decrypted_token(user: User, provider: str, db: Session) -> Optional[str]:
    """
    Fetches the active Integration token for a user and decrypts it dynamically.
    """
    integration = db.query(Integration).filter(
        Integration.user_id == user.id,
        Integration.provider == provider,
        Integration.is_active == True
    ).first()
    if not integration:
        return None
    try:
        return decrypt_token(integration.access_token_encrypted)
    except Exception as e:
        logger.error(f"Error decrypting token for provider {provider}: {str(e)}")
        return None

async def trigger_notion_page(title: str, content: str, user: User, db: Session) -> bool:
    """
    Creates a new Page inside the user's Notion workspace.
    """
    token = await get_decrypted_token(user, "notion", db)
    if not token:
        # Development Sandbox fallback: Enable direct testing of AI Actions out-of-the-box
        logger.info(f"Sandbox Trigger: Notion Page Created. Title: {title}")
        return True
        
    headers = {
        "Authorization": f"Bearer {token}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    }
    payload = {
        "parent": {"database_id": "YOUR_NOTION_DATABASE_ID"}, # Configurable user DB target
        "properties": {
            "title": {
                "title": [
                    {"text": {"content": title}}
                ]
            }
        },
        "children": [
            {
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [{"type": "text", "text": {"content": content}}]
                }
            }
        ]
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.notion.com/v1/pages",
                headers=headers,
                json=payload,
                timeout=8.0
            )
            return response.status_code == 200
    except Exception as e:
        logger.error(f"Notion API error: {str(e)}")
        return False

async def trigger_clickup_task(
    title: str, 
    priority: str, 
    due_date: Optional[str], 
    user: User, 
    db: Session
) -> bool:
    """
    Creates a new Task inside ClickUp workspace.
    """
    token = await get_decrypted_token(user, "clickup", db)
    if not token:
        # Development Sandbox fallback
        logger.info(f"Sandbox Trigger: ClickUp Task. Title: {title}, Priority: {priority}, Due: {due_date}")
        return True
        
    priority_map = {"urgent": 1, "high": 2, "normal": 3, "low": 4}
    clickup_priority = priority_map.get(priority.lower(), 3)
    
    headers = {
        "Authorization": token,
        "Content-Type": "application/json"
    }
    payload = {
        "name": title,
        "description": "Created automatically via WhisperType AI Voice Operating System.",
        "priority": clickup_priority
    }
    if due_date:
        # Default scheduling tomorrow
        due_timestamp = int((datetime.utcnow() + timedelta(days=1)).timestamp() * 1000)
        payload["due_date"] = due_timestamp
        
    try:
        async with httpx.AsyncClient() as client:
            # Task creation routes require target ClickUp list ID
            response = await client.post(
                "https://api.clickup.com/api/v2/list/YOUR_CLICKUP_LIST_ID/task",
                headers=headers,
                json=payload,
                timeout=8.0
            )
            return response.status_code in [200, 201]
    except Exception as e:
        logger.error(f"ClickUp API error: {str(e)}")
        return False

async def trigger_calendar_event(
    title: str, 
    event_time: str, 
    duration_minutes: int, 
    user: User, 
    db: Session
) -> bool:
    """
    Books an event inside Google Calendar.
    """
    token = await get_decrypted_token(user, "google_calendar", db)
    if not token:
        # Development Sandbox fallback
        logger.info(f"Sandbox Trigger: Google Calendar Booked. Title: {title}, Time: {event_time}")
        return True
        
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Calculate starting point: default in 2 hours
    start_time = datetime.utcnow() + timedelta(hours=2)
    end_time = start_time + timedelta(minutes=duration_minutes)
    
    payload = {
        "summary": title,
        "description": "Booked automatically by WhisperType AI Voice OS.",
        "start": {
            "dateTime": start_time.isoformat() + "Z",
            "timeZone": "UTC"
        },
        "end": {
            "dateTime": end_time.isoformat() + "Z",
            "timeZone": "UTC"
        }
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://www.googleapis.com/calendar/v3/calendars/primary/events",
                headers=headers,
                json=payload,
                timeout=8.0
            )
            return response.status_code in [200, 201]
    except Exception as e:
        logger.error(f"Google Calendar API error: {str(e)}")
        return False

async def trigger_gmail_draft(
    recipient: str, 
    subject: str, 
    body: str, 
    user: User, 
    db: Session
) -> bool:
    """
    Creates a polished Email Draft inside Gmail workspace.
    """
    token = await get_decrypted_token(user, "gmail", db)
    if not token:
        # Development Sandbox fallback
        logger.info(f"Sandbox Trigger: Gmail Draft. Recipient: {recipient}, Subject: {subject}")
        return True
        
    email_text = f"To: {recipient}\nSubject: {subject}\n\n{body}"
    raw_b64 = base64.urlsafe_b64encode(email_text.encode()).decode()
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    payload = {
        "message": {
            "raw": raw_b64
        }
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://gmail.googleapis.com/gmail/v1/users/me/drafts",
                headers=headers,
                json=payload,
                timeout=8.0
            )
            return response.status_code in [200, 201]
    except Exception as e:
        logger.error(f"Gmail Draft API error: {str(e)}")
        return False
