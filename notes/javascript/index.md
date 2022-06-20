## JS 的数据类型

1. 基本数据类型有 String、Number、Boolean、Undefined、Null，还有 es6 新增的 Symbol，es10 新增了 BigInt；引用类型有对象、数组、函数 3 种。
2. 区别是存储位置不同：
   1. 基本数据类型直接存储在栈中的简单数据段，占据空间小，属于频繁使用的数据，所以保存在栈中。
   2. 引用类型因为占据空间大，而且大小不固定，所以是保存在堆中。
   3. 引用类型在栈中存储了指针，指向它在堆中的地址。

## undefined 和 null 的区别

1. undefined 表示未定义，变量声明后但没有赋值就是 undefined；null 表示空对象，一般是赋值给对象作为初始值。
2. 用 typeof 判断，null = 'object'，undefined = 'undefined'。
3. 转换成 Number 类型，null = 0，undefined = NaN。
4. null 是保留的关键字，而 undefined 不是。

## == 和 === 的区别

1. == 比较基本类型，如果类型不同，会先强制转换后再比较。
2. === 比较基本类型，先比较类型再比较值，如果类型不同就返回 false，不进行转换。
3. 在比较引用类型时，== 和 === 都是比较地址。

## use strict 严格模式

1. use strict 指的是严格运行模式，在这种模式对 js 的使用添加了一些限制，目的是消除代码中一些不合理的使用方式。
2. 严格模式的限制：
   1. 不允许使用未声明的变量；
   2. 不允许用 delete 关键字删除变量；
   3. 不允许变量重名；
   4. 禁止 this 关键字指向全局对象；
   5. ...

## window.isNaN() 和 Number.isNaN() 的区别

1. window.isNaN() 会尝试去将参数的类型转换成数字，如果不能被转换成数字都返回 true。
2. Number.isNaN() 会先判断参数的类型是不是 Number，如果不是 Number 都返回 false。

## 其他数据类型转换成 false

1. undefined
2. null
3. 0
4. NaN
5. ""
6. 其余都转换成 true

## new 操作符做了什么及其代码实现

1. 首先创建一个空对象，并将空对象的原型设为构造函数的 prototype。
2. 让构造函数的 this 指向这个新对象，然后执行。
3. 如果构造函数返回的是引用类型，就直接将它返回；否则返回新对象。

```js
function newOperation(constructor, ...args){
   if(typeof constructor !== 'function'){
      throw new TypeError('constructor is not a function')
   }
   const obj = Object.create(constructor.prototype) // obj.__proto__ = constructor.prototype
   const fnReturn = constructor.apply(obj, args)
   if(typeof fnReturn === 'object' || typeof fnReturn === 'function'){
      return fnReturn
   }else{
      return obj
   }
}
// 自测
function fn(msg){this.msg=msg}
const a = new fn('aaa')
const b = newOperation(fn, 'bbb')
```

## arguments对象和剩余参数 ...args 的区别

1. arguments 对象包含所有参数，剩余参数只能放在最后且只包含没有对应形参的参数
2. arguments 对象不是数组，不能直接使用数组的方法，需要这样才能用数组的方法 `Array.prototype.push.call(arguments, newVal)`
3. 剩余参数是真正的数组

## 作用域和变量提升

1. 全局变量：全局作用域声明的变量和方法都属于window对象的属性，浏览器关闭时才会销毁
2. 作用域链：当在函数作用域操作一个变量时，它会先在自身作用域中寻找，如果有就直接使用（就近原则）。如果没有则向上一级作用域中寻找，直到找到全局作用域；如果全局作用域中依然没有找到，则会报错 ReferenceError。
3. 变量提升：var声明的变量会在所有代码执行之前被声明，但不会赋值；let声明也会提前，但初始化过程不会，在初始化之前使用变量，就会形成一个暂时性死区，所以在let声明后初始化前访问变量会报错。

## var, let, const区别

1. var变量不支持块作用域，而let变量支持。
2. 变量提升：var声明的变量会在所有代码执行之前被声明，但不会赋值；let声明也会提前，但初始化过程不会，在初始化之前使用变量，就会形成一个暂时性死区，所以在let声明前访问变量会报错。
3. const常量支持块作用域且声明同时必须赋值，此后不能修改；const对象不能修改引用地址，但可以修改对象中的值。

## 函数的call，apply，bind方法区别

