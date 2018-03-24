const Koa = require('koa')
const views = require('koa-views')
const {resolve} = require('path')
const mongoose = require('mongoose')
const {connect, initSchemas} = require('./database/init')
const router = require('./routes')

;(async () => {
  // 连接数据库
  await connect()
  initSchemas()
  // require('./tasks/movie')  
  // require('./tasks/api')
})()

const app = new Koa()

app
  .use(router.routes())
  .use(router.allowedMethods())


app.use(views(resolve(__dirname, './views'), {
  extension: 'pug'
}))

app.use(async (ctx, next) => {
  await ctx.render('index', {
    movies: []
  })
})
app.listen(4455, () => {
  console.log('server is running at localhost:4455')
  console.log('-----------------------------------')
})
