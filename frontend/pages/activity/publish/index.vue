<template>
  <view class="page-container">
    <view class="page-title">发布活动</view>
    <view class="page-subtitle">把活动信息填清楚，方便大家参加。</view>

    <view class="card section-gap">
      <view class="form-group">
        <view class="input-label">活动名称</view>
        <input v-model="form.title" class="input-box" placeholder="例如：社区合唱活动" />
      </view>
      <view class="form-group">
        <view class="input-label">活动目的</view>
        <input v-model="form.purpose" class="input-box" placeholder="例如：丰富业余生活" />
      </view>
      <view class="form-group">
        <view class="input-label">活动时间</view>
        <input v-model="form.time" class="input-box" placeholder="例如：2026-04-10 15:00" />
      </view>
      <view class="form-group">
        <view class="input-label">活动地点</view>
        <input v-model="form.location" class="input-box" placeholder="例如：社区活动室" />
      </view>
      <view class="form-group">
        <view class="input-label">人数</view>
        <input v-model="form.peopleCount" class="input-box" type="number" placeholder="例如：20" />
      </view>
      <view class="form-group">
        <view class="input-label">活动说明</view>
        <textarea v-model="form.description" class="textarea-box" placeholder="请简单说明活动内容" />
      </view>
      <button class="primary-btn section-gap" @click="handleSubmit">提交活动</button>
    </view>
  </view>
</template>

<script>
import { submitActivity } from '../../../api/activity'

function getDefaultForm() {
  return {
    title: '',
    purpose: '',
    time: '',
    location: '',
    peopleCount: '',
    description: ''
  }
}

export default {
  data() {
    return {
      form: getDefaultForm()
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.form.title || !this.form.purpose || !this.form.time || !this.form.location) {
        uni.showToast({
          title: '请先把主要信息填写完整',
          icon: 'none'
        })
        return
      }
      await submitActivity({
        title: this.form.title,
        purpose: this.form.purpose,
        time: this.form.time,
        location: this.form.location,
        peopleCount: Number(this.form.peopleCount || 0),
        description: this.form.description
      })
      uni.showToast({
        title: '发布成功',
        icon: 'success'
      })
      this.form = getDefaultForm()
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/activity/list/index'
        })
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
