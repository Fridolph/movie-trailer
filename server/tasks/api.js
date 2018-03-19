// http://api.douban.com/v2/movie/subject/1764796
const rp = require('request-promise-native')

async function fetchMovie(item) {
  const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`
  const res = await rp(url)

  return res
}

;(async () => {
  let movies = [
    {
      doubanId: 26329065,
      title: '天生一对',
      rate: 8.4,
      poster:
        'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2514858399.jpg'
    },
    {
      doubanId: 27205162,
      title: '能先接吻吗？',
      rate: 8.3,
      poster:
        'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2511287619.jpg'
    }
  ]

  movies.map(async movie => {
    let movieData = await fetchMovie(movie)
    try {
      movieData = JSON.parse(movieData)
      console.log(movieData.tags)
      console.log(movieData.summary)
    } catch (err) {
      console.log(err)
    }
    // console.log(movieData)
  })
})()
