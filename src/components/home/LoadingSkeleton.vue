<template>
  <view class="skeleton-container">
    <view v-for="i in count" :key="i" class="skeleton-card">
      <view class="skeleton-header">
        <view class="skeleton-avatar"></view>
        <view class="skeleton-info">
          <view class="skeleton-line skeleton-name"></view>
          <view class="skeleton-line skeleton-time"></view>
        </view>
      </view>
      <view class="skeleton-body">
        <view class="skeleton-line skeleton-title"></view>
        <view class="skeleton-line skeleton-content"></view>
        <view class="skeleton-line skeleton-content-short"></view>
      </view>
      <view class="skeleton-footer">
        <view class="skeleton-icon"></view>
        <view class="skeleton-icon"></view>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 3
  }
})
</script>

<style scoped>
.skeleton-container {
  padding: 0 30rpx;
}

.skeleton-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.skeleton-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.skeleton-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-info {
  flex: 1;
  margin-left: 20rpx;
}

.skeleton-line {
  height: 32rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 8rpx;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-name {
  width: 40%;
  margin-bottom: 12rpx;
}

.skeleton-time {
  width: 30%;
  height: 24rpx;
}

.skeleton-body {
  margin-bottom: 20rpx;
}

.skeleton-title {
  width: 70%;
  margin-bottom: 16rpx;
}

.skeleton-content {
  width: 100%;
  margin-bottom: 12rpx;
}

.skeleton-content-short {
  width: 60%;
}

.skeleton-footer {
  display: flex;
  gap: 40rpx;
}

.skeleton-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 8rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>