<template>
  <view class="home-header">
    <view class="campus" @tap="emit('changeCampus')">
      <text class="campus-name">{{ campusName }}</text>
      <text class="campus-arrow">⌄</text>
    </view>
    <view class="header-actions">
      <view class="action-btn" @tap="emit('openMenu')">☰</view>
      <view class="action-btn message" @tap="emit('openMessage')">
        <text>🔔</text>
        <text class="dot"></text>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  campusName: {
    type: String,
    default: '南湖校区',
  },
})

const emit = defineEmits(['changeCampus', 'openMenu', 'openMessage'])
</script>

<style scoped>
.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(var(--status-bar-height) + 24rpx) 28rpx 18rpx;
  background: transparent;
}

.campus {
  display: flex;
  align-items: center;
  min-width: 0;
}

.campus-name {
  color: #172033;
  font-size: 40rpx;
  font-weight: 900;
  text-shadow: 0 2rpx 8rpx rgba(25, 40, 70, 0.05);
  background: linear-gradient(135deg, #172033 0%, #2f6bff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.campus-arrow {
  margin-left: 10rpx;
  color: #2f6bff;
  font-size: 32rpx;
  font-weight: 800;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.action-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  color: #172033;
  font-size: 34rpx;
  backdrop-filter: blur(8px);
  box-shadow: 0 12rpx 28rpx rgba(47, 107, 255, 0.15);
  transition: all 0.2s ease;
}

.action-btn:active {
  transform: scale(0.92);
}

.dot {
  position: absolute;
  top: 14rpx;
  right: 14rpx;
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #ff4d4f;
}
</style>
