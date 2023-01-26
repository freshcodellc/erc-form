/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import { useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { navigate } from '@reach/router'
import get from 'lodash/get'
import { formatCurrency } from '../utils/helpers'
import HelperText from '../components/ui/helperText'
import Button from '../components/ui/button'
import Checkbox from '../components/ui/forms/checkbox'
import Heading from '../components/ui/heading'
import FooterNav from '../components/ui/footerNav'
import Input from '../components/ui/forms/input'
import Layout from '../components/layout'
import Persist from '../components/persist'
import useAnalytics from '../components/analytics'

const validationSchema = Yup.object().shape({
  payrollCostUnder100k: Yup.number('Must be a number')
    .min(0)
    .required('Required (can be 0)'),
  averageFteUnder100k: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  wageReductionAdjustment: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  noWageReduction: Yup.bool()
    .oneOf([true, false], 'Required')
    .required('Required'),
  payrollCostOver100k: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  averageFteOver100k: Yup.number()
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
  ownerEmployeeCosts: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  totalPayrollCosts: Yup.number()
    .min(0)
    .required('Required (can be 0)'),
  noFteReduction: Yup.bool()
    .oneOf([true, false], 'Required')
    .required('Required'),
  safeHarbor1: Yup.bool()
    .oneOf([true, false], 'Required')
    .required('Required'),
  safeHarbor2: Yup.bool()
    .oneOf([true, false], 'Required')
    .required('Required'),
  averageFteReference: Yup.number().when(
    ['noFteReduction', 'safeHarbor1', 'safeHarbor2'],
    {
      is: false,
      then: Yup.number()
        .min(0)
        .required('Required'),
    }
  ),
  averageFteTotal: Yup.number().when('noFteReduction', {
    is: false,
    then: Yup.number()
      .min(0)
      .required('Required'),
  }),
  fteReductionQuotientAdjustment: Yup.number()
    .min(0)
    .required('Required'),
})

const initialValues = {
  payrollCostUnder100k: '',
  averageFteUnder100k: '',
  wageReductionAdjustment: '',
  noWageReduction: false,
  payrollCostOver100k: '',
  averageFteOver100k: '',
  healthcareCosts: '',
  retirementPlanCosts: '',
  employerTaxCosts: '',
  ownerEmployeeCosts: '',
  totalPayrollCosts: '',
  noFteReduction: false,
  safeHarbor1: false,
  safeHarbor2: false,
  averageFteReference: '',
  averageFteTotal: '',
  fteReductionQuotientAdjustment: '',
}

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
    margin-top: 24px;
    margin-bottom: 0;
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

function ForgivenessInfo() {
  localStorage.removeItem('application')
  const app = JSON.parse(localStorage.getItem('forgivenessApp') || '{}')
  const { colors } = useTheme()
  const [error, setError] = useState(false)
  useAnalytics()

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

  const footnote = css`
    display: block;
    color: ${colors.blueDark};
    font-size: 11px;
    margin-top: 4px;
    font-weight: 400;
  `

  const textLink = css`
    color: ${colors.blue};
    text-decoration: underline;
  `

  const redText = css`
    color: ${colors.red};
  `

  const getTotalPayroll = values => {
    const {
      payrollCostUnder100k,
      payrollCostOver100k,
      healthcareCosts,
      retirementPlanCosts,
      employerTaxCosts,
      ownerEmployeeCosts,
    } = values
    const line1 = payrollCostUnder100k !== '' ? payrollCostUnder100k : 0
    const line4 = payrollCostOver100k !== '' ? payrollCostOver100k : 0
    const line6 = healthcareCosts !== '' ? healthcareCosts : 0
    const line7 = retirementPlanCosts !== '' ? retirementPlanCosts : 0
    const line8 = employerTaxCosts !== '' ? employerTaxCosts : 0
    const line9 = ownerEmployeeCosts !== '' ? ownerEmployeeCosts : 0

    return (
      parseFloat(line1) +
      parseFloat(line4) +
      parseFloat(line6) +
      parseFloat(line7) +
      parseFloat(line8) +
      parseFloat(line9)
    ).toFixed(2)
  }

  const getFteTotal = values => {
    const { averageFteUnder100k, averageFteOver100k } = values
    const line2 = averageFteUnder100k !== '' ? averageFteUnder100k : 0
    const line5 = averageFteOver100k !== '' ? averageFteOver100k : 0

    return parseFloat(line2) + parseFloat(line5)
  }

  const getFteQuotient = values => {
    const { averageFteReference } = values
    const line11 = averageFteReference !== '' ? averageFteReference : 0
    const line12 = getFteTotal(values)

    return line11 > 0 ? (parseFloat(line12) / parseFloat(line11)).toFixed(2) : 0
  }

  const handleCalculatorSubmit = async (values, actions) => {
    actions.setSubmitting(true)
    setError(false)
    actions.setSubmitting(false)
    navigate('/forgiveness/calculator')
  }

  const getSafeHarbor = values => {
    const { noFteReduction, safeHarbor1, safeHarbor2 } = values

    return noFteReduction || safeHarbor1 || safeHarbor2
  }

  return (
    <Layout>
      <div css={formStyle}>
        <Heading size="1" align="center">
          Step 1. Loan Forgiveness Application
        </Heading>
        <p css={text}>
          We’re here to help with your PPP loan forgiveness application. Please
          verify the items in <span css={redText}>red</span> and then fill out
          the information below.
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
        <HelperText>
          <b>
            In order to get started, please fill out the following information
            below which corresponds to Schedule A of the PPP Loan Forgiveness
            Application.
          </b>
        </HelperText>
        <HelperText>
          <b>
            If you haven’t already filled out the PPP Schedule A Worksheet, we
            recommend doing so now. You can access the{' '}
            <a
              css={textLink}
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.sba.gov/sites/default/files/2021-01/PPP%20--%20Forgiveness%20Application%20and%20Instructions%20--%203508%20%281.19.2021%29-508.pdf"
            >
              PPP Schedule A Worksheet here.
            </a>
          </b>
        </HelperText>
        <div css={formWrap}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
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
                  <Heading size="2">
                    PPP Schedule A Worksheet Table 1 Totals
                  </Heading>
                  <div css={flexRow}>
                    <span css={label}>
                      Line 1.
                      <span css={subtext}>
                        Enter cash compensation (Box 1) from PPP Schedule A
                        Worksheet, Table 1:
                      </span>
                    </span>
                    <div css={fileInput}>
                      <Input
                        type="number"
                        name="payrollCostUnder100k"
                        label="100,000"
                        onChange={e => {
                          handleChange(e)
                          const payrollValue = getTotalPayroll({
                            ...values,
                            [e.target.name]: e.target.value,
                          })
                          setFieldValue('totalPayrollCosts', payrollValue)
                        }}
                        money
                      />
                    </div>
                  </div>
                  <div css={flexRow}>
                    <span css={label}>
                      Line 2.
                      <span css={subtext}>
                        Enter average FTE (Box 2) from PPP Schedule A Worksheet,
                        Table 1:
                      </span>
                    </span>
                    <div css={fileInput}>
                      <Input
                        type="number"
                        name="averageFteUnder100k"
                        label="Average FTE"
                        onChange={e => {
                          handleChange(e)
                          const isSafeHarbor = getSafeHarbor(values)
                          if (!isSafeHarbor) {
                            const fteTotal = getFteTotal({
                              ...values,
                              [e.target.name]: e.target.value,
                            })
                            setFieldValue('averageFteTotal', fteTotal)
                          }
                        }}
                        onBlur={e => {
                          setFieldValue(
                            'averageFteUnder100k',
                            parseFloat(e.target.value).toFixed(2)
                          )
                        }}
                      />
                    </div>
                  </div>
                  <div css={flexRow}>
                    <span css={label}>
                      Line 3.
                      <span css={subtext}>
                        Enter salary / hourly wage reduction (Box 3) from PPP
                        Schedule A Worksheet, Table 1:
                      </span>
                    </span>
                    <div css={fileInput}>
                      <Input
                        type="number"
                        name="wageReductionAdjustment"
                        label="100,000"
                        money
                      />
                    </div>
                  </div>
                  <Checkbox
                    name="noWageReduction"
                    label="If the average annual salary or hourly wage for each
                    employee listed on the PPP Schedule A Worksheet, Table 1
                    during the Covered Period or the Alternative Payroll Covered
                    Period was at least 75% of such employee’s average annual
                    salary or hourly wage between January 1, 2020 and March 31,
                    2020, please check the box and enter 0 on line 3."
                    onChange={e => {
                      handleChange(e)
                      if (e.target.checked) {
                        setFieldValue('wageReductionAdjustment', 0)
                      }
                    }}
                  />
                </div>
                <div css={section}>
                  <Heading size="2">
                    PPP Schedule A Worksheet, Table 2 Totals
                  </Heading>
                  <div css={flexRow}>
                    <span css={label}>
                      Line 4.
                      <span css={subtext}>
                        Enter cash compensation (Box 4) from PPP Schedule A
                        Worksheet, Table 2:
                      </span>
                    </span>
                    <div css={fileInput}>
                      <Input
                        type="number"
                        name="payrollCostOver100k"
                        label="100,000"
                        onChange={e => {
                          handleChange(e)
                          const payrollValue = getTotalPayroll({
                            ...values,
                            [e.target.name]: e.target.value,
                          })
                          setFieldValue('totalPayrollCosts', payrollValue)
                        }}
                        money
                      />
                    </div>
                  </div>
                  <div css={flexRow}>
                    <span css={label}>
                      Line 5.
                      <span css={subtext}>
                        Enter average FTE (Box 5) from PPP Schedule A Worksheet,
                        Table 2:
                      </span>
                    </span>
                    <div css={fileInput}>
                      <Input
                        type="number"
                        name="averageFteOver100k"
                        label="Average FTE Over 100k"
                        onChange={e => {
                          handleChange(e)
                          const isSafeHarbor = getSafeHarbor(values)
                          if (!isSafeHarbor) {
                            const fteTotal = getFteTotal({
                              ...values,
                              [e.target.name]: e.target.value,
                            })
                            setFieldValue('averageFteTotal', fteTotal)
                          }
                        }}
                        onBlur={e => {
                          setFieldValue(
                            'averageFteOver100k',
                            parseFloat(e.target.value).toFixed(2)
                          )
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div css={section}>
                  <Heading size="2">
                    Non-Cash Compensation Payroll Costs During the Covered
                    Period or the Alternative Covered Period
                  </Heading>
                  <div css={flexRow}>
                    <span css={label}>
                      Line 6.
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
                          setFieldValue('totalPayrollCosts', payrollValue)
                        }}
                        money
                      />
                    </div>
                  </div>
                  <div css={flexRow}>
                    <span css={label}>
                      Line 7.
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
                          setFieldValue('totalPayrollCosts', payrollValue)
                        }}
                        money
                      />
                    </div>
                  </div>
                  <div css={flexRow}>
                    <span css={label}>
                      Line 8.
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
                          setFieldValue('totalPayrollCosts', payrollValue)
                        }}
                        money
                      />
                    </div>
                  </div>
                </div>
                <div css={section}>
                  <Heading size="2">Compensation to Owners</Heading>
                  <div css={flexRow}>
                    <span css={label}>
                      Line 9.
                      <span css={subtext}>
                        Total amount paid to owner-employees / self-employed
                        individual / general partners:
                      </span>
                    </span>
                    <div css={fileInput}>
                      <Input
                        type="number"
                        name="ownerEmployeeCosts"
                        label="100,000"
                        onChange={e => {
                          handleChange(e)
                          const payrollValue = getTotalPayroll({
                            ...values,
                            [e.target.name]: e.target.value,
                          })
                          setFieldValue('totalPayrollCosts', payrollValue)
                        }}
                        money
                      />
                    </div>
                  </div>
                  <p css={footnote}>
                    This amount may not be included in PPP Schedule A Worksheet,
                    Table 1 or 2. If there is more than one individual included,
                    attach a separate table that lists the names of and payments
                    to each.
                  </p>
                </div>
                <div css={section}>
                  <Heading size="2">Total Payroll Costs</Heading>
                  <div css={flexRow}>
                    <span css={label}>
                      Line 10.
                      <span css={subtext}>
                        Payroll costs (add lines 1, 4, 6, 7, 8, and 9):
                      </span>
                    </span>
                    <div css={fileInput}>
                      <Input
                        type="number"
                        name="totalPayrollCosts"
                        label="100,000"
                        money
                        locked
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div css={section}>
                  <Heading size="2">
                    Full-time Equivalence (FTE) Reduction Calculation
                  </Heading>
                  <p>
                    <b>If you satisfy any</b> of the following three criteria,
                    check the appropriate box, skip lines 11 and 12, and enter
                    1.0 on line 13; otherwise, complete lines 11, 12, and 13:
                  </p>
                  <div css={row}>
                    <Checkbox
                      name="noFteReduction"
                      label="<b>No reduction in employees or average paid hours:</b> If you have not reduced the number of employees or the average paid hours of your employees between January 1, 2020 and the end of the Covered Period, check here"
                      onChange={e => {
                        handleChange(e)
                        if (e.target.checked) {
                          setFieldValue('averageFteReference', 0)
                          setFieldValue('averageFteTotal', 0)
                          setFieldValue('fteReductionQuotientAdjustment', 1)
                        } else {
                          const fteQuotient = getFteQuotient({
                            ...values,
                          })
                          setFieldValue(
                            'fteReductionQuotientAdjustment',
                            Math.min(1, fteQuotient)
                          )
                        }
                      }}
                    />
                  </div>
                  <div css={row}>
                    <Checkbox
                      name="safeHarbor1"
                      label="<b>FTE Reduction Safe Harbor 1:</b> If you were unable to operate between February 15, 2020, and the end of the Covered Period at the same level of business activity as before February 15, 2020 due to compliance with requirements established or guidance issued between March 1, 2020 and December 31, 2020, by the Secretary of Health and Human Services, the Director of the Centers for Disease Control and Prevention, or the Occupational Safety and Health Administration related to the maintenance of standards for sanitation, social distancing, or any other worker or customer safety requirement related to COVID-19, check here:"
                      onChange={e => {
                        handleChange(e)
                        if (e.target.checked) {
                          setFieldValue('averageFteReference', 0)
                          setFieldValue('averageFteTotal', 0)
                          setFieldValue('fteReductionQuotientAdjustment', 1)
                        } else {
                          const fteQuotient = getFteQuotient({
                            ...values,
                          })
                          setFieldValue(
                            'fteReductionQuotientAdjustment',
                            Math.min(1, fteQuotient)
                          )
                        }
                      }}
                    />
                  </div>
                  <div css={row}>
                    <Checkbox
                      name="safeHarbor2"
                      label="<b>FTE Reduction Safe Harbor 2:</b> If you satisfy FTE Reduction Safe Harbor 2 (see PPP Schedule A Worksheet), check here:"
                      onChange={e => {
                        handleChange(e)
                        if (e.target.checked) {
                          setFieldValue('averageFteReference', 0)
                          setFieldValue('averageFteTotal', 0)
                          setFieldValue('fteReductionQuotientAdjustment', 1)
                        } else {
                          const fteQuotient = getFteQuotient({
                            ...values,
                          })
                          setFieldValue(
                            'fteReductionQuotientAdjustment',
                            Math.min(1, fteQuotient)
                          )
                        }
                      }}
                    />
                  </div>
                  <div css={flexRow}>
                    <span css={label}>
                      Line 11.
                      <span css={subtext}>
                        Average FTE during the Borrower’s chosen reference
                        period:
                      </span>
                    </span>
                    <div css={fileInput}>
                      <Input
                        type="number"
                        name="averageFteReference"
                        label="Average FTE During Reference"
                        onChange={e => {
                          handleChange(e)
                          const fteQuotient = getFteQuotient({
                            ...values,
                            [e.target.name]: e.target.value,
                          })
                          setFieldValue(
                            'fteReductionQuotientAdjustment',
                            Math.min(1, fteQuotient)
                          )
                        }}
                        locked={getSafeHarbor(values)}
                        readOnly={getSafeHarbor(values)}
                      />
                    </div>
                  </div>
                  <div css={flexRow}>
                    <span css={label}>
                      Line 12.
                      <span css={subtext}>
                        Total average FTE (add lines 2 and 5):
                      </span>
                    </span>
                    <div css={fileInput}>
                      <Input
                        type="number"
                        name="averageFteTotal"
                        label="Total Average FTE"
                        onChange={e => {
                          handleChange(e)
                          const fteQuotient = getFteQuotient({
                            ...values,
                            [e.target.name]: e.target.value,
                          })
                          setFieldValue(
                            'fteReductionQuotientAdjustment',
                            Math.min(1, fteQuotient)
                          )
                        }}
                        locked
                        readOnly
                      />
                    </div>
                  </div>
                  <div css={flexRow}>
                    <span css={label}>
                      Line 13.
                      <span css={subtext}>
                        FTE reduction quotient (divide line 12 by line 11) or
                        enter 1.0 if FTE Safe Harbor is met:
                      </span>
                    </span>
                    <div css={fileInput}>
                      <Input
                        type="number"
                        name="fteReductionQuotientAdjustment"
                        label="FTE Reduction Quotient"
                        onChange={e =>
                          setFieldValue(
                            'fteReductionQuotientAdjustment',
                            Math.min(e.target.value, 1)
                          )}
                        locked
                        readOnly
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
                <Persist name="info" />
              </form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  )
}

export default ForgivenessInfo
