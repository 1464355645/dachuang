from copy import deepcopy

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel

from app.deps import get_current_user
from app.models import User

router = APIRouter(prefix='/life-services', tags=['life-services'])


class AffairCreateIn(BaseModel):
  name: str
  phone: str
  businessType: str
  description: str | None = None


def success(data=None, message='success'):
  return {'code': 0, 'message': message, 'data': data}


TRAVEL_SEED = [
  {
    'id': 1,
    'title': '玄武湖春日慢游',
    'category': '公园散步',
    'location': '南京玄武湖景区',
    'time': '2026-04-10 09:00',
    'summary': '路线平缓，适合老人慢走和拍照。',
    'content': '集合后由社区志愿者带队绕湖慢走，全程约 40 分钟，中途可休息拍照。',
    'participantCount': 18,
    'contact': '王老师 13800001111',
    'latitude': 32.0646,
    'longitude': 118.8024,
    'isJoined': False,
    'isFavorite': False
  },
  {
    'id': 2,
    'title': '莫愁湖戏曲赏听',
    'category': '文化活动',
    'location': '莫愁湖公园',
    'time': '2026-04-12 14:30',
    'summary': '听戏、聊天、散步，节奏轻松。',
    'content': '现场有戏曲爱好者交流活动，也安排了休息区和热水点。',
    'participantCount': 26,
    'contact': '赵阿姨 13800002222',
    'latitude': 32.0369,
    'longitude': 118.7578,
    'isJoined': False,
    'isFavorite': True
  },
  {
    'id': 3,
    'title': '栖霞山短途赏景',
    'category': '近郊游玩',
    'location': '栖霞山风景区',
    'time': '2026-04-16 08:30',
    'summary': '有接驳车，行程轻松，适合结伴游玩。',
    'content': '上午统一乘车往返，景区内安排志愿者协助，适合拍照和轻度爬坡。',
    'participantCount': 12,
    'contact': '社区服务站 025-88886666',
    'latitude': 32.1553,
    'longitude': 118.9674,
    'isJoined': False,
    'isFavorite': False
  }
]

AFFAIR_TYPES = [
  {'label': '老年证办理', 'etaDays': 3},
  {'label': '社保卡补办', 'etaDays': 5},
  {'label': '居住信息登记', 'etaDays': 2},
  {'label': '社区证明申请', 'etaDays': 4}
]

AFFAIR_SEED = [
  {
    'id': 101,
    'name': '王阿姨',
    'phone': '13800000000',
    'businessType': '老年证办理',
    'description': '补充材料已提交',
    'status': '处理中',
    'etaDays': 3,
    'createdAt': '2026-04-05 10:30'
  },
  {
    'id': 102,
    'name': '王阿姨',
    'phone': '13800000000',
    'businessType': '社区证明申请',
    'description': '用于医保报销',
    'status': '已完成',
    'etaDays': 4,
    'createdAt': '2026-04-02 14:20'
  }
]

UTILITY_SEED = [
  {
    'id': 201,
    'billType': '水费',
    'month': '2026-03',
    'amount': 46.8,
    'status': '待缴费',
    'dueDate': '2026-04-15',
    'accountNo': 'W-202603-8891',
    'address': '鼓楼区银杏路 18 号 2 栋 301',
    'reminder': '本周内缴费更安心。'
  },
  {
    'id': 202,
    'billType': '电费',
    'month': '2026-03',
    'amount': 128.5,
    'status': '已缴费',
    'dueDate': '2026-04-12',
    'accountNo': 'E-202603-1172',
    'address': '鼓楼区银杏路 18 号 2 栋 301',
    'reminder': '已完成支付。'
  },
  {
    'id': 203,
    'billType': '燃气费',
    'month': '2026-03',
    'amount': 67.2,
    'status': '待缴费',
    'dueDate': '2026-04-18',
    'accountNo': 'G-202603-5518',
    'address': '鼓楼区银杏路 18 号 2 栋 301',
    'reminder': '建议在截止日前完成。'
  }
]

