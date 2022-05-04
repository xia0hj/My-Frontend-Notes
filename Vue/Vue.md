# Vue笔记

## 实践
1. chrome source标签中不显示src，解决：ctrl+P，然后输入?，选择Run Command，搜索source map相关命令，开启
2. 源码入口文件：src/platform/runtime/index.js -> src/core/index.js -> src/core/instance/index.js

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

## key的作用
1. key的作用主要是为了更高效的更新虚拟DOM
2. vue在更新过程中判断两个节点是否相同时，key是其中一个判断条件，

## 为什么data是一个函数

对象为引用类型，当重用组件时，由于数据对象都指向同一个data对象，当在一个组件中修改data时，其他重用的组件中的data会同时被修改；而使用返回对象的函数，由于每次返回的都是一个新对象，引用地址不同，则不会出现这个问题。

## Vue响应式原理

响应式指的是数据发生改变时，视图会重新渲染，匹配最新的值  
原理是通过Object.defineProperty()为每一个data数据添加get和set方法来进行数据劫持，每个属性都会有一个专属的依赖收集的数组;  
当页面使用到某个属性时，会触发Object.defineProperty()添加的get()函数，将对应的watcher放到该属性的依赖收集数组中;  
当数据发生改变时，会触发Object.defineProperty()添加的set()函数，会遍历依赖收集数据，通知watcher进行更新

## Vue3响应式原理(未完成)

Vue3.0改用Proxy API代替Object.defineProperty  
1. defineProperty的监听是针对某一个属性的，vue2中的实现需要递归遍历所有属性，给它们全加上getter和setter；而Proxy API的监听是针对一个对象的，能够监听对该对象
  