import React from 'react'
import PropTypes from 'prop-types'
import { Global, css } from '@emotion/core'
import { useTheme, ThemeProvider } from 'emotion-theming'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { AuthProvider } from './auth'
import { ToastProvider } from './toast'
import theme from '../theme'

const Globals = () => {
  const { colors, fonts } = useTheme()
  return (
    <Global
      styles={css`
        *,
        *:before,
        *:after {
          box-sizing: inherit;
        }
        h1 {
          font-family: ${fonts.primary};
        }
        html,
        body {
          font-style: normal;
          padding: 0;
          margin: 0;
          color: ${colors.blueDark};
        }
      `}
    />
  )
}

function AppProviders({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <Globals />
      <GoogleReCaptchaProvider reCaptchaKey="6LcQSOYUAAAAAC5Jyyp0K_7IgvKHPpyRn1s8YXBh">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </GoogleReCaptchaProvider>
    </ThemeProvider>
  )
}

AppProviders.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

AppProviders.defaultProps = {
  children: null,
}

export default AppProviders
