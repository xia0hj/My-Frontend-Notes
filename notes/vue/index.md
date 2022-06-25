# Vue笔记

## vue 和 react 的区别

1. 相同点
   1. 

## MVC 和 MVVM

1. 是常见的软件架构设计模式，主要通过分离关注点的方式来组织代码结构，优化我们的开发效率。
2. 比如说开发一个单页应用时，往往一个路由页面对应了一个脚本文件，所有的页面逻辑都在一个脚本文件里。页面的渲染、数据的获取，对用户事件的响应所有的应用逻辑都混合在一起，这样在开发简单项目时，可能看不出什么问题，当时一旦项目变得复杂，那么整个文件就会变得冗长，混乱，这样对我们的项目开发和后期的项目维护是非常不利的。
3. MVC 通过分离 Model、View 和 Controller 的方式来组织代码结构。其中 View 负责页面的显示逻辑，Model 负责存储页面的业务数据，以及对相应数据的操作。并且 View 和 Model 应用了观察者模式，当 Model 层发生改变的时候它会通知有关 View 层更新页面。Controller 层是 View 层和 Model 层的纽带，它主要负责用户与应用的响应操作，当用户与页面产生交互的时候，Controller 中的事件触发器就开始工作了，通过调用 Model 层，来完成对 Model 的修改，然后 Model 层再去通知 View 层更新。
4. MVP 模式与 MVC 唯一不同的在于 Presenter 和 Controller。在 MVC 模式中我们使用观察者模式，来实现当 Model 层数据发生变化的时候，通知 View 层的更新。这样 View 层和 Model 层耦合在一起，当项目逻辑变得复杂的时候，可能会造成代码的混乱，并且可能会对代码的复用性造成一些问题。MVP 的模式通过使用 Presenter 来实现对 View 层和 Model 层的解耦。MVC 中的 Controller 只知道 Model 的接口，因此它没有办法控制 View 层的更新，MVP 模式中，View 层的接口暴露给了 Presenter 因此我们可以在 Presenter 中将 Model 的变化和 View 的变化绑定在一起，以此来实现 View 和 Model 的同步更新。这样就实现了对 View 和 Model 的解耦，Presenter 还包含了其他的响应逻辑。
5. MVVM 模式中的 VM，指的是 ViewModel，它和 MVP 的思想其实是相同的，不过它通过双向的数据绑定，将 View 和 Model 的同步更新给自动化了。当 Model 发生变化的时候，ViewModel 就会自动更新；ViewModel 变化了，View 也会更新。这样就将 Presenter 中的工作给自动化了。我了解过一点双向数据绑定的原理，比如 vue 是通过使用数据劫持和发布订阅者模式来实现的这一功能。

## 为什么要用虚拟 DOM

dom 操作的会导致浏览器的重绘重排，性能开销比较大。当我们在一个方法中出现了多次数据变化时，每次都要操作 dom 很浪费性能。有了虚拟 dom 后，把多次的数据变化先映射到虚拟 dom 中，最后进行一次挂载，相当于只操作了一次真实 dom，有效的降低了性能开销。

## Vue 生命周期

1. 创建一个 vue 的实例对象，然后在这个对象上创建一些生命周期函数和默认的事件
2. 钩子函数 beforeCreate( )：执行时组件实例还未创建，此时 data 和 methods 都还没初始化无法调用
3. 初始化实例相关属性：props, data, methods, computed, watch等
4. 钩子函数 created( )：实例初始化完成，各种数据可以使用，常用于异步数据获取
5. 然后 vue 开始编译模板，渲染为内存中的 DOM，但是还没挂载到页面中，此时还是旧的页面
6. 钩子函数 beforeMount( )
7. 创建 vm.$el 并替换 el，将内存中的 DOM 替换页面中真实的 DOM
8. 钩子函数 mounted( )：Vue 实例完成创建阶段，进入运行阶段，最早能在 mounted 中操作页面中的 DOM
9. 钩子函数 beforeUpdate( )：一旦 data 发生改变，会执行该钩子，此时，data 数据是最新的，但页面显示的数据未更新
10. 在内存中更新虚拟 DOM，重新渲染到页面中
11. 钩子函数 updated( )：此时页面和 data 数据同步都是最新的
12. 钩子函数 beforeDestroy( )：当调用 vm.$destroy( ) 函数时，在开始销毁实例前会执行该钩子函数
13. 清除子组件、事件监听器等
14. 钩子函数 destroyed( )：组件完全销毁后执行该钩子函数

## v-for 和 v-if 哪个优先级更高

1. 在 vue2 中 v-for 优先于 v-if 被解析，在 vue3 中 v-if 优先级高于 v-for
2. 实践中也不应该把它们放一起，因为v-for优先的话，哪怕我们只渲染列表中一小部分元素，也得在每次重渲染的时候遍历整个列表。
3. 如果是为了过滤列表中的某些项目，可以定义计算属性，返回过滤后的列表让 v-for 使用
4. 如果是为了隐藏整个列表的话，可以把 v-if 放在 v-for 的容器元素上，例如 ul, ol

## vue 属性重名时的优先级

props ==> methods ==> data ==> computed ==> watch

## 为什么 data 是一个函数

对象为引用类型，当重用组件时，由于数据对象都指向同一个 data 对象，当在一个组件中修改 data 时，其他重用的组件中的 data 会同时被修改；而使用返回对象的函数，由于每次返回的都是一个新对象，引用地址不同，则不会出现这个问题。

