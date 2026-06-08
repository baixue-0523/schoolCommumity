<template>
  <view v-if="visible" class="share-mask" @tap="emit('close')">
    <view class="share-panel" @tap.stop>
      <scroll-view class="share-row" scroll-x>
        <view class="share-friends">
          <view v-for="friend in friends" :key="friend.id" class="share-friend" @tap="emit('select', friend.name)">
            <view class="share-avatar" :style="{ background: friend.color }">{{ friend.name.slice(0, 1) }}</view>
            <text class="share-name">{{ friend.name }}</text>
          </view>
        </view>
      </scroll-view>
      <view class="share-channels">
        <view v-for="channel in channels" :key="channel.name" class="share-channel" @tap="emit('select', channel.name)">
          <view class="channel-icon"><image class="channel-img" :src="channel.icon" mode="aspectFit" lazy-load fade-show /></view>
          <text class="channel-name">{{ channel.name }}</text>
        </view>
      </view>
      <view class="share-cancel" @tap="emit('close')">取消</view>
    </view>
  </view>
</template>

<script setup>
import { shareChannels, shareFriends } from '../../mock/share'

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  friends: {
    type: Array,
    default: () => shareFriends,
  },
  channels: {
    type: Array,
    default: () => shareChannels,
  },
})

const emit = defineEmits(['close', 'select'])
</script>

<style scoped>
.share-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 998;
  display: flex;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.38);
}

.share-panel {
  width: 100%;
  padding: 28rpx 28rpx calc(20rpx + env(safe-area-inset-bottom));
  border-radius: 32rpx 32rpx 0 0;
  background: rgba(255, 255, 255, 0.96);
  box-sizing: border-box;
  backdrop-filter: blur(20px);
}

.share-row {
  width: 100%;
  white-space: nowrap;
}

.share-friends {
  display: flex;
  gap: 28rpx;
  padding-bottom: 24rpx;
}

.share-friend,
.share-channel {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.share-avatar,
.channel-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 86rpx;
  height: 86rpx;
  border-radius: 50%;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 800;
}

.channel-icon {
  background: #f5f7fb;
}

.channel-img {
  width: 54rpx;
  height: 54rpx;
}

.share-name,
.channel-name {
  margin-top: 10rpx;
  color: #4b5565;
  font-size: 22rpx;
}

.share-channels {
  display: flex;
  justify-content: space-around;
  padding: 24rpx 0;
  border-top: 1rpx solid #eef1f6;
  border-bottom: 1rpx solid #eef1f6;
}

.share-cancel {
  margin-top: 18rpx;
  height: 78rpx;
  border-radius: 999rpx;
  background: #f5f7fb;
  color: #172033;
  font-size: 28rpx;
  font-weight: 800;
  line-height: 78rpx;
  text-align: center;
}
</style>
