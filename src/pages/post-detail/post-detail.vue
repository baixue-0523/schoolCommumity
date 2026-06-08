<template>
  <view class="page" :class="{ 'theme-dark': isDark }">
    <view class="nav">
      <text class="back" @tap="goBack">‹</text>
      <text class="nav-title">帖子详情</text>
      <text class="share" @tap="openSharePanel">分享</text>
    </view>

    <view v-if="post" class="detail-card">
      <view class="user-row">
        <view class="avatar" @tap="goProfile(post.user)">{{ post.user.name.slice(0, 1) }}</view>
        <view class="user-info">
          <view class="name-row">
            <text class="name">{{ post.user.name }}</text>
            <text v-if="post.user.verified" class="verified">学生认证</text>
          </view>
          <text class="sub">{{ post.user.college }} · {{ post.publishTime }}</text>
        </view>
      </view>

      <view class="title-row">
        <text v-if="post.isTop" class="top-tag">置顶</text>
        <text class="title">{{ post.title }}</text>
      </view>
      <text class="content">{{ post.content }}</text>

      <!-- 图片预览 -->
      <view v-if="post.images && post.images.length" class="image-grid">
        <image 
          v-for="(img, idx) in post.images" 
          :key="idx" 
          :src="img" 
          class="post-image" 
          mode="aspectFill"
          @tap="previewImage(idx)"
        />
      </view>
      <view v-else-if="post.imageCount" class="image-grid">
        <view v-for="index in post.imageCount" :key="index" class="mock-image">校园图 {{ index }}</view>
      </view>

      <view class="tag-list">
        <text v-for="tag in post.tags" :key="tag" class="tag" @tap="goSearch(tag)"># {{ tag }}</text>
      </view>
    </view>

    <!-- 评论区域 -->
    <view v-if="post" class="comment-card">
      <text class="section-title">评论 {{ comments.length }}</text>
      <view v-for="(item, index) in comments" :key="item.id" class="comment-item" :class="{ stagger: index % 2 === 1 }">
        <view class="comment-avatar" @tap="replyComment(item)">{{ item.name.slice(0, 1) }}</view>
        <view class="comment-main" @tap="replyComment(item)">
          <text class="comment-name">{{ item.name }}</text>
          <text class="comment-content">{{ item.content }}</text>
          <!-- 嵌套回复列表 -->
          <view v-if="item.replies && item.replies.length" class="reply-list">
            <view v-for="reply in item.replies" :key="reply.id" class="reply-item" @tap.stop="replyReply(reply, item)">
              <text class="reply-name">{{ reply.name }} 回复 {{ reply.replyTo || item.name }}：</text>
              <text class="reply-content">{{ reply.content }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部固定输入框 -->
    <view v-if="post" class="action-bar">
      <input 
        v-model="commentText" 
        class="comment-input" 
        :placeholder="replyTarget ? `回复 ${replyTarget.name}` : '说点什么...'" 
        confirm-type="send" 
        @confirm="submitComment" 
      />
      <!-- 点赞按钮（带动画） -->
      <view 
        class="action like-action" 
        :class="{ liked }" 
        :style="{ transform: likeAnimating ? 'scale(1.2)' : 'scale(1)' }"
        @tap="toggleLike"
      >
        {{ liked ? '♥' : '♡' }} {{ likeCount }}
      </view>
      <!-- 收藏按钮 -->
      <view class="action collect-action" :class="{ collected }" @tap="toggleCollect">
        {{ collected ? '★' : '☆' }}
      </view>
      <view class="action send-action" @tap="submitComment">发送</view>
    </view>
    <SharePanel :visible="showSharePanel" @close="closeSharePanel" @select="shareTo" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import SharePanel from '../../components/common/SharePanel.vue'
import { 
  addChatMessage, 
  addPostComment, 
  getPostById, 
  getPostComments, 
  getTheme, 
  isPostLiked, 
  togglePostLike,
  isPostCollected,
  togglePostCollect
} from '../../utils/communityStore'
import { friendIdMap } from '../../mock/share'

const post = ref(null)
const liked = ref(false)
const likeCount = ref(0)
const commentText = ref('')
const comments = ref([])
const replyTarget = ref(null)
const isDark = ref(false)
const showSharePanel = ref(false)

// 点赞动画
const likeAnimating = ref(false)
// 收藏状态
const collected = ref(false)

const goBack = () => {
  uni.navigateBack({ fail: () => uni.redirectTo({ url: '/pages/index/index' }) })
}

// 点赞 + 动画
const toggleLike = () => {
  likeAnimating.value = true
  setTimeout(() => {
    likeAnimating.value = false
  }, 200)
  
  liked.value = togglePostLike(post.value.id)
  likeCount.value += liked.value ? 1 : -1
}

// 收藏功能
const toggleCollect = () => {
  const newState = togglePostCollect(post.value.id)
  collected.value = newState
  uni.showToast({
    title: newState ? '已收藏' : '已取消收藏',
    icon: 'success'
  })
}

// 图片预览
const previewImage = (index) => {
  if (post.value.images && post.value.images.length) {
    uni.previewImage({
      current: index,
      urls: post.value.images
    })
  }
}

// 回复评论（点击评论）
const replyComment = (item) => {
  replyTarget.value = {
    id: item.id,
    name: item.name,
    type: 'comment'
  }
  uni.showToast({ title: `正在回复 ${item.name}`, icon: 'none' })
}

// 回复某条回复（点击回复）
const replyReply = (reply, parentComment) => {
  replyTarget.value = {
    id: reply.id,
    name: reply.name,
    parentId: parentComment.id,
    type: 'reply'
  }
  uni.showToast({ title: `正在回复 ${reply.name}`, icon: 'none' })
}

// 提交评论/回复
const submitComment = () => {
  const value = commentText.value.trim()
  if (!value) {
    uni.showToast({ title: '请输入评论内容', icon: 'none' })
    return
  }
  
  const isReply = replyTarget.value !== null
  
  if (isReply) {
    // 回复（包括回复评论和回复回复）
    const parentId = replyTarget.value.parentId || replyTarget.value.id
    const replyToName = replyTarget.value.name
    comments.value = addPostComment(post.value.id, value, parentId, replyToName)
  } else {
    // 顶层评论
    comments.value = addPostComment(post.value.id, value)
  }
  
  commentText.value = ''
  replyTarget.value = null
  uni.showToast({ title: isReply ? '回复成功' : '评论成功', icon: 'success' })
}

const openSharePanel = () => {
  showSharePanel.value = true
}

const closeSharePanel = () => {
  showSharePanel.value = false
}

const shareTo = (name) => {
  showSharePanel.value = false
  if (post.value) {
    const friendId = friendIdMap[name] || 1
    addChatMessage(friendId, 'me', '给你推荐一个帖子卡片', {
      id: post.value.id,
      title: post.value.title,
      content: post.value.content,
      userName: post.value.user?.name || '匿名同学'
    })
  }
  uni.showToast({ title: `已成功分享给 ${name}`, icon: 'success' })
}

const goProfile = (user) => {
  uni.navigateTo({
    url: `/pages/profile/profile?name=${encodeURIComponent(user.name)}&college=${encodeURIComponent(user.college || '校园用户')}&verified=${user.verified ? 1 : 0}`
  })
}

const goSearch = (tag) => {
  uni.navigateTo({ url: `/pages/search/search?keyword=${encodeURIComponent(tag)}` })
}
import { addBrowseHistory } from '../../utils/communityStore'

onLoad((query) => {
  const id = Number(query.id)
  post.value = getPostById(id) || getPostById(1)
  likeCount.value = post.value.likeCount
  liked.value = isPostLiked(post.value.id)
  likeCount.value += liked.value ? 1 : 0
  comments.value = getPostComments(post.value.id)
  // 收藏状态初始化
  collected.value = isPostCollected(post.value.id)
  addBrowseHistory(post.value)
})

onShow(() => {
  isDark.value = getTheme() === 'dark'
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: calc(var(--status-bar-height) + 18rpx) 28rpx 140rpx;
  background: #f5f7fb;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22rpx;
}

.back {
  width: 70rpx;
  color: #172033;
  font-size: 58rpx;
  line-height: 1;
}

.nav-title {
  color: #172033;
  font-size: 32rpx;
  font-weight: 800;
}

.share {
  min-width: 96rpx;
  padding: 12rpx 20rpx;
  border-radius: 999rpx;
  background: rgba(47, 107, 255, 0.12);
  color: #2f6bff;
  font-size: 28rpx;
  font-weight: 800;
  text-align: center;
}

.detail-card,
.comment-card {
  margin-bottom: 22rpx;
  padding: 28rpx;
  border-radius: 24rpx;
  background: #ffffff;
}

.user-row,
.name-row,
.title-row,
.comment-item,
.action-bar {
  display: flex;
  align-items: center;
}

.avatar,
.comment-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #2f6bff, #8b5cf6);
  color: #ffffff;
  font-weight: 800;
}

.avatar {
  width: 82rpx;
  height: 82rpx;
  margin-right: 18rpx;
  font-size: 32rpx;
}

.user-info,
.comment-main {
  flex: 1;
}

.name {
  color: #172033;
  font-size: 30rpx;
  font-weight: 800;
}

.verified,
.top-tag {
  margin-left: 12rpx;
  padding: 4rpx 10rpx;
  border-radius: 999rpx;
  background: #eef4ff;
  color: #2f6bff;
  font-size: 20rpx;
}

.sub {
  display: block;
  margin-top: 8rpx;
  color: #9aa4b2;
  font-size: 23rpx;
}

.title-row {
  margin-top: 26rpx;
}

.top-tag {
  flex: 0 0 auto;
  margin-left: 0;
  margin-right: 10rpx;
  background: #fff3ed;
  color: #ff7a59;
}

.title {
  color: #172033;
  font-size: 36rpx;
  font-weight: 900;
}

.content {
  display: block;
  margin-top: 18rpx;
  color: #303847;
  font-size: 29rpx;
  line-height: 1.75;
}

.image-grid,
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 20rpx;
}

