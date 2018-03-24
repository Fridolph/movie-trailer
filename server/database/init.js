const mongoose = require('mongoose')
const DB_URL = 'mongodb://localhost:27017/douban-trailer'

mongoose.Promise = global.Promise

const connect = () => {
  // 计算mongodb的连接次数
  let maxContentTimes = 0

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }
    // 连接到mongodb
    mongoose.connect(DB_URL)
    // mongodb 相关事件绑定
    mongoose.connection.on('disconnected', () => {
      maxContentTimes++
      if (maxContentTimes < 5) {
        mongoose.connect(DB_URL)
      } else {
        throw new Error('数据库挂了，快去修吧骚年！')
      }
    })
    mongoose.connection.on('error', err => {
      maxContentTimes++
      if (maxContentTimes < 5) {
        mongoose.connect(DB_URL)
      } else {
        throw new Error('数据库挂了，快去修吧骚年！')
      }
    })
    mongoose.connection.once('open', () => {
      resolve()
      console.log('mongoDB connected successfully!')
    })
  })
}

module.exports = connect