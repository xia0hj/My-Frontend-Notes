# 未分类，可能有用的

## js

1. 通过 Object.defineProperty() 设定 getter 和 setter 时，不能直接返回或修改 obj.key 的值，否则在 getter 中访问又会继续触发 getter，造成无限递归
2. array.sort() 默认是按字符串升序排列；要按数字排列可写成 array.sort((a,b)=>a-b)
3. (a+b)/2 可能会得到小数不会取整，需要手动调用 Math.floor()
4. 尽量不要用数组的 fill() 方法去填充数组，array.fill([]) 这样会导致填充的每个 [] 都是同一个地址的子数组

## vue

1. vue2.0 不能使用最新版本的 sass-loader，要使用 npm i -D sass-loader@8.0.0

## dev

```shell
npm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/node
```

