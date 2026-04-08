from collections import defaultdict
from datetime import datetime
from itertools import count

from fastapi import APIRouter, Depends, Query

from app.deps import get_current_user
from app.models import User
from app.schemas import (
  CheckupAppointmentIn,
  DiscomfortQueryIn,
  HealthArticleActionIn,
  MedicationCreateIn,
  MedicationUpdateIn,
  OutpatientAppointmentIn,
)

router = APIRouter(prefix='/health', tags=['health'])


def success(data=None, message='success'):
  return {'code': 0, 'message': message, 'data': data}


SYMPTOM_OPTIONS = [
  {
    'value': '头痛',
    'suggestion': '先休息一会儿，注意补水，暂时不要久看手机。',
    'precautions': '如果头痛明显加重，或伴有恶心、视物不清，请尽快就医。',
    'dietTip': '饮食清淡一些，少喝浓茶和咖啡。',
    'doctorTip': '如果持续两天以上，建议及时就医。'
  },
  {
    'value': '咳嗽',
    'suggestion': '注意保暖，多喝温水，先避免着凉。',
    'precautions': '若伴有发热、胸闷，或咳嗽超过一周，请及时检查。',
    'dietTip': '少吃辛辣刺激食物，可以适当喝温热汤水。',
    'doctorTip': '如果影响睡觉或呼吸不适，建议尽快就医。'
  },
  {
    'value': '失眠',
    'suggestion': '睡前少看手机，保持房间安静，尽量规律作息。',
    'precautions': '晚上不要喝浓茶或咖啡，午睡时间不要太长。',
    'dietTip': '晚饭不宜过饱，睡前可喝少量温牛奶。',
    'doctorTip': '若连续多日睡不好，建议咨询医生。'
  },
  {
    'value': '血压偏高',
    'suggestion': '先安静休息，按时监测血压，不要着急活动。',
    'precautions': '不要情绪激动，注意按医嘱服药。',
    'dietTip': '少盐少油，避免腌制和过咸食物。',
    'doctorTip': '若数值持续偏高，建议尽快就医。'
  },
  {
    'value': '胃口不好',
    'suggestion': '先少量多餐，休息好，避免油腻食物。',
    'precautions': '如果同时有腹痛、恶心或明显乏力，请多留意。',
    'dietTip': '适合吃软一些、温热、清淡的食物。',
    'doctorTip': '若持续几天仍吃不下，建议就医。'
  },
  {
    'value': '关节酸痛',
    'suggestion': '注意保暖，活动先放慢一些，不要过度用力。',
    'precautions': '不要长时间负重，若红肿明显需及时检查。',
    'dietTip': '多喝温水，饮食均衡，可适当补充蛋白质。',
    'doctorTip': '如果疼痛影响走路或持续不缓解，建议就医。'
  }
]

