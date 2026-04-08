<template>
  <view class="page-container">
    <view class="card">
      <view class="detail-head">
        <view>
          <view class="detail-title">{{ detail.title }}</view>
          <view class="detail-meta">{{ detail.category }}</view>
        </view>
        <view class="tag">{{ detail.isJoined ? '已报名' : '可报名' }}</view>
      </view>

      <view class="detail-line">地点：{{ detail.location }}</view>
      <view class="detail-line">时间：{{ detail.time }}</view>
      <view class="detail-line">已报名人数：{{ detail.participantCount }}</view>
      <view class="detail-line">联系方式：{{ detail.contact }}</view>
      <view class="detail-content">{{ detail.content }}</view>

      <map
        v-if="detail.latitude"
        class="detail-map section-gap"
        :latitude="detail.latitude"
        :longitude="detail.longitude"
        :markers="markers"
        show-location
      />

      <view class="btn-grid section-gap">
        <button class="secondary-btn" @click="handleFavorite">
          {{ detail.isFavorite ? '取消收藏' : '收藏活动' }}
        </button>
        <button class="primary-btn" :disabled="detail.isJoined" @click="handleSignup">
          {{ detail.isJoined ? '已经报名' : '报名参加' }}
        </button>
      </view>
      <button class="secondary-btn section-gap" @click="openLocation">打开地图</button>
    </view>
  </view>
</template>

<script>
import { getTravelDetail, signupTravel, toggleTravelFavorite } from '../../../../api/life-services'

export default {
  data() {
    return {
      detail: {}
    }
  },
  computed: {
    markers() {
      if (!this.detail.latitude) {
        return []
      }
      return [
        {
          id: this.detail.id,
          latitude: this.detail.latitude,
          longitude: this.detail.longitude,
          title: this.detail.title,
          width: 28,
          height: 36
        }
      ]
    }
  },
  onLoad(options) {
    this.loadData(options.id)
  },
  methods: {
    async loadData(id) {
      this.detail = await getTravelDetail(id)
    },
    async handleFavorite() {
      const result = await toggleTravelFavorite(this.detail.id)
      this.detail.isFavorite = result.isFavorite
      uni.showToast({
        title: this.detail.isFavorite ? '已收藏' : '已取消',
        icon: 'success'
      })
    },
    async handleSignup() {
      this.detail = await signupTravel(this.detail.id)
      uni.showToast({
        title: '报名成功',
        icon: 'success'
      })
    },
    openLocation() {
      if (!this.detail.latitude) {
        return
      }
      uni.openLocation({
        latitude: this.detail.latitude,
        longitude: this.detail.longitude,
        name: this.detail.title,
        address: this.detail.location
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-head {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
}

.detail-title {
  font-size: 38rpx;
  font-weight: 700;
}

.detail-meta,
.detail-line {
  margin-top: 12rpx;
  color: #607176;
  font-size: 28rpx;
}

.detail-content {
  margin-top: 20rpx;
  font-size: 30rpx;
  line-height: 1.9;
  color: #42565d;
}

.detail-map {
  width: 100%;
  height: 320rpx;
  border-radius: 20rpx;
  overflow: hidden;
}

.btn-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}
</style>