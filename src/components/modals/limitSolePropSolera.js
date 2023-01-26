/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import PropTypes from 'prop-types'
import Button from '../ui/button'
import getBankConfig from '../../bankConfig'

const bank = getBankConfig()

const LimitSolePropSolera = ({ closeModal }) => {
  const { colors } = useTheme()

  const modalContent = css`
    margin: 16px;
  `

  const modalText = css`
    line-height: 1.2em;
    margin-bottom: 16px;
  `

  const linkText = css`
    color: ${colors.blue};
    &:hover {
      text-decoration: underline;
    }
  `

  const buttonWrap = css`
    display: flex;
    justify-content: space-between;
  `

  return (
    <div css={modalContent}>
      <p css={modalText}>
        Based on the information you've provided we recommend that you go with
        another loan provider to obtain your PPP loan. We want you to have the
        best chance possible of obtaining your loan, so we believe{' '}
        <a
          css={linkText}
          href={bank.referralUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Kabbage
        </a>{' '}
        would be a better fit for your business.
      </p>
      <div css={buttonWrap}>
        <a href={bank.referralUrl}>
          <Button>Go to Kabbage</Button>
        </a>
        <a href={bank.contactUrl}>
          <Button hollow>Contact us</Button>
        </a>
      </div>
    </div>
  )
}

LimitSolePropSolera.propTypes = { closeModal: PropTypes.func }

LimitSolePropSolera.defaultProps = { closeModal: () => null }

export default LimitSolePropSolera
