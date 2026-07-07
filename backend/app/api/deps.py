from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.security import AuthUser, get_current_user
from app.db.models import User
from app.db.session import get_db


def get_or_create_db_user(
    auth_user: AuthUser = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    user = db.query(User).filter(User.clerk_user_id == auth_user.user_id).first()
    if user is None:
        user = User(
            clerk_user_id=auth_user.user_id,
            email=auth_user.email or f"{auth_user.user_id}@unknown.local",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
