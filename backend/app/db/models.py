import enum
import uuid
from datetime import datetime

# pyrefly: ignore [missing-import]
from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
)
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


def gen_uuid() -> str:
    return str(uuid.uuid4())


class PlanTier(str, enum.Enum):
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class IdeaStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETE = "complete"
    FAILED = "failed"
    ARCHIVED = "archived"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=gen_uuid)
    clerk_user_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    full_name: Mapped[str | None] = mapped_column(String, nullable=True)
    plan: Mapped[PlanTier] = mapped_column(Enum(PlanTier, values_callable=lambda x: [e.value for e in x]), default=PlanTier.FREE)
    stripe_customer_id: Mapped[str | None] = mapped_column(String, nullable=True)
    stripe_subscription_id: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    ideas: Mapped[list["Idea"]] = relationship(back_populates="owner", cascade="all, delete-orphan")


class Idea(Base):
    __tablename__ = "ideas"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String)
    raw_description: Mapped[str] = mapped_column(Text)
    status: Mapped[IdeaStatus] = mapped_column(Enum(IdeaStatus, values_callable=lambda x: [e.value for e in x]), default=IdeaStatus.PENDING)
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False)

    # Structured results produced by the LangGraph pipeline. Stored as JSON
    # so the schema can evolve without constant migrations.
    analysis: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    competitors: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    market_research: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    investment: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    locations: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    swot: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    lean_canvas: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    business_model_canvas: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    strategy: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    success_score: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner: Mapped["User"] = relationship(back_populates="ideas")
    reports: Mapped[list["Report"]] = relationship(back_populates="idea", cascade="all, delete-orphan")
    chat_messages: Mapped[list["ChatMessage"]] = relationship(back_populates="idea", cascade="all, delete-orphan")


class ReportFormat(str, enum.Enum):
    PDF = "pdf"
    DOCX = "docx"


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=gen_uuid)
    idea_id: Mapped[str] = mapped_column(ForeignKey("ideas.id"), index=True)
    format: Mapped[ReportFormat] = mapped_column(Enum(ReportFormat, values_callable=lambda x: [e.value for e in x]))
    file_path: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    idea: Mapped["Idea"] = relationship(back_populates="reports")


class ChatRole(str, enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=gen_uuid)
    idea_id: Mapped[str] = mapped_column(ForeignKey("ideas.id"), index=True)
    role: Mapped[ChatRole] = mapped_column(Enum(ChatRole, values_callable=lambda x: [e.value for e in x]))
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    idea: Mapped["Idea"] = relationship(back_populates="chat_messages")
