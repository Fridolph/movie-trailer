import React from 'react'
import {render} from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const rootElem = document.getElementById('app')

render(
  <div>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </div>,
  rootElem
)