from celery import Celery

from app.core.config import get_settings

settings = get_settings()

celery_app = Celery(
    "marketmind",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.workers.tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    task_track_started=True,
    task_time_limit=60 * 10,  # a full validation run can take a few minutes
)
