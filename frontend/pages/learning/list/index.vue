<template>
  <view class="page-container">
    <view class="page-title">学习服务</view>
    <view class="page-subtitle">内容分得清楚，按需要慢慢学就好。</view>

    <section-card title="今日推荐" subtitle="今天先看这一条" class="section-gap">
      <view v-if="todayRecommendation" class="recommend-card" @click="goDetail(todayRecommendation.id)">
        <view class="recommend-card__row">
          <view class="tag">{{ todayRecommendation.module }}</view>
          <view class="tag">{{ todayRecommendation.category }}</view>
        </view>
        <view class="recommend-card__title">{{ todayRecommendation.title }}</view>
        <view class="recommend-card__summary">{{ todayRecommendation.summary }}</view>
      </view>
      <view v-else class="empty-text">今天暂时没有推荐内容。</view>
    </section-card>

    <section-card title="学习分类" subtitle="五类内容，按分类进入" class="section-gap">
      <feature-grid :items="moduleItems" @select="goModule" />
    </section-card>

    <view class="stats-grid section-gap">
      <info-stat-card :value="archive.learnedCount || 0" label="已学习" />
      <info-stat-card :value="archive.readCount || 0" label="已阅读" />
      <info-stat-card :value="archive.favoriteCount || 0" label="已收藏" />
      <info-stat-card :value="archive.recommendations ? archive.recommendations.length : 0" label="待学习" />
    </view>

    <section-card title="最近学习" subtitle="继续上次内容更方便" class="section-gap">
      <view v-if="archive.recentRecords && archive.recentRecords.length">
        <view v-for="item in archive.recentRecords.slice(0, 3)" :key="item.contentId" class="recent-card" @click="goDetail(item.contentId)">
          <view class="recent-card__title">{{ item.title }}</view>
          <view class="recent-card__meta">{{ item.module }} · {{ item.category }}</view>
          <view class="recent-card__meta">{{ item.lastViewedAt }}</view>
        </view>
      </view>
      <view v-else class="empty-text">您还没有学习记录，可以先从今日推荐开始。</view>
      <button class="secondary-btn section-gap" @click="goArchive">查看学习档案</button>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../components/common/SectionCard.vue'
import FeatureGrid from '../../../components/common/FeatureGrid.vue'
import InfoStatCard from '../../../components/common/InfoStatCard.vue'
import { getLearningModules, getStudyArchive, getTodayRecommendation } from '../../../api/learning'

export default {
  components: {
    SectionCard,
    FeatureGrid,
    InfoStatCard
  },
  data() {
    return {
      moduleItems: [],
      todayRecommendation: null,
      archive: {
        learnedCount: 0,
        readCount: 0,
        favoriteCount: 0,
        recommendations: [],
        recentRecords: []
      }
    }
  },
  async onLoad(options) {
    if (options && options.module) {
      uni.redirectTo({
        url: '/pages/learning/content-list/index?module=' + options.module
      })
      return
    }
    await this.loadData()
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const modules = await getLearningModules()
      this.moduleItems = (modules || []).map(function(item) {
        return {
          title: item.name,
          desc: item.desc,
          icon: item.icon,
          name: item.name
        }
      })
      this.todayRecommendation = await getTodayRecommendation()
      this.archive = await getStudyArchive()
    },
    goModule(item) {
      uni.navigateTo({
        url: '/pages/learning/content-list/index?module=' + encodeURIComponent(item.name || item.title)
      })
    },
    goDetail(id) {
      uni.navigateTo({
        url: '/pages/learning/detail/index?id=' + id
      })
    },
    goArchive() {
      uni.navigateTo({
        url: '/pages/learning/archive/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.recommend-card,
.recent-card {
  padding: 20rpx 0;
  border-bottom: 2rpx solid #edf3ef;
}

.recommend-card:last-child,
.recent-card:last-child {
  border-bottom: none;
}

.recommend-card__row {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.recommend-card__title,
.recent-card__title {
  margin-top: 14rpx;
  font-size: 32rpx;
  font-weight: 700;
}

.recommend-card__summary,
.recent-card__meta {
  margin-top: 10rpx;
  color: #607176;
  font-size: 28rpx;
  line-height: 1.7;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}
</style>