## Vue 响应式原理

1. 响应式指的是数据发生改变时，视图会重新渲染，匹配最新的值  
2. vue2 实现响应式的原理是通过 Object.defineProperty() 为每一个 data 数据添加 get 和 set 方法来进行数据劫持，如果是数组则覆盖数组的 7 个变更方法实现变更通知，每个被拦截访问的属性都会有一个专属的依赖收集的数组;  
3. 当页面使用到某个属性时，会触发进行拦截的 get()函数，将对应的 watcher 放到该属性的依赖收集数组中;  
4. 当数据发生改变时，会触发进行拦截的 set() 函数，会遍历依赖收集数据，通知 watcher 进行更新
5. vue2 这样实现响应式存在一些问题：（1）初始化时需要遍历对象所有属性，如果对象层级较深，性能不好；（2）通知更新过程需要维护大量 dep 实例和 watcher 实例，额外占用内存较多；（3）动态新增、删除对象属性无法拦截，只能用特定 set/delete api代替；（4）不支持 Map、Set 等数据结构
6. vue3 中为了解决以上问题，使用原生的 Proxy 代替 defineProperty，可以同时支持 object 和 array，动态属性增、删都可以拦截，新增数据结构均支持，对象嵌套属性运行时递归，用到才代理，也不需要维护特别多的依赖关系，性能有提升

## vue 响应式数组

1. vue 拦截了 Array.prototype 上的 7 个方法：push、pop、shift、unshift、splice、sort、reverse
2. 通过下标去修改数组是没有被监听的，能修改数据但不会自动更新视图，我在 github 上的 issue 里面看到作者的回复，是因为性能问题所以没有监听下标修改操作，相关链接：[为什么vue没有提供对数组属性的监听 #8562](https://github.com/vuejs/vue/issues/8562)
3. 可以通过 vue 提供的 this.$set() 方法为对象或数组新增属性并监听

## Vue 组件之间的通信方式

1. props: 父组件向下传递数据给子组件
2. \$emit & v-on: 子组件通过 \$emit 派发自定义事件，父组件通过 v-on 监听子组件的自定义事件
3. \$parent & \$children & \$root: 分别用于访问父组件、子组件、根父组件实例
4. ref: 访问子组件实例
5. \$attrs & \$listeners: 把父组件的属性以及作用在父组件上的监听器传递给子组件，父组件仅作中转作用，&lt;child v-bind="\$attrs" v-on="\$listeners" /&gt;
6. event bus: \$emit 表示由当前组件派发事件，\$on 表示监听当前组件派发的事件，可以创建一个无 DOM 的 Vue 组件并将实例绑定在原型上 Vue.prototype.$EventBus=new Vue()，通过 this.\$emit() 和 this.\$on() 来实现跨组件通信，注意要在 main.js中 根节点 mount 之前将 bus 绑定到原型
7. vuex

## computed 和 watch 的区别

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

## Vue Router 原理

1. 哈希模式
   1. \# 符号本来的作用是加在 url 后面表示网页中的当前位置，哈希值保存在 window.location.hash 中，可直接修改
   2. 改变哈希不会重新加载页面；每次改变哈希时会触发 hashchange 事件
2. history 模式：使用 HTML 提供的 pushState 和 replaceState 方法去修改历史记录，虽然当前 url 改变了，但浏览器不会去请求页面，这样就可以用来更新视图而不重新请求页面
3. 对比
   1. 哈希模式在 url 有个井号，而 history 模式没有，更美观
   2. pushState 可以设置与当前 url 同源的任意 url，而哈希模式只能修改井号后边的内容
   3. pushState 设置的新 url 与当前的相同时也会放入历史记录栈里面，而哈希模式只有新的和旧的不同才会放入栈中

## Vue Router 怎样配置 404 页面

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

## $nextTick 的作用

vue 响应式地改变一个值以后，此时的 dom 并不会立即更新，如果需要在数据改变以后立即通过 dom 做一些操作，可以使用 $nextTick 获得更新后的 dom。

## Vue key 的作用

1. key 的作用主要是 为了实现高效的更新虚拟 DOM，提高性能。
2. 其原理是 vue 在 diff 的过程中通过 key 可以精准的判断两个节点是否是同一个，从而避免频繁的更新元素，使得整个 diff 过程更加高效，减少DOM操作量

## 用 index 作为 key 的影响

index 是有可能会变化的，diff 算法用 key 来断判是否同一节点，这就要求 key 是唯一不变的

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

## Vue scoped 原理

给组件的 DOM 都加了用于确保唯一性的属性 data-v-加上 8 位随机数，然后给对应的 CSS 的选择器加上属性选择器，这样来实现样式隔离

## vue 渲染模板时如何保留 HTML 注释

```vue
<template comments>
   ...
</template>
```

## vue 自定义指令

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

## vuex 中的 mutation 和 action 的区别

1. mutation：通过 commit() 方法触发，可以直接修改 state，但只能是同步操作
2. action：通过 dispatch() 方法触发，支持异步操作，可以在 action 中提交 mutation 去修改 state

## vue3 组合式 API 的作用

vue3 新增的一组 api，它是基于函数的 api，可以更灵活的组织组件的逻辑。
解决options api在大型项目中，options api不好拆分和重用的问题。