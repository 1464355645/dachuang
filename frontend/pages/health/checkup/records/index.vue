<template>
  <view class="page-container">
    <view class="page-title">体检预约记录</view>
    <view class="page-subtitle">已经提交的体检预约都在这里。</view>

    <section-card title="健康体检预约记录" class="section-gap">
      <view v-if="list.length">
        <view v-for="item in list" :key="item.id" class="record-card">
          <view class="record-card__top"><view class="record-card__title">{{ item.packageName }}</view><view class="tag">{{ item.status }}</view></view>
          <view class="record-card__meta">日期：{{ item.date }}</view>
          <view class="record-card__meta">时间：{{ item.timeSlot }}</view>
          <view class="record-card__meta">提交时间：{{ item.createdAt }}</view>
        </view>
      </view>
      <view v-else class="empty-text">还没有体检预约记录。</view>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../../components/common/SectionCard.vue'
import { getCheckupAppointments } from '../../../../api/health'

export default {
  components: { SectionCard },
  data() {
    return { list: [] }
  },
  async onShow() {
    this.list = await getCheckupAppointments()
  }
}
</script>

<style lang="scss" scoped>
.record-card { padding: 22rpx 0; border-bottom: 2rpx solid #edf3ef; }
.record-card:last-child { border-bottom: none; }
.record-card__top { display: flex; justify-content: space-between; gap: 16rpx; }
.record-card__title { font-size: 30rpx; font-weight: 700; }
.record-card__meta { margin-top: 8rpx; color: #607176; font-size: 26rpx; }
</style>