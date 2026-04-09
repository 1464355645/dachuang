<template>
  <view class="page-container">
    <view class="home-hero">
      <view class="page-title">您好，{{ user.nickname || '欢迎使用银龄通' }}</view>
      <view class="page-subtitle">今天也要轻松一点，社区里有很多新消息。</view>
    </view>

    <view class="search-row">
      <view class="search-box" @click="handleSearch">
        <text class="search-placeholder">搜索帖子、活动、问答</text>
      </view>
      <button class="voice-btn" @click="handleVoice">语音</button>
    </view>

    <section-card title="今日健康小贴士" subtitle="喝水、运动、按时用药" class="section-gap">
      <view class="health-card">
        <view class="health-summary">{{ healthTips.summary }}</view>
        <view class="health-list">
          <view v-for="(item, index) in healthTips.tips" :key="index" class="health-item">
            {{ index + 1 }}. {{ item }}
          </view>
        </view>
      </view>
    </section-card>

    <section-card title="天气与环境提醒" subtitle="外出建议一目了然" class="section-gap">
      <view class="weather-card">
        <view class="weather-row">
          <view>
            <view class="weather-city">{{ weather.city }}</view>
            <view class="weather-meta">{{ weather.weather }} · {{ weather.temperature }}</view>
          </view>
          <view class="weather-right">
            <view class="weather-tag">空气 {{ weather.airQuality }}</view>
            <view class="weather-tag">紫外线 {{ weather.uvIndex }}</view>
          </view>
        </view>
        <view class="weather-tip">穿衣建议：{{ weather.dressingTip }}</view>
        <view class="weather-tip">外出提醒：{{ weather.outdoorTip }}</view>
      </view>
    </section-card>

    <section-card title="服务快捷入口" subtitle="原有生活服务继续保留" class="section-gap">
      <feature-grid :items="serviceItems" @select="handleSelectEntry" />
    </section-card>

    <section-card title="我的常用" subtitle="个人资料和档案入口都在这里" class="section-gap">
      <feature-grid :items="profileItems" @select="handleSelectEntry" />
    </section-card>

    <section-card title="社区公告" subtitle="重要消息置顶" class="section-gap">
      <view v-if="announcements.length" class="announcement-card">
        <view class="announcement-title">{{ announcements[0].title }}</view>
        <view class="announcement-content">{{ announcements[0].content }}</view>
        <view class="announcement-time">{{ announcements[0].publishedAt }}</view>
      </view>
      <view v-else class="empty-text">暂无公告</view>
    </section-card>

    <section-card title="社区签到" subtitle="每天签到可得积分" class="section-gap">
      <view class="checkin-card">
        <view class="checkin-info">
          <view class="checkin-points">当前积分：{{ checkin.points }}</view>
          <view class="checkin-desc">签到奖励 +{{ checkin.reward }} 积分</view>
        </view>
        <button
          class="primary-btn"
          :disabled="checkin.todayChecked"
          @click="handleCheckin"
        >
          {{ checkin.todayChecked ? '今日已签到' : '一键签到' }}
        </button>
      </view>
    </section-card>

    <section-card title="兴趣圈" subtitle="加入圈子一起交流" class="section-gap">
      <view class="circle-grid">
        <view
          v-for="circle in circles"
          :key="circle.id"
          class="circle-item"
          @click="handleCircle(circle)"
        >
          <view class="circle-name">{{ circle.name }}</view>
          <view class="circle-meta">{{ circle.activeCount }} 人活跃</view>
          <view class="circle-hot">热帖：{{ circle.hotPost }}</view>
        </view>
      </view>
    </section-card>

    <section-card title="社区活动推荐" subtitle="一键报名参加" class="section-gap">
      <view v-if="activities.length">
        <view v-for="item in activities" :key="item.id" class="activity-card">
          <view class="activity-title">{{ item.title }}</view>
          <view class="activity-meta">时间：{{ item.time }}</view>
          <view class="activity-meta">地点：{{ item.location }}</view>
          <view class="activity-meta">名额：{{ item.peopleCount || '不限' }} | 已报名 {{ item.enrolledCount || 0 }} 人</view>
          <view class="activity-actions">
            <button
              class="secondary-btn"
              :disabled="item.isSignedUp"
              @click="handleActivitySignup(item)"
            >
              {{ item.isSignedUp ? '已报名' : '一键报名' }}
            </button>
            <button class="ghost-btn" @click="handleActivityMore">查看全部</button>
          </view>
        </view>
      </view>
      <view v-else class="empty-text">暂无活动</view>
    </section-card>

    <section-card title="问答互助" subtitle="热门问题精选" class="section-gap">
      <view v-if="qas.length">
        <view v-for="item in qas" :key="item.id" class="qa-card">
          <view class="qa-question">问：{{ item.question }}</view>
          <view class="qa-answer">答：{{ item.answer }}</view>
          <view class="qa-responder">回答：{{ item.responder }}</view>
        </view>
      </view>
      <view v-else class="empty-text">暂无问答</view>
    </section-card>

    <section-card title="社区动态" subtitle="新鲜分享实时看" class="section-gap">
      <view v-if="posts.length">
        <view v-for="post in posts" :key="post.id" class="post-card" @click="openPost(post)">
          <view class="post-header">
            <view class="post-author">{{ post.author }}</view>
            <view class="post-circle">{{ post.circle }}</view>
          </view>
          <view class="post-title">{{ post.title }}</view>
          <view class="post-content">{{ post.content }}</view>
          <view class="post-tags">
            <text v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</text>
          </view>
          <view class="post-actions">
            <button class="mini-btn" @click.stop="handleLike(post)">
              {{ post.isLiked ? '已点赞' : '点赞' }} {{ post.likeCount }}
            </button>
            <button class="mini-btn" @click.stop="handleCollect(post)">
              {{ post.isCollected ? '已收藏' : '收藏' }} {{ post.collectCount }}
            </button>
            <button class="mini-btn" @click.stop="openPost(post)">
              评论 {{ post.commentCount }}
            </button>
            <button class="mini-btn danger-text" @click.stop="handleReport(post)">
              举报
            </button>
          </view>
        </view>
      </view>
      <view v-else class="empty-text">暂无动态</view>
    </section-card>

    <section-card title="猜你喜欢" subtitle="根据兴趣推荐" class="section-gap">
      <view v-if="recommendations.length">
        <view v-for="item in recommendations" :key="item.id" class="recommend-card">
          <view class="recommend-title">{{ item.title }}</view>
          <view class="recommend-desc">{{ item.desc }}</view>
          <button class="secondary-btn" @click="handleRecommend(item)">去看看</button>
        </view>
      </view>
      <view v-else class="empty-text">暂无推荐</view>
    </section-card>

    <section-card title="常用入口" subtitle="一键进入常用功能" class="section-gap">
      <feature-grid :items="entryItems" @select="handleSelectEntry" />
    </section-card>

    <voice-assist-button />

    <view class="emergency-bar">
      <button class="emergency-btn" @click="handleEmergency">紧急呼救</button>
    </view>
  </view>
