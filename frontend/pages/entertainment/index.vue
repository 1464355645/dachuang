<template>
  <view class="page-container">
    <view class="page-title">娱乐频道</view>
    <view class="page-subtitle">点一下就能看，内容简单清楚。</view>

    <section-card title="正在播放" subtitle="先用示例视频占位" class="section-gap">
      <view v-if="currentVideo.id">
        <view class="tag">{{ currentVideo.category }}</view>
        <view class="video-title">{{ currentVideo.title }}</view>
        <video
          class="video-player section-gap"
          :src="currentVideo.videoUrl"
          :poster="currentVideo.coverUrl"
          controls
          object-fit="cover"
        />
      </view>
      <view v-else class="empty-text">暂时没有视频内容。</view>
    </section-card>

    <section-card title="视频列表" subtitle="可作为后续娱乐内容入口" class="section-gap">
      <view v-if="videos.length">
        <view
          v-for="item in videos"
          :key="item.id"
          class="video-card"
          @click="selectVideo(item)"
        >
          <image class="video-card__cover" :src="item.coverUrl" mode="aspectFill" />
          <view class="video-card__body">
            <view class="video-card__title">{{ item.title }}</view>
            <view class="video-card__meta">{{ item.category }}</view>
          </view>
        </view>
      </view>
      <view v-else class="empty-text">暂时没有视频内容。</view>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../components/common/SectionCard.vue'
import { getEntertainmentVideos } from '../../api/home'

export default {
  components: {
    SectionCard
  },
  data() {
    return {
      videos: [],
      currentVideo: {}
    }
  },
  onLoad() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const list = await getEntertainmentVideos()
      this.videos = list || []
      this.currentVideo = this.videos[0] || {}
    },
    selectVideo(item) {
      this.currentVideo = item
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 200
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.video-title {
  margin-top: 14rpx;
  font-size: 34rpx;
  font-weight: 700;
}

.video-player {
  width: 100%;
  height: 360rpx;
  border-radius: 20rpx;
  overflow: hidden;
}

.video-card {
  display: flex;
  gap: 20rpx;
  padding: 22rpx 0;
  border-bottom: 2rpx solid #edf3ef;
}

.video-card:last-child {
  border-bottom: none;
}

.video-card__cover {
  width: 180rpx;
  height: 120rpx;
  border-radius: 20rpx;
  background: #eef3ef;
}

.video-card__body {
  flex: 1;
}

.video-card__title {
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1.6;
}

.video-card__meta {
  margin-top: 10rpx;
  color: #607176;
  font-size: 26rpx;
}
</style>
