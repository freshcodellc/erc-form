/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { navigate } from '@reach/router'
import HelperText from '../components/ui/helperText'
import Button from '../components/ui/button'
import TextButton from '../components/ui/textButton'
import Heading from '../components/ui/heading'
import FooterNav from '../components/ui/footerNav'
import Input from '../components/ui/forms/input'
import Layout from '../components/layout'
import Persist from '../components/persist'
import config from '../config'
import getBankConfig from '../bankConfig'

const bank = getBankConfig()

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required(),
  uniqueId: Yup.string().required(),
})

const initialValues = {
  email: '',
  uniqueId: '',
}

const formStyle = css`
  width: 100%;
  max-width: 850px;
  padding: 0 16px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & div form {
    margin-top: 24px;
  }

  & p {
    font-weight: 300;
    line-height: 1.4em;
    margin-top: 24px;
    margin-bottom: 0;
    b {
      font-weight: 500;
    }
  }
`

const text = css`
  font-size: 24px;
`

const formWrap = css`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    & > div {
      align-self: stretch;
    }
  }
`

const row = css`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 520px) {
    flex-direction: column;
  }

  & > div {
    flex: 1 1 auto;
  }
`

const buttonStyles = {
  width: '170px',
}

function ForgivenessAuth() {
  localStorage.removeItem('LOAN_ID')
  const { colors } = useTheme()
  const [error, setError] = useState(false)

  useEffect(() => {
    localStorage.removeItem('businessInfo')
    localStorage.removeItem('calculations')
    localStorage.removeItem('certifications')
    localStorage.removeItem('customerInfo')
    localStorage.removeItem('disclosures')
    localStorage.removeItem('fileToken')
    localStorage.removeItem('forgivenessApp')
    localStorage.removeItem('forgivenessDocs')
    localStorage.removeItem('forgivenessStart')
    localStorage.removeItem('info')
  }, [])

  const handleAuthSubmit = async (values, actions) => {
    actions.setSubmitting(true)
    setError(false)
    try {
      const response = await axios.post(
        `${config.API_URL}/api/application/details`,
        { ...values, bank: bank.id }
      )
      actions.setSubmitting(false)
      localStorage.setItem('application', JSON.stringify(response.data))
      navigate('/erc/confirm')
    } catch (err) {
      actions.setSubmitting(false)
      setError(true)
      return err.response
    }
  }

  return (
    <Layout>
      <div css={formStyle}>
        <Heading size="1" align="center">
          Welcome back, time to file for that Employer Retention Credit.
        </Heading>
        <p css={text}>
          SINCE WE ALREADY PROCESSED YOUR PPP LOAN, AS WELL AS YOUR FORGIVENESS
          APPLICATION, WE SHOULD BE ABLE TO PROCESS AND SUBMIT YOUR ERC WITH
          LITTLE ADDITIONAL DATA.
        </p>
        <HelperText>
          <b>
            Please enter the email and forgiveness code associated with your PPP
            loan.
          </b>{' '}
          If you need a new code simply click the “I can’t find my code” link
          below. (When you filled out your PPP application with us you should
          have received a code to use for forgiveness. That code is 7-digits and
          is in the email confirmation you received when you submitted your PPP
          loan application.)
        </HelperText>
        <div css={formWrap}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleAuthSubmit(values, actions)}
          >
            {({ handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <div css={row}>
                  <Input type="text" name="email" label="Email" />
                  <Input
                    type="text"
                    name="uniqueId"
                    label="Enter unique code here"
                  />
                </div>
                <FooterNav>
                  <div
                    css={css`
                      text-align: center;
                    `}
                  >
                    <Button
                      css={buttonStyles}
                      type="submit"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      Submit
                    </Button>
                    <TextButton
                      onClick={() => navigate('/erc/recover')}
                      style={{ fontWeight: '700', color: colors.orange }}
                    >
                      I can't find my code?
                    </TextButton>
                  </div>
                </FooterNav>
                {error && (
                  <span
                    css={css`
                      color: ${colors.orange};
                    `}
                  >
                    The email and unique ID you entered did not match.
                  </span>
                )}
                <Persist name="forgivenessAuth" ignoreFields={['uniqueId']} />
              </form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  )
}

export default ForgivenessAuth
