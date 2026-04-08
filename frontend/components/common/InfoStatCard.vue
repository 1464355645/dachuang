<template>
  <view class="info-card card">
    <view class="info-card__value">{{ value }}</view>
    <view class="info-card__label">{{ label }}</view>
  </view>
</template>

<script>
export default {
  name: 'InfoStatCard',
  props: {
    value: {
      type: [String, Number],
      default: '--'
    },
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.info-card {
  text-align: center;
}

.info-card__value {
  font-size: 42rpx;
  font-weight: 700;
  color: #1f8a70;
}

.info-card__label {
  margin-top: 12rpx;
  color: #607176;
  font-size: 26rpx;
}
</style>
