<template>
  <view class="empty-state">
    <text class="empty-icon">🫧</text>
    <text class="empty-text">{{ text }}</text>
  </view>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: '暂无内容',
  },
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 70rpx 0;
  background: #ffffff;
}

.empty-icon {
  font-size: 58rpx;
}

.empty-text {
  margin-top: 14rpx;
  color: #9aa4b2;
  font-size: 26rpx;
}
</style>
