<template>
  <view class="page-container">
    <view class="page-title">出行游玩</view>
    <view class="page-subtitle">路线清楚，活动轻松，适合慢慢参加。</view>

    <section-card title="推荐活动" subtitle="点卡片可看详情" class="section-gap">
      <view v-if="list.length">
        <view v-for="item in list" :key="item.id" class="service-card" @click="goDetail(item.id)">
          <view class="service-card__top">
            <view class="service-card__title">{{ item.title }}</view>
            <view class="tag">{{ item.category }}</view>
          </view>
          <view class="service-card__meta">地点：{{ item.location }}</view>
          <view class="service-card__meta">时间：{{ item.time }}</view>
          <view class="service-card__desc">{{ item.summary }}</view>
          <view class="service-card__actions">
            <button class="mini-btn" @click.stop="handleFavorite(item)">{{ item.isFavorite ? '已收藏' : '收藏' }}</button>
            <button class="mini-btn mini-btn--primary" @click.stop="goDetail(item.id)">查看详情</button>
          </view>
        </view>
      </view>
      <view v-else class="empty-text">当前没有可参加的活动。</view>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../../components/common/SectionCard.vue'
import { getTravelList, toggleTravelFavorite } from '../../../../api/life-services'

export default {
  components: {
    SectionCard
  },
  data() {
    return {
      list: []
    }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.list = await getTravelList()
    },
    goDetail(id) {
      uni.navigateTo({
        url: '/pages/service/travel/detail/index?id=' + id
      })
    },
    async handleFavorite(item) {
      await toggleTravelFavorite(item.id)
      uni.showToast({
        title: item.isFavorite ? '已取消收藏' : '已收藏',
        icon: 'success'
      })
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
.service-card {
  padding: 24rpx 0;
  border-bottom: 2rpx solid #edf3ef;
}

.service-card:last-child {
  border-bottom: none;
}

.service-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.service-card__title {
  font-size: 32rpx;
  font-weight: 700;
}

.service-card__meta,
.service-card__desc {
  margin-top: 10rpx;
  color: #607176;
  font-size: 28rpx;
}

.service-card__actions {
  display: flex;
  gap: 16rpx;
  margin-top: 16rpx;
}

.mini-btn {
  margin: 0;
  padding: 0 24rpx;
  height: 68rpx;
  line-height: 68rpx;
  border-radius: 18rpx;
  background: #e8f5ef;
  color: #1f8a70;
  font-size: 28rpx;
}

.mini-btn--primary {
  background: #1f8a70;
  color: #fff;
}
</style>