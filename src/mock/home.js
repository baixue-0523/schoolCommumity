export const campusInfo = {
  name: '南湖校区',
}

export const weatherInfo = {
  text: '晴',
  temperature: '26℃',
}

export const bannerList = [
  { id: 1, title: '校园迎新季', desc: '新生攻略与校园活动一站掌握', tag: '活动', color: 'linear-gradient(135deg, #2F6BFF, #8B5CF6)' },
  { id: 2, title: '社团招新进行中', desc: '找到你的兴趣同频伙伴', tag: '社团', color: 'linear-gradient(135deg, #FF7A59, #F59E0B)' },
  { id: 3, title: '期末互助计划', desc: '资料共享、组队自习、答疑互助', tag: '学习', color: 'linear-gradient(135deg, #22C55E, #14B8A6)' },
]

export const functionList = [
  { id: 1, name: '二手市场', icon: '📦', color: '#2F6BFF' },
  { id: 2, name: '失物招领', icon: '🔎', color: '#FF7A59' },
  { id: 3, name: '校园搭子', icon: '🤝', color: '#8B5CF6' },
  { id: 4, name: '课程互助', icon: '📚', color: '#22C55E' },
  { id: 5, name: '社团活动', icon: '🎉', color: '#F59E0B' },
  { id: 6, name: '表白墙', icon: '💌', color: '#EC4899' },
  { id: 7, name: '兼职信息', icon: '💼', color: '#06B6D4' },
  { id: 8, name: '校园地图', icon: '🗺️', color: '#10B981' },
  { id: 9, name: '成绩查询', icon: '📝', color: '#6366F1' },
  { id: 10, name: '更多服务', icon: '✨', color: '#64748B' },
]

export const hotEntryList = [
  { id: 1, title: '饭搭子集合', desc: '今天一起去哪个食堂？', badge: '热门', color: '#2F6BFF' },
  { id: 2, title: '考研自习室', desc: '找同频研友打卡学习', badge: '推荐', color: '#8B5CF6' },
  { id: 3, title: '周末活动局', desc: '运动、桌游、电影局', badge: '新', color: '#FF7A59' },
]

export const noticeList = [
  { id: 1, title: '图书馆五一期间开放时间调整通知', time: '10分钟前' },
  { id: 2, title: '关于校园网夜间维护的温馨提示', time: '32分钟前' },
  { id: 3, title: '本周操场夜跑活动报名开启', time: '1小时前' },
]

export const feedTabs = [
  { key: 'recommend', name: '推荐' },
  { key: 'follow', name: '关注' },
  { key: 'latest', name: '最新' },
  { key: 'hot', name: '热榜' },
]

const users = [
  { name: '北区小橙', college: '计算机学院', verified: true },
  { name: '南湖阿舟', college: '新闻传播学院', verified: true },
  { name: '自习室灯塔', college: '外国语学院', verified: false },
  { name: '操场晚风', college: '体育学院', verified: true },
]

