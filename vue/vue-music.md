# vue-music项目

## 特性

1. 歌手列表：
    1. 按首字母分类歌手，有一个title显示首字母，并且页面顶部是固定的当前分类标题；当下一组标题接触到当前组标题时，将其往上顶；
    2. 当进入歌手列表页时计算每一分组的高度，并且在发生滚动时记录当前视图顶部离整个列表顶部的距离，计算下一分组的顶部高度和当前视图高度，实现将当前组标题往上顶
    3. v-bind:data-xxxx可将数据保存至DOM的dataset中
    4. 右侧快捷栏，触摸移动时记录y轴位移，计算移动了哪个分组中
    5. 点击歌手进入歌手详情页时，使用了路由过渡效果
2. 歌手歌曲列表：
   1. 如果是从歌手列表点进来的，父组件会传一个 singer 参数并保存至 localStorage，如果是在歌曲列表刷新了，那么父组件没传参数，就会取 localStorage 存的 singer
   2. 点击任一歌曲，会触发顺序播放，修改 store 中的 sequenceList、playList、isPlaying、playMode、currentIndex、isFullScreen
   3. 点击随机播放按钮，类似于顺序播放，不同点在于 playList 是打乱顺序的，且 currentIndex 设为 0
3. 全屏播放器控制
   1. watch currentSong 和 isPlaying 控制 audio 是否播放，如果 isSongReady 为 false，则什么都不做；一旦 currentSong 发生变化，则修改为 isSongReady=false 等待 audio 加载完成后派发 canplay 事件修改为 isSongReady=true
   2. 播放键可切换 isPlaying 状态
   3. 前进/后退键修改 currentIndex、isPlaying 状态，会取消暂停，如果列表只有一首歌则修改 audio dom 的 currentTime 为 0，重新播放当前歌曲
   4. isSongReady=false 时播放/前进/后退键什么都不做且禁用按钮
   5. 切换播放模式会修改 playList、playMode、currentIndex 状态，不会打断当前播放的歌曲，会找到当前歌曲在新的 playList 中的下标
   6. 收藏歌曲会修改 favoriteList 状态和修改 localStorage，会将新的收藏歌曲插入到收藏列表的头部
4. 全屏播放器进度条
   1. 进度条以按钮左侧位置表示进度，歌曲结束时，按钮右侧紧贴进度条右侧，所以实际走过的进度条是 0 ~ 进度条宽度减去按钮宽度
   2. 发生拖动时向外派发事件，通过记录 x 轴位移与进度条宽度的比例计算新的播放进度；播放器在拖动期间只更新页面的当前时间，拖动结束后才会去更新 audio 的 currentTime，还会取消暂停；拖动期间 audio 还在播放但不会再更新当前时间
   3. 单击改变时间，会通过 getBoundingClientRect() 获取到进度条最左侧离视图左边界的距离，再根据点击位置计算出当前点击的进度大小
   4. audio dom 在一首歌曲播放完成时会派发 ended 事件，根据当前播放模式选择播放下一首，与下一首按钮逻辑相同，如果播放列表只有一首歌则重播
   5. watch isFullScreen，隐藏后重新切到全屏时，由于进度计算依赖 dom 宽度，所以要等 nextTick 刷新进度计算
5. 全屏播放器中间
   1. cd 旋转通过 animation 属性实现，在 base.scss 中通过 @keyframes 定义了旋转动画的起始和结束样式，为 img dom 加上旋转样式实现旋转；由于 img 选择是以父容器的角度为起点的，所以每次暂停都要将 img 的旋转角度赋值给父容器；img 的旋转用 transform:matrix() 来表示，需要 getComputedStyle(imgRef) 来获取；将多个 matrix() 以字符串形式拼接，可叠加旋转角度
   2. watch currentSong，异步调接口获取歌词，然后在 sequenceList 中找到当前歌曲，将歌词保存到 song 对象上，初始化 lyric-parser 并在回调函数中处理每句歌词的滚动；
   3. 中间层的 cd 在视图中心占满宽度，而歌词列表在 cd 右侧视图外；开始触摸时，初始化拖动方向，记录起始位置；拖动期间比较 x 轴和 y 轴位移大小来锁定拖动方向，只有水平拖动才有效，一旦拖动 x 轴位移达到视图宽度的 20%，就会发生切换将歌词列表移动到视图中心，并调整原 cd 的 opacity 属性使其透明
6. 底部 mini 播放器
   1. watch isFullScreen currentSong，绑定歌曲信息，如果全屏播放器没有显示，则会显示 mini 播放器
   2. mini 播放器左侧的旋转 cd 复用全屏播放器的逻辑，进入全屏时会有小 cd 变成大 cd 的动画，退出时也有，这个实现需要获取动态的 cd 样式所以不能写死在 css 中，而想在 js 中写动态的 keyframe 动画需要第三方库 create-keyframe-animation；transition 标签 enter、after-enter、leave、after-leave 事件，监听这些事件去执行动画的播放
