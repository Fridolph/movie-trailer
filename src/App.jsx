import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import routes from './routes'
import 'antd/dist/antd.css'
import './assets/common.sass'
import './assets/placeholder.sass'

export default class App extends Component {
  render() {
    return (
      <Switch>
        {
          routes.map(({ name, path, exact = true, component}) => (
            <Route path={path} key={name} component={component} exact={exact} />
          ))
        }
      </Switch>
    )
  }
}