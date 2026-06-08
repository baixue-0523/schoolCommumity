<template>
  <view class="home-page" :class="{ 'theme-dark': isDark }">
    <view class="fixed-header">
      <HomeHeader
        :campus-name="campusName"
        @change-campus="showTodo('校区切换')"
        @open-menu="showTodo('菜单')"
        @open-message="goMessage"
      />
      <SearchBar
        :weather="weatherInfo"
        @search="goSearch"
        @scan="showTodo('扫码')"
      />
    </view>
    <view class="header-spacer"></view>

    <BannerSwiper :list="bannerList" />
    <FunctionGrid :list="functionList" @select="handleFunctionSelect" />
    <HotEntryList :list="hotEntryList" @select="handleHotSelect" />
    
    <!-- 新增推荐圈子模块 -->
    <RecommendCircle :list="recommendCircles" />

    <NoticeBar :list="noticeList" @select="handleNoticeSelect" />

    <view class="feed-section">
      <view class="feed-title-wrap">
        <text class="feed-main-title">校园推荐</text>
        <text class="feed-sub-title">发现身边的新鲜事</text>
      </view>
      <FeedTabs :tabs="feedTabs" :active="activeFeedTab" @change="handleTabChange" />
      <view class="feed-list">
        <!-- 首次加载显示骨架屏 -->
        <LoadingSkeleton v-if="isFirstLoading" :count="3" />
        <!-- 数据加载完成后显示真实列表 -->
        <template v-else>
          <FeedCard v-for="item in feedList" :key="item.id" :item="item" @click="goPostDetail" @share="openSharePanel" />
          <EmptyState v-if="!loading && feedList.length === 0" text="暂无推荐内容" />
          <LoadingView :loading="loading" :finished="finished" />
        </template>
      </view>
    </view>

    <FloatingPublishButton @click="goPublish" />
    <BottomTabBar :tabs="bottomTabs" active="home" @change="handleBottomTabChange" />
    <SharePanel :visible="showSharePanel" @close="closeSharePanel" @select="shareTo" />
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { onPullDownRefresh, onReachBottom, onShow } from '@dcloudio/uni-app'
import HomeHeader from '../../components/home/HomeHeader.vue'
import SearchBar from '../../components/home/SearchBar.vue'
import BannerSwiper from '../../components/home/BannerSwiper.vue'
import FunctionGrid from '../../components/home/FunctionGrid.vue'
import HotEntryList from '../../components/home/HotEntryList.vue'
import NoticeBar from '../../components/home/NoticeBar.vue'
import FeedTabs from '../../components/home/FeedTabs.vue'
import FeedCard from '../../components/home/FeedCard.vue'
import FloatingPublishButton from '../../components/home/FloatingPublishButton.vue'
import BottomTabBar from '../../components/home/BottomTabBar.vue'
import EmptyState from '../../components/home/EmptyState.vue'
import LoadingView from '../../components/home/LoadingView.vue'
import SharePanel from '../../components/common/SharePanel.vue'
import RecommendCircle from '../../components/home/RecommendCircle.vue'
import LoadingSkeleton from '../../components/home/LoadingSkeleton.vue'
import {
  bannerList,
  bottomTabs,
  campusInfo,
  feedTabs,
  functionList,
  hotEntryList,
  noticeList,
  weatherInfo,
} from '../../mock/home'
import { getPostsByTab, getTheme, addChatMessage } from '../../utils/communityStore'
import { friendIdMap } from '../../mock/share'
import { recommendCircleList } from '@/mock/home'

const isDark = ref(false)
const campusName = ref(campusInfo.name)
const recommendCircles = ref(recommendCircleList)

onShow(() => {
  isDark.value = getTheme() === 'dark'
})

const activeFeedTab = ref('recommend')
const feedList = ref([])
const showSharePanel = ref(false)
const activeSharePost = ref(null)
const page = ref(1)
const pageSize = 3
const loading = ref(false)
const finished = ref(false)
const isFirstLoading = ref(true)  // 首次加载标记

