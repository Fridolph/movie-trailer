import React, {Component} from 'react'
import moment from 'moment'
import {Link} from 'react-router-dom'
import {Card, Row, Col, Badge, Icon, Modal, Spin} from 'antd'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const DPlayer = window.DPlayer
const site = 'http://p5tt9e7en.bkt.clouddn.com/'

export default class Content extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  _handleClose = e => {
    if (this.player && this.player.pause) {
      this.player.pause()
    }
  }

  _handleCancel = e => {
    this.setState({
      visible: false
    })
  }

  _onShowModal = movie => {
    this.setState({
      visible: true
    })
    // const video = site + movie.videoKey
    const video = site + 'qd2_TC4HkBa_VFdsUQQ8_.mp4'
    // const pic = site + movie.coverKey
    const pic = site + 'nqNLyBm1XdgBxoKMVWGAr.jpg'

    if (!this.player) {
      setTimeout(() => {
        this.player = new DPlayer({
          container: document.getElementsByClassName('videoModal')[0],
          screenshot: true,
          autoplay: true,
          video: {
            url: video,
            pic,
            thumbnails: pic
          }
        })
      }, 500)
    } else {
      if (this.player.video.currentSrc !== video) {
        this.player.switchVideo({
          autoplay: true,
          url: video,
          pic: image,
          type: 'auto'
        })

        this.player.play()
      }
    }
  }

  _jumpToDetail = (e) => {
    const {url} = this.props
    url && window.open(url)
  }

  _renderContent = (e) => {
    const {movies} = this.props
    const {Meta} = Card

    return (
      <div className="sticky-flex">
        <Row gutter={16} className="layout-content">
          {
            movies.map((v, i) => (
              <Col
                key={i}
                xl={{span: 6}}
                lg={{span: 8}}
                md={{span: 12}}
                sm={{span: 24}}
                style={{marginBottom: '15px'}}
              >
                <Card
                  style={{border: '1px solid #efefef'}}
                  bordered={false}
                  hoverable
                  actions={[
                    <Badge>
                      <Icon style={{marginRight: '2px'}} type="clock-circle" />
                      {moment(v.meta.createdAt).fromNow(true)}
                      前更新
                    </Badge>,
                    <Badge>
                      <Icon style={{marginRight: '2px'}} type="star" />
                      {v.rate} 分
                    </Badge>
                  ]}
                  // cover={<img src={site + v.posterKey + '.jpg?imageMongr2/thumbnail/x1680/crop/1080x1600'} />}
                  cover={<img onClick={this._onShowModal(v)} src={site + 'nqNLyBm1XdgBxoKMVWGAr' + '.jpg?imageMongr2/thumbnail/x1680/crop/1080x1600'} />}
                >
                  <Meta 
                    style={{height: '202px', overflow: 'hidden'}}
                    onClick={this._jumpToDetail}
                    title={<Link to={`/detail/${v._id}`}>{v.title}</Link>}
                    description={<Link to={`/detail/${v._id}`}>{v.summary}</Link>}
                  />
                </Card>
              </Col>
            ))
          }
        </Row>
        <Modal 
          className="videoModal"
          footer={null}
          visible={this.state.visible}
          afterClose={this._handleClose}
          onCancel={this._handleCancel}
        >
          <Spin size="large" />
        </Modal>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this._renderContent()}
      </div>
    )
  }
}