<template>
  <view class="page" :class="{ 'theme-dark': isDark }">
    <view class="header">
      <text class="title">发布动态</text>
      <text class="draft-btn" @tap="loadDraft">草稿箱</text>
    </view>

    <view class="form-card">
      <input v-model="title" class="title-input" placeholder="添加标题，会获得更多关注" @input="saveDraft" />
      <textarea 
        v-model="content" 
        class="content-input" 
        placeholder="分享校园新鲜事、求助、经验或二手信息..." 
        maxlength="300" 
        @input="onContentInput"
      />
      <view class="counter">{{ content.length }}/300</view>

      <!-- 多媒体选择区 -->
      <view class="media-section">
        <view class="media-grid">
          <view v-for="(media, index) in mediaList" :key="index" class="media-item">
            <image v-if="media.type === 'image'" :src="media.url" mode="aspectFill" class="media-preview" lazy-load fade-show @tap="previewImage(media.url)" />
            <video v-else-if="media.type === 'video'" :src="media.url" class="media-preview" controls />
            <text class="media-delete" @tap="removeMedia(index)">✕</text>
          </view>
          
          <view v-if="mediaList.length < 9" class="media-add-btn" @tap="chooseMedia">
            <text class="media-add-icon">＋</text>
            <text class="media-add-text">照片/视频</text>
          </view>
        </view>
      </view>
    </view>

    <view class="section-card">
      <text class="section-title">选择话题</text>
      <view class="tag-list">
        <text v-for="tag in tags" :key="tag" class="tag" :class="{ active: selectedTag === tag }" @tap="selectedTag = tag"># {{ tag }}</text>
      </view>

      <!-- 自定义话题 -->
      <view class="custom-tag-row">
        <input v-model="customTagText" class="custom-tag-input" placeholder="输入自定义话题（限8字）" maxlength="8" confirm-type="done" @confirm="addCustomTag" />
        <view class="custom-tag-btn" @tap="addCustomTag">添加</view>
      </view>
    </view>

    <!-- 选择发布圈子/首页 -->
    <view class="section-card">
      <text class="section-title">发布位置</text>
      <picker mode="selector" :range="publishTargets" @change="onTargetChange">
        <view class="picker-row">
          <text class="picker-val">📍 {{ publishTargets[selectedTargetIndex] }}</text>
          <text class="picker-arrow">›</text>
        </view>
      </picker>
    </view>

    <!-- 发布按钮 -->
    <view class="submit-btn-wrap">
      <view class="submit-btn" @tap="submitPost">确认发布 ✨</view>
    </view>

    <BottomTabBar :tabs="bottomTabs" active="publish" @change="handleBottomTabChange" />
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import BottomTabBar from '../../components/home/BottomTabBar.vue'
import { bottomTabs } from '../../mock/home'
import { createLocalPost, getTheme } from '../../utils/communityStore'

const isDark = ref(false)
const title = ref('')
const content = ref('')
const selectedTag = ref('校园日常')
const tags = ref(['校园日常', '学习互助', '二手市场', '失物招领', '校园搭子', '社团活动'])

const publishTargets = ['直接发布到首页推荐', '学习互助圈', '校园搭子圈', '二手交易圈', '社团活动圈']
const selectedTargetIndex = ref(0)

const onTargetChange = (e) => {
  selectedTargetIndex.value = Number(e.detail.value)
  saveDraft()
}

// 媒体相关
const mediaList = ref([])

// 自定义话题文本
const customTagText = ref('')

// 草稿保存的 key
const DRAFT_KEY = 'publish_draft'

// 字数统计（输入时触发）
const onContentInput = () => {
  saveDraft()
}

// 保存草稿（自动保存所有内容）
const saveDraft = () => {
  const draft = {
    title: title.value,
    content: content.value,
    selectedTag: selectedTag.value,
    selectedTargetIndex: selectedTargetIndex.value,
    mediaList: mediaList.value,
    customTagText: customTagText.value,
    timestamp: Date.now()
  }
  try {
    uni.setStorageSync(DRAFT_KEY, draft)
  } catch (error) {}
}

