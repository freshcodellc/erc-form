/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import React, { useState } from 'react'
import axios from 'axios'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { navigate } from '@reach/router'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import lodashValues from 'lodash/values'
import format from 'date-fns/format'
import { validateFullName } from '../utils/validate'
import Button from '../components/ui/button'
import Checkbox from '../components/ui/forms/checkbox'
import Collapse from '../components/ui/collapse'
import EsignDoc from '../components/documents/eSign'
import FooterNav from '../components/ui/footerNav'
import FormViewer from '../components/documents/formViewer'
import Heading from '../components/ui/heading'
import Input from '../components/ui/forms/input'
import Layout from '../components/layout'
import config from '../config'
import getBankConfig from '../bankConfig'
import useAnalytics from '../components/analytics'

const bank = getBankConfig()

const initialValues = {
  forgivenessAmountAgreement: false,
  fraudAgreement: false,
  noReducedSalariesAgreement: false,
  forgivenessVerificationAgreement: false,
  lenderRequiredDocsAgreement: false,
  informationCorrectAgreement: false,
  accurateTaxDocumentsAgreement: false,
  additionalInformationAgreement: false,
  usedFullFirstDrawAgreement: false,
  noReducedEmployeesAgreement: false,
  decreasedOperationsAgreement: false,
  eSignConsent: false,
  signature: '',
  signeeInitials: '',
  signatureDate: format(new Date(), 'yyyy-MM-dd'),
  signeeTitle: '',
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
    margin-top: 0px;
    margin-bottom: 16px;
    b {
      font-weight: 500;
    }
  }
`

const text = css`
  font-size: 24px;
  margin-top: 24px !important;
`

const formWrap = css`
  width: 100%;
  max-width: 800px;
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
  margin-bottom: 16px;

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

const consentRow = css`
  & > div {
    margin: 16px 0;
  }
`

const heading = css`
  margin: 24px 0;
`

