/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import Heading from '../components/ui/heading'
import Layout from '../components/layout'

const formStyle = css`
  width: 100%;
  max-width: 510px;
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

function ErcSuccess() {
  localStorage.removeItem('certifications')
  localStorage.removeItem('customerInfo')
  localStorage.removeItem('businessInfo')
  localStorage.removeItem('disclosures')
  localStorage.removeItem('fileToken')
  localStorage.removeItem('application')
  setTimeout(() => localStorage.removeItem('certifications'), 3000)

  const paragraph = css`
    text-align: center;
  `
  return (
    <Layout>
      <div css={formStyle}>
        <Heading size="1" align="center">
          Success!
        </Heading>
        <div css={flexRow}>
          <p css={paragraph}>
            You have initiated the filing the Employer Retention Credit with the
            IRS. Nothing additional is needed at this time. We will be in touch
            if additional information is needed before filing.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default ErcSuccess
