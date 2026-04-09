<template>
  <view class="page-container assistant-page">
    <view class="hero-card">
      <view class="page-title">语音健康助手</view>
      <view class="page-subtitle">能聊天、能录音、能整页朗读，也能逐句慢慢读。</view>
    </view>

    <section-card title="快捷提问" subtitle="不想打字就点录音" class="section-gap">
      <view class="quick-list">
        <button
          v-for="item in quickQuestions"
          :key="item"
          class="quick-btn"
          @click="useQuickQuestion(item)"
        >
          {{ item }}
        </button>
      </view>

      <view class="ask-box">
        <textarea
          v-model="inputText"
          class="ask-input"
          maxlength="200"
          placeholder="比如：帮我看看这个页面怎么用，或者读一读当前页面。"
        ></textarea>
        <view class="ask-actions">
          <button class="primary-btn" @click="sendMessage" :disabled="loading">发送问题</button>
          <button class="secondary-btn" @click="toggleRecord" :disabled="loading">
            {{ isRecording ? '结束录音' : '开始录音' }}
          </button>
        </view>
      </view>
    </section-card>

    <section-card title="当前页面导读" subtitle="支持整页朗读和逐句朗读" class="section-gap">
      <voice-reader-panel
        :title="readablePayload.title"
        subtitle="点整页朗读会从第一句开始自动往下播"
        :sections="readablePayload.sections"
      />
    </section-card>

    <section-card
      v-if="latestAnswerSections.length"
      title="最新回答朗读"
      subtitle="模型回答也能逐句播放"
      class="section-gap"
    >
      <voice-reader-panel
        title="助手回答"
        subtitle="您可以点击某一句单独收听"
        :sections="latestAnswerSections"
      />
    </section-card>

    <section-card title="对话记录" subtitle="尽量用简单的话回答您" class="section-gap">
      <view v-if="messages.length" class="message-list">
        <view
          v-for="item in messages"
          :key="item.id"
          class="message-card"
          :class="item.role === 'user' ? 'message-user' : 'message-assistant'"
        >
          <view class="message-role">{{ item.role === 'user' ? '我' : '助手' }}</view>
          <view class="message-content">{{ item.content }}</view>
        </view>
      </view>
      <view v-else class="empty-text">先问一句试试，比如“帮我读一读当前页面”。</view>
    </section-card>

    <section-card title="健康服务入口" subtitle="原有功能继续保留" class="section-gap">
      <feature-grid :items="items" @select="handleSelect" />
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../components/common/SectionCard.vue'
import FeatureGrid from '../../../components/common/FeatureGrid.vue'
import VoiceReaderPanel from '../../../components/common/VoiceReaderPanel.vue'
import { chatWithVoiceAssistant, readPageContent, transcribeVoice } from '../../../api/voice'
import {
  getReadablePayload,
  getVoiceChatHistory,
  normalizeReadableSections,
  saveReadablePayload,
  saveVoiceChatHistory
} from '../../../utils/voice-reader'

