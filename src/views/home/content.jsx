import React, {Component} from 'react'
import moment from 'moment'
import {Link} from 'react-router-dom'
import {Card, Row, Col, Badge, Icon} from 'antd'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const site = 'http://p5tt9e7en.bkt.clouddn.com/'

export default class Content extends Component {

  _renderContent = () => {
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
                  cover={<img src={site + v.posterKey + '?imageMongr2/thumbnail/x1680/crop/1080x1600'} />}
                >
                  <Meta 
                    style={{height: '202px', overflow: 'hidden'}}
                    title={<Link to={`/detail/${v._id}`}>{v.title}</Link>}
                    description={<Link to={`/detail/${v._id}`}>{v.summary}</Link>}
                  />
                </Card>
              </Col>
            ))
          }
        </Row>
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