const Koa = require('koa')
// const { resolve } = require('path')
// const mongoose = require('mongoose')
const { connect, initSchemas } = require('./database/init')
const router = require('./routes')
;(async () => {
  await connect()
  initSchemas()
})().then(() => {
  const app = new Koa()
  app.use(router.routes()).use(router.allowedMethods())
  
  app.listen(4455)

  console.log(
    `server is running at localhost:4455 --- >>> ---------------------------------------`
  )
})
// const R = require('ramda')
// const MIDDLEWARES = ['router']

// 9-5 12:00
// 实现加载中间件数据的功能
// const useMiddlewares = app => {
//   R.map(
//     R.compose(
//       R.forEachObjIndexed(
//         initWith => initWith(app)
//       ),
//       require,
//       name => resolve(__dirname, `./middlewares/${name}`)
//     )
//   )(MIDDLEWARES)
// }