export default {
  components: {
    SectionCard,
    FeatureGrid,
    VoiceReaderPanel
  },
  data() {
    return {
      inputText: '',
      loading: false,
      isRecording: false,
      recorderManager: null,
      latestAnswerSections: [],
      messages: [],
      readablePayload: {
        title: '健康助手页面导读',
        sections: []
      },
      quickQuestions: [
        '帮我读一读当前页面',
        '这个页面怎么用',
        '挂号预约怎么操作',
        '身体不舒服应该先做什么'
      ],
      items: [
        { title: '身体不适查询', desc: '查看基础建议和历史记录', icon: '查', path: '/pages/health/discomfort/index' },
        { title: '用药提醒', desc: '新增、编辑、删除提醒', icon: '药', path: '/pages/health/medication/index' },
        { title: '健康知识', desc: '按分类查看健康内容', icon: '知', path: '/pages/health/knowledge/index' },
        { title: '门诊挂号预约', desc: '选择科室和号源完成预约', icon: '号', path: '/pages/health/registration/index' },
        { title: '健康体检预约', desc: '查看套餐并提交预约', icon: '检', path: '/pages/health/checkup/index' }
      ]
    }
  },
  onLoad() {
    this.messages = getVoiceChatHistory()
    this.initReadablePayload()
  },
  methods: {
    initReadablePayload() {
      const stored = getReadablePayload()
      if (stored && stored.sections && stored.sections.length) {
        this.readablePayload = {
          title: stored.title || '当前页面导读',
          sections: normalizeReadableSections(stored.sections)
        }
        return
      }
      const sections = [
        '这里是语音健康助手页面。',
        '您可以输入问题，也可以点击开始录音直接说话。',
        '下方支持整页朗读和逐句朗读。',
        '如果要继续办事，可以点击身体不适查询、用药提醒、健康知识、门诊挂号预约和健康体检预约。'
      ]
      this.readablePayload = {
        title: '健康助手页面导读',
        sections
      }
      saveReadablePayload(this.readablePayload)
    },
    handleSelect(item) {
      uni.navigateTo({ url: item.path })
    },
    useQuickQuestion(text) {
      this.inputText = text
      this.sendMessage()
    },
    appendMessage(role, content) {
      const next = [
        ...this.messages,
        {
          id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
          role,
          content
        }
      ].slice(-12)
      this.messages = next
      saveVoiceChatHistory(next)
    },
    async sendMessage() {
      const content = String(this.inputText || '').trim()
      if (!content || this.loading) {
        return
      }
      this.loading = true
      this.appendMessage('user', content)
      try {
        const pageRead = await readPageContent(this.readablePayload.title, this.readablePayload.sections)
        const response = await chatWithVoiceAssistant({
          message: content,
          context: pageRead.text
        })
        this.appendMessage('assistant', response.text)
        this.latestAnswerSections = response.sentences && response.sentences.length
          ? response.sentences
          : [response.text]
        this.inputText = ''
      } finally {
        this.loading = false
      }
    },
    ensureRecorder() {
      if (this.recorderManager) {
        return this.recorderManager
      }
      if (!uni.getRecorderManager) {
        uni.showToast({
          title: '当前环境不支持录音',
          icon: 'none'
        })
        return null
      }
      this.recorderManager = uni.getRecorderManager()
      this.recorderManager.onStop(async (res) => {
        this.isRecording = false
        if (!res || !res.tempFilePath) {
          return
        }
        const text = await transcribeVoice(res.tempFilePath)
        this.inputText = text
        this.sendMessage()
      })
      this.recorderManager.onError(() => {
        this.isRecording = false
        uni.showToast({
          title: '录音失败',
          icon: 'none'
        })
      })
      return this.recorderManager
    },
    toggleRecord() {
      const recorder = this.ensureRecorder()
      if (!recorder || this.loading) {
        return
      }
      if (this.isRecording) {
        recorder.stop()
        return
      }
      this.isRecording = true
      recorder.start({
        duration: 60000,
        sampleRate: 16000,
        numberOfChannels: 1,
        encodeBitRate: 96000,
        format: 'mp3'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.assistant-page {
  padding-bottom: 40rpx;
}

.hero-card {
  padding: 12rpx 8rpx 0;
}

.quick-list {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}

.quick-btn {
  margin: 0;
  padding: 0 24rpx;
  height: 72rpx;
  border-radius: 999rpx;
  background: #eef7f1;
  color: #1f8a70;
  font-size: 26rpx;
  line-height: 72rpx;
}

.quick-btn::after {
  border: none;
}

.ask-box {
  margin-top: 20rpx;
}

.ask-input {
  width: 100%;
  min-height: 180rpx;
  padding: 22rpx;
  border-radius: 22rpx;
  background: #f6f8f7;
  box-sizing: border-box;
  font-size: 28rpx;
  line-height: 1.7;
}

.ask-actions {
  margin-top: 16rpx;
  display: flex;
  gap: 16rpx;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.message-card {
  padding: 20rpx;
  border-radius: 20rpx;
}

.message-user {
  background: #fff3df;
}

.message-assistant {
  background: #eef7f1;
}

.message-role {
  font-size: 24rpx;
  font-weight: 700;
  color: #607176;
}

.message-content {
  margin-top: 10rpx;
  font-size: 29rpx;
  line-height: 1.8;
  color: #20363d;
}
</style>
