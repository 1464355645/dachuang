<template>
  <view class="page-container">
    <view class="page-title">医保社保</view>
    <view class="page-subtitle">余额、缴费记录、报销情况都能看到。</view>

    <view class="stats-grid section-gap">
      <info-stat-card :value="'￥' + summary.balance" label="账户余额" />
      <info-stat-card :value="'￥' + summary.annualReimbursement" label="年度报销" />
    </view>

    <section-card title="账户状态" class="section-gap">
      <view class="summary-line">社保状态：{{ summary.socialSecurityStatus }}</view>
      <view class="summary-line">最近刷新：{{ summary.lastRefreshTime }}</view>
      <button class="secondary-btn section-gap" @click="handleRefresh">刷新数据</button>
    </section-card>

    <section-card title="健康档案摘要" class="section-gap">
      <view class="summary-line">{{ summary.healthSummary }}</view>
    </section-card>

    <section-card title="缴费与报销记录" class="section-gap">
      <view v-if="summary.paymentRecords && summary.paymentRecords.length">
        <view
          v-for="item in summary.paymentRecords"
          :key="item.id"
          class="record-card"
          @click="goDetail(item.id)"
        >
          <view class="record-card__top">
            <view class="record-card__title">{{ item.title }}</view>
            <view class="tag">{{ item.status }}</view>
          </view>
          <view class="record-card__meta">{{ item.type }}</view>
          <view class="record-card__meta">{{ item.date }} · ￥{{ item.amount }}</view>
        </view>
      </view>
      <view v-else class="empty-text">暂时没有记录。</view>
    </section-card>
  </view>
</template>

<script>
import InfoStatCard from '../../../components/common/InfoStatCard.vue'
import SectionCard from '../../../components/common/SectionCard.vue'
import { getInsuranceSummary, refreshInsuranceSummary } from '../../../api/life-services'

export default {
  components: {
    InfoStatCard,
    SectionCard
  },
  data() {
    return {
      summary: {
        balance: 0,
        annualReimbursement: 0,
        socialSecurityStatus: '',
        lastRefreshTime: '',
        healthSummary: '',
        paymentRecords: []
      }
    }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.summary = await getInsuranceSummary()
    },
    async handleRefresh() {
      this.summary = await refreshInsuranceSummary()
      uni.showToast({
        title: '数据已刷新',
        icon: 'success'
      })
    },
    goDetail(id) {
      uni.navigateTo({
        url: '/pages/service/insurance/detail/index?id=' + id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}

.summary-line {
  font-size: 30rpx;
  line-height: 1.8;
  color: #42565d;
}

.record-card {
  padding: 20rpx 0;
  border-bottom: 2rpx solid #edf3ef;
}

.record-card:last-child {
  border-bottom: none;
}

.record-card__top {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.record-card__title {
  font-size: 30rpx;
  font-weight: 700;
}

.record-card__meta {
  margin-top: 8rpx;
  color: #607176;
  font-size: 26rpx;
}
</style>