const createPost = (id, tab, title, content, options = {}) => {
  // 生成随机图片
  const imageCount = options.imageCount || 0
  const images = []
  if (imageCount > 0) {
    for (let i = 0; i < imageCount; i++) {
      images.push(`https://picsum.photos/400/300?random=${id}${i}`)
    }
  }
  
  return {
    id,
    tab,
    title,
    content,
    isTop: Boolean(options.isTop),
    user: users[id % users.length],
    tags: options.tags || ['校园日常'],
    imageCount: imageCount,
    images: options.images || images,
    likeCount: options.likeCount || 20 + id * 7,
    commentCount: options.commentCount || 5 + id * 3,
    publishTime: options.publishTime || `${id * 6}分钟前`,
    isCollected: false,
    collectCount: options.collectCount || Math.floor(Math.random() * 50) + 1,
  }
}
export const feedMockMap = {
  
  recommend: [
    createPost(1, 'recommend', '今天操场晚霞也太好看了', '下课路过操场，随手拍了一张，感觉整个校园都温柔了。', { isTop: true, tags: ['校园日常', '随手拍'], imageCount: 3, likeCount: 128, commentCount: 32 }),
    createPost(2, 'recommend', '求推荐南区附近适合自习的地方', '图书馆最近人好多，有没有安静一点、插座多的自习点？', { tags: ['学习互助'], likeCount: 76, commentCount: 41 }),
    createPost(3, 'recommend', '出一本几乎全新的高数辅导书', '只写了前两页，适合大一同学复习使用，价格可小刀。', { tags: ['二手市场'], imageCount: 1 }),
    createPost(4, 'recommend', '社团招新摊位地图整理好了', '把今天路过看到的社团摊位做了个整理，希望对大家有帮助。', { tags: ['社团活动', '攻略'], imageCount: 2 }),
    createPost(5, 'recommend', '有没有一起晨跑的同学', '每周一三五早上七点操场，互相监督不鸽。', { tags: ['运动搭子'] }),
    createPost(6, 'recommend', '食堂新品测评：香辣鸡腿饭', '味道比预期好，辣度中等，窗口排队速度也可以。', { tags: ['校园美食'], imageCount: 2 }),
  ],
  follow: [
    createPost(7, 'follow', '关注的学长更新了保研经验', '从绩点、竞赛到联系导师，整理得很细。', { isTop: true, tags: ['经验分享'] }),
    createPost(8, 'follow', '摄影社今晚有夜景拍摄活动', '地点在行政楼前广场，欢迎带相机或手机参加。', { tags: ['社团活动'], imageCount: 3 }),
    createPost(9, 'follow', '二手自行车已降价', '九成新，适合校内通勤，今天可看车。', { tags: ['二手市场'], imageCount: 1 }),
  ],
  latest: [
    createPost(10, 'latest', '刚刚捡到一张校园卡', '在三食堂门口捡到，已交给服务台。', { tags: ['失物招领'], publishTime: '刚刚' }),
    createPost(11, 'latest', '今晚有人拼奶茶吗', '满减还差两杯，北门自提。', { tags: ['校园搭子'], publishTime: '2分钟前' }),
    createPost(12, 'latest', '求问选修课影视鉴赏怎么样', '作业多吗？期末是论文还是考试？', { tags: ['课程互助'], publishTime: '5分钟前' }),
    createPost(13, 'latest', '操场现在人多吗', '想去跑步，不知道有没有活动占场。', { tags: ['校园问答'], publishTime: '8分钟前' }),
  ],
  hot: [
    createPost(14, 'hot', '本周校园热榜：十大食堂窗口投票', '快来给你心中的宝藏窗口投一票。', { isTop: true, tags: ['热榜', '校园美食'], likeCount: 986, commentCount: 214 }),
    createPost(15, 'hot', '期末复习资料互助帖', '各专业资料集中分享，注意甄别版本。', { tags: ['学习互助', '热榜'], likeCount: 764, commentCount: 189 }),
    createPost(16, 'hot', '毕业季跳蚤市场攻略', '摊位时间、地点、热门品类都在这里。', { tags: ['二手市场'], imageCount: 2, likeCount: 532, commentCount: 96 }),
  ],
}

export const bottomTabs = [
  { key: 'home', text: '首页', icon: '🏠', path: '/pages/index/index' },
  { key: 'circle', text: '圈子', icon: '💬', path: '/pages/circle/circle' },
  { key: 'publish', text: '发布', icon: '➕', path: '/pages/publish/publish' },
  { key: 'message', text: '消息', icon: '🔔', path: '/pages/message/message' },
  { key: 'mine', text: '我的', icon: '👤', path: '/pages/mine/mine' },
]

export const hotSearchList = ['二手教材', '饭搭子', '失物招领', '自习室', '社团招新', '校园网']

export const allFeedList = Object.values(feedMockMap).flat()

// 推荐圈子数据
export const recommendCircleList = [
  {
    id: 1,
    name: '学习互助圈',
    memberCount: 2341,
    avatar: '/static/image/circle-study.png',
    tags: ['考研', '四六级', '资料分享']
  },
  {
    id: 2,
    name: '校园搭子圈',
    memberCount: 1892,
    avatar: '/static/image/circle-partner.png',
    tags: ['约饭', '拼车', '组队']
  },
  {
    id: 3,
    name: '二手交易圈',
    memberCount: 3120,
    avatar: '/static/image/circle-trade.png',
    tags: ['闲置', '求购', '置换']
  },
  {
    id: 4,
    name: '社团活动圈',
    memberCount: 1567,
    avatar: '/static/image/circle-club.png',
    tags: ['招新', '演出', '比赛']
  }
]


