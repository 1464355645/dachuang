<template>
  <view class="page-container">
    <view class="card placeholder-card">
      <view class="placeholder-title">{{ title }}</view>
      <view class="placeholder-desc">这个功能会在后续版本继续完善。</view>
      <view class="placeholder-desc">当前先保证首页、健康、学习、活动这些主流程能跑通。</view>
      <button class="primary-btn section-gap" @click="goBack">我知道了</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: '功能说明'
    }
  },
  onLoad(options) {
    this.title = (options && options.title) || '功能说明'
  },
  methods: {
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
.placeholder-card {
  margin-top: 80rpx;
  text-align: center;
}

.placeholder-title {
  font-size: 40rpx;
  font-weight: 700;
}

.placeholder-desc {
  margin-top: 18rpx;
  color: #607176;
  font-size: 30rpx;
}
</style>
