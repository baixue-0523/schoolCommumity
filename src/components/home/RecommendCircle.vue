<template>
  <view class="recommend-wrapper">
    <view class="recommend-section">
      <view class="section-header">
        <text class="section-title">推荐圈子</text>
        <text class="section-more" @tap="viewMore">更多</text>
      </view>

      <scroll-view scroll-x class="circle-scroll" show-scrollbar="false">
        <view class="circle-list">
          <view 
            v-for="item in list" 
            :key="item.id" 
            class="circle-card"
            @click="goCircleDetail(item.id)"
          >
            <view class="circle-avatar">
              <text class="avatar-text">{{ item.name.slice(0, 1) }}</text>
            </view>
            <text class="circle-name">{{ item.name }}</text>
            <text class="circle-member">{{ item.memberCount }}人参与</text>
            <view class="circle-tags">
              <text v-for="tag in item.tags.slice(0, 2)" :key="tag" class="circle-tag">{{ tag }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

const goCircleDetail = (id) => {
  uni.navigateTo({
    url: `/pages/circle-detail/circle-detail?id=${id}`
  })
}

const viewMore = () => {
  uni.switchTab({
    url: '/pages/circle/circle'
  })
}
</script>

<style scoped>
/* 外层容器：控制与上下内容的外边距 */
.recommend-wrapper {
  margin: 20rpx 26rpx;
}

/* 整个模块：毛玻璃背景，包含标题和卡片 */
.recommend-section {
  padding: 26rpx 0 26rpx 0;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 12rpx 32rpx rgba(31, 45, 61, 0.04);
}

/* 标题栏 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0 26rpx;
  margin-bottom: 20rpx;
}

.section-title {
  color: #172033;
  font-size: 32rpx;
  font-weight: 800;
}

.section-more {
  color: #9aa4b2;
  font-size: 24rpx;
}

/* 横向滚动 */
.circle-scroll {
  white-space: nowrap;
}

.circle-list {
  display: inline-flex;
  padding-left: 26rpx;
  padding-right: 26rpx;
}

/* 单个圈子卡片：透明背景，继承父级毛玻璃 */
.circle-card {
  display: inline-flex;
  flex-direction: column;
  width: 200rpx;
  margin-right: 20rpx;
  padding: 16rpx 12rpx;
  border-radius: 20rpx;
  background: transparent;
}

.circle-card:last-child {
  margin-right: 0;
}

.circle-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 78rpx;
  height: 78rpx;
  margin: 0 auto 12rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #2f6bff, #8b5cf6);
}

.avatar-text {
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 700;
}

.circle-name {
  color: #172033;
  font-size: 28rpx;
  font-weight: 700;
  text-align: center;
  margin-bottom: 4rpx;
}

.circle-member {
  display: block;
  color: #9aa4b2;
  font-size: 22rpx;
  text-align: center;
  margin-bottom: 10rpx;
}

.circle-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6rpx;
}

.circle-tag {
  padding: 4rpx 10rpx;
  border-radius: 999rpx;
  background: rgba(47, 107, 255, 0.1);
  color: #2f6bff;
  font-size: 20rpx;
}
.section-more{
  color:#2f6bff;
  font-size: 24rpx;
  font-weight: 700;
}
</style>