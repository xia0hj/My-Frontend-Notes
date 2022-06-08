# 画页面练习

## 吸顶栏 + 吸底栏 + 中间滚动

1. 有一个吸顶的栏，内部的内容不需要实现
2. 一个吸底部的按钮栏，内部有四个按钮，按钮功能不需要做，只需要实现布局
3. 中间的列表可滚动
4. 多说一下，这个其实考察的是画页面的基本能力和细节，比如假如使用fixed布局，滚动条会是全屏的
5. 但是如果使用absolute，限制屏幕高度100%，中间局部滚动就可以把滚动条限制到中间部分，甚至可以隐藏滚动条
6. 面试考画页面的话，一定要多注意这类细节，还有比如BEM命名、1px边框等问题是否有意识，这些都要考虑

```html
<div class="top"></div>
<ul class="list"></ul>
<div class="bottom">
  <button class="btn">按钮1</button>
  <button class="btn">按钮2</button>
  <button class="btn">按钮3</button>
  <button class="btn">按钮4</button>
</div>

<script>
const list = document.getElementsByClassName('list')[0]
const li = document.createElement('li')
for(let i=0; i<100; i++){
  const child = li.cloneNode()
  child.innerText = `填充中间列表 i=${i}`
  list.appendChild(child)
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
.top {
  /* 注意看上面说明为什么不用 fixed */
  position: absolute;
  height: 50px;
  width: 100%;
  background-color: lightcoral;
}

.list {
  /* 设为 relative 使 top 属性生效，向下移 50px */
  position: relative;
  top: 50px;
  /* 注意减号两边必须要有空格，否则不生效 */
  height: calc(100% - 50px);
  overflow-y: scroll;
}
/* 只能通过伪元素选择器隐藏滚动条 */
.list::-webkit-scrollbar{
  display: none;
}

.bottom{
  /* 贴底部 */
  position:absolute;
  bottom: 0;
  /* 水平居中 */
  left: 50%;
  transform: translate(-50%,0);
  background-color: lightgreen;
  height: 50px;
  /* 布局里面的按钮 */
  display: flex;
  justify-content:space-between;
}
.bottom .btn {
  margin: 5px;
}
</style>
```

## 微信聊天窗口简易布局

```html
<div class="container">
  <div class="top">与 XXX 的聊天</div>
  <div class="chat-wrapper">
    <div class="chat-row row-left">
      <div class="head"></div>
      <div class="chat-content">喂，在吗？喂，在吗？喂，在吗？喂，在吗？喂，在吗？喂，在吗？喂，在吗？喂，在吗？喂，在吗？喂，在吗？喂，在吗？喂，在吗？喂，在吗？喂，在吗？喂，在吗？喂，在吗？喂，在吗？喂，在吗？喂，在吗？喂，在吗？</div>
    </div>
    <div class="chat-row row-right">
      <div class="head"></div>
      <div class="chat-content">不在</div>
    </div>
  </div>
  <div class="bottom">
    <input class="input"/>
    <button>发送</button>
  </div>
</div>

<style>
/* 容器 */
.container {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
}

/* 吸顶标题栏，文字居中 */
.top {
  height: 3rem;
  background-color: lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 吸底栏 */
.bottom {
  height: 3rem;
  background-color: lightblue;
  display: flex;
}
.bottom .input {
  margin: 0.4rem;
  flex-grow: 1;
}

/* 聊天内容容器 */
.chat-wrapper {
  background-color: lightcoral;
  flex-grow: 1;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
}
/* 隐藏滚动条 */
.chat-wrapper::-webkit-scrollbar{
  display: none;
}
/* 每条聊天数据 */
.chat-row {
  display: flex;
  margin: 2rem 0 2rem 0;
}
/* 对方说话，靠左 */
.row-left {
  flex-direction: row;
}
/* 自己说话，靠右 */
.row-right {
  flex-direction: row-reverse;
}
/* 头像 */
.head {
  width: 3rem;
  height: 3rem;
  background-color: lightgreen;
}
/* 聊天内容 */
.chat-content {
  max-width: 20rem;
  background-color: lightsteelblue;
}
</style>
```
