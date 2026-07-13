# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
import asyncio
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
import redis.asyncio as aioredis

from app.api.deps import get_or_create_db_user
from app.db.models import Idea, IdeaStatus, User
from app.db.session import get_db
from app.schemas.idea import IdeaCreate, IdeaDetail, IdeaSummary
from app.workers.tasks import validate_idea_task
from app.core.config import get_settings

settings = get_settings()
redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)

router = APIRouter(prefix="/api/ideas", tags=["ideas"])


@router.post("", response_model=IdeaDetail, status_code=201)
def create_idea(
    payload: IdeaCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_or_create_db_user),
):
    idea = Idea(
        user_id=user.id,
        title=payload.description[:60],
        raw_description=payload.description,
        status=IdeaStatus.PENDING,
    )
    db.add(idea)
    db.commit()
    db.refresh(idea)

    # Kick off the LangGraph pipeline asynchronously via Celery so the
    # request returns immediately; the frontend polls GET /api/ideas/{id}.
    validate_idea_task.delay(idea.id)
    return idea


@router.get("", response_model=list[IdeaSummary])
def list_ideas(
    include_archived: bool = False,
    db: Session = Depends(get_db),
    user: User = Depends(get_or_create_db_user),
):
    query = db.query(Idea).filter(Idea.user_id == user.id)
    if not include_archived:
        query = query.filter(Idea.is_archived.is_(False))
    return query.order_by(Idea.created_at.desc()).all()


@router.get("/{idea_id}", response_model=IdeaDetail)
def get_idea(idea_id: str, db: Session = Depends(get_db), user: User = Depends(get_or_create_db_user)):
    idea = db.query(Idea).filter(Idea.id == idea_id, Idea.user_id == user.id).first()
    if idea is None:
        raise HTTPException(status_code=404, detail="Idea not found")
    return idea


@router.websocket("/{idea_id}/progress/ws")
async def progress_websocket(websocket: WebSocket, idea_id: str):
    await websocket.accept()
    key = f"idea_progress:{idea_id}"
    last_val = None
    try:
        while True:
            val = await redis_client.get(key)
            if val and val != last_val:
                await websocket.send_text(val)
                last_val = val
            await asyncio.sleep(0.5)
    except WebSocketDisconnect:
        pass

@router.post("/{idea_id}/revalidate", response_model=IdeaDetail)
def revalidate_idea(idea_id: str, db: Session = Depends(get_db), user: User = Depends(get_or_create_db_user)):
    idea = db.query(Idea).filter(Idea.id == idea_id, Idea.user_id == user.id).first()
    if idea is None:
        raise HTTPException(status_code=404, detail="Idea not found")
    idea.status = IdeaStatus.PENDING
    db.commit()
    validate_idea_task.delay(idea.id)
    return idea


@router.post("/{idea_id}/duplicate", response_model=IdeaDetail, status_code=201)
def duplicate_idea(idea_id: str, db: Session = Depends(get_db), user: User = Depends(get_or_create_db_user)):
    original = db.query(Idea).filter(Idea.id == idea_id, Idea.user_id == user.id).first()
    if original is None:
        raise HTTPException(status_code=404, detail="Idea not found")
    copy = Idea(user_id=user.id, title=f"{original.title} (copy)", raw_description=original.raw_description)
    db.add(copy)
    db.commit()
    db.refresh(copy)
    validate_idea_task.delay(copy.id)
    return copy


@router.patch("/{idea_id}/archive", response_model=IdeaDetail)
def archive_idea(idea_id: str, archived: bool = True, db: Session = Depends(get_db), user: User = Depends(get_or_create_db_user)):
    idea = db.query(Idea).filter(Idea.id == idea_id, Idea.user_id == user.id).first()
    if idea is None:
        raise HTTPException(status_code=404, detail="Idea not found")
    idea.is_archived = archived
    db.commit()
    return idea


@router.delete("/{idea_id}", status_code=204)
def delete_idea(idea_id: str, db: Session = Depends(get_db), user: User = Depends(get_or_create_db_user)):
    idea = db.query(Idea).filter(Idea.id == idea_id, Idea.user_id == user.id).first()
    if idea is None:
        raise HTTPException(status_code=404, detail="Idea not found")
    db.delete(idea)
    db.commit()
    return None
