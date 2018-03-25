const {get, controller} = require('../lib/decorator')
const {getAllMovies, getMovieDetail, getRelativeMovies} = require('../service/movie')

@controller('/api/v0/movies')
export default class MovieRouter {
  @get('/')
  async getMovies(ctx, next) {
    const {type, year} = ctx.query
    const movies = await getAllMovies(type, year)

    ctx.body = {
      data: movies,
      success: true
    }
  }

  @get('/api/v0/movies/detail/:id')
  async getMovieDetail(ctx, next) {
    const {id} = ctx.params
    const movie = await getMovieDetail(id)
    const relativeMovies = await getRelativeMovies(movie)

    ctx.body = {
      data: {
        movie,
        relativeMovies
      },
      success: true
    }
  }
}

// router.get('/movies', async (ctx, next) => {   const Movie =
// mongoose.model('Movie')   const movies = await Movie.find({}).sort({
// 'meta.createdAt': -1   })   ctx.body = {     movies   } })
// router.get('/movies/:id', async (ctx, next) => {   const Movie =
// mongoose.model('Movie')   const id = ctx.params.id   const movie = await
// Movie.findOne({ _id: id })   ctx.body = {     movie   } }) module.exports =
// router