const fs = require('fs')
var EventEmitter = require('events').EventEmitter;

class EE extends EventEmitter {}

const ee = new EE()

ee.on('event', () => console.log('粗大事了'))

setTimeout(() => {
  console.log('0 毫秒后执行的定时回调')
}, 0)

setTimeout(() => {
  console.log('100 毫秒后执行的定时回调')
}, 100)

setTimeout(() => {
  console.log('200 毫秒后执行的定时回调')
}, 200)

fs.readFile('../package.json', 'utf-8', (err, data) => {
  if (err) console.log(err)
  console.log('完成文件1 读操作回调')
})

fs.readFile('../readme.md', 'utf-8', (err, data) => {
  if (err) console.log(err)
  console.log('完成文件2 读操作回调')
})

setImmediate(() => {
  console.log('setImmediate 立即回调')
})

process.nextTick(() => {
  console.log('process.nextTick 的回调')
})

Promise.resolve().then(() => {
  ee.emit('event')
  process.nextTick(() => {
    console.log('process.nextTick 第二次回调')
  })
  console.log('Promise 第一次回调')
}).then(() => {
  console.log('Promise 第二次回调')
})

/**
 * 程序自上而下执行，同步执行，fs.readFile setTimeout setImmediate等异步都进入事件队列中
 * 当执行到Promise.resolve()时，停下来执行 
 * 所以先打印  1. 粗大事了
 * 然后 是 2. Promise 第一次回调
 * 当此回调的同步执行完后 然后进入下一个.then中，
 * 所以接下来打印 3. Promise 第二次回调
 * 这里的 process.nextTick 会等到 Promise.resolve这整个同步逻辑完毕后才执行
 * 4. process.nextTick 第二次回调
 * 这之后开始执行事件队列中的回调函数（异步调用）
 * 队首的自然是 5. 0毫秒后执行的定时回调
 * 6. setImmediate 立即回调
 * 读文件操作，由于文件不大，速度很快，当然这个时间其实不固定 7. 完成文件1 读操作
 * 8. 完成文件2 度操作回调
 * 最后 定时器 9. 100毫秒后执行的定时回调
 * 10. 200 毫秒后执行的定时回调
 */