<template>
  <view class="search-wrap">
    <view class="search-box" @tap="emit('search')">
      <text class="search-icon">🔍</text>
      <text class="placeholder">搜索校园资讯、活动、二手</text>
    </view>
    <view class="scan-btn" @tap="emit('scan')">▣</view>
    <view class="weather">
      <text>{{ weather.text }}</text>
      <text class="temperature">{{ weather.temperature }}</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  weather: {
    type: Object,
    default: () => ({
      text: '晴',
      temperature: '26℃',
    }),
  },
})

const emit = defineEmits(['search', 'scan'])
</script>

<style scoped>
.search-wrap {
  display: flex;
  align-items: center;
  gap: 14rpx;
  padding: 0 28rpx 22rpx;
  background: transparent;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  height: 76rpx;
  padding: 0 24rpx;
  border-radius: 38rpx;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(10px);
  box-shadow: 0 10rpx 26rpx rgba(31, 45, 61, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.search-icon {
  margin-right: 12rpx;
  font-size: 28rpx;
}

.placeholder {
  color: #7a869a;
  font-size: 26rpx;
  font-weight: 500;
}

.scan-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 76rpx;
  height: 76rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(10px);
  color: #2f6bff;
  font-size: 34rpx;
  font-weight: 700;
  box-shadow: 0 10rpx 26rpx rgba(31, 45, 61, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.weather {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: #5b6472;
  font-size: 22rpx;
  line-height: 1.25;
}

.temperature {
  color: #2f6bff;
  font-size: 26rpx;
  font-weight: 700;
}
</style>
