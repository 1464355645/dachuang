<template>
  <view class="page-container">
    <view class="page-title">个人中心</view>
    <view class="page-subtitle">常用记录和档案都在这里。</view>

    <view class="profile-card card section-gap" @click="goPage('/pages/profile/edit/index')">
      <view class="profile-main">
        <image v-if="user.avatarUrl" class="profile-avatar-image" :src="user.avatarUrl" mode="aspectFill" />
        <view v-else class="profile-avatar">{{ avatarText }}</view>
        <view class="profile-info">
          <view class="profile-name">{{ user.nickname || '未登录用户' }}</view>
          <view class="profile-detail">{{ user.age || '--' }} 岁 · {{ user.city || '城市未填写' }}</view>
          <view class="profile-detail">{{ user.phone || '手机号未填写' }}</view>
        </view>
      </view>
      <view class="profile-edit-tip">点这里修改资料</view>
    </view>

    <view class="stats-grid section-gap">
      <info-stat-card :value="archive.learnedCount" label="已学习内容" />
      <info-stat-card :value="healthProfile.medicationCount" label="用药提醒" />
    </view>

    <section-card title="常用入口" subtitle="点一下直接进入" class="section-gap">
      <view class="menu-list">
        <view v-for="item in menuItems" :key="item.title" class="menu-item" @click="goPage(item.path)">
          <view class="menu-item__left">
            <view class="menu-item__icon">{{ item.icon }}</view>
            <text class="menu-item__title">{{ item.title }}</text>
          </view>
          <text class="menu-item__arrow">></text>
        </view>
      </view>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../components/common/SectionCard.vue'
import InfoStatCard from '../../../components/common/InfoStatCard.vue'
import { getCurrentUser } from '../../../api/user'
import { getStudyArchive } from '../../../api/learning'
import { getHealthProfile } from '../../../api/health'

export default {
  components: {
    SectionCard,
    InfoStatCard
  },
  data() {
    return {
      user: {},
      archive: {
        learnedCount: 0
      },
      healthProfile: {
        medicationCount: 0
      },
      menuItems: [
        { title: '修改资料', icon: '改', path: '/pages/profile/edit/index' },
        { title: '健康档案', icon: '健', path: '/pages/health/archive/index' },
        { title: '学习档案', icon: '学', path: '/pages/learning/archive/index' },
        { title: '社区活动', icon: '活', path: '/pages/activity/list/index' },
        { title: '发布活动', icon: '发', path: '/pages/activity/publish/index' },
        { title: '生活账本', icon: '账', path: '/pages/profile/life-book/index' }
      ]
    }
  },
  computed: {
    avatarText() {
      return this.user && this.user.nickname ? this.user.nickname.slice(0, 1) : '我'
    }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.user = await getCurrentUser()
      this.archive = await getStudyArchive()
      this.healthProfile = await getHealthProfile()
    },
    goPage(path) {
      uni.navigateTo({ url: path })
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-card {
  background: linear-gradient(135deg, #f0fbf6 0%, #ffffff 100%);
}

.profile-main {
  display: flex;
  align-items: center;
}

.profile-avatar,
.profile-avatar-image {
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
}

.profile-avatar-image {
  background: #eef3ef;
}

.profile-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f8a70;
  color: #fff;
  font-size: 42rpx;
  font-weight: 700;
}

.profile-info {
  margin-left: 20rpx;
}

.profile-name {
  font-size: 36rpx;
  font-weight: 700;
}

.profile-detail,
.profile-edit-tip {
  margin-top: 8rpx;
  color: #607176;
  font-size: 27rpx;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18rpx 0;
  border-bottom: 2rpx solid #eef3f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item__left {
  display: flex;
  align-items: center;
}

.menu-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 60rpx;
  border-radius: 16rpx;
  background: #e4f4ed;
  color: #1f8a70;
  font-size: 28rpx;
  font-weight: 700;
}

.menu-item__title {
  margin-left: 18rpx;
  font-size: 30rpx;
  font-weight: 600;
}

.menu-item__arrow {
  color: #7c8b90;
  font-size: 30rpx;
}
</style>