.post-image {
  width: calc(33.33% - 8rpx);
  height: 200rpx;
  border-radius: 16rpx;
  background-color: #f5f7fb;
}

.mock-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 31%;
  height: 160rpx;
  border-radius: 18rpx;
  background: linear-gradient(135deg, #eaf1ff, #f1eaff);
  color: #7c89a2;
  font-size: 23rpx;
}

.tag {
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: #f5f7fb;
  color: #2f6bff;
  font-size: 23rpx;
}

.section-title {
  display: block;
  margin-bottom: 20rpx;
  color: #172033;
  font-size: 30rpx;
  font-weight: 800;
}

.comment-item {
  align-items: flex-start;
  margin-bottom: 22rpx;
}

.comment-item.stagger {
  margin-left: 54rpx;
}

.comment-avatar {
  width: 58rpx;
  height: 58rpx;
  margin-right: 16rpx;
  font-size: 24rpx;
}

.comment-name {
  display: block;
  color: #172033;
  font-size: 26rpx;
  font-weight: 700;
}

.comment-content {
  display: block;
  margin-top: 10rpx;
  color: #4b5565;
  font-size: 26rpx;
  line-height: 1.5;
}

.reply-list {
  margin-top: 14rpx;
  padding: 16rpx 18rpx;
  border-radius: 18rpx;
  background: rgba(245, 247, 251, 0.9);
}

.reply-item {
  margin-bottom: 10rpx;
  line-height: 1.55;
}

.reply-item:last-child {
  margin-bottom: 0;
}

.reply-name {
  color: #2f6bff;
  font-size: 24rpx;
  font-weight: 700;
}

.reply-content {
  color: #4b5565;
  font-size: 24rpx;
}

/* 底部固定输入框 */
.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  gap: 18rpx;
  padding: 18rpx 28rpx calc(18rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid #edf0f5;
  background: #ffffff;
  display: flex;
  align-items: center;
}

.comment-input {
  flex: 1;
  height: 68rpx;
  padding-left: 24rpx;
  border-radius: 999rpx;
  background: #f5f7fb;
  color: #9aa4b2;
  font-size: 25rpx;
  line-height: 68rpx;
}

.action {
  padding: 12rpx 16rpx;
  color: #697386;
  font-size: 28rpx;
  border-radius: 40rpx;
  transition: all 0.2s ease;
}

.like-action {
  transition: transform 0.2s ease, color 0.2s ease;
}

.like-action.liked {
  color: #ff7a59;
}

.collect-action.collected {
  color: #ffb800;
}

.send-action {
  background-color: #2f6bff;
  color: #ffffff;
  padding: 12rpx 24rpx;
}
</style>