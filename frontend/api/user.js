import { USE_MOCK_API, STORAGE_KEYS } from '../utils/config'
import { getStorage, setStorage } from '../utils/storage'
import { mockUser } from '../mock/data'
import { setStoreUser } from '../store/app-store'
import { get, post, put, upload } from './request'

export async function ensureMockLogin() {
  const cachedUser = getStorage(STORAGE_KEYS.user)
  if (cachedUser && cachedUser.id) {
    return cachedUser
  }
  try {
    if (!USE_MOCK_API) {
      const response = await post('/auth/mock-login', {
        nickname: mockUser.nickname,
        age: mockUser.age,
        phone: mockUser.phone,
        city: mockUser.city
      })
      setStorage(STORAGE_KEYS.user, response.data.user)
      setStoreUser(response.data.user)
      return response.data.user
    }
  } catch (error) {
    // ignore and use local mock
  }
  setStorage(STORAGE_KEYS.user, mockUser)
  setStoreUser(mockUser)
  return mockUser
}

export async function getCurrentUser() {
  const localUser = getStorage(STORAGE_KEYS.user, mockUser)
  if (USE_MOCK_API) {
    return localUser
  }
  try {
    const response = await get('/users/me')
    const user = response.data
    setStorage(STORAGE_KEYS.user, user)
    setStoreUser(user)
    return user
  } catch (error) {
    return localUser
  }
}

export async function updateCurrentUser(payload) {
  const merged = {
    ...getStorage(STORAGE_KEYS.user, mockUser),
    ...payload
  }
  if (USE_MOCK_API) {
    setStorage(STORAGE_KEYS.user, merged)
    setStoreUser(merged)
    return merged
  }
  try {
    const response = await put('/users/me', payload)
    setStorage(STORAGE_KEYS.user, response.data)
    setStoreUser(response.data)
    return response.data
  } catch (error) {
    setStorage(STORAGE_KEYS.user, merged)
    setStoreUser(merged)
    return merged
  }
}

export async function uploadUserAvatar(filePath) {
  if (USE_MOCK_API) {
    const nextUser = {
      ...getStorage(STORAGE_KEYS.user, mockUser),
      avatarUrl: filePath
    }
    setStorage(STORAGE_KEYS.user, nextUser)
    setStoreUser(nextUser)
    return {
      avatarUrl: filePath
    }
  }
  const response = await upload('/users/avatar', filePath)
  const user = {
    ...getStorage(STORAGE_KEYS.user, mockUser),
    avatarUrl: response.data.avatarUrl
  }
  setStorage(STORAGE_KEYS.user, user)
  setStoreUser(user)
  return response.data
}
