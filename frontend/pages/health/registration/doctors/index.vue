<template>
  <view class="page-container">
    <view class="page-title">号源列表</view>
    <view class="page-subtitle">{{ departmentName }} 可预约号源如下。</view>

    <section-card title="医生与时间" class="section-gap">
      <view v-if="list.length">
        <view v-for="item in list" :key="item.id" class="doctor-card">
          <view class="doctor-card__top"><view class="doctor-card__title">{{ item.doctorName }}</view><view class="tag">剩余 {{ item.remainCount }}</view></view>
          <view class="doctor-card__meta">科室：{{ item.departmentName }}</view>
          <view class="doctor-card__meta">日期：{{ item.date }}</view>
          <view class="doctor-card__meta">时间：{{ item.timeSlot }}</view>
          <view class="doctor-card__meta">简介：{{ item.intro }}</view>
          <button class="primary-btn section-gap" @click="goForm(item)">预约这个号源</button>
        </view>
      </view>
      <view v-else class="empty-text">当前没有可预约号源。</view>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../../components/common/SectionCard.vue'
import { getOutpatientDoctors } from '../../../../api/health'

export default {
  components: { SectionCard },
  data() {
    return { departmentId: '', departmentName: '', list: [] }
  },
  async onLoad(options) {
    this.departmentId = options.departmentId || ''
    this.departmentName = decodeURIComponent(options.departmentName || '')
    this.list = await getOutpatientDoctors({ departmentId: this.departmentId })
  },
  methods: {
    goForm(item) {
      uni.navigateTo({ url: '/pages/health/registration/form/index?doctorId=' + item.id })
    }
  }
}
</script>

<style lang="scss" scoped>
.doctor-card { padding: 22rpx 0; border-bottom: 2rpx solid #edf3ef; }
.doctor-card:last-child { border-bottom: none; }
.doctor-card__top { display: flex; justify-content: space-between; gap: 16rpx; }
.doctor-card__title { font-size: 32rpx; font-weight: 700; }
.doctor-card__meta { margin-top: 10rpx; color: #607176; font-size: 28rpx; line-height: 1.7; }
</style>