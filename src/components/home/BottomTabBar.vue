<template>
  <view class="bottom-tabbar">
    <view v-for="item in tabs" :key="item.key" class="tabbar-item" :class="{ active: active === item.key }" @tap="emit('change', item)">
      <image class="tabbar-icon" :src="getTabIcon(item.key)" mode="aspectFit" lazy-load fade-show />
      <text class="tabbar-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup>
import { onUnmounted, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getTheme } from '../../utils/communityStore'

defineProps({
  tabs: {
    type: Array,
    default: () => [],
  },
  active: {
    type: String,
    default: 'home',
  },
})

const emit = defineEmits(['change'])
const isDark = ref(false)
const tabIconMap = {
  home: ['/static/image/one.png', '/static/image/one1.png'],
  circle: ['/static/image/two.png', '/static/image/two1.png'],
  publish: ['/static/image/three.png', '/static/image/three1.png'],
  message: ['/static/image/four.png', '/static/image/four1.png'],
  mine: ['/static/image/five.png', '/static/image/five1.png'],
}

const getTabIcon = (key) => {
  const icons = tabIconMap[key] || tabIconMap.home
  return icons[isDark.value ? 1 : 0]
}

onShow(() => {
  isDark.value = getTheme() === 'dark'
})

const handleThemeChanged = (theme) => {
  isDark.value = theme === 'dark'
}

uni.$on('themeChanged', handleThemeChanged)

onUnmounted(() => {
  uni.$off('themeChanged', handleThemeChanged)
})
</script>

<style scoped>
.bottom-tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 18;
  display: flex;
  align-items: center;
  height: calc(112rpx + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1rpx solid #edf0f5;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(20px);
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8a94a6;
}

.tabbar-item.active {
  color: #2f6bff;
}

.tabbar-icon {
  width: 42rpx;
  height: 42rpx;
}

.tabbar-text {
  margin-top: 8rpx;
  font-size: 22rpx;
}
</style>
