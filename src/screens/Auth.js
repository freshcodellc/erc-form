/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import { useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import HelperText from '../components/ui/helperText'
import Button from '../components/ui/button'
import Heading from '../components/ui/heading'
import FooterNav from '../components/ui/footerNav'
import Input from '../components/ui/forms/input'
import Layout from '../components/layout'
import Persist from '../components/persist'
import getBankConfig from '../bankConfig'
import useAnalytics from '../components/analytics'

const bank = getBankConfig()

const validationSchema = Yup.object().shape({
  password: Yup.string().required(),
})

const initialValues = {
  password: '',
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

function Auth() {
  localStorage.removeItem('application')
  const { colors } = useTheme()
  const [error, setError] = useState(false)
  useAnalytics()

  const handleLoginSubmit = async (values, actions) => {
    actions.setSubmitting(true)
    setError(false)
    if (values.password === bank.password) {
      window.location.reload()
    } else {
      setError(true)
    }
    actions.setSubmitting(false)
  }

  return (
    <Layout>
      <div css={formStyle}>
        <Heading size="1" align="center">
          Password Required
        </Heading>
        <HelperText>
          Enter your password below to gain access to the pre-application
          process.
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
                  <Input type="password" name="password" label="Password" />
                </div>
                <FooterNav>
                  <Button
                    css={buttonStyles}
                    hollow
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
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
                <Persist name="auth" />
              </form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  )
}

export default Auth
