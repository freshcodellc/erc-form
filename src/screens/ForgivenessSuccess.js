/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import Heading from '../components/ui/heading'
import Layout from '../components/layout'
import useAnalytics from '../components/analytics'
import getBankConfig from '../bankConfig'

const bank = getBankConfig()

const formStyle = css`
  width: 100%;
  max-width: 800px;
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
  }
`

const flexRow = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
`

function ForgivenessSuccess() {
  useAnalytics()
  localStorage.removeItem('businessInfo')
  localStorage.removeItem('calculations')
  localStorage.removeItem('certifications')
  localStorage.removeItem('customerInfo')
  localStorage.removeItem('disclosures')
  localStorage.removeItem('fileToken')
  localStorage.removeItem('forgivenessAuth')
  localStorage.removeItem('forgivenessApp')
  localStorage.removeItem('forgivenessDocs')
  localStorage.removeItem('forgivenessStart')
  localStorage.removeItem('info')
  setTimeout(() => localStorage.removeItem('certifications'), 3000)

  const paragraph = css`
    text-align: center;
  `
  return (
    <Layout>
      <div css={formStyle}>
        <Heading size="1" align="center">
          Forgiveness application submitted!
        </Heading>
        <div css={flexRow}>
          <p css={paragraph}>
            Your forgiveness application has been submitted to {bank.name}.
            We’ll be in touch if there’s anything additional needed.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default ForgivenessSuccess
