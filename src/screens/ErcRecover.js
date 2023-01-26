/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import { useState } from 'react'
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
import useAnalytics from '../components/analytics'

const bank = getBankConfig()

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required(),
})

const initialValues = {
  email: '',
}

const formStyle = css`
  width: 100%;
  max-width: 492px;
  padding: 0 16px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  & div form {
    margin-top: 24px;
  }
`

const formWrap = css`
  width: 100%;
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

function Recovery() {
  localStorage.removeItem('application')
  const { colors } = useTheme()
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  useAnalytics()

  const handleLoginSubmit = async (values, actions) => {
    actions.setSubmitting(true)
    setError(false)
    try {
      const response = await axios.post(
        `${config.API_URL}/api/forgiveness/recover-loan-id`,
        { ...values, bank: bank.id }
      )
      actions.setSubmitting(false)

      if (response.data.success) {
        setSuccess(true)
      } else {
        setError(true)
      }

      return response
    } catch (err) {
      actions.setSubmitting(false)
      return err.response
    }
  }

  return (
    <Layout>
      <div css={formStyle}>
        <Heading size="1" align="center">
          Recover Unique ID
        </Heading>
        <HelperText>
          Enter the email address you applied for the loan with and we will send
          you your unique ID number.
        </HelperText>
        <div css={formWrap}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleLoginSubmit(values, actions)}
          >
            {({ handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <div css={row}>
                  <Input type="email" name="email" label="Email" />
                </div>
                <FooterNav>
                  <div
                    css={css`
                      text-align: center;
                    `}
                  >
                    {!success && (
                      <Button
                        css={buttonStyles}
                        type="submit"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        Submit
                      </Button>
                    )}
                    {success && (
                      <div
                        css={css`
                          color: ${colors.greenDark};
                        `}
                      >
                        Success! Please check your email for further
                        instructions.
                      </div>
                    )}
                    {error && (
                      <div
                        css={css`
                          color: ${colors.orange};
                        `}
                      >
                        We couldn't find any loan applications associated with
                        the email address you provided.
                      </div>
                    )}

                    <TextButton onClick={() => navigate('/erc/auth')}>
                      Enter Unique ID
                    </TextButton>
                  </div>
                </FooterNav>
                {error && (
                  <span
                    css={css`
                      color: ${colors.orange};
                    `}
                  >
                    The password you entered was incorrect.
                  </span>
                )}
                <Persist name="recovery" />
              </form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  )
}

export default Recovery
