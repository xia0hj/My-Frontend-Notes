# 前端面试笔记

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
