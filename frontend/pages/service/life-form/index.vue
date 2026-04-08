<template>
  <view class="page-container">
    <view class="page-title">{{ serviceName }}</view>
    <view class="page-subtitle">先提交基础信息，后续再接真实服务。</view>

    <view class="card section-gap">
      <view class="form-group">
        <view class="input-label">办理事项</view>
        <input v-model="form.title" class="input-box" placeholder="例如：补办社保卡" />
      </view>
      <view class="form-group">
        <view class="input-label">期望时间</view>
        <input v-model="form.eventDate" class="input-box" placeholder="例如：2026-04-08" />
      </view>
      <view class="form-group">
        <view class="input-label">说明</view>
        <textarea v-model="form.remark" class="textarea-box" placeholder="简单写一下需求" />
      </view>
      <button class="primary-btn section-gap" @click="submitForm">提交记录</button>
    </view>
  </view>
</template>

<script>
import { createLifeRecord } from '../../../api/life'

export default {
  data() {
    return {
      serviceName: '生活服务',
      form: {
        title: '',
        eventDate: '',
        remark: ''
      }
    }
  },
  onLoad(options) {
    this.serviceName = (options && options.serviceName) || '生活服务'
    this.form.title = this.serviceName
  },
  methods: {
    async submitForm() {
      if (!this.form.title) {
        uni.showToast({
          title: '请先填写办理事项',
          icon: 'none'
        })
        return
      }

      await createLifeRecord({
        recordType: 'service',
        serviceName: this.serviceName,
        title: this.form.title,
        eventDate: this.form.eventDate,
        remark: this.form.remark,
        status: 'submitted'
      })

      uni.showToast({
        title: '已提交',
        icon: 'success'
      })

      setTimeout(() => {
        uni.navigateBack()
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-group {
  margin-bottom: 20rpx;
}
</style>