INSURANCE_SUMMARY = {
  'balance': 2680.5,
  'socialSecurityStatus': '正常缴费',
  'annualReimbursement': 3280,
  'lastRefreshTime': '2026-04-07 09:30',
  'healthSummary': '近三个月用药提醒 3 条，最近一次健康建议为“注意休息，多喝温水”。',
  'paymentRecords': [
    {
      'id': 301,
      'type': '社保缴费',
      'title': '2026 年第一季度社保缴费',
      'amount': 860,
      'date': '2026-03-28',
      'status': '已完成',
      'detail': '本季度社保缴费已入账。'
    },
    {
      'id': 302,
      'type': '医保报销',
      'title': '门诊医保报销',
      'amount': 420,
      'date': '2026-02-14',
      'status': '已到账',
      'detail': '本次门诊报销费用已发放到绑定账户。'
    }
  ]
}

FACILITY_SEED = [
  {
    'id': 401,
    'name': '鼓楼社区卫生服务中心',
    'category': '医院药店',
    'address': '南京市鼓楼区中山路 188 号',
    'distance': '800 米',
    'contact': '025-88881234',
    'openHours': '08:00 - 17:30',
    'rating': 4.7,
    'latitude': 32.0602,
    'longitude': 118.7831
  },
  {
    'id': 402,
    'name': '银龄便民超市',
    'category': '超市菜场',
    'address': '南京市鼓楼区银杏路 26 号',
    'distance': '500 米',
    'contact': '025-88884567',
    'openHours': '07:30 - 21:00',
    'rating': 4.5,
    'latitude': 32.0581,
    'longitude': 118.7799
  },
  {
    'id': 403,
    'name': '清风公园驿站',
    'category': '公园休闲',
    'address': '南京市鼓楼区清风公园南门',
    'distance': '1.2 公里',
    'contact': '025-88880999',
    'openHours': '06:00 - 20:30',
    'rating': 4.8,
    'latitude': 32.0496,
    'longitude': 118.7756
  },
  {
    'id': 404,
    'name': '社区政务便民点',
    'category': '办事大厅',
    'address': '南京市鼓楼区社区服务中心一楼',
    'distance': '900 米',
    'contact': '025-88887777',
    'openHours': '09:00 - 17:00',
    'rating': 4.6,
    'latitude': 32.0553,
    'longitude': 118.7817
  }
]

USER_TRAVEL = {}
USER_AFFAIRS = {}
USER_BILLS = {}
USER_FACILITY_FAVORITES = {}


def ensure_user_travel(user_id: int):
  if user_id not in USER_TRAVEL:
    USER_TRAVEL[user_id] = deepcopy(TRAVEL_SEED)
  return USER_TRAVEL[user_id]


def ensure_user_affairs(user_id: int):
  if user_id not in USER_AFFAIRS:
    USER_AFFAIRS[user_id] = deepcopy(AFFAIR_SEED)
  return USER_AFFAIRS[user_id]


def ensure_user_bills(user_id: int):
  if user_id not in USER_BILLS:
    USER_BILLS[user_id] = deepcopy(UTILITY_SEED)
  return USER_BILLS[user_id]


def ensure_user_facility_favorites(user_id: int):
  if user_id not in USER_FACILITY_FAVORITES:
    USER_FACILITY_FAVORITES[user_id] = set()
  return USER_FACILITY_FAVORITES[user_id]


@router.get('/travel')
def get_travel_list(user: User = Depends(get_current_user)):
  return success(ensure_user_travel(user.id))


@router.get('/travel/{item_id}')
def get_travel_detail(item_id: int, user: User = Depends(get_current_user)):
  item = next((item for item in ensure_user_travel(user.id) if item['id'] == item_id), None)
  return success(item)


@router.post('/travel/{item_id}/favorite')
def toggle_travel_favorite(item_id: int, user: User = Depends(get_current_user)):
  item = next((item for item in ensure_user_travel(user.id) if item['id'] == item_id), None)
  if item:
    item['isFavorite'] = not item['isFavorite']
  return success(item)


@router.post('/travel/{item_id}/signup')
def signup_travel(item_id: int, user: User = Depends(get_current_user)):
  item = next((item for item in ensure_user_travel(user.id) if item['id'] == item_id), None)
  if item and not item['isJoined']:
    item['isJoined'] = True
    item['participantCount'] += 1
  return success(item)


