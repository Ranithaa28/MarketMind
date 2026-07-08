from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_or_create_db_user
from app.db.models import ChatMessage, ChatRole, Idea, User
from app.db.session import get_db
from app.schemas.idea import ChatMessageIn, ChatMessageOut
from app.services.openai_client import generate_text

router = APIRouter(prefix="/api/chat", tags=["chat"])

from pydantic import BaseModel

SYSTEM_PROMPT = (
    "You are an expert startup advisor embedded in a validation platform. You "
    "have access to the structured analysis already generated for this "
    "specific startup idea (market research, competitors, investment "
    "estimate, SWOT, and success score). Use it to give specific, actionable "
    "advice when asked about improving the idea, features, pricing, "
    "marketing, funding, technology choices, or general business strategy. "
    "Keep answers concise and concrete."
)

GENERAL_SYSTEM_PROMPT = (
    "You are MarketMind, an expert AI startup advisor and market research assistant. "
    "You help users refine their startup ideas, understand market trends, "
    "and navigate the MarketMind platform. Keep answers concise, actionable, and friendly."
)

class GeneralChatRequest(BaseModel):
    message: str
    history: list[dict[str, str]] = []

@router.post("/general")
def send_general_message(
    payload: GeneralChatRequest,
    user: User = Depends(get_or_create_db_user)
):
    context_lines = ["--- CONVERSATION HISTORY ---"]
    for msg in payload.history:
        context_lines.append(f"{msg.get('role', 'user').upper()}: {msg.get('content', '')}")
    context_lines.append(f"USER: {payload.message}")

    reply_text = generate_text(GENERAL_SYSTEM_PROMPT, "\n".join(context_lines))
    return {"role": "assistant", "content": reply_text}

@router.get("/{idea_id}", response_model=list[ChatMessageOut])
def get_history(idea_id: str, db: Session = Depends(get_db), user: User = Depends(get_or_create_db_user)):
    idea = db.query(Idea).filter(Idea.id == idea_id, Idea.user_id == user.id).first()
    if idea is None:
        raise HTTPException(status_code=404, detail="Idea not found")
    return (
        db.query(ChatMessage)
        .filter(ChatMessage.idea_id == idea_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )


@router.post("/{idea_id}", response_model=ChatMessageOut)
def send_message(
    idea_id: str,
    payload: ChatMessageIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_or_create_db_user),
):
    idea = db.query(Idea).filter(Idea.id == idea_id, Idea.user_id == user.id).first()
    if idea is None:
        raise HTTPException(status_code=404, detail="Idea not found")

    history = (
        db.query(ChatMessage)
        .filter(ChatMessage.idea_id == idea_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )

    user_msg = ChatMessage(idea_id=idea_id, role=ChatRole.USER, content=payload.message)
    db.add(user_msg)
    db.commit()

    # Build conversation context: idea analysis + prior turns + new message.
    context_lines = [
        f"IDEA CONTEXT: {idea.raw_description}",
        f"ANALYSIS: {idea.analysis}",
        f"MARKET RESEARCH: {idea.market_research}",
        f"COMPETITORS: {idea.competitors}",
        f"SUCCESS SCORE: {idea.success_score}",
        "--- CONVERSATION HISTORY ---",
    ]
    for m in history:
        context_lines.append(f"{m.role.value.upper()}: {m.content}")
    context_lines.append(f"USER: {payload.message}")

    reply_text = generate_text(SYSTEM_PROMPT, "\n".join(context_lines))

    assistant_msg = ChatMessage(idea_id=idea_id, role=ChatRole.ASSISTANT, content=reply_text)
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)
    return assistant_msg
