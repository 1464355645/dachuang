<template>
  <view class="page-container">
    <view class="page-title">周边设施</view>
    <view class="page-subtitle">医院、超市、公园、办事点都能查。</view>

    <view class="card section-gap">
      <input v-model="keyword" class="input-box" placeholder="输入名称或类别搜索" @confirm="loadData" />
      <scroll-view scroll-x class="section-gap">
        <view class="category-row">
          <view class="category-chip" :class="{ 'category-chip--active': category === '' }" @click="changeCategory('')">全部</view>
          <view
            v-for="item in categories"
            :key="item"
            class="category-chip"
            :class="{ 'category-chip--active': category === item }"
            @click="changeCategory(item)"
          >
            {{ item }}
          </view>
        </view>
      </scroll-view>
    </view>

    <section-card title="设施列表" class="section-gap">
      <view v-if="list.length">
        <view v-for="item in list" :key="item.id" class="facility-card" @click="goDetail(item.id)">
          <view class="facility-card__top">
            <view class="facility-card__title">{{ item.name }}</view>
            <view class="tag">{{ item.distance }}</view>
          </view>
          <view class="facility-card__meta">{{ item.category }}</view>
          <view class="facility-card__meta">{{ item.address }}</view>
          <view class="facility-card__meta">电话：{{ item.contact }}</view>
        </view>
      </view>
      <view v-else class="empty-text">没有找到相关设施。</view>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../../components/common/SectionCard.vue'
import { getFacilityList } from '../../../../api/life-services'

export default {
  components: {
    SectionCard
  },
  data() {
    return {
      keyword: '',
      category: '',
      categories: ['医院药店', '超市菜场', '公园休闲', '办事大厅'],
      list: []
    }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.list = await getFacilityList({
        keyword: this.keyword,
        category: this.category
      })
    },
    changeCategory(category) {
      this.category = category
      this.loadData()
    },
    goDetail(id) {
      uni.navigateTo({
        url: '/pages/service/facility/detail/index?id=' + id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.category-row {
  display: flex;
  gap: 16rpx;
}

.category-chip {
  flex-shrink: 0;
  padding: 14rpx 24rpx;
  border-radius: 999rpx;
  background: #edf3ef;
  color: #42565d;
  font-size: 28rpx;
}

.category-chip--active {
  background: #1f8a70;
  color: #fff;
}

.facility-card {
  padding: 22rpx 0;
  border-bottom: 2rpx solid #edf3ef;
}

.facility-card:last-child {
  border-bottom: none;
}

.facility-card__top {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.facility-card__title {
  font-size: 32rpx;
  font-weight: 700;
}

.facility-card__meta {
  margin-top: 8rpx;
  color: #607176;
  font-size: 28rpx;
}
</style>