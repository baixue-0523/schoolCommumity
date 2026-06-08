<template>
  <view class="publish-btn" @tap="emit('click')">
    <text class="plus">＋</text>
    <text class="label">发布</text>
  </view>
</template>

<script setup>
const emit = defineEmits(['click'])
</script>

<style scoped>
.publish-btn {
  position: fixed;
  right: 30rpx;
  bottom: calc(132rpx + env(safe-area-inset-bottom));
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 148rpx;
  height: 64rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #2f6bff, #6d5dfc);
  color: #ffffff;
  box-shadow: 0 14rpx 32rpx rgba(47, 107, 255, 0.35);
}

.plus {
  margin-right: 4rpx;
  font-size: 34rpx;
  font-weight: 700;
}

.label {
  font-size: 26rpx;
  font-weight: 700;
}
</style>
