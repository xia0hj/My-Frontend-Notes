# CSS笔记

## 标准盒子模型和 IE 盒

1. 盒子模型都是由 margin，border，padding，content 组成。
2. 标准盒模型与 IE 盒模型的区别是，在设置宽度和高度时所对应的范围不同，标准盒模型的宽度高度只包含 content，而 IE 盒模型包含 border，padding，content，不包括 margin。
3. 一般来说，我们可以通过修改元素的 box-sizing 属性来改变元素的盒模型。

## 11个CSS选择器

1. id选择器（#id）
2. 类选择器（.class）
3. 标签选择器（div, h1, p）
4. 后代选择器（div p）
5. 子元素选择器（div>p）：必须是div的直接子元素，不能相隔
6. 兄弟选择器（li~a）：li和a属于相同父元素，选择在li之后的所有a，不需要紧邻li
7. 相邻兄弟选择器（li+a）：li和a属于相同父元素，选择在li之后紧接的第一个a
8. 属性选择器（a[src]）：选择带有src属性的a元素，可指定src的值
9. 伪类选择器（a:hover）：匹配元素的一些特殊状态
10. 伪元素选择器（a::before）：匹配特殊的位置，在该位置添加一个a的子元素
11. 通配符选择器（*）：所有元素

## BFC

1. BFC指的是块级格式化上下文，一个元素形成了BFC之后，那么它内部元素产生的布局不会影响到外部元素，外部元素的布局也不会影响到BFC中的内部元素。一个BFC就像是一个隔离区域，和其他区域互不影响。BFC元素不会被外部浮动元素相关
2. 一般来说根元素是一个BFC区域，浮动、绝对定位、display属性为inline-block或flex、overflow属性不为visiable时都会形成BFC

## 清除浮动

1. 父元素没有设置高度，而子元素设为浮动脱离了文档流，没法撑开父元素的高度，导致父元素高度变为0，发生高度坍塌
2. clear属性不允许左侧或右侧出现浮动元素，否则就移动下一行
3. 一般通过伪元素方式清除浮动，为父元素添加样式，在子元素的最后添加一个不能与浮动元素同一行的元素，用于撑开父元素高度

```css
/* after在子元素的最后添加一个伪元素 */
.parent::after { 
  content: ''; /* 必需 */
  display: block; /* 伪元素默认是行内元素，clear只生效于块级元素 */
  clear: both;
}
```

## margin重叠

1. 垂直方向上两个相邻元素的 margin 发生重叠
2. 第一种情况：相邻兄弟元素的 margin 重叠，可以只设置一个想要的外边距，也可以将其中一个元素放入BFC，多加一层 div 并设新的 div 为 overflow:auto，但这样会改变结构
3. 第二种情况：父元素和子元素的 margin-top 重叠，可以让父元素形成BFC，也可以为父元素设置 padding-top、border-top 来将它们分隔开
4. 第三种情况：高度为 auto 的父元素与子元素的 margin-bottom 重叠，可以激活父元素的BFC，也可以为父元素设置 padding-bottom、border-bottom 来将它们分隔开
5. 第四种情况：没有内容的元素，自身的 margin-top 和 margin-bottom 重叠，可以给它设置 border、padding-top、padding-bottom 或者 height 来解决

## 如何让一个div居中

```scss
/* 第一种方法 */
/* 给div设置一个宽度，并加上margin: 0 auto */
.div1 {
  width: 100px;
  margin: 0 top;
}

/* 第二种方法 */
/* 容器元素text-align:center */
.container {
  text-align: center;
}
/* 居中元素要转为行内元素 */
.div2 {
  display: inline-block;
}

/* 第三种方法 */
/* 绝对定位，上下左右间距为0占满屏幕，margin:auto自动调整外边距实现居中 */
.div3{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}

/* 第四种方法 */
/* 绝对定位，top=left=50%使div左上角与视图中心重合，然后微调div位置使其与视图中心重合 */
.div4 {
  width: $w;
  height: $h;
  position: absolute;
  left: 50%;
  top: 50%;
  /* left和top将div左上角移至视图中心 */

  /* 已知容器宽高，通过margin设为负值让div往左上方移动，使div中心和视图中心重合 */
  margin-left: -0.5 * $w;
  margin-top: -0.5 * $h;

  /* 未知容器宽高，可以通过translate来让div往左上方移动 */
  transform: translate(-50%, -50%)
}

/* 第五种方法 */
/* flex布局 */
.container {
  display: flex;
  align-items: center; // 垂直居中
  justify-content: center; // 水平居中
}
```

