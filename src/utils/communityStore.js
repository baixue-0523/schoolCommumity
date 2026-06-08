import { allFeedList } from '../mock/home'

const POST_KEY = 'campus_local_posts'
const LIKE_KEY = 'campus_liked_posts'
const COMMENT_KEY = 'campus_post_comments'
const MESSAGE_KEY = 'campus_messages'

const safeGet = (key, fallback) => {
  try {
    return uni.getStorageSync(key) || fallback
  } catch (error) {
    return fallback
  }
}

const safeSet = (key, value) => {
  try {
    uni.setStorageSync(key, value)
  } catch (error) {
    return false
  }
  return true
}

export const getLocalPosts = () => safeGet(POST_KEY, [])

export const createLocalPost = ({ title, content, tag, imageCount = 0, target = '直接发布到首页推荐' }) => {
  const nextPost = {
    id: Date.now(),
    tab: 'latest',
    title: title || '无标题动态',
    content,
    isTop: false,
    user: { name: '林同学', college: '计算机学院', verified: true },
    tags: [tag],
    imageCount,
    target,
    likeCount: 0,
    commentCount: 0,
    publishTime: '刚刚',
    local: true,
  }
  const posts = [nextPost].concat(getLocalPosts())
  safeSet(POST_KEY, posts)
  return nextPost
}

export const getAllPosts = () => getLocalPosts().concat(allFeedList)

export const getPostsByTab = (tab) => {
  const posts = getAllPosts()
  if (tab === 'latest') {
    return posts.filter((item) => item.local || item.tab === 'latest')
  }
  return posts.filter((item) => item.tab === tab)
}

export const getPostById = (id) => getAllPosts().find((item) => item.id === Number(id))

export const getLikedMap = () => safeGet(LIKE_KEY, {})

export const isPostLiked = (id) => Boolean(getLikedMap()[id])

export const togglePostLike = (id) => {
  const likedMap = getLikedMap()
  likedMap[id] = !likedMap[id]
  safeSet(LIKE_KEY, likedMap)
  return likedMap[id]
}

export const getPostComments = (id) => {
  const commentMap = safeGet(COMMENT_KEY, {})
  return commentMap[id] || [
    { id: 1, name: '同校小白', content: '这个信息太有用了，收藏了！' },
    { id: 2, name: '南区同学', content: '我也想了解更多，蹲后续。' },
  ]
}

export const addPostComment = (id, content, parentId, replyTo) => {
  const commentMap = safeGet(COMMENT_KEY, {})
  
  if (parentId) {
    // 回复（包括回复评论和回复回复）
    commentMap[id] = getPostComments(id).map((item) => {
      if (item.id !== parentId) {
        return item
      }
      const newReply = {
        id: Date.now(),
        name: '林同学',
        avatar: '林',
        replyTo: replyTo || item.name,
        content,
      }
      return {
        ...item,
        replies: (item.replies || []).concat(newReply),
      }
    })
  } else {
    // 顶层评论
    const nextComment = {
      id: Date.now(),
      name: '林同学',
      avatar: '林',
      content,
      replies: [],
    }
    const currentComments = getPostComments(id)
    commentMap[id] = [...currentComments, nextComment]
  }
  
  safeSet(COMMENT_KEY, commentMap)
  return commentMap[id]
}

export const getMessages = () => safeGet(MESSAGE_KEY, [
  { id: 1, title: '互动通知', content: '北区小橙点赞了你的动态', time: '刚刚', icon: '♡', color: '#FF7A59', unread: true },
  { id: 2, title: '评论回复', content: '有人回复了你的求助帖', time: '12分钟前', icon: '💬', color: '#2F6BFF', unread: true },
  { id: 3, title: '系统公告', content: '校园社区首页体验版已上线', time: '1小时前', icon: '🔔', color: '#8B5CF6', unread: false },
])

export const saveMessages = (messages) => safeSet(MESSAGE_KEY, messages)

export const getTheme = () => safeGet('campus_theme', 'light')

const USER_KEY = 'campus_user_info'
export const getUserInfo = () => safeGet(USER_KEY, {
  name: '林同学',
  college: '计算机学院',
  grade: '2023级',
  avatar: '',
  verified: true
})

