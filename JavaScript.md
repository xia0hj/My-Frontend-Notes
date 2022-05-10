# JavaScript笔记

## JavaScript的基本数据类型和引用数据类型

1. 基本数据类型有 String, Number, Boolean, Undefined, Null, es6新增的Symbol, es10新增的BigInt
2. Symbol 代表创建后独一无二且不可变的数据类型，可以用作复杂对象的属性key，避免属性重名覆盖，也可以用来实现私有属性
3. 引用数据类型有对象、函数、数组3种
4. 区别是存储位置不同。原始数据类型直接存储在栈中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储。引用数据类型存储在堆（heap）中的对象，占据空间大、大小不固定。如果存储在栈中，将会影响程序运行的性能；引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

## undefined和null的区别

1. undefined代表未定义，null代表空对象。一般变量声明了但没有赋值就是undefined，null主要赋值给对象作为初始值
2. null是保留的关键字，而undefined不是

## ==和===的区别

1. ==比较基本数据类型时，如果类型不同会进行强制转换后再比较
2. ===比较基本数据类型时，先比较类型再比较值，类型不同值为false，不进行转换
3. 在比较引用数据类型时，==和===都是比较内存地址

## use strict 严格模式

1. use strict 指的是严格运行模式，在这种模式对 js 的使用添加了一些限制。
2. 比如说禁止 this 指向全局对象，还有禁止使用 with 语句等。
3. 设立严格模式的目的，主要是为了消除代码使用中的一些不安全的使用方式，也是为了消除 js 语法本身的一些不合理的地方，以此来减少一些运行时的怪异的行为。

## isNaN()和Number.isNaN()区别

1. isNaN()会尝试将参数类型转换数字，任何不能被转换为数值的都会返回true，因此传入非数字会返回true
2. Number.isNaN()会首先判断参数类型是否数字，如果传入非数字会直接返回false，是数字才会继续判断

## new做了什么及其实现

1. 首先创建一个空对象
2. 设置原型，将对象的原型设置为函数的 prototype 对象
3. 让函数的 this 指向这个新对象，执行构造函数的代码（为这个新对象添加属性）
4. 判断构造函数返回值的类型，如果是引用类型就将它返回，否则将上面创建的新对象返回

```js
function newFn(){
  const constructor = Array.prototype.shift.call(arguments) // 从参数列表中移除并取出第一个参数
  if(typeof constructor !== 'function'){
    console.warn('type error')
    return
  }

  const newObject = Object.create(constructor.prototype) // 创建空对象，并把对象原型设为构造函数的prototype
  const result = constructor.apply(newObject, arguments) // 相当于newObject.constructor(args)，并使this指向newObject

  if(result && (typeof result==='object' || typeof result==='function')){
    // 如果构造函数返回值是引用类型(对象、数组、函数)，则直接返回
    return result
  }else{
    // 否则返回创建的新对象
    return newObject
  }
}
// const obj = newFn(构造函数, 参数...)
// const obj = new 构造函数(参数)
```

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
4. 原型链的尽头一般是Object.prototype，这也是我们新建的对象能够使用 toString 等常用方法的原因

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
function debounce(fn, waitTime){
  let timer = null
  return function (){
    if(timer){
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(()=>{
      // this = 调用debounceSay()的上下文
      // arguments = '呃呃'
      fn.apply(this, arguments)
    }, waitTime)
  }
}
// 节流
function throttle(fn, delayTime){
  let timer = null
  return function(){
    if(timer){
      return
    }
    timer = setTimeout(()=>{
      fn.apply(this, arguments)
      timer = null
    }, delayTime)
  }
}

const say = (str) => {console.log('I say: ', str)}
 
const debounceSay = debounce(say, 3000)
const throttleSay = throttle(say, 3000)
// <button onclick="throttleSay('节流')">节流按钮</button>
// <button onclick="debounceSay('防抖')">防抖按钮</button>
```


## Object.defineProperty()的坑

设定getter和setter时，不能直接返回或修改obj.key的值，否则在getter中访问又会继续触发getter，造成无限递归
