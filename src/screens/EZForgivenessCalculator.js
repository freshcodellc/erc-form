/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import React, { useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { navigate } from '@reach/router'
import get from 'lodash/get'
import isNull from 'lodash/isNull'
import isUndefined from 'lodash/isUndefined'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import parseJSON from 'date-fns/parseJSON'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import parseISO from 'date-fns/parseISO'
import { formatCurrency } from '../utils/helpers'
import HelperText from '../components/ui/helperText'
import Button from '../components/ui/button'
import Checkbox from '../components/ui/forms/checkbox'
import Heading from '../components/ui/heading'
import FooterNav from '../components/ui/footerNav'
import Input from '../components/ui/forms/input'
import Layout from '../components/layout'
import Modal from '../components/ui/modal'
import Persist from '../components/persist'
import Radio from '../components/ui/forms/radio'
import useAnalytics from '../components/analytics'
import getBankConfig from '../bankConfig'

const bank = getBankConfig()

const validationSchema = Yup.object().shape({
  grossRevenue2019: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  originalJobCount: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  coveredDateFrom: Yup.string().required('Required'),
  coveredDateTo: Yup.string()
    .test({
      name: 'isDateWithinRange',
      message: `Date outside allowed range`,
      test(value) {
        return (
          isAfter(parseISO(value), parseISO(this.parent.coveredDateFrom)) &&
          isBefore(
            parseISO(value),
            addDays(parseISO(this.parent.coveredDateFrom), 170)
          )
        )
      },
    })
    .required('Required'),
  loanAbove2m: Yup.bool()
    .oneOf([true, false])
    .required(),
  employeePayrollCosts: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  healthcareCosts: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  retirementPlanCosts: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  employerTaxCosts: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  payrollCost: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  mortgageInterest: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  rentLeasePayment: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  utilityPayment: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  coveredOperationsExpenditures: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  coveredPropertyDamageCosts: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  coveredSupplierCosts: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  coveredWorkerProtectionExpenditures: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  modifiedTotal: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  loanAmount: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  payrollCostRequirement: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  forgivenessAmount: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  coveredPeriodWeeks: Yup.number()
    .min(0)
    .required('Required'),
})

const formStyle = css`
  width: 100%;
  max-width: 800px;
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
      font-size: 18px;
      font-weight: 700;
    }
  }
`

const text = css`
  font-size: 24px;
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

const formLabel = css`
  position: absolute;
  top: -10px;
  left: 0;
  font-size: 12px;
  font-weight: 500;
`

const column = css`
  width: 48%;
  display: flex;
`

const labelBold = css`
  font-weight: 700;
  margin-right: 8px;
`

const flexRow = css`
  display: flex;
  align-items: flex-start;
  margin: 24px 0;

  & > p {
    margin: 0;
    line-height: 16px;
    border-left: 2px solid #253551;
    margin-left: 8px;
    padding-left: 12px;
  }

  & div > .input {
    margin-top: 0;
  }
`

const fileInput = css`
  flex: 5;
`

const buttonStyles = css`
  width: '170px';
`

function ForgivenessCalculator() {
  const app = JSON.parse(localStorage.getItem('forgivenessApp') || '{}')
  const appInfo = JSON.parse(localStorage.getItem('info') || '{}')
  const { colors } = useTheme()
  const [error, setError] = useState(false)
  const [showModal, setShowModal] = useState(false)
  useAnalytics()

  const requestedAmount = get(app, 'loan.figures.requestedLoanAmount', 0)
  const fundedLoanAmount = get(app, 'loan.funding.loan.amount', 0)
  const isEZ = get(app, 'loan.funding.loan.amount', 0) > 150000
  const finalLoanAmount =
    !isNull(fundedLoanAmount) &&
    !isUndefined(fundedLoanAmount) &&
    fundedLoanAmount > 0
      ? fundedLoanAmount
      : requestedAmount
  let appFundedDate = get(app, 'loan.funding.disbursementDate', '')
  if (typeof appFundedDate !== 'string' || appFundedDate === '') {
    appFundedDate = get(app, 'loan.funding.fundedDate', '')
  }
  if (typeof appFundedDate !== 'string') {
    appFundedDate = ''
  }
  let fundedDate = ''
  if (appFundedDate.length > 1) {
    fundedDate = appFundedDate.slice(0, 10)
  }

  let endDateString = ''
  if (appFundedDate !== '') {
    const fundedDateParsed = parseJSON(appFundedDate)
    const endDate = addDays(fundedDateParsed, 169)
    endDateString = format(endDate, 'yyyy-MM-dd')
    // if (isAfter(endDate, new Date(2020, 11, 31))) {
    //   endDateString = format(endDate, 'yyyy-MM-dd')
    // } else {
    //   endDateString = '2020-12-31'
    // }
  }

  const defaultPayrollCosts = get(appInfo, 'values.totalPayrollCosts', 0)

  const initialValues = {
    grossRevenue2019: 0,
    originalJobCount: '',
    coveredDateFrom: fundedDate,
    coveredDateTo: endDateString,
    loanAbove2m: false,
    employeePayrollCosts: '',
    healthcareCosts: '',
    retirementPlanCosts: '',
    employerTaxCosts: '',
    payrollCost: defaultPayrollCosts,
    mortgageInterest: '',
    rentLeasePayment: '',
    utilityPayment: '',
    coveredOperationsExpenditures: '',
    coveredPropertyDamageCosts: '',
    coveredSupplierCosts: '',
    coveredWorkerProtectionExpenditures: '',
    modifiedTotal: 0,
    loanAmount: finalLoanAmount,
    payrollCostRequirement: (defaultPayrollCosts / 0.6).toFixed(2),
    forgivenessAmount: isEZ ? 0 : '',
    coveredPeriodWeeks: '24',
  }

  const validationSchemaSimple = Yup.object().shape({
    grossRevenue2019: Yup.number()
      .min(0)
      .required('Required (can be 0)'),
    originalJobCount: Yup.number()
      .min(0)
      .required('Required (can be 0)'),
    coveredDateFrom: Yup.string().required('Required'),
    coveredDateTo: Yup.string()
      .test({
        name: 'isDateWithinRange',
        message: `Date outside allowed range`,
        test(value) {
          return (
            isAfter(parseISO(value), parseISO(this.parent.coveredDateFrom)) &&
            isBefore(
              parseISO(value),
              addDays(parseISO(this.parent.coveredDateFrom), 170)
            )
          )
        },
      })
      .required('Required'),
    loanAbove2m: Yup.bool()
      .oneOf([true, false])
      .required(),
    employeePayrollCosts: Yup.number().min(0),
    healthcareCosts: Yup.number().min(0),
    retirementPlanCosts: Yup.number().min(0),
    employerTaxCosts: Yup.number().min(0),
    payrollCost: Yup.number()
      .min(0)
      .required('Required (can be 0)'),
    mortgageInterest: Yup.number().min(0),
    rentLeasePayment: Yup.number().min(0),
    utilityPayment: Yup.number().min(0),
    coveredOperationsExpenditures: Yup.number().min(0),
    coveredPropertyDamageCosts: Yup.number().min(0),
    coveredSupplierCosts: Yup.number().min(0),
    coveredWorkerProtectionExpenditures: Yup.number().min(0),
    modifiedTotal: Yup.number().min(0),
    loanAmount: Yup.number().required('Required (can be 0)'),
    payrollCostRequirement: Yup.number().min(0),
    forgivenessAmount: Yup.number()
      .test({
        name: 'max',
        message: `Forgiveness Amount cannot exceed Total Payroll Costs divided by 60%`,
        test(value) {
          return (
            value <=
            Math.min(finalLoanAmount, this.parent.payrollCostRequirement)
          )
        },
      })
      .test({
        name: 'min',
        message: 'Must be greater than payroll costs',
        test(value) {
          return value >= Math.min(this.parent.payrollCost, finalLoanAmount)
        },
      })
      .required('Required (can be 0)'),
    coveredPeriodWeeks: Yup.number().min(0),
  })

  const section = css`
    border-top: 2px solid ${colors.grey400};
    padding: 24px 0;
  `

  const label = css`
    display: block;
    font-size: 18px;
    color: ${colors.blueDark};
    flex: 3;
    margin-right: 8%;
  `

  const labelInline = css`
    flex: 1 0 auto;
    margin: 22px 16px 8px 0;
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

  const redText = css`
    color: ${colors.red};
  `

  const getAdjustedWages = values => {
    const {
      payrollCost,
      mortgageInterest,
      rentLeasePayment,
      utilityPayment,
      coveredOperationsExpenditures,
      coveredPropertyDamageCosts,
      coveredSupplierCosts,
      coveredWorkerProtectionExpenditures,
    } = values
    const line1 = payrollCost !== '' ? payrollCost : 0
    const line2 = mortgageInterest !== '' ? mortgageInterest : 0
    const line3 = rentLeasePayment !== '' ? rentLeasePayment : 0
    const line4 = utilityPayment !== '' ? utilityPayment : 0
    const line5 =
      coveredOperationsExpenditures !== '' ? coveredOperationsExpenditures : 0
    const line6 =
      coveredPropertyDamageCosts !== '' ? coveredPropertyDamageCosts : 0
    const line7 = coveredSupplierCosts !== '' ? coveredSupplierCosts : 0
    const line8 =
      coveredWorkerProtectionExpenditures !== ''
        ? coveredWorkerProtectionExpenditures
        : 0

    return (
      parseFloat(line1) +
      parseFloat(line2) +
      parseFloat(line3) +
      parseFloat(line4) +
      parseFloat(line5) +
      parseFloat(line6) +
      parseFloat(line7) +
      parseFloat(line8)
    )
  }

  const getTotalPayroll = values => {
    const {
      employeePayrollCosts,
      healthcareCosts,
      retirementPlanCosts,
      employerTaxCosts,
    } = values
    const line5 = employeePayrollCosts !== '' ? employeePayrollCosts : 0
    const line6 = healthcareCosts !== '' ? healthcareCosts : 0
    const line7 = retirementPlanCosts !== '' ? retirementPlanCosts : 0
    const line8 = employerTaxCosts !== '' ? employerTaxCosts : 0

    return (
      parseFloat(line5) +
      parseFloat(line6) +
      parseFloat(line7) +
      parseFloat(line8)
    )
  }

  const isPastCoveredPeriod = coveredEndDate => {
    const now = new Date()
    return isBefore(coveredEndDate, now)
  }

  const handleCalculatorSubmit = async (values, actions) => {
    actions.setSubmitting(true)
    setError(false)
    const endDate = values.coveredDateTo
    if (isPastCoveredPeriod(parseISO(endDate)) || !bank.limitEarlyForgiveness) {
      actions.setSubmitting(false)
      navigate('/forgiveness/ez/demographic')
    } else {
      setShowModal(true)
    }
  }

  return (
    <Layout>
      <Modal
        disableClose
        isOpen={showModal}
        onCloseClicked={() => setShowModal(false)}
      >
        <p>
          You cannot submit for forgiveness until after the end of your covered
          period. Please come back once your covered period has ended.
        </p>
      </Modal>
      <div css={formStyle}>
        <Heading size="1" align="center">
          Step 1. Loan Forgiveness Application
        </Heading>
        <p css={text}>
          Please continue by filling out the PPP Loan Forgiveness Calculation
          Form below.
        </p>
        <div css={row}>
          <div css={column}>
            <div css={labelBold}>Business Name:</div>
            <div css={redText}>{get(app, 'business.name', 'N/A')}</div>
          </div>
          <div css={column}>
            <div css={labelBold}>Primary Contact:</div>
            <div css={redText}>
              {`${get(app, 'customer.firstName', '')} ${get(
                app,
                'customer.lastName',
                ''
              )}`}
            </div>
          </div>
        </div>
        <div css={row}>
          <div css={column}>
            <div css={labelBold}>SBA Loan Number:</div>
            <div css={redText}>
              {get(app, 'loan.funding.applicationNumber', 'N/A')}
            </div>
          </div>
          <div css={column}>
            <div css={labelBold}>PPP Loan Amount:</div>
            <div css={redText}>
              {formatCurrency(get(app, 'loan.funding.loan.amount', 0))}
            </div>
          </div>
        </div>
        <div css={row}>
          <div css={column}>
            <div css={labelBold}>Employees at time of loan application:</div>
            <div css={redText}>{get(app, 'business.jobs.current', 'N/A')}</div>
          </div>
        </div>
        {isEZ && (
          <HelperText>
            <b>
              Before you get started, please fill out the PPP Schedule A
              Worksheet located here. Numbers from the form will be required
              throughout the application.
            </b>
          </HelperText>
        )}
        <div css={formWrap}>
          <Formik
            initialValues={initialValues}
            validationSchema={isEZ ? validationSchema : validationSchemaSimple}
            onSubmit={(values, actions) =>
              handleCalculatorSubmit(values, actions)}
          >
            {({
              handleChange,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              values,
            }) => (
              <form onSubmit={handleSubmit}>
                <div css={section}>
                  <Heading size="2">Basic Information</Heading>
                  <div css={flexRow}>
                    <span css={label}>
                      Employees at time of forgiveness application:
                    </span>
                    <div css={fileInput}>
                      <Input
                        type="number"
                        name="originalJobCount"
                        label="Number of Employees"
                      />
                    </div>
                  </div>
                  <React.Fragment>
                    <p>
                      NOTE: By default, we assume a 24 week covered period. The
                      start date is set to your loan’s disbursement date. You may
                      elect to choose an end date anywhere from 8 to 24 weeks
                      after your covered period start date of{' '}
                      {values.coveredDateFrom}
                    </p>
                    <div css={row}>
                      <span css={formLabel}>Covered End Date</span>
                      <Input type="date" name="coveredDateTo" label="Date" />
                    </div>
                    <div css={row}>
                      <Checkbox
                        name="loanAbove2m"
                        label="If Borrower (together with affiliates, if applicable) received PPP loans in excess of $2 million, check here"
                      />
                    </div>
                  </React.Fragment>
                </div>
                <div css={section}>
                  <Heading size="2">
                    Payroll and Non-Cash Compensation Costs During the Covered
                    Period or the Alternative Covered Period
                  </Heading>
                  <div css={flexRow}>
                    <span css={label}>
                      <span css={subtext}>
                        Total amount paid by Borrower for employee payroll:
                      </span>
                    </span>
                    <div css={fileInput}>
                      <Input
                        type="number"
                        name="employeePayrollCosts"
                        label="100,000"
                        onChange={e => {
                          handleChange(e)
                          const payrollValue = getTotalPayroll({
                            ...values,
                            [e.target.name]: e.target.value,
                          })
                          setFieldValue('payrollCost', payrollValue)
                          const payCostReq = (payrollValue / 0.6).toFixed(2)
                          const modTotal = getAdjustedWages({
                            ...values,
                            payrollCost: payrollValue,
                            [e.target.name]: e.target.value,
                          })
                          setFieldValue('modifiedTotal', modTotal)
                          setFieldValue('payrollCostRequirement', payCostReq)
                          if (isEZ) {
                            setFieldValue(
                              'forgivenessAmount',
                              Math.min(values.loanAmount, modTotal, payCostReq)
                            )
                          } else if (payCostReq > values.loanAmount) {
                            setFieldValue(
                              'forgivenessAmount',
                              values.loanAmount
                            )
                          } else {
                            setFieldValue('forgivenessAmount', '')
                          }
                        }}
                        money
                      />
                    </div>
                  </div>
                  <div css={flexRow}>
                    <span css={label}>
                      <span css={subtext}>
                        Total amount paid by Borrower for employer contribution
                        for employee health insurance:
                      </span>
                    </span>
                    <div css={fileInput}>
                      <Input
                        type="number"
                        name="healthcareCosts"
                        label="100,000"
                        onChange={e => {
                          handleChange(e)
                          const payrollValue = getTotalPayroll({
                            ...values,
                            [e.target.name]: e.target.value,
                          })
                          setFieldValue('payrollCost', payrollValue)
                          const payCostReq = (payrollValue / 0.6).toFixed(2)
                          const modTotal = getAdjustedWages({
                            ...values,
                            payrollCost: payrollValue,
                            [e.target.name]: e.target.value,
                          })
                          setFieldValue('modifiedTotal', modTotal)
                          setFieldValue('payrollCostRequirement', payCostReq)
                          if (isEZ) {
                            setFieldValue(
                              'forgivenessAmount',
                              Math.min(values.loanAmount, modTotal, payCostReq)
                            )
                          } else if (payCostReq > values.loanAmount) {
                            setFieldValue(
                              'forgivenessAmount',
                              values.loanAmount
                            )
                          } else {
                            setFieldValue('forgivenessAmount', '')
                          }
                        }}
                        money
                      />
                    </div>
                  </div>
                  <div css={flexRow}>
                    <span css={label}>
                      <span css={subtext}>
                        Total amount paid by Borrower for employer contributions
                        to employee retirement plans:
                      </span>
                    </span>
                    <div css={fileInput}>
                      <Input
                        type="number"
                        name="retirementPlanCosts"
                        label="100,000"
                        onChange={e => {
                          handleChange(e)
                          const payrollValue = getTotalPayroll({
                            ...values,
                            [e.target.name]: e.target.value,
                          })
                          setFieldValue('payrollCost', payrollValue)
                          const payCostReq = (payrollValue / 0.6).toFixed(2)
                          const modTotal = getAdjustedWages({
                            ...values,
                            payrollCost: payrollValue,
                            [e.target.name]: e.target.value,
                          })
                          setFieldValue('modifiedTotal', modTotal)
                          setFieldValue('payrollCostRequirement', payCostReq)
                          if (isEZ) {
                            setFieldValue(
                              'forgivenessAmount',
                              Math.min(values.loanAmount, modTotal, payCostReq)
                            )
                          } else if (payCostReq > values.loanAmount) {
                            setFieldValue(
                              'forgivenessAmount',
                              values.loanAmount
                            )
                          } else {
                            setFieldValue('forgivenessAmount', '')
                          }
                        }}
                        money
                      />
                    </div>
                  </div>
                  <div css={flexRow}>
                    <span css={label}>
                      <span css={subtext}>
                        Total amount paid by Borrower for employer state and
                        local taxes assessed on employee compensation:
                      </span>
                    </span>
                    <div css={fileInput}>
                      <Input
                        type="number"
                        name="employerTaxCosts"
                        label="100,000"
                        onChange={e => {
                          handleChange(e)
                          const payrollValue = getTotalPayroll({
                            ...values,
                            [e.target.name]: e.target.value,
                          })
                          setFieldValue('payrollCost', payrollValue)
                          const payCostReq = (payrollValue / 0.6).toFixed(2)
                          const modTotal = getAdjustedWages({
                            ...values,
                            payrollCost: payrollValue,
                            [e.target.name]: e.target.value,
                          })
                          setFieldValue('modifiedTotal', modTotal)
                          setFieldValue('payrollCostRequirement', payCostReq)
                          if (isEZ) {
                            setFieldValue(
                              'forgivenessAmount',
                              Math.min(values.loanAmount, modTotal, payCostReq)
                            )
                          } else if (payCostReq > values.loanAmount) {
                            setFieldValue(
                              'forgivenessAmount',
                              values.loanAmount
                            )
                          } else {
                            setFieldValue('forgivenessAmount', '')
                          }
                        }}
                        money
                      />
                    </div>
                  </div>
                </div>
                {isEZ && (
                  <div css={section}>
                    <Heading size="2">Payroll and non-payroll costs</Heading>
                    <div css={flexRow}>
                      <span css={label}>
                        Line 1. Payroll costs.
                        <span css={subtext}>
                          Line 10 from PPP Schedule A on the previous page.
                        </span>
                      </span>
                      <div css={fileInput}>
                        <Input
                          type="number"
                          name="payrollCost"
                          label="100,000"
                          money
                          locked
                          readOnly
                          onChange={e => {
                            handleChange(e)
                            const payCostReq = (e.target.value / 0.6).toFixed(2)
                            const modTotal = getAdjustedWages({
                              ...values,
                              [e.target.name]: e.target.value,
                            })
                            setFieldValue('modifiedTotal', modTotal)
                            setFieldValue('payrollCostRequirement', payCostReq)
                            setFieldValue(
                              'forgivenessAmount',
                              Math.min(values.loanAmount, modTotal, payCostReq)
                            )
                          }}
                        />
                      </div>
                    </div>
                    <div css={flexRow}>
                      <span css={label}>
                        Line 2. Business mortgage interest payments.
                      </span>
                      <div css={fileInput}>
                        <Input
                          type="number"
                          name="mortgageInterest"
                          label="100,000"
                          onChange={e => {
                            handleChange(e)
                            const modTotal = getAdjustedWages({
                              ...values,
                              [e.target.name]: e.target.value,
                            })
                            setFieldValue('modifiedTotal', modTotal)
                            setFieldValue(
                              'forgivenessAmount',
                              Math.min(
                                values.loanAmount,
                                modTotal,
                                values.payrollCostRequirement
                              )
                            )
                          }}
                          money
                        />
                      </div>
                    </div>
                    <div css={flexRow}>
                      <span css={label}>
                        Line 3. Business rent or lease payments.
                      </span>
                      <div css={fileInput}>
                        <Input
                          type="number"
                          name="rentLeasePayment"
                          label="100,000"
                          onChange={e => {
                            handleChange(e)
                            const modTotal = getAdjustedWages({
                              ...values,
                              [e.target.name]: e.target.value,
                            })
                            setFieldValue('modifiedTotal', modTotal)
                            setFieldValue(
                              'forgivenessAmount',
                              Math.min(
                                values.loanAmount,
                                modTotal,
                                values.payrollCostRequirement
                              )
                            )
                          }}
                          money
                        />
                      </div>
                    </div>
                    <div css={flexRow}>
                      <span css={label}>
                        Line 4. Business utility payments.
                      </span>
                      <div css={fileInput}>
                        <Input
                          type="number"
                          name="utilityPayment"
                          label="100,000"
                          onChange={e => {
                            handleChange(e)
                            const modTotal = getAdjustedWages({
                              ...values,
                              [e.target.name]: e.target.value,
                            })
                            setFieldValue('modifiedTotal', modTotal)
                            setFieldValue(
                              'forgivenessAmount',
                              Math.min(
                                values.loanAmount,
                                modTotal,
                                values.payrollCostRequirement
                              )
                            )
                          }}
                          money
                        />
                      </div>
                    </div>
                    <div css={flexRow}>
                      <span css={label}>
                        Line 5. Covered Operations Expenditures.
                      </span>
                      <div css={fileInput}>
                        <Input
                          type="number"
                          name="coveredOperationsExpenditures"
                          label="100,000"
                          onChange={e => {
                            handleChange(e)
                            const modTotal = getAdjustedWages({
                              ...values,
                              [e.target.name]: e.target.value,
                            })
                            setFieldValue('modifiedTotal', modTotal)
                            setFieldValue(
                              'forgivenessAmount',
                              Math.min(
                                values.loanAmount,
                                modTotal,
                                values.payrollCostRequirement
                              )
                            )
                          }}
                          money
                        />
                      </div>
                    </div>
                    <div css={flexRow}>
                      <span css={label}>
                        Line 6. Covered Property Damage Costs.
                      </span>
                      <div css={fileInput}>
                        <Input
                          type="number"
                          name="coveredPropertyDamageCosts"
                          label="100,000"
                          onChange={e => {
                            handleChange(e)
                            const modTotal = getAdjustedWages({
                              ...values,
                              [e.target.name]: e.target.value,
                            })
                            setFieldValue('modifiedTotal', modTotal)
                            setFieldValue(
                              'forgivenessAmount',
                              Math.min(
                                values.loanAmount,
                                modTotal,
                                values.payrollCostRequirement
                              )
                            )
                          }}
                          money
                        />
                      </div>
                    </div>
                    <div css={flexRow}>
                      <span css={label}>Line 7. Covered Supplier Costs.</span>
                      <div css={fileInput}>
                        <Input
                          type="number"
                          name="coveredSupplierCosts"
                          label="100,000"
                          onChange={e => {
                            handleChange(e)
                            const modTotal = getAdjustedWages({
                              ...values,
                              [e.target.name]: e.target.value,
                            })
                            setFieldValue('modifiedTotal', modTotal)
                            setFieldValue(
                              'forgivenessAmount',
                              Math.min(
                                values.loanAmount,
                                modTotal,
                                values.payrollCostRequirement
                              )
                            )
                          }}
                          money
                        />
                      </div>
                    </div>
                    <div css={flexRow}>
                      <span css={label}>
                        Line 8. Covered Worker Protection Expenditures.
                      </span>
                      <div css={fileInput}>
                        <Input
                          type="number"
                          name="coveredWorkerProtectionExpenditures"
                          label="100,000"
                          onChange={e => {
                            handleChange(e)
                            const modTotal = getAdjustedWages({
                              ...values,
                              [e.target.name]: e.target.value,
                            })
                            setFieldValue('modifiedTotal', modTotal)
                            setFieldValue(
                              'forgivenessAmount',
                              Math.min(
                                values.loanAmount,
                                modTotal,
                                values.payrollCostRequirement
                              )
                            )
                          }}
                          money
                        />
                      </div>
                    </div>
                  </div>
                )}
                {isEZ && (
                  <div css={section}>
                    <Heading size="2">Potential forgiveness amounts</Heading>
                    <div css={flexRow}>
                      <span css={label}>
                        Line 9. Sum the amounts on lines 1 through 8.
                      </span>
                      <div css={fileInput}>
                        <Input
                          align="right"
                          type="number"
                          name="modifiedTotal"
                          label=""
                          locked
                          readOnly
                        />
                      </div>
                    </div>
                    <div css={flexRow}>
                      <span css={label}>Line 10. PPP loan amount.</span>
                      <div css={fileInput}>
                        <Input
                          align="right"
                          type="number"
                          name="loanAmount"
                          label=""
                          locked
                          readOnly
                        />
                      </div>
                    </div>
                    <div css={flexRow}>
                      <span css={label}>
                        Line 11. Payroll cost 60% requirement.
                        <span css={subtext}>
                          Divide line 1 on this page by 0.6.
                        </span>
                      </span>
                      <div css={fileInput}>
                        <Input
                          align="right"
                          type="number"
                          name="payrollCostRequirement"
                          label=""
                          locked
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div css={section}>
                  <Heading size="2">Forgiveness amount</Heading>
                  <div css={flexRow}>
                    {isEZ && (
                      <span css={label}>
                        Line 12. Forgiveness amount
                        <span css={subtext}>
                          Enter the smallest of line 9, 10, or 11.
                        </span>
                      </span>
                    )}
                    {!isEZ && (
                      <span css={label}>
                        Forgiveness amount
                        <span css={subtext}>
                          Enter the amount of your loan which is forgivable
                          based on the SBA guidelines. To review the
                          instructions for form 3508S please click{' '}
                          <a
                            href="https://home.treasury.gov/system/files/136/PPP--Loan-Forgiveness-Application-Instructions--Form-3508S-1192021.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            here
                          </a>
                        </span>
                      </span>
                    )}
                    <div css={fileInput}>
                      <Input
                        align="right"
                        type="number"
                        name="forgivenessAmount"
                        label="100,000"
                        locked={isEZ}
                        readOnly={isEZ}
                      />
                    </div>
                  </div>
                </div>
                <FooterNav>
                  <div
                    css={css`
                      text-align: center;
                    `}
                  >
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
                <Persist name="calculations" />
              </form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  )
}

export default ForgivenessCalculator