## 圣杯布局和双飞翼布局

1. 圣杯布局步骤
   1. 为容器和左中右分别设置统一高度和左右固定宽度，中宽度 100%，若容器不设高度会因为子元素全部浮动导致高度坍塌
   2. 左中右全部 float:left，此时中间独占一行，左右被挤到下一行
   3. 通过margin-left移动左和右，分别贴着中间部分的左边缘和右边缘；此时左右会遮挡中间内容
   4. 为左和右设置相对定位，并分别通过left和right设负值，使其不与中间部分相交
   5. 由于中间100%宽度将左右挤到视图外，为容器设置内边距压缩中间部分，为左右腾出位置

2. 双飞翼布局步骤
   1. 同圣杯布局前3步，使left和right与center同一行，此时left和right会遮挡center部分内容
   2. 为center设置子元素，并设置margin让子元素不被左右遮挡

3. 对比：
   1. 都是实现三列布局，两边固定中间自适应
   2. 都是主列dom放在最前面，让它优先加载
   3. 都是让三列浮动，然后通过负外边距形成三列布局
   4. 不同之处在于如何处理中间主列：圣杯布局是利用父容器的内边距 + 左右两列相对定位；双飞翼布局是把主列内容放在主列子元素中，利用这个子元素的外边距进行调整
   5. 圣杯布局缺点：center部分的最小宽度不能小于left部分的宽度，否则会left部分掉到下一行
   6. 双飞翼布局缺点：多加了一层dom节点，增加了渲染的计算量

```scss
$h: 500px; //  统一高度
$lw: 100px; // 左固定宽度
$rw: 200px; // 右固定宽度

.container{
  height: $h; // （1）设定高度
  padding-left: $lw; // （5）通过设置内边距压缩center宽度，为left腾出空间
  padding-right: $rw; // （5）通过设置内边距压缩center宽度，为right腾出空间
}
.left{
  height: $h; // （1）设定高度
  width: $lw; // （1）设定左固定宽度
  float: left; // （2）左中右全部向左浮动
  margin-left: -100%; // （3）center宽度100%，使left的左边缘与center的左边缘重合
  position: relative; // （4）相对定位left属性才会生效
  left: (-$lw); // （4）left设负值向左移动，使left的右边缘与center左边缘重合
}
.right{
  height: $h; // （1）设定高度
  width: $rw; // （1）设定右固定宽度
  float: left; // （2）左中右全部向左浮动
  margin-left: (-$rw); // （3）向左移动right的宽度，使right的右边缘与center的右边缘重合
  position: relative; // （4）相对定位right属性才会生效
  right: (-$rw); // （4）right设负值向右移动，使right的左边缘与center的右边缘重合
}
.center{
  height: $h; // （1）设定高度
  width: 100%; // （1）center自适应宽度
  float: left; // （2）左中右全部向左浮动
}
// 如果使用双飞翼布局，需要为center添加一个子元素，且不执行（4）（5）这两步
.center .inner{
  margin-left: $lw;
  margin-right: $rw;
}
```

## flex弹性布局

1. flex是CSS3新增的布局方式，将一个元素的display属性设为flex从而使它成为flex布局容器
2. 容器有两条轴，一个是水平的主轴，一个与主轴垂直的交叉轴，可通过 flex-direction 属性指定主轴的方向
3. justify-content 可指定元素在主轴上的排列方式；align-items 可指定元素在交叉轴上的排列方式；flex-wrap 规定换行方式
4. 可通过 flex-grow、flex-shrink 来指定当排列空间有剩余时，元素的放大缩小比例

## position 属性

1. static：默认值，未定位
2. absolute：相对于最近的非 static 父元素定位，如果没有则相对于 body 定位，受滚动影响
3. fixed：相对于视图定位，不受滚动影响
4. relative：相对于元素自身的原位置定位

## 常用属性

```scss
// 外边距的上下为0，左右自适应延伸，使内容居中
margin: 0 top;

// 脱离文档流，相对于视窗来定位，与滚动无关
position: fixed;

// position默认值static
// 相对于最近的非static的祖先元素定位，如果没有则相对于body定义
position: absolute;

// 一般用于将元素变为BFC，BFC不会与浮动元素相交；加上zoom:1;兼容IE
overflow: hidden;
zoom: 1;

// flex布局的子元素根据剩余空间自动放大缩小
flex: 1;
```
