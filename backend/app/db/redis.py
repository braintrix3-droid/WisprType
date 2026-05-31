import redis
from app.core.config import settings

# Create a thread-safe connection pool client for Redis
redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

def check_rate_limit(user_id: str, limit: int = 60, window: int = 60) -> bool:
    """
    Token-bucket rate limiter using Redis.
    limit: Maximum allowed API calls in the given window.
    window: Window size in seconds.
    """
    key = f"rate_limit:{user_id}"
    try:
        current = redis_client.get(key)
        if current is None:
            # Initialize bucket
            redis_client.set(key, 1, ex=window)
            return True
        
        current_count = int(current)
        if current_count >= limit:
            return False
            
        redis_client.incr(key)
        return True
    except Exception:
        # Fail-open strategy: Ensure system availability even if Redis goes offline
        return True
