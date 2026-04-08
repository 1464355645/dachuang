import { USE_MOCK_API, STORAGE_KEYS } from '../utils/config'
import { getStorage, setStorage } from '../utils/storage'
import { get, post } from './request'

const videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4'
const imageUrl = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'

const learningModules = [
  {
    name: '常用软件教程',
    icon: '软',
    desc: '学会微信、支付宝、手机银行等常用软件',
    categories: ['微信', '支付宝', '手机银行', '视频软件', '地图导航']
  },
  {
    name: '养生攻略',
    icon: '养',
    desc: '看饮食、运动、睡眠这些日常内容',
    categories: ['饮食', '运动', '心理', '睡眠', '慢病调养']
  },
  {
    name: '普法栏目',
    icon: '法',
    desc: '看看和生活关系大的法律知识',
    categories: ['民法', '老年权益', '合同', '财产保护', '消费维权']
  },
  {
    name: '每日新闻',
    icon: '闻',
    desc: '每天用简明方式看看新闻摘要',
    categories: ['国内', '国际', '社区', '健康', '生活']
  },
  {
    name: '反诈防骗',
    icon: '防',
    desc: '多看案例，少上当，少受骗',
    categories: ['电话诈骗', '短信诈骗', '上门诈骗', '网络诈骗', '保健品骗局']
  }
]

