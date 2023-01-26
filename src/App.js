import React from 'react'
import ReactGA from 'react-ga'
import UnauthenticatedApp from './unauthenticated-app'
import getBankConfig from './bankConfig'

const bank = getBankConfig()
ReactGA.initialize('UA-41902480-2', {
  testMode: process.env.NODE_ENV !== 'production',
})
ReactGA.set({ site: bank.id })

function App() {
  return <UnauthenticatedApp />
}

export default App
