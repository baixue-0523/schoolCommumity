<template>
  <view class="page" :class="{ 'theme-dark': isDark }">
    <view class="header">
      <text class="title">消息中心</text>
      <text class="read-all" @tap="markRead">全部已读</text>
    </view>

    <!-- 在线好友列表 -->
    <view class="friends-section">
      <text class="friends-title">我的好友 (5个在线)</text>
      <scroll-view class="friends-scroll" scroll-x="true">
        <view class="friends-list">
          <view v-for="friend in friends" :key="friend.id" class="friend-item" @tap="chatWithFriend(friend)">
            <view class="friend-avatar-wrap">
              <view class="friend-avatar" :style="{ background: friend.color }">
                {{ friend.name.slice(0, 1) }}
              </view>
              <text class="online-status"></text>
            </view>
            <text class="friend-name">{{ friend.name }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 消息卡片 -->
    <view class="message-card" v-for="item in messages" :key="item.id" @tap="openMessage(item)">
      <view class="message-icon" :style="{ backgroundColor: item.color + '18', color: item.color }">{{ item.icon }}</view>
      <view class="message-main">
        <view class="message-top">
          <text class="message-title">{{ item.title }}</text>
          <text class="message-time">{{ item.time }}</text>
        </view>
        <text class="message-content">{{ item.content }}</text>
      </view>
      <text v-if="item.unread" class="unread-dot"></text>
    </view>

    <BottomTabBar :tabs="bottomTabs" active="message" @change="handleBottomTabChange" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import BottomTabBar from '../../components/home/BottomTabBar.vue'
import { bottomTabs } from '../../mock/home'
import { getMessages, saveMessages, getTheme } from '../../utils/communityStore'

const isDark = ref(false)
const messages = ref(getMessages())

const friends = ref([
  { id: 1, name: '南区小橙 🍊', color: 'linear-gradient(135deg, #FF9F43, #FF5252)' },
  { id: 2, name: '外语林学姐 🌸', color: 'linear-gradient(135deg, #EA5455, #FEB692)' },
  { id: 3, name: '自动化小李 🤖', color: 'linear-gradient(135deg, #00C6FF, #0072FF)' },
  { id: 4, name: '考研锦鲤 🌟', color: 'linear-gradient(135deg, #F9D423, #FF4E50)' },
  { id: 5, name: '北区吉他男 🎸', color: 'linear-gradient(135deg, #7367F0, #CE9FFC)' }
])

const circleMap = [
  { id: 1, name: '学习互助圈' },
  { id: 2, name: '校园搭子圈' },
  { id: 3, name: '二手交易圈' },
  { id: 4, name: '社团活动圈' }
]

onShow(() => {
  isDark.value = getTheme() === 'dark'
  messages.value = getMessages()
})

const chatWithFriend = (friend) => {
  uni.navigateTo({
    url: `/pages/chat/chat?id=${friend.id}&name=${encodeURIComponent(friend.name)}`
  })
}

const markRead = () => {
  messages.value = messages.value.map((item) => ({ ...item, unread: false }))
  saveMessages(messages.value)
  uni.showToast({ title: '已全部标记为已读', icon: 'none' })
}

const openMessage = (item) => {
  messages.value = messages.value.map((message) => (
    message.id === item.id ? { ...message, unread: false } : message
  ))
  saveMessages(messages.value)
  const matchedCircle = item.type === 'circle'
    ? circleMap.find((circle) => circle.id === item.circleId || item.title.includes(circle.name))
    : null
  if (matchedCircle) {
    uni.navigateTo({
      url: `/pages/circle-detail/circle-detail?id=${matchedCircle.id}&name=${encodeURIComponent(matchedCircle.name)}`
    })
    return
  }
  uni.showModal({
    title: item.title,
    content: item.content,
    showCancel: false,
  })
}

const handleBottomTabChange = (item) => {
  if (item.path) {
    uni.redirectTo({ url: item.path })
  }
}
</script>

<style scoped src="@/static/css/message.css"></style>
