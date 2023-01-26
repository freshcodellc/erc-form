/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import React, { useState } from 'react'
import { Formik, FieldArray, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { navigate } from '@reach/router'
import get from 'lodash/get'
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
  const appInfo = JSON.parse(localStorage.getItem('info') || '{}')
  const appCalc = JSON.parse(localStorage.getItem('calculations') || '{}')
  const { colors } = useTheme()
  const [error, setError] = useState(false)
  useAnalytics()

  const handleDocumentSubmit = async (values, actions) => {
    actions.setSubmitting(true)
    setError(false)
    navigate('/forgiveness/certs')
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

  const line1 = parseFloat(get(appInfo, 'values.payrollCostUnder100k', '0'))
  const line2 = parseFloat(get(appInfo, 'values.averageFteUnder100k', '0'))
  const line2mortgage = parseFloat(get(appCalc, 'values.mortgageInterest', '0'))
  const line3 = parseFloat(get(appCalc, 'values.rentLeasePayment', '0'))
  const line4 = parseFloat(get(appInfo, 'values.payrollCostOver100k', '0'))
  const line4util = parseFloat(get(appCalc, 'values.utilityPayment', '0'))
  const line6 = parseFloat(get(appInfo, 'values.healthcareCosts', '0'))
  const line6fte = parseFloat(get(appInfo, 'values.averageFteOver100k', '0'))
  const line7 = parseFloat(get(appInfo, 'values.retirementPlanCosts', '0'))
  const line8 = parseFloat(get(appInfo, 'values.employerTaxCosts', '0'))
  const line9 = parseFloat(get(appInfo, 'values.ownerEmployeeCosts', '0'))
  const line11 = parseFloat(get(appInfo, 'values.averageFteReference', '0'))
  const noReduction = get(appInfo, 'values.noFteReduction', false)
  const safeHarbor1 = get(appInfo, 'values.safeHarbor1', false)
  const safeHarbor2 = get(appInfo, 'values.safeHarbor2', false)

  const employeePayrollCost = line1 + line4

  const showSection1 = employeePayrollCost > 0
  const showSection2 = line6 > 0 && line2 + line6fte > 0
  const showSection3 = line7 > 0 && line2 + line6fte > 0
  const showSection4 = line8 > 0 && line2 + line6fte > 0
  const showSection5 = line9 > 0 && line2 + line6fte > 0
  const showSection6 =
    line2 + line6fte > 0 && !noReduction && !safeHarbor1 && !safeHarbor2
  const showSection7 = line2mortgage > 0
  const showSection8 = line3 > 0
  const showSection9 = line4util > 0

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
    payrollStatements: showSection1 ? requiredSchema : optionalSchema,
    healthcareDocumentation: showSection2 ? requiredSchema : optionalSchema,
    retirementDocumentation: showSection3 ? requiredSchema : optionalSchema,
    stateTaxDocumentation: showSection4 ? requiredSchema : optionalSchema,
    ownerPayrollDocumentation: showSection5 ? requiredSchema : optionalSchema,
    fullTimeEmployeeDocumentation: showSection6
      ? requiredSchema
      : optionalSchema,
    mortgageInterest: showSection7 ? requiredSchema : optionalSchema,
    rentLeasePayments: showSection8 ? requiredSchema : optionalSchema,
    utilityPayments: showSection9 ? requiredSchema : optionalSchema,
  })

  return (
    <Layout>
      <div css={formStyle}>
        <Heading size="1" align="center">
          Documentation
        </Heading>
        <HelperText>
          You’ll need to provide documentation to support the forgiveness
          application information you’ve provided thus far.
        </HelperText>
        <ul css={listIndent}>
          <li>
            Please pay close attention to the specific document requirements for
            each category. Any item that you input a number (other than $0) on
            the prior screen requires a supporting document to be uploaded.
          </li>
          <li>
            Click the + sign if you need to upload more than one document for
            the particular item.
          </li>
          <li>
            If you have questions about the documentation requirements, please
            email <a href={`mailto:${bank.email}`}>{bank.email}</a>
          </li>
        </ul>
        <div css={formWrap}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) =>
              handleDocumentSubmit(values, actions)
            }
          >
            {({ handleSubmit, isSubmitting, setFieldValue, values }) => (
              <form onSubmit={handleSubmit}>
                {showSection1 && (
                  <React.Fragment>
                    <div css={flexRow}>
                      <div>
                        <Heading size="2">Payroll</Heading>
                        <h3 css={subheading}>
                          Amount to substantiate:{' '}
                          <span css={emphasis}>
                            {formatCurrency(employeePayrollCost)}
                          </span>
                        </h3>
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
                                    arrayHelpers.remove(index)
                                  }
                                  canDelete={index > 0}
                                />
                              ))}
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
                                      arrayHelpers.remove(index)
                                    }
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
                {showSection2 && (
                  <React.Fragment>
                    <div css={flexRow}>
                      <div>
                        <Heading size="2">
                          Employer funded contributions to healthcare
                        </Heading>
                        <h3 css={subheading}>
                          Amount to substantiate:{' '}
                          <span css={emphasis}>{formatCurrency(line6)}</span>
                        </h3>
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
                                      arrayHelpers.remove(index)
                                    }
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
                        <h3 css={subheading}>
                          Amount to substantiate:{' '}
                          <span css={emphasis}>{formatCurrency(line7)}</span>
                        </h3>
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
                                      arrayHelpers.remove(index)
                                    }
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
                        <h3 css={subheading}>
                          Amount to substantiate:{' '}
                          <span css={emphasis}>{formatCurrency(line8)}</span>
                        </h3>
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
                                      arrayHelpers.remove(index)
                                    }
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
                        <h3 css={subheading}>
                          Amount to substantiate:{' '}
                          <span css={emphasis}>{formatCurrency(line9)}</span>
                        </h3>
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
                                      arrayHelpers.remove(index)
                                    }
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
                {showSection6 && (
                  <React.Fragment>
                    <div css={flexRow}>
                      <div>
                        <Heading size="2">
                          Reference period FTE documentation
                        </Heading>
                        <h3 css={subheading}>
                          Amount to substantiate:{' '}
                          <span css={emphasis}>{line11}</span>
                        </h3>
                      </div>
                    </div>
                    <div css={flexRow} style={{ marginTop: '0' }}>
                      <span css={label}>
                        <div>
                          <span css={subtext}>
                            FTE Documentation must encompass one of the
                            following 3 reference periods:
                          </span>
                          <span css={subtext}>
                            <br />
                            - 2/15/19 - 6/30/19
                            <br />
                            - 1/1/20 - 2/29/20
                            <br />- Seasonal Employers Only: Any 12-week period
                            between 5/1/19 - 9/15/19
                            <br />
                            <br />
                          </span>
                        </div>
                        One of the following options:
                        <span css={subtext}>
                          - Payroll tax filings reported to the IRS (typically,
                          Form 941)
                          <span css={orDivider}>OR</span>
                          <br />- State quarterly business and individual
                          employee wage reporting and unemployment insurance tax
                          filings reported to the state
                        </span>
                      </span>
                      <FieldArray
                        name="fullTimeEmployeeDocumentation"
                        render={arrayHelpers => (
                          <div css={inputColumn}>
                            {values.fullTimeEmployeeDocumentation &&
                              values.fullTimeEmployeeDocumentation.length > 0 &&
                              values.fullTimeEmployeeDocumentation.map(
                                (fullTimeEmployeeDocumentationFile, index) => (
                                  <AsyncFileInput
                                    key={index}
                                    type="file"
                                    name={`fullTimeEmployeeDocumentation.${index}`}
                                    label="Click here to choose your file to upload."
                                    setFieldValue={setFieldValue}
                                    onDeleteClick={() =>
                                      arrayHelpers.remove(index)
                                    }
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
                {showSection7 && (
                  <React.Fragment>
                    <div css={flexRow}>
                      <div>
                        <Heading size="2">
                          Business mortgage interest payments
                        </Heading>
                        <h3 css={subheading}>
                          Amount to substantiate:{' '}
                          <span css={emphasis}>
                            {formatCurrency(line2mortgage)}
                          </span>
                        </h3>
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
                                      arrayHelpers.remove(index)
                                    }
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
                        <h3 css={subheading}>
                          Amount to substantiate:{' '}
                          <span css={emphasis}>{formatCurrency(line3)}</span>
                        </h3>
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
                                      arrayHelpers.remove(index)
                                    }
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
                        <h3 css={subheading}>
                          Amount to substantiate:{' '}
                          <span css={emphasis}>
                            {formatCurrency(line4util)}
                          </span>
                        </h3>
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
                                      arrayHelpers.remove(index)
                                    }
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
