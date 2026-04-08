<template>
  <view class="page-container">
    <view class="page-title">健康知识</view>
    <view class="page-subtitle">内容按分类展示，字大一点，看着更轻松。</view>

    <view class="card section-gap">
      <input v-model="keyword" class="input-box" placeholder="输入标题关键字" confirm-type="search" @confirm="reloadData" />
      <scroll-view class="section-gap" scroll-x>
        <view class="category-row">
          <view
            v-for="item in categories"
            :key="item"
            class="category-chip"
            :class="{ 'category-chip--active': currentCategory === item }"
            @click="changeCategory(item)"
          >
            {{ item }}
          </view>
        </view>
      </scroll-view>
    </view>

    <section-card title="知识列表" class="section-gap">
      <view v-if="articles.length">
        <view v-for="item in articles" :key="item.id" class="article-card" @click="goDetail(item.id)">
          <view class="article-card__row">
            <view class="tag">{{ item.category }}</view>
            <view class="tag">{{ item.readMinutes }} 分钟</view>
            <view v-if="item.isFavorite" class="tag">已收藏</view>
          </view>
          <view class="article-card__title">{{ item.title }}</view>
          <view class="article-card__summary">{{ item.summary }}</view>
          <view class="article-card__meta">发布时间：{{ item.publishedAt }}</view>
        </view>
        <button v-if="pagination.hasMore" class="secondary-btn section-gap" @click="loadMore">加载更多</button>
      </view>
      <view v-else class="empty-text">暂无健康知识内容。</view>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../components/common/SectionCard.vue'
import { getHealthArticles, getHealthKnowledgeCategories } from '../../../api/health'

export default {
  components: { SectionCard },
  data() {
    return {
      keyword: '',
      categories: [],
      currentCategory: '全部',
      page: 1,
      articles: [],
      pagination: { hasMore: false }
    }
  },
  async onLoad() {
    this.categories = await getHealthKnowledgeCategories()
    this.reloadData()
  },
  methods: {
    async reloadData() {
      this.page = 1
      const result = await getHealthArticles({ page: 1, pageSize: 5, category: this.currentCategory, keyword: this.keyword })
      this.articles = result.list || []
      this.pagination = result.pagination || { hasMore: false }
      this.page = 2
    },
    async loadMore() {
      const result = await getHealthArticles({ page: this.page, pageSize: 5, category: this.currentCategory, keyword: this.keyword })
      this.articles = this.articles.concat(result.list || [])
      this.pagination = result.pagination || { hasMore: false }
      this.page += 1
    },
    changeCategory(item) {
      this.currentCategory = item
      this.reloadData()
    },
    goDetail(id) {
      uni.navigateTo({ url: '/pages/health/knowledge-detail/index?id=' + id })
    }
  }
}
</script>

<style lang="scss" scoped>
.category-row { display: flex; gap: 16rpx; white-space: nowrap; }
.category-chip { display: inline-flex; align-items: center; justify-content: center; padding: 14rpx 24rpx; border-radius: 999rpx; background: #edf3ef; color: #42565d; font-size: 26rpx; }
.category-chip--active { background: #1f8a70; color: #fff; }
.article-card { padding: 22rpx 0; border-bottom: 2rpx solid #edf3ef; }
.article-card:last-child { border-bottom: none; }
.article-card__row { display: flex; gap: 12rpx; flex-wrap: wrap; }
.article-card__title { margin-top: 14rpx; font-size: 32rpx; font-weight: 700; }
.article-card__summary, .article-card__meta { margin-top: 10rpx; color: #607176; font-size: 28rpx; line-height: 1.7; }
</style>