@router.get('/affairs/types')
def get_affair_types():
  return success(AFFAIR_TYPES)


@router.post('/affairs')
def create_affair(payload: AffairCreateIn, user: User = Depends(get_current_user)):
  eta_days = next((item['etaDays'] for item in AFFAIR_TYPES if item['label'] == payload.businessType), 3)
  record = {
    'id': max([item['id'] for item in ensure_user_affairs(user.id)] + [100]) + 1,
    'name': payload.name,
    'phone': payload.phone,
    'businessType': payload.businessType,
    'description': payload.description or '',
    'status': '处理中',
    'etaDays': eta_days,
    'createdAt': '2026-04-07 20:00'
  }
  ensure_user_affairs(user.id).insert(0, record)
  return success(record)


@router.get('/affairs/history')
def get_affair_history(user: User = Depends(get_current_user)):
  return success(ensure_user_affairs(user.id))


@router.get('/utilities/bills')
def get_utility_bills(user: User = Depends(get_current_user)):
  bills = ensure_user_bills(user.id)
  pending_count = len([item for item in bills if item['status'] != '已缴费'])
  reminder = f'您本月还有 {pending_count} 笔账单待缴费。'
  return success({
    'reminder': reminder,
    'list': bills
  })


@router.get('/utilities/bills/{bill_id}')
def get_utility_bill_detail(bill_id: int, user: User = Depends(get_current_user)):
  item = next((item for item in ensure_user_bills(user.id) if item['id'] == bill_id), None)
  return success(item)


@router.post('/utilities/bills/{bill_id}/pay')
def pay_utility_bill(bill_id: int, user: User = Depends(get_current_user)):
  item = next((item for item in ensure_user_bills(user.id) if item['id'] == bill_id), None)
  if not item:
    return success({'success': False, 'message': '账单不存在'})
  if bill_id % 2 == 0:
    return success({'success': False, 'message': '缴费失败，请稍后再试'})
  item['status'] = '已缴费'
  item['reminder'] = '已完成支付。'
  return success({'success': True, 'message': '缴费成功'})


@router.get('/utilities/reminders')
def get_utility_reminders(user: User = Depends(get_current_user)):
  bills = ensure_user_bills(user.id)
  reminders = [item['reminder'] for item in bills if item['status'] != '已缴费']
  return success(reminders)


@router.get('/insurance/summary')
def get_insurance_summary():
  return success(deepcopy(INSURANCE_SUMMARY))


@router.post('/insurance/refresh')
def refresh_insurance_summary():
  data = deepcopy(INSURANCE_SUMMARY)
  data['lastRefreshTime'] = '2026-04-07 21:00'
  return success(data)


@router.get('/insurance/records/{record_id}')
def get_insurance_record_detail(record_id: int):
  item = next((item for item in INSURANCE_SUMMARY['paymentRecords'] if item['id'] == record_id), None)
  return success(deepcopy(item))


@router.get('/facilities')
def get_facilities(
  keyword: str = Query(default=''),
  category: str = Query(default=''),
  user: User = Depends(get_current_user)
):
  favorites = ensure_user_facility_favorites(user.id)
  data = []
  for item in FACILITY_SEED:
    current = deepcopy(item)
    current['isFavorite'] = item['id'] in favorites
    data.append(current)
  if keyword:
    data = [item for item in data if keyword in item['name'] or keyword in item['category']]
  if category:
    data = [item for item in data if item['category'] == category]
  return success(data)


@router.get('/facilities/{facility_id}')
def get_facility_detail(facility_id: int, user: User = Depends(get_current_user)):
  favorites = ensure_user_facility_favorites(user.id)
  item = next((deepcopy(item) for item in FACILITY_SEED if item['id'] == facility_id), None)
  if item:
    item['isFavorite'] = facility_id in favorites
  return success(item)


@router.post('/facilities/{facility_id}/favorite')
def toggle_facility_favorite(facility_id: int, user: User = Depends(get_current_user)):
  favorites = ensure_user_facility_favorites(user.id)
  if facility_id in favorites:
    favorites.remove(facility_id)
    state = False
  else:
    favorites.add(facility_id)
    state = True
  return success({'isFavorite': state})
