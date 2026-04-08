<template>
  <view class="page-container">
    <view class="page-title">医疗健康服务</view>
    <view class="page-subtitle">为您准备了常用健康服务，按需要点击即可。</view>

    <section-card title="常用入口" subtitle="点一下进入，不用找来找去" class="section-gap">
      <feature-grid :items="items" @select="handleSelect" />
    </section-card>

    <section-card title="温馨提示" class="section-gap">
      <view class="tip-text">本模块内容仅供日常参考，如身体持续不适，请及时就医。</view>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../components/common/SectionCard.vue'
import FeatureGrid from '../../../components/common/FeatureGrid.vue'

export default {
  components: {
    SectionCard,
    FeatureGrid
  },
  data() {
    return {
      items: [
        { title: '身体不适查询', desc: '查看基础建议和历史记录', icon: '查', path: '/pages/health/discomfort/index' },
        { title: '用药提醒', desc: '新增、编辑、删除提醒', icon: '药', path: '/pages/health/medication/index' },
        { title: '健康知识', desc: '按分类查看健康内容', icon: '知', path: '/pages/health/knowledge/index' },
        { title: '门诊挂号预约', desc: '选择科室和号源完成预约', icon: '号', path: '/pages/health/registration/index' },
        { title: '健康体检预约', desc: '查看套餐并提交预约', icon: '检', path: '/pages/health/checkup/index' }
      ]
    }
  },
  methods: {
    handleSelect(item) {
      uni.navigateTo({ url: item.path })
    }
  }
}
</script>

<style lang="scss" scoped>
.tip-text {
  font-size: 30rpx;
  line-height: 1.8;
  color: #42565d;
}
</style>