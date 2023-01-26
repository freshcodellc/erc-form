/** @jsx jsx */
import { css, jsx } from '@emotion/core'

const FooterNav = ({ children }) => {
  const navStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 16px 0;

    & button {
      margin: 8px;
    }
  `
  return <div css={navStyle}>{children}</div>
}

export default FooterNav
