import { USE_MOCK_API, STORAGE_KEYS } from '../utils/config'
import { getStorage, setStorage } from '../utils/storage'
import { del, get, post, put } from './request'

const symptomTemplates = [
  {
    value: '头痛',
    suggestion: '先休息一会儿，注意补水，暂时不要久看手机。',
    precautions: '如果头痛明显加重，或伴有恶心、视物不清，请尽快就医。',
    dietTip: '饮食清淡一些，少喝浓茶和咖啡。',
    doctorTip: '如果持续两天以上，建议及时就医。'
  },
  {
    value: '咳嗽',
    suggestion: '注意保暖，多喝温水，先避免着凉。',
    precautions: '若伴有发热、胸闷，或咳嗽超过一周，请及时检查。',
    dietTip: '少吃辛辣刺激食物，可以适当喝温热汤水。',
    doctorTip: '如果影响睡觉或呼吸不适，建议尽快就医。'
  },
  {
    value: '失眠',
    suggestion: '睡前少看手机，保持房间安静，尽量规律作息。',
    precautions: '晚上不要喝浓茶或咖啡，午睡时间不要太长。',
    dietTip: '晚饭不宜过饱，睡前可喝少量温牛奶。',
    doctorTip: '若连续多日睡不好，建议咨询医生。'
  },
  {
    value: '血压偏高',
    suggestion: '先安静休息，按时监测血压，不要着急活动。',
    precautions: '不要情绪激动，注意按医嘱服药。',
    dietTip: '少盐少油，避免腌制和过咸食物。',
    doctorTip: '若数值持续偏高，建议尽快就医。'
  },
  {
    value: '胃口不好',
    suggestion: '先少量多餐，休息好，避免油腻食物。',
    precautions: '如果同时有腹痛、恶心或明显乏力，请多留意。',
    dietTip: '适合吃软一些、温热、清淡的食物。',
    doctorTip: '若持续几天仍吃不下，建议就医。'
  },
  {
    value: '关节酸痛',
    suggestion: '注意保暖，活动先放慢一些，不要过度用力。',
    precautions: '不要长时间负重，若红肿明显需及时检查。',
    dietTip: '多喝温水，饮食均衡，可适当补充蛋白质。',
    doctorTip: '如果疼痛影响走路或持续不缓解，建议就医。'
  }
]

const knowledgeCategories = ['全部', '慢病管理', '饮食养生', '睡眠健康', '日常运动', '急救常识']

const knowledgeArticles = [
  {
    id: 1,
    category: '慢病管理',
    title: '高血压日常管理要点',
    summary: '按时测量、规律作息、少盐饮食。',
    content: '高血压人群建议每天固定时间测量血压，记录变化。饮食尽量清淡，减少腌制食品。平时保持稳定作息，按医嘱规律服药。',
    readMinutes: 4,
    publishedAt: '2026-04-01',
    warmTip: '仅供日常参考，如有明显不适请及时就医。'
  },
  {
    id: 2,
    category: '饮食养生',
    title: '老年人三餐怎么吃更稳妥',
    summary: '三餐规律，少油少盐，吃软一点更舒服。',
    content: '建议早餐吃得稳一点，中午搭配蛋白质和蔬菜，晚饭不要过饱。平时多喝温水，少量多次更合适。',
    readMinutes: 5,
    publishedAt: '2026-04-02',
    warmTip: '饮食调整应结合个人情况，慢病人群请结合医生建议。'
  },
  {
    id: 3,
    category: '睡眠健康',
    title: '晚上睡不安稳怎么办',
    summary: '睡前少看手机，保持卧室安静。',
    content: '晚饭不要过晚，睡前少看手机，房间保持安静、温度适中。可以听轻音乐或泡脚，帮助身体慢慢放松。',
    readMinutes: 4,
    publishedAt: '2026-04-03',
    warmTip: '若长期睡不好，建议及时咨询医生。'
  },
  {
    id: 4,
    category: '日常运动',
    title: '适合老年人的轻运动建议',
    summary: '散步、拉伸、八段锦都比较合适。',
    content: '每天适量活动有助于保持身体灵活。建议从散步、拉伸等轻运动开始，运动时以不累、不喘为宜。',
    readMinutes: 5,
    publishedAt: '2026-04-04',
    warmTip: '活动中如出现胸闷、头晕，请立即停止并休息。'
  },
  {
    id: 5,
    category: '急救常识',
    title: '遇到突发不适先做什么',
    summary: '先坐下休息，观察情况，再联系家人或医生。',
    content: '遇到头晕、胸闷等突发不适时，先保证自己处在安全位置，尽量坐下或躺平休息。必要时尽快联系家人和医生。',
    readMinutes: 3,
    publishedAt: '2026-04-05',
    warmTip: '出现持续或加重的不适，请尽快就医。'
  },
  {
    id: 6,
    category: '慢病管理',
    title: '糖尿病日常饮食提醒',
    summary: '规律吃饭，控制甜食，按时复查。',
    content: '建议保持三餐规律，减少高糖零食，注意主食总量。按医生建议监测血糖，定期复查。',
    readMinutes: 4,
    publishedAt: '2026-04-06',
    warmTip: '如出现明显头晕、心慌等情况，请及时就医。'
  }
]

