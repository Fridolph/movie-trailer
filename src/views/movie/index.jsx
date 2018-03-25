import React, {Component} from 'react'
import Layout from '../../layout/default'
import {Tabs, Badge} from 'antd'
import { request } from '../../lib'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const {TabPane} = Tabs
const DPlayer = window.DPlayer
const site = 'http://p5tt9e7en.bkt.clouddn.com/'
const callback = key => {
  // console.log(key)
}

export default class Movie extends Component {
  constructor(props) {
    super(props)
    this.state = {
      movie: null,
      relativeMovies: [],
      _id: this.props.match.params.id
    }
  }  

  _getMovieDetail = () => {
    request(window.__LOADING__)({
      method: 'get',
      url: `/api/v0/movies/${this.state._id}`
    }).then(res => {
      const movie = res.movie
      const relativeMovies = res.relativeMovies
      // const video = site + movie.videoKey
      const video = site + 'qd2_TC4HkBa_VFdsUQQ8_.mp4'
      // const pic = site + movie.coverKey
      const pic = site + 'nqNLyBm1XdgBxoKMVWGAr.jpg'

      this.setState({
        movie,
        relativeMovies
      }, () => {
        this.player = new DPlayer({
          container: document.getElementsById('videoPlayer')[0],

        })
      })
    }).catch(err => {
      this.setState({
        movie: {}
      })
      // 跳转回去
      this.props.history.goBack()
    })
  }

  render() {
    const {movie, relativeMovies} = this.state
    if (!movie) return null

    return (
      <div className="flex-row full">
        <div className="page-shade">
          <div className="video-wrapper">
            {/* site + movie.coverKey || site + movie.videoKey */}
            <div 
              id="videoPlayer"
              data-video={site + 'qd2_TC4HkBa_VFdsUQQ8_.mp4'} 
              data-src={site + 'nqNLyBm1XdgBxoKMVWGAr.jpg'}>
            </div>
            <div className="video-sidebar">
              <Link className="homeLink" to={'/'}>回到首页</Link>
              <Tabs deafultActiveKey="1" onChange={callback}>
                <TabPane tab="关于本片" key="1">
                  <h1>{movie.title}</h1>
                  <dl>
                    <dt>豆瓣评分：<Badge count={movie.rate} style={{backgroundColor: '#52c41a'}}/> 分</dt>
                    <dt>电影分类：{movie.tags && movie.tags.join(' ')}</dt>
                    <dt>更新时间：{moment(movie.meta.createdAt).fromNow()}</dt>
                    <dt>影片介绍：</dt>
                    <dd>{movie.summary}</dd>
                  </dl>
                </TabPane>
                <TabPane tab="同类电影" key="2">
                  {
                    relativeMovies.map(item => (
                      <Link key={item._id} className="media" to={`/detail/${item._id}`}>
                        <img width="60" className="align-self-center mr-3" src={site + 'nqNLyBm1XdgBxoKMVWGAr.jpg'} />
                        <div className="media-body">
                          <h6 className="media-title">{item.title}</h6>
                          <ul className="list-unstyled">
                          {
                            item.pubdate && item.pubdate.map((it, i) => (
                              <li key={i}>{moment(it.date).format('YYYY.MM')} {it.country}</li>
                            ))
                          }
                          </ul>
                        </div>
                      </Link>
                    ))
                  }
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    this._getMovieDetail()
  }
}