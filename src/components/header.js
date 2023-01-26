/** @jsx jsx */
import { css, jsx } from '@emotion/core'

const Header = props => {
  const wrap = css`
    padding-top: 2.3vw;
    padding-bottom: 2.3vw;
    padding-left: 3vw;
    padding-right: 3vw;
  `

  const base = css`
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1200px;
    box-sizing: border-box;
    margin: 0 auto;

    pointer-events: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media screen and (max-width: 520px) {
      flex-direction: column;
    }
  `

  const title = css`
    font-weight: 500;
    font-style: normal;
    letter-spacing: 0em;
    text-transform: none;
    line-height: 1.4em;
    font-size: 2rem;
    text-decoration: none;
  `

  const textLink = css`
    font-family: Poppins;
    font-weight: 300;
    font-style: normal;
    letter-spacing: 0em;
    text-transform: none;
    line-height: 1.8em;
    font-size: 1rem;
    margin-left: 1.2vw;
  `

  return (
    <header css={wrap} {...props}>
      <div css={base}>
        <a href="https://caresactsmb.com" css={title}>
          CARES Act SMB
        </a>
        <div>
          <a href="https://caresactsmb.com/erc-credit" css={textLink}>
            ERC Credit
          </a>
          <a href="https://caresactsmb.com/faq" css={textLink}>
            PPP
          </a>
        </div>
      </div>
    </header>
  )
}

Header.propTypes = {}

Header.defaultProps = {}

export default Header
