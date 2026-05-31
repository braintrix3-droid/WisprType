# Import all models so that Base.metadata can discover them automatically
# for Alembic migrations or declarative creation scripts
from app.db.session import Base
from app.models.models import (
    User,
    Subscription,
    UsageLog,
    CustomDictionary,
    Memory,
    Snippet,
    Meeting,
    Integration
)
