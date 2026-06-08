<template>
  <view class="page" :class="{ 'theme-dark': isDark }">
    <view class="profile-card">
      <view class="avatar-wrap" @tap="changeAvatar">
        <image v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar-img" mode="aspectFill" lazy-load fade-show />
        <view v-else class="avatar">{{ userInfo.name.slice(0, 1) }}</view>
        <text class="camera-icon">📷</text>
      </view>
      <view class="profile-main">
        <view class="name-row">
          <text class="name">{{ userInfo.name }}</text>
          <text class="verified">学生认证</text>
        </view>
        <text class="desc">{{ userInfo.college }} · {{ userInfo.grade }}</text>
      </view>
      <view class="edit-profile-btn" @tap="openEditPanel">
        <text class="edit-profile-icon">✎</text>
        <text class="edit-profile-text">修改信息</text>
      </view>
    </view>

    <!-- 编辑资料弹窗 -->
    <view v-if="showEditPanel" class="edit-mask" @tap="closeEditPanel">
      <view class="edit-panel" @tap.stop>
        <text class="edit-title">修改个人信息</text>
        <view class="edit-field">
          <text class="edit-label">昵称</text>
          <input v-model="editForm.name" class="edit-input" placeholder="请输入昵称" />
        </view>
        <view class="edit-field">
          <text class="edit-label">学院</text>
          <input v-model="editForm.college" class="edit-input" placeholder="请输入学院" />
        </view>
        <view class="edit-field">
          <text class="edit-label">年级</text>
          <input v-model="editForm.grade" class="edit-input" placeholder="例如：2023级" />
        </view>
        <view class="edit-actions">
          <view class="edit-cancel" @tap="closeEditPanel">取消</view>
          <view class="edit-save" @tap="saveProfile">保存</view>
        </view>
      </view>
    </view>

    <view class="stats-card">
      <view v-for="item in stats" :key="item.label" class="stat-item">
        <text class="stat-value">{{ item.value }}</text>
        <text class="stat-label">{{ item.label }}</text>
      </view>
    </view>

    <view class="menu-card">
      <view v-for="item in menus" :key="item.id" class="menu-item" @tap="openMenu(item)">
        <text class="menu-icon">{{ item.icon }}</text>
        <text class="menu-title">{{ item.title }}</text>
        <text v-if="item.title === '黑夜模式'" class="arrow">{{ isDark ? '已开启' : '已关闭' }}</text>
        <text v-else class="arrow">›</text>
      </view>
    </view>

    <BottomTabBar :tabs="bottomTabs" active="mine" @change="handleBottomTabChange" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import BottomTabBar from '../../components/home/BottomTabBar.vue'
import { bottomTabs } from '../../mock/home'
import { getTheme, toggleTheme, getUserInfo, saveUserInfo } from '../../utils/communityStore'

const isDark = ref(false)
const userInfo = ref({ name: '', college: '', grade: '', avatar: '' })
const showEditPanel = ref(false)
const editForm = ref({ name: '', college: '', grade: '' })

// 统计数据（动态数量、收藏数量、浏览历史数量）
const stats = ref([
  { label: '动态', value: 0 },
  { label: '收藏', value: 0 },
  { label: '浏览', value: 0 },
])

// 菜单列表
const menus = [
  { id: 1, title: '我的帖子', icon: '📝', type: 'page', url: '/pages/mine/my-posts' },
  { id: 2, title: '我的收藏', icon: '⭐', type: 'page', url: '/pages/mine/my-collections' },
  { id: 3, title: '浏览历史', icon: '👀', type: 'page', url: '/pages/mine/browse-history' },
  { id: 4, title: '草稿箱', icon: '📄', type: 'page', url: '/pages/publish/publish?draft=1' },
  { id: 5, title: '编辑资料', icon: '✎', type: 'edit' },
  { id: 6, title: '黑夜模式', icon: '🌙', type: 'theme' },
  { id: 7, title: '设置', icon: '⚙️', type: 'setting' },
]

// 加载统计数据
const loadStats = () => {
  // 动态数量：从本地存储获取用户发布的帖子数量
  try {
    const localPosts = uni.getStorageSync('campus_local_posts') || []
    stats.value[0].value = localPosts.length
  } catch (error) {
    stats.value[0].value = 0
  }
  
  // 收藏数量
  try {
    const collectedMap = uni.getStorageSync('campus_collected_posts') || {}
    const count = Object.values(collectedMap).filter(v => v === true).length
    stats.value[1].value = count
  } catch (error) {
    stats.value[1].value = 0
  }
  
  // 浏览历史数量
  try {
    const history = uni.getStorageSync('browse_history') || []
    stats.value[2].value = history.length
  } catch (error) {
    stats.value[2].value = 0
  }
}

onShow(() => {
  isDark.value = getTheme() === 'dark'
  userInfo.value = getUserInfo()
  loadStats()
})

const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      userInfo.value.avatar = res.tempFilePaths[0]
      saveUserInfo(userInfo.value)
      uni.showToast({ title: '头像更新成功', icon: 'none' })
    }
  })
}

const openEditPanel = () => {
  editForm.value = {
    name: userInfo.value.name,
    college: userInfo.value.college,
    grade: userInfo.value.grade,
  }
  showEditPanel.value = true
}

const closeEditPanel = () => {
  showEditPanel.value = false
}

const saveProfile = () => {
  userInfo.value = {
    ...userInfo.value,
    name: editForm.value.name.trim() || '校园同学',
    college: editForm.value.college.trim() || '未填写学院',
    grade: editForm.value.grade.trim() || '未填写年级',
  }
  saveUserInfo(userInfo.value)
  showEditPanel.value = false
  uni.showToast({ title: '个人信息已更新', icon: 'none' })
}

const openMenu = (item) => {
  // 页面跳转
  if (item.type === 'page' && item.url) {
    uni.navigateTo({ url: item.url })
    return
  }
  
  // 编辑资料
  if (item.type === 'edit') {
    openEditPanel()
    return
  }
  
  // 黑夜模式
  if (item.type === 'theme') {
    const next = toggleTheme()
    isDark.value = next === 'dark'
    uni.showToast({
      title: isDark.value ? '已切至黑夜模式' : '已切至日间模式',
      icon: 'none',
    })
    return
  }
  
  // 设置（模拟）
  if (item.type === 'setting') {
    uni.showModal({
      title: '设置',
      content: '此为前端模拟入口，正式版本将提供更多设置选项。',
      showCancel: false,
    })
    return
  }
}

const handleBottomTabChange = (item) => {
  if (item.path) {
    uni.redirectTo({ url: item.path })
  }
}
</script>

<style scoped src="@/static/css/mine.css"></style>