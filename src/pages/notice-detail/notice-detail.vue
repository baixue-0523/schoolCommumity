<template>
  <view class="page">
    <view class="nav">
      <text class="back" @tap="goBack">‹</text>
      <text class="nav-title">公告详情</text>
      <text class="placeholder"></text>
    </view>

    <view v-if="notice" class="card">
      <text class="title">{{ notice.title }}</text>
      <text class="time">校园公告 · {{ notice.time }}</text>
      <text class="content">{{ content }}</text>
      <view class="footer">
        <text class="footer-text">如有疑问，请联系校园服务中心。</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { noticeList } from '../../mock/home'

const notice = ref(null)

const content = computed(() => {
  if (!notice.value) {
    return ''
  }

  return `关于“${notice.value.title}”的详细说明如下：请同学们及时关注校园相关安排，合理规划学习与生活。如涉及场地、时间、网络或活动调整，请以学院和学校后续通知为准。`
})

const goBack = () => {
  uni.navigateBack({ fail: () => uni.redirectTo({ url: '/pages/index/index' }) })
}

onLoad((query) => {
  const id = Number(query.id)
  notice.value = noticeList.find((item) => item.id === id) || noticeList[0]
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: calc(var(--status-bar-height) + 18rpx) 28rpx 40rpx;
  background: #f5f7fb;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22rpx;
}

.back,
.placeholder {
  width: 70rpx;
}

.back {
  color: #172033;
  font-size: 58rpx;
  line-height: 1;
}

.nav-title {
  color: #172033;
  font-size: 32rpx;
  font-weight: 800;
}

.card {
  padding: 32rpx;
  border-radius: 24rpx;
  background: #ffffff;
}

.title {
  display: block;
  color: #172033;
  font-size: 38rpx;
  font-weight: 900;
  line-height: 1.35;
}

.time {
  display: block;
  margin-top: 18rpx;
  color: #9aa4b2;
  font-size: 24rpx;
}

.content {
  display: block;
  margin-top: 30rpx;
  color: #303847;
  font-size: 29rpx;
  line-height: 1.8;
}

.footer {
  margin-top: 40rpx;
  padding: 20rpx;
  border-radius: 18rpx;
  background: #f5f7fb;
}

.footer-text {
  color: #697386;
  font-size: 24rpx;
}
</style>
