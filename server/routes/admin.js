import mongoose from 'mongoose'
import {
  Controller,
  Post,
  Auth,
  Get,
  Required,
} from '../decorator/router'
import { checkPassword } from '../service/admin'

@Controller('/admin')
export default class AdminRouter {
  @Post('/login')
  @Required({
    body: ['email', 'password']
  })
  @Auth
  async adminLogin (ctx, next) {
    const { email, password } = ctx.request.body
    const data = await checkPassword(email, password)
    const { user, match } = data

    if (match) {
      ctx.session.user = {
        _id: user._id,
        email: user.email,
        role: user.role,
        username: user.username
      }

      return (ctx.body = {
        success: true,
        data: {
          email: user.email,
          username: user.username
        }
      })
    }

    return (ctx.body = {
      success: false,
      err: '密码错误'
    })
  }
}
