<template>
  <view class="page-container">
    <view class="page-title">{{ moduleName || '学习内容' }}</view>
    <view class="page-subtitle">按分类查看内容，学过的会自动记下来。</view>

    <view class="card section-gap">
      <input v-model="keyword" class="input-box" placeholder="输入标题关键字" confirm-type="search" @confirm="reloadData" />
      <scroll-view class="section-gap" scroll-x>
        <view class="category-row">
          <view class="category-chip" :class="{ 'category-chip--active': currentCategory === '' }" @click="changeCategory('')">全部</view>
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

    <section-card title="推荐先学" subtitle="适合先看这些内容" class="section-gap">
      <view v-if="recommended.length">
        <view v-for="item in recommended" :key="item.id" class="recommend-item" @click="goDetail(item.id)">
          <view class="recommend-item__title">{{ item.title }}</view>
          <view class="recommend-item__meta">{{ item.category }} · {{ item.duration }} 分钟</view>
        </view>
      </view>
      <view v-else class="empty-text">当前没有推荐内容。</view>
    </section-card>

    <section-card title="内容列表" class="section-gap">
      <view v-if="contents.length">
        <view v-for="item in contents" :key="item.id" class="study-card" @click="goDetail(item.id)">
          <view class="study-card__row">
            <view class="tag">{{ item.category }}</view>
            <view class="tag">{{ item.difficulty }}</view>
            <view v-if="item.isFavorite" class="tag">已收藏</view>
            <view v-if="item.status === 'completed'" class="tag">已学</view>
          </view>
          <view class="study-card__title">{{ item.title }}</view>
          <view class="study-card__summary">{{ item.summary }}</view>
          <view class="study-card__meta">预计学习 {{ item.duration }} 分钟</view>
          <view class="progress-row">
            <view class="progress-track">
              <view class="progress-fill" :style="{ width: (item.progress || 0) + '%' }"></view>
            </view>
            <text class="progress-text">{{ item.progress || 0 }}%</text>
          </view>
        </view>
        <button v-if="pagination.hasMore" class="secondary-btn section-gap" @click="loadMore">加载更多</button>
      </view>
      <view v-else class="empty-text">当前分类下暂时没有内容。</view>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../components/common/SectionCard.vue'
import { getLearningCategories, getLearningList } from '../../../api/learning'

export default {
  components: {
    SectionCard
  },
  data() {
    return {
      moduleName: '',
      keyword: '',
      currentCategory: '',
      categories: [],
      contents: [],
      recommended: [],
      page: 1,
      pagination: {
        hasMore: false
      }
    }
  },
  async onLoad(options) {
    this.moduleName = decodeURIComponent((options && options.module) || '')
    await this.loadCategories()
    await this.reloadData()
  },
  methods: {
    async loadCategories() {
      this.categories = await getLearningCategories(this.moduleName)
    },
    async reloadData() {
      this.page = 1
      const result = await getLearningList({
        module: this.moduleName,
        category: this.currentCategory,
        keyword: this.keyword,
        page: 1,
        pageSize: 6
      })
      this.contents = result.list || []
      this.recommended = result.recommended || []
      this.pagination = result.pagination || { hasMore: false }
      this.page = 2
    },
    async loadMore() {
      const result = await getLearningList({
        module: this.moduleName,
        category: this.currentCategory,
        keyword: this.keyword,
        page: this.page,
        pageSize: 6
      })
      this.contents = this.contents.concat(result.list || [])
      this.pagination = result.pagination || { hasMore: false }
      this.page += 1
    },
    changeCategory(category) {
      this.currentCategory = category
      this.reloadData()
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
.category-row {
  display: flex;
  gap: 16rpx;
  white-space: nowrap;
}

.category-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14rpx 24rpx;
  border-radius: 999rpx;
  background: #edf3ef;
  color: #42565d;
  font-size: 26rpx;
}

.category-chip--active {
  background: #1f8a70;
  color: #fff;
}

.recommend-item,
.study-card {
  padding: 22rpx 0;
  border-bottom: 2rpx solid #edf3ef;
}

.recommend-item:last-child,
.study-card:last-child {
  border-bottom: none;
}

.recommend-item__title,
.study-card__title {
  margin-top: 14rpx;
  font-size: 32rpx;
  font-weight: 700;
}

.recommend-item__meta,
.study-card__summary,
.study-card__meta {
  margin-top: 10rpx;
  color: #607176;
  font-size: 28rpx;
  line-height: 1.7;
}

.study-card__row {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin-top: 14rpx;
}

.progress-track {
  flex: 1;
  height: 14rpx;
  border-radius: 999rpx;
  background: #e5efe9;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #1f8a70;
}

.progress-text {
  color: #607176;
  font-size: 24rpx;
}
</style>