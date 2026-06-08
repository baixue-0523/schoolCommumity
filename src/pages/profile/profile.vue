<template>
  <view class="page" :class="{ 'theme-dark': isDark }">
    <view class="nav">
      <text class="back" @tap="goBack">‹</text>
      <text class="nav-title">个人信息</text>
      <text class="more">•••</text>
    </view>

    <view class="profile-card">
      <view class="avatar">{{ avatarText }}</view>
      <text class="name">{{ user.name }}</text>
      <text class="college">{{ user.college }}</text>
      <text v-if="user.verified" class="verified">学生认证</text>
      <view class="follow-btn" :class="{ followed }" @tap="toggleFollow">{{ followed ? '已关注' : '+ 关注' }}</view>
    </view>

    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-value">128</text>
        <text class="stat-label">动态</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">2.4k</text>
        <text class="stat-label">粉丝</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">86</text>
        <text class="stat-label">关注</text>
      </view>
    </view>

    <view class="info-card">
      <text class="section-title">个人简介</text>
      <text class="bio">热爱校园生活，喜欢分享学习经验、活动信息和日常瞬间。</text>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getTheme } from '../../utils/communityStore'

const isDark = ref(false)
const followed = ref(false)
const user = ref({ name: '校园同学', college: '校园用户', verified: false })
const avatarText = computed(() => user.value.name.slice(0, 1))

const goBack = () => {
  uni.navigateBack({ fail: () => uni.redirectTo({ url: '/pages/index/index' }) })
}

const toggleFollow = () => {
  followed.value = !followed.value
  uni.showToast({ title: followed.value ? '关注成功' : '已取消关注', icon: 'none' })
}

onLoad((query) => {
  user.value = {
    name: decodeURIComponent(query.name || '校园同学'),
    college: decodeURIComponent(query.college || '校园用户'),
    verified: Number(query.verified || 0) === 1
  }
})

onShow(() => {
  isDark.value = getTheme() === 'dark'
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: calc(var(--status-bar-height) + 18rpx) 28rpx 40rpx;
  background: #f5f7fb;
  box-sizing: border-box;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28rpx;
}

.back,
.more {
  width: 80rpx;
  color: #172033;
  font-size: 50rpx;
  font-weight: 800;
}

.more {
  font-size: 34rpx;
  text-align: right;
}

.nav-title {
  color: #172033;
  font-size: 34rpx;
  font-weight: 900;
}

.profile-card,
.stats-card,
.info-card {
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 12rpx 32rpx rgba(31, 45, 61, 0.06);
  backdrop-filter: blur(16px);
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 44rpx 28rpx;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 138rpx;
  height: 138rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #2f6bff, #8b5cf6);
  color: #ffffff;
  font-size: 54rpx;
  font-weight: 900;
}

.name {
  margin-top: 22rpx;
  color: #172033;
  font-size: 38rpx;
  font-weight: 900;
}

.college {
  margin-top: 10rpx;
  color: #697386;
  font-size: 26rpx;
}

.verified {
  margin-top: 16rpx;
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  background: #eef4ff;
  color: #2f6bff;
  font-size: 23rpx;
  font-weight: 700;
}

.follow-btn {
  margin-top: 28rpx;
  min-width: 220rpx;
  height: 76rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #2f6bff, #8b5cf6);
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 800;
  text-align: center;
  line-height: 76rpx;
  box-shadow: 0 10rpx 24rpx rgba(47, 107, 255, 0.25);
}

.follow-btn.followed {
  background: rgba(23, 32, 51, 0.08);
  color: #172033;
  box-shadow: none;
}

.stats-card {
  display: flex;
  margin-top: 24rpx;
  padding: 28rpx 0;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  color: #172033;
  font-size: 34rpx;
  font-weight: 900;
}

.stat-label {
  margin-top: 8rpx;
  color: #697386;
  font-size: 24rpx;
}

.info-card {
  margin-top: 24rpx;
  padding: 30rpx;
}

.section-title {
  display: block;
  color: #172033;
  font-size: 30rpx;
  font-weight: 900;
}

.bio {
  display: block;
  margin-top: 16rpx;
  color: #4b5565;
  font-size: 27rpx;
  line-height: 1.7;
}

.theme-dark.page {
  background: #121212 !important;
}

.theme-dark .profile-card,
.theme-dark .stats-card,
.theme-dark .info-card {
  background: rgba(30, 30, 30, 0.9) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.theme-dark .back,
.theme-dark .more,
.theme-dark .nav-title,
.theme-dark .name,
.theme-dark .stat-value,
.theme-dark .section-title {
  color: #ffffff !important;
}

.theme-dark .college,
.theme-dark .stat-label,
.theme-dark .bio {
  color: #b6bcc8 !important;
}

.theme-dark .follow-btn.followed {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}
</style>
