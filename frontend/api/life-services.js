import { USE_MOCK_API, STORAGE_KEYS } from '../utils/config'
import { getStorage, setStorage } from '../utils/storage'
import { get, post } from './request'

const travelSeed = [
  {
    id: 1,
    title: '玄武湖春日慢游',
    category: '公园散步',
    location: '南京玄武湖景区',
    time: '2026-04-10 09:00',
    summary: '路线平缓，适合慢慢走，也方便拍照。',
    content: '活动集合后，由社区志愿者带队慢慢绕湖行走。全程约 40 分钟，中途可休息、喝水、拍照。',
    participantCount: 18,
    contact: '王老师 13800001111',
    latitude: 32.0646,
    longitude: 118.8024,
    isJoined: false,
    isFavorite: false
  },
  {
    id: 2,
    title: '莫愁湖戏曲赏听',
    category: '文化活动',
    location: '莫愁湖公园',
    time: '2026-04-12 14:30',
    summary: '听戏、聊天、散步，安排轻松。',
    content: '现场有戏曲爱好者交流，也准备了休息区和热水点，适合结伴参加。',
    participantCount: 26,
    contact: '赵阿姨 13800002222',
    latitude: 32.0369,
    longitude: 118.7578,
    isJoined: false,
    isFavorite: true
  },
  {
    id: 3,
    title: '栖霞山短途游玩',
    category: '近郊游玩',
    location: '栖霞山风景区',
    time: '2026-04-16 08:30',
    summary: '有接驳车，行程轻松，适合结伴出行。',
    content: '上午统一乘车往返，景区内有志愿者协助，适合赏景、拍照和轻度活动。',
    participantCount: 12,
    contact: '社区服务站 025-88886666',
    latitude: 32.1553,
    longitude: 118.9674,
    isJoined: false,
    isFavorite: false
  }
]

const affairTypeSeed = [
  { label: '老年证办理', etaDays: 3 },
  { label: '社保卡补办', etaDays: 5 },
  { label: '居住信息登记', etaDays: 2 },
  { label: '社区证明申请', etaDays: 4 }
]

const affairHistorySeed = [
  {
    id: 101,
    name: '王阿姨',
    phone: '13800000000',
    businessType: '老年证办理',
    description: '补充材料已提交',
    status: '处理中',
    etaDays: 3,
    createdAt: '2026-04-05 10:30'
  },
  {
    id: 102,
    name: '王阿姨',
    phone: '13800000000',
    businessType: '社区证明申请',
    description: '用于医保报销',
    status: '已完成',
    etaDays: 4,
    createdAt: '2026-04-02 14:20'
  }
]

const utilityBillSeed = [
  {
    id: 201,
    billType: '水费',
    month: '2026-03',
    amount: 46.8,
    status: '待缴费',
    dueDate: '2026-04-15',
    accountNo: 'W-202603-8891',
    address: '鼓楼区银杏路 18 号 2 栋 301',
    reminder: '本周内缴费更安心。'
  },
  {
    id: 202,
    billType: '电费',
    month: '2026-03',
    amount: 128.5,
    status: '已缴费',
    dueDate: '2026-04-12',
    accountNo: 'E-202603-1172',
    address: '鼓楼区银杏路 18 号 2 栋 301',
    reminder: '本账单已经完成支付。'
  },
  {
    id: 203,
    billType: '燃气费',
    month: '2026-03',
    amount: 67.2,
    status: '待缴费',
    dueDate: '2026-04-18',
    accountNo: 'G-202603-5518',
    address: '鼓楼区银杏路 18 号 2 栋 301',
    reminder: '建议在截止日前完成。'
  }
]

const insuranceSummarySeed = {
  balance: 2680.5,
  socialSecurityStatus: '正常缴费',
  annualReimbursement: 3280,
  lastRefreshTime: '2026-04-07 09:30',
  healthSummary: '近三个月有 3 条用药提醒，最近一次健康建议是“注意休息，多喝温水”。',
  paymentRecords: [
    {
      id: 301,
      type: '社保缴费',
      title: '2026 年第一季度社保缴费',
      amount: 860,
      date: '2026-03-28',
      status: '已完成',
      detail: '本季度社保缴费已经入账。'
    },
    {
      id: 302,
      type: '医保报销',
      title: '门诊医保报销',
      amount: 420,
      date: '2026-02-14',
      status: '已到账',
      detail: '本次门诊报销费用已经发放到绑定账户。'
    }
  ]
}

