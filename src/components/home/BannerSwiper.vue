<template>
  <view class="banner-card">
    <swiper class="banner-swiper" circular autoplay interval="3200" indicator-dots indicator-color="rgba(255,255,255,0.45)" indicator-active-color="#ffffff">
      <swiper-item v-for="item in list" :key="item.id">
        <view class="banner-item" :style="{ background: item.color }">
          <view>
            <text class="banner-tag">{{ item.tag }}</text>
            <text class="banner-title">{{ item.title }}</text>
            <text class="banner-desc">{{ item.desc }}</text>
          </view>
          <view class="banner-bubble">校园</view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup>
defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
.banner-card {
  margin: 0 28rpx 22rpx;
  border-radius: 24rpx;
  overflow: hidden;
}

.banner-swiper {
  height: 306rpx;
}

.banner-item {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 34rpx;
  color: #ffffff;
}

.banner-tag {
  display: inline-flex;
  margin-bottom: 20rpx;
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.2);
  font-size: 22rpx;
}

.banner-title {
  display: block;
  font-size: 42rpx;
  font-weight: 800;
}

.banner-desc {
  display: block;
  margin-top: 12rpx;
  color: rgba(255, 255, 255, 0.86);
  font-size: 26rpx;
}

.banner-bubble {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 138rpx;
  height: 138rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  font-size: 32rpx;
  font-weight: 700;
}
</style>