HEALTH_ARTICLES = [
  {
    'id': 1,
    'category': '慢病管理',
    'title': '高血压日常管理要点',
    'summary': '按时测量、规律作息、少盐饮食。',
    'content': '高血压人群建议每天固定时间测量血压，记录变化。饮食尽量清淡，减少腌制食品。平时保持稳定作息，按医嘱规律服药。',
    'readMinutes': 4,
    'publishedAt': '2026-04-01',
    'warmTip': '仅供日常参考，如有明显不适请及时就医。'
  },
  {
    'id': 2,
    'category': '饮食养生',
    'title': '老年人三餐怎么吃更稳妥',
    'summary': '三餐规律，少油少盐，吃软一点更舒服。',
    'content': '建议早餐吃得稳一点，中午搭配蛋白质和蔬菜，晚饭不要过饱。平时多喝温水，少量多次更合适。',
    'readMinutes': 5,
    'publishedAt': '2026-04-02',
    'warmTip': '饮食调整应结合个人情况，慢病人群请结合医生建议。'
  },
  {
    'id': 3,
    'category': '睡眠健康',
    'title': '晚上睡不安稳怎么办',
    'summary': '睡前少看手机，保持卧室安静。',
    'content': '晚饭不要过晚，睡前少看手机，房间保持安静、温度适中。可以听轻音乐或泡脚，帮助身体慢慢放松。',
    'readMinutes': 4,
    'publishedAt': '2026-04-03',
    'warmTip': '若长期睡不好，建议及时咨询医生。'
  },
  {
    'id': 4,
    'category': '日常运动',
    'title': '适合老年人的轻运动建议',
    'summary': '散步、拉伸、八段锦都比较合适。',
    'content': '每天适量活动有助于保持身体灵活。建议从散步、拉伸等轻运动开始，运动时以不累、不喘为宜。',
    'readMinutes': 5,
    'publishedAt': '2026-04-04',
    'warmTip': '活动中如出现胸闷、头晕，请立即停止并休息。'
  },
  {
    'id': 5,
    'category': '急救常识',
    'title': '遇到突发不适先做什么',
    'summary': '先坐下休息，观察情况，再联系家人或医生。',
    'content': '遇到头晕、胸闷等突发不适时，先保证自己处在安全位置，尽量坐下或躺平休息。必要时尽快联系家人和医生。',
    'readMinutes': 3,
    'publishedAt': '2026-04-05',
    'warmTip': '出现持续或加重的不适，请尽快就医。'
  },
  {
    'id': 6,
    'category': '慢病管理',
    'title': '糖尿病日常饮食提醒',
    'summary': '规律吃饭，控制甜食，按时复查。',
    'content': '建议保持三餐规律，减少高糖零食，注意主食总量。按医生建议监测血糖，定期复查。',
    'readMinutes': 4,
    'publishedAt': '2026-04-06',
    'warmTip': '如出现明显头晕、心慌等情况，请及时就医。'
  }
]

OUTPATIENT_DEPARTMENTS = [
  {'id': 1, 'name': '内科', 'desc': '常见内科问题可先在这里查看'},
  {'id': 2, 'name': '外科', 'desc': '适合常见外科检查咨询'},
  {'id': 3, 'name': '心血管科', 'desc': '适合血压、心脏相关问题'},
  {'id': 4, 'name': '神经内科', 'desc': '适合头晕、头痛等问题'},
  {'id': 5, 'name': '骨科', 'desc': '适合关节和骨骼问题'},
  {'id': 6, 'name': '老年医学科', 'desc': '适合综合慢病和老年健康管理'},
]

OUTPATIENT_DOCTORS = [
  {'id': 101, 'departmentId': 1, 'doctorName': '李医生', 'departmentName': '内科', 'date': '2026-04-10', 'timeSlot': '上午 09:00-10:00', 'remainCount': 8, 'intro': '擅长常见内科慢病随访。'},
  {'id': 102, 'departmentId': 1, 'doctorName': '王医生', 'departmentName': '内科', 'date': '2026-04-10', 'timeSlot': '下午 14:00-15:00', 'remainCount': 5, 'intro': '擅长日常身体不适评估。'},
  {'id': 103, 'departmentId': 3, 'doctorName': '周医生', 'departmentName': '心血管科', 'date': '2026-04-11', 'timeSlot': '上午 08:30-09:30', 'remainCount': 4, 'intro': '擅长血压和心脏健康管理。'},
  {'id': 104, 'departmentId': 4, 'doctorName': '陈医生', 'departmentName': '神经内科', 'date': '2026-04-11', 'timeSlot': '下午 15:00-16:00', 'remainCount': 6, 'intro': '擅长头晕、失眠等常见问题。'},
  {'id': 105, 'departmentId': 5, 'doctorName': '赵医生', 'departmentName': '骨科', 'date': '2026-04-12', 'timeSlot': '上午 10:00-11:00', 'remainCount': 7, 'intro': '擅长关节酸痛、行动不便评估。'},
  {'id': 106, 'departmentId': 6, 'doctorName': '孙医生', 'departmentName': '老年医学科', 'date': '2026-04-12', 'timeSlot': '下午 13:30-14:30', 'remainCount': 9, 'intro': '擅长老年综合健康管理。'},
]

