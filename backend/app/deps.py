from fastapi import Depends, Header
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import HealthProfile, User


def get_current_user_id(x_user_id: int = Header(default=1)):
  return x_user_id or 1


def get_current_user(
  db: Session = Depends(get_db),
  user_id: int = Depends(get_current_user_id)
):
  user = db.query(User).filter(User.id == user_id).first()
  if not user:
    user = User(id=user_id, nickname='新用户', age=60, city='未填写')
    db.add(user)
    db.commit()
    db.refresh(user)

  profile = db.query(HealthProfile).filter(HealthProfile.user_id == user.id).first()
  if not profile:
    profile = HealthProfile(user_id=user.id)
    db.add(profile)
    db.commit()

  return user
