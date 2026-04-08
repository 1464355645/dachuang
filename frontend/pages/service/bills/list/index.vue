<template>
  <view class="page-container">
    <view class="page-title">水电气缴费</view>
    <view class="page-subtitle">账单一目了然，点进去就能缴费。</view>

    <section-card title="缴费提醒" class="section-gap">
      <view class="reminder-text">{{ reminder }}</view>
    </section-card>

    <section-card title="账单列表" class="section-gap">
      <view v-if="list.length">
        <view v-for="item in list" :key="item.id" class="bill-card">
          <view class="bill-card__top">
            <view class="bill-card__title">{{ item.billType }} {{ item.month }}</view>
            <view class="tag">{{ item.status }}</view>
          </view>
          <view class="bill-card__meta">金额：￥{{ item.amount }}</view>
          <view class="bill-card__meta">截止：{{ item.dueDate }}</view>
          <view class="bill-card__actions">
            <button class="mini-btn" @click="goDetail(item.id)">查看详情</button>
            <button class="mini-btn mini-btn--primary" :disabled="item.status === '已缴费'" @click="handlePay(item.id)">
              {{ item.status === '已缴费' ? '已缴费' : '立即缴费' }}
            </button>
          </view>
        </view>
      </view>
      <view v-else class="empty-text">当前没有账单。</view>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../../components/common/SectionCard.vue'
import { getUtilityBills, payUtilityBill } from '../../../../api/life-services'

export default {
  components: {
    SectionCard
  },
  data() {
    return {
      reminder: '',
      list: []
    }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const result = await getUtilityBills()
      this.reminder = result.reminder
      this.list = result.list || []
    },
    goDetail(id) {
      uni.navigateTo({
        url: '/pages/service/bills/detail/index?id=' + id
      })
    },
    async handlePay(id) {
      const result = await payUtilityBill(id)
      uni.showToast({
        title: result.message,
        icon: result.success ? 'success' : 'none'
      })
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
.reminder-text {
  font-size: 30rpx;
  line-height: 1.8;
  color: #42565d;
}

.bill-card {
  padding: 22rpx 0;
  border-bottom: 2rpx solid #edf3ef;
}

.bill-card:last-child {
  border-bottom: none;
}

.bill-card__top {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.bill-card__title {
  font-size: 32rpx;
  font-weight: 700;
}

.bill-card__meta {
  margin-top: 10rpx;
  color: #607176;
  font-size: 28rpx;
}

.bill-card__actions {
  display: flex;
  gap: 16rpx;
  margin-top: 16rpx;
}

.mini-btn {
  margin: 0;
  padding: 0 24rpx;
  height: 68rpx;
  line-height: 68rpx;
  border-radius: 18rpx;
  background: #e8f5ef;
  color: #1f8a70;
  font-size: 28rpx;
}

.mini-btn--primary {
  background: #1f8a70;
  color: #fff;
}
</style>
