<template>
  <view class="feature-grid">
    <view
      v-for="item in items"
      :key="item.title"
      class="feature-grid__item"
      @click="handleSelect(item)"
    >
      <view class="feature-grid__icon">{{ item.icon }}</view>
      <view class="feature-grid__title">{{ item.title }}</view>
      <view v-if="item.desc" class="feature-grid__desc">{{ item.desc }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'FeatureGrid',
  props: {
    items: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    handleSelect(item) {
      this.$emit('select', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx;
}

.feature-grid__item {
  min-height: 168rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  background: linear-gradient(160deg, #f7fbf9 0%, #eef7f1 100%);
}

.feature-grid__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  border-radius: 18rpx;
  background: #dff3ea;
  font-size: 34rpx;
}

.feature-grid__title {
  margin-top: 18rpx;
  font-size: 31rpx;
  font-weight: 700;
}

.feature-grid__desc {
  margin-top: 8rpx;
  color: #607176;
  font-size: 24rpx;
}
</style>