CHECKUP_PACKAGES = [
  {'id': 201, 'name': '基础健康体检', 'suitablePeople': '适合日常体检和年度检查', 'summary': '基础项目齐全，适合大多数老年用户。', 'itemsText': '血压、血常规、心电图、肝肾功能、腹部彩超。', 'price': 299, 'tip': '体检前一晚注意清淡饮食。'},
  {'id': 202, 'name': '老年慢病筛查', 'suitablePeople': '适合关注血糖、血脂、血压的人群', 'summary': '更关注慢病风险，便于日常管理。', 'itemsText': '空腹血糖、血脂、血压、尿常规、心电图。', 'price': 399, 'tip': '如在服药，请提前咨询是否需要空腹。'},
  {'id': 203, 'name': '血压血糖检查', 'suitablePeople': '适合想快速了解基础指标的人群', 'summary': '项目少，流程快。', 'itemsText': '血压、空腹血糖、基础问诊。', 'price': 99, 'tip': '建议上午进行，方便空腹检查。'},
  {'id': 204, 'name': '心脑血管基础筛查', 'suitablePeople': '适合关注心脑血管健康的人群', 'summary': '偏重心脑血管基础风险查看。', 'itemsText': '血压、心电图、血脂、颈动脉基础检查。', 'price': 459, 'tip': '近期有明显不适时请先就医。'},
  {'id': 205, 'name': '骨密度检查', 'suitablePeople': '适合关注骨骼健康的人群', 'summary': '适合日常骨骼健康关注。', 'itemsText': '骨密度检测、基础问诊、健康建议。', 'price': 159, 'tip': '检查当天穿着方便活动的衣物。'},
]

USER_SYMPTOM_RECORDS = defaultdict(list)
USER_MEDICATIONS = defaultdict(list)
USER_ARTICLE_ACTIONS = defaultdict(dict)
USER_OUTPATIENT_APPOINTMENTS = defaultdict(list)
USER_CHECKUP_APPOINTMENTS = defaultdict(list)

SYMPTOM_COUNTER = count(1)
MEDICATION_COUNTER = count(1)
OUTPATIENT_COUNTER = count(1)
CHECKUP_COUNTER = count(1)


def now_label():
  return datetime.now().strftime('%Y-%m-%d %H:%M')


def get_symptom_value(payload: DiscomfortQueryIn):
  return payload.symptomType or payload.symptom or ''


def build_article_for_user(article, user_id: int):
  action = USER_ARTICLE_ACTIONS[user_id].get(article['id'], {})
  return {
    **article,
    'isFavorite': bool(action.get('isFavorite')),
    'isRead': bool(action.get('isRead')),
  }


def get_article_by_id(article_id: int):
  return next((item for item in HEALTH_ARTICLES if item['id'] == article_id), None)


@router.get('/discomfort-options')
@router.get('/symptoms/options')
def get_discomfort_options():
  return success(SYMPTOM_OPTIONS)


@router.post('/discomfort-query')
@router.post('/symptoms/query')
def discomfort_query(payload: DiscomfortQueryIn, user: User = Depends(get_current_user)):
  symptom_value = get_symptom_value(payload)
  current = next((item for item in SYMPTOM_OPTIONS if item['value'] == symptom_value), None)
  if not current:
    current = {
      'value': symptom_value or '未说明',
      'suggestion': '请先休息，注意观察变化。',
      'precautions': '如持续不适，请及时就医。',
      'dietTip': '饮食尽量清淡一些。',
      'doctorTip': '如持续不适，请及时就医。'
    }

  record = {
    'id': next(SYMPTOM_COUNTER),
    'symptomType': symptom_value,
    'symptom': symptom_value,
    'detail': payload.detail or '',
    'suggestion': current['suggestion'],
    'advice': current['suggestion'],
    'precautions': current['precautions'],
    'dietTip': current['dietTip'],
    'doctorTip': current['doctorTip'],
    'createdAt': now_label(),
    'referenceTip': '仅供日常参考，如身体持续不适请及时就医。'
  }
  USER_SYMPTOM_RECORDS[user.id].insert(0, record)
  return success(record)


