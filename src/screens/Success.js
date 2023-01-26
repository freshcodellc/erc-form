/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import { useState } from 'react'
import Clipboard from 'react-clipboard.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { Helmet } from 'react-helmet'
import Heading from '../components/ui/heading'
import Layout from '../components/layout'
import StatusBar from '../components/ui/statusBar'
import useAnalytics from '../components/analytics'

const formStyle = css`
  width: 100%;
  max-width: 492px;
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

function Success() {
  const { colors } = useTheme()
  useAnalytics()
  const [copied, setCopied] = useState(false)
  localStorage.removeItem('certifications')
  localStorage.removeItem('customerInfo')
  localStorage.removeItem('businessInfo')
  localStorage.removeItem('disclosures')
  localStorage.removeItem('fileToken')
  setTimeout(() => localStorage.removeItem('certifications'), 3000)
  const application = JSON.parse(localStorage.getItem('application') || '{}')

  const codeBox = css`
    position: relative;
    border: 2px solid black;
    padding: 16px;
    font-size: 18px;
    display: flex;
    justify-content: space-between;
  `

  const iconStyle = css`
    margin-left: 16px;
    &:hover {
      opacity: 0.4;
    }
  `

  const copiedText = css`
    position: absolute;
    bottom: -22px;
    right: 0;
    font-size: 14px;
    color: ${colors.greenDark};
  `

  const paragraph = css`
    text-align: center;
  `
  return (
    <Layout>
      <Helmet>
        <script>
          {`gtag('event', 'conversion', {'send_to': 'AW-671371242/A2WBCOvpqM4BEOqfkcAC'});`}
        </script>
      </Helmet>
      <div css={formStyle}>
        <StatusBar steps={[1, 2, 3, 4, 5]} currentStep={5} />
        <Heading size="1" align="center">
          Success!
        </Heading>
        <div css={flexRow}>
          <p css={paragraph}>
            Below you will find your application code. You’ll need to keep it in
            order to submit your information when you apply for loan
            forgiveness. We will email you a copy of this code as well.
          </p>
          <div css={codeBox}>
            {application.unique_id}
            <Clipboard
              data-clipboard-text={application.unique_id}
              css={iconStyle}
              onSuccess={() => setCopied(true)}
            >
              <FontAwesomeIcon icon={faCopy} color={colors.blue} />
            </Clipboard>
            {copied && <span css={copiedText}>Copied!</span>}
          </div>
          <p css={paragraph}>
            This is not confirmation of your loan being funded. The financial
            institution will reach out with more details once your loan is
            funded.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default Success
