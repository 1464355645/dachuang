<template>
  <view class="page-container">
    <view class="card">
      <view class="detail-head"><view class="detail-title">{{ detail.name }}</view><view class="tag">￥{{ detail.price }}</view></view>
      <view class="detail-line">适合人群：{{ detail.suitablePeople }}</view>
      <view class="detail-line">套餐简介：{{ detail.summary }}</view>
      <view class="detail-line">检查项目：{{ detail.itemsText }}</view>
      <view class="detail-line">温馨提示：{{ detail.tip }}</view>
      <button class="primary-btn section-gap" @click="goForm">预约这个套餐</button>
    </view>
  </view>
</template>

<script>
import { getCheckupPackageDetail } from '../../../../api/health'

export default {
  data() {
    return { detail: {} }
  },
  async onLoad(options) {
    this.detail = (await getCheckupPackageDetail(options.id)) || {}
  },
  methods: {
    goForm() {
      uni.navigateTo({ url: '/pages/health/checkup/form/index?id=' + this.detail.id })
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-head { display: flex; justify-content: space-between; gap: 16rpx; }
.detail-title { font-size: 38rpx; font-weight: 700; }
.detail-line { margin-top: 16rpx; font-size: 30rpx; color: #42565d; line-height: 1.8; }
</style>