7. mini 播放器的播放列表
   1. 只有当 playList 有数据时才能显示，列表展示的是 sequenceList，复用全屏播放器的修改播放模式逻辑；当 playList 不为空时，要修改一级路由 router-view 的 bottom 向上给 mini 播放器腾出空间
   2. watch currentSong，一旦发生改变自动滚动到当前歌曲
   3. 从播放列表中删除某一歌曲会触发 action，会修改 sequenceList 和 playList，如果被删除歌曲在当前歌曲前面，需要修改 currentIndex 减一，避免当前歌曲发生更改；删除时会让所有删除按钮 disable 0.3秒
   4. 列表右上角有清空列表的按钮，清空时会修改 sequenceList、playList、currentIndex、isPlaying
8. 搜索歌曲
   1. PageSearch
      1. \<search-input v-model="query" \\>
         1. \<input v-model="query" \\>
      2. \<search-history \\>
      3. \<search-result v-bind:query="query" \\>
   2. 搜索栏输入时防抖，停止输入后 300 毫秒才会返回数据
   3. 搜索结果组件 props 是搜索关键字并 watch 它，一旦发生改变会进行第一次搜索，等 nextTick 后判断结果是否占满一页，如果不满则标记 isAutoLoading=true，递归执行继续搜索，直到占满一页，点击搜索结果的某一歌曲会执行 action 去添加歌曲，会修改 sequenceList、playList、currentIndex、isPlaying、isFullScreen，会查找新增的歌曲是否已存在两个 List 中，不在会 push，currentIndex 修改为这首新增的歌曲，并取消暂停和开启全屏
   4. 搜索历史会保存在 state 和 localStorage 中
9. 性能优化
   1. 图片懒加载，封装成指令
   2. keep-alive 组件包裹 router-view，因为像歌手列表、歌单列表这些页面会来回切换，每次进入页面就会去请求接口；其实这些数据实时性不强，不会频繁改动，可以用 keep-alive 将页面缓存起来
   3. 用了 vue 自带的路由异步加载，避免所有 js 都打包进 app.js 里面
   4. 不需要双向绑定的数据，不要写在 data 里面，可以在 created 中创建
   5. gzip 压缩，安装插件 compression-webpack-plugin，最新版本 10.0 但 vue3 不支持，改为安装 5.0 版本，第三方库打包文件 chunk-verdors.js 从 270k 压缩到 90k
   6. terser-webpack-plugin 插件压缩 js，
   7. 通过 CDN 引入第三方库，chunk-verdors.js 从 270k 减小到 140k，gz 压缩从 90k 减小到 45k


```js
const state = {
  sequenceList: [], // 要播放的歌曲列表
  playList: [], // 播放顺序
  isPlaying: false, // 播放状态
  playMode: PLAY_MODE.sequence, // 播放模式，默认顺序播放
  currentIndex: 0, // 当前播放歌曲在 playList 中的下标
  isFullScreen: false, // 是否打开全屏的播放器
  favoriteList: getValueArray(FAVORITE_KEY),
  searchHistory: getValueArray(SEARCH_KEY)
}
const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}
```

## 接口

