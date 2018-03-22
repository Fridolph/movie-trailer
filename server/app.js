const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const {resolve} = require('path')
const mongoose = require('mongoose')
const {connect, initSchemas} = require('./database/init')

;(async () => {
  // 连接数据库
  await connect()
  initSchemas()
  // require('./tasks/movie')  
  require('./tasks/api')
})()

app.use(views(resolve(__dirname, './views'), {
  extension: 'pug'
}))

app.use(async (ctx, next) => {
  await ctx.render('index', {
    movies: []
  })
})
app.listen(4455)
