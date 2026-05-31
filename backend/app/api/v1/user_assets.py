from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.session import get_db
from app.models.models import User, Snippet, CustomDictionary, Memory, Integration
from app.core.security import get_current_user, encrypt_token

router = APIRouter()

# =========================================================================
# PYDANTIC SCHEMAS
# =========================================================================
class SnippetCreate(BaseModel):
    trigger_phrase: str
    expansion_text: str

class SnippetResponse(BaseModel):
    id: str
    trigger_phrase: str
    expansion_text: str
    class Config:
        from_attributes = True

class DictionaryCreate(BaseModel):
    phrase: str
    replacement_term: Optional[str] = None

class DictionaryResponse(BaseModel):
    id: str
    phrase: str
    replacement_term: Optional[str] = None
    class Config:
        from_attributes = True

class MemoryCreate(BaseModel):
    entity_key: str
    entity_value: str

class MemoryResponse(BaseModel):
    id: str
    entity_key: str
    entity_value: str
    class Config:
        from_attributes = True

class IntegrationCreate(BaseModel):
    provider: str
    access_token: str
    refresh_token: Optional[str] = None
    expires_in_seconds: Optional[int] = None

# =========================================================================
# SNIPPETS ENDPOINTS
# =========================================================================
@router.post("/snippets", response_model=SnippetResponse)
async def create_snippet(
    payload: SnippetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(Snippet).filter(
        Snippet.user_id == current_user.id,
        Snippet.trigger_phrase == payload.trigger_phrase.lower()
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Snippet trigger already exists")
        
    snippet = Snippet(
        user_id=current_user.id,
        trigger_phrase=payload.trigger_phrase.lower(),
        expansion_text=payload.expansion_text
    )
    db.add(snippet)
    db.commit()
    db.refresh(snippet)
    return snippet

@router.get("/snippets", response_model=List[SnippetResponse])
async def list_snippets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Snippet).filter(Snippet.user_id == current_user.id).all()

@router.delete("/snippets/{snippet_id}")
async def delete_snippet(
    snippet_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    snippet = db.query(Snippet).filter(Snippet.id == snippet_id, Snippet.user_id == current_user.id).first()
    if not snippet:
        raise HTTPException(status_code=404, detail="Snippet not found")
    db.delete(snippet)
    db.commit()
    return {"status": "success"}

# =========================================================================
# CUSTOM DICTIONARY ENDPOINTS
# =========================================================================
@router.post("/dictionary", response_model=DictionaryResponse)
async def create_dictionary_term(
    payload: DictionaryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(CustomDictionary).filter(
        CustomDictionary.user_id == current_user.id,
        CustomDictionary.phrase == payload.phrase.lower()
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Dictionary term already exists")
        
    term = CustomDictionary(
        user_id=current_user.id,
        phrase=payload.phrase.lower(),
        replacement_term=payload.replacement_term
    )
    db.add(term)
    db.commit()
    db.refresh(term)
    return term

@router.get("/dictionary", response_model=List[DictionaryResponse])
async def list_dictionary_terms(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(CustomDictionary).filter(CustomDictionary.user_id == current_user.id).all()

@router.delete("/dictionary/{term_id}")
async def delete_dictionary_term(
    term_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    term = db.query(CustomDictionary).filter(CustomDictionary.id == term_id, CustomDictionary.user_id == current_user.id).first()
    if not term:
        raise HTTPException(status_code=404, detail="Dictionary term not found")
    db.delete(term)
    db.commit()
    return {"status": "success"}

# =========================================================================
# PERSONAL MEMORIES ENDPOINTS
# =========================================================================
@router.post("/memories", response_model=MemoryResponse)
async def create_memory(
    payload: MemoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(Memory).filter(
        Memory.user_id == current_user.id,
        Memory.entity_key == payload.entity_key.lower()
    ).first()
    if existing:
        existing.entity_value = payload.entity_value
        db.commit()
        db.refresh(existing)
        return existing
        
    memory = Memory(
        user_id=current_user.id,
        entity_key=payload.entity_key.lower(),
        entity_value=payload.entity_value
    )
    db.add(memory)
    db.commit()
    db.refresh(memory)
    return memory

@router.get("/memories", response_model=List[MemoryResponse])
async def list_memories(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Memory).filter(Memory.user_id == current_user.id).all()

@router.delete("/memories/{memory_id}")
async def delete_memory(
    memory_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    memory = db.query(Memory).filter(Memory.id == memory_id, Memory.user_id == current_user.id).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory context not found")
    db.delete(memory)
    db.commit()
    return {"status": "success"}

# =========================================================================
# INTEGRATIONS SECURITY ENDPOINTS
# =========================================================================
@router.post("/integrations")
async def connect_integration(
    payload: IntegrationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Enforce safe AES encryption before storing secret token inside PostgreSQL
    enc_access = encrypt_token(payload.access_token)
    enc_refresh = encrypt_token(payload.refresh_token) if payload.refresh_token else None
    
    expires_at = None
    if payload.expires_in_seconds:
        expires_at = datetime.utcnow() + timedelta(seconds=payload.expires_in_seconds)
        
    integration = db.query(Integration).filter(
        Integration.user_id == current_user.id,
        Integration.provider == payload.provider.lower()
    ).first()
    
    if integration:
        integration.access_token_encrypted = enc_access
        integration.refresh_token_encrypted = enc_refresh
        integration.expires_at = expires_at
        integration.is_active = True
    else:
        integration = Integration(
            user_id=current_user.id,
            provider=payload.provider.lower(),
            access_token_encrypted=enc_access,
            refresh_token_encrypted=enc_refresh,
            expires_at=expires_at
        )
        db.add(integration)
        
    db.commit()
    return {"status": "success", "provider": payload.provider.lower(), "connected": True}

@router.get("/integrations")
async def list_integrations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    integrations = db.query(Integration).filter(Integration.user_id == current_user.id).all()
    # Mask actual tokens for security
    return [
        {
            "id": str(i.id),
            "provider": i.provider,
            "is_active": i.is_active,
            "connected_at": i.created_at,
            "token_masked": "••••••••••••••••"
        }
        for i in integrations
    ]