const outpatientDepartments = [
  { id: 1, name: '内科', desc: '常见内科问题可先在这里查看' },
  { id: 2, name: '外科', desc: '适合常见外科检查咨询' },
  { id: 3, name: '心血管科', desc: '适合血压、心脏相关问题' },
  { id: 4, name: '神经内科', desc: '适合头晕、头痛等问题' },
  { id: 5, name: '骨科', desc: '适合关节和骨骼问题' },
  { id: 6, name: '老年医学科', desc: '适合综合慢病和老年健康管理' }
]

const outpatientDoctors = [
  { id: 101, departmentId: 1, doctorName: '李医生', departmentName: '内科', date: '2026-04-10', timeSlot: '上午 09:00-10:00', remainCount: 8, intro: '擅长常见内科慢病随访。', clinicAddress: '市民医院门诊楼 2 层' },
  { id: 102, departmentId: 1, doctorName: '王医生', departmentName: '内科', date: '2026-04-10', timeSlot: '下午 14:00-15:00', remainCount: 5, intro: '擅长日常身体不适评估。', clinicAddress: '市民医院门诊楼 2 层' },
  { id: 103, departmentId: 3, doctorName: '周医生', departmentName: '心血管科', date: '2026-04-11', timeSlot: '上午 08:30-09:30', remainCount: 4, intro: '擅长血压和心脏健康管理。', clinicAddress: '市民医院门诊楼 3 层' },
  { id: 104, departmentId: 4, doctorName: '陈医生', departmentName: '神经内科', date: '2026-04-11', timeSlot: '下午 15:00-16:00', remainCount: 6, intro: '擅长头晕、失眠等常见问题。', clinicAddress: '市民医院门诊楼 4 层' },
  { id: 105, departmentId: 5, doctorName: '赵医生', departmentName: '骨科', date: '2026-04-12', timeSlot: '上午 10:00-11:00', remainCount: 7, intro: '擅长关节酸痛、行动不便评估。', clinicAddress: '市民医院门诊楼 1 层' },
  { id: 106, departmentId: 6, doctorName: '孙医生', departmentName: '老年医学科', date: '2026-04-12', timeSlot: '下午 13:30-14:30', remainCount: 9, intro: '擅长老年综合健康管理。', clinicAddress: '市民医院门诊楼 5 层' }
]

const checkupPackages = [
  {
    id: 201,
    name: '基础健康体检',
    suitablePeople: '适合日常体检和年度检查',
    summary: '基础项目齐全，适合大多数老年用户。',
    itemsText: '血压、血常规、心电图、肝肾功能、腹部彩超。',
    price: 299,
    tip: '体检前一晚注意清淡饮食。'
  },
  {
    id: 202,
    name: '老年慢病筛查',
    suitablePeople: '适合关注血糖、血脂、血压的人群',
    summary: '更关注慢病风险，便于日常管理。',
    itemsText: '空腹血糖、血脂、血压、尿常规、心电图。',
    price: 399,
    tip: '如在服药，请提前咨询是否需要空腹。'
  },
  {
    id: 203,
    name: '血压血糖检查',
    suitablePeople: '适合想快速了解基础指标的人群',
    summary: '项目少，流程快。',
    itemsText: '血压、空腹血糖、基础问诊。',
    price: 99,
    tip: '建议上午进行，方便空腹检查。'
  },
  {
    id: 204,
    name: '心脑血管基础筛查',
    suitablePeople: '适合关注心脑血管健康的人群',
    summary: '偏重心脑血管基础风险查看。',
    itemsText: '血压、心电图、血脂、颈动脉基础检查。',
    price: 459,
    tip: '近期有明显不适时请先就医。'
  },
  {
    id: 205,
    name: '骨密度检查',
    suitablePeople: '适合关注骨骼健康的人群',
    summary: '适合日常骨骼健康关注。',
    itemsText: '骨密度检测、基础问诊、健康建议。',
    price: 159,
    tip: '检查当天穿着方便活动的衣物。'
  }
]

