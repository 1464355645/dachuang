import { USE_MOCK_API, STORAGE_KEYS } from '../utils/config'
import { getStorage, setStorage } from '../utils/storage'
import {
  mockCommunityAnnouncements,
  mockCommunityCheckin,
  mockCommunityCircles,
  mockCommunityHealthTips,
  mockCommunityPosts,
  mockCommunityQa,
  mockCommunityRecommendations,
  mockCommunityWeather
} from '../mock/data'
import { get, post } from './request'

function getLocalPosts() {
  const list = getStorage(STORAGE_KEYS.communityPosts, [])
  if (list && list.length) {
    return list
  }
  setStorage(STORAGE_KEYS.communityPosts, mockCommunityPosts)
  return mockCommunityPosts
}

function saveLocalPosts(list) {
  setStorage(STORAGE_KEYS.communityPosts, list)
}

function getLocalComments() {
  return getStorage(STORAGE_KEYS.communityComments, {})
}

function saveLocalComments(map) {
  setStorage(STORAGE_KEYS.communityComments, map)
}

function getLocalCheckin() {
  const data = getStorage(STORAGE_KEYS.communityCheckin, null)
  if (data && data.date) {
    return data
  }
  setStorage(STORAGE_KEYS.communityCheckin, mockCommunityCheckin)
  return mockCommunityCheckin
}

function saveLocalCheckin(data) {
  setStorage(STORAGE_KEYS.communityCheckin, data)
}

function getLocalReports() {
  return getStorage(STORAGE_KEYS.communityReports, [])
}

function saveLocalReports(list) {
  setStorage(STORAGE_KEYS.communityReports, list)
}

function buildFallbackHomeData() {
  return {
    announcements: mockCommunityAnnouncements,
    circles: mockCommunityCircles,
    posts: getLocalPosts(),
    qas: mockCommunityQa,
    recommendations: mockCommunityRecommendations,
    weather: mockCommunityWeather,
    healthTips: mockCommunityHealthTips,
    checkin: getLocalCheckin()
  }
}

export async function getCommunityHomeData() {
  if (USE_MOCK_API) {
    return buildFallbackHomeData()
  }
  try {
    const response = await get('/community/home')
    return response.data
  } catch (error) {
    return buildFallbackHomeData()
  }
}

export async function getCommunityPostDetail(id) {
  if (USE_MOCK_API) {
    const post = getLocalPosts().find((item) => item.id === Number(id)) || {}
    const comments = getLocalComments()[id] || []
    return { post, comments }
  }
  try {
    const response = await get('/community/posts/' + id)
    return response.data
  } catch (error) {
    const post = getLocalPosts().find((item) => item.id === Number(id)) || {}
    const comments = getLocalComments()[id] || []
    return { post, comments }
  }
}

export async function toggleCommunityLike(id) {
  if (USE_MOCK_API) {
    const list = getLocalPosts().map((item) => {
      if (item.id === id) {
        const nextLiked = !item.isLiked
        return {
          ...item,
          isLiked: nextLiked,
          likeCount: Math.max(0, Number(item.likeCount || 0) + (nextLiked ? 1 : -1))
        }
      }
      return item
    })
    saveLocalPosts(list)
    return true
  }
  await post('/community/posts/' + id + '/like')
  return true
}

export async function toggleCommunityCollect(id) {
  if (USE_MOCK_API) {
    const list = getLocalPosts().map((item) => {
      if (item.id === id) {
        const nextCollected = !item.isCollected
        return {
          ...item,
          isCollected: nextCollected,
          collectCount: Math.max(0, Number(item.collectCount || 0) + (nextCollected ? 1 : -1))
        }
      }
      return item
    })
    saveLocalPosts(list)
    return true
  }
  await post('/community/posts/' + id + '/collect')
  return true
}

export async function addCommunityComment(id, content) {
  if (USE_MOCK_API) {
    const map = getLocalComments()
    const list = map[id] || []
    const nextItem = {
      id: Date.now(),
      author: '我',
      content,
      createdAt: new Date().toLocaleString()
    }
    map[id] = [nextItem].concat(list)
    saveLocalComments(map)

    const posts = getLocalPosts().map((item) => {
      if (item.id === id) {
        return {
          ...item,
          commentCount: Number(item.commentCount || 0) + 1
        }
      }
      return item
    })
    saveLocalPosts(posts)
    return nextItem
  }
  const response = await post('/community/posts/' + id + '/comments', { content })
  return response.data
}

export async function reportCommunityContent(payload) {
  if (USE_MOCK_API) {
    const list = getLocalReports()
    const nextItem = {
      id: Date.now(),
      ...payload,
      createdAt: new Date().toLocaleString()
    }
    saveLocalReports([nextItem].concat(list))
    return true
  }
  await post('/community/reports', payload)
  return true
}

export async function submitCommunityCheckin() {
  if (USE_MOCK_API) {
    const current = getLocalCheckin()
    if (current.todayChecked) {
      return current
    }
    const next = {
      ...current,
      todayChecked: true,
      points: Number(current.points || 0) + Number(current.reward || 0)
    }
    saveLocalCheckin(next)
    return next
  }
  const response = await post('/community/checkin')
  return response.data
}
