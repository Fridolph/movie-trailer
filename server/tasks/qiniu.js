// let movies = [   {     video:
// 'http://vt1.doubanio.com/201803202127/0e81598d3ca2e7e4b226e6a35ba8bf2c/view/m
// o vie/M/302270967.mp4',     doubanId: '3445906',     cover:
// 'https://img3.doubanio.com/img/trailer/medium/2514914002.jpg?1519792621',
// poster:
// 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2512717509.jpg'
// } ]

const qiniu = require('qiniu')
const nanoid = require('nanoid')
const config = require('../config')
const mongoose = require('mongoose')

const {bucket} = config.qiniu
const mac = new qiniu
  .auth
  .digest
  .Mac(config.qiniu.AK, config.qiniu.SK)
const cfg = new qiniu
  .conf
  .Config()
const client = new qiniu
  .rs
  .BucketManager(mac, cfg)

const uploadToQiniu = async(url, key) => {
  return new Promise((resolve, reject) => {
    client.fetch(url, bucket, key, (err, ret, info) => {
      if (err) 
        reject(err)
      if (info.statusCode === 200) {
        resolve({key})
      } else {
        reject(info)
      }
    })
  })
};
(async() => {
  const Movie = mongoose.model('Movie')
  // let movies = [
  //   {
  //     video: 'http://vt1.doubanio.com/201803202127/0e81598d3ca2e7e4b226e6a35ba8bf2c/view/movie' +
  //       '/M/302270967.mp4',
  //     doubanId: '3445906',
  //     cover: 'https://img3.doubanio.com/img/trailer/medium/2514914002.jpg?1519792621',
  //     poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2512717509.jpg'
  //   }
  // ]
  let movies = await Movie.find({
    $or: [
      {videoKey: {$exists: false}},
      {videoKey: null},
      {videoKey: ''}
    ]
  }).exec()

  movies.map(async movie => {
    if (movie.video && !movie.key) {
      try {
        console.log('开始传 video')
        let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
        console.log('开始传 cover')
        let coverData = await uploadToQiniu(movie.cover, nanoid() + '.jpg')
        console.log('开始传 poster')
        let posterData = await uploadToQiniu(movie.poster, nanoid() + '.jpg')

        if (videoData.key) {
          movie.videoKey = videoData.key
        }
        if (coverData.key) {
          movie.coverKey = coverData.key
        }
        if (posterData.key) {
          movie.posterKey = posterData.key
        }
        console.log('--------------正在上传--------------\n', movie)
      } catch (err) {
        console.log(err)
      }
    }
  })
})()

// const data = {
//   video: 'http://vt1.doubanio.com/201803202127/0e81598d3ca2e7e4b226e6a35ba8bf2c/view/movie' +
//       '/M/302270967.mp4',
//   doubanId: '3445906',
//   cover: 'https://img3.doubanio.com/img/trailer/medium/2514914002.jpg?1519792621',
//   poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2512717509.jpg',
//   videoKey: 'http://p5tt9e7en.bkt.clouddn.com/Nw~bSxRMTAIBJ0dg1x~yV.mp4',
//   coverKey: 'http://p5tt9e7en.bkt.clouddn.com/SVgqJSSfCl7213E3P4xva.jpg',
//   posterKey: 'http://p5tt9e7en.bkt.clouddn.com/pOzG_KFnA9G4NHjot1C1X.jpg'
// }