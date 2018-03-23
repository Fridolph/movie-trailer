const Router = require('koa-router')
const { getAllMovies, getRelativeMovies } = require('../service/movie')
const { controller, get, post, put} = require('../lib/decorator')

@controller('/api/v0/movies')
export class movieController {
  @get('/')
  async getMovies(ctx, next) {
    const {type, year} = ctx.query
    const movies = await getAllMovies(type, year)
  }
  
  @get('/:id')
  async getMovieDetail(ctx, next) {
    const { id } = ctx.params
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