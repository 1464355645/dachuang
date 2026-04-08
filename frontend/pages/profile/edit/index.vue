<template>
  <view class="page-container">
    <view class="page-title">修改资料</view>
    <view class="page-subtitle">信息越完整，记录越方便。</view>

    <view class="card section-gap">
      <view class="avatar-row" @click="chooseAvatar">
        <image v-if="form.avatarUrl" class="avatar-image" :src="form.avatarUrl" mode="aspectFill" />
        <view v-else class="avatar-placeholder">{{ avatarText }}</view>
        <view class="avatar-tip">点这里更换头像</view>
      </view>

      <view class="form-group">
        <view class="input-label">昵称</view>
        <input v-model="form.nickname" class="input-box" placeholder="请输入昵称" />
      </view>
      <view class="form-group">
        <view class="input-label">年龄</view>
        <input v-model="form.age" class="input-box" type="number" placeholder="请输入年龄" />
      </view>
      <view class="form-group">
        <view class="input-label">手机号</view>
        <input v-model="form.phone" class="input-box" placeholder="请输入手机号" />
      </view>
      <view class="form-group">
        <view class="input-label">城市</view>
        <input v-model="form.city" class="input-box" placeholder="请输入城市" />
      </view>

      <button class="primary-btn section-gap" @click="submitForm">保存资料</button>
    </view>
  </view>
</template>

<script>
import { getCurrentUser, updateCurrentUser, uploadUserAvatar } from '../../../api/user'

export default {
  data() {
    return {
      form: {
        nickname: '',
        age: '',
        phone: '',
        city: '',
        avatarUrl: ''
      }
    }
  },
  computed: {
    avatarText() {
      return this.form.nickname ? this.form.nickname.slice(0, 1) : '我'
    }
  },
  onLoad() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const user = await getCurrentUser()
      this.form = {
        nickname: user.nickname || '',
        age: user.age || '',
        phone: user.phone || '',
        city: user.city || '',
        avatarUrl: user.avatarUrl || ''
      }
    },
    chooseAvatar() {
      uni.chooseImage({
        count: 1,
        success: async (res) => {
          const filePath = res.tempFilePaths[0]
          try {
            const response = await uploadUserAvatar(filePath)
            this.form.avatarUrl = response.avatarUrl
          } catch (error) {
            uni.showToast({
              title: '头像上传失败',
              icon: 'none'
            })
          }
        }
      })
    },
    async submitForm() {
      if (!this.form.nickname) {
        uni.showToast({
          title: '请先填写昵称',
          icon: 'none'
        })
        return
      }
      await updateCurrentUser({
        nickname: this.form.nickname,
        age: Number(this.form.age || 0),
        phone: this.form.phone,
        city: this.form.city,
        avatarUrl: this.form.avatarUrl
      })
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-row {
  display: flex;
  align-items: center;
  margin-bottom: 28rpx;
}

.avatar-image,
.avatar-placeholder {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
}

.avatar-image {
  background: #eef3ef;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f8a70;
  color: #fff;
  font-size: 42rpx;
  font-weight: 700;
}

.avatar-tip {
  margin-left: 20rpx;
  color: #607176;
  font-size: 28rpx;
}

.form-group {
  margin-bottom: 20rpx;
}
</style>
