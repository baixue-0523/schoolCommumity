# 校园社区 Uni-app 前端项目

本项目基于 `Uni-app + Vue3 + Composition API` 开发，围绕校园社区首页与基础交互完成组件化实现。项目已覆盖笔试要求中的顶部导航、搜索区域、Banner、功能宫格、热门入口、校园公告、Feed 流、底部 TabBar、悬浮发布按钮、下拉刷新、分页加载、mock 数据驱动与移动端适配等内容。

## 项目运行方式

### 安装依赖

```bash
npm install
```

### 运行 H5

```bash
npm run dev:h5
```

浏览器访问开发服务地址，例如：

```text
http://localhost:5173/
```

### 构建 H5

```bash
npm run build:h5
```

### 运行微信小程序端

```bash
npm run dev:mp-weixin
```

运行后使用微信开发者工具打开生成目录：

```text
dist/dev/mp-weixin
```

## 项目目录结构说明

```text
project-mianshi/
├─ README.md
├─ package.json
├─ vite.config.js
├─ index.html
├─ .editorconfig
├─ .eslintrc.js
├─ .eslintignore
├─ .prettierrc
├─ .prettierignore
└─ src/
   ├─ App.vue
   ├─ main.js
   ├─ pages.json
   ├─ manifest.json
   ├─ uni.scss
   ├─ components/
   │  ├─ common/
   │  │  └─ SharePanel.vue
   │  └─ home/
   │     ├─ HomeHeader.vue
   │     ├─ SearchBar.vue
   │     ├─ BannerSwiper.vue
   │     ├─ FunctionGrid.vue
   │     ├─ HotEntryList.vue
   │     ├─ NoticeBar.vue
   │     ├─ FeedTabs.vue
   │     ├─ FeedCard.vue
   │     ├─ FloatingPublishButton.vue
   │     ├─ BottomTabBar.vue
   │     ├─ EmptyState.vue
   │     └─ LoadingView.vue
   ├─ mock/
   │  ├─ home.js
   │  ├─ share.js
   │  └─ circlePosts.js
   ├─ pages/
   │  ├─ index/
   │  │  └─ index.vue
   │  ├─ circle/
   │  │  └─ circle.vue
   │  ├─ circle-detail/
   │  │  └─ circle-detail.vue
   │  ├─ publish/
   │  │  └─ publish.vue
   │  ├─ message/
   │  │  └─ message.vue
   │  ├─ chat/
   │  │  └─ chat.vue
   │  ├─ mine/
   │  │  └─ mine.vue
   │  ├─ search/
   │  │  └─ search.vue
   │  ├─ post-detail/
   │  │  └─ post-detail.vue
   │  ├─ notice-detail/
   │  │  └─ notice-detail.vue
   │  ├─ feature/
   │  │  └─ feature.vue
   │  └─ profile/
   │     └─ profile.vue
   ├─ static/
   │  ├─ css/
   │  └─ image/
   └─ utils/
      └─ communityStore.js
```

## 组件说明

### 首页基础组件

- `HomeHeader.vue`：顶部导航栏，包含校区切换、菜单入口和消息入口。
- `SearchBar.vue`：搜索区域，包含搜索框、扫码入口和天气展示。
- `BannerSwiper.vue`：Banner 轮播区域，用于展示校园活动与推荐内容。
- `FunctionGrid.vue`：功能宫格导航，采用 5 列宫格布局。
- `HotEntryList.vue`：热门入口模块，展示校园搭子、自习室、活动局等快捷入口。
- `NoticeBar.vue`：校园公告模块，展示公告列表并支持跳转详情。
- `FeedTabs.vue`：Feed 流分类 Tab，支持推荐、关注、最新、热榜切换。
- `FeedCard.vue`：Feed 单条帖子卡片，展示用户、认证、置顶、标签、点赞数、评论数等信息。
- `FloatingPublishButton.vue`：首页悬浮发布按钮。
- `BottomTabBar.vue`：底部 5 栏导航，支持首页、圈子、发布、消息、我的页面切换。
- `EmptyState.vue`：空状态展示组件。
- `LoadingView.vue`：分页加载与加载完成状态组件。

### **新增首页基础组件**

- `RecommendCircle.vue`：推荐圈子模块，横向滚动展示推荐圈子列表，支持点击跳转圈子详情。
- `LoadingSkeleton.vue`：骨架屏加载组件，用于帖子列表首次加载时显示占位动画，提升加载体验。


### 搜索页增强

