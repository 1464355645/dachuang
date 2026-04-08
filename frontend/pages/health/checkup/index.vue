<template>
  <view class="page-container">
    <view class="page-title">健康体检预约</view>
    <view class="page-subtitle">先看套餐，再选择时间完成预约。</view>

    <section-card title="体检套餐" subtitle="点击后查看详情" class="section-gap">
      <view v-if="packages.length">
        <view v-for="item in packages" :key="item.id" class="pkg-card" @click="goDetail(item.id)">
          <view class="pkg-card__top"><view class="pkg-card__title">{{ item.name }}</view><view class="tag">￥{{ item.price }}</view></view>
          <view class="pkg-card__meta">适合人群：{{ item.suitablePeople }}</view>
          <view class="pkg-card__meta">{{ item.summary }}</view>
        </view>
      </view>
      <view v-else class="empty-text">当前没有体检套餐。</view>
    </section-card>

    <section-card title="预约记录" class="section-gap">
      <button class="secondary-btn" @click="goRecords">查看体检预约记录</button>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../components/common/SectionCard.vue'
import { getCheckupPackages } from '../../../api/health'

export default {
  components: { SectionCard },
  data() {
    return { packages: [] }
  },
  async onLoad() {
    this.packages = await getCheckupPackages()
  },
  methods: {
    goDetail(id) { uni.navigateTo({ url: '/pages/health/checkup/detail/index?id=' + id }) },
    goRecords() { uni.navigateTo({ url: '/pages/health/checkup/records/index' }) }
  }
}
</script>

<style lang="scss" scoped>
.pkg-card { padding: 22rpx 0; border-bottom: 2rpx solid #edf3ef; }
.pkg-card:last-child { border-bottom: none; }
.pkg-card__top { display: flex; justify-content: space-between; gap: 16rpx; }
.pkg-card__title { font-size: 32rpx; font-weight: 700; }
.pkg-card__meta { margin-top: 10rpx; color: #607176; font-size: 28rpx; line-height: 1.7; }
</style>
