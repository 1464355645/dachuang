from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import get_current_user
from app.models import LifeRecord, User
from app.schemas import LifeRecordCreateIn, LifeRecordUpdateIn

router = APIRouter(prefix='/life-records', tags=['life-records'])


def success(data=None, message='success'):
  return {'code': 0, 'message': message, 'data': data}


def serialize_record(item: LifeRecord):
  return {
    'id': item.id,
    'recordType': item.record_type,
    'serviceName': item.service_name,
    'title': item.title,
    'amount': item.amount,
    'eventDate': item.event_date,
    'remark': item.remark,
    'status': item.status,
    'createdAt': item.created_at.strftime('%Y-%m-%d %H:%M')
  }


@router.get('')
def get_life_records(
  record_type: str = Query(default='ledger'),
  keyword: str = Query(default=''),
  db: Session = Depends(get_db),
  user: User = Depends(get_current_user)
):
  query = db.query(LifeRecord).filter(
    LifeRecord.user_id == user.id,
    LifeRecord.record_type == record_type
  )
  if keyword:
    query = query.filter(LifeRecord.title.contains(keyword))
  items = query.order_by(LifeRecord.id.desc()).all()
  total_amount = sum(item.amount or 0 for item in items)
  return success({
    'list': [serialize_record(item) for item in items],
    'summary': {
      'count': len(items),
      'totalAmount': round(total_amount, 2)
    }
  })


@router.post('')
def create_life_record(
  payload: LifeRecordCreateIn,
  db: Session = Depends(get_db),
  user: User = Depends(get_current_user)
):
  item = LifeRecord(
    user_id=user.id,
    record_type=payload.recordType,
    service_name=payload.serviceName,
    title=payload.title,
    amount=payload.amount or 0,
    event_date=payload.eventDate,
    remark=payload.remark,
    status=payload.status or 'submitted'
  )
  db.add(item)
  db.commit()
  db.refresh(item)
  return success(serialize_record(item))


@router.put('/{record_id}')
def update_life_record(
  record_id: int,
  payload: LifeRecordUpdateIn,
  db: Session = Depends(get_db),
  user: User = Depends(get_current_user)
):
  item = db.query(LifeRecord).filter(
    LifeRecord.id == record_id,
    LifeRecord.user_id == user.id
  ).first()
  if not item:
    return success(None, '记录不存在')

  if payload.serviceName is not None:
    item.service_name = payload.serviceName
  if payload.title is not None:
    item.title = payload.title
  if payload.amount is not None:
    item.amount = payload.amount
  if payload.eventDate is not None:
    item.event_date = payload.eventDate
  if payload.remark is not None:
    item.remark = payload.remark
  if payload.status is not None:
    item.status = payload.status

  db.add(item)
  db.commit()
  db.refresh(item)
  return success(serialize_record(item))


@router.delete('/{record_id}')
def delete_life_record(
  record_id: int,
  db: Session = Depends(get_db),
  user: User = Depends(get_current_user)
):
  item = db.query(LifeRecord).filter(
    LifeRecord.id == record_id,
    LifeRecord.user_id == user.id
  ).first()
  if not item:
    return success(False, '记录不存在')
  db.delete(item)
  db.commit()
  return success(True)