1. 它们都是用来重定义this对象的
2. call和apply都会执行该函数并将this指向第一个参数的对象，区别是apply的第二个参数开始要放到一个数组中，而call的参数直接用逗号分隔
3. bind的参数跟call一样用逗号分隔，但它返回的是调整了this指向的函数，并没有执行

## 原型、原型链

1. 每个构造函数内部都有一个 prototype 属性值，它是一个对象，包含了一些共享的属性和方法，由构造函数创建的对象都会共享这些属性
2. 使用构造函数创建的对象，内部有 \_\_proto\_\_ 指针指向构造函数的 prototype 来让我们访问原型，也可以使用 Object.getPrototypeOf() 方法来获取原型
3. 当我们访问一个对象的属性时，如果对象内部不存在这个属性，就会到它的原型对象上去寻找属性，原型对象又会有自己的原型，这样一直找下去就是原型链。
4. 原型链的尽头一般是 Object.prototype，这也是我们新建的对象能够使用 toString 等常用方法的原因

## 闭包

1. 闭包是指有权访问另一个函数作用域中的变量的函数，创建闭包的常见方式是在函数中创建另一个函数，通过这个函数访问到当前函数中的局部变量
2. 用途一：能在外部通过闭包函数去访问函数内部的变量，可以用这种方法来创建私有变量
3. 用途二：使已经运行结束的函数上下文中的变量继续保留在内存中，因为闭包函数保留了对这个变量的引用，所以不会被回收

## 函数柯里化

1. 将使用多个参数的函数转换成一系列只有一个参数的函数
2. 在多次调用一个函数，并且大部分参数相同的情况下使用

```js
function curry(fn, savedArgs = []) {
  return function () {
    // 获取先前已保存的参数数组
    const curArgs = savedArgs.slice(0)
    // 将当前参数放入数组
    for (let i = 0; i < arguments.length; i++) {
      curArgs.push(arguments[i])
    }
    // 如果参数已足够，则执行函数
    if (curArgs.length >= fn.length) {
      return fn.apply(this, curArgs)
    } else {
      // 参数不足，则将当前参数继续保存
      return curry.call(this, fn, curArgs)
    }
  }
}
const output = (v1, v2, v3)=>{console.log(`${v1},${v2},${v3}`)}
const curryFn = curry(output)
curryFn(1)(2)(3)
```

## 数组扁平化

```js
function flattenArray(array) {
  if (!Array.isArray(array)) return
  const result = array.reduce(function (total, cur) {
    if (Array.isArray(cur)) {
      return total.concat(flattenArray(cur))
    } else {
      return total.concat(cur)
    }
  }, [])
  return result ? result : []
}
```

## V8引擎垃圾回收

1. v8的垃圾回收是分代回收的，将对象分为新生代和老年代，存放于不同的空间
2. 在新生代空间中被划分为From和To两个区域，To空间一般是闲置的，当From空间满了就会执行垃圾回收
3. 进行回收时首先会检查From空间中的存活对象，存活对象判断满足晋升到老年代的条件，满足条件的对象会复制到老年代空间中，不满足条件的对象则复制到To空间；然后From和To空间交换，原来的To空间变为From空间
4. 晋升为老年代有两个条件：当对象从From空间复制到To空间时，假如该对象已经经历过一次回收，并且此时To空间使用已经超过了25%，那么就会将该对象晋升为老年代
5. 晋升条件设置为To空间25%的原因是，回收结束后两个空间会交换，如果To空间剩余内存太小，变为From会影响后续内存分配
6. 老年代的存活对象多且存活时间长，不适合使用新生代的那种回收方法，老年年用的是标记清除法和标记压缩法
7. 标记清除法会先标记存活的对象，然后清除掉没标记的对象，由于标记清除后会造成很多的内存碎片，不便于后面的内存分配。所以了解决内存碎片的问题引入了标记压缩法。
8. 标记压缩法也是先标记，然后将存活对象都挪到一边，最后清理边界外的内存
9. 由于标记压缩法需要移动对象，执行速度比标记清除要慢，所以V8主要使用标记清除法，当内存空间不足时采用标记压缩法

## 内存泄漏的情况

