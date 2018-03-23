const Router = require('koa-router')
const router = Router()

router.get('/', async(ctx, next) => {
  ctx.body = 'hello koa2'
  next()
})

router.get('/movie', async(ctx, next) => {
  ctx.body = 'movie'
  next()
})

module.exports = router