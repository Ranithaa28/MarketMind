# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, BackgroundTasks
import asyncio
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

from app.api.deps import get_or_create_db_user
from app.db.models import Idea, IdeaStatus, User
from app.db.session import get_db
from app.schemas.idea import IdeaCreate, IdeaDetail, IdeaSummary
from app.core.config import get_settings
from app.core.progress import get_progress
from app.agents.graph import run_validation_pipeline
from app.db.session import SessionLocal

settings = get_settings()

router = APIRouter(prefix="/api/ideas", tags=["ideas"])

def background_validate_idea(idea_id: str):
    """Wrapper to run the validation pipeline and update the database."""
    db = SessionLocal()
    try:
        idea = db.query(Idea).filter(Idea.id == idea_id).first()
        if not idea:
            return

        idea.status = IdeaStatus.PROCESSING
        db.commit()

        # Run pipeline
        final_state = run_validation_pipeline(idea.raw_description, str(idea.id))

        if final_state.get("error"):
            idea.status = IdeaStatus.FAILED
            idea.error_message = final_state.get("error")
        else:
            idea.title = final_state.get("title", idea.title)
            idea.status = IdeaStatus.COMPLETED
            idea.core_concept = final_state.get("core_concept")
            idea.competitors = final_state.get("competitors")
            idea.market_research = final_state.get("market_research")
            idea.investment = final_state.get("investment")
            idea.locations = final_state.get("locations")
            idea.swot = final_state.get("swot")
            idea.lean_canvas = final_state.get("lean_canvas")
            idea.business_model_canvas = final_state.get("business_model_canvas")
            idea.strategy = final_state.get("strategy")
            idea.success_score = final_state.get("success_score")

        db.commit()
    except Exception as e:
        print(f"Validation failed for idea {idea_id}: {e}")
        idea.status = IdeaStatus.FAILED
        db.commit()
    finally:
        db.close()

@router.post("", response_model=IdeaDetail, status_code=201)
def create_idea(
    payload: IdeaCreate,
    background_tasks: BackgroundTasks,
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

    background_tasks.add_task(background_validate_idea, str(idea.id))
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
    last_val = None
    try:
        while True:
            val = get_progress(idea_id)
            if val and val != last_val:
                await websocket.send_text(val)
                last_val = val
            await asyncio.sleep(0.5)
    except WebSocketDisconnect:
        pass

@router.post("/{idea_id}/revalidate", response_model=IdeaDetail)
def revalidate_idea(
    idea_id: str, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db), 
    user: User = Depends(get_or_create_db_user)
):
    idea = db.query(Idea).filter(Idea.id == idea_id, Idea.user_id == user.id).first()
    if idea is None:
        raise HTTPException(status_code=404, detail="Idea not found")
    idea.status = IdeaStatus.PENDING
    db.commit()
    background_tasks.add_task(background_validate_idea, str(idea.id))
    return idea


@router.post("/{idea_id}/duplicate", response_model=IdeaDetail, status_code=201)
def duplicate_idea(
    idea_id: str, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db), 
    user: User = Depends(get_or_create_db_user)
):
    original = db.query(Idea).filter(Idea.id == idea_id, Idea.user_id == user.id).first()
    if original is None:
        raise HTTPException(status_code=404, detail="Idea not found")
    copy = Idea(user_id=user.id, title=f"{original.title} (copy)", raw_description=original.raw_description)
    db.add(copy)
    db.commit()
    db.refresh(copy)
    background_tasks.add_task(background_validate_idea, str(copy.id))
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
