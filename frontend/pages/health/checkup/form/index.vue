<template>
  <view class="page-container">
    <view class="page-title">填写体检预约</view>
    <view class="page-subtitle">把信息填好后，就能提交预约。</view>

    <section-card title="预约信息" class="section-gap">
      <view class="form-group"><view class="input-label">姓名</view><input v-model="form.name" class="input-box" placeholder="请输入姓名" /></view>
      <view class="form-group"><view class="input-label">手机号</view><input v-model="form.phone" class="input-box" placeholder="请输入手机号" /></view>
      <view class="form-group"><view class="input-label">套餐名称</view><input v-model="form.packageName" class="input-box" disabled /></view>
      <view class="form-group"><view class="input-label">预约日期</view><input v-model="form.date" class="input-box" placeholder="例如：2026-04-15" /></view>
      <view class="form-group"><view class="input-label">预约时间段</view><input v-model="form.timeSlot" class="input-box" placeholder="例如：上午 09:00-10:00" /></view>
      <view class="form-group"><view class="input-label">备注</view><textarea v-model="form.notes" class="textarea-box" placeholder="可选，例如：需要家属陪同" /></view>
      <button class="primary-btn section-gap" @click="handleSubmit">提交预约</button>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../../components/common/SectionCard.vue'
import { createCheckupAppointment, getCheckupPackageDetail } from '../../../../api/health'

export default {
  components: { SectionCard },
  data() {
    return {
      packageId: '',
      form: { name: '', phone: '', packageName: '', date: '', timeSlot: '', notes: '' }
    }
  },
  async onLoad(options) {
    this.packageId = options.id || ''
    const detail = await getCheckupPackageDetail(this.packageId)
    if (detail) {
      this.form.packageName = detail.name
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.form.name || !this.form.phone || !this.form.packageName || !this.form.date || !this.form.timeSlot) {
        uni.showToast({ title: '请把姓名、手机号和预约时间填完整', icon: 'none' })
        return
      }
      await createCheckupAppointment(this.form)
      uni.showToast({ title: '预约已提交', icon: 'success' })
      setTimeout(function() { uni.redirectTo({ url: '/pages/health/checkup/records/index' }) }, 400)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-group { margin-bottom: 20rpx; }
</style>