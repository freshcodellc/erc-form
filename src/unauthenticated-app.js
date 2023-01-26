import React from 'react'
import { Router, Redirect } from '@reach/router'
import get from 'lodash/get'
import isUndefined from 'lodash/isUndefined'
import Auth from './screens/Auth'
import BusinessInfo from './screens/BusinessInfo'
import CustomerInfo from './screens/CustomerInfo'
import Documents from './screens/Documents'
import Disclosures from './screens/Disclosures'
import ErcAuth from './screens/ErcAuth'
import ErcRecover from './screens/ErcRecover'
import ErcConfirm from './screens/ErcConfirm'
import ForgivenessAuth from './screens/ForgivenessAuth'
import ForgivenessCalculator from './screens/ForgivenessCalculator'
import EZForgivenessCalculator from './screens/EZForgivenessCalculator'
import ForgivenessCerts from './screens/ForgivenessCerts'
import EZForgivenessCerts from './screens/EZForgivenessCerts'
import ForgivenessInfo from './screens/ForgivenessInfo'
import ForgivenessDocs from './screens/ForgivenessDocs'
import EZForgivenessDocs from './screens/EZForgivenessDocs'
import ForgivenessDemographic from './screens/ForgivenessDemographic'
import EZForgivenessDemographic from './screens/EZForgivenessDemographic'
import ForgivenessRecertify from './screens/ForgivenessRecertify'
import ForgivenessStart from './screens/ForgivenessStart'
import ForgivenessSuccess from './screens/ForgivenessSuccess'
import ForgivenessUpload from './screens/ForgivenessUpload'
import Paused from './screens/Paused'
import Recovery from './screens/Recovery'
import Success from './screens/Success'
import getBankConfig from './bankConfig'

function RedirectPaused() {
  return <Redirect to="/paused" noThrow />
}

function PausedRouter() {
  return (
    <Router>
      <Paused path="/paused" />
      <RedirectPaused default />
    </Router>
  )
}

function RedirectForgiveness() {
  return <Redirect to="/forgiveness/auth" noThrow />
}

function RedirectErc() {
  return <Redirect to="/erc/auth" noThrow />
}

function ForgivenessRouter() {
  return (
    <Router>
      <ForgivenessAuth path="/forgiveness/auth" />
      <Recovery path="/forgiveness/recover" />
      <ForgivenessCalculator path="/forgiveness/calculator" />
      <ForgivenessCerts path="/forgiveness/certs" />
      <ForgivenessInfo path="/forgiveness/info" />
      <ForgivenessDocs path="/forgiveness/docs" />
      <ForgivenessDemographic path="/forgiveness/demographic" />
      <ForgivenessStart path="/forgiveness/start" />
      <ForgivenessSuccess path="/forgiveness/success" />
      <EZForgivenessDemographic path="/forgiveness/ez/demographic" />
      <EZForgivenessCalculator path="/forgiveness/ez/calculator" />
      <EZForgivenessDocs path="/forgiveness/ez/docs" />
      <EZForgivenessCerts path="/forgiveness/ez/certs" />
      <ForgivenessRecertify path="/forgiveness/recertify" />
      <ForgivenessUpload path="/forgiveness/upload" />
      <RedirectForgiveness default />
    </Router>
  )
}

function ErcRouter() {
  return (
    <Router>
      <ErcAuth path="/erc/auth" />
      <ErcRecover path="/erc/recover" />
      <ErcConfirm path="/erc/confirm" />
      <RedirectErc default />
    </Router>
  )
}

function RedirectAuth() {
  return <Redirect to="/auth" noThrow />
}

function UnauthenticatedRouter() {
  return (
    <Router>
      <Auth path="/auth" />
      <RedirectAuth default />
    </Router>
  )
}

function UnauthenticatedApp() {
  const bank = getBankConfig()
  const auth = JSON.parse(localStorage.getItem('auth') || '{}')
  const password = get(auth, 'values.password', '')
  const isAuthenticated = password === bank.password
  const locked = !isUndefined(bank.password)

  // Uncomment to pause
  // return <PausedRouter />
  if (bank.erc) {
    return <ErcRouter />
  }
  if (bank.forgiveness) {
    return <ForgivenessRouter />
  }
  if (!bank.active) {
    return <PausedRouter />
  }
  return (
    <div>
      {!locked || isAuthenticated ? <Routes /> : <UnauthenticatedRouter />}
    </div>
  )
}

function RedirectHome() {
  // return <Redirect to="/customer-info" noThrow />
  return <Redirect to="/customer-info" noThrow />
}

export const ScrollToTop = ({ children, location }) => {
  React.useLayoutEffect(() => window.scrollTo(0, 0), [location.pathname])
  return children
}

function Routes() {
  return (
    <Router>
      <ScrollToTop path="/">
        <BusinessInfo path="/business-info" />
        <Documents path="/documents" />
        <CustomerInfo path="/customer-info" />
        <Disclosures path="/disclosures" />
        <Success path="/success" />
        <RedirectHome default />
      </ScrollToTop>
    </Router>
  )
}

export default UnauthenticatedApp
