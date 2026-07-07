"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-01-01

"""
# pyrefly: ignore [missing-import]
import sqlalchemy as sa
from alembic import op

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None

plan_tier = sa.Enum("free", "pro", "enterprise", name="plantier")
idea_status = sa.Enum("pending", "running", "complete", "failed", "archived", name="ideastatus")
report_format = sa.Enum("pdf", "docx", name="reportformat")
chat_role = sa.Enum("user", "assistant", name="chatrole")


def upgrade() -> None:
    bind = op.get_bind()
    pass

    op.create_table(
        "users",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("clerk_user_id", sa.String(), nullable=False, unique=True),
        sa.Column("email", sa.String(), nullable=False, unique=True),
        sa.Column("full_name", sa.String(), nullable=True),
        sa.Column("plan", plan_tier, nullable=False, server_default="free"),
        sa.Column("stripe_customer_id", sa.String(), nullable=True),
        sa.Column("stripe_subscription_id", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_users_clerk_user_id", "users", ["clerk_user_id"])
    op.create_index("ix_users_email", "users", ["email"])

    op.create_table(
        "ideas",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("user_id", sa.String(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("raw_description", sa.Text(), nullable=False),
        sa.Column("status", idea_status, nullable=False, server_default="pending"),
        sa.Column("is_archived", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("analysis", sa.JSON(), nullable=True),
        sa.Column("competitors", sa.JSON(), nullable=True),
        sa.Column("market_research", sa.JSON(), nullable=True),
        sa.Column("investment", sa.JSON(), nullable=True),
        sa.Column("locations", sa.JSON(), nullable=True),
        sa.Column("swot", sa.JSON(), nullable=True),
        sa.Column("lean_canvas", sa.JSON(), nullable=True),
        sa.Column("business_model_canvas", sa.JSON(), nullable=True),
        sa.Column("strategy", sa.JSON(), nullable=True),
        sa.Column("success_score", sa.JSON(), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_ideas_user_id", "ideas", ["user_id"])

    op.create_table(
        "reports",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("idea_id", sa.String(), sa.ForeignKey("ideas.id"), nullable=False),
        sa.Column("format", report_format, nullable=False),
        sa.Column("file_path", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_reports_idea_id", "reports", ["idea_id"])

    op.create_table(
        "chat_messages",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("idea_id", sa.String(), sa.ForeignKey("ideas.id"), nullable=False),
        sa.Column("role", chat_role, nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_chat_messages_idea_id", "chat_messages", ["idea_id"])


def downgrade() -> None:
    op.drop_table("chat_messages")
    op.drop_table("reports")
    op.drop_table("ideas")
    op.drop_table("users")
    bind = op.get_bind()
    chat_role.drop(bind, checkfirst=True)
    report_format.drop(bind, checkfirst=True)
    idea_status.drop(bind, checkfirst=True)
    plan_tier.drop(bind, checkfirst=True)
