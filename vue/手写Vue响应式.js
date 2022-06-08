/**
 * 将obj的key值修改为响应式，设置get()和set()方法
 * @param {object} obj
 * @param {string} key
 */
 function defineReactive(obj, key) {
  console.log('defineReactive: ' + key)

  const dep = new Dep()
  let childOb

  let val = obj[key]
  if (typeof val === 'object') {
    // 如果 val 为对象，继续通过 Observer 去遍历该 val 对象
    childOb = observe(val)
  }

  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get() {
      // Dep.curWatcher 是全局唯一标识的 watcher ，如果有就说明有一个 watcher 正想要添加依赖，同一时间只会有一个 watcher 被计算
      // 让当前属性的Dep去记录 watcher
      if (Dep.curWatcher) {
        dep.addSub()
        if (childOb) {
          childOb.dep.addSub()
        }
      }
      // 注意 getter 返回值必须是闭包中的变量，不能直接返回 obj.key，否则会导致无限递归触发 getter
      return val
    },
    set(newVal) {
      val = newVal
      if (typeof newVal === 'object') {
        observe(newVal)
      }
      dep.notify()
    }
  })
}

/**
 * @class
 * 用于遍历对象所有 Key 的类，Observer 对象会绑定对目标对象的 __ob__ 上
 */
class Observer {
  constructor(obj) {
    this.dep = new Dep()
    // 将当前的 Observer 对象绑定对目标的 __ob__ 上
    Object.defineProperty(obj, '__ob__', {
      enumerable: false,
      value: this
    })
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        observe(obj[i]) // 要判断数组中的元素是否对象
      }
      Object.setPrototypeOf(obj, newArrayPrototype) // 修改数组的原型方法
    } else {
      Object.keys(obj).forEach((key)=>{
        defineReactive(obj, key)
      })
    }
  }
}

/**
 * new Observer()的封装，如果参数不是对象类型，或者参数已有__ob__对象，则不会进行new Observer() 
 * @param {any} obj 
 * @returns Observer对象
 */
function observe(obj) {
  if (typeof obj !== 'object') return
  if (obj.hasOwnProperty('__ob__') && obj.__ob__ instanceof Observer) {
    return obj.__ob__
  } else {
    return new Observer(obj)
  }
}


// ----------------------------------------------------------------------------------------------------------


/**
 * @class
 * 对于响应式对象及其每一属性都会创建一个 Dep 对象，用于存储 watcher，并在数据发生变更时通知所有 watcher 
 */
class Dep {
  // this.subWatchers: Array<Watcher>
  // Dep.curWatcher: Watcher

  constructor() {
    // 使用 set 避免同一个 watcher 被重复加入
    this.subWatchers = new Set()
  }
  addSub() {
    if (Dep.curWatcher) {
      this.subWatchers.add(Dep.curWatcher)
    }
  }
  notify() {
    this.subWatchers.forEach((watcher) => {
      watcher.update()
    })
  }
}


// ----------------------------------------------------------------------------------------------------------


class Watcher {
  /**
   * 
   * @param {object} target 监听的目标对象
   * @param {string} key 监听对象的属性
   * @param {function} callback 回调函数
   */
  constructor(target, key, callback) {
    this.target = target
    this.callback = callback
    this.getter = parsePath(key)
    this.oldValue = this.get() // 获取一次监听的属性，添加依赖
  }
  get() {
    Dep.curWatcher = this
    this.value = this.getter(this.target)
    Dep.curWatcher = null
    return this.value
  }
  update() {
    const newValue = this.get()
    this.callback(newValue, this.oldValue)
  }
}

/**
 * 返回一个多层解析嵌套key的 getter 函数
 * @param {string} key 类似a.b.c的多层key
 * @returns {function} 获取指定 key 的 getter 函数
 */
function parsePath(key) {
  let keys = key.split('.')
  return (obj) => {
    for (let i = 0; i < keys.length; i++) {
      if (!obj) {
        console.warn('解析' + key + '出错')
        return
      }
      obj = obj[keys[i]]
    }
    return obj
  }
}


// ----------------------------------------------------------------------------------------------------------


/**
 * 
 * @param {function} makeReactive 
 */
function createArrayProto(makeReactive) {
  // 以 Array.prototype 为原型创建 newArrayPrototype 对象
  const newArrayPrototype = Object.create(Array.prototype);
  // 数组调用以下三个方法去新增元素时，使新增的元素也变为响应式
  const insertMethods = [
    'push',
    'unshift',
    'splice',
  ]
  for (let i = 0; i < insertMethods.length; i++) {
    const original = newArrayPrototype[insertMethods[i]]
    Object.defineProperty(newArrayPrototype, insertMethods[i], {
      enumerable: false,
      value: function (...args) {
        let inserted = [] // 插入数组的新值
        if (insertMethods[i] === 'push' || insertMethods[i] === 'unshift') {
          inserted = args
        } else if (insertMethods[i] === 'splice') {
          inserted = args.slice(2) // splice()方法的前两个参数是下标，去掉
        }
        // 使每个新插入的元素都变为响应式
        if (inserted.length > 0) {
          for (let j = 0; j < inserted.length; j++) {
            makeReactive(inserted[j])
          }
        }
        original.apply(this, args) // 继续执行数组原来的方法
      }
    })
  }
  return newArrayPrototype
}
const newArrayPrototype = createArrayProto(observe)


// ----------------------------------------------------------------------------------------------------------


const obj = {
  objKey: 'obj key default val',
  arr: [
    { arrKey: 'v0' },
    { arrKey: 'v1' },
    { arrKey: 'v2' }
  ]
}
observe(obj)
const objWatcher = new Watcher(obj, 'objKey', (newVal, oldVal) => {
  console.log(`将${oldVal}修改为${newVal}`)
})
obj.objKey = '111'
obj.objKey = '222'
obj.objKey = '333'


const arrayWatcher = new Watcher(obj, 'arr', (newVal, oldVal) => {
  console.log(`将${oldVal}修改为${newVal}`)
})
obj.arr.push({
  arrKey: 'v4'
})
console.log(obj.arr)
const array3Watcher = new Watcher(obj.arr[3], 'arrKey', (newVal, oldVal) => {
  console.log(`将${oldVal}修改为${newVal}`)
})
obj.arr[3].arrKey = 'v3新值'
