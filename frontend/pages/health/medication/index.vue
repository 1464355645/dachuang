<template>
  <view class="page-container">
    <view class="page-title">用药提醒</view>
    <view class="page-subtitle">把药名和时间记下来，查看更方便。</view>

    <section-card title="提醒列表" subtitle="可以新增、编辑和删除" class="section-gap">
      <view slot="extra">
        <button class="small-action" @click="goForm()">新增提醒</button>
      </view>
      <view v-if="reminders.length">
        <view v-for="item in reminders" :key="item.id" class="med-card">
          <view class="med-card__title">{{ item.medicineName }}</view>
          <view class="med-card__info">时间：{{ item.time }}</view>
          <view class="med-card__info">频率：{{ item.frequency }}</view>
          <view v-if="item.dosage" class="med-card__info">用量：{{ item.dosage }}</view>
          <view v-if="item.notes" class="med-card__info">备注：{{ item.notes }}</view>
          <view class="med-card__actions">
            <button class="mini-btn" @click="goForm(item.id)">编辑</button>
            <button class="mini-btn mini-btn--danger" @click="removeItem(item.id)">删除</button>
          </view>
        </view>
      </view>
      <view v-else class="empty-text">还没有用药提醒，先添加一条吧。</view>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../components/common/SectionCard.vue'
import { deleteMedicationReminder, getMedicationReminders } from '../../../api/health'

export default {
  components: { SectionCard },
  data() {
    return { reminders: [] }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.reminders = await getMedicationReminders()
    },
    goForm(id) {
      const query = id ? '?id=' + id : ''
      uni.navigateTo({ url: '/pages/health/medication/form/index' + query })
    },
    async removeItem(id) {
      await deleteMedicationReminder(id)
      uni.showToast({ title: '已删除', icon: 'success' })
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
.small-action { margin: 0; height: 64rpx; line-height: 64rpx; padding: 0 24rpx; border-radius: 16rpx; background: #e8f5ef; color: #1f8a70; font-size: 24rpx; }
.med-card { padding: 22rpx 0; border-bottom: 2rpx solid #edf3ef; }
.med-card:last-child { border-bottom: none; }
.med-card__title { font-size: 32rpx; font-weight: 700; }
.med-card__info { margin-top: 8rpx; color: #607176; font-size: 28rpx; }
.med-card__actions { display: flex; gap: 16rpx; margin-top: 16rpx; }
.mini-btn { margin: 0; padding: 0 24rpx; height: 64rpx; line-height: 64rpx; border-radius: 16rpx; background: #e8f5ef; color: #1f8a70; font-size: 26rpx; }
.mini-btn--danger { background: #fff1f1; color: #c84a4a; }
</style>