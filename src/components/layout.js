/** @jsx jsx */
import PropTypes from 'prop-types'
import { Global, css, jsx } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import isNull from 'lodash/isNull'
import Header from './header'
import Toast from './ui/toast'
import getBankConfig from '../bankConfig'

const Layout = ({ children }) => {
  const { colors, fonts } = useTheme()
  const bank = getBankConfig()
  const content = css`
    margin-top: 5px;
    padding: 64px 0;
    background-color: ${colors.grey0};
    min-height: calc(100vh - 58px);

    & img {
      max-width: 150px;
      margin: 0 auto;
    }
  `

  const logoWrap = css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 24px;
  `
  return (
    <div className="app">
      <Global
        styles={css`
          *,
          *:before,
          *:after {
            box-sizing: border-box;
            font-family: ${fonts.primary};
          }
          html,
          body {
            font-style: normal;
            padding: 0;
            margin: 0;
          }
        `}
      />
      <Header />
      <div>
        <div css={content}>
          {!isNull(bank.logo) && (
            <div css={logoWrap}>
              <img src={bank.logo} alt={bank.name} />
            </div>
          )}
          {children}
        </div>
        <Toast />
      </div>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

Layout.defaultProps = {
  children: null,
}

export default Layout
