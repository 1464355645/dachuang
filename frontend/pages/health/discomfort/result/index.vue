<template>
  <view class="page-container">
    <view class="page-title">建议说明</view>
    <view class="page-subtitle">以下内容仅供日常参考。</view>

    <section-card title="当前不适" class="section-gap">
      <view class="info-text">{{ detail.symptomType || detail.symptom }}</view>
      <view class="info-meta">查询时间：{{ detail.createdAt }}</view>
    </section-card>

    <section-card title="基础建议" class="section-gap">
      <view class="info-text">{{ detail.suggestion || detail.advice }}</view>
    </section-card>

    <section-card title="注意事项" class="section-gap">
      <view class="info-text">{{ detail.precautions }}</view>
    </section-card>

    <section-card title="饮食建议" class="section-gap">
      <view class="info-text">{{ detail.dietTip }}</view>
    </section-card>

    <section-card title="是否建议及时就医" class="section-gap">
      <view class="info-text">{{ detail.doctorTip }}</view>
      <view class="tip-note">{{ detail.referenceTip || '仅供日常参考，如身体持续不适请及时就医。' }}</view>
    </section-card>

    <button class="primary-btn section-gap" @click="goBack">返回继续查看</button>
  </view>
</template>

<script>
import SectionCard from '../../../../components/common/SectionCard.vue'
import { getDiscomfortRecordDetail } from '../../../../api/health'

export default {
  components: { SectionCard },
  data() {
    return { detail: {} }
  },
  async onLoad(options) {
    this.detail = (await getDiscomfortRecordDetail(options.id)) || {}
  },
  methods: {
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
.info-text { font-size: 30rpx; line-height: 1.9; color: #42565d; }
.info-meta { margin-top: 12rpx; color: #607176; font-size: 26rpx; }
.tip-note { margin-top: 16rpx; color: #c06a2f; font-size: 26rpx; line-height: 1.7; }
</style>