<template>
  <view class="page-container">
    <view class="card">
      <view class="post-header">
        <view class="post-author">{{ post.author }}</view>
        <view class="post-circle">{{ post.circle }}</view>
      </view>
      <view class="post-title">{{ post.title }}</view>
      <view class="post-content">{{ post.content }}</view>
      <view class="post-meta">发布时间：{{ post.createdAt }}</view>
      <view class="post-tags">
        <text v-for="tag in post.tags || []" :key="tag" class="tag">{{ tag }}</text>
      </view>
      <view class="post-actions">
        <button class="mini-btn" @click="handleLike">{{ post.isLiked ? '已点赞' : '点赞' }} {{ post.likeCount }}</button>
        <button class="mini-btn" @click="handleCollect">{{ post.isCollected ? '已收藏' : '收藏' }} {{ post.collectCount }}</button>
        <button class="mini-btn danger-text" @click="handleReport">举报</button>
      </view>
    </view>

    <section-card title="最新评论" subtitle="大家都在聊" class="section-gap">
      <view v-if="comments.length">
        <view v-for="item in comments" :key="item.id" class="comment-item">
          <view class="comment-author">{{ item.author }}</view>
          <view class="comment-content">{{ item.content }}</view>
          <view class="comment-time">{{ item.createdAt }}</view>
        </view>
      </view>
      <view v-else class="empty-text">还没有评论，快来聊聊。</view>
    </section-card>

    <view class="comment-box">
      <input v-model="commentText" class="input-box" placeholder="输入评论内容" />
      <button class="primary-btn" @click="handleComment">发送评论</button>
    </view>
  </view>
</template>

<script>
import SectionCard from '../../../components/common/SectionCard.vue'
import {
  addCommunityComment,
  getCommunityPostDetail,
  reportCommunityContent,
  toggleCommunityCollect,
  toggleCommunityLike
} from '../../../api/community-home'

export default {
  components: {
    SectionCard
  },
  data() {
    return {
      postId: null,
      post: {},
      comments: [],
      commentText: ''
    }
  },
  async onLoad(options) {
    this.postId = Number(options.id)
    await this.loadDetail()
  },
  methods: {
    async loadDetail() {
      const data = await getCommunityPostDetail(this.postId)
      this.post = data.post || {}
      this.comments = data.comments || []
    },
    async handleLike() {
      await toggleCommunityLike(this.postId)
      await this.loadDetail()
    },
    async handleCollect() {
      await toggleCommunityCollect(this.postId)
      await this.loadDetail()
    },
    async handleReport() {
      await reportCommunityContent({
        targetId: this.postId,
        targetType: 'post',
        reason: '不当内容'
      })
      uni.showToast({
        title: '已收到举报',
        icon: 'success'
      })
    },
    async handleComment() {
      const content = this.commentText.trim()
      if (!content) {
        uni.showToast({
          title: '请输入评论内容',
          icon: 'none'
        })
        return
      }
      await addCommunityComment(this.postId, content)
      this.commentText = ''
      await this.loadDetail()
      uni.showToast({
        title: '评论成功',
        icon: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16rpx;
}

.post-author {
  font-size: 32rpx;
  font-weight: 700;
}

.post-circle {
  font-size: 24rpx;
  color: #1f8a70;
  background: #e8f5ef;
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
}

.post-title {
  margin-top: 10rpx;
  font-size: 36rpx;
  font-weight: 700;
}

.post-content {
  margin-top: 12rpx;
  font-size: 30rpx;
  color: #42565d;
}

.post-meta {
  margin-top: 12rpx;
  color: #607176;
  font-size: 24rpx;
}

.post-tags {
  margin-top: 10rpx;
  display: flex;
  gap: 10rpx;
  flex-wrap: wrap;
}

.post-actions {
  margin-top: 16rpx;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12rpx;
}

.mini-btn {
  height: 78rpx;
  line-height: 78rpx;
  border-radius: 18rpx;
  background: #f1f5f2;
  color: #42565d;
  font-size: 26rpx;
}

.danger-text {
  color: #e76f51;
}

.comment-item {
  padding: 18rpx 0;
  border-bottom: 2rpx solid #edf3ef;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-author {
  font-size: 28rpx;
  font-weight: 700;
}

.comment-content {
  margin-top: 8rpx;
  font-size: 28rpx;
  color: #42565d;
}

.comment-time {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: #607176;
}

.comment-box {
  margin-top: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