</template>

<script>
import SectionCard from '../../../components/common/SectionCard.vue'
import FeatureGrid from '../../../components/common/FeatureGrid.vue'
import VoiceAssistButton from '../../../components/common/VoiceAssistButton.vue'
import { getHomeReminder } from '../../../api/home'
import { getCurrentUser } from '../../../api/user'
import { getActivities, signupActivity } from '../../../api/activity'
import {
  getCommunityHomeData,
  reportCommunityContent,
  submitCommunityCheckin,
  toggleCommunityCollect,
  toggleCommunityLike
} from '../../../api/community-home'
import { saveReadablePayload } from '../../../utils/voice-reader'

export default {
  components: {
    SectionCard,
    FeatureGrid,
    VoiceAssistButton
  },
  data() {
    return {
      reminder: {
        greeting: '欢迎回来',
        date: '',
        weekday: '',
        weather: '',
        temperature: '',
        dressingTip: '',
        notice: '',
        items: []
      },
      user: {},
      healthTips: { summary: '', tips: [] },
      weather: {
        city: '',
        weather: '',
        temperature: '',
        airQuality: '',
        uvIndex: '',
        dressingTip: '',
        outdoorTip: ''
      },
      announcements: [],
      circles: [],
      posts: [],
      qas: [],
      recommendations: [],
      checkin: {
        points: 0,
        todayChecked: false,
        reward: 0
      },
      activities: [],
      serviceItems: [
        {
          title: '出行游玩',
          desc: '查路线、看出行服务',
          icon: '行',
          path: '/pages/service/travel/list/index'
        },
        {
          title: '网上办事',
          desc: '常用办事表单入口',
          icon: '办',
          path: '/pages/service/affair/form/index'
        },
        {
          title: '水电气缴费',
          desc: '查看账单和缴费',
          icon: '缴',
          path: '/pages/service/bills/list/index'
        },
        {
          title: '医保社保',
          desc: '查看医保社保记录',
          icon: '保',
          path: '/pages/service/insurance/index'
        },
        {
          title: '周边设施',
          desc: '查药店医院和便民点',
          icon: '周',
          path: '/pages/service/facility/list/index'
        },
        {
          title: '学习服务',
          desc: '常用软件和防骗学习',
          icon: '学',
          path: '/pages/learning/list/index'
        }
      ],
      profileItems: [
        {
          title: '个人资料',
          desc: '修改昵称头像和电话',
          icon: '我',
          path: '/pages/profile/edit/index'
        },
        {
          title: '健康档案',
          desc: '查看健康记录',
          icon: '档',
          path: '/pages/health/archive/index'
        },
        {
          title: '学习档案',
          desc: '查看学习进度',
          icon: '进',
          path: '/pages/learning/archive/index'
        },
        {
          title: '生活账本',
          desc: '记录日常开销',
          icon: '账',
          path: '/pages/profile/life-book/index'
        }
      ],
      entryItems: [
        {
          title: '娱乐频道',
          desc: '养生视频、广场舞、手机教学',
          icon: '乐',
          path: '/pages/entertainment/index'
        },
        {
          title: '健康助手',
          desc: '不适查询、用药提醒、健康知识',
          icon: '健',
          path: '/pages/health/assistant/index'
        },
        {
          title: '社区活动',
          desc: '看活动、发布活动、报名参加',
          icon: '活',
          path: '/pages/activity/list/index'
        }
      ]
    }
  },
  onShow() {
    this.loadPageData()
  },
  methods: {
    async loadPageData() {
      this.reminder = await getHomeReminder()
      this.user = await getCurrentUser()
      const community = await getCommunityHomeData()
      this.healthTips = community.healthTips || { summary: '', tips: [] }
      this.weather = community.weather || {}
      this.announcements = community.announcements || []
      this.circles = community.circles || []
      this.posts = (community.posts || []).slice(0, 6)
      this.qas = community.qas || []
      this.recommendations = community.recommendations || []
      this.checkin = community.checkin || this.checkin
      this.activities = await getActivities()
    },
    handleSelectEntry(item) {
      uni.navigateTo({
        url: item.path
      })
    },
    handleSearch() {
      uni.navigateTo({
        url: '/pages/common/placeholder/index?title=' + encodeURIComponent('搜索功能')
      })
    },
    handleVoice() {
      saveReadablePayload(this.buildReadablePayload())
      uni.navigateTo({
        url: '/pages/health/assistant/index?source=home'
      })
    },
    buildReadablePayload() {
      return {
        title: '首页导读',
        sections: [
          `${this.user.nickname || '您好'}，欢迎来到银龄通首页。`,
          this.healthTips.summary ? `今日健康提醒：${this.healthTips.summary}。` : '',
          ...(this.healthTips.tips || []).map((item) => `提醒：${item}。`),
          this.weather.city ? `${this.weather.city}天气${this.weather.weather}，气温${this.weather.temperature}。` : '',
          this.weather.dressingTip ? `穿衣建议：${this.weather.dressingTip}。` : '',
          this.announcements[0] ? `社区公告：${this.announcements[0].title}。${this.announcements[0].content}` : '',
          this.activities[0] ? `推荐活动：${this.activities[0].title}，时间${this.activities[0].time}，地点${this.activities[0].location}。` : '',
          '您可以继续点击出行游玩、网上办事、水电气缴费、学习服务等入口。'
        ].filter(Boolean)
      }
    },
    handleCircle(circle) {
      uni.navigateTo({
        url: '/pages/common/placeholder/index?title=' + encodeURIComponent(circle.name)
      })
    },
    openPost(post) {
      uni.navigateTo({
        url: '/pages/community/post-detail/index?id=' + post.id
      })
    },
    async handleLike(post) {
      await toggleCommunityLike(post.id)
      this.loadPageData()
    },
    async handleCollect(post) {
      await toggleCommunityCollect(post.id)
      this.loadPageData()
    },
    async handleReport(post) {
      await reportCommunityContent({
        targetId: post.id,
        targetType: 'post',
        reason: '不当内容'
      })
      uni.showToast({
        title: '已收到举报',
        icon: 'success'
      })
    },
    async handleCheckin() {
      const next = await submitCommunityCheckin()
      this.checkin = next
      uni.showToast({
        title: '签到成功',
        icon: 'success'
      })
    },
    async handleActivitySignup(item) {
      if (item.isSignedUp) {
        return
      }
      await signupActivity(item.id)
      uni.showToast({
        title: '报名成功',
        icon: 'success'
      })
      this.activities = await getActivities()
    },
    handleActivityMore() {
      uni.navigateTo({
        url: '/pages/activity/list/index'
      })
    },
    handleRecommend(item) {
      if (item.type === 'activity') {
        uni.navigateTo({
          url: '/pages/activity/list/index'
        })
        return
      }
      if (item.type === 'post') {
        uni.navigateTo({
          url: '/pages/community/post-detail/index?id=' + item.targetId
        })
        return
      }
      uni.navigateTo({
        url: '/pages/common/placeholder/index?title=' + encodeURIComponent('推荐内容')
      })
    },
    handleEmergency() {
      uni.showModal({
        title: '紧急呼救',
        content: '是否立即拨打 120 或联系家人？',
        confirmText: '立即呼救',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '已通知紧急联系人',
              icon: 'success'
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home-hero {
  padding: 12rpx 8rpx 0;
}

.search-row {
  margin-top: 18rpx;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 140rpx;
  gap: 16rpx;
  align-items: center;
}

.search-box {
  height: 88rpx;
  border-radius: 24rpx;
  padding: 0 24rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  box-shadow: 0 6rpx 18rpx rgba(31, 138, 112, 0.08);
}

.search-placeholder {
  color: #607176;
  font-size: 28rpx;
}

.voice-btn {
  height: 88rpx;
  border-radius: 24rpx;
  background: #ffe7c7;
  color: #8b4e00;
  font-size: 30rpx;
  font-weight: 600;
}

.health-card {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.health-summary {
  font-size: 30rpx;
  font-weight: 700;
}

.health-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.health-item {
  padding: 16rpx 20rpx;
  border-radius: 18rpx;
  background: #f4f8f6;
  font-size: 28rpx;
}

.weather-card {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.weather-row {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.weather-city {
  font-size: 34rpx;
  font-weight: 700;
}

.weather-meta {
  margin-top: 6rpx;
  font-size: 28rpx;
  color: #607176;
}

.weather-right {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  align-items: flex-end;
}

.weather-tag {
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
  background: #eef7f1;
  color: #1f8a70;
  font-size: 24rpx;
  font-weight: 600;
}

.weather-tip {
  font-size: 28rpx;
  color: #42565d;
}

.announcement-card {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.announcement-title {
  font-size: 32rpx;
  font-weight: 700;
}

.announcement-content {
  color: #42565d;
  font-size: 28rpx;
}

.announcement-time {
  color: #607176;
  font-size: 24rpx;
}

.checkin-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220rpx;
  gap: 16rpx;
  align-items: center;
}

.checkin-points {
  font-size: 32rpx;
  font-weight: 700;
}

.checkin-desc {
  margin-top: 8rpx;
  font-size: 26rpx;
  color: #607176;
}

.circle-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}

.circle-item {
  padding: 20rpx;
  border-radius: 20rpx;
  background: linear-gradient(160deg, #fff7e9 0%, #f7f2e5 100%);
}

.circle-name {
  font-size: 30rpx;
  font-weight: 700;
}

.circle-meta {
  margin-top: 8rpx;
  color: #8b4e00;
  font-size: 24rpx;
}

.circle-hot {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #42565d;
}

.activity-card {
  padding: 18rpx 0;
  border-bottom: 2rpx solid #edf3ef;
}

.activity-card:last-child {
  border-bottom: none;
}

.activity-title {
  font-size: 32rpx;
  font-weight: 700;
}

.activity-meta {
  margin-top: 8rpx;
  color: #607176;
  font-size: 28rpx;
}

.activity-actions {
  margin-top: 12rpx;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12rpx;
}

.ghost-btn {
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 24rpx;
  background: #f1f5f2;
  color: #42565d;
  font-size: 30rpx;
  font-weight: 600;
}

.qa-card {
  padding: 18rpx 0;
  border-bottom: 2rpx solid #edf3ef;
}

.qa-card:last-child {
  border-bottom: none;
}

.qa-question {
  font-size: 30rpx;
  font-weight: 700;
}

.qa-answer {
  margin-top: 10rpx;
  font-size: 28rpx;
  color: #42565d;
}

.qa-responder {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: #607176;
}

.post-card {
  padding: 18rpx 0;
  border-bottom: 2rpx solid #edf3ef;
}

.post-card:last-child {
  border-bottom: none;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16rpx;
}

.post-author {
  font-size: 30rpx;
  font-weight: 700;
}

.post-circle {
  font-size: 24rpx;
  color: #1f8a70;
  background: #e8f5ef;
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
}

.post-title {
  margin-top: 8rpx;
  font-size: 32rpx;
  font-weight: 700;
}

.post-content {
  margin-top: 8rpx;
  font-size: 28rpx;
  color: #42565d;
}

.post-tags {
  margin-top: 10rpx;
  display: flex;
  gap: 10rpx;
  flex-wrap: wrap;
}

.post-actions {
  margin-top: 12rpx;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8rpx;
}

.mini-btn {
  height: 72rpx;
  line-height: 72rpx;
  border-radius: 18rpx;
  background: #f1f5f2;
  color: #42565d;
  font-size: 24rpx;
}

.danger-text {
  color: #e76f51;
}

.recommend-card {
  padding: 18rpx 0;
  border-bottom: 2rpx solid #edf3ef;
}

.recommend-card:last-child {
  border-bottom: none;
}

.recommend-title {
  font-size: 30rpx;
  font-weight: 700;
}

.recommend-desc {
  margin-top: 8rpx;
  font-size: 28rpx;
  color: #42565d;
}

.emergency-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16rpx 24rpx 28rpx;
  background: rgba(247, 248, 242, 0.95);
  backdrop-filter: blur(6rpx);
}

.emergency-btn {
  height: 100rpx;
  line-height: 100rpx;
  border-radius: 30rpx;
  background: #e76f51;
  color: #fff;
  font-size: 34rpx;
  font-weight: 700;
}
</style>