@router.get('/discomfort-logs')
@router.get('/symptoms/history')
def get_discomfort_logs(user: User = Depends(get_current_user)):
  return success(USER_SYMPTOM_RECORDS[user.id])


@router.get('/reminders')
def get_medication_reminders(user: User = Depends(get_current_user)):
  return success(USER_MEDICATIONS[user.id])


@router.post('/reminders')
def create_medication_reminder(payload: MedicationCreateIn, user: User = Depends(get_current_user)):
  item = {
    'id': next(MEDICATION_COUNTER),
    'medicineName': payload.medicineName,
    'dosage': payload.dosage or '',
    'time': payload.time,
    'frequency': payload.frequency,
    'notes': payload.notes or '',
    'status': payload.status or 'active',
    'createdAt': now_label()
  }
  USER_MEDICATIONS[user.id].insert(0, item)
  return success(item)


@router.put('/reminders/{reminder_id}')
def update_medication_reminder(reminder_id: int, payload: MedicationUpdateIn, user: User = Depends(get_current_user)):
  for item in USER_MEDICATIONS[user.id]:
    if item['id'] == reminder_id:
      if payload.medicineName is not None:
        item['medicineName'] = payload.medicineName
      if payload.dosage is not None:
        item['dosage'] = payload.dosage
      if payload.time is not None:
        item['time'] = payload.time
      if payload.frequency is not None:
        item['frequency'] = payload.frequency
      if payload.notes is not None:
        item['notes'] = payload.notes
      if payload.status is not None:
        item['status'] = payload.status
      return success(item)
  return success(None, 'not found')


@router.delete('/reminders/{reminder_id}')
def delete_medication_reminder(reminder_id: int, user: User = Depends(get_current_user)):
  USER_MEDICATIONS[user.id] = [item for item in USER_MEDICATIONS[user.id] if item['id'] != reminder_id]
  return success(True)


@router.get('/knowledge/categories')
def get_knowledge_categories():
  categories = ['全部'] + sorted({item['category'] for item in HEALTH_ARTICLES})
  return success(categories)


@router.get('/knowledge/articles')
@router.get('/articles')
def get_knowledge_articles(
  page: int = Query(default=1),
  page_size: int = Query(default=5),
  category: str = Query(default=''),
  keyword: str = Query(default=''),
  user: User = Depends(get_current_user)
):
  items = HEALTH_ARTICLES[:]
  if category and category != '全部':
    items = [item for item in items if item['category'] == category]
  if keyword:
    items = [item for item in items if keyword in item['title'] or keyword in item['summary']]
  total = len(items)
  current = items[(page - 1) * page_size: page * page_size]
  return success({
    'list': [build_article_for_user(item, user.id) for item in current],
    'pagination': {
      'page': page,
      'pageSize': page_size,
      'total': total,
      'hasMore': page * page_size < total
    }
  })


@router.get('/knowledge/articles/{article_id}')
@router.get('/articles/{article_id}')
def get_knowledge_article_detail(article_id: int, user: User = Depends(get_current_user)):
  article = get_article_by_id(article_id)
  if not article:
    return success(None, 'not found')
  return success(build_article_for_user(article, user.id))


@router.post('/knowledge/articles/{article_id}/action')
@router.post('/articles/{article_id}/action')
def update_article_action(article_id: int, payload: HealthArticleActionIn, user: User = Depends(get_current_user)):
  current = USER_ARTICLE_ACTIONS[user.id].get(article_id, {})
  if payload.action == 'favorite':
    current['isFavorite'] = bool(payload.value)
  if payload.action == 'read':
    current['isRead'] = True
    current['lastReadAt'] = now_label()
  USER_ARTICLE_ACTIONS[user.id][article_id] = current
  return success(current)


