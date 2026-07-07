from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


class IdeaCreate(BaseModel):
    description: str = Field(..., min_length=10, max_length=2000, description="Free-text startup idea")


class IdeaSummary(BaseModel):
    id: str
    title: str
    status: str
    created_at: datetime
    success_score: Optional[dict[str, Any]] = None

    class Config:
        from_attributes = True


class IdeaDetail(BaseModel):
    id: str
    title: str
    raw_description: str
    status: str
    analysis: Optional[dict[str, Any]] = None
    competitors: Optional[dict[str, Any]] = None
    market_research: Optional[dict[str, Any]] = None
    investment: Optional[dict[str, Any]] = None
    locations: Optional[dict[str, Any]] = None
    swot: Optional[dict[str, Any]] = None
    lean_canvas: Optional[dict[str, Any]] = None
    business_model_canvas: Optional[dict[str, Any]] = None
    strategy: Optional[dict[str, Any]] = None
    success_score: Optional[dict[str, Any]] = None
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ChatMessageIn(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)


class ChatMessageOut(BaseModel):
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
