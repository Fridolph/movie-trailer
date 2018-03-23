const Router =  require('koa-router')
const { checkPassword } = require('../service/user')
const { controller, get, post, put} = require('../lib/decorator')

@controller('/user')
class userController {
  @post('/')
  async login(ctx, next) {
    const {email, password} = ctx.request.body
    const match = await checkPassword(email, password)

    if (!matchData.user) {
      return (ctx.body = { 
        success: false,
        err: '用户不存在'
      })
    }
    if (matchData.match) {
      return (ctx.body = { success: true })
    }

    return (ctx.body = { 
      success: false,
      err: '密码不正确'
    })
  }
}

module.exports = {
  userController
}