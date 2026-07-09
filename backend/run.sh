#!/bin/bash
# Start Celery worker in the background
celery -A app.core.celery_app:celery_app worker --loglevel=info &

# Start FastAPI server on port 7860 (Hugging Face Default)
uvicorn app.main:app --host 0.0.0.0 --port 7860
