# Vue笔记

## Vue生命周期

1. 创建一个vue的实例对象，然后在这个对象上创建一些生命周期函数和默认的事件
2. 钩子函数beforeCreate( )：执行时组件实例还未创建，此时data和methods都还没初始化无法调用
3. 初始化实例相关属性：props, data, methods, computed, watch等
4. 钩子函数created( )：实例初始化完成，各种数据可以使用，常用于异步数据获取
5. 然后vue开始编译模板，渲染为内存中的DOM，但是还没挂载到页面中，此时还是旧的页面
6. 钩子函数beforeMount( )
7. 创建vm.$el并替换el，将内存中的DOM替换页面中真实的DOM
8. 钩子函数mounted( )：Vue实例完成创建阶段，进入运行阶段，最早能在mounted中操作页面中的DOM
9. 钩子函数beforeUpdate( )：一旦data发生改变，会执行该钩子，此时，data数据是最新的，但页面显示的数据未更新
10. 在内存中更新虚拟DOM，重新渲染到页面中
11. 钩子函数updated( )：此时页面和data数据同步都是最新的
12. 钩子函数beforeDestroy( )：当调用vm.$destroy( )函数时，在开始销毁实例前会执行该钩子函数
13. 清除子组件、事件监听器等
14. 钩子函数destroyed( )：组件完全销毁后执行该钩子函数

## v-for和v-if哪个优先级更高

1. 在vue2中v-for优先于v-if被解析，在vue3中v-if优先级高于v-for
2. 实践中也不应该把它们放一起，因为v-for优先的话，哪怕我们只渲染列表中一小部分元素，也得在每次重渲染的时候遍历整个列表。
3. 如果是为了过滤列表中的某些项目，可以定义计算属性，返回过滤后的列表让v-for使用
4. 如果是为了隐藏整个列表的话，可以把v-if放在v-for的容器元素上，例如ul, ol

## 为什么data是一个函数

对象为引用类型，当重用组件时，由于数据对象都指向同一个data对象，当在一个组件中修改data时，其他重用的组件中的data会同时被修改；而使用返回对象的函数，由于每次返回的都是一个新对象，引用地址不同，则不会出现这个问题。

## Vue响应式原理

1. 响应式指的是数据发生改变时，视图会重新渲染，匹配最新的值  
2. vue2实现响应式的原理是通过Object.defineProperty()为每一个data数据添加get和set方法来进行数据劫持，如果是数组则覆盖数组的7个变更方法实现变更通知，每个被拦截访问的属性都会有一个专属的依赖收集的数组;  
3. 当页面使用到某个属性时，会触发进行拦截的get()函数，将对应的watcher放到该属性的依赖收集数组中;  
4. 当数据发生改变时，会触发进行拦截的set()函数，会遍历依赖收集数据，通知watcher进行更新
5. vue2这样实现响应式存在一些问题：（1）初始化时需要遍历对象所有属性，如果对象层级较深，性能不好；（2）通知更新过程需要维护大量dep实例和watcher实例，额外占用内存较多；（3）动态新增、删除对象属性无法拦截，只能用特定set/delete api代替；（4）不支持Map、Set等数据结构
6. vue3中为了解决以上问题，使用原生的Proxy代替defineProperty，可以同时支持object和array，动态属性增、删都可以拦截，新增数据结构均支持，对象嵌套属性运行时递归，用到才代理，也不需要维护特别多的依赖关系，性能有提升

## Vue组件之间的通信方式

1. props: 父组件向下传递数据给子组件
2. \$emit & v-on: 子组件通过\$emit派发自定义事件，父组件通过v-on监听子组件的自定义事件
3. \$parent & \$children & \$root: 分别用于访问父组件、子组件、根父组件实例
4. ref: 访问子组件实例
5. \$attrs & \$listeners: 把父组件的属性以及作用在父组件上的监听器传递给子组件，父组件仅作中转作用，&lt;child v-bind="\$attrs" v-on="\$listeners" /&gt;
6. event bus: \$emit表示由当前组件派发事件，\$on表示监听当前组件派发的事件，可以创建一个无DOM的Vue组件并将实例绑定在原型上Vue.prototype.$EventBus=new Vue()，通过this.\$emit()和this.\$on()来实现跨组件通信，注意要在main.js中根节点mount之前将bus绑定到原型
7. vuex

## computed和watch的区别

1. computed 是计算一个新的属性，并将该属性挂载到 Vue 实例上，而 watch 是监听已经存在且已挂载到 Vue 实例上的数据，所以用 watch 同样可以监听 computed 计算属性的变化
2. computed本质是惰性求值的watch，只有当依赖属性变化后第一次访问 computed 才会计算新的值；而 watch 则是数据一旦发生变化就会执行回调函数
3. 从使用场景上说，computed 适用一个数据被多个数据影响，而 watch 适用一个数据影响多个数据

## v-model

1. v-model 是一个语法糖，会默认使用组件中名为 value 的 props 和 名为 input 的事件
2. vue3.0 默认使用名为 modelValue 的 props 和名为 update:modelValue 的事件

