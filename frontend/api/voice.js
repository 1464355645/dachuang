import { API_BASE_URL } from '../utils/config'
import { post, upload } from './request'
import { splitToSentences } from '../utils/voice-reader'

const MOCK_AUDIO_URL = 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'

function getApiOrigin() {
  return API_BASE_URL.replace(/\/api\/v1$/, '')
}

function resolveAudioUrl(url) {
  if (!url) {
    return MOCK_AUDIO_URL
  }
  if (/^https?:\/\//.test(url)) {
    return url
  }
  return `${getApiOrigin()}${url}`
}

function mockChatResponse(message, context = '') {
  const text = `${context ? `我先结合当前页面内容说明一下。` : ''}您刚才说的是“${message}”。我会建议您一步一步来，如果看不清字，可以先点整页朗读，再根据提示点击对应入口。`
  return {
    text,
    audioUrl: MOCK_AUDIO_URL,
    provider: 'mock',
    sentences: splitToSentences(text)
  }
}

export async function chatWithVoiceAssistant(payload) {
  try {
    const response = await post('/voice/chat', payload)
    return {
      ...response.data,
      audioUrl: resolveAudioUrl(response.data.audioUrl)
    }
  } catch (error) {
    return mockChatResponse(payload.message, payload.context)
  }
}

export async function synthesizeText(text) {
  try {
    const response = await post('/voice/tts', { text })
    return {
      ...response.data,
      audioUrl: resolveAudioUrl(response.data.audioUrl)
    }
  } catch (error) {
    return {
      text,
      audioUrl: MOCK_AUDIO_URL,
      provider: 'mock',
      sentences: splitToSentences(text)
    }
  }
}

export async function readPageContent(title, sections) {
  try {
    const response = await post('/voice/page-read', { title, sections })
    return {
      ...response.data,
      audioUrl: resolveAudioUrl(response.data.audioUrl)
    }
  } catch (error) {
    const text = sections.join('\n')
    return {
      title,
      text,
      audioUrl: MOCK_AUDIO_URL,
      provider: 'mock',
      sentences: splitToSentences(text)
    }
  }
}

export async function transcribeVoice(filePath) {
  try {
    const response = await upload('/voice/asr', filePath, 'file')
    return response.data.text
  } catch (error) {
    return '帮我把当前页面读一遍。'
  }
}
