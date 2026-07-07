from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_or_create_db_user
from app.db.models import Idea, IdeaStatus, Report, ReportFormat, User
from app.db.session import get_db
from app.services.report_generator import generate_docx_report, generate_pdf_report

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.post("/{idea_id}/{fmt}")
def generate_report(
    idea_id: str,
    fmt: ReportFormat,
    db: Session = Depends(get_db),
    user: User = Depends(get_or_create_db_user),
):
    idea = db.query(Idea).filter(Idea.id == idea_id, Idea.user_id == user.id).first()
    if idea is None:
        raise HTTPException(status_code=404, detail="Idea not found")
    if idea.status != IdeaStatus.COMPLETE:
        raise HTTPException(status_code=409, detail="Idea validation is not complete yet")

    path = generate_pdf_report(idea) if fmt == ReportFormat.PDF else generate_docx_report(idea)

    report = Report(idea_id=idea.id, format=fmt, file_path=path)
    db.add(report)
    db.commit()
    db.refresh(report)
    return {"report_id": report.id, "format": fmt.value, "download_url": f"/api/reports/download/{report.id}"}


@router.get("/download/{report_id}")
def download_report(report_id: str, db: Session = Depends(get_db), user: User = Depends(get_or_create_db_user)):
    report = (
        db.query(Report)
        .join(Idea, Idea.id == Report.idea_id)
        .filter(Report.id == report_id, Idea.user_id == user.id)
        .first()
    )
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")

    media_type = "application/pdf" if report.format == ReportFormat.PDF else (
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
    filename = f"startup-report.{report.format.value}"
    return FileResponse(report.file_path, media_type=media_type, filename=filename)