const learningContents = [
  { id: 1001, module: '常用软件教程', category: '微信', title: '如何发朋友圈', summary: '简单三步教您发朋友圈。', content: '步骤1：打开微信，点击底部“发现”。\n步骤2：点“朋友圈”，再点右上角相机图标。\n步骤3：选择照片，写一句话，点“发表”。', mediaType: 'video', mediaUrl: videoUrl, duration: 5, difficulty: '基础', publishDate: '2026-04-01', isRecommended: true },
  { id: 1002, module: '常用软件教程', category: '微信', title: '怎么和家人视频通话', summary: '点两下就能和家人面对面聊天。', content: '打开家人的聊天页面，点右下角加号，再点“视频通话”。如果网络不稳，可以先用语音通话。', mediaType: 'video', mediaUrl: videoUrl, duration: 6, difficulty: '基础', publishDate: '2026-04-02', isRecommended: false },
  { id: 1003, module: '常用软件教程', category: '支付宝', title: '支付宝里怎么扫码付款', summary: '出门买菜买药时常会用到。', content: '打开支付宝，点击首页“付钱”或“收钱”，把二维码给商家扫一扫即可。付款前先看清金额。', mediaType: 'image', mediaUrl: imageUrl, duration: 4, difficulty: '基础', publishDate: '2026-04-03', isRecommended: true },
  { id: 1004, module: '常用软件教程', category: '手机银行', title: '怎么查看银行卡余额', summary: '在手机银行里快速查看余额。', content: '打开手机银行，登录后在首页找到“我的账户”。点击后可以查看余额和最近交易记录。', mediaType: 'image', mediaUrl: imageUrl, duration: 5, difficulty: '基础', publishDate: '2026-04-04', isRecommended: false },
  { id: 1005, module: '常用软件教程', category: '视频软件', title: '怎么搜索广场舞视频', summary: '学会搜索，更容易找到想看的内容。', content: '打开视频软件，在顶部搜索框输入“广场舞”或具体老师名字，再点搜索。点进去前先看时长和标题。', mediaType: 'video', mediaUrl: videoUrl, duration: 5, difficulty: '基础', publishDate: '2026-04-05', isRecommended: false },
  { id: 1101, module: '养生攻略', category: '饮食', title: '三种适合老人的早餐', summary: '简单、营养、做法也不复杂。', content: '可以选择鸡蛋配牛奶、清粥配小菜、杂粮面包配豆浆。早餐尽量少油，吃到七八分饱更舒服。', mediaType: 'image', mediaUrl: imageUrl, duration: 5, difficulty: '基础', publishDate: '2026-04-01', isRecommended: true },
  { id: 1102, module: '养生攻略', category: '运动', title: '每天散步多长时间合适', summary: '轻运动更适合长期坚持。', content: '一般可以从每天 15 到 20 分钟开始，慢慢增加到 30 分钟。以不累、不喘为宜，天气太热或太冷时注意减少外出。', mediaType: 'video', mediaUrl: videoUrl, duration: 4, difficulty: '基础', publishDate: '2026-04-02', isRecommended: false },
  { id: 1103, module: '养生攻略', category: '睡眠', title: '晚上睡不好怎么办', summary: '少看手机，睡前让自己慢下来。', content: '晚饭不要太晚，睡前少刷手机。房间保持安静，睡前可以泡脚、听轻音乐，让自己慢慢放松。', mediaType: 'text', mediaUrl: '', duration: 5, difficulty: '基础', publishDate: '2026-04-03', isRecommended: true },
  { id: 1104, module: '养生攻略', category: '心理', title: '心情烦闷时可以怎么调节', summary: '聊一聊、走一走，会舒服一些。', content: '可以和家人朋友聊聊天，也可以出门晒晒太阳、慢慢散步。遇到烦心事不要憋着，适当说出来会更好。', mediaType: 'text', mediaUrl: '', duration: 4, difficulty: '基础', publishDate: '2026-04-04', isRecommended: false },
  { id: 1105, module: '养生攻略', category: '慢病调养', title: '高血压日常饮食提醒', summary: '少盐、规律、按时测量很重要。', content: '饮食尽量清淡，减少腌制食品。每天固定时间测量血压，按医生建议规律服药，不要自己随意停药。', mediaType: 'image', mediaUrl: imageUrl, duration: 6, difficulty: '基础', publishDate: '2026-04-05', isRecommended: false },
  { id: 1201, module: '普法栏目', category: '老年权益', title: '遇到养老诈骗怎么办', summary: '先别转账，再联系家人和社区。', content: '对方如果一上来就催您转账、保密、不要告诉家人，先提高警惕。保存通话和短信记录，及时联系家人和社区工作人员。', mediaType: 'text', mediaUrl: '', duration: 6, difficulty: '基础', publishDate: '2026-04-01', isRecommended: true },
  { id: 1202, module: '普法栏目', category: '民法', title: '借钱给别人要留什么凭证', summary: '口头说不清，留凭证更稳妥。', content: '借钱时最好写借条，写清金额、日期、借款人和还款时间。转账记录、聊天记录也要保留好。', mediaType: 'text', mediaUrl: '', duration: 5, difficulty: '基础', publishDate: '2026-04-02', isRecommended: false },
  { id: 1203, module: '普法栏目', category: '合同', title: '签字前要先看哪些内容', summary: '金额、时间、违约责任都要看清。', content: '签字前先看合同内容是否完整，重点看金额、服务内容、时间和违约责任。看不懂时先问清楚，不要急着签。', mediaType: 'image', mediaUrl: imageUrl, duration: 4, difficulty: '基础', publishDate: '2026-04-03', isRecommended: false },
  { id: 1204, module: '普法栏目', category: '财产保护', title: '银行卡和验证码不能随便给别人', summary: '防止财产受损，先守住信息。', content: '银行卡号、验证码、支付密码都不要随便告诉别人。凡是索要验证码的电话或短信，都要格外小心。', mediaType: 'text', mediaUrl: '', duration: 5, difficulty: '基础', publishDate: '2026-04-04', isRecommended: true },
  { id: 1205, module: '普法栏目', category: '消费维权', title: '买到问题商品怎么维权', summary: '发票和付款记录一定要留好。', content: '发现商品有问题时，先和商家沟通。保留发票、付款记录、聊天记录，必要时可以向消费者协会反映。', mediaType: 'text', mediaUrl: '', duration: 4, difficulty: '基础', publishDate: '2026-04-05', isRecommended: false },
  { id: 1301, module: '每日新闻', category: '国内', title: '今日国内新闻摘要', summary: '用简单几句话带您看重点。', content: '今天国内多地继续推进便民服务升级，社区养老、出行和健康服务成为关注重点。各地也在持续开展反诈宣传活动。', mediaType: 'text', mediaUrl: '', duration: 3, difficulty: '基础', publishDate: '2026-04-07', isRecommended: true },
  { id: 1302, module: '每日新闻', category: '国际', title: '今日国际简讯', summary: '快速了解几条国际动态。', content: '今天国际新闻主要集中在经济合作、民生政策和公共健康议题。内容以简报形式整理，便于快速查看。', mediaType: 'text', mediaUrl: '', duration: 3, difficulty: '基础', publishDate: '2026-04-07', isRecommended: false },
  { id: 1303, module: '每日新闻', category: '社区', title: '社区便民消息', summary: '看看社区今天有哪些新安排。', content: '今天社区活动中心下午有手机使用课堂，明天上午有健康讲座。便民服务窗口将延长半小时服务时间。', mediaType: 'text', mediaUrl: '', duration: 2, difficulty: '基础', publishDate: '2026-04-07', isRecommended: true },
  { id: 1304, module: '每日新闻', category: '健康', title: '健康新闻提醒', summary: '近期天气变化大，注意保暖和作息。', content: '近期天气变化较快，早晚温差明显。建议老年朋友根据天气增减衣物，保持规律作息，适度运动。', mediaType: 'text', mediaUrl: '', duration: 2, difficulty: '基础', publishDate: '2026-04-07', isRecommended: false },
  { id: 1305, module: '每日新闻', category: '生活', title: '生活服务新动态', summary: '便民缴费和办事入口更方便了。', content: '本周多项便民服务入口做了适老化调整，页面文字更大、步骤更少，方便老年朋友自己操作。', mediaType: 'text', mediaUrl: '', duration: 2, difficulty: '基础', publishDate: '2026-04-07', isRecommended: false },
  { id: 1401, module: '反诈防骗', category: '电话诈骗', title: '冒充公检法电话诈骗', summary: '听到“涉嫌案件”先别慌，更别转账。', content: '案例：对方冒充公检法人员，要求您把钱转到“安全账户”。防范建议：真正的公安机关不会电话要求转账，也不会让您保密。', mediaType: 'text', mediaUrl: '', duration: 5, difficulty: '基础', publishDate: '2026-04-01', isRecommended: true },
  { id: 1402, module: '反诈防骗', category: '短信诈骗', title: '收到中奖短信不要急着点链接', summary: '看见陌生链接先停一下。', content: '案例：短信称您中奖或账户异常，要求点击链接。防范建议：不要点不明链接，不要输入银行卡和验证码。', mediaType: 'text', mediaUrl: '', duration: 4, difficulty: '基础', publishDate: '2026-04-02', isRecommended: false },
  { id: 1403, module: '反诈防骗', category: '上门诈骗', title: '上门推销高价保健品要小心', summary: '先问家人，不要现场冲动付款。', content: '案例：有人上门推销高价保健品，夸大效果。防范建议：先和家人商量，不轻信“包治百病”这类说法。', mediaType: 'text', mediaUrl: '', duration: 4, difficulty: '基础', publishDate: '2026-04-03', isRecommended: true },
  { id: 1404, module: '反诈防骗', category: '网络诈骗', title: '网上低价购物也要防诈骗', summary: '价格过低时，多半要多留个心眼。', content: '案例：对方在聊天软件里卖低价商品，付款后拉黑。防范建议：尽量在正规平台交易，不私下转账。', mediaType: 'text', mediaUrl: '', duration: 4, difficulty: '基础', publishDate: '2026-04-04', isRecommended: false },
  { id: 1405, module: '反诈防骗', category: '保健品骗局', title: '免费体检后推销高价产品要警惕', summary: '先冷静，不要被“优惠”催着买。', content: '案例：先免费体检，再推荐高价产品。防范建议：先了解清楚产品信息，不轻易当场付款。', mediaType: 'text', mediaUrl: '', duration: 5, difficulty: '基础', publishDate: '2026-04-05', isRecommended: true }
]

