<template>
  <view class="hot-section">
    <view class="section-title-row">
      <text class="section-title">热门入口</text>
      <text class="section-more">更多</text>
    </view>
    <scroll-view scroll-x class="hot-scroll" :show-scrollbar="false">
      <view class="hot-list">
        <view v-for="item in list" :key="item.id" class="hot-card" :style="{ backgroundColor: item.color + '12' }" @tap="emit('select', item)">
          <view class="hot-top">
            <text class="hot-title">{{ item.title }}</text>
            <text class="hot-badge" :style="{ color: item.color }">{{ item.badge }}</text>
          </view>
          <text class="hot-desc">{{ item.desc }}</text>
        </view>
      </view>
    </scroll-view>
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
.hot-section {
  margin: 0 28rpx 22rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  box-shadow: 0 12rpx 32rpx rgba(31, 45, 61, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18rpx;
}

.section-title {
  color: #172033;
  font-size: 32rpx;
  font-weight: 800;
  background: linear-gradient(135deg, #172033 0%, #6d5dfc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-more {
  color: #2f6bff;
  font-size: 24rpx;
  font-weight: 700;
}

.hot-scroll {
  white-space: nowrap;
}

.hot-list {
  display: flex;
  gap: 18rpx;
}

.hot-card {
  flex: 0 0 auto;
  width: 292rpx;
  padding: 24rpx 22rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.02);
  transition: transform 0.2s ease;
}

.hot-card:active {
  transform: scale(0.95);
}

.hot-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hot-title {
  color: #172033;
  font-size: 28rpx;
  font-weight: 700;
}

.hot-badge {
  font-size: 22rpx;
  font-weight: 700;
}

.hot-desc {
  display: block;
  margin-top: 12rpx;
  color: #697386;
  font-size: 24rpx;
}
</style>
