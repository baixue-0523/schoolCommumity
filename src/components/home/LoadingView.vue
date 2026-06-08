<template>
  <view class="loading-view">
    <text v-if="loading">正在加载更多...</text>
    <text v-else-if="finished">没有更多内容了</text>
    <text v-else>上拉加载更多</text>
  </view>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  finished: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.loading-view {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 26rpx 0 34rpx;
  color: #9aa4b2;
  font-size: 24rpx;
}
</style>
