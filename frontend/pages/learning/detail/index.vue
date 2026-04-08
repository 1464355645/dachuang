<template>
  <view class="page-container">
    <view class="card">
      <view class="detail-row">
        <view class="tag">{{ detail.module }}</view>
        <view class="tag">{{ detail.category }}</view>
        <view class="tag">{{ detail.difficulty }}</view>
      </view>
      <view class="detail-title">{{ detail.title }}</view>
      <view class="detail-summary">{{ detail.summary }}</view>
      <view class="detail-meta">发布时间：{{ detail.publishDate }} · 预计 {{ detail.duration }} 分钟</view>

      <view class="progress-block">
        <view class="progress-label">当前进度 {{ progress }}%</view>
        <view class="progress-track">
          <view class="progress-fill" :style="{ width: progress + '%' }"></view>
        </view>
      </view>

      <video
        v-if="detail.mediaType === 'video' && detail.mediaUrl"
        class="detail-media section-gap"
        :src="detail.mediaUrl"
        controls
      />
      <image
        v-else-if="detail.mediaType === 'image' && detail.mediaUrl"
        class="detail-media section-gap"
        :src="detail.mediaUrl"
        mode="aspectFill"
      />

      <view class="detail-content">{{ detail.content }}</view>

      <view class="btn-grid section-gap">
        <button class="secondary-btn" @click="toggleFavorite">{{ detail.isFavorite ? '取消收藏' : '收藏内容' }}</button>
        <button class="secondary-btn" @click="markRead">标记已读</button>
        <button class="secondary-btn" @click="saveProgress(50)">记为学习中</button>
        <button class="primary-btn" @click="saveProgress(100)">标记已学</button>
      </view>
    </view>
  </view>
</template>

<script>
import { getLearningDetail, saveStudyRecord, updateLearningAction } from '../../../api/learning'

export default {
  data() {
    return {
      detail: {},
      progress: 0
    }
  },
  async onLoad(options) {
    this.detail = await getLearningDetail(options.id)
    this.progress = this.detail.progress || 0
  },
  methods: {
    async toggleFavorite() {
      await updateLearningAction(this.detail.id, {
        action: 'favorite',
        value: !this.detail.isFavorite
      })
      this.detail.isFavorite = !this.detail.isFavorite
      uni.showToast({
        title: this.detail.isFavorite ? '已收藏' : '已取消',
        icon: 'success'
      })
    },
    async markRead() {
      await updateLearningAction(this.detail.id, {
        action: 'read',
        value: true
      })
      this.detail.isRead = true
      this.progress = Math.max(this.progress, 50)
      uni.showToast({
        title: '已标记已读',
        icon: 'success'
      })
    },
    async saveProgress(value) {
      this.progress = value
      await saveStudyRecord({
        contentId: this.detail.id,
        progress: value,
        status: value === 100 ? 'completed' : 'reading'
      })
      this.detail.status = value === 100 ? 'completed' : 'reading'
      this.detail.isRead = true
      uni.showToast({
        title: value === 100 ? '已记入学习档案' : '已保存进度',
        icon: 'success'
      })
      if (value === 100) {
        setTimeout(function() {
          uni.navigateTo({
            url: '/pages/learning/archive/index'
          })
        }, 500)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-row {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.detail-title {
  margin-top: 16rpx;
  font-size: 40rpx;
  font-weight: 700;
  line-height: 1.5;
}

.detail-summary,
.detail-meta {
  margin-top: 18rpx;
  color: #607176;
  font-size: 28rpx;
}

.progress-block {
  margin-top: 24rpx;
}

.progress-label {
  font-size: 28rpx;
  color: #42565d;
}

.progress-track {
  width: 100%;
  height: 18rpx;
  margin-top: 12rpx;
  border-radius: 999rpx;
  background: #e5efe9;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #1f8a70;
}

.detail-media {
  width: 100%;
  height: 360rpx;
  border-radius: 20rpx;
  background: #eef3ef;
}

.detail-content {
  margin-top: 24rpx;
  font-size: 31rpx;
  line-height: 1.9;
  color: #42565d;
}

.btn-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}
</style>