- **搜索历史**：自动保存用户搜索关键词到本地存储，下次进入可快速点击历史词搜索。
- **清空历史**：支持一键清空所有搜索历史，操作前有确认提示。
- **联想搜索**：输入关键词时实时匹配帖子标题/内容/标签，下拉列表展示联想结果，点击可快速填充并搜索。
- **热门搜索**：展示热门搜索词（数据来自 `mock/home.js`），点击可快速搜索。

### 发布页增强

- **图片上传 UI**：支持选择图片/视频，网格展示预览，支持删除和预览大图。
- **话题选择**：预设热门话题标签，支持自定义添加话题（限8字）。
- **字数统计**：实时显示已输入字数（上限300字）。
- **草稿保存**：输入内容自动保存到本地草稿箱，页面关闭/切换时自动保存，下次进入可恢复继续编辑。
- **发布成功反馈**：发布时显示 Loading 状态，成功后弹窗提示发布位置，自动清除草稿并跳转回首页。

###  帖子详情页优化
- **评论回复结构**：支持多层嵌套回复，点击任意评论/回复即可回复
- **评论输入框固定底部**：输入框固定在屏幕底部，随键盘弹出
- **点赞交互动画**：点击点赞按钮缩放动画反馈
- **收藏功能**：支持收藏/取消收藏，状态本地存储
- **图片预览**：点击图片可大图预览，左右滑动浏览

### 个人中心功能补全

- **我的帖子**：展示用户已发布的帖子列表，数据来自本地存储，支持点击跳转详情页。
- **我的收藏**：展示用户收藏的帖子列表，收藏状态与详情页同步，支持点击跳转详情页。
- **浏览历史**：自动记录浏览过的帖子，按时间倒序排列，支持清空历史记录。
- **草稿箱入口**：点击跳转发布页并自动恢复草稿，方便继续编辑未完成的内容。
- **编辑资料页面**：支持修改昵称、学院、年级和头像，数据保存到本地存储。

### 首页帖子图片优化

- **真实图片展示**：将帖子列表中的模拟图片（灰色块）替换为真实网络图片，使用 Picsum 免费图片 API 自动生成随机图片。
- **图片预览功能**：点击帖子图片可打开大图预览，支持左右滑动浏览多张图片。
- **多图网格布局**：根据图片数量（1-3张）自动适配不同网格布局（1张大图、2张并排、3张九宫格）。

### 新增页面

| 页面 | 路径 | 说明 |
|------|------|------|
| 我的帖子 | `pages/mine/my-posts.vue` | 展示用户发布的帖子 |
| 我的收藏 | `pages/mine/my-collections.vue` | 展示收藏的帖子 |
| 浏览历史 | `pages/mine/browse-history.vue` | 展示浏览记录，支持清空 |

### **扩展 mock 数据** / 本地存储

- `campus_local_posts`：用户发布的帖子
- `campus_collected_posts`：收藏的帖子映射表
- `browse_history`：浏览历史记录

### 公共组件

- `SharePanel.vue`：通用分享面板组件，统一用于首页帖子、圈子帖子和帖子详情页分享，支持好友分享和微信、QQ、QQ 空间、朋友圈等渠道展示。

## mock 数据说明

项目使用 mock 数据驱动页面展示，避免业务数据直接写死在页面中。

### `src/mock/home.js`

主要维护首页与基础模块数据：

- `campusInfo`：当前校区信息。
- `weatherInfo`：天气展示信息。
- `bannerList`：Banner 轮播数据。
- `functionList`：功能宫格导航数据。
- `hotEntryList`：热门入口数据。
- `noticeList`：校园公告数据。
- `feedTabs`：Feed 分类 Tab 数据。
- `feedMockMap`：推荐、关注、最新、热榜等 Feed 流数据。
- `bottomTabs`：底部 5 栏 TabBar 数据。

### 新增mock数据

- `recommendCircleList`：推荐圈子数据，包含圈子名称、成员数、头像、标签等字段，用于推荐圈子模块。

Feed 数据字段包含：

- 用户信息 `user`
- 学生认证字段 `verified`
- 置顶字段 `isTop`
- 标题 `title`
- 内容 `content`
- 标签 `tags`
- 图片数量 `imageCount`
- 点赞数量 `likeCount`
- 评论数量 `commentCount`
- 发布时间 `publishTime`

### `src/mock/share.js`

维护分享面板静态数据：

