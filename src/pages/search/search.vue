<template>
  <view class="page" :class="{ 'theme-dark': isDark }">
    <view class="search-header">
      <view class="search-box">
        <text class="icon">🔍</text>
        <input 
          v-model="keyword" 
          class="input" 
          focus 
          placeholder="搜索校园资讯、活动、二手" 
          confirm-type="search" 
          @confirm="doSearch"
          @input="onInputChange"
        />
      </view>
      <text class="cancel" @tap="goBack">取消</text>
    </view>

    <!-- 联想搜索下拉框 -->
    <view v-if="keyword && suggestList.length > 0 && !searched" class="suggest-wrap">
      <view 
        v-for="item in suggestList" 
        :key="item.id" 
        class="suggest-item"
        @tap="selectSuggest(item)"
      >
        <text class="suggest-icon">🔍</text>
        <text class="suggest-text">{{ item.title }}</text>
      </view>
    </view>

    <!-- 未搜索时显示热门搜索 + 搜索历史 -->
    <view v-if="!searched" class="panel">
      <!-- 热门搜索 -->
      <view class="section">
        <text class="panel-title">热门搜索</text>
        <view class="hot-tags">
          <text v-for="item in hotSearchList" :key="item" class="hot-tag" @tap="quickSearch(item)">{{ item }}</text>
        </view>
      </view>

      <!-- 搜索历史 -->
      <view v-if="historyList.length > 0" class="section">
        <view class="history-header">
          <text class="panel-title">搜索历史</text>
          <text class="clear-btn" @tap="clearHistory">清空</text>
        </view>
        <view class="history-tags">
          <text v-for="item in historyList" :key="item" class="history-tag" @tap="quickSearch(item)">{{ item }}</text>
        </view>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view v-else class="result-wrap">
      <view class="result-title">搜索结果 {{ resultList.length }}</view>
      <view v-if="resultList.length === 0" class="empty">
        <text class="empty-icon">🔎</text>
        <text class="empty-text">没有找到相关内容</text>
      </view>
      <view v-for="item in resultList" :key="item.id" class="result-card" @tap="goPostDetail(item.id)">
        <text class="post-title">{{ item.title }}</text>
        <text class="post-content">{{ item.content }}</text>
        <view class="meta-row">
          <text>{{ item.user.name }}</text>
          <text>{{ item.publishTime }}</text>
          <text>♡ {{ item.likeCount }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { hotSearchList } from '../../mock/home'
import { getAllPosts, getTheme } from '../../utils/communityStore'

const isDark = ref(false)
const keyword = ref('')
const searched = ref(false)
const resultList = ref([])
const suggestList = ref([])

// 搜索历史
const HISTORY_KEY = 'search_history'
const historyList = ref([])

// 加载搜索历史
const loadHistory = () => {
  try {
    const history = uni.getStorageSync(HISTORY_KEY) || []
    historyList.value = history.slice(0, 10) // 最多保存10条
  } catch (error) {
    historyList.value = []
  }
}

// 保存搜索历史
const saveHistory = (word) => {
  if (!word.trim()) return
  let history = [...historyList.value]
  // 移除重复
  history = history.filter(item => item !== word)
  // 插入到最前面
  history.unshift(word)
  // 只保留前10条
  history = history.slice(0, 10)
  historyList.value = history
  try {
    uni.setStorageSync(HISTORY_KEY, history)
  } catch (error) {}
}

// 清空历史
const clearHistory = () => {
  uni.showModal({
    title: '提示',
    content: '确认清空所有搜索历史吗？',
    success: (res) => {
      if (res.confirm) {
        historyList.value = []
        try {
          uni.removeStorageSync(HISTORY_KEY)
        } catch (error) {}
        uni.showToast({ title: '已清空', icon: 'none' })
      }
    }
  })
}

// 联想搜索（实时匹配）
const updateSuggest = () => {
  const value = keyword.value.trim().toLowerCase()
  if (!value) {
    suggestList.value = []
    return
  }
  
  const posts = getAllPosts()
  const matches = posts.filter(item => {
    const target = `${item.title} ${item.content} ${item.tags.join(' ')}`.toLowerCase()
    return target.includes(value)
  })
  suggestList.value = matches.slice(0, 8) // 最多显示8条
}

// 输入时触发联想
const onInputChange = () => {
  searched.value = false
  updateSuggest()
}

// 选择联想结果
const selectSuggest = (item) => {
  keyword.value = item.title
  suggestList.value = []
  doSearch()
}

// 执行搜索
const runSearch = () => {
  const value = keyword.value.trim()
  searched.value = true
  suggestList.value = []

  if (!value) {
    resultList.value = []
    return
  }

  // 保存到历史
  saveHistory(value)

  // 搜索结果
  resultList.value = getAllPosts().filter((item) => {
    const target = `${item.title} ${item.content} ${item.tags.join(' ')} ${item.user.name}`.toLowerCase()
    return target.includes(value.toLowerCase())
  })
}

const doSearch = () => {
  runSearch()
}

const quickSearch = (value) => {
  keyword.value = value
  runSearch()
}

const goPostDetail = (id) => {
  uni.navigateTo({ url: `/pages/post-detail/post-detail?id=${id}` })
}

const goBack = () => {
  uni.navigateBack({ fail: () => uni.redirectTo({ url: '/pages/index/index' }) })
}

onLoad((query) => {
  loadHistory()
  if (query.keyword) {
    keyword.value = decodeURIComponent(query.keyword)
    runSearch()
  }
})

onShow(() => {
  isDark.value = getTheme() === 'dark'
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: calc(var(--status-bar-height) + 22rpx) 28rpx 40rpx;
  background: #f5f7fb;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  height: 76rpx;
  padding: 0 24rpx;
  border-radius: 999rpx;
  background: #ffffff;
}

.icon {
  margin-right: 12rpx;
  font-size: 28rpx;
}

.input {
  flex: 1;
  height: 76rpx;
  color: #172033;
  font-size: 28rpx;
}

.cancel {
  color: #2f6bff;
  font-size: 28rpx;
  font-weight: 700;
}

/* 联想搜索下拉框 */
.suggest-wrap {
  margin-top: 16rpx;
  background: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
}

.suggest-item {
  display: flex;
  align-items: center;
  padding: 24rpx 28rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.suggest-item:last-child {
  border-bottom: none;
}

.suggest-icon {
  margin-right: 20rpx;
  font-size: 28rpx;
  color: #9aa4b2;
}

.suggest-text {
  flex: 1;
  color: #333333;
  font-size: 28rpx;
}

.panel,
.result-wrap {
  margin-top: 28rpx;
}

.section {
  margin-bottom: 40rpx;
}

.panel-title,
.result-title {
  display: block;
  margin-bottom: 18rpx;
  color: #172033;
  font-size: 32rpx;
  font-weight: 800;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18rpx;
}

.clear-btn {
  color: #999999;
  font-size: 26rpx;
}

.hot-tags,
.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.hot-tag,
.history-tag {
  padding: 14rpx 22rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #4b5565;
  font-size: 26rpx;
}

.result-card {
  margin-bottom: 18rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  background: #ffffff;
}

.post-title {
  display: block;
  color: #172033;
  font-size: 30rpx;
  font-weight: 800;
}

.post-content {
  display: block;
  margin-top: 12rpx;
  color: #697386;
  font-size: 25rpx;
  line-height: 1.55;
}

.meta-row {
  display: flex;
  gap: 24rpx;
  margin-top: 16rpx;
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

/* 黑夜模式 */
.theme-dark {
  background: #05070d;
}

.theme-dark .search-box,
.theme-dark .hot-tag,
.theme-dark .history-tag,
.theme-dark .result-card,
.theme-dark .suggest-wrap {
  background: rgba(255, 255, 255, 0.08);
}

.theme-dark .suggest-item {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.theme-dark .input,
.theme-dark .panel-title,
.theme-dark .result-title,
.theme-dark .post-title,
.theme-dark .suggest-text {
  color: #ffffff;
}

.theme-dark .post-content,
.theme-dark .meta-row,
.theme-dark .empty,
.theme-dark .hot-tag,
.theme-dark .history-tag,
.theme-dark .clear-btn,
.theme-dark .suggest-icon {
  color: rgba(255, 255, 255, 0.72);
}
</style>