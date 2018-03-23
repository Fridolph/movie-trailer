const mongoose = require('mongoose')
const glob = require('glob')
const { join } = require('path')

const db = 'mongodb://localhost:27017/douban-trailer'
mongoose.Promise = global.Promise

const connect = () => {
  // 统计连接错误
  let maxConnectTimes = 0

  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true)
  }
  // 连接 mongodb 数据库
  mongoose.connect(db, { useMongoClient: true })
  // 当数据库断了再次重连
  mongoose.connection.on('disconnected', () => {
    maxConnectTimes++
    if (maxConnectTimes < 5) {
      mongoose.connect(db, { useMongoClient: true })
    } else {
      console.log('数据库挂了，快去修吧，骚年!')
    }
  })
  // 错误处理
  mongoose.connection.on('error', err => {
    maxConnectTimes++
    if (maxConnectTimes < 5) {
      mongoose.connect(db, { useMongoClient: true })
    } else {
      console.log('数据库挂了，快去修吧，骚年!')
      throw new Error(err)
    }
  })
  // 初次连接打开
  mongoose.connection.once('open', () => {
    console.log('mongoDB connected successfully!')
  })
}

const initSchemas = () => {
  glob.sync(join(__dirname, './schema/', '**/*.js')).forEach(require)
}

module.exports = {
  connect,
  initSchemas
}
