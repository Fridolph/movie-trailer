const { Route } = require('../lib/decorator')
const { resolve } = require('path')
const { movieController } = require('../routes/movie')

export const router = app => {
  const routesPath = resolve(__dirname, '../routes')
  const instance = new Route(app, routesPath)

  instance.init()
}

router(movieController)