function ForgivenessCerts() {
  localStorage.removeItem('LOAN_ID')
  const app = JSON.parse(localStorage.getItem('forgivenessApp') || '{}')
  const isEZ = get(app, 'loan.funding.loan.amount', 0) > 150000
  const { colors } = useTheme()
  const [errors, setErrors] = useState({})
  const [showEsign, setShowEsign] = useState(false)
  useAnalytics()

  const validationSchema = Yup.object()
    .shape({
      forgivenessAmountAgreement: isEZ
        ? Yup.bool()
            .oneOf([true], 'Must agree.')
            .required('Required')
        : Yup.bool(),
      fraudAgreement: isEZ
        ? Yup.bool()
            .oneOf([true], 'Must agree.')
            .required('Required')
        : Yup.bool(),
      noReducedSalariesAgreement: isEZ
        ? Yup.bool()
            .oneOf([true], 'Must agree.')
            .required('Required')
        : Yup.bool(),
      forgivenessVerificationAgreement: Yup.bool()
        .oneOf([true], 'Must agree.')
        .required('Required'),
      lenderRequiredDocsAgreement: isEZ
        ? Yup.bool()
            .oneOf([true], 'Must agree.')
            .required('Required')
        : Yup.bool(),
      informationCorrectAgreement: Yup.bool()
        .oneOf([true], 'Must accept condition.')
        .required('Required'),
      accurateTaxDocumentsAgreement: isEZ
        ? Yup.bool()
            .oneOf([true], 'Must agree.')
            .required('Required')
        : Yup.bool(),
      additionalInformationAgreement: isEZ
        ? Yup.bool()
            .oneOf([true], 'Must agree.')
            .required('Required')
        : Yup.bool(),
      usedFullFirstDrawAgreement:
        app.application.draw > 1
          ? Yup.bool()
              .oneOf([true], 'Must agree.')
              .required('Required')
          : Yup.bool(),
      noReducedEmployeesAgreement: Yup.bool(),
      decreasedOperationsAgreement: Yup.bool(),
      signature: Yup.string()
        .test(
          'validateFullName',
          'Please enter first and last name',
          validateFullName
        )
        .required('Required'),
      signeeInitials: Yup.string()
        .min(1)
        .max(5)
        .required('Required'),
      signatureDate: Yup.string().required('Required'),
      signeeTitle: Yup.string().required('Required'),
      eSignConsent: Yup.bool()
        .oneOf([true], 'Must accept and sign.')
        .required('Required'),
    })
    .test('oneOfTwo', null, obj => {
      if (
        obj.noReducedEmployeesAgreement ||
        obj.decreasedOperationsAgreement ||
        !isEZ
      ) {
        return true
      }

      return new Yup.ValidationError(
        'Must check at least one',
        null,
        'noReducedEmployeesAgreement'
      )
    })

  const ruler = css`
    border: 0;
    width: 100%;
    height: 2px;
    background-color: ${colors.grey400};
  `

  const aside = css`
    margin-left: 42px;
    margin-bottom: 16px;
    line-height: 20px;
    color: ${colors.blueDark};
    font-size: 14px;
  `

  const handleCertSubmit = async (values, actions) => {
    actions.setSubmitting(true)
    setErrors({})
    const calculatorData = JSON.parse(
      localStorage.getItem('calculations') || '{}'
    )
    const auth = JSON.parse(localStorage.getItem('forgivenessAuth') || '{}')
    const appStart = JSON.parse(
      localStorage.getItem('forgivenessStart') || '{}'
    )
    const demographic = JSON.parse(
      localStorage.getItem('forgivenessDemographic') || '{}'
    )

    try {
      const response = await axios.post(`${config.API_URL}/api/forgiveness`, {
        ...values,
        ...calculatorData.values,
        ...demographic.values,
        ...appStart.values,
        form: isEZ ? '3508EZ' : '3508S',
        bank: bank.id,
        uniqueId: app.application.uniqueId,
        draw: app.application.draw,
        email: auth.values.email,
      })
      actions.setSubmitting(false)
      navigate('/forgiveness/success')
      return response
    } catch (err) {
      actions.setSubmitting(false)
      setErrors(
        get(err, 'response.data.errors', {
          first: ['Somethings went wrong, please contact your bank.'],
        })
      )
      return err.response
    }
  }

  const storedAuthInfo = JSON.parse(localStorage.getItem('authInfo'))
  const customerEmail = get(storedAuthInfo, 'values.customer.email')

  return (
    <Layout>
      <div css={formStyle}>
        <Heading size="1" align="center">
          Representations and Certifications
        </Heading>
        <p css={text}>
          By checking the boxes below, the Authorized Representative of the
          Borrower certifies to all the below Representations and Certifications
          and consents to their initials being signed next to each one.
        </p>
        <div css={formWrap}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleCertSubmit(values, actions)}
          >
            {({ handleSubmit, isSubmitting, setFieldValue, values }) => (
              <form onSubmit={handleSubmit}>
                <hr css={ruler} />
                <div css={heading}>
                  <Heading size="3">Representations and Certifications</Heading>
                </div>
                {isEZ && (
                  <React.Fragment>
                    <div css={row}>
                      <Checkbox
                        name="forgivenessAmountAgreement"
                        label="The dollar amount for which forgiveness is requested (which does not exceed the principal amount of the PPP loan):"
                      />
                    </div>
                    <div css={aside}>
                      ??? was used to pay business costs that are eligible for
                      forgiveness (payroll costs to retain employees; business
                      mortgage interest payments; business rent or lease
                      payments; business utility payments; covered operations
                      expenditures; covered property damage costs; covered
                      supplier costs; or covered worker protection
                      expenditures);
                      <br />??? includes payroll costs equal to at least 60% of
                      the forgiveness amount; and
                      <br />??? for any owner-employee (with an ownership stake of
                      5% or more) or self-employed individual/general partner,
                      does not exceed 2.5 months??? worth of compensation received
                      during the year used to calculate the PPP loan amount,
                      capped at $20,833 per individual in total across all
                      businesses.
                    </div>
                    <div css={row}>
                      <Checkbox
                        name="fraudAgreement"
                        label="I understand that if the funds were knowingly used for unauthorized purposes, the federal government may pursue recovery of loan amounts and/or civil or criminal fraud charges."
                      />
                    </div>
                    <div css={row}>
                      <Checkbox
                        name="noReducedSalariesAgreement"
                        label="The Borrower did not reduce salaries or hourly wages of any employee by more than 25 percent for any employee during the
Covered Period compared to the most recent quarter before the Covered Period. For purposes of this certification, the term
???employee??? includes only those employees that did not receive, during any single period during 2019, wages or salary at an
annualized rate of pay in an amount more than $100,000."
                      />
                    </div>
                    <div css={row}>
                      <Checkbox
                        name="forgivenessVerificationAgreement"
                        label="The Borrower has accurately verified the payments for the eligible payroll and nonpayroll costs for which the Borrower is requesting forgiveness, and has accurately calculated the forgiveness amount requested."
                      />
                    </div>
                    <div css={row}>
                      <Checkbox
                        name="lenderRequiredDocsAgreement"
                        label=" I have submitted to the Lender the required documentation verifying payroll costs, the existence of obligations and service
(as applicable) prior to February 15, 2020, and eligible business mortgage interest payments, business rent or lease payments,
business utility payments, covered operations expenditures, covered property damage costs, covered supplier costs, and
covered worker protection expenditures."
                      />
                    </div>
                    {app.application.draw > 1 && (
                      <div css={row}>
                        <Checkbox
                          name="usedFullFirstDrawAgreement"
                          label="If this application is being submitted for a Second Draw PPP Loan, the Borrower used all First Draw PPP Loan amounts on eligible expenses prior to disbursement of the Second Draw PPP Loan."
                        />
                      </div>
                    )}
                    <div css={row}>
                      <Checkbox
                        name="informationCorrectAgreement"
                        label="The information provided in this application and the information provided in all supporting documents and forms is true and correct in all material respects. I understand that knowingly making a false statement to obtain forgiveness of an SBA-guaranteed loan is punishable under the law, including 18 USC 1001 and 3571 by imprisonment of not more than five years and/or a fine of up to $250,000; under 15 USC 645 by imprisonment of not more than two years and/or a fine of not more than $5,000; and, if submitted to a Federally insured institution, under 18 USC 1014 by imprisonment of not more than thirty years and/or a fine of not more than $1,000,000."
                      />
                    </div>
                    <div css={row}>
                      <Checkbox
                        name="accurateTaxDocumentsAgreement"
                        label="The tax documents I have submitted to the Lender (if applicable) are consistent with those the Borrower has submitted
or will submit to the IRS and/or state tax or workforce agency. I also understand, acknowledge, and agree that the
Lender can share the tax information with SBA???s authorized representatives, including authorized representatives of
the SBA Office of Inspector General, for the purpose of ensuring compliance with PPP requirements and all SBA
reviews."
                      />
                    </div>
                    <div css={row}>
                      <Checkbox
                        name="additionalInformationAgreement"
                        label="I understand, acknowledge, and agree that SBA may request additional information for the purposes of evaluating the Borrower???s eligibility for the PPP loan and for loan forgiveness, and that the Borrower???s failure to provide information requested by SBA may result in a determination that the Borrower was ineligible for the PPP loan or a denial of the Borrower???s loan forgiveness application."
                      />
                    </div>

                    <React.Fragment>
                      <p>
                        In addition, the Authorized Representative of the
                        Borrower must certify by initialing at least one of the
                        following two items:
                      </p>
                      <div css={row}>
                        <Checkbox
                          name="noReducedEmployeesAgreement"
                          label="The Borrower did not reduce the number of employees or the average paid hours of employees between January 1, 2020 and
the end of the Covered Period (other than any reductions that arose from an inability to rehire individuals who were
employees on February 15, 2020, if the Borrower was unable to hire similarly qualified employees for unfilled positions on
or before December 31, 2020 (or, for a PPP loan made after December 27, 2020, before the last day of the Covered Period),
and reductions in an employee???s hours that a borrower offered to restore and were refused)."
                        />
                      </div>
                      <div css={row}>
                        <Checkbox
                          name="decreasedOperationsAgreement"
                          label="The Borrower was unable to operate between February 15, 2020, and the end of the Covered Period at the same level of
business activity as before February 15, 2020 due to compliance with requirements established or guidance issued between
March 1, 2020 and December 31, 2020 (or, for a PPP loan made after December 27, 2020, requirements established or
guidance issued before the last day of the Covered Period), by the Secretary of Health and Human Services, the Director of
the Centers for Disease Control and Prevention, or the Occupational Safety and Health Administration, related to the
maintenance of standards of sanitation, social distancing, or any other work or customer safety requirement related to
COVID-19."
                        />
                      </div>
                    </React.Fragment>
                  </React.Fragment>
                )}
                {!isEZ && (
                  <React.Fragment>
                    <div css={row}>
                      <Checkbox
                        name="forgivenessVerificationAgreement"
                        label="The Borrower has complied with all requirements in the Paycheck Protection Program Rules (Sections 7(a)(36),
(7)(a)(37), and 7A of the Small Business Act, the PPP interim final rules, and guidance issued by SBA through the date
of this application), including the rules related to:"
                      />
                    </div>
                    <div css={aside}>
                      ??? eligible uses of PPP loan proceeds;
                      <br />??? the amount of PPP loan proceeds that must be used
                      for payroll costs;
                      <br />??? the calculation and documentation of the
                      Borrower???s revenue reduction (if applicable); and
                      <br />??? the calculation of the Borrower???s Requested Loan
                      Forgiveness Amount.
                      <br />
                      <br />
                      Information regarding these requirements may be found in
                      the Form 3508S Instructions and the Paycheck Protection
                      Program Rules.
                    </div>
                    <div css={row}>
                      <Checkbox
                        name="informationCorrectAgreement"
                        label="The information provided in this application is true and correct in all material respects. I understand that knowingly making
a false statement to obtain forgiveness of an SBA-guaranteed loan is punishable under the law, including 18 U.S.C. 1001
and 3571 by imprisonment of not more than five years and/or a fine of up to $250,000; under 15 U.S.C. 645 by
imprisonment of not more than two years and/or a fine of not more than $5,000; and, if submitted to a Federally insured
institution, under 18 U.S.C. 1014 by imprisonment of not more than thirty years and/or a fine of not more than $1,000,000. "
                      />
                    </div>
                    {app.application.draw > 1 && (
                      <div css={row}>
                        <Checkbox
                          name="usedFullFirstDrawAgreement"
                          label="If this application is being submitted for a Second Draw PPP Loan, the Borrower used all First Draw PPP Loan amounts on eligible expenses prior to disbursement of the Second Draw PPP Loan."
                        />
                      </div>
                    )}
                  </React.Fragment>
                )}
                <p>
                  Following submission of this forgiveness application, the
                  Borrower must retain all records necessary to prove compliance
                  with Paycheck Protection Program Rules for four years for
                  employment records and for three years for all other records.
                  SBA may request additional information for the purposes of
                  evaluating the Borrower???s eligibility for the PPP loan and for
                  loan forgiveness, and the Borrower???s failure to provide
                  information requested by SBA may result in a determination
                  that the Borrower was ineligible for the PPP loan or in a
                  denial of the Borrower???s loan forgiveness application.
                </p>
                <p>
                  The The Borrower???s eligibility for loan forgiveness will be
                  evaluated in accordance with the Paycheck Protection Program
                  Rules. SBA may direct a lender to disapprove the Borrower???s
                  loan forgiveness application if SBA determines that the
                  Borrower was ineligible for the PPP loan.
                </p>
                <hr css={ruler} />
                <div css={heading}>
                  <Heading size="3">eSign Consent</Heading>
                </div>
                <div css={consentRow}>
                  <Checkbox
                    name="eSignConsent"
                    label="Open and sign:"
                    labelLinkText="eSign Consent"
                    onClick={e => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (values.eSignConsent) {
                        setFieldValue(e.target.name, false, true)
                      } else {
                        setShowEsign(!showEsign)
                      }
                    }}
                    onChange={e => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  />
                  <Collapse maxHeight={1000} isOpen={showEsign}>
                    <FormViewer
                      agreementName="agreement1"
                      title="eSign Consent"
                      close={() => {
                        setFieldValue('eSignConsent', false, true)
                        setShowEsign(false)
                      }}
                      checkField={() => {
                        setFieldValue('eSignConsent', true, true)
                        setShowEsign(false)
                      }}
                      clearField={() => setFieldValue('eSign', false, true)}
                    >
                      <EsignDoc email={customerEmail} />
                    </FormViewer>
                  </Collapse>
                </div>
                <hr css={ruler} />
                <div css={heading}>
                  <Heading size="3">Signature</Heading>
                </div>
                <div css={row}>
                  <Input type="text" name="signature" label="Full Name" />
                  <Input type="text" name="signeeTitle" label="Title" />
                </div>
                <div css={row}>
                  <Input type="text" name="signeeInitials" label="Initials" />
                  <Input
                    type="date"
                    name="signatureDate"
                    label="Date"
                    value={format(new Date(), 'yyyy-MM-dd')}
                    disabled
                    readOnly
                  />
                </div>
                <FooterNav>
                  <Button
                    css={buttonStyles}
                    hollow
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </Button>
                  <Button
                    css={buttonStyles}
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                </FooterNav>
                {!isEmpty(errors) && (
                  <span
                    css={css`
                      color: ${colors.orange};
                    `}
                  >
                    There was an error submitting your forgiveness application.
                    Please contact {bank.name} for assistance.
                    <p>Submission Error</p>
                    {lodashValues(errors).map((error, i) => (
                      <div key={i}>
                        {error.map((innerError, index) => (
                          <span key={index}>{innerError}</span>
                        ))}
                      </div>
                    ))}
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

export default ForgivenessCerts
