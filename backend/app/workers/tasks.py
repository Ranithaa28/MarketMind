from app.agents.graph import run_validation_pipeline
from app.core.celery_app import celery_app
from app.db.models import Idea, IdeaStatus
from app.db.session import SessionLocal


@celery_app.task(name="validate_idea")
def validate_idea_task(idea_id: str) -> None:
    """
    Runs the full LangGraph pipeline for a saved Idea row and writes the
    structured results back to the database. Kept as a separate Celery task
    (rather than inline in the request handler) because a full run can take
    anywhere from ~20s to a few minutes depending on provider latency.
    """
    db = SessionLocal()
    try:
        idea = db.get(Idea, idea_id)
        if idea is None:
            return

        idea.status = IdeaStatus.RUNNING
        db.commit()

        try:
            result = run_validation_pipeline(idea.raw_description)
        except Exception as exc:  # noqa: BLE001
            idea.status = IdeaStatus.FAILED
            idea.error_message = str(exc)
            db.commit()
            return

        idea.title = result.get("title") or idea.title
        idea.analysis = result.get("core_concept")
        idea.competitors = result.get("competitors")
        idea.market_research = result.get("market_research")
        idea.investment = result.get("investment")
        idea.locations = result.get("locations")
        idea.swot = result.get("swot")
        idea.lean_canvas = result.get("lean_canvas")
        idea.business_model_canvas = result.get("business_model_canvas")
        idea.strategy = result.get("strategy")
        idea.success_score = result.get("success_score")
        idea.error_message = result.get("error")
        idea.status = IdeaStatus.FAILED if (result.get("error") and not result.get("core_concept")) else IdeaStatus.COMPLETE
        db.commit()
    finally:
        db.close()
