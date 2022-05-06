// #region 数组的响应式处理
// 拷贝一份数组的原型
const arrayPrototype=Array.prototype;
// 以 Array.prototype 为原型创建 arrayMethods 对象
const arrayMethods=Object.create(arrayPrototype);
// 数组的七个修改方法不会触发Object.defineProperty的set监听，所以需要作修改
const methodsNeedChange=[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse',
]
for(let i=0; i<methodsNeedChange.length; i++){
  const original=arrayMethods[methodsNeedChange[i]]
  Object.defineProperty(arrayMethods, methodsNeedChange[i], {
    enumerable: false,
    // 给数组原型的七个方法都包一层
    value: function () {
      let inserted = [] // 插入数组的值
      let args = [...arguments] // 将数组方法的参数转为数组
      switch(methodsNeedChange[i]){
        case 'push':
        case 'unshift':
          inserted = args
          break;
        case 'splice':
          inserted = args.slice(2) // splice()方法的前两个参数是下标，去掉
      }
      // 对每个新插入的元素都创建Observer
      if(inserted.length > 0){
        for(let j=0; j<inserted.length; j++){
          observe(inserted[j])
        }
      }
      original.call(this, arguments) // 继续执行数组原来的方法
    }
  })
}
// #endregion



/**
 * 用于遍历对象所有Key的类
 */
class Observer {
  constructor(obj){
    this.dep = new Dep()
    // 将Observer对象绑定对目标对象的__ob__上
    Object.defineProperty(obj, '__ob__', {
      enumerable: false,
      value: this
    })
    if(Array.isArray(obj)){
      for(let i=0; i<obj.length; i++){
        observe(obj[i]) // 要判断数组中的元素是否对象
      }
      Object.setPrototypeOf(obj, arrayMethods) // 修改数组的原型方法
    }else{
      this.walk(obj)
    }
  }
  walk(obj){
    const keys = Object.keys(obj)
    for(let i=0; i<keys.length; i++){
      defineReactive(obj, keys[i])
    }
  }
}

/**
 * new Observer()的封装，如果参数不是对象类型，或者参数已有__ob__对象，则不会进行new Observer() 
 * @param {any} obj 
 * @returns Observer对象
 */
function observe(obj){
  if(typeof obj !== 'object') return
  if(obj.hasOwnProperty('__ob__') && obj.__ob__ instanceof Observer){
    return obj.__ob__
  }else{
    return new Observer(obj)
  }
}


/**
 * 会给每个对象以及对象的每个属性都添加一个Dep对象用于收集依赖
 */
class Dep {
  // dep.subs: Array<target>
  // Dep.target: Watcher
  constructor(){
    this.subs = []
  }
  addSub () {
    if(Dep.target){
      this.subs.push(Dep.target)
    }
  }
  notify(){
    const subs = this.subs.slice()
    for(let i=0; i<subs.length; i++){
      subs[i].update()
    }
  }
}

/**
 * 返回一个多层解析嵌套key的getter函数
 * @param {string} key 类似a.b.c的多层key
 * @returns {function} getter函数
 */
function parsePath (key) {
  let keys = key.split('.')
  return (obj) => {
    for(let i=0; i<keys.length; i++){
      if(!obj){
        console.warn('解析'+key+'出错')
        return
      }
      obj = obj[keys[i]]
    }
    return obj
  }
}

class Watcher {

  // {object} target 监听的目标对象
  // {any} value target.key值
  // {function} callback 回调函数
  // {function} getter 获取target.key的getter函数

  /**
   * 
   * @param {object} target 监听的目标对象
   * @param {string} key 监听对象的属性
   * @param {function} callback 回调函数
   */
  constructor(target, key, callback){
    this.target = target
    this.callback = callback
    this.getter = parsePath(key)
    this.value = this.get() // 获取一次监听的属性，添加依赖
  }
  get(){
    Dep.target = this
    this.value = this.getter(this.target)
    Dep.target = null
    return this.value
  }
  update(){
    const oldValue = this.value
    const newValue = this.get()
    this.callback(newValue, oldValue)
  }
}

/**
 * 将obj的key值修改为响应式，设置get()和set()方法
 * @param {object} obj
 * @param {string} key
 */
function defineReactive(obj, key){
  console.log('defineReactive: ' + key)

  const dep = new Dep()
  let childOb

  let val = obj[key]
  if(typeof val === 'object'){
    // 如果val为对象，继续通过Observer去遍历该val对象
    childOb = observe(val)
  }

  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get(){
      // Dep.target是全局唯一标识的watcher，如果有就说明有一个watcher想要添加依赖，同一时间只会有一个 watcher 被计算
      // 让当前属性的Dep去记录watcher
      if(Dep.target){
        dep.addSub()
        if(childOb){
          childOb.dep.addSub()
        }
      }
      return val
    },
    set(newVal){
      val = newVal
      if(typeof newVal === 'object'){
        observe(newVal)
      }
      dep.notify()
    }
  })
}

const obj1 = {
  k: '啊啊啊'
}
observe(obj1)
new Watcher(obj1, 'k', (newVal, oldVal)=>{
  console.log(`将${oldVal}修改为${newVal}`)
})
obj1.k = '666'
