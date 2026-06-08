<template>
  <view class="page" :class="{ 'theme-dark': isDark }">
    <view class="nav-header">
      <text class="circle-title">{{ circleName }}</text>
      <view class="join-btn" :class="{ joined }" @tap="toggleJoin">
        {{ joined ? '已加入' : '＋加入' }}
      </view>
    </view>

    <view class="post-list">
      <view v-for="post in posts" :key="post.id" class="post-card" @tap="goPostDetail(post.id)">
        <view class="post-header">
          <view class="user-info">
            <view class="avatar">{{ post.user.name.slice(0, 1) }}</view>
            <view>
              <view class="username">{{ post.user.name }}</view>
              <view class="college">{{ post.user.college }}</view>
            </view>
          </view>
          <text class="time">{{ post.publishTime }}</text>
        </view>

        <view class="post-title">{{ post.title }}</view>
        <view class="post-content">{{ post.content }}</view>

        <view class="post-footer">
          <view class="action-item" :class="{ liked: post.isLiked }" @tap.stop="toggleLike(post)">
            <text class="action-icon">{{ post.isLiked ? '♥' : '♡' }}</text>
            <text>{{ post.likeCount }}</text>
          </view>
          <view class="action-item">
            <text class="action-icon">💬</text>
            <text>{{ post.commentCount }}</text>
          </view>
          <view class="action-item" @tap.stop="openSharePanel(post)">
            <text class="action-icon">↗</text>
            <text>分享</text>
          </view>
        </view>
      </view>
    </view>

    <view class="floating-group">
      <view class="float-btn back" @tap="goBack">
        <text class="btn-icon">⬅</text>
        <text class="btn-text">返回</text>
      </view>
      <view class="float-btn publish" @tap="goPublish">
        <image class="btn-icon-img" src="/static/image/jia.png" mode="aspectFit" lazy-load fade-show />
        <text class="btn-text">发布</text>
      </view>
    </view>
    <SharePanel :visible="showSharePanel" @close="closeSharePanel" @select="shareTo" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onReachBottom, onShow } from '@dcloudio/uni-app'
import SharePanel from '../../components/common/SharePanel.vue'
import { friendIdMap } from '../../mock/share'
import { mockPosts } from '../../mock/circlePosts'
import { addChatMessage, getTheme, getJoinedCircles, toggleCircleJoin } from '../../utils/communityStore'

const isDark = ref(false)
const circleId = ref(1)
const circleName = ref('圈子')
const joined = ref(false)
const posts = ref([])
const allPosts = ref([])
const showSharePanel = ref(false)
const activeSharePost = ref(null)
const page = ref(1)
const pageSize = 4

onShow(() => {
  isDark.value = getTheme() === 'dark'
})

const loadPosts = (reset = false) => {
  if (reset) {
    page.value = 1
    posts.value = []
  }
  const start = (page.value - 1) * pageSize
  const nextPosts = allPosts.value.slice(start, start + pageSize)
  if (nextPosts.length) {
    posts.value = posts.value.concat(nextPosts)
    page.value += 1
  }
}

const goBack = () => {
  uni.navigateBack({ fail: () => uni.redirectTo({ url: '/pages/index/index' }) })
}

const toggleJoin = () => {
  joined.value = toggleCircleJoin(circleId.value, circleName.value)
  uni.showToast({
    title: joined.value ? '加入成功，已收到欢迎通知' : '已退出该圈子',
    icon: 'none',
  })
}

const toggleLike = (post) => {
  post.isLiked = !post.isLiked
  post.likeCount += post.isLiked ? 1 : -1
}

const goPostDetail = (id) => {
  uni.navigateTo({
    url: `/pages/post-detail/post-detail?id=${id}`,
  })
}

const goPublish = () => {
  uni.navigateTo({
    url: '/pages/publish/publish',
  })
}

const openSharePanel = (post) => {
  activeSharePost.value = post
  showSharePanel.value = true
}

const closeSharePanel = () => {
  showSharePanel.value = false
  activeSharePost.value = null
}

const shareTo = (name) => {
  showSharePanel.value = false
  if (activeSharePost.value) {
    const friendId = friendIdMap[name] || 1
    addChatMessage(friendId, 'me', '给你推荐一个圈子里的帖子卡片', {
      id: activeSharePost.value.id,
      title: activeSharePost.value.title,
      content: activeSharePost.value.content,
      userName: activeSharePost.value.user?.name || '匿名同学',
    })
  }
  uni.showToast({ title: `已成功分享给 ${name}`, icon: 'success' })
  activeSharePost.value = null
}

onLoad((options) => {
  circleId.value = Number(options.id || 1)
  circleName.value = decodeURIComponent(options.name || '学习互助圈')
  joined.value = getJoinedCircles().includes(circleId.value)
  allPosts.value = mockPosts[circleId.value] || mockPosts[1]
  loadPosts(true)
})

onReachBottom(() => {
  loadPosts()
})
</script>

<style scoped src="@/static/css/circle-detail.css"></style>
