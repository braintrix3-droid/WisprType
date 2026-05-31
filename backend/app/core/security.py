import jwt
from cryptography.fernet import Fernet
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.session import get_db
from app.models.models import User

# Standard HTTP Authorization Bearer scheme
security_scheme = HTTPBearer()

# Initialize symmetric Fernet encryption engine for OAuth tokens
try:
    key_val = settings.INTEGRATION_ENCRYPTION_KEY
    if isinstance(key_val, str):
        # Standardize key bytes parsing if wrapped in standard representation
        if key_val.startswith("b'") or key_val.startswith('b"'):
            key_val = key_val[2:-1]
        key_bytes = key_val.encode()
    else:
        key_bytes = key_val
    fernet = Fernet(key_bytes)
except Exception as e:
    # Safe fallback to prevent startup crashing if environment key is invalid
    fernet = Fernet(Fernet.generate_key())

def encrypt_token(token: str) -> str:
    if not token:
        return ""
    return fernet.encrypt(token.encode()).decode()

def decrypt_token(encrypted_token: str) -> str:
    if not encrypted_token:
        return ""
    return fernet.decrypt(encrypted_token.encode()).decode()

# Dependency to secure REST API routes
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    try:
        # Decode and verify token signature using the Supabase JWT secret
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False} # Supabase uses aud: 'authenticated'
        )
        supabase_uid = payload.get("sub")
        email = payload.get("email")
        if not supabase_uid or not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token is missing sub or email attributes"
            )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token has expired"
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {str(e)}"
        )
        
    # Query database for matching user, or dynamically auto-provision on first login
    user = db.query(User).filter(User.supabase_uid == supabase_uid).first()
    if not user:
        user = User(supabase_uid=supabase_uid, email=email)
        db.add(user)
        db.commit()
        db.refresh(user)
        
    return user