```json
/api/getRecommend
获取推荐页面的轮播图和热门歌单数据
{
  "code": 0, // OK状态码
  "result": {
    "sliders": [{ // 轮播图数组
      "id":, // 列表key，如果没有就直接使用link当作id
      "link":, // 轮播图点击跳转链接 
      "pic": // 轮播图图片链接
    }],
    "alnums":[{ // 热门歌单列表数组
      "id":, // 列表key，根据 id 通过接口 /api/getAlbum?id= 获取歌单详情
      "pic":, // 歌单图链接
      "title":, // 歌单标题
      "username": // 歌单创建者
    }]
  }
}

/api/getSinger
获取歌手列表数据
{
  "code": 0,
  "result": {
    "singers": [{ // 歌手数组
      "title": "A", // 按名字首字母分类
      "list": [{ // 属于该分类的歌手数组
        "id":, // 列表key
        "mid":, // 歌手详情页的路径
        "name":, // 歌手名字
        "pic": //歌手头像图
      }]
    }]
  }
}

/api/getSingerDetail?mid=  获取某个歌手的歌曲列表，参数为歌手的 mid
/api/getAlnum?id= 获取某个歌单的歌曲列表，参数为歌单的 id
/api/getTopDetail?id= 获取某个排行榜的歌曲列表
{
  "code": 0,
  "result": {
    "songs": [{ // 歌曲数组
      "id":,
      "mid":, // 歌曲mid，用于获取播放 url 和歌词
      "name":, // 歌名
      "album":, // 歌曲所属专辑名
      "duration":, // 歌曲时长，单位秒
      "singer":, // 歌手名
      "pic":, // 专辑图片链接
      "url":, // 歌曲播放链接，暂时为空；需要通过/api/getSongsUrl并以mid为参数去获取
    }]
  }
}

/api/getTopList 获取排行榜信息
{
  "code": 0,
  "result": {
    "topList": [{ // 排行榜数组
      "id":, // 榜id，根据 id 通过 /api/getTopDetail?id= 进入歌曲列表
      "name":, // 榜名
      "pic":, // 排行榜头图
      "period":, // 时间
      "songList": [{ // 属于该榜的前三首歌数组
        "id":, // 歌曲key
        "singerName":, // 歌手名
        "songName": // 歌名
      }]
    }]
  }
}

/api/getHotKeys 获取热门搜索
{
  "code": 0,
  "result": {
    "hotKeys": [{ // 数组
      "key":, // 热门搜索关键字
      "id": // 列表key
    }]
  }
}

/api/search 搜索
参数 query(搜索关键字)、page(结果页码)、isShowSinger(搜索结果是否需要包含歌手)
{
  "code": 0,
  "result": {
    "hasMore":, // 是否还有更多搜索结果
    "songs": [{ // 歌曲数组
      "id":,
      "mid":, // 歌曲mid，用于获取播放 url 和歌词
      "name":, // 歌名
      "album":, // 歌曲所属专辑名
      "duration":, // 歌曲时长，单位秒
      "singer":, // 歌手名
      "pic":, // 专辑图片链接
      "url":, // 歌曲播放链接，暂时为空；需要通过/api/getSongsUrl并以mid为参数去获取
    }]
  }
}
```

## 自定义指令

```js
// 1. 创建包含钩子函数的指令对象
loadingDirective {
  mounted (el, binding) {
    // 指令绑定值binding.value就是下面传入的v
    // 指令参数binding.arg就是下面传入的a
  }
  updated (el,binding) {...}
}

// 2. 在main.js中注册指令
app.directive('loading', loadingDirective)

// 3. 根据注册的指令名字，在其前面加上v-使用
<img v-loading:[a]="v">
```

## 歌词解析器

1. 正则表达式解析标签，记录 曲名、歌手 等信息
2. 正则解析时间标签，将每一句歌词和对应的时间保存到数组中
3. 播放时计算当前时间离下一句歌词的时间差，通过 setTimeout() 在对应时间执行该行歌词的回调函数，然后递归继续播放
4. 暂停时先记录以下暂停的时间戳，下次播放从暂停处开始

## 多标签页共享状态

1. 需求
   1. 一个标签播放，其他所有标签全部自动暂停
   2. 一个标签修改播放列表，其他所有标签同步列表；如果从列表中删除了歌曲 A，则其他标签如果当前歌曲是 A，就会将当前歌曲重置为 index=0，如果不是 A 则不作处理
2. 实现
   1. localStorage 保存标记 \_\_stop-other-playing\_\_ 布尔值，一旦监听到其他标签让它发生变化，则当前标签要执行暂停键的逻辑，即直接修改 isPlaying=false
   2. localStorage 保存同步数据对象 \_\_sync-playList-data\_\_，
      1. 当 A 标签通过歌曲列表点击某一首歌进行顺序播放，会将顺序列表和当前下标放入同步数据中，B 标签收到后，如果 B 标签是顺序播放或单曲循环，则同步顺序列表、播放列表、当前下标；如果 B 标签是随机播放，则只同步顺序列表，然后生成随机播放列表，再在新的随机列表中找到 A 正在播放的歌曲下标设为自己的当前下标
      2. 当 A 标签在搜索结果中加入一首歌后，会同步顺序列表和当前下标，B 标签做跟上面相同的操作
      3. 当 A 标签在 mini 播放列表中删除某一首歌后，只同步顺序列表，当前下标设为-1表示不同步该数据；B 标签则按 (a.) 的规则同步自己的顺序列表和播放列表，如果 B 的当前歌曲仍在列表中，则继续设其为当前歌曲；否则重设为下标=0
      4. 当 A 标签清空了 mini 播放列表，只同步顺序列表，当前下标设为-1表示不同步该数据；B 标签则按 (c.) 相同的逻辑处理
3. 补充
   1. 当【其他】标签页修改了 localStorage 中的值，且新值与旧值不同才会触发 storage 事件 
4. 推荐歌单歌曲、歌手歌曲、排行榜歌曲通过组件 MusicList 选择点击某一歌曲会将列表中的歌曲进行顺序播放，执行 sequentialPlay action，点击随机播放则执行 randomPlay action；搜索歌曲点击某一首会执行 addSong action；mini 播放器的播放列表删除某一首歌会执行 removeSong action，清空列表会执行 clearSongList action

监听axios请求的话是通过注入js替换windows上的XHR对象，监听fetch是通过definepototype监听fetch实现

