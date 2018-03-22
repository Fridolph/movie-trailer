// http://api.douban.com/v2/movie/subject/1764796
const rp = require('request-promise-native')
// 操作数据库数据
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

async function fetchMovie(item) {
  const url = `http://api.douban.com/v2/movie/${item.doubanId}` // subject有时数据不全，暂时用 /movie 来爬
  // const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`
  const res = await rp(url) // 拿到的res是 string 类型
  // console.log('--------------------------------------\n', res)
  let body
  try {
    body = JSON.parse(res) // 将res 转为 object 并返回
  } catch (err) {
    console.log(err)
  }
  return body
}

;(async () => {
  let movies = await Movie.find({
    // 若查出的数据有不完整情况， 就再深爬数据
    $or: [
      { summary: { $exists: false } },
      { summary: null },
      { summary: '' },
      { title: '' },
      { year: { $exists: false } }
    ]
  })

  for (let i = 0; i < movies.length; i++) {
    // 测试时，每次只跑一条数据，
    // for (let i = 0; i < movies.length; i++) {
    let movie = movies[i]
    let movieData = await fetchMovie(movie)

    if (movieData) {
      let tags = movieData.tags || []

      movie.tags = movieData.tags || []
      movie.summary = movieData.summary || ''
      movie.title = movieData.alt_title || movieData.title || ''
      movie.rawTitle = movieData.title || ''

      // attrs 是个对象，复杂的数据结构，于是我们进入对象中再处理
      if (movieData.attrs) {
        movie.movieTypes = movieData.attrs.movie_type || []
        movie.year = movieData.attrs.year[0] || 2500

        for (let i = 0; i < movie.movieTypes.length; i++) {
          let item = movie.movieTypes[i]
          // 查看分类是否存储过
          let cat = await Category.findOne({ name: item })
          if (!cat) {
            cat = new Category({
              name: item,
              movies: [movie._id]
            })
          } else {
            // 这里是判断是否存储的值为空
            if (cat.movies.indexOf(movie._id) === -1) {
              cat.movies.push(movie._id)
            }
          }
          await cat.save()

          if (!movie.category) {
            movie.category.push(cat._id)
          } else {
            if (movie.category.indexOf(cat._id) === -1) {
              movie.category.push(cat._id)
            }
          }
        }

        // 处理上映日期
        let dates = movieData.attrs.pubdate || []
        let pubdates = []

        dates.map(item => {
          if (item && item.split('(').length > 0) {
            let parts = item.split('(')
            let date = parts[0]
            let country = '未知'
            if (parts[1]) {
              country = parts[1].split(')')[0]
            }
            pubdates.push({
              date: new Date(),
              country
            })
          }
        })
        movie.pubdate = pubdates
      }

      tags.forEach(tag => {
        movie.tags.push(tag.name)
      })

      await movie.save()
    }
  }
  // movies.map(async movie => {
  //   let movieData = await fetchMovie(movie)

  //   try {
  //     movieData = JSON.parse(movieData)
  //     console.log(movieData.tags)
  //     console.log(movieData.summary)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // })
})()
