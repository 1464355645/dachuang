from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import HealthProfile, User
from app.schemas import MockLoginIn

router = APIRouter(prefix='/auth', tags=['auth'])


def success(data=None, message='success'):
  return {'code': 0, 'message': message, 'data': data}


@router.post('/mock-login')
def mock_login(payload: MockLoginIn, db: Session = Depends(get_db)):
  user = db.query(User).filter(User.phone == payload.phone).first()
  if not user:
    user = User(
      nickname=payload.nickname,
      age=payload.age,
      phone=payload.phone,
      city=payload.city,
      avatar_url=''
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.add(HealthProfile(user_id=user.id))
    db.commit()

  return success({
    'token': f'mock-token-{user.id}',
    'user': {
      'id': user.id,
      'nickname': user.nickname,
      'avatarUrl': user.avatar_url,
      'age': user.age,
      'phone': user.phone,
      'city': user.city
    }
  })