export const saveUserInfo = (userInfo) => safeSet(USER_KEY, userInfo)

export const toggleTheme = () => {
  const current = getTheme()
  const next = current === 'dark' ? 'light' : 'dark'
  safeSet('campus_theme', next)
  uni.$emit('themeChanged', next)
  return next
}

const CHAT_KEY = 'campus_chats'
export const getChatsForFriend = (friendId) => {
  const allChats = safeGet(CHAT_KEY, {})
  return allChats[friendId] || [
    { id: 1, sender: 'friend', text: '嗨！今天有什么好玩的动态吗？', time: '下午 2:30' }
  ]
}

export const addChatMessage = (friendId, sender, text, sharedPost = null) => {
  const allChats = safeGet(CHAT_KEY, {})
  const current = allChats[friendId] || [
    { id: 1, sender: 'friend', text: '嗨！今天有什么好玩的动态吗？', time: '下午 2:30' }
  ]
  const newMessage = {
    id: Date.now(),
    sender,
    text,
    sharedPost,
    time: '刚刚'
  }
  allChats[friendId] = current.concat(newMessage)
  safeSet(CHAT_KEY, allChats)
  return allChats[friendId]
}

const JOINED_CIRCLES_KEY = 'campus_joined_circles'
export const getJoinedCircles = () => safeGet(JOINED_CIRCLES_KEY, [])

export const toggleCircleJoin = (circleId, circleName = '兴趣圈子') => {
  const joined = getJoinedCircles()
  const index = joined.indexOf(circleId)
  let isJoined = false
  const messages = getMessages()
  if (index > -1) {
    joined.splice(index, 1)
    saveMessages(messages.filter((item) => !(item.type === 'circle' && item.circleId === circleId) && item.title !== `${circleName} 消息`))
  } else {
    joined.push(circleId)
    isJoined = true
    const nextMsg = {
      id: Date.now(),
      type: 'circle',
      circleId,
      circleName,
      title: `${circleName} 消息`,
      content: `🎉 欢迎加入 ${circleName}！快来看看圈内的最新话题，和志同道合的校友交流吧。`,
      time: '刚刚',
      icon: '👥',
      color: '#10B981',
      unread: true
    }
    const filteredMessages = messages.filter((item) => !(item.type === 'circle' && item.circleId === circleId) && item.title !== `${circleName} 消息`)
    saveMessages([nextMsg].concat(filteredMessages))
  }
  safeSet(JOINED_CIRCLES_KEY, joined)
  return isJoined
}

// ========== 收藏功能 ==========
const COLLECT_KEY = 'campus_collected_posts'

export const getCollectedMap = () => {
  try {
    return uni.getStorageSync(COLLECT_KEY) || {}
  } catch (error) {
    return {}
  }
}

export const isPostCollected = (id) => {
  const map = getCollectedMap()
  return !!map[id]
}

export const togglePostCollect = (id) => {
  const map = getCollectedMap()
  const newState = !map[id]
  map[id] = newState
  try {
    uni.setStorageSync(COLLECT_KEY, map)
  } catch (error) {}
  return newState
}

// ========== 获取收藏的帖子 ==========
export const getCollectedPosts = () => {
  const collectedMap = getCollectedMap()
  const allPosts = getAllPosts()
  return allPosts.filter(post => collectedMap[post.id])
}

// ========== 浏览历史 ==========
const HISTORY_KEY = 'browse_history'

export const addBrowseHistory = (post) => {
  try {
    let history = uni.getStorageSync(HISTORY_KEY) || []
    history = history.filter(item => item.id !== post.id)
    history.unshift({ ...post, browseTime: Date.now() })
    history = history.slice(0, 20)
    uni.setStorageSync(HISTORY_KEY, history)
  } catch (error) {}
}

export const getBrowseHistory = () => {
  try {
    return uni.getStorageSync(HISTORY_KEY) || []
  } catch (error) {
    return []
  }
}

export const clearBrowseHistory = () => {
  try {
    uni.removeStorageSync(HISTORY_KEY)
  } catch (error) {}
}

// ========== 获取用户发布的帖子 ==========
export const getUserPosts = () => {
  return getLocalPosts()
}