function getLocalRecords() {
  return getStorage(STORAGE_KEYS.studyRecords, [])
}

function saveLocalRecords(records) {
  setStorage(STORAGE_KEYS.studyRecords, records)
}

function getDateTimeLabel(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute
}

function getTodayLabel(date = new Date()) {
  return getDateTimeLabel(date).slice(0, 10)
}

function getModuleMeta(name) {
  return learningModules.find((item) => item.name === name) || null
}

function getContentById(id) {
  return learningContents.find((item) => String(item.id) === String(id)) || null
}

function ensureRecord(contentId) {
  const records = getLocalRecords()
  let record = records.find((item) => item.contentId === Number(contentId))
  if (!record) {
    record = { contentId: Number(contentId), progress: 0, status: 'not_started', isFavorite: false, isRead: false, lastViewedAt: '' }
    records.unshift(record)
    saveLocalRecords(records)
  }
  return record
}

function updateLocalRecord(contentId, patch = {}) {
  const records = getLocalRecords()
  let record = records.find((item) => item.contentId === Number(contentId))
  if (!record) {
    record = { contentId: Number(contentId), progress: 0, status: 'not_started', isFavorite: false, isRead: false, lastViewedAt: '' }
    records.unshift(record)
  }
  Object.assign(record, patch)
  if (patch.progress !== undefined || patch.isRead || patch.status) {
    record.lastViewedAt = getDateTimeLabel(new Date())
  }
  saveLocalRecords(records)
  return record
}