const showTodo = (name) => {
  if (name === '校区切换') {
    uni.showActionSheet({
      itemList: ['南湖校区', '东湖校区', '首义校区'],
      success: ({ tapIndex }) => {
        campusName.value = ['南湖校区', '东湖校区', '首义校区'][tapIndex]
        campusInfo.name = campusName.value
        uni.showToast({ title: '切换成功', icon: 'none' })
      },
    })
    return
  }

  if (name === '扫码') {
    uni.showToast({ title: '扫码成功（模拟）', icon: 'none' })
    return
  }

  uni.showActionSheet({
    itemList: ['我的发布', '我的收藏', '校园客服'],
    success: ({ tapIndex }) => {
      const target = ['我的发布', '我的收藏', '校园客服'][tapIndex]
      uni.showToast({ title: `${target}已打开（模拟）`, icon: 'none' })
    },
  })
}

const loadFeedList = (reset = false) => {
  if (loading.value || (finished.value && !reset)) {
    return
  }

  if (reset) {
    page.value = 1
    feedList.value = []
    finished.value = false
    isFirstLoading.value = true  // 重置时显示骨架屏
  }

  loading.value = true

  setTimeout(() => {
    const source = getPostsByTab(activeFeedTab.value)
    const start = (page.value - 1) * pageSize
    const nextList = source.slice(start, start + pageSize)

    feedList.value = reset ? nextList : feedList.value.concat(nextList)
    page.value += 1
    finished.value = feedList.value.length >= source.length
    loading.value = false
    isFirstLoading.value = false  // 加载完成隐藏骨架屏
  }, 350)
}

const handleTabChange = (tabKey) => {
  if (activeFeedTab.value === tabKey) {
    return
  }

  activeFeedTab.value = tabKey
  loadFeedList(true)
}

const handleFunctionSelect = (item) => {
  uni.showToast({
    title: `${item.name}已开启（模拟）`,
    icon: 'none',
  })
}

const handleHotSelect = (item) => {
  uni.navigateTo({
    url: `/pages/search/search?keyword=${encodeURIComponent(item.title)}`,
  })
}

const handleNoticeSelect = (item) => {
  uni.navigateTo({
    url: `/pages/notice-detail/notice-detail?id=${item.id}`,
  })
}

const goSearch = () => {
  uni.navigateTo({
    url: '/pages/search/search',
  })
}

const goMessage = () => {
  uni.redirectTo({
    url: '/pages/message/message',
  })
}

const goPublish = () => {
  uni.navigateTo({
    url: '/pages/publish/publish',
  })
}

const goPostDetail = (item) => {
  uni.navigateTo({
    url: `/pages/post-detail/post-detail?id=${item.id}`,
  })
}

const openSharePanel = (item) => {
  activeSharePost.value = item
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
    addChatMessage(friendId, 'me', `給你推荐一个有趣的帖子卡片`, {
      id: activeSharePost.value.id,
      title: activeSharePost.value.title,
      content: activeSharePost.value.content,
      userName: activeSharePost.value.user?.name || '匿名同学'
    })
  }
  uni.showToast({ title: `已成功分享给 ${name}`, icon: 'success' })
  activeSharePost.value = null
}

const goFeature = (title, icon) => {
  uni.navigateTo({
    url: `/pages/feature/feature?title=${encodeURIComponent(title)}&icon=${encodeURIComponent(icon)}`,
  })
}

const handleBottomTabChange = (item) => {
  if (item.key !== 'home' && item.path) {
    uni.redirectTo({
      url: item.path,
    })
  }
}

onMounted(() => {
  loadFeedList(true)
})

onPullDownRefresh(() => {
  loadFeedList(true)
  setTimeout(() => {
    uni.stopPullDownRefresh()
    uni.showToast({
      title: '刷新成功',
      icon: 'none',
    })
  }, 500)
})

onReachBottom(() => {
  loadFeedList()
})
</script>

<style scoped src="@/static/css/index.css"></style>