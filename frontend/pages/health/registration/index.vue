<template>
  <view class="page-container">
    <view class="page-title">门诊挂号预约</view>
    <view class="page-subtitle">先选科室，再看可预约号源。</view>

    <section-card title="科室列表" subtitle="点击后查看医生和时间" class="section-gap">
      <view v-if="departments.length">
        <view v-for="item in departments" :key="item.id" class="dept-card" @click="goDoctors(item)">
          <view class="dept-card__title">{{ item.name }}</view>
          <view class="dept-card__desc">{{ item.desc }}</view>
        </view>
      </view>
      <view v-else class="empty-text">暂时没有科室信息。</view>
    </section-card>

    <section-card title="预约记录" subtitle="提交后可在这里查看" class="section-gap">
      <button class="secondary-btn" @click="goRecords">查看预约记录</button>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../components/common/SectionCard.vue'
import { getOutpatientDepartments } from '../../../api/health'

export default {
  components: { SectionCard },
  data() {
    return { departments: [] }
  },
  async onLoad() {
    this.departments = await getOutpatientDepartments()
  },
  methods: {
    goDoctors(item) {
      uni.navigateTo({ url: '/pages/health/registration/doctors/index?departmentId=' + item.id + '&departmentName=' + encodeURIComponent(item.name) })
    },
    goRecords() {
      uni.navigateTo({ url: '/pages/health/registration/records/index' })
    }
  }
}
</script>

<style lang="scss" scoped>
.dept-card { padding: 22rpx 0; border-bottom: 2rpx solid #edf3ef; }
.dept-card:last-child { border-bottom: none; }
.dept-card__title { font-size: 32rpx; font-weight: 700; }
.dept-card__desc { margin-top: 10rpx; color: #607176; font-size: 28rpx; line-height: 1.7; }
</style>