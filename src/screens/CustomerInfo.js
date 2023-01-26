/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import React, { useEffect, useState } from 'react'
import { useTheme } from 'emotion-theming'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { navigate } from '@reach/router'
import get from 'lodash/get'
import HelperText from '../components/ui/helperText'
import { normalizePhone } from '../utils/validate'
import Button from '../components/ui/button'
import Heading from '../components/ui/heading'
import FooterNav from '../components/ui/footerNav'
import Input from '../components/ui/forms/input'
import Layout from '../components/layout'
import Persist from '../components/persist'
import StatusBar from '../components/ui/statusBar'
import getBankConfig from '../bankConfig'
import Radio from '../components/ui/forms/radio'
import useAnalytics from '../components/analytics'
import Modal from '../components/ui/modal'
import LimitSolePropSolera from '../components/modals/limitSolePropSolera'

const bank = getBankConfig()

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const validationSchema = Yup.object().shape({
  customer: Yup.object().shape({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
    phone: Yup.string()
      .min(12, 'Phone must be at least 10 digits')
      .matches(phoneRegExp, {
        message: 'Please enter valid number.',
        excludeEmptyString: false,
      })
      .required('Required'),
    isBankCustomer: Yup.string()
      .oneOf(['yes', 'no'])
      .required('Required'),
    passcode:
      bank.id === 'seattle' ? Yup.string().required('Required') : Yup.string(),
    isLoanEstimateBelowLimit:
      bank.id === 'seattle' ? Yup.string().required('Required') : Yup.string(),
  }),
})

const initialValues = {
  customer: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isBankCustomer: '',
    passcode: '',
    isLoanEstimateBelowLimit: '',
  },
}

const introStyle = css`
  width: 100%;
  max-width: 800px;
  padding: 0 16px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`

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

function CustomerInfo() {
  const { colors } = useTheme()
  const [showModal, setShowModal] = useState(false)
  localStorage.removeItem('application')
  useAnalytics()

  useEffect(() => {
    const customerInfo = JSON.parse(localStorage.getItem('customerInfo'))
    const isLoanEstimateBelowLimit = get(
      customerInfo,
      'values.customer.isLoanEstimateBelowLimit',
      false
    )
    if (
      bank.id.indexOf('seattle') >= 0 &&
      bank.limitSoleProps &&
      isLoanEstimateBelowLimit === 'yes'
    ) {
      setShowModal(true)
    }
  }, [])

  const flexRow = css`
    display: flex;
    align-items: center;
    margin: 16px 0;

    @media screen and (max-width: 640px) {
      flex-direction: column;
      flex-flow: column-reverse;
      align-items: flex-start;

      & > div {
        margin: 4px 0px 4px 16px;
      }
    }

    & p {
      border-left: 2px solid ${colors.blueDark};
      margin-left: 8px;
      padding-left: 12px;

      @media screen and (max-width: 640px) {
        margin-bottom: 8px;
      }
    }
  `

  const handleInfoSubmit = async (values, actions) => {
    actions.setSubmitting(true)
    if (
      bank.id.indexOf('seattle') >= 0 &&
      bank.limitSoleProps &&
      values.customer.isLoanEstimateBelowLimit === 'yes'
    ) {
      setShowModal(true)
    } else {
      if (bank.id === 'seattle') {
        window.gtag('event', 'conversion', {
          send_to: 'AW-671371242/Xm8XCIb54M4BEOqfkcAC',
        })
      }
      navigate('business-info')
    }
    actions.setSubmitting(false)
  }

  return (
    <Layout>
      <div css={introStyle}>
        <StatusBar steps={[1, 2, 3, 4, 5]} currentStep={1} />
        <Heading size="1" align="center">
          Paycheck Protection Program Application
        </Heading>
        <HelperText>
          SBA is collecting the requested information in order to make a loan
          under SBA's Paycheck Protection Program to the qualified entities
          listed in this application that are impacted by the Coronavirus
          (COVID-19). The information will be used in determining whether the
          applicant is eligible for a loan. If you do not submit all the
          information requested, your loan cannot be fully processed.
        </HelperText>
        <HelperText>
          The Applicant understands that the SBA is relying upon the
          self-certifications contained in this application to verify that the
          Applicant is an eligible entity to receive the advance, and that the
          Applicant is providing this self-certification under penalty of
          perjury pursuant to 28 U.S.C. 1746 for verification purposes.
        </HelperText>
      </div>
      <div css={formStyle}>
        <Heading size="1" align="center">
          Customer Info
        </Heading>
        <div css={formWrap}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleInfoSubmit(values, actions)}
          >
            {({ handleSubmit, isSubmitting, setFieldValue, values }) => (
              <form onSubmit={handleSubmit}>
                <div css={row}>
                  <Input
                    type="text"
                    name="customer.firstName"
                    label="First Name"
                  />
                  <Input
                    type="text"
                    name="customer.lastName"
                    label="Last Name"
                  />
                </div>
                <div css={row}>
                  <Input type="text" name="customer.email" label="Email" />
                  <Input
                    type="text"
                    name="customer.phone"
                    label="Phone"
                    onChange={e =>
                      setFieldValue(
                        e.target.name,
                        normalizePhone(e.target.value),
                        false
                      )}
                  />
                </div>
                {bank.id === 'seattle' && (
                  <React.Fragment>
                    <HelperText>
                      Please provide a security code or password you will
                      remember that we can use to help identify you if needed.
                    </HelperText>
                    <div css={row}>
                      <Input
                        type="text"
                        name="customer.passcode"
                        label="Passcode"
                      />
                    </div>
                  </React.Fragment>
                )}
                <div css={flexRow}>
                  <Radio
                    id="isBankCustomer-yes"
                    name="customer.isBankCustomer"
                    label="Yes"
                    value="yes"
                    checked={values.customer.isBankCustomer === 'yes'}
                  />
                  <Radio
                    id="isBankCustomer-no"
                    name="customer.isBankCustomer"
                    label="No"
                    value="no"
                    checked={values.customer.isBankCustomer === 'no'}
                  />
                  <p>
                    Is the company you’re applying on behalf of a customer of{' '}
                    {bank.name}?
                  </p>
                </div>
                {bank.id === 'seattle' && (
                  <div css={flexRow}>
                    <Radio
                      id="isLoanEstimateBelowLimit-yes"
                      name="customer.isLoanEstimateBelowLimit"
                      label="Yes"
                      value="yes"
                      checked={
                        values.customer.isLoanEstimateBelowLimit === 'yes'
                      }
                    />
                    <Radio
                      id="isLoanEstimateBelowLimit-no"
                      name="customer.isLoanEstimateBelowLimit"
                      label="No"
                      value="no"
                      checked={
                        values.customer.isLoanEstimateBelowLimit === 'no'
                      }
                    />
                    <p>
                      Do you estimate your loan to be less than $50,000? (A
                      simple way to estimate your loan value is to multiply your
                      monthly payroll for W-2 employees by 2.5)
                    </p>
                  </div>
                )}
                <FooterNav>
                  <Button
                    css={buttonStyles}
                    hollow
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Continue
                  </Button>
                </FooterNav>
                <Persist name="customerInfo" />
                {bank.limitSoleProps && (
                  <Modal
                    disableClose
                    isOpen={showModal}
                    onCloseClicked={() => null}
                  >
                    <LimitSolePropSolera closeModal={() => null} />
                  </Modal>
                )}
              </form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  )
}

export default CustomerInfo
