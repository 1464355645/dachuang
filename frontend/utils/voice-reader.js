import { STORAGE_KEYS } from './config'
import { getStorage, setStorage } from './storage'

export function splitToSentences(text = '') {
  const normalized = String(text || '').replace(/\r/g, '\n').trim()
  if (!normalized) {
    return []
  }

  const parts = []
  let buffer = ''
  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i]
    buffer += char
    if ('。！？；\n'.indexOf(char) > -1) {
      const sentence = buffer.trim()
      if (sentence) {
        parts.push(sentence)
      }
      buffer = ''
    }
  }
  if (buffer.trim()) {
    parts.push(buffer.trim())
  }

  const merged = []
  parts.forEach((item) => {
    if (merged.length && item.length < 8) {
      merged[merged.length - 1] += item
      return
    }
    merged.push(item)
  })
  return merged
}

export function normalizeReadableSections(sections = []) {
  return sections
    .map((item) => String(item || '').trim())
    .filter(Boolean)
}

export function saveReadablePayload(payload) {
  setStorage(STORAGE_KEYS.voiceReadablePayload, payload || null)
}

export function getReadablePayload() {
  return getStorage(STORAGE_KEYS.voiceReadablePayload, null)
}

export function saveVoiceChatHistory(history = []) {
  setStorage(STORAGE_KEYS.voiceChatHistory, history)
}

export function getVoiceChatHistory() {
  return getStorage(STORAGE_KEYS.voiceChatHistory, [])
}
