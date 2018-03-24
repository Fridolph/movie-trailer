const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const {resolve} = require('path')
// connect to mongodb
const connect = require('./database/init')

;(async () => {
  await connect()
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
