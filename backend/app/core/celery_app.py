from celery import Celery
from app.core.config import settings

# Initialize Celery using Redis as both message broker and result backend
celery_app = Celery(
    "whispertype_workers",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

# Standard serialization and timing configurations
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)
