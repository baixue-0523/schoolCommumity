<template>
  <view class="page" :class="{ 'theme-dark': isDark }">
    <!-- 自定义导航栏 -->
    <view class="nav-header">
      <text class="back-btn" @tap="goBack">‹</text>
      <text class="friend-title">{{ friendName }}</text>
      <view class="header-placeholder"></view>
    </view>

    <!-- 聊天内容区 -->
    <scroll-view class="chat-scroller" scroll-y :scroll-into-view="scrollIntoId">
      <view class="msg-list">
        <view 
          v-for="(msg, index) in messages" 
          :key="msg.id" 
          :id="'msg-' + msg.id"
          class="msg-row" 
          :class="{ 'row-me': msg.sender === 'me' }"
        >
          <!-- 头像 -->
          <view v-if="msg.sender !== 'me'" class="msg-avatar friend-avatar">
            {{ friendName.slice(0, 1) }}
          </view>
          <view v-else class="msg-avatar my-avatar">
            {{ userName.slice(0, 1) }}
          </view>

          <!-- 消息泡 -->
          <view class="msg-bubble-wrap">
            <view class="msg-time">{{ msg.time }}</view>
            <view class="msg-bubble" :class="{ 'bubble-me': msg.sender === 'me' }">
              <text class="msg-text">{{ msg.text }}</text>

              <!-- 分享的帖子卡片 -->
              <view v-if="msg.sharedPost" class="shared-card" @tap="goPostDetail(msg.sharedPost.id)">
                <view class="card-header">
                  <text class="card-tag"># 校园动态</text>
                  <text class="card-author">@{{ msg.sharedPost.userName }}</text>
                </view>
                <view class="card-title">{{ msg.sharedPost.title }}</view>
                <view class="card-content">{{ msg.sharedPost.content }}</view>
                <view class="card-footer">点击查看详情 ›</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view id="scroll-bottom" style="height: 20rpx;"></view>
    </scroll-view>

    <!-- 底部输入框栏 -->
    <view class="input-bar">
      <input 
        v-model="inputText" 
        class="chat-input" 
        placeholder="发送新消息..." 
        confirm-type="send" 
        @confirm="sendMessage" 
      />
      <view class="send-btn" @tap="sendMessage">发送</view>
    </view>
  </view>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getTheme, getUserInfo, getChatsForFriend, addChatMessage } from '../../utils/communityStore'

const isDark = ref(false)
const friendId = ref(1)
const friendName = ref('好友')
const userName = ref('林同学')
const inputText = ref('')
const messages = ref([])
const scrollIntoId = ref('')

onLoad((options) => {
  friendId.value = Number(options.id || 1)
  friendName.value = decodeURIComponent(options.name || '好友')
  userName.value = getUserInfo().name
  loadChats()
})

onShow(() => {
  isDark.value = getTheme() === 'dark'
})

const loadChats = () => {
  messages.value = getChatsForFriend(friendId.value)
  scrollToBottom()
}

const goBack = () => {
  uni.navigateBack({ fail: () => uni.redirectTo({ url: '/pages/message/message' }) })
}

const goPostDetail = (id) => {
  uni.navigateTo({
    url: `/pages/post-detail/post-detail?id=${id}`
  })
}

const scrollToBottom = () => {
  nextTick(() => {
    setTimeout(() => {
      scrollIntoId.value = 'scroll-bottom'
    }, 100)
  })
}

const sendMessage = () => {
  const value = inputText.value.trim()
  if (!value) return

  // 1. 添加并保存我的消息
  messages.value = addChatMessage(friendId.value, 'me', value)
  inputText.value = ''
  scrollToBottom()

  // 2. 模拟好友自动智慧秒回
  setTimeout(() => {
    const autoReplies = [
      '好的，收到！我等会儿看！',
      '哇塞，真的假的，听起来很有意思！',
      '太棒了！我们晚点图书馆见！',
      '收到收到 📅 下午下课一起讨论下哈。',
      '哈哈，好滴，谢谢推荐！'
    ]
    const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)]
    messages.value = addChatMessage(friendId.value, 'friend', randomReply)
    scrollToBottom()
  }, 1000)
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  background: #f5f7fb;
  position: relative;
}

.page::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background-image: url('../../static/校园背景.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(28rpx);
  opacity: 0.85;
}

.theme-dark.page {
  background: #121212 !important;
}

.theme-dark.page::before {
  display: none !important;
}

.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(var(--status-bar-height) + 18rpx) 28rpx 18rpx;
  background: transparent !important;
  border-bottom: none !important;
  backdrop-filter: none !important;
}

