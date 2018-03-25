import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import routes from './routes'
// import Home from './views/home'
import './assets/common.sass'

export default class App extends Component {
  render() {
    return (
      <Switch>
        {
          routes.map(item => (
            <Route path={item.path} key={item.name} component={item.component} exact={true} />
          ))
        }
      </Switch>
    )
  }
}