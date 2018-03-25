import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import navRoutes from '../nav'
import {request} from '../lib'
import {Menu, Spin, Icon} from 'antd'

const getMenuContent = ({path, name}) => (
  <a href={path ? path : '/'} style={{color: '#fff2e8'}}>
    {name}
  </a>
)

export default class LayoutDefault extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      tip: '马上出来咯...'
    }
  }

  matchRouteName = this.props.match 
    ? navRoutes.find(e => e.name === this.props.match.params.type) 
      ? navRoutes.find(e => e.name === this.props.match.params.type).name
      : '全部'
    : navRoutes[0].name
  
  toggleLoading = (status = false, tip = '再等一下下嘛 ~') => {
    this.setState({
      tip,
      loading: status
    })
  }

  render() {
    const {children} = this.props
    const {loading, tip} = this.state
  
    return (
      <div className="flex-column">
        <Menu 
          className="menu-wrapper"
          defaultSelectedKeys={[this.matchRouteName]}
          mode="horizontal" 
          style={{fontSize: 13.5, backgroundColor: '#333'}}>
          <Menu.Item className="first-item-logo">
            <a href="/">
              <i className="avatar-me"></i>
              <span>霪霖笙箫</span>
            </a>
          </Menu.Item>
          {
            navRoutes.map((v, i) => (
              <Menu.Item className="menu-item" key={v.name}>
                {getMenuContent({...v})}
              </Menu.Item>
            ))
          }
        </Menu>
        <Spin
          spinning={loading}
          tip={tip}
          wrapperClassName="content-spin"
        >
          {children} 
        </Spin>
      </div>
    )
  }

  componentDidMount() {
    window.__LOADING__ = this.toggleLoading
  }

  componentWillUnmount() {
    window.__LOADING__ = null
  }
}