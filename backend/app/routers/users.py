import os
import uuid

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db import get_db
from app.deps import get_current_user
from app.models import User
from app.schemas import UpdateUserIn

router = APIRouter(prefix='/users', tags=['users'])


def success(data=None, message='success'):
  return {'code': 0, 'message': message, 'data': data}


def serialize_user(user: User):
  return {
    'id': user.id,
    'nickname': user.nickname,
    'avatarUrl': user.avatar_url,
    'age': user.age,
    'phone': user.phone,
    'city': user.city
  }


@router.get('/me')
def get_me(user: User = Depends(get_current_user)):
  return success(serialize_user(user))


@router.put('/me')
def update_me(payload: UpdateUserIn, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
  if payload.nickname is not None:
    user.nickname = payload.nickname
  if payload.avatarUrl is not None:
    user.avatar_url = payload.avatarUrl
  if payload.age is not None:
    user.age = payload.age
  if payload.phone is not None:
    user.phone = payload.phone
  if payload.city is not None:
    user.city = payload.city
  db.add(user)
  db.commit()
  db.refresh(user)
  return success(serialize_user(user))


@router.post('/avatar')
def upload_avatar(
  file: UploadFile = File(...),
  db: Session = Depends(get_db),
  user: User = Depends(get_current_user)
):
  ext = os.path.splitext(file.filename or '')[1] or '.jpg'
  save_dir = os.path.join(settings.static_dir, 'avatars')
  os.makedirs(save_dir, exist_ok=True)
  filename = f'{uuid.uuid4().hex}{ext}'
  file_path = os.path.join(save_dir, filename)

  with open(file_path, 'wb') as output_file:
    output_file.write(file.file.read())

  user.avatar_url = f'/static/avatars/{filename}'
  db.add(user)
  db.commit()
  db.refresh(user)
  return success({'avatarUrl': user.avatar_url})
