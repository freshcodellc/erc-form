/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import useAnalytics from '../components/analytics'
import Layout from '../components/layout'
import getBankConfig from '../bankConfig'

const bank = getBankConfig()

const formStyle = css`
  width: 100%;
  max-width: 650px;
  padding: 0 16px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  & div form,
  & div p {
    margin-top: 24px;
    margin-bottom: 16px;
    width: 100%;
  }
`

const flexRow = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 16px 0;
  text-align: center;
`

function Paused() {
  useAnalytics()

  return (
    <Layout>
      <div css={formStyle}>
        {bank.id !== 'seattle' ? (
          <div css={flexRow}>
            Thank you for contacting us about a PPP loan.{' '}
            We are temporarily not accepting new PPP loan applications or loan forgiveness applications.{' '}
            Please contact us for more information.
          </div>
        ) : (
          <div style={{ textAlign: 'center', lineHeight: '1.4em' }}>
            Thank you for inquiring with Seattle Bank about the PPP.{' '}
            We are temporarily not accepting new PPP loan applications or loan forgiveness applications.{' '}
            Please contact us at{' '}
            <a
              style={{ textDecoration: 'underline' }}
              href="mailto:ppphelp@seattlebank.com"
            >
              ppphelp@seattlebank.com
            </a>{' '}
            with any questions.
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Paused
