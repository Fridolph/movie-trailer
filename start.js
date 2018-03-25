require('babel-core/register')()
require('babel-polyfill')
require('./server/index.js')

console.log('env: ', process.env.NODE_ENV)
