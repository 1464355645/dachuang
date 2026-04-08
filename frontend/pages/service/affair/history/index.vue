<template>
  <view class="page-container">
    <view class="page-title">办事记录</view>
    <view class="page-subtitle">提交过的事项都在这里。</view>

    <section-card title="历史记录" class="section-gap">
      <view v-if="list.length">
        <view v-for="item in list" :key="item.id" class="history-card">
          <view class="history-card__top">
            <view class="history-card__title">{{ item.businessType }}</view>
            <view class="tag">{{ item.status }}</view>
          </view>
          <view class="history-card__meta">姓名：{{ item.name }}</view>
          <view class="history-card__meta">手机号：{{ item.phone }}</view>
          <view class="history-card__meta">提交时间：{{ item.createdAt }}</view>
          <view v-if="item.description" class="history-card__meta">说明：{{ item.description }}</view>
        </view>
      </view>
      <view v-else class="empty-text">暂时还没有提交记录。</view>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../../components/common/SectionCard.vue'
import { getAffairHistory } from '../../../../api/life-services'

export default {
  components: {
    SectionCard
  },
  data() {
    return {
      list: []
    }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.list = await getAffairHistory()
    }
  }
}
</script>

<style lang="scss" scoped>
.history-card {
  padding: 22rpx 0;
  border-bottom: 2rpx solid #edf3ef;
}

.history-card:last-child {
  border-bottom: none;
}

.history-card__top {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.history-card__title {
  font-size: 32rpx;
  font-weight: 700;
}

.history-card__meta {
  margin-top: 10rpx;
  color: #607176;
  font-size: 28rpx;
}
</style>