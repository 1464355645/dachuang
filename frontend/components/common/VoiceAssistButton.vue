<template>
  <view class="voice-button" @click="handleClick">
    <view class="voice-button__icon">语</view>
    <text class="voice-button__text">语音助手</text>
  </view>
</template>

<script>
export default {
  name: 'VoiceAssistButton',
  methods: {
    handleClick() {
      uni.navigateTo({
        url: '/pages/health/assistant/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.voice-button {
  position: fixed;
  right: 28rpx;
  bottom: 180rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 18rpx 22rpx;
  border-radius: 999rpx;
  background: #1f8a70;
  box-shadow: 0 10rpx 30rpx rgba(31, 138, 112, 0.25);
  z-index: 20;
}

.voice-button__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 24rpx;
  font-weight: 700;
}

.voice-button__text {
  color: #fff;
  font-size: 26rpx;
  font-weight: 600;
}
</style>
