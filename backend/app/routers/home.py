from datetime import datetime

import requests
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db import get_db
from app.deps import get_current_user
from app.models import Activity, MedicineReminder, User

router = APIRouter(prefix='/home', tags=['home'])


def success(data=None, message='success'):
  return {'code': 0, 'message': message, 'data': data}


def get_weekday_label(now: datetime):
  weekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
  return weekdays[now.weekday()]


def get_dressing_tip(temperature: float):
  if temperature < 10:
    return '天气较冷，出门请穿厚外套。'
  if temperature < 18:
    return '早晚偏凉，建议带一件薄外套。'
  if temperature < 26:
    return '温度舒适，穿长袖更合适。'
  return '天气较热，注意补水和防晒。'


def get_weather_text(weather_code: int):
  if weather_code in [0, 1]:
    return '晴'
  if weather_code in [2, 3]:
    return '多云'
  if weather_code in [45, 48]:
    return '有雾'
  if weather_code in [51, 53, 55, 61, 63, 65]:
    return '有雨'
  return '阴'


def fetch_weather():
  default_temp = 24
  default_weather = '晴'
  if not settings.weather_enabled:
    return default_weather, default_temp
  try:
    response = requests.get(
      settings.weather_api_url,
      params={
        'latitude': settings.weather_lat,
        'longitude': settings.weather_lon,
        'current': 'temperature_2m,weather_code'
      },
      timeout=5
    )
    data = response.json().get('current', {})
    temperature = float(data.get('temperature_2m', default_temp))
    weather_text = get_weather_text(int(data.get('weather_code', 0)))
    return weather_text, temperature
  except Exception:
    return default_weather, default_temp


@router.get('/reminder')
def get_home_reminder(
  db: Session = Depends(get_db),
  user: User = Depends(get_current_user)
):
  now = datetime.now()
  weather_text, temperature = fetch_weather()
  medication_count = db.query(MedicineReminder).filter(
    MedicineReminder.user_id == user.id,
    MedicineReminder.status == 'active'
  ).count()
  activity = db.query(Activity).filter(Activity.audit_status == 'approved').order_by(Activity.id.desc()).first()

  items = []
  if medication_count:
    items.append(f'今天有 {medication_count} 条用药提醒')
  if activity:
    items.append(f'社区活动：{activity.title}')
  if not items:
    items.append('今天适合散步和学习一节课程')

  return success({
    'date': now.strftime('%Y-%m-%d'),
    'weekday': get_weekday_label(now),
    'weather': weather_text,
    'temperature': f'{int(temperature)}°C',
    'dressingTip': get_dressing_tip(temperature),
    'notice': items[0],
    'items': items,
    'greeting': f'{user.nickname}，今天也要轻松一点。'
  })


@router.get('/videos')
def get_video_list():
  return success([
    {
      'id': 1,
      'title': '舒缓拉伸 5 分钟',
      'category': '养生视频',
      'coverUrl': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      'videoUrl': 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
      'id': 2,
      'title': '广场舞基础跟练',
      'category': '广场舞',
      'coverUrl': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80',
      'videoUrl': 'https://www.w3schools.com/html/movie.mp4'
    },
    {
      'id': 3,
      'title': '手机扫码教学',
      'category': '教学视频',
      'coverUrl': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      'videoUrl': 'https://www.w3schools.com/html/mov_bbb.mp4'
    }
  ])


@router.get('/voice-greeting')
def get_voice_greeting():
  return success({
    'text': '您好，欢迎使用银龄通。今天也别忘了按时休息和喝水。',
    'audioUrl': 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
  })