function mergeContent(content) {
  const records = getLocalRecords()
  const record = records.find((item) => item.contentId === content.id)
  return {
    ...content,
    progress: record ? record.progress : 0,
    status: record ? record.status : 'not_started',
    isFavorite: record ? !!record.isFavorite : false,
    isRead: record ? !!record.isRead : false
  }
}

function getTodayRecommendationFromList() {
  const dayNumber = Number(getTodayLabel().slice(-2))
  const index = dayNumber % learningContents.length
  return mergeContent(learningContents[index])
}

function buildArchive(records) {
  const completedRecords = records.filter((item) => item.status === 'completed')
  const readRecords = records.filter((item) => item.isRead)
  const favoriteRecords = records.filter((item) => item.isFavorite)
  const learnedIds = completedRecords.map((item) => item.contentId)
  const todayLabel = getTodayLabel()
  const weekStart = Date.now() - 7 * 24 * 60 * 60 * 1000

  const recentRecords = records
    .filter((item) => item.lastViewedAt)
    .slice()
    .sort((a, b) => new Date(b.lastViewedAt) - new Date(a.lastViewedAt))
    .slice(0, 6)
    .map((record) => {
      const content = getContentById(record.contentId)
      return {
        contentId: record.contentId,
        title: content ? content.title : '学习内容',
        module: content ? content.module : '学习服务',
        category: content ? content.category : '未分类',
        lastViewedAt: record.lastViewedAt,
        status: record.status
      }
    })

  const recommendations = learningContents
    .filter((item) => learnedIds.indexOf(item.id) === -1)
    .filter((item) => item.isRecommended)
    .slice(0, 5)
    .map(mergeContent)

  const moduleStats = learningModules.map((item) => {
    const moduleContents = learningContents.filter((content) => content.module === item.name)
    const moduleIds = moduleContents.map((content) => content.id)
    const moduleRecords = records.filter((record) => moduleIds.indexOf(record.contentId) > -1)
    return {
      module: item.name,
      total: moduleContents.length,
      completed: moduleRecords.filter((record) => record.status === 'completed').length,
      readCount: moduleRecords.filter((record) => record.isRead).length,
      favoriteCount: moduleRecords.filter((record) => record.isFavorite).length
    }
  })

  const dailyProgress = records.filter((item) => (item.lastViewedAt || '').slice(0, 10) === todayLabel).length
  const weeklyProgress = records.filter((item) => item.lastViewedAt && new Date(item.lastViewedAt).getTime() >= weekStart).length

  return {
    learnedCount: completedRecords.length,
    readCount: readRecords.length,
    favoriteCount: favoriteRecords.length,
    recentRecords,
    recommendations,
    dailyProgress,
    weeklyProgress,
    moduleStats,
    todayRecommendation: getTodayRecommendationFromList()
  }
}

export async function getLearningModules() {
  if (USE_MOCK_API) {
    return learningModules
  }
  try {
    const response = await get('/learning/modules')
    return response.data
  } catch (error) {
    return learningModules
  }
}

