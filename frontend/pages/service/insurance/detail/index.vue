<template>
  <view class="page-container">
    <view class="card">
      <view class="detail-title">{{ detail.title }}</view>
      <view class="detail-line">记录类型：{{ detail.type }}</view>
      <view class="detail-line">金额：￥{{ detail.amount }}</view>
      <view class="detail-line">日期：{{ detail.date }}</view>
      <view class="detail-line">状态：{{ detail.status }}</view>
      <view class="detail-content">{{ detail.detail }}</view>
    </view>
  </view>
</template>

<script>
import { getInsuranceRecordDetail } from '../../../../api/life-services'

export default {
  data() {
    return {
      detail: {}
    }
  },
  onLoad(options) {
    this.loadData(options.id)
  },
  methods: {
    async loadData(id) {
      this.detail = await getInsuranceRecordDetail(id)
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-title {
  font-size: 38rpx;
  font-weight: 700;
}

.detail-line,
.detail-content {
  margin-top: 14rpx;
  font-size: 30rpx;
  color: #42565d;
  line-height: 1.8;
}
</style>