1. 第一种情况是我们由于使用未声明的变量，而意外的创建了一个全局变量，而使这个变量一直留在内存中无法被回收。
2. 第二种情况是我们设置了 setInterval 定时器，而忘记取消它，如果循环函数有对外部变量的引用的话，那么这个变量会被一直留
在内存中，而无法被回收。
3. 第三种情况是我们获取一个 DOM 元素的引用，而后面这个元素被删除，由于我们一直保留了对这个元素的引用，所以它也无法被回
收。
4. 第四种情况是不合理的使用闭包，从而导致某些变量一直被留在内存当中。

## 函数节流和防抖

1. 函数节流：在规定的单位时间内，只能有一次触发事件的回调函数执行，如果事件被触发多次，只有一次能生效
2. 函数防抖：在事件触发 n 秒之后执行回调函数，如果在 n 秒之内再次触发事件，则重新计时

```js
// 防抖
function debounce(fn, delay){
  let timeoutId = 0
  return function wrappedFn (){
    if(timeoutId > 0){
      clearTimeout(timeoutId)
      timeoutId = 0
    }
    const self = this
    const args = arguments
    timeoutId = setTimeout(()=>{
      // 注意要取的是 wrappedFn 的 this 和参数
      fn.apply(self, args)
    }, delay)
  }
}
// 节流
function throttle (fn, interval) {
  let timeoutId = 0
  let lastRun = 0
  return function wrappedFn () {
    if (timeoutId > 0) {
      return
    }
    const self = this
    const args = arguments
    const pastTimeSinceLastRun = Date.now() - lastRun
    function runFn () {
      lastRun = Date.now()
      timeoutId = 0
      // 注意要取的是 wrappedFn 的 this 和参数
      fn.apply(self, args)
    }
    if (pastTimeSinceLastRun >= interval) {
      runFn()
    } else {
      timeoutId = window.setTimeout(runFn, interval)
    }
  }
}

const say = (str) => {console.log('I say: ', str)}
 
const debounceSay = debounce(say, 3000)
const throttleSay = throttle(say, 3000)
// <button onclick="throttleSay('节流')">节流按钮</button>
// <button onclick="debounceSay('防抖')">防抖按钮</button>
```

## 图片懒加载的实现

1. 先将图片的 src 设为默认的图片，判断图片如果出现在视图中才将 src 设为原本的图片
2. 判断图片是否在视图中的两种方法：
   1. 监听图片的第一个可滚动父元素和 window 对象的滚动相关事件（scroll、resize、touchmove 等），回调函数中通过 getBoundingClientRect() 方法获取元素离视图的顶部和左侧的距离，再与视图宽高 innerWidth、innerHeight 作比较，如果距离在宽高之内说明出现在视图中了
   2. IntersectionObserver：创建一个 IntersectionObserver 对象去 observe 图片元素，假如元素的可见性发生变化就会执行回调函数

## addEventListener() 第三个参数

```js
el.addEventListener(event, myHandler, {
  once: false, // 是否单次监听，默认 false
  passive: true, // true = 忽略不执行 myHandler 中的 preventDefault()；默认 false
  capture: false // true = 事件由外向内触发；false = 事件从内向外冒泡；默认 false
})
```

## event loop 事件循环

1. js 是单线程运行的，在运行时会将函数的上下文放入执行栈 call stack 中保证代码的有序执行；
2. event loop 流程：
   1. 宏任务放入执行栈，执行同步代码
   2. 把微任务放入执行栈，直至微任务队列为空
   3. DOM 渲染，这一步由浏览器判断是否需要，可能会不执行
   4. 回到第一步，把下一个宏任务放入执行栈，开启下一轮的宏任务
3. 宏任务包括：js 脚本代码、setTimeout、setInterval 等，所以当遇到 setTimeout 时，延迟之后会将其回调函数放入宏任务队列，最快也要等当前这一轮宏任务的同步代码执行完后才有机会去执行它
4. 微任务包括：Promise 的回调函数、async/await 语法、fetch 等；当前宏任务产生的微任务，会在宏任务执行完毕后，下一轮宏任务开启前，全部按序执行直到清空微任务队列，

## 多标签页之间通信的方法

1. localStorage：将数据保存在浏览器中，同域共享存储空间，提供事件 storage 监听数据变化，当其他标签页修改了 localStorage 的值时触发，注意如果新值与旧值相同是不会触发该事件的
2. setInterval + cookie：发送消息的页面将数据保存在 cookie 中，接收消息的页面通过 setInterval 轮询 cookie
3. postMessage：
