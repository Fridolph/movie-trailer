const {get, put, post, controller} = require('../lib/decorator')
const { checkPassword } = require('../service/user')

@controller('/user')
export default class UserRouter {
  @post('/')
  async login (ctx, next) {
    const {email, password} = ctx.request.body
    const matchData = await checkPassword(email, password)

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