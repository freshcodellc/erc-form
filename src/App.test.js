import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import AppProviders from './context'

describe('app', () => {
  // eslint-disable-next-line jest/expect-expect
  it('renders without crashing', () => {
    expect.assertions(0)
    const div = document.createElement('div')
    ReactDOM.render(
      <AppProviders>
        <App />
      </AppProviders>,
      div
    )
    ReactDOM.unmountComponentAtNode(div)
  })
})
