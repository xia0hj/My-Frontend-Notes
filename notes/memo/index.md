# 备忘录

## js

1. 通过 Object.defineProperty() 设定 getter 和 setter 时，不能直接返回或修改 obj.key 的值，否则在 getter 中访问又会继续触发 getter，造成无限递归
2. array.sort() 默认是按字符串升序排列；要按数字排列可写成 array.sort((a,b)=>a-b)
3. (a+b)/2 可能会得到小数不会取整，需要手动调用 Math.floor()
4. 尽量不要用数组的 fill() 方法去填充数组，array.fill([]) 这样会导致填充的每个 [] 都是同一个地址的子数组

## vue

1. vue2.0 不能使用最新版本的 sass-loader，要使用 npm i -D sass-loader@8.0.0
2. vue 源码入口文件：src/platform/runtime/index.js -> src/core/index.js -> src/core/instance/index.js
3. v-bind:class="{ classA: shouldClassAShow, classB: shouldClassBShow }" 由两个变量分别控制 classA 和 classB 是否生效

## Vue.prototype

1. Vue.prototype._render(): 调用vm.$options.render()得到VNode并返回

## vm 实例属性

1. vm._VNode: 旧的VNode
2. vm.$options: new Vue()对象的各个属性，例如data, props等

## 调试 && 工具

1. chrome source标签中不显示src，解决：ctrl+P，然后输入?，选择Run Command，搜索source map相关命令，开启

## 约定式提交

1. feat: 新功能
2. fix: 修补bug
3. docs: 文档的变更
4. style: 格式(不影响代码运行的变动)
5. refactor: 重构(即不是新增功能，也不是修改bug的代码变动)
6. perf: 用于性能改进的代码提交
7. test: 用于添加或修改现有测试
8. build: 修改影响到了系统的构建或外部依赖
9. ci: 修改CI配置文件或相关的脚本
10. revert: 用于撤销以前的commit
11. chore: 其他一些不影响源码或测试文件的代码变动
