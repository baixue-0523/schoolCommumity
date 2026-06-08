<template>
  <view class="feed-card" @tap="emit('click', item)">
    <view class="feed-user">
      <view class="avatar" @tap.stop="goProfile">{{ avatarText }}</view>
      <view class="user-main">
        <view class="user-line">
          <text class="user-name">{{ item.user.name }}</text>
          <text v-if="item.user.verified" class="verified">学生认证</text>
        </view>
        <text class="user-sub">{{ item.user.college }} · {{ item.publishTime }}</text>
      </view>
    </view>

    <view class="feed-title-row">
      <text v-if="item.isTop" class="top-tag">置顶</text>
      <text class="feed-title">{{ item.title }}</text>
    </view>

    <text class="feed-content">{{ item.content }}</text>

    <!-- 真实图片区域 -->
    <view v-if="item.images && item.images.length" class="image-grid" :class="'count-' + item.images.length">
      <image 
        v-for="(img, idx) in item.images.slice(0, 3)" 
        :key="idx" 
        :src="img" 
        class="post-image" 
        mode="aspectFill"
        @tap.stop="previewImage(idx)"
      />
    </view>
    <!-- 兼容旧数据 -->
    <view v-else-if="item.imageCount" class="image-grid" :class="'count-' + item.imageCount">
      <view v-for="index in item.imageCount" :key="index" class="mock-image">
        <text>校园图 {{ index }}</text>
      </view>
    </view>

    <view class="tag-list">
      <text v-for="tag in item.tags" :key="tag" class="tag"># {{ tag }}</text>
    </view>

    <view class="feed-actions">
      <view class="action" @tap.stop="toggleLike">
        {{ isLiked ? '♥' : '♡' }} {{ likeCount }}
      </view>
      <view class="action" @tap.stop="goComment">
        💬 {{ props.item.commentCount }}
      </view>
      <view class="action" @tap.stop="toggleCollect">
        {{ isCollected ? '★' : '☆' }} 收藏
      </view>
      <view class="action" @tap.stop="emit('share', item)">
        ↗ 分享
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { isPostLiked, togglePostLike, isPostCollected, togglePostCollect } from '../../utils/communityStore'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['click', 'share'])

const avatarText = computed(() => props.item.user.name.slice(0, 1))

// 点赞状态
const likeCount = ref(props.item.likeCount)
const isLiked = ref(false)

// 收藏状态
const isCollected = ref(false)

// 初始化状态
onMounted(() => {
  isLiked.value = isPostLiked(props.item.id)
  if (isLiked.value) {
    likeCount.value += 1
  }
  isCollected.value = isPostCollected(props.item.id)
})

// 点赞
const toggleLike = () => {
  const newState = togglePostLike(props.item.id)
  isLiked.value = newState
  likeCount.value += newState ? 1 : -1
}

// 收藏
const toggleCollect = () => {
  const newState = togglePostCollect(props.item.id)
  isCollected.value = newState
  uni.showToast({
    title: newState ? '已收藏' : '已取消收藏',
    icon: 'success'
  })
}

// 图片预览
const previewImage = (index) => {
  if (props.item.images && props.item.images.length) {
    uni.previewImage({
      current: index,
      urls: props.item.images
    })
  }
}

// 跳转评论
const goComment = () => {
  uni.navigateTo({
    url: `/pages/post-detail/post-detail?id=${props.item.id}`
  })
}

const goProfile = () => {
  uni.navigateTo({
    url: `/pages/profile/profile?name=${encodeURIComponent(props.item.user.name)}&college=${encodeURIComponent(props.item.user.college || '校园用户')}&verified=${props.item.user.verified ? 1 : 0}`
  })
}
</script>

<style scoped>
.feed-card {
  margin-bottom: 20rpx;
  padding: 26rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 12rpx 32rpx rgba(31, 45, 61, 0.04);
}

.feed-user {
  display: flex;
  align-items: center;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 78rpx;
  height: 78rpx;
  margin-right: 18rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #2f6bff, #8b5cf6);
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 700;
}

.user-main {
  flex: 1;
  min-width: 0;
}

.user-line {
  display: flex;
  align-items: center;
}

.user-name {
  color: #172033;
  font-size: 28rpx;
  font-weight: 700;
}

.verified {
  margin-left: 12rpx;
  padding: 4rpx 10rpx;
  border-radius: 999rpx;
  background: #eef4ff;
  color: #2f6bff;
  font-size: 20rpx;
}

.user-sub {
  display: block;
  margin-top: 6rpx;
  color: #9aa4b2;
  font-size: 22rpx;
}

.feed-title-row {
  display: flex;
  align-items: center;
  margin-top: 22rpx;
}

.top-tag {
  flex: 0 0 auto;
  margin-right: 10rpx;
  padding: 4rpx 10rpx;
  border-radius: 8rpx;
  background: #fff3ed;
  color: #ff7a59;
  font-size: 22rpx;
  font-weight: 700;
}

.feed-title {
  color: #172033;
  font-size: 31rpx;
  font-weight: 800;
}

.feed-content {
  display: block;
  margin-top: 12rpx;
  color: #4b5565;
  font-size: 27rpx;
  line-height: 1.65;
}

/* 图片网格样式 */
.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 18rpx;
}

.post-image {
  width: 100%;
  height: 100%;
  border-radius: 16rpx;
  background-color: #f5f7fb;
}

/* 1张图片 */
.image-grid.count-1 .post-image {
  width: 100%;
  height: 400rpx;
}

/* 2张图片 */
.image-grid.count-2 {
  display: flex;
  gap: 12rpx;
}
.image-grid.count-2 .post-image {
  width: calc(50% - 6rpx);
  height: 200rpx;
}

/* 3张图片 */
.image-grid.count-3 {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.image-grid.count-3 .post-image {
  width: calc(33.33% - 8rpx);
  height: 200rpx;
}

/* 兼容旧数据 */
.mock-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 31%;
  height: 154rpx;
  border-radius: 18rpx;
  background: linear-gradient(135deg, #eaf1ff, #f1eaff);
  color: #7c89a2;
  font-size: 22rpx;
}

.count-1 .mock-image {
  width: 420rpx;
  height: 236rpx;
}

.count-2 .mock-image {
  width: 48%;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 18rpx;
}

.tag {
  padding: 6rpx 12rpx;
  border-radius: 999rpx;
  background: #f5f7fb;
  color: #2f6bff;
  font-size: 22rpx;
}

.feed-actions {
  display: flex;
  align-items: center;
  gap: 34rpx;
  margin-top: 22rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #eef1f6;
}

.action {
  color: #697386;
  font-size: 24rpx;
}
</style>