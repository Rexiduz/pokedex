import React from 'react'
import ReactDOM from 'react-dom'
import reportWebVitals from 'reportWebVitals'

import App from 'App'
import Provider from 'core/provider'
import 'antd/dist/antd.css'
import 'assets/styles/global.scss'

const render = (App) => ReactDOM.render(App, document.getElementById('root'))

render(
  <Provider>
    <App />
  </Provider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