export async function getLearningCategories(moduleName = '') {
  if (USE_MOCK_API) {
    if (!moduleName) {
      return []
    }
    const moduleMeta = getModuleMeta(moduleName)
    return moduleMeta ? moduleMeta.categories : []
  }
  try {
    const response = await get('/learning/categories', { module: moduleName })
    return response.data
  } catch (error) {
    const moduleMeta = getModuleMeta(moduleName)
    return moduleMeta ? moduleMeta.categories : []
  }
}

export async function getTodayRecommendation() {
  if (USE_MOCK_API) {
    return getTodayRecommendationFromList()
  }
  try {
    const response = await get('/learning/today')
    return response.data
  } catch (error) {
    return getTodayRecommendationFromList()
  }
}

export async function getLearningList(params = {}) {
  const page = params.page || 1
  const pageSize = params.pageSize || 6
  const moduleName = params.module || ''
  const category = params.category || ''
  const keyword = params.keyword || ''

  if (USE_MOCK_API) {
    let list = learningContents.slice()
    if (moduleName) {
      list = list.filter((item) => item.module === moduleName)
    }
    if (category) {
      list = list.filter((item) => item.category === category)
    }
    if (keyword) {
      list = list.filter((item) => item.title.indexOf(keyword) > -1 || item.summary.indexOf(keyword) > -1)
    }

    const total = list.length
    const currentList = list.slice((page - 1) * pageSize, page * pageSize).map(mergeContent)
    const categories = moduleName ? await getLearningCategories(moduleName) : []
    const unlearnedRecommended = list.map(mergeContent).filter((item) => item.isRecommended && item.status !== 'completed').slice(0, 4)

    return {
      list: currentList,
      categories,
      recommended: unlearnedRecommended,
      pagination: { page, pageSize, total, hasMore: page * pageSize < total }
    }
  }

  try {
    const response = await get('/learning/contents', { module: moduleName, category, keyword, page, page_size: pageSize })
    return response.data
  } catch (error) {
    return { list: [], categories: [], recommended: [], pagination: { page, pageSize, total: 0, hasMore: false } }
  }
}

export async function getLearningDetail(id) {
  if (USE_MOCK_API) {
    const detail = getContentById(id)
    return detail ? mergeContent(detail) : {}
  }
  try {
    const response = await get('/learning/contents/' + id)
    return response.data
  } catch (error) {
    const detail = getContentById(id)
    return detail ? mergeContent(detail) : {}
  }
}

export async function updateLearningAction(id, payload) {
  if (USE_MOCK_API) {
    if (payload.action === 'favorite') {
      const record = ensureRecord(id)
      return updateLocalRecord(id, { isFavorite: payload.value === undefined ? !record.isFavorite : !!payload.value })
    }
    if (payload.action === 'read') {
      const current = ensureRecord(id)
      return updateLocalRecord(id, { isRead: true, progress: Math.max(current.progress, 50), status: current.status === 'completed' ? 'completed' : 'reading' })
    }
    return ensureRecord(id)
  }
  const response = await post('/learning/contents/' + id + '/action', payload)
  return response.data
}

export async function saveStudyRecord(payload) {
  const nextStatus = payload.status || (payload.progress === 100 ? 'completed' : 'reading')
  if (USE_MOCK_API) {
    const current = ensureRecord(payload.contentId)
    updateLocalRecord(payload.contentId, { progress: payload.progress, status: nextStatus, isRead: payload.progress > 0 ? true : current.isRead })
    return true
  }
  try {
    await post('/learning/records', { contentId: payload.contentId, progress: payload.progress, status: nextStatus })
    return true
  } catch (error) {
    const current = ensureRecord(payload.contentId)
    updateLocalRecord(payload.contentId, { progress: payload.progress, status: nextStatus, isRead: payload.progress > 0 ? true : current.isRead })
    return true
  }
}

export async function getStudyArchive() {
  if (USE_MOCK_API) {
    return buildArchive(getLocalRecords())
  }
  try {
    const response = await get('/learning/archive')
    return response.data
  } catch (error) {
    return buildArchive(getLocalRecords())
  }
}