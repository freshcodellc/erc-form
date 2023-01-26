/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { navigate } from '@reach/router'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Button from '../components/ui/button'
import Checkbox from '../components/ui/forms/checkbox'
import Heading from '../components/ui/heading'
import Layout from '../components/layout'
import Persist from '../components/persist'
import StatusBar from '../components/ui/statusBar'
import useAnalytics from '../components/analytics'

const formStyle = css`
  width: 100%;
  max-width: 800px;
  padding: 0 16px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  & div form,
  & div p {
    margin-top: 24px;
    margin-bottom: 16px;
  }
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

const flexRow = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
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

const validationSchema = Yup.object().shape({
  isSelfEmployedWithoutEmployees: Yup.bool()
    .oneOf([false, true], 'Required')
    .required('Required'),
  didNotReduceWagesOrEmployees: Yup.bool()
    .oneOf([false, true], 'Required')
    .required('Required'),
  wasUnableToOperate: Yup.bool()
    .oneOf([false, true], 'Required')
    .required('Required'),
})

const initialValues = {
  isSelfEmployedWithoutEmployees: false,
  didNotReduceWagesOrEmployees: false,
  wasUnableToOperate: false,
}

const buttonStyles = {
  width: '170px',
  margin: '8px 0',
}

function ForgivenessStart() {
  useAnalytics()

  const handleStartSubmit = async (values, actions) => {
    actions.setSubmitting(true)
    const {
      isSelfEmployedWithoutEmployees,
      didNotReduceWagesOrEmployees,
      wasUnableToOperate,
    } = values

    if (
      isSelfEmployedWithoutEmployees ||
      didNotReduceWagesOrEmployees ||
      wasUnableToOperate
    ) {
      navigate('/forgiveness/ez/calculator')
    } else {
      navigate('/forgiveness/info')
    }
    actions.setSubmitting(false)
  }

  const paragraph = css`
    text-align: center;
  `
  return (
    <Layout>
      <div css={formStyle}>
        <StatusBar steps={[1, 2, 3, 4, 5]} currentStep={5} />
        <Heading size="1" align="center">
          Forgiveness Start
        </Heading>
        <div css={flexRow}>
          <p css={paragraph}>
            You (the Borrower) can apply for forgiveness of your First or Second
            Draw Paycheck Protection Program (PPP) Loan using this SBA Form
            3508EZ if your PPP loan amount is more than $150,000 and you can
            check at least one of the two boxes below. If your loan amount is
            $150,000 or less, please use SBA Form 3508S. Do not submit this
            Checklist with your SBA Form 3508EZ. Each PPP loan must use a
            separate loan forgiveness application form. You cannot use one form
            to apply for forgiveness of both a First Draw PPP Loan and a Second
            Draw PPP loan. For a Second Draw PPP Loan in excess of $150,000, you
            must submit a loan forgiveness application for your First Draw PPP
            Loan before or simultaneously with the loan forgiveness application
            for your Second Draw PPP Loan, even if the calculated amount of
            forgiveness on your First Draw PPP Loan is zero.
          </p>
          <div css={formWrap}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, actions) => handleStartSubmit(values, actions)}
            >
              {({ handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                  <div css={row}>
                    <Checkbox
                      name="didNotReduceWagesOrEmployees"
                      label="The Borrower did not reduce annual salary or hourly wages of any employee by more than 25 percent during the Covered
Period compared to the most recent full quarter before the Covered Period. (For purposes of this statement, “employees”
means only those employees that did not receive, during any single period during 2019, wages or salary at an annualized
rate of pay in an amount more than $100,000.);
<br/><br/><b>AND</b><br/><br/>
The Borrower did not reduce the number of employees or the average paid hours of employees between January 1, 2020
and the end of the Covered Period."
                    />
                  </div>
                  <ul style={{ marginLeft: '60px', marginBottom: '16px' }}>
                    <li>
                      Ignore reductions that arose from an inability to rehire
                      individuals who were employees on February 15, 2020 if the
                      Borrower was unable to hire similarly qualified employees
                      for unfilled positions on or before December 31, 2020 (or,
                      for a PPP loan made after December 27, 2020, the last day
                      of the Covered Period).{' '}
                    </li>
                    <li>
                      Also ignore reductions in an employee’s hours that the
                      Borrower offered to restore and the employee refused. See{' '}
                      <a
                        href="https://www.govinfo.gov/content/pkg/FR-2020-06-01/pdf/2020-11536.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        85 FR 33004
                      </a>
                      , 33007 (June 1, 2020) for more details.
                    </li>
                  </ul>
                  <div css={row}>
                    <Checkbox
                      name="wasUnableToOperate"
                      label="The Borrower did not reduce annual salary or hourly wages of any employee by more than 25 percent during the Covered
Period compared to the most recent full quarter before the Covered Period. (For purposes of this statement, “employees”
means only those employees that did not receive, during any single period during 2019, wages or salary at an annualized
rate of pay in an amount more than $100,000,);<br/>
<b><br/>AND</b><br/><br/>
The Borrower was unable to operate during the Covered Period at the same level of business activity as before February
15, 2020, due to compliance with requirements established or guidance issued between March 1, 2020 and December 31,
2020 (or, for a PPP loan made after December 27, 2020, requirements established or guidance issued between March 1,
2020 and the last day of the Covered Period) by the Secretary of Health and Human Services, the Director of the Centers
for Disease Control and Prevention, or the Occupational Safety and Health Administration, related to the maintenance of
standards of sanitation, social distancing, or any other work or customer safety requirement related to COVID-19."
                    />
                  </div>
                  <Persist name="forgivenessStart" />
                  <Button css={buttonStyles} type="submit">
                    Continue
                  </Button>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ForgivenessStart
