/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import React, { useState } from 'react'
import { Formik, FieldArray, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { navigate } from '@reach/router'
import get from 'lodash/get'
import isUndefined from 'lodash/isUndefined'
import { formatCurrency } from '../utils/helpers'
import getBankConfig from '../bankConfig'
import HelperText from '../components/ui/helperText'
import Button from '../components/ui/button'
import Heading from '../components/ui/heading'
import FooterNav from '../components/ui/footerNav'
import AsyncFileInput from '../components/ui/forms/asyncFileInput'
import Layout from '../components/layout'
import Persist from '../components/persist'
import useAnalytics from '../components/analytics'
import plusIcon from '../images/icons/plus.svg'

const initialValues = {
  form941: [''],
  scheduleC: [''],
  payrollStatements: [''],
  healthcareDocumentation: [''],
  retirementDocumentation: [''],
  stateTaxDocumentation: [''],
  ownerPayrollDocumentation: [''],
  fullTimeEmployeeDocumentation: [''],
  mortgageInterest: [''],
  rentLeasePayments: [''],
  utilityPayments: [''],
}

const formStyle = css`
  width: 100%;
  max-width: 800px;
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

const flexRow = css`
  display: flex;
  align-items: center;
  margin: 24px 0;
`

const inputColumn = css`
  flex: 5;
`

const buttonStyles = {
  width: '170px',
}

function ForgivenessDocs() {
  const bank = getBankConfig()
  const app = JSON.parse(localStorage.getItem('forgivenessApp') || '{}')
  const appInfo = JSON.parse(localStorage.getItem('info') || '{}')
  const appCalc = JSON.parse(localStorage.getItem('calculations') || '{}')
  const { colors } = useTheme()
  const [error, setError] = useState(false)
  useAnalytics()

  const handleDocumentSubmit = async (values, actions) => {
    actions.setSubmitting(true)
    setError(false)
    navigate('/forgiveness/ez/certs')
    actions.setSubmitting(false)
  }

  const plus = css`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    background-color: white;
    transition: all 0.3s ease-in-out;
    border: 1px solid ${colors.grey200};
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    border-top: none;

    &:hover {
      cursor: pointer;
      background-color: ${colors.grey200};
    }

    & img {
      width: 16px;
      height: 16px;
      margin: 8px;
    }
  `

  const label = css`
    display: block;
    font-size: 18px;
    color: ${colors.blueDark};
    flex: 3;
    margin-right: 8%;
  `

  const subtext = css`
    display: block;
    color: ${colors.blueDark};
    font-size: 11px;
    margin-top: 4px;
    & a {
      color: ${colors.blue};
      &:hover {
        text-decoration: underline;
      }
    }
  `

  const boldText = css`
    font-size: 12px;
    margin-top: 12px;
    display: block;
  `

  const listIndent = css`
    margin-left: 32px;

    & > li {
      margin-bottom: 8px;
    }
  `

  const orDivider = css`
    display: block;
    font-size: 16px;
    font-weight: bold;
    color: ${colors.blueDark};
    position: relative;
    width: 100%;
    text-align: center;
    z-index: 1;
    margin-top: 12px;

    &:before {
      content: '';
      position: absolute;
      top: 7px;
      left: 0;
      height: 2px;
      width: calc(50% - 30px);
      background-color: ${colors.grey400};
      z-index: 0;
    }

    &:after {
      content: '';
      position: absolute;
      top: 7px;
      right: 0;
      height: 2px;
      width: calc(50% - 30px);
      background-color: ${colors.grey400};
      z-index: 0;
    }
  `

  const ruler = css`
    border: 0;
    width: 100%;
    height: 2px;
    background-color: ${colors.grey400};
  `

  const subheading = css`
    font-size: 16px;
    margin-top: 8px;
  `

  const note = css`
    font-size: 14px;
    font-style: italic;
    margin-top: 8px;
  `

  const emphasis = css`
    color: ${colors.red};
    font-weight: bold;
  `

  const errorText = css`
    font-size: 13px;
    font-weight: bold;
    color: ${colors.orange};
  `

  const line1 = parseFloat(get(appCalc, 'values.payrollCost', '0'))
  const line2 = parseFloat(get(appCalc, 'values.employeePayrollCosts', '0'))
  const line2mortgage = parseFloat(get(appCalc, 'values.mortgageInterest', '0'))
  const line3 = parseFloat(get(appCalc, 'values.rentLeasePayment', '0'))
  const line4util = parseFloat(get(appCalc, 'values.utilityPayment', '0'))
  const line6 = parseFloat(get(appCalc, 'values.healthcareCosts', '0'))
  const line6fte = parseFloat(get(appCalc, 'values.employeePayrollCosts', '0'))
  const line7 = parseFloat(get(appCalc, 'values.retirementPlanCosts', '0'))
  const line8 = parseFloat(get(appCalc, 'values.employerTaxCosts', '0'))
  const line9 = parseFloat(get(appInfo, 'values.ownerEmployeeCosts', '0'))

  const employeePayrollCost = line1
  const isEZ = get(app, 'loan.funding.loan.amount', 0) > 150000

  const showSection1 = !isEZ || employeePayrollCost > 0
  const showSection2 = !isEZ || (line6 > 0 && line2 + line6fte > 0)
  const showSection3 = !isEZ || (line7 > 0 && line2 + line6fte > 0)
  const showSection4 = !isEZ || (line8 > 0 && line2 + line6fte > 0)
  const showSection5 = !isEZ || (line9 > 0 && line2 + line6fte > 0)
  const showSection7 = !isEZ || line2mortgage > 0
  const showSection8 = !isEZ || line3 > 0
  const showSection9 = !isEZ || line4util > 0

  const requiredSchema = Yup.array()
    .of(
      Yup.string()
        .min(1, 'Required')
        .required('Required')
    )
    .min(1, 'Required')
    .required('Required')

  const optionalSchema = Yup.array()

  const validationSchema = Yup.object().shape({
    form941: showSection1 ? requiredSchema : optionalSchema,
    scheduleC: optionalSchema,
    payrollStatements: showSection1 ? requiredSchema : optionalSchema,
    healthcareDocumentation: showSection2 ? requiredSchema : optionalSchema,
    retirementDocumentation: showSection3 ? requiredSchema : optionalSchema,
    stateTaxDocumentation: showSection4 ? requiredSchema : optionalSchema,
    ownerPayrollDocumentation: showSection5 ? requiredSchema : optionalSchema,
    fullTimeEmployeeDocumentation: optionalSchema,
    mortgageInterest: showSection7 ? requiredSchema : optionalSchema,
    rentLeasePayments: showSection8 ? requiredSchema : optionalSchema,
    utilityPayments: showSection9 ? requiredSchema : optionalSchema,
  })

  const validationSchemaSimple = Yup.object()
    .shape({
      form941: optionalSchema,
      scheduleC: optionalSchema,
      payrollStatements: optionalSchema,
      healthcareDocumentation: optionalSchema,
      retirementDocumentation: optionalSchema,
      stateTaxDocumentation: optionalSchema,
      ownerPayrollDocumentation: optionalSchema,
      fullTimeEmployeeDocumentation: optionalSchema,
      mortgageInterest: optionalSchema,
      rentLeasePayments: optionalSchema,
      utilityPayments: optionalSchema,
    })
    .test('oneOfThree', null, obj => {
      const form941val = isUndefined(get(obj, 'form941', [])[0])
        ? ''
        : obj.form941[0]
      const scheduleCval = isUndefined(get(obj, 'scheduleC', [])[0])
        ? ''
        : obj.scheduleC[0]
      const payrollStatementsval = isUndefined(
        get(obj, 'payrollStatements', [])[0]
      )
        ? ''
        : obj.payrollStatements[0]
      if (
        form941val.length ||
        scheduleCval.length ||
        payrollStatementsval.length ||
        isEZ
      ) {
        return true
      }

      return new Yup.ValidationError(
        'Must upload at least one supporting payroll document',
        null,
        'form941'
      )
    })

  return (
    <Layout>
      <div css={formStyle}>
        <Heading size="1" align="center">
          Documentation
        </Heading>
        {isEZ && (
          <React.Fragment>
            <HelperText>
              For those borrowers with loan amounts greater than $150,000,
              payroll documentation is required.
            </HelperText>
            <ul css={listIndent}>
              <li>
                Please pay close attention to the specific document requirements
                for each category. Any item that you input a number (other than
                $0) on the prior screen requires a supporting document to be
                uploaded.
              </li>
              <li>
                Click the + sign if you need to upload more than one document
                for the particular item.
              </li>
              <li>
                If you have questions about the documentation requirements,
                please email <a href={`mailto:${bank.email}`}>{bank.email}</a>
              </li>
            </ul>
          </React.Fragment>
        )}
        {!isEZ && (
          <React.Fragment>
            <HelperText>
              You’ll need to provide documentation to support your forgiveness
              amount. The SBA may ask us for this information before approving
              your loan for forgiveness. Please refer to the{' '}
              <a
                href="https://www.sba.gov/document/support-ppp-loan-forgiveness-form-3508s-instructions"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: colors.orange, textDecoration: 'underline' }}
              >
                3508S instructions
              </a>{' '}
              to ensure you upload the minimum required documents. Failure to
              meet the minimum requirement could impact your forgiveness amount.
              Please ensure you upload documents to the correct sections below
              so that our records stay well organized.{' '}
            </HelperText>
            <HelperText>
              You MUST upload at least one supporting payroll document in order
              to submit your application. If you are unsure what to upload,
              please email us at{' '}
              <a
                href={`mailto:${bank.email}`}
                style={{ color: colors.orange, textDecoration: 'underline' }}
              >
                {bank.email}
              </a>
            </HelperText>
            <HelperText>
              If you are a sole proprietor/single-owner LLC and don’t have
              “payroll” please upload your final Schedule C from your 2019 tax
              return under the “Schedule C” section below.
            </HelperText>
          </React.Fragment>
        )}
        <div css={formWrap}>
          <Formik
            initialValues={initialValues}
            validationSchema={isEZ ? validationSchema : validationSchemaSimple}
            onSubmit={(values, actions) =>
              handleDocumentSubmit(values, actions)}
          >
            {({ handleSubmit, isSubmitting, setFieldValue, values }) => (
              <form onSubmit={handleSubmit}>
                {showSection1 && (
                  <React.Fragment>
                    <div css={flexRow}>
                      <div>
                        <Heading size="2">Payroll</Heading>
                        <span css={errorText}>
                          <ErrorMessage name="form941" />
                        </span>
                        {isEZ && (
                          <h3 css={subheading}>
                            Amount to substantiate:{' '}
                            <span css={emphasis}>
                              {formatCurrency(employeePayrollCost)}
                            </span>
                          </h3>
                        )}
                      </div>
                    </div>
                    <hr css={ruler} />
                    <div css={flexRow}>
                      <span css={label}>
                        Quarterly Federal Tax Returns (Form 941’s) for ALL
                        quarters during your Covered Period
                      </span>
                      <FieldArray
                        name="form941"
                        render={arrayHelpers => (
                          <div css={inputColumn}>
                            {values.form941 &&
                              values.form941.length > 0 &&
                              values.form941.map((form941File, index) => (
                                <AsyncFileInput
                                  key={index}
                                  type="file"
                                  name={`form941.${index}`}
                                  label="Click here to choose your file to upload."
                                  setFieldValue={setFieldValue}
                                  onDeleteClick={() =>
                                    arrayHelpers.remove(index)}
                                  canDelete={index > 0}
                                />
                              ))}
                            {values.form941[0].length > 0 && (
                              <button
                                css={plus}
                                type="button"
                                onClick={() => arrayHelpers.push('')}
                              >
                                <img src={plusIcon} alt="upload new file" />
                              </button>
                            )}
                          </div>
                        )}
                      />
                    </div>
                    {!isEZ && (
                      <React.Fragment>
                        <hr css={ruler} />
                        <div css={flexRow}>
                          <span css={label}>
                            Schedule C from 2019 tax return
                          </span>
                          <FieldArray
                            name="scheduleC"
                            render={arrayHelpers => (
                              <div css={inputColumn}>
                                {values.scheduleC &&
                                  values.scheduleC.length > 0 &&
                                  values.scheduleC.map(
                                    (scheduleCFile, index) => (
                                      <AsyncFileInput
                                        key={index}
                                        type="file"
                                        name={`scheduleC.${index}`}
                                        label="Click here to choose your file to upload."
                                        setFieldValue={setFieldValue}
                                        onDeleteClick={() =>
                                          arrayHelpers.remove(index)}
                                        canDelete={index > 0}
                                      />
                                    )
                                  )}
                                {values.scheduleC[0].length > 0 && (
                                  <button
                                    css={plus}
                                    type="button"
                                    onClick={() => arrayHelpers.push('')}
                                  >
                                    <img src={plusIcon} alt="upload new file" />
                                  </button>
                                )}
                              </div>
                            )}
                          />
                        </div>
                      </React.Fragment>
                    )}
                    <hr css={ruler} />
                    <div css={flexRow}>
                      <span css={label}>
                        One of the following:
                        <span css={subtext}>
                          - Bank account statements that document the amount of
                          cash compensation paid to employees.
                          <br />- Third party payroll service provider reports
                          that document the amount of cash compensation paid to
                          employees.
                        </span>
                      </span>
                      <FieldArray
                        name="payrollStatements"
                        render={arrayHelpers => (
                          <div css={inputColumn}>
                            {values.payrollStatements &&
                              values.payrollStatements.length > 0 &&
                              values.payrollStatements.map(
                                (payrollStatementsFile, index) => (
                                  <AsyncFileInput
                                    key={index}
                                    type="file"
                                    name={`payrollStatements.${index}`}
                                    label="Click here to choose your file to upload."
                                    setFieldValue={setFieldValue}
                                    onDeleteClick={() =>
                                      arrayHelpers.remove(index)}
                                    canDelete={index > 0}
                                  />
                                )
                              )}
                            {values.payrollStatements[0].length > 0 && (
                              <button
                                css={plus}
                                type="button"
                                onClick={() => arrayHelpers.push('')}
                              >
                                <img src={plusIcon} alt="upload new file" />
                              </button>
                            )}
                          </div>
                        )}
                      />
                    </div>
                    <hr css={ruler} />
                  </React.Fragment>
                )}
                {showSection2 && (
                  <React.Fragment>
                    <div css={flexRow}>
                      <div>
                        <Heading size="2">
                          Employer funded contributions to healthcare
                        </Heading>
                        {isEZ && (
                          <h3 css={subheading}>
                            Amount to substantiate:{' '}
                            <span css={emphasis}>{formatCurrency(line6)}</span>
                          </h3>
                        )}
                      </div>
                    </div>
                    <div css={flexRow}>
                      <span css={label}>
                        One of the following:
                        <span css={subtext}>
                          - Payment receipts
                          <br />- Cancelled checks
                          <br />- Account statements documenting the amount of
                          employer funded healthcare coverage
                        </span>
                      </span>
                      <FieldArray
                        name="healthcareDocumentation"
                        render={arrayHelpers => (
                          <div css={inputColumn}>
                            {values.healthcareDocumentation &&
                              values.healthcareDocumentation.length > 0 &&
                              values.healthcareDocumentation.map(
                                (healthcareDocumentationFile, index) => (
                                  <AsyncFileInput
                                    key={index}
                                    type="file"
                                    name={`healthcareDocumentation.${index}`}
                                    label="Click here to choose your file to upload."
                                    setFieldValue={setFieldValue}
                                    onDeleteClick={() =>
                                      arrayHelpers.remove(index)}
                                    canDelete={index > 0}
                                  />
                                )
                              )}
                            <button
                              css={plus}
                              type="button"
                              onClick={() => arrayHelpers.push('')}
                            >
                              <img src={plusIcon} alt="upload new file" />
                            </button>
                          </div>
                        )}
                      />
                    </div>
                    <hr css={ruler} />
                  </React.Fragment>
                )}
                {showSection3 && (
                  <React.Fragment>
                    <div css={flexRow}>
                      <div>
                        <Heading size="2">
                          Employer funded contributions to retirement benefits
                        </Heading>
                        {isEZ && (
                          <h3 css={subheading}>
                            Amount to substantiate:{' '}
                            <span css={emphasis}>{formatCurrency(line7)}</span>
                          </h3>
                        )}
                      </div>
                    </div>
                    <div css={flexRow}>
                      <span css={label}>
                        One of the following:
                        <span css={subtext}>
                          - Payment receipts
                          <br />- Cancelled checks
                          <br />- Account statements documenting the amount of
                          employer funded retirement benefits
                        </span>
                      </span>
                      <FieldArray
                        name="retirementDocumentation"
                        render={arrayHelpers => (
                          <div css={inputColumn}>
                            {values.retirementDocumentation &&
                              values.retirementDocumentation.length > 0 &&
                              values.retirementDocumentation.map(
                                (retirementDocumentationFile, index) => (
                                  <AsyncFileInput
                                    key={index}
                                    type="file"
                                    name={`retirementDocumentation.${index}`}
                                    label="Click here to choose your file to upload."
                                    setFieldValue={setFieldValue}
                                    onDeleteClick={() =>
                                      arrayHelpers.remove(index)}
                                    canDelete={index > 0}
                                  />
                                )
                              )}
                            <button
                              css={plus}
                              type="button"
                              onClick={() => arrayHelpers.push('')}
                            >
                              <img src={plusIcon} alt="upload new file" />
                            </button>
                          </div>
                        )}
                      />
                    </div>
                    <hr css={ruler} />
                  </React.Fragment>
                )}
                {showSection4 && (
                  <React.Fragment>
                    <div css={flexRow}>
                      <div>
                        <Heading size="2">
                          Employer funded payments to state & local taxes
                        </Heading>
                        {isEZ && (
                          <h3 css={subheading}>
                            Amount to substantiate:{' '}
                            <span css={emphasis}>{formatCurrency(line8)}</span>
                          </h3>
                        )}
                      </div>
                    </div>
                    <div css={flexRow}>
                      <span css={label}>
                        State quarterly filings:
                        <span css={subtext}>
                          State quarterly business and individual employee wage
                          reporting and unemployment insurance tax filings
                          reported, or that will be reported, to the state.
                        </span>
                      </span>
                      <FieldArray
                        name="stateTaxDocumentation"
                        render={arrayHelpers => (
                          <div css={inputColumn}>
                            {values.stateTaxDocumentation &&
                              values.stateTaxDocumentation.length > 0 &&
                              values.stateTaxDocumentation.map(
                                (stateTaxDocumentationFile, index) => (
                                  <AsyncFileInput
                                    key={index}
                                    type="file"
                                    name={`stateTaxDocumentation.${index}`}
                                    label="Click here to choose your file to upload."
                                    setFieldValue={setFieldValue}
                                    onDeleteClick={() =>
                                      arrayHelpers.remove(index)}
                                    canDelete={index > 0}
                                  />
                                )
                              )}
                            <button
                              css={plus}
                              type="button"
                              onClick={() => arrayHelpers.push('')}
                            >
                              <img src={plusIcon} alt="upload new file" />
                            </button>
                          </div>
                        )}
                      />
                    </div>
                    <hr css={ruler} />
                  </React.Fragment>
                )}
                {showSection5 && (
                  <React.Fragment>
                    <div css={flexRow}>
                      <div>
                        <Heading size="2">Owner payroll documentation</Heading>
                        {isEZ && (
                          <h3 css={subheading}>
                            Amount to substantiate:{' '}
                            <span css={emphasis}>{formatCurrency(line9)}</span>
                          </h3>
                        )}
                      </div>
                    </div>
                    <div css={flexRow}>
                      <span css={label}>
                        Bank account statements:
                        <span css={subtext}>
                          Bank account statements that document the amount of
                          cash compensation paid to owner-employees,
                          self-employed individuals or general partners
                        </span>
                      </span>
                      <FieldArray
                        name="ownerPayrollDocumentation"
                        render={arrayHelpers => (
                          <div css={inputColumn}>
                            {values.ownerPayrollDocumentation &&
                              values.ownerPayrollDocumentation.length > 0 &&
                              values.ownerPayrollDocumentation.map(
                                (ownerPayrollDocumentationFile, index) => (
                                  <AsyncFileInput
                                    key={index}
                                    type="file"
                                    name={`ownerPayrollDocumentation.${index}`}
                                    label="Click here to choose your file to upload."
                                    setFieldValue={setFieldValue}
                                    onDeleteClick={() =>
                                      arrayHelpers.remove(index)}
                                    canDelete={index > 0}
                                  />
                                )
                              )}
                            {}
                            <button
                              css={plus}
                              type="button"
                              onClick={() => arrayHelpers.push('')}
                            >
                              <img src={plusIcon} alt="upload new file" />
                            </button>
                          </div>
                        )}
                      />
                    </div>
                    <hr css={ruler} />
                  </React.Fragment>
                )}
                {showSection7 && (
                  <React.Fragment>
                    <div css={flexRow}>
                      <div>
                        <Heading size="2">
                          Business mortgage interest payments
                        </Heading>
                        {isEZ && (
                          <h3 css={subheading}>
                            Amount to substantiate:{' '}
                            <span css={emphasis}>
                              {formatCurrency(line2mortgage)}
                            </span>
                          </h3>
                        )}
                      </div>
                    </div>
                    <div css={flexRow}>
                      <span css={label}>
                        One of the following two options:
                        <span css={subtext}>
                          <b css={boldText}>OPTION #1</b>
                          <br />- Copy of lender amortization schedule{' '}
                          <b>AND</b>
                          <br />- Receipts of cancelled checks verifying
                          eligible payments
                          <span css={orDivider}>OR</span>
                          <b css={boldText}>OPTION #2</b>
                          <br />- Lender account statements from February 2020{' '}
                          <b>AND</b>
                          <br />- Lender account statements for the months of
                          the covered period through one month after the end of
                          the covered period verifying interest amounts and
                          eligible payments.
                        </span>
                      </span>
                      <FieldArray
                        name="mortgageInterest"
                        render={arrayHelpers => (
                          <div css={inputColumn}>
                            {values.mortgageInterest &&
                              values.mortgageInterest.length > 0 &&
                              values.mortgageInterest.map(
                                (mortgageInterestFile, index) => (
                                  <AsyncFileInput
                                    key={index}
                                    type="file"
                                    name={`mortgageInterest.${index}`}
                                    label="Click here to choose your file to upload."
                                    setFieldValue={setFieldValue}
                                    onDeleteClick={() =>
                                      arrayHelpers.remove(index)}
                                    canDelete={index > 0}
                                  />
                                )
                              )}
                            <button
                              css={plus}
                              type="button"
                              onClick={() => arrayHelpers.push('')}
                            >
                              <img src={plusIcon} alt="upload new file" />
                            </button>
                            <span css={errorText}>
                              <ErrorMessage name="mortgageInterest" />
                            </span>
                          </div>
                        )}
                      />
                    </div>
                    <hr css={ruler} />
                  </React.Fragment>
                )}
                {showSection8 && (
                  <React.Fragment>
                    <div css={flexRow}>
                      <div>
                        <Heading size="2">
                          Business rent or lease payments
                        </Heading>
                        {isEZ && (
                          <h3 css={subheading}>
                            Amount to substantiate:{' '}
                            <span css={emphasis}>{formatCurrency(line3)}</span>
                          </h3>
                        )}
                      </div>
                    </div>
                    <div css={flexRow}>
                      <span css={label}>
                        One of the following options:
                        <span css={subtext}>
                          - Copy of current lease agreement AND
                          <br />- Receipts or cancelled checks verifying
                          eligible payments from the covered period
                          <span css={orDivider}>OR</span>
                          <br />- Lessor account statements from February 2020
                          AND
                          <br />- Account statements from the covered period
                          through one month after the end of the covered period
                          verifying eligible payments.
                        </span>
                      </span>
                      <FieldArray
                        name="rentLeasePayments"
                        render={arrayHelpers => (
                          <div css={inputColumn}>
                            {values.rentLeasePayments &&
                              values.rentLeasePayments.length > 0 &&
                              values.rentLeasePayments.map(
                                (rentLeasePaymentsFile, index) => (
                                  <AsyncFileInput
                                    key={index}
                                    type="file"
                                    name={`rentLeasePayments.${index}`}
                                    label="Click here to choose your file to upload."
                                    setFieldValue={setFieldValue}
                                    onDeleteClick={() =>
                                      arrayHelpers.remove(index)}
                                    canDelete={index > 0}
                                  />
                                )
                              )}
                            <button
                              css={plus}
                              type="button"
                              onClick={() => arrayHelpers.push('')}
                            >
                              <img src={plusIcon} alt="upload new file" />
                            </button>
                            <span css={errorText}>
                              <ErrorMessage name="mortgageInterest" />
                            </span>
                          </div>
                        )}
                      />
                    </div>
                    <hr css={ruler} />
                  </React.Fragment>
                )}
                {showSection9 && (
                  <React.Fragment>
                    <div css={flexRow}>
                      <div>
                        <Heading size="2">Business utility payments</Heading>
                        {isEZ && (
                          <h3 css={subheading}>
                            Amount to substantiate:{' '}
                            <span css={emphasis}>
                              {formatCurrency(line4util)}
                            </span>
                          </h3>
                        )}
                        <p css={note}>
                          Please note that for each utility included in the
                          total above you will need to upload the 3 documents
                          outlined below. The amounts for each utility will need
                          to add up exactly to the number above.
                        </p>
                      </div>
                    </div>
                    <div css={flexRow}>
                      <span css={label}>
                        All 3 of the following for EACH utility (Gas, Water,
                        etc.):
                        <span css={subtext}>
                          1. Copy of invoice from February 2020 AND
                          <br />
                          <br />
                          2. Copy of invoices paid during the covered period AND
                          <br />
                          <br />
                          3. Receipts, cancelled checks, or account statements
                          verifying those eligible payments.
                        </span>
                      </span>
                      <FieldArray
                        name="utilityPayments"
                        render={arrayHelpers => (
                          <div css={inputColumn}>
                            {values.utilityPayments &&
                              values.utilityPayments.length > 0 &&
                              values.utilityPayments.map(
                                (utilityPaymentsFile, index) => (
                                  <AsyncFileInput
                                    key={index}
                                    type="file"
                                    name={`utilityPayments.${index}`}
                                    label="Click here to choose your file to upload."
                                    setFieldValue={setFieldValue}
                                    onDeleteClick={() =>
                                      arrayHelpers.remove(index)}
                                    canDelete={index > 0}
                                  />
                                )
                              )}
                            <button
                              css={plus}
                              type="button"
                              onClick={() => arrayHelpers.push('')}
                            >
                              <img src={plusIcon} alt="upload new file" />
                            </button>
                            <span css={errorText}>
                              <ErrorMessage name="utilityPayments" />
                            </span>
                          </div>
                        )}
                      />
                    </div>
                  </React.Fragment>
                )}
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
                    Continue
                  </Button>
                </FooterNav>
                <span css={errorText}>
                  <ErrorMessage name="form941" />
                </span>
                {error && (
                  <span
                    css={css`
                      color: ${colors.orange};
                    `}
                  >
                    The password you entered was incorrect.
                  </span>
                )}
                <Persist name="forgivenessDocs" />
              </form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  )
}

export default ForgivenessDocs
