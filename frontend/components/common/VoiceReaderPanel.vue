<template>
  <view class="reader-card">
    <view class="reader-header">
      <view>
        <view class="reader-title">{{ title }}</view>
        <view class="reader-subtitle">{{ subtitle }}</view>
      </view>
      <view class="reader-status">{{ statusText }}</view>
    </view>

    <view class="reader-actions">
      <button class="reader-btn primary" @click="playAll">整页朗读</button>
      <button class="reader-btn" @click="togglePause" :disabled="!canPause">
        {{ isPaused ? '继续' : '暂停' }}
      </button>
      <button class="reader-btn" @click="playPrev" :disabled="!sentences.length">上一句</button>
      <button class="reader-btn" @click="playNext" :disabled="!sentences.length">下一句</button>
      <button class="reader-btn danger" @click="stopPlay" :disabled="!isPlaying && !isPaused">停止</button>
    </view>

    <view v-if="sentences.length" class="sentence-list">
      <view
        v-for="(sentence, index) in sentences"
        :key="`${title}-${index}`"
        class="sentence-item"
        :class="{ active: currentIndex === index }"
        @click="playSingle(index)"
      >
        <text class="sentence-index">{{ index + 1 }}</text>
        <text class="sentence-text">{{ sentence }}</text>
      </view>
    </view>
    <view v-else class="empty-text">暂无可朗读内容</view>
  </view>
</template>

<script>
import { synthesizeText } from '../../api/voice'
import { normalizeReadableSections, splitToSentences } from '../../utils/voice-reader'

export default {
  name: 'VoiceReaderPanel',
  props: {
    title: {
      type: String,
      default: '语音朗读'
    },
    subtitle: {
      type: String,
      default: '支持整页朗读和逐句朗读'
    },
    sections: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      audioContext: null,
      currentIndex: -1,
      mode: '',
      isPlaying: false,
      isPaused: false,
      audioCache: {}
    }
  },
  computed: {
    sentences() {
      const sections = normalizeReadableSections(this.sections)
      return sections.reduce((result, item) => result.concat(splitToSentences(item)), [])
    },
    canPause() {
      return this.isPlaying || this.isPaused
    },
    statusText() {
      if (this.isPaused) {
        return '已暂停'
      }
      if (this.isPlaying && this.currentIndex >= 0) {
        return `正在朗读第 ${this.currentIndex + 1} 句`
      }
      return '点击句子可单独朗读'
    }
  },
  methods: {
    ensureAudioContext() {
      if (this.audioContext) {
        return
      }
      this.audioContext = uni.createInnerAudioContext()
      this.audioContext.onEnded(() => {
        if (this.mode === 'all' && this.currentIndex < this.sentences.length - 1) {
          this.playByIndex(this.currentIndex + 1, 'all')
          return
        }
        this.stopPlay()
      })
      this.audioContext.onError(() => {
        uni.showToast({
          title: '语音播放失败',
          icon: 'none'
        })
        this.stopPlay()
      })
    },
    async getAudioUrl(text) {
      if (this.audioCache[text]) {
        return this.audioCache[text]
      }
      const response = await synthesizeText(text)
      this.audioCache[text] = response.audioUrl
      return response.audioUrl
    },
    async playByIndex(index, mode = 'single') {
      if (index < 0 || index >= this.sentences.length) {
        return
      }
      this.ensureAudioContext()
      const sentence = this.sentences[index]
      const audioUrl = await this.getAudioUrl(sentence)
      this.mode = mode
      this.currentIndex = index
      this.isPlaying = true
      this.isPaused = false
      this.audioContext.stop()
      this.audioContext.src = audioUrl
      this.audioContext.play()
    },
    playAll() {
      if (!this.sentences.length) {
        return
      }
      this.playByIndex(0, 'all')
    },
    playSingle(index) {
      this.playByIndex(index, 'single')
    },
    togglePause() {
      if (!this.audioContext) {
        return
      }
      if (this.isPaused) {
        this.audioContext.play()
        this.isPaused = false
        this.isPlaying = true
        return
      }
      if (this.isPlaying) {
        this.audioContext.pause()
        this.isPaused = true
        this.isPlaying = false
      }
    },
    stopPlay() {
      if (this.audioContext) {
        this.audioContext.stop()
      }
      this.mode = ''
      this.currentIndex = -1
      this.isPlaying = false
      this.isPaused = false
    },
    playPrev() {
      if (!this.sentences.length) {
        return
      }
      const index = this.currentIndex > 0 ? this.currentIndex - 1 : 0
      this.playByIndex(index, 'single')
    },
    playNext() {
      if (!this.sentences.length) {
        return
      }
      const index = this.currentIndex >= 0 && this.currentIndex < this.sentences.length - 1 ? this.currentIndex + 1 : 0
      this.playByIndex(index, 'single')
    }
  },
  beforeDestroy() {
    if (this.audioContext) {
      this.audioContext.destroy()
      this.audioContext = null
    }
  }
}
</script>

<style lang="scss" scoped>
.reader-card {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.reader-header {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
  align-items: flex-start;
}

.reader-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #18363f;
}

.reader-subtitle,
.reader-status {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: #607176;
}

.reader-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.reader-btn {
  margin: 0;
  padding: 0 22rpx;
  height: 72rpx;
  border-radius: 18rpx;
  background: #eef5f3;
  color: #1d4f59;
  font-size: 26rpx;
  line-height: 72rpx;
}

.reader-btn::after {
  border: none;
}

.reader-btn.primary {
  background: #1f8a70;
  color: #fff;
}

.reader-btn.danger {
  background: #fff0ec;
  color: #a14a34;
}

.sentence-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.sentence-item {
  display: flex;
  gap: 16rpx;
  align-items: flex-start;
  padding: 18rpx 20rpx;
  border-radius: 18rpx;
  background: #f5f8f7;
}

.sentence-item.active {
  background: #e4f4ee;
  box-shadow: inset 0 0 0 2rpx rgba(31, 138, 112, 0.2);
}

.sentence-index {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: #d9efe6;
  color: #1f8a70;
  font-size: 22rpx;
  line-height: 36rpx;
  text-align: center;
  flex-shrink: 0;
}

.sentence-text {
  flex: 1;
  font-size: 28rpx;
  line-height: 1.7;
  color: #33454a;
}
</style>