const facilitySeed = [
  {
    id: 401,
    name: '鼓楼社区卫生服务中心',
    category: '医院药店',
    address: '南京市鼓楼区中山路 188 号',
    distance: '800 米',
    contact: '025-88881234',
    openHours: '08:00 - 17:30',
    rating: 4.7,
    latitude: 32.0602,
    longitude: 118.7831
  },
  {
    id: 402,
    name: '银龄便民超市',
    category: '超市菜场',
    address: '南京市鼓楼区银杏路 26 号',
    distance: '500 米',
    contact: '025-88884567',
    openHours: '07:30 - 21:00',
    rating: 4.5,
    latitude: 32.0581,
    longitude: 118.7799
  },
  {
    id: 403,
    name: '清风公园驿站',
    category: '公园休闲',
    address: '南京市鼓楼区清风公园南门',
    distance: '1.2 公里',
    contact: '025-88880999',
    openHours: '06:00 - 20:30',
    rating: 4.8,
    latitude: 32.0496,
    longitude: 118.7756
  },
  {
    id: 404,
    name: '社区政务便民点',
    category: '办事大厅',
    address: '南京市鼓楼区社区服务中心一楼',
    distance: '900 米',
    contact: '025-88887777',
    openHours: '09:00 - 17:00',
    rating: 4.6,
    latitude: 32.0553,
    longitude: 118.7817
  }
]

function clone(data) {
  return JSON.parse(JSON.stringify(data))
}

function getLocalTravel() {
  const data = getStorage(STORAGE_KEYS.travelServices, [])
  if (data && data.length) {
    return data
  }
  const seed = clone(travelSeed)
  setStorage(STORAGE_KEYS.travelServices, seed)
  return seed
}

function saveLocalTravel(list) {
  setStorage(STORAGE_KEYS.travelServices, list)
}

function getLocalAffairs() {
  const data = getStorage(STORAGE_KEYS.affairRecords, [])
  if (data && data.length) {
    return data
  }
  const seed = clone(affairHistorySeed)
  setStorage(STORAGE_KEYS.affairRecords, seed)
  return seed
}

function saveLocalAffairs(list) {
  setStorage(STORAGE_KEYS.affairRecords, list)
}

function getLocalBills() {
  const data = getStorage(STORAGE_KEYS.utilityBills, [])
  if (data && data.length) {
    return data
  }
  const seed = clone(utilityBillSeed)
  setStorage(STORAGE_KEYS.utilityBills, seed)
  return seed
}

function saveLocalBills(list) {
  setStorage(STORAGE_KEYS.utilityBills, list)
}

function getLocalFacilityFavorites() {
  return getStorage(STORAGE_KEYS.facilityFavorites, [])
}

function servicePath(path) {
  return '/life-services' + path
}

export async function getTravelList() {
  if (USE_MOCK_API) {
    return getLocalTravel()
  }
  const response = await get(servicePath('/travel'))
  return response.data
}

export async function getTravelDetail(id) {
  if (USE_MOCK_API) {
    return getLocalTravel().find((item) => item.id === Number(id))
  }
  const response = await get(servicePath('/travel/' + id))
  return response.data
}

export async function toggleTravelFavorite(id) {
  if (USE_MOCK_API) {
    const list = getLocalTravel().map((item) => {
      if (item.id === Number(id)) {
        return {
          ...item,
          isFavorite: !item.isFavorite
        }
      }
      return item
    })
    saveLocalTravel(list)
    return list.find((item) => item.id === Number(id))
  }
  const response = await post(servicePath('/travel/' + id + '/favorite'), {})
  return response.data
}

export async function signupTravel(id) {
  if (USE_MOCK_API) {
    const list = getLocalTravel().map((item) => {
      if (item.id === Number(id) && !item.isJoined) {
        return {
          ...item,
          isJoined: true,
          participantCount: item.participantCount + 1
        }
      }
      return item
    })
    saveLocalTravel(list)
    return list.find((item) => item.id === Number(id))
  }
  const response = await post(servicePath('/travel/' + id + '/signup'), {})
  return response.data
}

