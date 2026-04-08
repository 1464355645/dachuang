<template>
  <view class="page-container">
    <view class="page-title">学习档案</view>
    <view class="page-subtitle">把已经看过、学过、收藏过的内容集中展示。</view>

    <section-card title="今日推荐" class="section-gap">
      <view v-if="archive.todayRecommendation" class="record-item" @click="goDetail(archive.todayRecommendation.id)">
        <view class="record-item__title">{{ archive.todayRecommendation.title }}</view>
        <view class="record-item__meta">{{ archive.todayRecommendation.module }} · {{ archive.todayRecommendation.category }}</view>
      </view>
      <view v-else class="empty-text">今天暂时没有推荐内容。</view>
    </section-card>

    <view class="stats-grid section-gap">
      <info-stat-card :value="archive.learnedCount || 0" label="已学习数量" />
      <info-stat-card :value="archive.readCount || 0" label="已读内容" />
      <info-stat-card :value="archive.favoriteCount || 0" label="已收藏" />
      <info-stat-card :value="archive.recommendations ? archive.recommendations.length : 0" label="继续学习" />
    </view>

    <view class="stats-grid section-gap">
      <info-stat-card :value="archive.dailyProgress || 0" label="今日学习" />
      <info-stat-card :value="archive.weeklyProgress || 0" label="本周学习" />
    </view>

    <section-card title="最近学习记录" class="section-gap">
      <view v-if="archive.recentRecords && archive.recentRecords.length">
        <view v-for="item in archive.recentRecords" :key="item.contentId" class="record-item" @click="goDetail(item.contentId)">
          <view class="record-item__title">{{ item.title }}</view>
          <view class="record-item__meta">{{ item.module }} · {{ item.category }}</view>
          <view class="record-item__meta">{{ item.lastViewedAt }}</view>
        </view>
      </view>
      <view v-else class="empty-text">您还没有学习记录，先去学习服务看看吧。</view>
    </section-card>

    <section-card title="分类统计" class="section-gap">
      <view v-if="archive.moduleStats && archive.moduleStats.length">
        <view v-for="item in archive.moduleStats" :key="item.module" class="record-item">
          <view class="record-item__title">{{ item.module }}</view>
          <view class="record-item__meta">已学 {{ item.completed }} / {{ item.total }}</view>
          <view class="record-item__meta">已读 {{ item.readCount }} · 收藏 {{ item.favoriteCount }}</view>
        </view>
      </view>
      <view v-else class="empty-text">暂时没有分类统计。</view>
    </section-card>

    <section-card title="推荐继续学习" class="section-gap">
      <view v-if="archive.recommendations && archive.recommendations.length">
        <view v-for="item in archive.recommendations" :key="item.id" class="record-item" @click="goDetail(item.id)">
          <view class="record-item__title">{{ item.title }}</view>
          <view class="record-item__meta">{{ item.module }} · {{ item.category }}</view>
        </view>
      </view>
      <view v-else class="empty-text">目前没有更多推荐内容。</view>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../components/common/SectionCard.vue'
import InfoStatCard from '../../../components/common/InfoStatCard.vue'
import { getStudyArchive } from '../../../api/learning'

export default {
  components: {
    SectionCard,
    InfoStatCard
  },
  data() {
    return {
      archive: {
        learnedCount: 0,
        readCount: 0,
        favoriteCount: 0,
        dailyProgress: 0,
        weeklyProgress: 0,
        recentRecords: [],
        recommendations: [],
        moduleStats: [],
        todayRecommendation: null
      }
    }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.archive = await getStudyArchive()
    },
    goDetail(id) {
      uni.navigateTo({
        url: '/pages/learning/detail/index?id=' + id
      })
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