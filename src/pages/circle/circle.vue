<template>
  <view class="page" :class="{ 'theme-dark': isDark }">
    <view class="hero">
      <text class="title">✨ 校园超级圈子 ✨</text>
      <text class="subtitle">与全校 12,000+ 同学不期而遇，畅聊无限</text>
    </view>

    <view class="section">
      <view v-for="item in circles" :key="item.id" class="circle-card" @tap="goCircleDetail(item)">
        <view class="circle-icon" :style="{ backgroundColor: item.color + '18', color: item.color }">{{ item.icon }}</view>
        <view class="circle-info">
          <text class="circle-name">{{ item.name }}</text>
          <text class="circle-desc">{{ item.desc }}</text>
        </view>
        <text class="circle-count">{{ item.count }}人 ➔</text>
      </view>
    </view>

    <BottomTabBar :tabs="bottomTabs" active="circle" @change="handleBottomTabChange" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import BottomTabBar from '../../components/home/BottomTabBar.vue'
import { bottomTabs } from '../../mock/home'
import { getTheme } from '../../utils/communityStore'

const isDark = ref(false)

const circles = ref([
  { id: 1, name: '学习互助圈', desc: '资料共享、课程答疑、考试经验', icon: '📚', color: '#2F6BFF', count: 1280 },
  { id: 2, name: '校园搭子圈', desc: '饭搭子、运动搭子、自习搭子', icon: '🤝', color: '#8B5CF6', count: 936 },
  { id: 3, name: '二手交易圈', desc: '教材、数码、生活用品流转', icon: '📦', color: '#FF7A59', count: 752 },
  { id: 4, name: '社团活动圈', desc: '招新、活动、演出与比赛', icon: '🎉', color: '#22C55E', count: 618 },
])

onShow(() => {
  isDark.value = getTheme() === 'dark'
})

const goCircleDetail = (item) => {
  uni.navigateTo({
    url: `/pages/circle-detail/circle-detail?id=${item.id}&name=${encodeURIComponent(item.name)}`
  })
}

const handleBottomTabChange = (item) => {
  if (item.path) {
    uni.redirectTo({ url: item.path })
  }
}
</script>

<style scoped src="@/static/css/circle.css"></style>
