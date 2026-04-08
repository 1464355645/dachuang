import { API_BASE_URL } from '../utils/config'
import { getStorage } from '../utils/storage'
import { STORAGE_KEYS } from '../utils/config'

function request(options) {
  const user = getStorage(STORAGE_KEYS.user, {})

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${API_BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'X-User-Id': (user && user.id) || 1,
        ...(options.header || {})
      },
      success: (response) => {
        const { statusCode, data } = response
        if (statusCode >= 200 && statusCode < 300) {
          resolve(data)
          return
        }
        reject(data)
      },
      fail: reject
    })
  })
}

export function get(url, params) {
  return request({
    url,
    method: 'GET',
    data: params
  })
}

export function post(url, data) {
  return request({
    url,
    method: 'POST',
    data
  })
}

export function put(url, data) {
  return request({
    url,
    method: 'PUT',
    data
  })
}

export function del(url, data) {
  return request({
    url,
    method: 'DELETE',
    data
  })
}

export function upload(url, filePath, name = 'file', formData = {}) {
  const user = getStorage(STORAGE_KEYS.user, {})
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${API_BASE_URL}${url}`,
      filePath,
      name,
      formData,
      header: {
        'X-User-Id': (user && user.id) || 1
      },
      success: (response) => {
        try {
          const data = JSON.parse(response.data)
          resolve(data)
        } catch (error) {
          reject(error)
        }
      },
      fail: reject
    })
  })
}