// 加载草稿
const loadDraft = () => {
  try {
    const draft = uni.getStorageSync(DRAFT_KEY)
    if (draft && draft.title) {
      uni.showModal({
        title: '恢复草稿',
        content: `您有未发布的草稿（${new Date(draft.timestamp).toLocaleString()}），是否恢复？`,
        confirmText: '恢复',
        cancelText: '放弃',
        success: (res) => {
          if (res.confirm) {
            title.value = draft.title || ''
            content.value = draft.content || ''
            selectedTag.value = draft.selectedTag || '校园日常'
            selectedTargetIndex.value = draft.selectedTargetIndex || 0
            mediaList.value = draft.mediaList || []
            customTagText.value = draft.customTagText || ''
            uni.showToast({ title: '已恢复草稿', icon: 'success' })
          } else {
            // 放弃草稿，删除存储
            uni.removeStorageSync(DRAFT_KEY)
          }
        }
      })
    } else {
      uni.showToast({ title: '暂无草稿', icon: 'none' })
    }
  } catch (error) {
    uni.showToast({ title: '读取草稿失败', icon: 'none' })
  }
}

// 清除草稿（发布成功后调用）
const clearDraft = () => {
  try {
    uni.removeStorageSync(DRAFT_KEY)
  } catch (error) {}
}

onShow(() => {
  isDark.value = getTheme() === 'dark'
})

// 页面卸载时自动保存草稿（页面关闭或切换时）
onUnmounted(() => {
  if (title.value || content.value || mediaList.value.length > 0) {
    saveDraft()
  }
})

// 添加自定义话题
const addCustomTag = () => {
  const value = customTagText.value.trim()
  if (!value) {
    uni.showToast({ title: '请输入话题内容', icon: 'none' })
    return
  }
  if (tags.value.includes(value)) {
    selectedTag.value = value
    customTagText.value = ''
    uni.showToast({ title: '话题已存在，已为您选中', icon: 'none' })
    saveDraft()
    return
  }
  tags.value.push(value)
  selectedTag.value = value
  customTagText.value = ''
  uni.showToast({ title: '话题添加成功并已选择', icon: 'success' })
  saveDraft()
}

// 选择媒体
const chooseMedia = () => {
  uni.showActionSheet({
    itemList: ['上传图片', '上传视频'],
    success: (res) => {
      if (res.tapIndex === 0) {
        // 图片上传
        uni.chooseImage({
          count: 9 - mediaList.value.length,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: (imgRes) => {
            const tempFiles = imgRes.tempFilePaths.map(path => ({
              type: 'image',
              url: path
            }))
            mediaList.value = mediaList.value.concat(tempFiles)
            saveDraft()
            uni.showToast({ title: `已选择 ${tempFiles.length} 张图片`, icon: 'success' })
          }
        })
      } else {
        // 视频上传
        uni.chooseVideo({
          sourceType: ['album', 'camera'],
          compressed: true,
          success: (videoRes) => {
            mediaList.value.push({
              type: 'video',
              url: videoRes.tempFilePath
            })
            saveDraft()
            uni.showToast({ title: '视频已添加', icon: 'success' })
          }
        })
      }
    }
  })
}

// 预览图片
const previewImage = (url) => {
  const urls = mediaList.value.filter(m => m.type === 'image').map(m => m.url)
  uni.previewImage({
    current: url,
    urls
  })
}

// 移除媒体
const removeMedia = (index) => {
  mediaList.value.splice(index, 1)
  saveDraft()
  uni.showToast({ title: '已移除', icon: 'none' })
}

// 发布
const submitPost = () => {
  if (!title.value.trim() && !content.value.trim()) {
    uni.showToast({ title: '请输入发布内容', icon: 'none' })
    return
  }

  // 显示加载中
  uni.showLoading({ title: '发布中...', mask: true })

  // 模拟发布延迟
  setTimeout(() => {
    createLocalPost({
      title: title.value.trim(),
      content: content.value.trim(),
      tag: selectedTag.value,
      imageCount: mediaList.value.length,
      target: publishTargets[selectedTargetIndex.value],
    })
    
    // 隐藏加载
    uni.hideLoading()
    
    // 发布成功反馈
    uni.showModal({
      title: '发布成功',
      content: `您的动态已成功发布到【${publishTargets[selectedTargetIndex.value]}】`,
      showCancel: false,
      confirmText: '好的',
      success: () => {
        // 清除草稿
        clearDraft()
        // 清空表单
        title.value = ''
        content.value = ''
        mediaList.value = []
        // 跳转到首页
        setTimeout(() => {
          uni.redirectTo({ url: '/pages/index/index' })
        }, 100)
      }
    })
  }, 800)
}

const handleBottomTabChange = (item) => {
  // 切换时自动保存草稿
  if (title.value || content.value || mediaList.value.length > 0) {
    saveDraft()
  }
  if (item.path) {
    uni.redirectTo({ url: item.path })
  }
}
</script>

<style scoped src="@/static/css/publish.css"></style>