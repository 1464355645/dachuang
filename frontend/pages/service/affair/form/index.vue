<template>
  <view class="page-container">
    <view class="page-title">网上办事</view>
    <view class="page-subtitle">信息填清楚，步骤尽量少。</view>

    <view class="card section-gap">
      <view class="form-group">
        <view class="input-label">姓名</view>
        <input v-model="form.name" class="input-box" placeholder="请输入姓名" />
      </view>
      <view class="form-group">
        <view class="input-label">手机号</view>
        <input v-model="form.phone" class="input-box" placeholder="请输入手机号" />
      </view>
      <view class="form-group">
        <view class="input-label">业务类型</view>
        <picker :range="types" range-key="label" @change="handleTypeChange">
          <view class="picker-box">{{ form.businessType || '请选择业务类型' }}</view>
        </picker>
      </view>
      <view class="form-group">
        <view class="input-label">说明</view>
        <textarea v-model="form.description" class="textarea-box" placeholder="可简单说明用途" />
      </view>
      <button class="primary-btn section-gap" @click="handleSubmit">提交办理</button>
      <button class="secondary-btn section-gap" @click="goHistory">查看历史记录</button>
    </view>
  </view>
</template>

<script>
import { getAffairTypes, submitAffair } from '../../../../api/life-services'

function getDefaultForm() {
  return {
    name: '',
    phone: '',
    businessType: '',
    description: ''
  }
}

export default {
  data() {
    return {
      types: [],
      form: getDefaultForm()
    }
  },
  onLoad() {
    this.loadTypes()
  },
  methods: {
    async loadTypes() {
      this.types = await getAffairTypes()
    },
    handleTypeChange(event) {
      const index = Number(event.detail.value)
      this.form.businessType = this.types[index].label
    },
    async handleSubmit() {
      if (!this.form.name || !this.form.phone || !this.form.businessType) {
        uni.showToast({
          title: '请先填写姓名、手机号和业务类型',
          icon: 'none'
        })
        return
      }
      const result = await submitAffair(this.form)
      uni.showModal({
        title: '提交成功',
        content: '预计处理时间 ' + result.etaDays + ' 天，请耐心等待。',
        showCancel: false
      })
      this.form = getDefaultForm()
    },
    goHistory() {
      uni.navigateTo({
        url: '/pages/service/affair/history/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-group {
  margin-bottom: 20rpx;
}

.picker-box {
  width: 100%;
  min-height: 92rpx;
  padding: 20rpx;
  border: 2rpx solid #dce7e1;
  border-radius: 18rpx;
  background: #fff;
  font-size: 30rpx;
  color: #42565d;
}
</style>