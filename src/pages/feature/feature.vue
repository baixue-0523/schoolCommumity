<template>
  <view class="page">
    <view class="nav">
      <text class="back" @tap="goBack">‹</text>
      <text class="nav-title">{{ title }}</text>
      <text class="placeholder"></text>
    </view>

    <view class="hero">
      <view class="hero-icon">{{ icon }}</view>
      <view>
        <text class="hero-title">{{ title }}</text>
        <text class="hero-desc">{{ desc }}</text>
      </view>
    </view>

    <view class="card">
      <text class="section-title">快捷操作</text>
      <view class="action-grid">
        <view v-for="item in actions" :key="item" class="action-item" @tap="showAction(item)">{{ item }}</view>
      </view>
    </view>

    <view class="card">
      <text class="section-title">相关推荐</text>
      <view v-for="item in relatedPosts" :key="item.id" class="post-item" @tap="goPostDetail(item.id)">
        <text class="post-title">{{ item.title }}</text>
        <text class="post-meta">{{ item.user.name }} · {{ item.publishTime }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getAllPosts } from '../../utils/communityStore'

const title = ref('校园服务')
const icon = ref('✨')

const desc = computed(() => `${title.value}相关内容与基础操作入口`)
const actions = ['查看最新', '发布相关内容', '收藏入口', '分享给同学']
const relatedPosts = computed(() => {
  const matched = getAllPosts().filter((item) => (
    item.title.includes(title.value) || item.content.includes(title.value) || item.tags.includes(title.value)
  ))
  return (matched.length ? matched : getAllPosts()).slice(0, 4)
})

const goBack = () => {
  uni.navigateBack({ fail: () => uni.redirectTo({ url: '/pages/index/index' }) })
}

const showAction = (name) => {
  if (name === '发布相关内容') {
    uni.navigateTo({ url: '/pages/publish/publish' })
    return
  }

  uni.showToast({ title: `${name}成功（模拟）`, icon: 'none' })
}

const goPostDetail = (id) => {
  uni.navigateTo({ url: `/pages/post-detail/post-detail?id=${id}` })
}

onLoad((query) => {
  if (query.title) {
    title.value = decodeURIComponent(query.title)
  }
  if (query.icon) {
    icon.value = decodeURIComponent(query.icon)
  }
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: calc(var(--status-bar-height) + 18rpx) 28rpx 40rpx;
  background: #f5f7fb;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22rpx;
}

.back,
.placeholder {
  width: 70rpx;
}

.back {
  color: #172033;
  font-size: 58rpx;
  line-height: 1;
}

.nav-title {
  color: #172033;
  font-size: 32rpx;
  font-weight: 800;
}

.hero {
  display: flex;
  align-items: center;
  padding: 34rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #2f6bff, #8b5cf6);
  color: #ffffff;
}

.hero-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 104rpx;
  height: 104rpx;
  margin-right: 22rpx;
  border-radius: 30rpx;
  background: rgba(255, 255, 255, 0.18);
  font-size: 46rpx;
}

.hero-title {
  display: block;
  font-size: 38rpx;
  font-weight: 900;
}

.hero-desc {
  display: block;
  margin-top: 10rpx;
  font-size: 25rpx;
  opacity: 0.86;
}

.card {
  margin-top: 22rpx;
  padding: 26rpx;
  border-radius: 24rpx;
  background: #ffffff;
}

.section-title {
  display: block;
  margin-bottom: 18rpx;
  color: #172033;
  font-size: 30rpx;
  font-weight: 800;
}

.action-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.action-item {
  width: 47%;
  padding: 22rpx 0;
  border-radius: 18rpx;
  background: #f5f7fb;
  color: #2f6bff;
  font-size: 26rpx;
  font-weight: 700;
  text-align: center;
}

.post-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eef1f6;
}

.post-item:last-child {
  border-bottom: 0;
}

.post-title {
  display: block;
  color: #172033;
  font-size: 28rpx;
  font-weight: 700;
}

.post-meta {
  display: block;
  margin-top: 8rpx;
  color: #9aa4b2;
  font-size: 23rpx;
}
</style>
