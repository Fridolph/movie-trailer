const Koa = require('koa')
const { resolve } = require('path')
// const mongoose = require('mongoose')
const { connect, initSchemas } = require('./database/init')
const router = require('./routes/index')
// const R = require('ramda')
// const MIDDLEWARES = ['router']

// 9-5 12:00
// 实现加载中间件数据的功能

async function start() {
  // 连接数据库
  await connect()
  initSchemas()
  // require('./tasks/movie')
  // require('./tasks/api')
  const app = new Koa()
  
  app.use(router)

  app.listen(4455)
  console.log(`server is running at localhost:4455 --- >>> 
---------------------------------------`)
}

start()
