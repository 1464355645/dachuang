<template>
  <view class="page-container">
    <view class="page-title">{{ form.id ? '编辑提醒' : '新增提醒' }}</view>
    <view class="page-subtitle">把常用信息填清楚，后面查看更方便。</view>

    <section-card title="提醒信息" class="section-gap">
      <view class="form-group"><view class="input-label">药名</view><input v-model="form.medicineName" class="input-box" placeholder="例如：降压药" /></view>
      <view class="form-group"><view class="input-label">服药时间</view><input v-model="form.time" class="input-box" placeholder="例如：08:00" /></view>
      <view class="form-group"><view class="input-label">服药频率</view><input v-model="form.frequency" class="input-box" placeholder="例如：每天一次" /></view>
      <view class="form-group"><view class="input-label">用量</view><input v-model="form.dosage" class="input-box" placeholder="例如：每次 1 片" /></view>
      <view class="form-group"><view class="input-label">备注</view><textarea v-model="form.notes" class="textarea-box" placeholder="例如：饭后服用" /></view>
      <button class="primary-btn section-gap" @click="handleSubmit">保存提醒</button>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../../components/common/SectionCard.vue'
import { createMedicationReminder, getMedicationReminders, updateMedicationReminder } from '../../../../api/health'

function getDefaultForm() {
  return { id: '', medicineName: '', time: '', frequency: '', dosage: '', notes: '' }
}

export default {
  components: { SectionCard },
  data() {
    return { form: getDefaultForm() }
  },
  async onLoad(options) {
    if (options.id) {
      const list = await getMedicationReminders()
      const current = list.find((item) => String(item.id) === String(options.id))
      if (current) {
        this.form = { id: current.id, medicineName: current.medicineName, time: current.time, frequency: current.frequency, dosage: current.dosage || '', notes: current.notes || '' }
      }
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.form.medicineName || !this.form.time || !this.form.frequency) {
        uni.showToast({ title: '请先填写药名、时间和频率', icon: 'none' })
        return
      }
      if (this.form.id) {
        await updateMedicationReminder(this.form.id, this.form)
      } else {
        await createMedicationReminder(this.form)
      }
      uni.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(function() { uni.navigateBack() }, 400)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-group { margin-bottom: 20rpx; }
</style>