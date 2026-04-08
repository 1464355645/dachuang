<template>
  <view class="page-container">
    <view class="card">
      <view class="detail-title">{{ detail.billType }} {{ detail.month }}</view>
      <view class="detail-line">账单金额：￥{{ detail.amount }}</view>
      <view class="detail-line">缴费状态：{{ detail.status }}</view>
      <view class="detail-line">截止日期：{{ detail.dueDate }}</view>
      <view class="detail-line">缴费户号：{{ detail.accountNo }}</view>
      <view class="detail-line">开户地址：{{ detail.address }}</view>
      <view class="detail-tip">{{ detail.reminder }}</view>

      <button class="primary-btn section-gap" :disabled="detail.status === '已缴费'" @click="handlePay">
        {{ detail.status === '已缴费' ? '本账单已缴费' : '模拟微信支付' }}
      </button>
    </view>
  </view>
</template>

<script>
import { getUtilityBillDetail, payUtilityBill } from '../../../../api/life-services'

export default {
  data() {
    return {
      detail: {},
      billId: 0
    }
  },
  onLoad(options) {
    this.billId = Number(options.id)
    this.loadData()
  },
  methods: {
    async loadData() {
      this.detail = await getUtilityBillDetail(this.billId)
    },
    async handlePay() {
      const result = await payUtilityBill(this.billId)
      uni.showModal({
        title: result.success ? '支付成功' : '支付失败',
        content: result.message,
        showCancel: false
      })
      this.loadData()
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
.detail-tip {
  margin-top: 14rpx;
  font-size: 30rpx;
  color: #42565d;
  line-height: 1.8;
}

.detail-tip {
  padding: 16rpx 18rpx;
  border-radius: 18rpx;
  background: #f4f8f6;
}
</style>
