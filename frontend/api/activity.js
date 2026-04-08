import { USE_MOCK_API, STORAGE_KEYS } from '../utils/config'
import { getStorage, setStorage } from '../utils/storage'
import { mockActivities } from '../mock/data'
import { get, post } from './request'

function getLocalActivities() {
  const list = getStorage(STORAGE_KEYS.activities, [])
  if (list && list.length) {
    return list
  }
  setStorage(STORAGE_KEYS.activities, mockActivities)
  return mockActivities
}

function saveLocalActivities(list) {
  setStorage(STORAGE_KEYS.activities, list)
}

export async function getActivities() {
  if (USE_MOCK_API) {
    return getLocalActivities()
  }
  try {
    const response = await get('/activities')
    return response.data
  } catch (error) {
    return getLocalActivities()
  }
}

export async function submitActivity(payload) {
  if (USE_MOCK_API) {
    const list = getLocalActivities()
    const item = {
      id: Date.now(),
      publisherName: '我发布的活动',
      auditStatus: 'pending',
      status: 'open',
      enrolledCount: 0,
      isSignedUp: false,
      ...payload
    }
    saveLocalActivities([item].concat(list))
    return item
  }
  try {
    const response = await post('/activities', payload)
    return response.data
  } catch (error) {
    const list = getLocalActivities()
    const item = {
      id: Date.now(),
      publisherName: '我发布的活动',
      auditStatus: 'pending',
      status: 'open',
      enrolledCount: 0,
      isSignedUp: false,
      ...payload
    }
    saveLocalActivities([item].concat(list))
    return item
  }
}

export async function signupActivity(id) {
  if (USE_MOCK_API) {
    const list = getLocalActivities().map((item) => {
      if (item.id === id && !item.isSignedUp) {
        return {
          ...item,
          isSignedUp: true,
          enrolledCount: Number(item.enrolledCount || 0) + 1
        }
      }
      return item
    })
    saveLocalActivities(list)
    return true
  }
  try {
    const response = await post('/activities/' + id + '/signup')
    return response.data
  } catch (error) {
    const list = getLocalActivities().map((item) => {
      if (item.id === id && !item.isSignedUp) {
        return {
          ...item,
          isSignedUp: true,
          enrolledCount: Number(item.enrolledCount || 0) + 1
        }
      }
      return item
    })
    saveLocalActivities(list)
    return true
  }
}
