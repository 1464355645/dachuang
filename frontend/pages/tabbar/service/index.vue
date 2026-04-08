<template>
  <view class="page-container">
    <view class="page-title">服务大厅</view>
    <view class="page-subtitle">分区清楚，点大按钮就能进入。</view>

    <section-card title="生活服务" subtitle="先做基础表单和记录" class="section-gap">
      <feature-grid :items="lifeServices" @select="handleServiceClick" />
    </section-card>

    <section-card title="医疗健康" subtitle="常用健康功能放在这里" class="section-gap">
      <feature-grid :items="healthServices" @select="handleServiceClick" />
    </section-card>

    <section-card title="学习服务" subtitle="按分类学习，更容易找" class="section-gap">
      <feature-grid :items="studyServices" @select="handleServiceClick" />
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
      lifeServices: [
        { title: '出行游玩', icon: '行', path: '/pages/service/travel/list/index' },
        { title: '网上办事', icon: '办', path: '/pages/service/affair/form/index' },
        { title: '水电气缴费', icon: '缴', path: '/pages/service/bills/list/index' },
        { title: '医保社保', icon: '保', path: '/pages/service/insurance/index' },
        { title: '周边设施', icon: '周', path: '/pages/service/facility/list/index' }
      ],
      healthServices: [
        { title: '身体不适查询', icon: '查', path: '/pages/health/discomfort/index' },
        { title: '用药提醒', icon: '药', path: '/pages/health/medication/index' },
        { title: '健康知识', icon: '知', path: '/pages/health/knowledge/index' },
        { title: '门诊挂号预约', icon: '号', path: '/pages/health/registration/index' },
        { title: '健康体检预约', icon: '检', path: '/pages/health/checkup/index' }
      ],
      studyServices: [
        { title: '常用软件教程', icon: '软', path: '/pages/learning/content-list/index?module=' + encodeURIComponent('常用软件教程') },
        { title: '养生攻略', icon: '养', path: '/pages/learning/content-list/index?module=' + encodeURIComponent('养生攻略') },
        { title: '普法栏目', icon: '法', path: '/pages/learning/content-list/index?module=' + encodeURIComponent('普法栏目') },
        { title: '每日新闻', icon: '闻', path: '/pages/learning/content-list/index?module=' + encodeURIComponent('每日新闻') },
        { title: '反诈防骗', icon: '防', path: '/pages/learning/content-list/index?module=' + encodeURIComponent('反诈防骗') }
      ]
    }
  },
  methods: {
    handleServiceClick(item) {
      uni.navigateTo({
        url: item.path
      })
    }
  }
}
</script>
