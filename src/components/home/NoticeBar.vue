<template>
  <view class="notice-card">
    <view class="notice-label">公告</view>
    <view class="notice-list">
      <view v-for="item in list" :key="item.id" class="notice-item" @tap="emit('select', item)">
        <text class="notice-title">{{ item.title }}</text>
        <text class="notice-time">{{ item.time }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['select'])
</script>

<style scoped>
.notice-card {
  display: flex;
  margin: 0 28rpx 22rpx;
  padding: 22rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 12rpx 32rpx rgba(31, 45, 61, 0.04);
}

.notice-label {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 86rpx;
  height: 44rpx;
  margin-right: 18rpx;
  border-radius: 999rpx;
  background: #fff3ed;
  color: #ff7a59;
  font-size: 24rpx;
  font-weight: 700;
}

.notice-list {
  flex: 1;
  min-width: 0;
}

.notice-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  margin-bottom: 12rpx;
}

.notice-item:last-child {
  margin-bottom: 0;
}

.notice-title {
  flex: 1;
  overflow: hidden;
  color: #303847;
  font-size: 25rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notice-time {
  flex: 0 0 auto;
  margin-left: 16rpx;
  color: #9aa4b2;
  font-size: 22rpx;
}
</style>
