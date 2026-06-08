<template>
  <view class="function-card">
    <view v-for="item in list" :key="item.id" class="function-item" @tap="emit('select', item)">
      <view class="icon-wrap" :style="{ backgroundColor: item.color + '18', color: item.color }">
        <text>{{ item.icon }}</text>
      </view>
      <text class="function-name">{{ item.name }}</text>
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
.function-card {
  display: flex;
  flex-wrap: wrap;
  margin: 0 28rpx 22rpx;
  padding: 24rpx 10rpx 4rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  box-shadow: 0 12rpx 32rpx rgba(31, 45, 61, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20%;
  margin-bottom: 24rpx;
  transition: transform 0.2s ease;
}

.function-item:active {
  transform: scale(0.92);
}

.icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 86rpx;
  height: 86rpx;
  border-radius: 28rpx;
  font-size: 38rpx;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
}

.function-name {
  margin-top: 12rpx;
  color: #172033;
  font-size: 24rpx;
  font-weight: 600;
}
</style>
