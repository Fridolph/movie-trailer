const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed
const SALT_WORK_FACTOR = 10
const MAX_LOGIN_ATTEMPTS = 5 // 最大尝试登录次数
const LOCK_TIME = 1 * 60 * 60 * 1000 // 1小时

const userSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  passworld: {
    type: String,
    required: true
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: Number,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

//  mongodb的虚拟字段
userSchema.virtual('isLocked').get(function() {
  // 两次取反隐式转换boolean
  return !!(this.lockUntil && this.lockUntil > Date.now()) 
})

userSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

userSchema.pre('save', function(next) {
  if (this.isModified('password')) return next()
  // 对密码进行加密
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error)
      this.password = hash
      next()
    })
  })
  next()  
})

userSchema.methods = {
  /**
   * 比较登录时的两次密码是否相同
   * @param {String} password 
   * @return {Boolean} 比较结果
   */
  comparePassword: (_password, password) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (err) reject(err)
        resolve(isMatch)
      })
    })
  },

  /** 
   * 判断当前用户是不是超过了登录次数，而后进行锁定
   * @param {Object} user 当前的用户对象实例
   * @return {Boolean}
   */
  incLoginAttepts: (user) => {
    return new Promise((resolve, reject) => {
      if (this.lockUntil && this.lockUntil < Date.now()) {
        this.update({
          $set: {
            incLoginAttepts: 1
          },
          $unset: {
            lockUntil: 1
          }
        }, err => {
          if (err) reject(err)
          resolve(true)
        })
      } else {
        // 若没有命中时
        let updates = {
          $inc: {
            loginAttempts: 1
          }
        }
        if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
          updates.$set = {
            lockUntil: Date.now() + LOCK_TIME
          }
        }
        this.update(updates, err => {
          if (err) reject(err)
          resolve(true)
        })
      }
    })
  }
}

mongoose.model('User', userSchema)
