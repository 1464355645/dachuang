<template>
  <view class="page-container">
    <view class="page-title">身体不适查询</view>
    <view class="page-subtitle">先选一个最接近的情况，再查看基础建议。</view>

    <section-card title="请选择不适类型" class="section-gap">
      <view class="option-list">
        <view
          v-for="item in options"
          :key="item.value"
          class="option-item"
          :class="{ 'option-item--active': form.symptomType === item.value }"
          @click="form.symptomType = item.value"
        >
          {{ item.value }}
        </view>
      </view>
      <view class="form-group section-gap">
        <view class="input-label">补充说明</view>
        <textarea v-model="form.detail" class="textarea-box" placeholder="可选，例如：已经持续两天" />
      </view>
      <button class="primary-btn section-gap" @click="handleSubmit">查看建议</button>
    </section-card>

    <section-card title="最近查询记录" class="section-gap">
      <view v-if="logs.length">
        <view v-for="item in logs" :key="item.id" class="log-item" @click="goResult(item.id)">
          <view class="log-item__title">{{ item.symptomType || item.symptom }}</view>
          <view class="log-item__meta">{{ item.createdAt }}</view>
          <view class="log-item__meta">{{ item.suggestion || item.advice }}</view>
        </view>
      </view>
      <view v-else class="empty-text">暂时还没有查询记录。</view>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../components/common/SectionCard.vue'
import { getDiscomfortLogs, getDiscomfortOptions, submitDiscomfortQuery } from '../../../api/health'

export default {
  components: { SectionCard },
  data() {
    return {
      options: [],
      logs: [],
      form: { symptomType: '', detail: '' }
    }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.options = await getDiscomfortOptions()
      this.logs = await getDiscomfortLogs()
      if (!this.form.symptomType && this.options.length) {
        this.form.symptomType = this.options[0].value
      }
    },
    async handleSubmit() {
      if (!this.form.symptomType) {
        uni.showToast({ title: '请先选择不适类型', icon: 'none' })
        return
      }
      const result = await submitDiscomfortQuery(this.form)
      uni.navigateTo({ url: '/pages/health/discomfort/result/index?id=' + result.id })
    },
    goResult(id) {
      uni.navigateTo({ url: '/pages/health/discomfort/result/index?id=' + id })
    }
  }
}
</script>

<style lang="scss" scoped>
.option-list { display: flex; flex-wrap: wrap; gap: 16rpx; }
.option-item { padding: 16rpx 24rpx; border-radius: 999rpx; background: #edf3ef; color: #42565d; font-size: 28rpx; }
.option-item--active { background: #1f8a70; color: #fff; }
.form-group { margin-bottom: 20rpx; }
.log-item { padding: 20rpx 0; border-bottom: 2rpx solid #edf3ef; }
.log-item:last-child { border-bottom: none; }
.log-item__title { font-size: 30rpx; font-weight: 700; }
.log-item__meta { margin-top: 8rpx; color: #607176; font-size: 26rpx; line-height: 1.7; }
</style>