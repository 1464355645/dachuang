from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import get_current_user
from app.models import Activity, ActivityEnrollment, User
from app.schemas import ActivityCreateIn

router = APIRouter(prefix='/activities', tags=['activities'])


def success(data=None, message='success'):
  return {'code': 0, 'message': message, 'data': data}


@router.get('')
def get_activities(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
  items = db.query(Activity).order_by(Activity.id.desc()).all()
  enrollments = db.query(ActivityEnrollment).filter(ActivityEnrollment.user_id == user.id).all()
  enrolled_ids = {item.activity_id for item in enrollments}
  return success([
    {
      'id': item.id,
      'title': item.title,
      'purpose': item.purpose,
      'time': item.time,
      'location': item.location,
      'peopleCount': item.people_count,
      'description': item.description,
      'auditStatus': item.audit_status,
      'status': item.status,
      'enrolledCount': item.enrolled_count,
      'isSignedUp': item.id in enrolled_ids,
      'publisherName': item.publisher.nickname if item.publisher else '活动发布者'
    }
    for item in items
  ])


@router.post('')
def create_activity(
  payload: ActivityCreateIn,
  db: Session = Depends(get_db),
  user: User = Depends(get_current_user)
):
  item = Activity(
    publisher_id=user.id,
    title=payload.title,
    purpose=payload.purpose,
    time=payload.time,
    location=payload.location,
    people_count=payload.peopleCount,
    description=payload.description,
    audit_status='pending',
    status='open'
  )
  db.add(item)
  db.commit()
  db.refresh(item)
  return success({
    'id': item.id,
    'title': item.title,
    'purpose': item.purpose,
    'time': item.time,
    'location': item.location,
    'peopleCount': item.people_count,
    'description': item.description,
    'auditStatus': item.audit_status
  })


@router.post('/{activity_id}/signup')
def signup_activity(
  activity_id: int,
  db: Session = Depends(get_db),
  user: User = Depends(get_current_user)
):
  activity = db.query(Activity).filter(Activity.id == activity_id).first()
  if not activity:
    return success(False, '活动不存在')
  existed = db.query(ActivityEnrollment).filter(
    ActivityEnrollment.user_id == user.id,
    ActivityEnrollment.activity_id == activity_id
  ).first()
  if existed:
    return success(True, '您已报名')
  enrollment = ActivityEnrollment(user_id=user.id, activity_id=activity_id)
  db.add(enrollment)
  activity.enrolled_count = (activity.enrolled_count or 0) + 1
  db.add(activity)
  db.commit()
  return success(True, '报名成功')
