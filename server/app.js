const Koa = require('koa')
const mongoose = require('mongoose')
const views = require('koa-views')
const {join} = require('path')
const {connect, initSchemas} = require('./database/init')
// const router = require('./routes')
const R = require('ramda')
const MIDDLEWARES = ['router']

const useMiddlewares = app => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        e => e(app)
      ),
      require,
      name => join(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES)
}

;(async () => {
  // 连接数据库
  await connect()
  initSchemas()
  // require('./tasks/movie')  
  // require('./tasks/api')
  const app = new Koa()
  await useMiddlewares(app)

  app.listen(4455, () => {
    console.log('server is running at localhost:4455')
    console.log('-----------------------------------')
  })
})()
