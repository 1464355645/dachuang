import { USE_MOCK_API, STORAGE_KEYS } from '../utils/config'
import { getStorage, setStorage } from '../utils/storage'
import { mockLifeRecords } from '../mock/data'
import { del, get, post, put } from './request'
import { formatDateTimeLabel } from '../utils/format'

function getLocalRecords() {
  const list = getStorage(STORAGE_KEYS.lifeRecords, [])
  if (list && list.length) {
    return list
  }
  setStorage(STORAGE_KEYS.lifeRecords, mockLifeRecords)
  return mockLifeRecords
}

function saveLocalRecords(list) {
  setStorage(STORAGE_KEYS.lifeRecords, list)
}

function buildSummary(list) {
  const totalAmount = list.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  return {
    count: list.length,
    totalAmount: Number(totalAmount.toFixed(2))
  }
}

export async function getLifeRecords(params = {}) {
  const recordType = params.recordType || 'ledger'
  const keyword = params.keyword || ''

  if (USE_MOCK_API) {
    let list = getLocalRecords().filter((item) => item.recordType === recordType)
    if (keyword) {
      list = list.filter((item) => item.title.indexOf(keyword) > -1)
    }
    return {
      list,
      summary: buildSummary(list)
    }
  }

  try {
    const response = await get('/life-records', {
      record_type: recordType,
      keyword
    })
    return response.data
  } catch (error) {
    let list = getLocalRecords().filter((item) => item.recordType === recordType)
    if (keyword) {
      list = list.filter((item) => item.title.indexOf(keyword) > -1)
    }
    return {
      list,
      summary: buildSummary(list)
    }
  }
}

export async function createLifeRecord(payload) {
  if (USE_MOCK_API) {
    const list = getLocalRecords()
    const item = {
      id: Date.now(),
      createdAt: formatDateTimeLabel(new Date()),
      status: payload.status || 'submitted',
      ...payload
    }
    saveLocalRecords([item].concat(list))
    return item
  }

  try {
    const response = await post('/life-records', payload)
    return response.data
  } catch (error) {
    const list = getLocalRecords()
    const item = {
      id: Date.now(),
      createdAt: formatDateTimeLabel(new Date()),
      status: payload.status || 'submitted',
      ...payload
    }
    saveLocalRecords([item].concat(list))
    return item
  }
}

export async function updateLifeRecord(id, payload) {
  if (USE_MOCK_API) {
    const list = getLocalRecords().map((item) => {
      if (item.id === id) {
        return {
          ...item,
          ...payload
        }
      }
      return item
    })
    saveLocalRecords(list)
    return true
  }

  try {
    const response = await put('/life-records/' + id, payload)
    return response.data
  } catch (error) {
    const list = getLocalRecords().map((item) => {
      if (item.id === id) {
        return {
          ...item,
          ...payload
        }
      }
      return item
    })
    saveLocalRecords(list)
    return true
  }
}

export async function deleteLifeRecord(id) {
  if (USE_MOCK_API) {
    const list = getLocalRecords().filter((item) => item.id !== id)
    saveLocalRecords(list)
    return true
  }

  try {
    const response = await del('/life-records/' + id)
    return response.data
  } catch (error) {
    const list = getLocalRecords().filter((item) => item.id !== id)
    saveLocalRecords(list)
    return true
  }
}
