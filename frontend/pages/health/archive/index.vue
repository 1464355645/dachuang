<template>
  <view class="page-container">
    <view class="page-title">健康档案</view>
    <view class="page-subtitle">把最近的健康使用记录集中展示。</view>

    <section-card title="最近一次健康建议" class="section-gap">
      <view class="archive-text">{{ profile.latestAdvice || '暂无健康建议，您可以先做一次身体不适查询。' }}</view>
    </section-card>

    <view class="stats-grid section-gap">
      <info-stat-card :value="profile.medicationCount" label="用药提醒" />
      <info-stat-card :value="profile.discomfortCount || 0" label="不适记录" />
      <info-stat-card :value="profile.knowledgeReadCount || 0" label="已读知识" />
      <info-stat-card :value="profile.checkupCount || 0" label="体检预约" />
    </view>

    <section-card title="健康状态摘要" class="section-gap">
      <view class="archive-text">{{ profile.summary }}</view>
    </section-card>

    <section-card title="最近不适记录" class="section-gap">
      <view v-if="profile.recentDiscomforts && profile.recentDiscomforts.length">
        <view v-for="item in profile.recentDiscomforts" :key="item.id" class="record-item">
          <view class="record-item__title">{{ item.symptom }}</view>
          <view class="record-item__meta">{{ item.createdAt }}</view>
          <view class="record-item__meta">{{ item.advice }}</view>
        </view>
      </view>
      <view v-else class="empty-text">暂时没有不适记录。</view>
    </section-card>

    <section-card title="最近阅读的健康知识" class="section-gap">
      <view v-if="profile.recentArticles && profile.recentArticles.length">
        <view v-for="item in profile.recentArticles" :key="item.articleId" class="record-item">
          <view class="record-item__title">{{ item.title }}</view>
          <view class="record-item__meta">{{ item.lastReadAt }}</view>
        </view>
      </view>
      <view v-else class="empty-text">暂时没有阅读记录。</view>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../components/common/SectionCard.vue'
import InfoStatCard from '../../../components/common/InfoStatCard.vue'
import { getHealthProfile } from '../../../api/health'

export default {
  components: {
    SectionCard,
    InfoStatCard
  },
  data() {
    return {
      profile: {
        latestAdvice: '',
        medicationCount: 0,
        discomfortCount: 0,
        knowledgeReadCount: 0,
        summary: '',
        recentDiscomforts: [],
        recentArticles: []
      }
    }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.profile = await getHealthProfile()
    }
  }
}
</script>

<style lang="scss" scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}

.archive-text {
  font-size: 30rpx;
  line-height: 1.8;
  color: #42565d;
}

.record-item {
  padding: 20rpx 0;
  border-bottom: 2rpx solid #edf3ef;
}

.record-item:last-child {
  border-bottom: none;
}

.record-item__title {
  font-size: 30rpx;
  font-weight: 700;
}

.record-item__meta {
  margin-top: 8rpx;
  color: #607176;
  font-size: 26rpx;
}
</style>
