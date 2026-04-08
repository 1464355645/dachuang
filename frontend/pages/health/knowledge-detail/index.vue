<template>
  <view class="page-container">
    <view class="card">
      <view class="detail-row">
        <view class="tag">{{ article.category }}</view>
        <view class="tag">{{ article.readMinutes }} 分钟</view>
      </view>
      <view class="detail-title">{{ article.title }}</view>
      <view class="detail-summary">{{ article.summary }}</view>
      <view class="detail-meta">发布时间：{{ article.publishedAt }}</view>
      <view class="detail-content">{{ article.content }}</view>
      <view class="warm-tip">温馨提示：{{ article.warmTip }}</view>
      <view class="btn-row section-gap">
        <button class="secondary-btn" @click="toggleFavorite">{{ article.isFavorite ? '取消收藏' : '收藏文章' }}</button>
        <button class="primary-btn" @click="markRead">标记已读</button>
      </view>
    </view>
  </view>
</template>

<script>
import { getHealthArticleDetail, updateHealthArticleAction } from '../../../api/health'

export default {
  data() {
    return { article: {} }
  },
  async onLoad(options) {
    this.article = await getHealthArticleDetail(options.id)
  },
  methods: {
    async toggleFavorite() {
      await updateHealthArticleAction(this.article.id, { action: 'favorite', value: !this.article.isFavorite })
      this.article.isFavorite = !this.article.isFavorite
      uni.showToast({ title: this.article.isFavorite ? '已收藏' : '已取消', icon: 'success' })
    },
    async markRead() {
      await updateHealthArticleAction(this.article.id, { action: 'read', value: true })
      this.article.isRead = true
      uni.showToast({ title: '已标记已读', icon: 'success' })
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-row { display: flex; gap: 12rpx; flex-wrap: wrap; }
.detail-title { margin-top: 16rpx; font-size: 40rpx; font-weight: 700; line-height: 1.5; }
.detail-summary, .detail-meta, .warm-tip { margin-top: 18rpx; color: #607176; font-size: 28rpx; line-height: 1.8; }
.detail-content { margin-top: 24rpx; font-size: 31rpx; line-height: 1.9; color: #42565d; }
.btn-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16rpx; }
</style>