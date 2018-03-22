const mongoose = require('mongoose')
const Schema = mongoose.Schema
// Mixed可存任何类型的数据，适合数据结构变化频繁的场景
const { Mixed, ObjectId } = Schema.Types

const movieSchema = new Schema({
  // 描述model所需字段
  doubanId: { type: String, required: true, unique: true },

  category: [
    {
      type: ObjectId,
      ref: 'Category'
    }
  ],

  rate: Number,
  title: String,
  summary: String,
  video: String,
  poster: String,
  cover: String,

  videoKey: String,
  posterKey: String,
  coverKey: String,

  rawTitle: String,
  movieTypes: [String],
  pubdate: Mixed,
  year: Number,

  tags: Array,

  meta: {
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
  }
})

movieSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})

mongoose.model('Movie', movieSchema)
