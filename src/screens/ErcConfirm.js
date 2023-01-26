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
import Checkbox from '../components/ui/forms/checkbox'
import FooterNav from '../components/ui/footerNav'
import Layout from '../components/layout'
import getBankConfig from '../bankConfig'

const bank = getBankConfig()

const validationSchema = Yup.object().shape({
  neverApplied: Yup.bool()
    .oneOf([true], 'You must agree before submitting.')
    .required('You must agree before submitting.')
    .typeError('Required'),
  willNotApply: Yup.bool()
    .oneOf([true], 'You must agree before submitting.')
    .required('You must agree before submitting.')
    .typeError('Required'),
})

const initialValues = {
  neverApplied: false,
  willNotApply: false,
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
  max-width: 500px;
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
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 24px;

  @media screen and (max-width: 520px) {
    flex-direction: column;
  }

  & > div {
    flex: 1 1 auto;
    font-size: 18px;
  }
`

const buttonStyles = {
  width: '170px',
}

function ErcConfirm() {
  const { colors } = useTheme()
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleAuthSubmit = async (values, actions) => {
    actions.setSubmitting(true)
    setError(false)
    try {
      // const response = await axios.post(
      //   `${config.API_URL}/api/application/details`,
      //   { ...values, bank: bank.id }
      // )
      actions.setSubmitting(false)
      setSuccess(true)
    } catch (err) {
      actions.setSubmitting(false)
      setError(true)
      return err.response
    }
  }

  return (
    <Layout>
      <div css={formStyle}>
        <p css={text}>
          <b>Looks like we have everything needed to begin processing your Employer Retention Credit.</b>
        </p>
        <HelperText>
          BECAUSE WE ALREADY GATHERED DATA FOR THE RELEVANT TIME PERIODS - 2020 AND 2021 PAYROLL RECORDS - AS PART OF YOUR PPP AND FORGIVENESS APPLICATIONS, WE HAVE EVERYTHING WE NEED TO BEGIN PROCESSING YOUR EMPLOYER RETENTION CREDIT.
        </HelperText>
        <p css={text}><b>In order for us to begin processing your Employer Retention Credit we need you to confirm that a) you have not yet filed for the Employer Retention Credit and b) once you click “File For Employer Retention Credit” below you will not file for the Employer Retention Credit with another company.</b></p>
        <div css={formWrap}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleAuthSubmit(values, actions)}
          >
            {({ handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <div css={row}>
                  <Checkbox
                    name="neverApplied"
                    label="I have not yet filed for the Employer Retention Credit"
                  />
                </div>
                <div css={row}>
                  <Checkbox
                    name="willNotApply"
                    label="I will not file for the Employer Retention Credit with another company after doing so with CARES Act SMB"
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
                      File For Employer Retention Credit
                    </Button>
                  </div>
                </FooterNav>
                {error && (
                  <span
                    css={css`
                      color: ${colors.orange};
                    `}
                  >
                    An error occurred, please try again.
                  </span>
                )}
              </form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  )
}

export default ErcConfirm
