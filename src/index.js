import React from 'react'
import ReactDOM from 'react-dom'
import { Helmet } from 'react-helmet'
import './reset.css'
import App from './App'
import AppProviders from './context'
import * as serviceWorker from './serviceWorker'
import getBankConfig from './bankConfig'

ReactDOM.render(
  <AppProviders>
    <Helmet>
      {getBankConfig().id === 'seattle' && (
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-671371242"
        />
      )}
      {getBankConfig().id === 'seattle' && (
        <script>
          {`window.dataLayer = window.dataLayer || []; function gtag() { dataLayer.push(arguments); } gtag('js', new Date()); gtag('config', 'AW-671371242');`}
        </script>
      )}
    </Helmet>
    <App />
  </AppProviders>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
