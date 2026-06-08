<template>
  <view class="page" :class="{ 'theme-dark': isDark }">
    <view class="header">
      <text class="back" @tap="goBack">‹</text>
      <text class="title">浏览历史</text>
      <text class="clear-btn" @tap="clearHistory" v-if="history.length > 0">清空</text>
    </view>

    <view v-if="history.length === 0" class="empty">
      <text class="empty-icon">👀</text>
      <text class="empty-text">暂无浏览记录</text>
    </view>

    <view v-for="item in history" :key="item.id" class="post-card" @tap="goDetail(item.id)">
      <text class="post-title">{{ item.title }}</text>
      <text class="post-content">{{ item.content }}</text>
      <view class="meta-row">
        <text>♡ {{ item.likeCount }}</text>
        <text>💬 {{ item.commentCount }}</text>
        <text>{{ formatTime(item.browseTime) }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getTheme, getBrowseHistory, clearBrowseHistory } from '../../utils/communityStore'

const isDark = ref(false)
const history = ref([])

onMounted(() => {
  isDark.value = getTheme() === 'dark'
  history.value = getBrowseHistory()
})

const formatTime = (timestamp) => {
  if (!timestamp) return '刚刚'
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  return `${days}天前`
}

const goBack = () => {
  uni.navigateBack()
}

const goDetail = (id) => {
  uni.navigateTo({
    url: `/pages/post-detail/post-detail?id=${id}`
  })
}

const clearHistory = () => {
  uni.showModal({
    title: '提示',
    content: '确认清空所有浏览记录吗？',
    success: (res) => {
      if (res.confirm) {
        clearBrowseHistory()
        history.value = []
        uni.showToast({ title: '已清空', icon: 'success' })
      }
    }
  })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: calc(var(--status-bar-height) + 18rpx) 28rpx 40rpx;
  background: #f5f7fb;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 28rpx;
}

.back {
  width: 70rpx;
  color: #172033;
  font-size: 58rpx;
  line-height: 1;
}

.title {
  flex: 1;
  text-align: center;
  color: #172033;
  font-size: 32rpx;
  font-weight: 800;
}

.clear-btn {
  width: 70rpx;
  color: #2f6bff;
  font-size: 26rpx;
  text-align: right;
}

.post-card {
  margin-bottom: 20rpx;
  padding: 26rpx;
  border-radius: 24rpx;
  background: #ffffff;
}

.post-title {
  display: block;
  color: #172033;
  font-size: 30rpx;
  font-weight: 800;
  margin-bottom: 12rpx;
}

.post-content {
  display: block;
  color: #4b5565;
  font-size: 26rpx;
  line-height: 1.55;
  margin-bottom: 16rpx;
}

.meta-row {
  display: flex;
  gap: 24rpx;
  color: #9aa4b2;
  font-size: 22rpx;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 110rpx 0;
  color: #9aa4b2;
}

.empty-icon {
  font-size: 60rpx;
}

.empty-text {
  margin-top: 16rpx;
  font-size: 26rpx;
}

.theme-dark {
  background: #05070d;
}

.theme-dark .post-card {
  background: rgba(255, 255, 255, 0.08);
}

.theme-dark .post-title,
.theme-dark .title,
.theme-dark .back {
  color: #ffffff;
}

.theme-dark .post-content,
.theme-dark .meta-row,
.theme-dark .empty,
.theme-dark .clear-btn {
  color: rgba(255, 255, 255, 0.72);
}
</style>