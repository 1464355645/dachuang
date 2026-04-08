import { USE_MOCK_API } from '../utils/config'
import { mockReminder, mockVideos, mockVoiceGreeting } from '../mock/data'
import { setStoreReminder } from '../store/app-store'
import { get } from './request'

export async function getHomeReminder() {
  if (USE_MOCK_API) {
    setStoreReminder(mockReminder)
    return mockReminder
  }
  try {
    const response = await get('/home/reminder')
    setStoreReminder(response.data)
    return response.data
  } catch (error) {
    setStoreReminder(mockReminder)
    return mockReminder
  }
}

export async function getEntertainmentVideos() {
  if (USE_MOCK_API) {
    return mockVideos
  }
  try {
    const response = await get('/home/videos')
    return response.data
  } catch (error) {
    return mockVideos
  }
}

export async function getVoiceGreeting() {
  if (USE_MOCK_API) {
    return mockVoiceGreeting
  }
  try {
    const response = await get('/home/voice-greeting')
    return response.data
  } catch (error) {
    return mockVoiceGreeting
  }
}
