import React from 'react'
import * as authClient from '../utils/auth-client'

const AuthContext = React.createContext()

function AuthProvider(props) {
  const user = JSON.parse(authClient.getUser())
  const login = form =>
    authClient.login(form).then(() => window.location.reload())
  const logout = () => authClient.logout().then(() => window.location.reload())
  return <AuthContext.Provider value={{ user, login, logout }} {...props} />
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

function withAuth(Component) {
  return function WrappedComponent(props) {
    return <Component {...props} auth={useAuth()} />
  }
}

export { AuthProvider, useAuth, withAuth }