function nowLabel() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute
}

function readList(key) {
  return getStorage(key, [])
}

function saveList(key, list) {
  setStorage(key, list)
}

function getInteractions() {
  return getStorage(STORAGE_KEYS.healthArticleInteractions, {})
}

function saveInteractions(map) {
  setStorage(STORAGE_KEYS.healthArticleInteractions, map)
}

function enrichArticle(item) {
  const interactions = getInteractions()
  const current = interactions[item.id] || {}
  return {
    id: item.id,
    category: item.category,
    title: item.title,
    summary: item.summary,
    content: item.content,
    readMinutes: item.readMinutes,
    publishedAt: item.publishedAt,
    warmTip: item.warmTip,
    isFavorite: !!current.isFavorite,
    isRead: !!current.isRead
  }
}

export async function getDiscomfortOptions() {
  if (USE_MOCK_API) {
    return symptomTemplates
  }
  try {
    const response = await get('/health/symptoms/options')
    return response.data
  } catch (error) {
    return symptomTemplates
  }
}

export async function submitDiscomfortQuery(payload) {
  const requestData = {
    symptomType: payload.symptomType || payload.symptom || '',
    detail: payload.detail || ''
  }
  if (USE_MOCK_API) {
    const template = symptomTemplates.find(function(item) {
      return item.value === requestData.symptomType
    })
    const record = {
      id: Date.now(),
      symptomType: requestData.symptomType,
      symptom: requestData.symptomType,
      detail: requestData.detail,
      suggestion: template ? template.suggestion : '请先休息，注意观察变化。',
      precautions: template ? template.precautions : '如持续不适，请及时就医。',
      dietTip: template ? template.dietTip : '饮食尽量清淡一些。',
      doctorTip: template ? template.doctorTip : '如持续不适，请及时就医。',
      createdAt: nowLabel(),
      referenceTip: '仅供日常参考，如身体持续不适请及时就医。'
    }
    const list = readList(STORAGE_KEYS.discomfortLogs)
    saveList(STORAGE_KEYS.discomfortLogs, [record].concat(list))
    setStorage(STORAGE_KEYS.lastAdvice, record.suggestion)
    setStorage('silver_last_symptom_result', record)
    return record
  }
  const response = await post('/health/symptoms/query', requestData)
  if (response && response.data) {
    setStorage('silver_last_symptom_result', response.data)
  }
  return response.data
}

export async function getDiscomfortLogs() {
  if (USE_MOCK_API) {
    return readList(STORAGE_KEYS.discomfortLogs)
  }
  try {
    const response = await get('/health/symptoms/history')
    return response.data
  } catch (error) {
    return readList(STORAGE_KEYS.discomfortLogs)
  }
}

export async function getDiscomfortRecordDetail(id) {
  const lastRecord = getStorage('silver_last_symptom_result', null)
  if (lastRecord && String(lastRecord.id) === String(id)) {
    return lastRecord
  }
  const list = await getDiscomfortLogs()
  const match = list.find(function(item) {
    return String(item.id) === String(id)
  })
  return match || lastRecord || null
}

export async function getMedicationReminders() {
  if (USE_MOCK_API) {
    return readList(STORAGE_KEYS.medicationReminders)
  }
  try {
    const response = await get('/health/reminders')
    return response.data
  } catch (error) {
    return readList(STORAGE_KEYS.medicationReminders)
  }
}

