<template>
  <view class="page-container">
    <view class="page-title">生活账本</view>
    <view class="page-subtitle">记简单一点，也能看清每天花费。</view>

    <view class="stats-row section-gap">
      <info-stat-card :value="summary.count" label="记录数" />
      <info-stat-card :value="'￥' + summary.totalAmount" label="合计支出" />
    </view>

    <section-card title="新增记录" subtitle="先记账，再慢慢补充统计" class="section-gap">
      <view class="form-group">
        <view class="input-label">标题</view>
        <input v-model="form.title" class="input-box" placeholder="例如：买菜" />
      </view>
      <view class="form-group">
        <view class="input-label">金额</view>
        <input v-model="form.amount" class="input-box" type="digit" placeholder="例如：36.5" />
      </view>
      <view class="form-group">
        <view class="input-label">日期</view>
        <input v-model="form.eventDate" class="input-box" placeholder="例如：2026-04-07" />
      </view>
      <view class="form-group">
        <view class="input-label">备注</view>
        <textarea v-model="form.remark" class="textarea-box" placeholder="可选，简单写一下" />
      </view>
      <button class="primary-btn section-gap" @click="submitForm">保存记录</button>
    </section-card>

    <section-card title="账本列表" subtitle="按时间倒序显示" class="section-gap">
      <view v-if="records.length">
        <view v-for="item in records" :key="item.id" class="record-item">
          <view class="record-item__row">
            <view class="record-item__title">{{ item.title }}</view>
            <view class="record-item__amount">￥{{ item.amount }}</view>
          </view>
          <view class="record-item__meta">{{ item.eventDate || '未填写日期' }}</view>
          <view v-if="item.remark" class="record-item__meta">{{ item.remark }}</view>
          <view class="record-item__actions">
            <button class="mini-btn" @click="fillEdit(item)">编辑</button>
            <button class="mini-btn mini-btn--danger" @click="removeRecord(item.id)">删除</button>
          </view>
        </view>
      </view>
      <view v-else class="empty-text">还没有账本记录，先记一笔吧。</view>
    </section-card>
  </view>
</template>

<script>
import SectionCard from '../../../components/common/SectionCard.vue'
import InfoStatCard from '../../../components/common/InfoStatCard.vue'
import { createLifeRecord, deleteLifeRecord, getLifeRecords, updateLifeRecord } from '../../../api/life'

function getDefaultForm() {
  return {
    id: null,
    title: '',
    amount: '',
    eventDate: '',
    remark: ''
  }
}

export default {
  components: {
    SectionCard,
    InfoStatCard
  },
  data() {
    return {
      records: [],
      summary: {
        count: 0,
        totalAmount: 0
      },
      form: getDefaultForm()
    }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const result = await getLifeRecords({
        recordType: 'ledger'
      })
      this.records = result.list || []
      this.summary = result.summary || {
        count: 0,
        totalAmount: 0
      }
    },
    async submitForm() {
      if (!this.form.title) {
        uni.showToast({
          title: '请先填写标题',
          icon: 'none'
        })
        return
      }

      const payload = {
        recordType: 'ledger',
        title: this.form.title,
        amount: Number(this.form.amount || 0),
        eventDate: this.form.eventDate,
        remark: this.form.remark,
        status: 'done'
      }

      if (this.form.id) {
        await updateLifeRecord(this.form.id, payload)
      } else {
        await createLifeRecord(payload)
      }

      uni.showToast({
        title: '已保存',
        icon: 'success'
      })

      this.form = getDefaultForm()
      this.loadData()
    },
    fillEdit(item) {
      this.form = {
        id: item.id,
        title: item.title,
        amount: item.amount,
        eventDate: item.eventDate,
        remark: item.remark
      }
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 200
      })
    },
    async removeRecord(id) {
      await deleteLifeRecord(id)
      uni.showToast({
        title: '已删除',
        icon: 'success'
      })
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
.stats-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}

.form-group {
  margin-bottom: 20rpx;
}

.record-item {
  padding: 22rpx 0;
  border-bottom: 2rpx solid #edf3ef;
}

.record-item:last-child {
  border-bottom: none;
}

.record-item__row {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.record-item__title,
.record-item__amount {
  font-size: 30rpx;
  font-weight: 700;
}

.record-item__meta {
  margin-top: 10rpx;
  color: #607176;
  font-size: 26rpx;
}

.record-item__actions {
  display: flex;
  gap: 16rpx;
  margin-top: 16rpx;
}

.mini-btn {
  margin: 0;
  padding: 0 24rpx;
  height: 64rpx;
  line-height: 64rpx;
  border-radius: 16rpx;
  background: #e8f5ef;
  color: #1f8a70;
  font-size: 26rpx;
}

.mini-btn--danger {
  background: #fff1f1;
  color: #c84a4a;
}
</style>
