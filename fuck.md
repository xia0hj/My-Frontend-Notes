# 踩坑

## js

1. 通过 Object.defineProperty() 设定 getter 和 setter 时，不能直接返回或修改 obj.key 的值，否则在 getter 中访问又会继续触发 getter，造成无限递归
2. array.sort() 默认是按字符串升序排列；要按数字排列可写成 array.sort((a,b)=>a-b)

## vue

1. vue2.0 不能使用最新版本的 sass-loader，要使用 npm i -D sass-loader@8.0.0