export async function createMedicationReminder(payload) {
  if (USE_MOCK_API) {
    const list = readList(STORAGE_KEYS.medicationReminders)
    const item = {
      id: Date.now(),
      medicineName: payload.medicineName,
      dosage: payload.dosage || '',
      time: payload.time,
      frequency: payload.frequency,
      notes: payload.notes || '',
      createdAt: nowLabel()
    }
    saveList(STORAGE_KEYS.medicationReminders, [item].concat(list))
    return item
  }
  const response = await post('/health/reminders', payload)
  return response.data
}

export async function updateMedicationReminder(id, payload) {
  if (USE_MOCK_API) {
    const list = readList(STORAGE_KEYS.medicationReminders).map(function(item) {
      if (String(item.id) === String(id)) {
        return {
          ...item,
          medicineName: payload.medicineName,
          dosage: payload.dosage || '',
          time: payload.time,
          frequency: payload.frequency,
          notes: payload.notes || ''
        }
      }
      return item
    })
    saveList(STORAGE_KEYS.medicationReminders, list)
    return true
  }
  const response = await put('/health/reminders/' + id, payload)
  return response.data
}

export async function deleteMedicationReminder(id) {
  if (USE_MOCK_API) {
    const list = readList(STORAGE_KEYS.medicationReminders).filter(function(item) {
      return String(item.id) !== String(id)
    })
    saveList(STORAGE_KEYS.medicationReminders, list)
    return true
  }
  const response = await del('/health/reminders/' + id)
  return response.data
}

export async function getHealthKnowledgeCategories() {
  if (USE_MOCK_API) {
    return knowledgeCategories
  }
  try {
    const response = await get('/health/knowledge/categories')
    return response.data
  } catch (error) {
    return knowledgeCategories
  }
}

export async function getHealthArticles(params = {}) {
  const page = params.page || 1
  const pageSize = params.pageSize || 5
  const category = params.category || ''
  const keyword = params.keyword || ''

  if (USE_MOCK_API) {
    let list = knowledgeArticles.slice()
    if (category && category !== '全部') {
      list = list.filter(function(item) {
        return item.category === category
      })
    }
    if (keyword) {
      list = list.filter(function(item) {
        return item.title.indexOf(keyword) > -1 || item.summary.indexOf(keyword) > -1
      })
    }
    const total = list.length
    const currentList = list.slice((page - 1) * pageSize, page * pageSize).map(enrichArticle)
    return {
      list: currentList,
      pagination: {
        page,
        pageSize,
        total,
        hasMore: page * pageSize < total
      }
    }
  }
  try {
    const response = await get('/health/knowledge/articles', {
      page,
      page_size: pageSize,
      category,
      keyword
    })
    return response.data
  } catch (error) {
    return {
      list: knowledgeArticles.map(enrichArticle),
      pagination: {
        page: 1,
        pageSize,
        total: knowledgeArticles.length,
        hasMore: false
      }
    }
  }
}

export async function getHealthArticleDetail(id) {
  if (USE_MOCK_API) {
    const detail = knowledgeArticles.find(function(item) {
      return String(item.id) === String(id)
    })
    return enrichArticle(detail || knowledgeArticles[0])
  }
  const response = await get('/health/knowledge/articles/' + id)
  return response.data
}

export async function updateHealthArticleAction(id, payload) {
  if (USE_MOCK_API) {
    const interactions = getInteractions()
    const current = interactions[id] || {}
    if (payload.action === 'favorite') {
      current.isFavorite = !!payload.value
    }
    if (payload.action === 'read') {
      current.isRead = true
      current.lastReadAt = nowLabel()
    }
    interactions[id] = current
    saveInteractions(interactions)
    return current
  }
  const response = await post('/health/knowledge/articles/' + id + '/action', payload)
  return response.data
}

export async function getOutpatientDepartments() {
  if (USE_MOCK_API) {
    return outpatientDepartments
  }
  try {
    const response = await get('/health/outpatient/departments')
    return response.data
  } catch (error) {
    return outpatientDepartments
  }
}

