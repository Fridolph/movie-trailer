const Router = require('koa-router')
const glob = require('glob')
const { resolve } = require('path')
const R = require('ramda')
const _ = require('lodash')

const pathPrefix = Symbol('prefix')
const routeMap = new Map()
// const isArray = c => (_.isArray(c) ? c : [c])

const normalizePath = path => (path.startsWith('/') ? path : `/${path}`)

const setRouter = method => path => (target, key, descriptor) => {
  routeMap.push({
    target,
    method,
    path: normalizePath(path)
  })
  return descriptor
}

export class Route {
  constructor (app, routesPath) {
    this.app = app
    this.routesPath = routesPath
    this.router = new Router()
  }

  init () {
    const { app, router, routesPath } = this

    glob.sync(resolve(routesPath, './**/*.js')).forEach(require)

    R.forEach(
      ({ target, method, path, callback }) => {
        const prefix = normalizePath(target[pathPrefix])
        router[method](prefix + path, ...callback)
      }
    )(routeMap)

    app.use(router.routes())
    app.use(router.allowedMethods())
  }
}

export const controller = path => target =>
  (target.prototype[pathPrefix] = path)

export const get = path => setRouter('get')

export const post = path => setRouter('post')

export const put = path => setRouter('put')

export const del = path => setRouter('delete')

export const use = path => setRouter('use')

export const all = path => setRouter('all')