@router.get('/outpatient/departments')
def get_outpatient_departments():
  return success(OUTPATIENT_DEPARTMENTS)


@router.get('/outpatient/doctors')
def get_outpatient_doctors(
  department_id: int | None = Query(default=None),
  user: User = Depends(get_current_user)
):
  _ = user
  items = OUTPATIENT_DOCTORS[:]
  if department_id is not None:
    items = [item for item in items if item['departmentId'] == department_id]
  return success(items)


@router.post('/outpatient/appointments')
def create_outpatient_appointment(payload: OutpatientAppointmentIn, user: User = Depends(get_current_user)):
  item = {
    'id': next(OUTPATIENT_COUNTER),
    'name': payload.name,
    'phone': payload.phone,
    'patientName': payload.patientName,
    'departmentName': payload.departmentName,
    'doctorName': payload.doctorName,
    'date': payload.date,
    'timeSlot': payload.timeSlot,
    'notes': payload.notes or '',
    'status': '已预约',
    'createdAt': now_label()
  }
  USER_OUTPATIENT_APPOINTMENTS[user.id].insert(0, item)
  return success(item)


@router.get('/outpatient/appointments')
def get_outpatient_appointments(user: User = Depends(get_current_user)):
  return success(USER_OUTPATIENT_APPOINTMENTS[user.id])


@router.get('/checkups/packages')
def get_checkup_packages():
  return success(CHECKUP_PACKAGES)


@router.get('/checkups/packages/{package_id}')
def get_checkup_package_detail(package_id: int):
  item = next((pkg for pkg in CHECKUP_PACKAGES if pkg['id'] == package_id), None)
  return success(item)


@router.post('/checkups/appointments')
def create_checkup_appointment(payload: CheckupAppointmentIn, user: User = Depends(get_current_user)):
  item = {
    'id': next(CHECKUP_COUNTER),
    'name': payload.name,
    'phone': payload.phone,
    'packageName': payload.packageName,
    'date': payload.date,
    'timeSlot': payload.timeSlot,
    'notes': payload.notes or '',
    'status': '已预约',
    'createdAt': now_label()
  }
  USER_CHECKUP_APPOINTMENTS[user.id].insert(0, item)
  return success(item)


@router.get('/checkups/appointments')
def get_checkup_appointments(user: User = Depends(get_current_user)):
  return success(USER_CHECKUP_APPOINTMENTS[user.id])


@router.get('/profile')
def get_health_profile(user: User = Depends(get_current_user)):
  reminders = USER_MEDICATIONS[user.id]
  symptoms = USER_SYMPTOM_RECORDS[user.id]
  article_actions = USER_ARTICLE_ACTIONS[user.id]
  read_ids = [article_id for article_id, action in article_actions.items() if action.get('isRead')]
  recent_articles = []
  for article_id in reversed(read_ids[-3:]):
    article = get_article_by_id(article_id)
    action = article_actions.get(article_id, {})
    recent_articles.append({
      'articleId': article_id,
      'title': article['title'] if article else '健康知识',
      'lastReadAt': action.get('lastReadAt', now_label())
    })

  latest_advice = symptoms[0]['suggestion'] if symptoms else '暂无健康建议，您可以先做一次身体不适查询。'
  summary_text = '您已添加用药提醒，按时查看更安心。' if reminders else '当前还没有用药提醒，可按需要添加。'

  return success({
    'latestAdvice': latest_advice,
    'medicationCount': len(reminders),
    'discomfortCount': len(symptoms),
    'knowledgeReadCount': len(read_ids),
    'outpatientCount': len(USER_OUTPATIENT_APPOINTMENTS[user.id]),
    'checkupCount': len(USER_CHECKUP_APPOINTMENTS[user.id]),
    'summary': summary_text,
    'recentDiscomforts': symptoms[:3],
    'recentArticles': recent_articles
  })