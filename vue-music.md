# vue-music项目

## 特性

1. 歌手列表：
    1. 按首字母分类歌手，有一个title显示首字母，并且页面顶部是固定的当前分类标题；当下一组标题接触到当前组标题时，将其往上顶；
    2. 当进入歌手列表页时计算每一分组的高度，并且在发生滚动时记录当前视图顶部离整个列表顶部的距离，计算下一分组的顶部高度和当前视图高度，实现将当前组标题往上顶
    3. v-bind:data-xxxx可将数据保存至DOM的dataset中
    4. 右侧快捷栏，触摸移动时记录y轴位移，计算移动了哪个分组中

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
      "id":, // 列表key
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

/api/getSingerDetail
获取某个歌手的歌曲列表，参数mid
{
  "code": 0,
  "result": {
    "songs": [{ // 歌曲数组
      "id":,
      "mid":, // 歌曲mid，用于获取url
      "name":, // 歌名
      "album":, // 歌曲所属专辑名
      "duration":, // 歌曲时长，单位秒
      "singer":, // 歌手名
      "pic":, // 专辑图片链接
      "url":, // 歌曲播放链接，暂时为空
    }]
  }
}

/api/getSongsUrl
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