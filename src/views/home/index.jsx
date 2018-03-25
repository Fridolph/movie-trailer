import React, {Component} from 'react'
import Layout from '../../layout/default'
import {Menu} from 'antd'
import { request } from '../../lib'
import Content from './content'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedKey: '',
      years: ['2018', '2017', '2016', '2015', '2014'],
      type: this.props.match.params.type,
      year: this.props.match.params.year,
      movies: []
    }
  }  

  _renderContent = () => {
    const {movies} = this.state

    if (!movies || !movies.length) return null

    return (
      <Content movies={movies} />
    )
  }

  _getAllMovies = () => {
    const {type, year} = this.state
    request(window.__LOADING__)({
      method: 'get',
      url: `/api/v0/movies?type=${type || ''}&year=${year || ''}`
    }).then(res => {
      this.setState({
        movies: res
      })
    }).catch(err => {
      this.setState({
        movies: []
      })
    })
  }

  _selectItem = ({ key }) => {
    this.setState({
      selectedKey: key
    })
  }

  render() {
    const {year, years, selectedKey} = this.state
    const menuStyle = {height: '100%', overflow: 'hidden', overflowY: 'auto', width: '230px'}

    return (
      <Layout {...this.props}>
        <div className="flex-row full">
          <Menu
            className="align-self-start"
            defaultSelectedKeys={[selectedKey]}
            mode="inline"
            style={menuStyle}
            onSelect={this._selectItem}
          >
            {
              years && years.length
                ? years.map((v, i) => (
                  <Menu.Item key={i}>
                    <a href={`/year/${v}`}>{v} 年上映</a>
                  </Menu.Item>
                ))
                : null
            }
          </Menu>

          <div className="flex-1 align-self-start content-wrapper">
            {this._renderContent()}
          </div>
        </div>  
      </Layout>
    )
  }

  componentDidMount() {
    this._getAllMovies()
  }
}