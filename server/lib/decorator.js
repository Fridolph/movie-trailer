const Router = require('koa-router')
const {resolve} = require('path')
const symbolPrefix = Symbol('prefix')
const routerMap = new Map()
const _ = require('lodash')
const glob = require('glob')

// 辅助方法
const isArray = c => _.isArray(c) ? c : [c]
const normalizePath = path => path.startsWith('/') ? path : `/${path}`

export const setRouter = conf => (target, key, descriptor) => {
  conf.path = normalizePath(conf.path)

  routerMap.set({
    target,
    ...conf
  }, target[key])

  return descriptor
}

export const controller = path => target => (target.prototype[symbolPrefix] = path)

export const get = path => setRouter({ method: 'get', path })

export const post = path => setRouter({ method: 'post', path })

export const put = path => setRouter({ method: 'put', path })

export const del = path => setRouter({ method: 'delete', path })

export const use = path => setRouter({ method: 'use', path })

export const all = path => setRouter({ method: 'all', path })

export class Route {
  constructor(app, apiPath) {
    this.app = app
    this.apiPath = apiPath
    this.router = new Router()
  }

  init() {
    glob.sync(resolve(this.apiPath, './*.js')).forEach(require)

    for (let [conf, controller] of routerMap) {
      const controllers = isArray(controller)
      const prefixPath = conf.target[symbolPrefix]

      if (prefixPath) prefixPath = normalizePath(prefixPath)
      const routerPath = prefixPath + conf.path
      this.router[conf.method](routerPath, ...controllers)
    }
    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())
  }
}