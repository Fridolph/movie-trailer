import React, {Component} from 'react'
import {Menu, Spin} from 'antd'
import {Link} from 'react-router-dom'
import navRoutes from '../nav'

const getMenuContent = ({path, name}) => (
  <a href={path ? path : '/'} style={{color: '#fff2e8'}}>
    {name}
  </a>
)

export default class LayoutDefault extends Component {
  matchRouteName = this.props.match 
    ? navRoutes.find(e => e.name === this.props.match.params.type) 
      ? navRoutes.find(e => e.name === this.props.match.params.type).name
      : '全部'
    : navRoutes[0].name
  
  toggleLoading = (stats = false, tip = '再等一下下嘛 ~') => {
    this.setState({
      tip,
      loading: stats
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      tip: '马上出来咯...'
    }
  }

  render() {
    const Item = Menu.Item
    const {children} = this.props
    const {loading, tip} = this.state
    const styles = {
      marginLeft: 24,
      marginRight: 30,
      fontSize: 18,
      textAlign: 'center',
      color: '#fff !important',
      float: 'left'
    }

    return (
      <div className="flex-column" style={{width: '100%', height: '100%'}}>
        <Menu 
          defaultSelectedKeys={[this.matchRouteName]}
          mode="horizontal" 
          style={{fontSize: 13.5, backgroundColor: '#333'}}>
          <Item style={styles}>
            <a href="/" className="hover-scale logo-text" style={{color: '#fff2e8'}}>电影预告片网站</a>
          </Item>
        </Menu>
        <Spin
          spinning={loading}
          tip={tip}
          wrapperClassName="content-spin full"
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
    window.__LOADING__ = this.toggleLoading
  }
}