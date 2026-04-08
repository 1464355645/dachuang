import { formatDateLabel, getWeekdayLabel } from '../utils/format'

export const mockReminder = {
  date: formatDateLabel(),
  weekday: getWeekdayLabel(),
  weather: '晴',
  temperature: '24°C',
  dressingTip: '温度舒适，出门带一件薄外套更安心。',
  notice: '今天记得按时吃药，下午可以散步 20 分钟。',
  items: ['今天有 2 条用药提醒', '社区活动：手机使用小课堂'],
  greeting: '王阿姨，今天也要轻松一点。'
}

export const mockVideos = [
  {
    id: 1,
    title: '舒缓拉伸 5 分钟',
    category: '养生视频',
    coverUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  {
    id: 2,
    title: '广场舞基础跟练',
    category: '广场舞',
    coverUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4'
  },
  {
    id: 3,
    title: '手机扫码教学',
    category: '教学视频',
    coverUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  }
]

export const mockVoiceGreeting = {
  text: '您好，欢迎使用银龄通。今天也别忘了按时休息和喝水。',
  audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
}

export const mockUser = {
  id: 1,
  nickname: '王阿姨',
  avatarUrl: '',
  age: 67,
  phone: '13800000000',
  city: '南京市'
}

export const discomfortOptions = [
  { value: '头痛', advice: '请先注意休息，补充水分。若持续头痛，请及时就医。' },
  { value: '咳嗽', advice: '注意保暖，多喝温水。若咳嗽一周以上，请及时检查。' },
  { value: '失眠', advice: '睡前少看手机，保持安静环境。长期失眠建议就医。' },
  { value: '血压偏高', advice: '注意休息并按时监测血压。若持续偏高，请尽快就医。' },
  { value: '头晕', advice: '先坐下休息，避免突然起身。若频繁发生，请及时就医。' },
  { value: '胃不舒服', advice: '饮食宜清淡，避免生冷刺激。若持续不适，请咨询医生。' },
  { value: '关节酸痛', advice: '注意保暖，不要过度活动。若明显肿痛，请及时检查。' },
  { value: '眼睛干涩', advice: '少看手机，多眨眼休息。若影响视力，请尽快检查。' }
]

export const mockHealthArticles = [
  {
    id: 1,
    category: '慢病护理',
    title: '高血压日常饮食提醒',
    summary: '少盐、规律作息、按时测量血压。',
    content: '高血压人群建议饮食清淡，减少高盐食物摄入。每天保持规律休息，避免情绪波动，按医生建议监测血压。',
    isFavorite: false,
    isRead: false,
    isRecommended: true,
    viewCount: 12
  },
  {
    id: 2,
    category: '睡眠健康',
    title: '晚上睡不着怎么办',
    summary: '睡前少喝浓茶咖啡，保持卧室安静。',
    content: '晚饭不宜过饱，睡前 1 小时尽量少看手机。可以听轻音乐、泡脚，帮助身体放松。连续失眠建议及时咨询医生。',
    isFavorite: false,
    isRead: false,
    isRecommended: true,
    viewCount: 20
  },
  {
    id: 3,
    category: '用药常识',
    title: '按时吃药的重要性',
    summary: '固定时间服药，有助于稳定病情。',
    content: '药物需要在医生建议下规律使用，不要自行增减剂量。漏服后如不确定是否补服，应先咨询医生或药师。',
    isFavorite: true,
    isRead: true,
    isRecommended: false,
    viewCount: 18
  },
  {
    id: 4,
    category: '运动保健',
    title: '适合老年人的轻运动',
    summary: '散步、拉伸、八段锦都适合。',
    content: '每天进行适量轻运动，有助于保持肌肉力量和关节灵活。运动前后适当补水，身体不适时及时停止。',
    isFavorite: false,
    isRead: false,
    isRecommended: false,
    viewCount: 8
  },
  {
    id: 5,
    category: '饮食提醒',
    title: '天气转暖也要记得补水',
    summary: '少量多次喝水，更适合老年人。',
    content: '天气变化时，身体更容易忽略口渴信号。建议在早上、午后和晚饭后都补充一些温水。',
    isFavorite: false,
    isRead: false,
    isRecommended: false,
    viewCount: 6
  }
]

export const mockStudyCategories = [
  { name: '常用软件教程', recommendedCount: 1 },
  { name: '养生攻略', recommendedCount: 1 },
  { name: '普法栏目', recommendedCount: 0 },
  { name: '每日新闻', recommendedCount: 0 },
  { name: '反诈防骗', recommendedCount: 1 }
]

export const mockStudyContents = [
  {
    id: 101,
    category: '常用软件教程',
    title: '微信语音和视频通话怎么用',
    summary: '学会和家人更方便联系。',
    durationMinutes: 8,
    content: '打开微信，进入家人的聊天窗口，点击通话按钮，就可以选择语音或视频通话。网络不好时建议先用语音。',
    isRecommended: true
  },
  {
    id: 102,
    category: '养生攻略',
    title: '日常饮食怎么更均衡',
    summary: '主食、蔬菜、蛋白质要搭配。',
    durationMinutes: 6,
    content: '每天三餐尽量规律，多吃蔬菜水果，少吃过甜、过咸食物。喝水要少量多次。',
    isRecommended: true
  },
  {
    id: 103,
    category: '普法栏目',
    title: '遇到消费纠纷怎么办',
    summary: '保留凭证，先协商，再求助。',
    durationMinutes: 7,
    content: '消费后保留票据和付款记录，出现问题时先与商家协商，必要时求助消费者协会。',
    isRecommended: false
  },
  {
    id: 104,
    category: '每日新闻',
    title: '今日社区便民信息',
    summary: '了解周边服务和天气变化。',
    durationMinutes: 5,
    content: '今天社区活动中心下午有健康讲座，附近菜市场部分摊位有惠民优惠，出门前请留意天气变化。',
    isRecommended: false
  },
  {
    id: 105,
    category: '反诈防骗',
    title: '接到陌生电话先别急着转账',
    summary: '不轻信，不透露，不转账。',
    durationMinutes: 9,
    content: '凡是让你先转账、先提供验证码的电话，都要提高警惕。拿不准时，可以先联系家人或社区工作人员。',
    isRecommended: true
  }
]

export const mockActivities = [
  {
    id: 1,
    title: '社区八段锦晨练',
    purpose: '一起锻炼身体',
    time: '2026-04-08 08:00',
    location: '社区广场',
    peopleCount: 20,
    description: '适合中老年人参加，动作舒缓。',
    publisherName: '社区服务站',
    auditStatus: 'approved',
    status: 'open',
    enrolledCount: 6,
    isSignedUp: false
  },
  {
    id: 2,
    title: '手机使用小课堂',
    purpose: '一起学会常用手机功能',
    time: '2026-04-09 15:00',
    location: '社区服务中心二楼',
    peopleCount: 30,
    description: '教大家使用微信、扫码和常见便民功能。',
    publisherName: '社区服务站',
    auditStatus: 'approved',
    status: 'open',
    enrolledCount: 12,
    isSignedUp: true
  }
]

export const mockLifeRecords = [
  {
    id: 1,
    recordType: 'ledger',
    serviceName: '',
    title: '买菜',
    amount: 36.5,
    eventDate: '2026-04-07',
    remark: '早市采购',
    status: 'done',
    createdAt: '2026-04-07 09:10'
  }
]

export const mockCommunityAnnouncements = [
  {
    id: 1,
    title: '社区公告：本周义诊和健康讲座安排',
    content: '周五上午9点社区服务中心有义诊，下午3点有健康讲座，请提前到场。',
    publishedAt: '2026-04-08 08:00'
  }
]

export const mockCommunityCircles = [
  { id: 1, name: '健康养生圈', activeCount: 238, hotPost: '春季养生怎么吃更舒服' },
  { id: 2, name: '老年运动圈', activeCount: 184, hotPost: '八段锦每天坚持的感受' },
  { id: 3, name: '学习互助圈', activeCount: 152, hotPost: '手机支付常见问题' },
  { id: 4, name: '娱乐兴趣圈', activeCount: 201, hotPost: '合唱团招募新成员' }
]

export const mockCommunityPosts = [
  {
    id: 101,
    author: '王阿姨',
    avatar: '',
    circle: '健康养生圈',
    title: '今天做了清淡早餐',
    content: '早上做了南瓜粥和鸡蛋，清淡又有营养，胃口舒服多了。',
    images: [],
    videoUrl: '',
    createdAt: '2026-04-08 07:40',
    likeCount: 12,
    commentCount: 3,
    collectCount: 4,
    isLiked: false,
    isCollected: false,
    tags: ['饮食', '清淡']
  },
  {
    id: 102,
    author: '李叔叔',
    avatar: '',
    circle: '老年运动圈',
    title: '坚持散步的第30天',
    content: '每天饭后散步30分钟，精神好了不少，晚上睡得更踏实。',
    images: [],
    videoUrl: '',
    createdAt: '2026-04-08 09:10',
    likeCount: 18,
    commentCount: 5,
    collectCount: 6,
    isLiked: true,
    isCollected: false,
    tags: ['运动', '习惯']
  },
  {
    id: 103,
    author: '社区管理员',
    avatar: '',
    circle: '学习互助圈',
    title: '手机挂号小技巧',
    content: '不会线上挂号的叔叔阿姨可以留言，我来教大家一步步操作。',
    images: [],
    videoUrl: '',
    createdAt: '2026-04-07 18:20',
    likeCount: 25,
    commentCount: 8,
    collectCount: 11,
    isLiked: false,
    isCollected: true,
    tags: ['学习', '服务']
  },
  {
    id: 104,
    author: '赵阿姨',
    avatar: '',
    circle: '娱乐兴趣圈',
    title: '广场舞新队形',
    content: '昨晚排了新队形，大家节奏很整齐，期待下一次一起跳。',
    images: [],
    videoUrl: '',
    createdAt: '2026-04-07 20:35',
    likeCount: 9,
    commentCount: 2,
    collectCount: 1,
    isLiked: false,
    isCollected: false,
    tags: ['娱乐', '社交']
  }
]

export const mockCommunityQa = [
  {
    id: 201,
    question: '手机声音突然变小怎么办？',
    answer: '可以先检查音量键和设置里的铃声音量，也可以重启手机。',
    responder: '志愿者小张',
    tags: ['手机', '使用']
  },
  {
    id: 202,
    question: '腿脚酸痛还能散步吗？',
    answer: '可以适量散步，但注意保暖和休息，疼痛明显时请咨询医生。',
    responder: '社区护士',
    tags: ['健康', '运动']
  }
]

export const mockCommunityRecommendations = [
  {
    id: 301,
    type: 'post',
    title: '饭后简单拉伸三分钟',
    desc: '适合餐后舒展，减轻腿部酸胀。',
    targetId: 102
  },
  {
    id: 302,
    type: 'activity',
    title: '手工折纸小课堂',
    desc: '动手动脑，轻松交友。',
    targetId: 2
  }
]

export const mockCommunityWeather = {
  city: '南京',
  weather: '晴',
  temperature: '23~27°C',
  airQuality: '良',
  uvIndex: '中等',
  dressingTip: '早晚微凉，外出带薄外套。',
  outdoorTip: '空气不错，适合散步。'
}

export const mockCommunityHealthTips = {
  summary: '今天记得补水、轻运动、按时用药。',
  tips: ['上午喝水 2 杯', '午后散步 20 分钟', '晚饭后按时服药', '记得午休 20 分钟']
}

export const mockCommunityCheckin = {
  date: formatDateLabel(),
  points: 128,
  todayChecked: false,
  reward: 5
}
