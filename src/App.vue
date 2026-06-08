<script>
export default {
  onLaunch: function () {  //uniapp在应用启动时自动调用
    console.log('App Launch')
  },
  onShow: function () { //应用从后台切换到前台时触发
    console.log('App Show')
  },
  onHide: function () {//相反
    console.log('App Hide')
  },
}
</script>

<style>
/*每个页面公共css */

/* 黑夜模式通用变量和强制覆盖 */
.theme-dark {
  background-color: #121212 !important;
  background-image: none !important; /* 隐藏白天的亮色背景图 */
  color: #e5e5e7 !important;
}

.theme-dark.page {
  background-color: #121212 !important;
  background-image: none !important;
}

.theme-dark::before {
  display: none !important;
}

.theme-dark .tabbar-item.active {
  color: #ffffff !important;
}

.theme-dark .tabbar-item.active .tabbar-icon,
.theme-dark .tabbar-item.active .tabbar-text {
  color: #ffffff !important;
}

/* 覆盖卡片、文本等 */
.theme-dark .circle-card,
.theme-dark .message-card,
.theme-dark .form-card,
.theme-dark .section-card,
.theme-dark .stats-card,
.theme-dark .menu-card,
.theme-dark .feed-card,
.theme-dark .function-card,
.theme-dark .hot-section,
.theme-dark .notice-card,
.theme-dark .comment-card,
.theme-dark .comment-item,
.theme-dark .action-bar,
.theme-dark .detail-card,
.theme-dark .search-wrap,
.theme-dark .fixed-header,
.theme-dark .feed-title-wrap,
.theme-dark .feed-tabs,
.theme-dark .tab-item,
.theme-dark .share-panel,
.theme-dark .post-card,
.theme-dark .friends-section,
.theme-dark .reply-list {
  background-color: rgba(30, 30, 30, 0.85) !important;  /*提高优先级 */
  background-image: none !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3) !important;
}

/* 文本强制改为明亮色 */
.theme-dark .title,
.theme-dark .campus-name,
.theme-dark .function-name,
.theme-dark .section-title,
.theme-dark .hot-title,
.theme-dark .circle-name,
.theme-dark .message-title,
.theme-dark .name,
.theme-dark .menu-title,
.theme-dark .post-title,
.theme-dark .post-content,
.theme-dark .comment-name,
.theme-dark .comment-content,
.theme-dark .user-name,
.theme-dark .nav-title,
.theme-dark .back,
.theme-dark .share,
.theme-dark .feed-main-title,
.theme-dark .friends-title,
.theme-dark .username,
.theme-dark .circle-title,
.theme-dark .share-cancel,
.theme-dark .reply-content {
  color: #ffffff !important;
  background: none !important;
  -webkit-text-fill-color: initial !important;   /*WebKit 文字填充色*/
}

/* 辅助文本 */
.theme-dark .subtitle,
.theme-dark .circle-desc,
.theme-dark .message-content,
.theme-dark .desc,
.theme-dark .stat-label,
.theme-dark .feed-sub-title,
.theme-dark .post-meta,
.theme-dark .message-time,
.theme-dark .share-name,
.theme-dark .channel-name,
.theme-dark .friend-name,
.theme-dark .college,
.theme-dark .time {
  color: #a1a1a6 !important;
}

/* 各种输入框、搜素、扫码、顶部按钮磨砂反转 */
.theme-dark input,
.theme-dark textarea,
.theme-dark .search-box,
.theme-dark .scan-btn,
.theme-dark .action-btn,
.theme-dark .comment-input,
.theme-dark .picker-row {
  background-color: rgba(45, 45, 45, 0.85) !important;
  color: #ffffff !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.theme-dark .picker-val {
  color: #ffffff !important;
}

/* 底部标签栏黑夜化 */
.theme-dark .tab-bar {
  background: rgba(20, 20, 20, 0.5) !important;
  border-top-color: rgba(255, 255, 255, 0.08) !important;
}

.theme-dark .bottom-tabbar {
  background: rgba(20, 20, 20, 0.5) !important;
  border-top-color: rgba(255, 255, 255, 0.08) !important;
}
</style>
