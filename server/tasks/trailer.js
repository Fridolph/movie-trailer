// http://vt1.doubanio.com/201803191105/ec23339c823f6bdf71358ea4c5961da8/view/movie/M/302190491.mp4

const cp = require('child_process')
const { resolve } = require('path')

;(async () => {
  const script = resolve(__dirname, '../crawler/video')
  const child = cp.fork(script, [])
  let invoked = false

  child.on('error', err => {
    if (invoked) return
    invoked = true
    console.log(err)
  })

  child.on('exit', code => {
    if (invoked) return
    invoked = true
    let err = code === 0 ? null : new Error('exit code ' + code)
    console.error(err)
  })

  child.on('message', data => {
    let result = data.result
    console.log(data)
    // https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2512717509.jpg
  })
})()
