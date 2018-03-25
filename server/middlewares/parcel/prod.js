const views = require('koa-views')
const serve = require('koa-static')
const {resolve} = require('path')

const r = path => resolve(__dirname, path)

export const prod = async app => {
  app.use(serve(r('../../../dist')))
  app.use(serve(r('../../../dist')), {
    extension: 'html'
  })

  app.use(async ctx => {
    await ctx.render('index.html')
  })
}