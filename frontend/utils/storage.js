export function getStorage(key, fallback = null) {
  try {
    const value = uni.getStorageSync(key)
    return value === '' || value === undefined ? fallback : value
  } catch (error) {
    return fallback
  }
}

export function setStorage(key, value) {
  uni.setStorageSync(key, value)
}