- `shareFriends`：好友列表。
- `shareChannels`：社交平台分享渠道。
- `friendIdMap`：好友名称与聊天 ID 映射关系。

### `src/mock/circlePosts.js`

维护圈子详情页模拟帖子数据：

- 学习互助圈
- 校园搭子圈
- 二手交易圈
- 社团活动圈

圈子详情页会从该 mock 文件读取帖子，并通过分页方式加载展示。

## 页面结构说明

### 首页 `src/pages/index/index.vue`


- 顶部导航栏：校区切换、菜单入口、消息入口。
- 搜索区域：搜索框、扫码入口、天气展示。
- Banner 轮播区域：校园活动和推荐信息展示。
- 功能宫格导航：5 列移动端宫格布局。
- 热门入口模块：展示校园热点入口。
- 校园公告模块：公告列表展示与详情跳转。
- Feed 流推荐模块：支持推荐、关注、最新、热榜 Tab 切换。
- 分页加载：触底加载更多 mock Feed 数据。
- 下拉刷新：刷新当前 Feed 数据。
- 底部 TabBar：5 栏结构。
- 悬浮发布按钮：跳转发布页。
- 分享面板：支持将帖子分享给好友或社交渠道。

### 其他页面

- `circle/circle.vue`：圈子页面，展示圈子入口与加入状态。
- `circle-detail/circle-detail.vue`：圈子详情页，展示对应圈子的 mock 帖子，支持点赞、分享和分页加载。
- `publish/publish.vue`：发布页面，支持标题、正文、图片/视频选择、自定义标签和发布位置选择。
- `message/message.vue`：消息页面，包含好友列表、通知消息和圈子加入消息跳转。
- `chat/chat.vue`：好友聊天页，用于承接分享消息和模拟聊天。
- `mine/mine.vue`：我的页面，支持用户信息展示、头像修改、统一编辑资料、黑夜模式切换。
- `search/search.vue`：搜索页，支持热门搜索、关键词检索和黑夜模式适配。
- `post-detail/post-detail.vue`：帖子详情页，支持点赞、评论、二级回复、用户资料跳转和分享。
- `notice-detail/notice-detail.vue`：公告详情页。
- `feature/feature.vue`：功能入口承接页。
- `profile/profile.vue`：用户资料展示页。

## 本次开发内容说明



- 使用 `Uni-app + Vue3` 开发。
- 使用 Vue3 `Composition API` 组织页面状态与交互。
- 首页按要求拆分为多个基础组件。
- 页面数据来自 `src/mock` 和本地存储模拟数据。
- 布局使用 `flex/grid/rpx`，适配移动端。
- 首页包含顶部导航、搜索、Banner、功能宫格、热门入口、公告、Feed、TabBar、悬浮发布按钮。
- Feed 流支持推荐、关注、最新、热榜切换。
- Feed 卡片支持图文展示、置顶标签、学生认证、标签、点赞数、评论数、发布时间。
- Feed 支持 mock 数据分页加载和下拉刷新。

### 扩展交互内容

- 完善底部 5 栏页面：首页、圈子、发布、消息、我的。
- 增加圈子详情页，展示不同圈子的模拟帖子。
- 增加发布页多媒体选择、自定义标签、发布位置选择。
- 增加消息页好友列表与通知消息。
- 增加聊天页，支持分享卡片进入好友聊天。
- 增加帖子详情页，支持评论、二级回复、点赞和分享。
- 增加搜索页，支持关键词搜索与黑夜模式。
- 增加我的页统一修改资料弹窗与头像修改。
- 增加全局黑夜模式，底部导航图标会根据主题自动切换。
- 增加分享面板公共组件，减少重复代码。
- 增加图片懒加载 `lazy-load` 与 `fade-show`。
- 增加推荐圈子模块：首页新增横向滚动推荐圈子区域，展示校园热门圈子，数据来自 mock。
- 增加骨架屏加载：帖子列表首次加载时显示骨架屏动画，替代原有文字加载提示，优化感知体验。

### UI 与规范

- 主品牌色使用 `#2F6BFF`。
- 辅助色使用 `#FF7A59`、`#8B5CF6`、`#22C55E`。
- 卡片普遍使用 `24rpx` 左右圆角。
- Banner 按移动端视觉比例设计。
- 功能导航为 5 列宫格。
- TabBar 为 5 栏结构。
- 已补充 `.eslintrc.js`、`.eslintignore`、`.prettierrc`、`.prettierignore`、`.editorconfig` 代码规范文件。