export async function getOutpatientDoctors(params = {}) {
  if (USE_MOCK_API) {
    const departmentId = params.departmentId || ''
    let list = outpatientDoctors.slice()
    if (departmentId) {
      list = list.filter(function(item) {
        return String(item.departmentId) === String(departmentId)
      })
    }
    return list
  }
  try {
    const response = await get('/health/outpatient/doctors', {
      department_id: params.departmentId || ''
    })
    return response.data
  } catch (error) {
    return outpatientDoctors
  }
}

export async function createOutpatientAppointment(payload) {
  if (USE_MOCK_API) {
    const list = readList(STORAGE_KEYS.outpatientAppointments)
    const item = {
      id: Date.now(),
      name: payload.name,
      phone: payload.phone,
      patientName: payload.patientName,
      departmentName: payload.departmentName,
      doctorName: payload.doctorName,
      date: payload.date,
      timeSlot: payload.timeSlot,
      notes: payload.notes || '',
      status: '已预约',
      createdAt: nowLabel()
    }
    saveList(STORAGE_KEYS.outpatientAppointments, [item].concat(list))
    return item
  }
  const response = await post('/health/outpatient/appointments', payload)
  return response.data
}

export async function getOutpatientAppointments() {
  if (USE_MOCK_API) {
    return readList(STORAGE_KEYS.outpatientAppointments)
  }
  try {
    const response = await get('/health/outpatient/appointments')
    return response.data
  } catch (error) {
    return readList(STORAGE_KEYS.outpatientAppointments)
  }
}

export async function getCheckupPackages() {
  if (USE_MOCK_API) {
    return checkupPackages
  }
  try {
    const response = await get('/health/checkups/packages')
    return response.data
  } catch (error) {
    return checkupPackages
  }
}

export async function getCheckupPackageDetail(id) {
  if (USE_MOCK_API) {
    return checkupPackages.find(function(item) {
      return String(item.id) === String(id)
    })
  }
  const response = await get('/health/checkups/packages/' + id)
  return response.data
}

export async function createCheckupAppointment(payload) {
  if (USE_MOCK_API) {
    const list = readList(STORAGE_KEYS.checkupAppointments)
    const item = {
      id: Date.now(),
      name: payload.name,
      phone: payload.phone,
      packageName: payload.packageName,
      date: payload.date,
      timeSlot: payload.timeSlot,
      notes: payload.notes || '',
      status: '已预约',
      createdAt: nowLabel()
    }
    saveList(STORAGE_KEYS.checkupAppointments, [item].concat(list))
    return item
  }
  const response = await post('/health/checkups/appointments', payload)
  return response.data
}

export async function getCheckupAppointments() {
  if (USE_MOCK_API) {
    return readList(STORAGE_KEYS.checkupAppointments)
  }
  try {
    const response = await get('/health/checkups/appointments')
    return response.data
  } catch (error) {
    return readList(STORAGE_KEYS.checkupAppointments)
  }
}

export async function getHealthProfile() {
  if (USE_MOCK_API) {
    const reminders = readList(STORAGE_KEYS.medicationReminders)
    const logs = readList(STORAGE_KEYS.discomfortLogs)
    const outpatient = readList(STORAGE_KEYS.outpatientAppointments)
    const checkups = readList(STORAGE_KEYS.checkupAppointments)
    const interactions = getInteractions()
    const readIds = Object.keys(interactions).filter(function(key) {
      return interactions[key] && interactions[key].isRead
    })
    const recentArticles = readIds.slice().reverse().slice(0, 3).map(function(id) {
      const article = knowledgeArticles.find(function(item) {
        return String(item.id) === String(id)
      })
      const current = interactions[id] || {}
      return {
        articleId: Number(id),
        title: article ? article.title : '健康知识',
        lastReadAt: current.lastReadAt || nowLabel()
      }
    })
    return {
      latestAdvice: getStorage(STORAGE_KEYS.lastAdvice, '暂无健康建议，您可以先做一次身体不适查询。'),
      medicationCount: reminders.length,
      discomfortCount: logs.length,
      knowledgeReadCount: readIds.length,
      outpatientCount: outpatient.length,
      checkupCount: checkups.length,
      summary: reminders.length ? '您已添加用药提醒，按时查看更安心。' : '当前还没有用药提醒，可按需要添加。',
      recentDiscomforts: logs.slice(0, 3),
      recentArticles
    }
  }
  const response = await get('/health/profile')
  return response.data
}