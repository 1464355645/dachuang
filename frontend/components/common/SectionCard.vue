<template>
  <view class="section-card card">
    <view class="section-card__header">
      <view>
        <view class="section-card__title">{{ title }}</view>
        <view v-if="subtitle" class="section-card__subtitle">{{ subtitle }}</view>
      </view>
      <slot name="extra" />
    </view>
    <view class="section-card__body">
      <slot />
    </view>
  </view>
</template>

<script>
export default {
  name: 'SectionCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.section-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.section-card__title {
  font-size: 34rpx;
  font-weight: 700;
}

.section-card__subtitle {
  margin-top: 8rpx;
  color: #607176;
  font-size: 26rpx;
}

.section-card__body {
  margin-top: 20rpx;
}
</style>