export async function getAffairTypes() {
  if (USE_MOCK_API) {
    return clone(affairTypeSeed)
  }
  const response = await get(servicePath('/affairs/types'))
  return response.data
}

export async function submitAffair(payload) {
  if (USE_MOCK_API) {
    const matchedType = affairTypeSeed.find((item) => item.label === payload.businessType)
    const record = {
      id: Date.now(),
      ...payload,
      etaDays: matchedType ? matchedType.etaDays : 3,
      status: '处理中',
      createdAt: new Date().toLocaleString()
    }
    const nextList = [record].concat(getLocalAffairs())
    saveLocalAffairs(nextList)
    return record
  }
  const response = await post(servicePath('/affairs'), payload)
  return response.data
}

export async function getAffairHistory() {
  if (USE_MOCK_API) {
    return getLocalAffairs()
  }
  const response = await get(servicePath('/affairs/history'))
  return response.data
}

export async function getUtilityBills() {
  if (USE_MOCK_API) {
    return {
      reminder: '您本月还有 2 笔账单待缴费。',
      list: getLocalBills()
    }
  }
  const response = await get(servicePath('/utilities/bills'))
  return response.data
}

export async function getUtilityBillDetail(id) {
  if (USE_MOCK_API) {
    return getLocalBills().find((item) => item.id === Number(id))
  }
  const response = await get(servicePath('/utilities/bills/' + id))
  return response.data
}

export async function payUtilityBill(id) {
  if (USE_MOCK_API) {
    const success = Number(id) % 2 !== 0
    const list = getLocalBills().map((item) => {
      if (item.id === Number(id) && success) {
        return {
          ...item,
          status: '已缴费',
          reminder: '本账单已经完成支付。'
        }
      }
      return item
    })
    saveLocalBills(list)
    return {
      success,
      message: success ? '缴费成功' : '缴费失败，请稍后再试'
    }
  }
  const response = await post(servicePath('/utilities/bills/' + id + '/pay'), {})
  return response.data
}

export async function getInsuranceSummary() {
  if (USE_MOCK_API) {
    return clone(insuranceSummarySeed)
  }
  const response = await get(servicePath('/insurance/summary'))
  return response.data
}

export async function refreshInsuranceSummary() {
  if (USE_MOCK_API) {
    return {
      ...clone(insuranceSummarySeed),
      lastRefreshTime: new Date().toLocaleString()
    }
  }
  const response = await post(servicePath('/insurance/refresh'), {})
  return response.data
}

export async function getInsuranceRecordDetail(id) {
  if (USE_MOCK_API) {
    return clone(insuranceSummarySeed.paymentRecords.find((item) => item.id === Number(id)))
  }
  const response = await get(servicePath('/insurance/records/' + id))
  return response.data
}

export async function getFacilityList(params = {}) {
  if (USE_MOCK_API) {
    const keyword = (params.keyword || '').trim()
    const category = params.category || ''
    const favorites = getLocalFacilityFavorites()
    let list = clone(facilitySeed).map((item) => ({
      ...item,
      isFavorite: favorites.includes(item.id)
    }))
    if (keyword) {
      list = list.filter((item) => item.name.includes(keyword) || item.category.includes(keyword))
    }
    if (category) {
      list = list.filter((item) => item.category === category)
    }
    return list
  }
  const response = await get(servicePath('/facilities'), params)
  return response.data
}

export async function getFacilityDetail(id) {
  if (USE_MOCK_API) {
    const favorites = getLocalFacilityFavorites()
    const item = clone(facilitySeed.find((current) => current.id === Number(id)))
    return {
      ...item,
      isFavorite: favorites.includes(Number(id))
    }
  }
  const response = await get(servicePath('/facilities/' + id))
  return response.data
}

export async function toggleFacilityFavorite(id) {
  if (USE_MOCK_API) {
    const favorites = getLocalFacilityFavorites()
    const exists = favorites.includes(Number(id))
    const next = exists ? favorites.filter((item) => item !== Number(id)) : favorites.concat([Number(id)])
    setStorage(STORAGE_KEYS.facilityFavorites, next)
    return {
      isFavorite: !exists
    }
  }
  const response = await post(servicePath('/facilities/' + id + '/favorite'), {})
  return response.data
}