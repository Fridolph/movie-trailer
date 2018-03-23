require('babel-core/register')()
require('babel-polyfill')
require('./server/app.js')

console.log('env: ', process.env.NODE_ENV)
