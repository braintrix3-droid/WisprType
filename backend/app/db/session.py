from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Create PostgreSQL database engine with connection pooling parameters optimized for high-concurrency writing
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True, # Automatically checks and recycles stale connections
    pool_size=20,       # Base connection pool size
    max_overflow=10     # Max burst overflow connections
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# FastAPI database session dependency provider
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
