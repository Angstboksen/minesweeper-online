import React from 'react'
import ReactDOM from 'react-dom'
import Wrapper from './components/Wrapper'
import './styles/index.css'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import reducers from './reducers'
const store = createStore(reducers, applyMiddleware(logger))

ReactDOM.render(
  <Provider store={store}>
    <Wrapper />
  </Provider>,
  document.getElementById('root')
)
