<template>
  <view class="page-container">
    <view class="page-title">填写预约信息</view>
    <view class="page-subtitle">信息填好后，就能提交预约。</view>

    <section-card title="预约信息" class="section-gap">
      <view class="form-group"><view class="input-label">姓名</view><input v-model="form.name" class="input-box" placeholder="请输入姓名" /></view>
      <view class="form-group"><view class="input-label">手机号</view><input v-model="form.phone" class="input-box" placeholder="请输入手机号" /></view>
      <view class="form-group"><view class="input-label">就诊人信息</view><input v-model="form.patientName" class="input-box" placeholder="例如：本人 / 王阿姨" /></view>
      <view class="form-group"><view class="input-label">科室</view><input v-model="form.departmentName" class="input-box" disabled /></view>
      <view class="form-group"><view class="input-label">医生</view><input v-model="form.doctorName" class="input-box" disabled /></view>
      <view class="form-group"><view class="input-label">日期</view><input v-model="form.date" class="input-box" disabled /></view>
      <view class="form-group"><view class="input-label">时间段</view><input v-model="form.timeSlot" class="input-box" disabled /></view>
      <view class="form-group"><view class="input-label">备注</view><textarea v-model="form.notes" class="textarea-box" placeholder="可选，例如：需要家属陪同" /></view>
      <button class="primary-btn section-gap" @click="handleSubmit">提交预约</button>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../../components/common/SectionCard.vue'
import { createOutpatientAppointment, getOutpatientDoctors } from '../../../../api/health'

function getDefaultForm() {
  return { name: '', phone: '', patientName: '', departmentName: '', doctorName: '', date: '', timeSlot: '', notes: '' }
}

export default {
  components: { SectionCard },
  data() {
    return { doctorId: '', form: getDefaultForm() }
  },
  async onLoad(options) {
    this.doctorId = options.doctorId || ''
    const list = await getOutpatientDoctors({})
    const current = list.find((item) => String(item.id) === String(this.doctorId))
    if (current) {
      this.form.departmentName = current.departmentName
      this.form.doctorName = current.doctorName
      this.form.date = current.date
      this.form.timeSlot = current.timeSlot
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.form.name || !this.form.phone || !this.form.patientName) {
        uni.showToast({ title: '请先填写姓名、手机号和就诊人', icon: 'none' })
        return
      }
      await createOutpatientAppointment(this.form)
      uni.showToast({ title: '预约已提交', icon: 'success' })
      setTimeout(function() { uni.redirectTo({ url: '/pages/health/registration/records/index' }) }, 400)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-group { margin-bottom: 20rpx; }
</style>