<template>
  <view class="page-container">
    <view class="card">
      <view class="detail-head">
        <view>
          <view class="detail-title">{{ detail.name }}</view>
          <view class="detail-meta">{{ detail.category }}</view>
        </view>
        <view class="tag">{{ detail.distance }}</view>
      </view>

      <view class="detail-line">地址：{{ detail.address }}</view>
      <view class="detail-line">电话：{{ detail.contact }}</view>
      <view class="detail-line">营业时间：{{ detail.openHours }}</view>
      <view class="detail-line">评分：{{ detail.rating }}</view>

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
          {{ detail.isFavorite ? '取消收藏' : '收藏设施' }}
        </button>
        <button class="primary-btn" @click="openLocation">打开地图</button>
      </view>
    </view>
  </view>
</template>

<script>
import { getFacilityDetail, toggleFacilityFavorite } from '../../../../api/life-services'

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
          title: this.detail.name,
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
      this.detail = await getFacilityDetail(id)
    },
    async handleFavorite() {
      const result = await toggleFacilityFavorite(this.detail.id)
      this.detail.isFavorite = result.isFavorite
      uni.showToast({
        title: this.detail.isFavorite ? '已收藏' : '已取消',
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
        name: this.detail.name,
        address: this.detail.address
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