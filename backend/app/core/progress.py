"""
Global in-memory store for idea validation progress.
Replaces Redis to fit the backend within a 512MB RAM free tier constraint.
"""
from typing import Dict
from datetime import datetime

# In-memory store: { idea_id: {"message": str, "updated_at": datetime} }
PROGRESS_STORE: Dict[str, dict] = {}

def set_progress(idea_id: str, message: str):
    """Update the progress message for a specific idea."""
    PROGRESS_STORE[idea_id] = {
        "message": message,
        "updated_at": datetime.utcnow()
    }

def get_progress(idea_id: str) -> str | None:
    """Retrieve the latest progress message for a specific idea."""
    data = PROGRESS_STORE.get(idea_id)
    if data:
        return data["message"]
    return None

def cleanup_stale_progress(max_age_hours: int = 1):
    """Optionally clean up old progress entries to prevent memory leaks."""
    now = datetime.utcnow()
    stale_keys = [
        k for k, v in PROGRESS_STORE.items()
        if (now - v["updated_at"]).total_seconds() > max_age_hours * 3600
    ]
    for k in stale_keys:
        del PROGRESS_STORE[k]