.back-btn {
  color: #172033;
  font-size: 58rpx;
  font-weight: 700;
  width: 60rpx;
  line-height: 1;
}

.friend-title {
  color: #172033;
  font-size: 32rpx;
  font-weight: 900;
}

.header-placeholder {
  width: 60rpx;
}

.chat-scroller {
  flex: 1;
  overflow: hidden;
}

.msg-list {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.msg-row {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
}

.row-me {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 76rpx;
  height: 76rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 800;
  font-size: 28rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.friend-avatar {
  background: linear-gradient(135deg, #2f6bff, #8b5cf6);
}

.my-avatar {
  background: linear-gradient(135deg, #ff7a59, #ff5252);
}

.msg-bubble-wrap {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.row-me .msg-bubble-wrap {
  align-items: flex-end;
}

.msg-time {
  font-size: 20rpx;
  color: #9aa4b2;
  margin-bottom: 6rpx;
}

.msg-bubble {
  padding: 20rpx 26rpx;
  border-radius: 4rpx 24rpx 24rpx 24rpx;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.bubble-me {
  border-radius: 24rpx 4rpx 24rpx 24rpx;
  background: linear-gradient(135deg, #2f6bff, #8b5cf6);
}

.msg-text {
  font-size: 26rpx;
  color: #172033;
  line-height: 1.5;
  word-break: break-all;
}

.bubble-me .msg-text {
  color: #ffffff;
}

/* 消息泡中的分享卡片 */
.shared-card {
  margin-top: 14rpx;
  padding: 16rpx;
  border-radius: 16rpx;
  background: rgba(0, 0, 0, 0.03);
  border: 1rpx solid rgba(0, 0, 0, 0.05);
}

.bubble-me .shared-card {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.card-tag {
  font-size: 18rpx;
  color: #2f6bff;
  font-weight: 700;
}

.bubble-me .card-tag {
  color: #feb692;
}

.card-author {
  font-size: 18rpx;
  color: #697386;
}

.bubble-me .card-author {
  color: rgba(255, 255, 255, 0.7);
}

.card-title {
  font-size: 24rpx;
  font-weight: 800;
  color: #172033;
  margin-bottom: 6rpx;
}

.bubble-me .card-title {
  color: #ffffff;
}

.card-content {
  font-size: 20rpx;
  color: #4b5565;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.bubble-me .card-content {
  color: rgba(255, 255, 255, 0.85);
}

.card-footer {
  margin-top: 12rpx;
  font-size: 18rpx;
  color: #2f6bff;
  font-weight: 700;
  text-align: right;
}

.bubble-me .card-footer {
  color: #ffffff;
}

/* 底部输入框 */
.input-bar {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin: 20rpx 28rpx calc(20rpx + env(safe-area-inset-bottom));
  padding: 12rpx 24rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: 1rpx solid rgba(255, 255, 255, 0.5);
}

.chat-input {
  flex: 1;
  height: 76rpx;
  padding: 0 30rpx;
  border-radius: 999rpx;
  background: #f5f7fb;
  font-size: 26rpx;
  color: #172033;
}

.send-btn {
  padding: 14rpx 32rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #2f6bff, #8b5cf6);
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 800;
  box-shadow: 0 6rpx 16rpx rgba(47, 107, 255, 0.25);
}

/* 暗色主题覆盖 */
.theme-dark .nav-header {
  background: rgba(30, 30, 30, 0.75) !important;
  border-bottom-color: rgba(255, 255, 255, 0.08) !important;
}

.theme-dark .friend-title,
.theme-dark .back-btn {
  color: #ffffff !important;
}

.theme-dark .msg-bubble {
  background: rgba(45, 45, 45, 0.95) !important;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2) !important;
}

.theme-dark .bubble-me {
  background: linear-gradient(135deg, #2f6bff, #8b5cf6) !important;
}

.theme-dark .msg-text {
  color: #ffffff !important;
}

.theme-dark .shared-card {
  background: rgba(255, 255, 255, 0.04) !important;
  border-color: rgba(255, 255, 255, 0.06) !important;
}

.theme-dark .card-title {
  color: #ffffff !important;
}

.theme-dark .card-content {
  color: #a1a1a6 !important;
}

.theme-dark .input-bar {
  background: rgba(45, 45, 45, 0.95) !important;
  border: 1rpx solid rgba(255, 255, 255, 0.08) !important;
}

.theme-dark .chat-input {
  background: rgba(45, 45, 45, 0.9) !important;
  color: #ffffff !important;
}
</style>
