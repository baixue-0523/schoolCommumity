<template>
  <view class="feed-tabs">
    <view v-for="tab in tabs" :key="tab.key" class="tab-item" :class="{ active: active === tab.key }" @tap="emit('change', tab.key)">
      <text>{{ tab.name }}</text>
      <text class="tab-line"></text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  tabs: {
    type: Array,
    default: () => [],
  },
  active: {
    type: String,
    default: 'recommend',
  },
})

const emit = defineEmits(['change'])
</script>

<style scoped>
.feed-tabs {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 24rpx 8rpx 12rpx;
  border-radius: 24rpx 24rpx 0 0;
  background: #ffffff;
}

.tab-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #697386;
  font-size: 28rpx;
  font-weight: 600;
}

.tab-item.active {
  color: #2f6bff;
}

.tab-line {
  width: 0;
  height: 6rpx;
  margin-top: 10rpx;
  border-radius: 999rpx;
  background: #2f6bff;
  transition: width 0.2s;
}

.tab-item.active .tab-line {
  width: 34rpx;
}
</style>
