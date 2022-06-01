# 画页面练习

## 吸顶栏 + 吸底栏 + 中间滚动

1. 有一个吸顶的栏，内部的内容不需要实现
2. 一个吸底部的按钮栏，内部有四个按钮，按钮功能不需要做，只需要实现布局
3. 中间的列表可滚动
4. 多说一下，这个其实考察的是画页面的基本能力和细节，比如假如使用fixed布局，滚动条会是全屏的
5. 但是如果使用absolute，限制屏幕高度100%，中间局部滚动就可以把滚动条限制到中间部分，甚至可以隐藏滚动条
6. 面试考画页面的话，一定要多注意这类细节，还有比如BEM命名、1px边框等问题是否有意识，这些都要考虑

```html
<div class="top"/>
<ul class="list"></ul>
<div class="bottom">
  <button class="btn">按钮1</button>
  <button class="btn">按钮2</button>
  <button class="btn">按钮3</button>
  <button class="btn">按钮4</button>
</div>

<style>
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