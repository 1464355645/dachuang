<template>
  <view class="page-container">
    <view class="page-title">社区活动</view>
    <view class="page-subtitle">看看附近活动，也可以帮大家发布活动。</view>

    <button class="primary-btn section-gap" @click="goPublish">发布活动</button>

    <section-card title="活动列表" subtitle="支持查看报名状态" class="section-gap">
      <view v-if="activities.length">
        <view v-for="item in activities" :key="item.id" class="activity-card">
          <view class="activity-card__row">
            <view class="activity-card__title">{{ item.title }}</view>
            <view class="tag">{{ auditStatusText(item.auditStatus) }}</view>
          </view>
          <view class="activity-card__meta">时间：{{ item.time }}</view>
          <view class="activity-card__meta">地点：{{ item.location }}</view>
          <view class="activity-card__meta">人数：{{ item.peopleCount || '不限' }} 人</view>
          <view class="activity-card__meta">已报名：{{ item.enrolledCount || 0 }} 人</view>
          <view class="activity-card__desc">{{ item.description }}</view>
          <button
            class="secondary-btn section-gap"
            :disabled="item.isSignedUp"
            @click="handleSignup(item)"
          >
            {{ item.isSignedUp ? '已报名' : '报名参加' }}
          </button>
        </view>
      </view>
      <view v-else class="empty-text">当前没有活动内容。</view>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../components/common/SectionCard.vue'
import { getActivities, signupActivity } from '../../../api/activity'

export default {
  components: {
    SectionCard
  },
  data() {
    return {
      activities: []
    }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.activities = await getActivities()
    },
    async handleSignup(item) {
      if (item.isSignedUp) {
        return
      }
      await signupActivity(item.id)
      uni.showToast({
        title: '报名成功',
        icon: 'success'
      })
      this.loadData()
    },
    auditStatusText(status) {
      const map = {
        approved: '已通过',
        pending: '待审核',
        rejected: '未通过'
      }
      return map[status] || '待审核'
    },
    goPublish() {
      uni.navigateTo({
        url: '/pages/activity/publish/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-card {
  padding: 22rpx 0;
  border-bottom: 2rpx solid #edf3ef;
}

.activity-card:last-child {
  border-bottom: none;
}

.activity-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.activity-card__title {
  font-size: 32rpx;
  font-weight: 700;
}

.activity-card__meta {
  margin-top: 8rpx;
  color: #607176;
  font-size: 28rpx;
}

.activity-card__desc {
  margin-top: 10rpx;
  font-size: 28rpx;
  color: #42565d;
}
</style>