```html
对于原生元素
<input v-model="msg" /> 相当于
<input v-bind:value="msg" v-on:input="msg=$event.target.value" />
对于自定义 vue 组件
<my-component v-model="msg"/> 相当于
<my-component v-bind:value="msg" v-on:input="msg=argument[0]" />
```

## Vue 实现过渡动画

1. 使用 vue 的 transition 标签结合 css 样式实现
   1. v-enter：元素进入动画的初始样式
   2. v-enter-to：元素进入动画最后的样式，一般不去定义这个 class，因为一般来说进入动画的结果就是元素本来的样式
   3. v-enter-active：定义了元素从 v-enter 到 v-enter-to 过渡变化所需时间及变化方式等
   4. v-leave：元素离开动画的初始样式，一般不去定义这个 class，因为一般来说离开动画的初始样式就是元素本来的样式
   5. v-leave-to
   6. v-leave-active
   7. 在 transition 标签中可通过 name 属性替换过渡 css 类名前缀的 v
2. 使用 vue 的钩子函数实现动画，通过 v-on 监听 transition 标签的 before-enter，enter，after-enter，leave 事件

## vue Router 原理

1. 哈希模式
   1. \# 符号本来的作用是加在 url 后面表示网页中的当前位置，哈希值保存在 window.location.hash 中，可直接修改
   2. 改变哈希不会重新加载页面；每次改变哈希时会触发 hashchange 事件
2. history 模式：使用 HTML 提供的 pushState 和 replaceState 方法去修改历史记录，虽然当前 url 改变了，但浏览器不会去请求页面，这样就可以用来更新视图而不重新请求页面
3. 对比
   1. 哈希模式在 url 有个井号，而 history 模式没有，更美观
   2. pushState 可以设置与当前 url 同源的任意 url，而哈希模式只能修改井号后边的内容
   3. pushState 设置的新 url 与当前的相同时也会放入历史记录栈里面，而哈希模式只有新的和旧的不同才会放入栈中

## vue router 怎样配置 404 页面

在路由配置的最后设一个 * 号，路由是从上到下开始匹配的，星号表示全匹配，如果前面的路由都匹配不上，就用最后的这个星号兜底

```js
routes: [
   {path:'/a', compnent: a},
   {path:'/b', compnent: b},
   {
      path: '*',
      component: NotFound
   }
]
```

## $route 和 $router 的区别

1. \$router 用来操作路由，\$route 用来获取路由信息
2. \$route 是当前激活的路由信息对象，每个路由都有一个自己的 route 对象，包含了当前路由的路径、参数、名字等信息
3. \$router 可以看做是管理一组 route 的容器，包含了很多关键的属性，例如跳转方法、history 对象

## vue key 的作用

1. key 的作用主要是 为了实现高效的更新虚拟 DOM，提高性能。
2. 其原理是 vue 在 diff 的过程中通过 key 可以精准的判断两个节点是否是同一个，从而避免频繁的更新元素，使得整个 diff 过程更加高效，减少DOM操作量

## Vue 的 diff 算法

1. 新旧虚拟 DOM 对比更新，只会比较同一级节点，从首尾开始向中间进行比较
2. 对比流程，分为 5 种情况，按顺序作比较，比较时会通过 key 来判断节点是否相同：
   1. 比较旧开始节点和新开始节点，如果相同则旧开始指针和新开始指针都往后移
   2. 比较旧末尾节点和新末尾节点，如果相同则旧末尾指针和新末尾指针都往前移
   3. 比较旧开始和新末尾，如果相同，则将旧开始节点移动到旧末尾的后面，因为它匹配到的新位置是在旧末尾的后面
   4. 比较旧末尾和新开始，如果相同，则将旧末尾节点移动到旧开始的前面，因为它匹配到的新位置是在旧开始的前面
   5. 在旧节点列表中遍历寻找新开始节点，找到后将它移动到旧开始的前面；找不到则创建节点插入到旧开始的前面
3. 假如不设置 key，会认为都是同一个节点，会循环第一步比较旧开始和新开始
4. 假如对比结束后，旧开始和旧末尾指针之间还有节点，说明这些是被删除的节点，直接删掉
5. 假如对比结束后，新开始和新末尾指针之间还有节点，说明这些是新增的节点，将它们插入到旧开始节点的前面

## vue scoped 原理

给组件的 DOM 都加了用于确保唯一性的属性 data-v-加上 8 位随机数，然后给对应的 CSS 的选择器加上属性选择器，这样来实现样式隔离

## 实践容易忘记的地方

1. chrome source标签中不显示src，解决：ctrl+P，然后输入?，选择Run Command，搜索source map相关命令，开启
2. 源码入口文件：src/platform/runtime/index.js -> src/core/index.js -> src/core/instance/index.js
3. v-bind:class="{ classA: shouldClassAShow, classB: shouldClassBShow }" 由两个变量分别控制 classA 和 classB 是否生效

## vm属性

### Vue.prototype

1. Vue.prototype._render(): 调用vm.$options.render()得到VNode并返回

### 实例vm

1. vm._VNode: 旧的VNode
2. vm.$options: new Vue()对象的各个属性，例如data, props等
  