//@ts-check

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) {
    reject(new TypeError('x === promise2'))
    return
  }

  let called = false
  if (x && (typeof x === 'object' || typeof x === 'function')) {
    try {
      const xThen = x.then
      if (typeof xThen === 'function') {
        xThen.call(x, (value) => {
          if (called) return
          called = true
          resolvePromise(promise2, value, resolve, reject)
        }, (reason) => {
          if (called) return
          called = true
          reject(reason)
        })
      } else {
        resolve(x)
      }
    } catch (error) {
      reject(error)
    }
  } else {
    resolve(x)
  }
}

class MyPromise {

  constructor(executor) {
    this.state = PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      this.state = FULFILLED
      this.value = value
      this.onFulfilledCallbacks.forEach(fn => fn())
    }
    const reject = (reason) => {
      this.state = REJECTED
      this.reason = reason
      this.onRejectedCallbacks.forEach(fn => fn())
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {

    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => { return value }
    onRejected = typeof onRejected === 'function' ? onRejected : (error) => { throw error }

    const promise2 = new MyPromise((resolve, reject) => {
      switch (this.state) {
        case FULFILLED: {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
          break
        }
        case REJECTED: {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
          break
        }
        case PENDING: {
          this.onFulfilledCallbacks.push(() => {
            setTimeout(() => {
              try {
                const x = onFulfilled(this.value)
                resolvePromise(promise2, x, resolve, reject)
              } catch (error) {
                reject(error)
              }
            }, 0)
          })
          this.onRejectedCallbacks.push(() => {
            setTimeout(() => {
              try {
                const x = onRejected(this.reason)
                resolvePromise(promise2, x, resolve, reject)
              } catch (error) {
                reject(error)
              }
            }, 0)
          })
          break
        }
      }
    })
    return promise2
  }
}



const p1 = new MyPromise((resolve, reject)=>{
  resolve('p1 ok')
})
const p2 = new MyPromise((resolve, reject)=>{
  resolve('p2 ok')
})

p1.then((result)=>{
  console.log('p1.then get: ', result)
  return 'eee'
}).then((result)=>{
  console.log('p1.then.then get: ', result)
})
