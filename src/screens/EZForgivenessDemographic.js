/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { navigate } from '@reach/router'
import { Formik } from 'formik'
import get from 'lodash/get'
import * as Yup from 'yup'
import Button from '../components/ui/button'
import FooterNav from '../components/ui/footerNav'
import Heading from '../components/ui/heading'
import Layout from '../components/layout'
import Persist from '../components/persist'
import SelectInput from '../components/ui/forms/select'
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

    & > p {
      width: 100%;
    }

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

const VETERAN_OPTIONS = [
  { label: 'Non-Veteran', value: 'non-veteran' },
  {
    label: 'Veteran',
    value: 'veteran',
  },
  {
    label: 'Service-Disabled Veteran',
    value: 'service-disabled',
  },
  { label: 'Spouse of Veteran', value: 'spouse' },
  { label: 'Prefer Not Disclosed', value: 'not-disclosed' },
]

const GENDER_OPTIONS = [
  {
    label: 'Male',
    value: 'male',
  },
  {
    label: 'Female',
    value: 'female',
  },
  { label: 'Prefer Not Disclosed', value: 'not-disclosed' },
]

const RACE_OPTIONS = [
  {
    label: 'American Indian or Alaska Native',
    value: 'american-indian-or-alaska-native',
  },
  {
    label: 'Asian',
    value: 'asian',
  },
  {
    label: 'Black or African-American',
    value: 'black',
  },
  {
    label: 'Native Hawaiian or Pacific Islander',
    value: 'native-hawaiian-or-islander',
  },
  {
    label: 'White',
    value: 'white',
  },
  { label: 'Prefer Not Disclosed', value: 'not-disclosed' },
]

const ETHNICITY_OPTIONS = [
  {
    label: 'Hispanic or Latino',
    value: 'hispanic-or-latino',
  },
  {
    label: 'Not Hispanic or Latino',
    value: 'non-hispanic-or-latino',
  },
  { label: 'Prefer Not Disclosed', value: 'not-disclosed' },
]

const validationSchema = Yup.object().shape({
  veteranStatus: Yup.string().oneOf([
    'veteran',
    'non-veteran',
    'service-disabled',
    'spouse',
    'not-disclosed',
  ]),
  gender: Yup.string().oneOf(['male', 'female', 'not-disclosed']),
  race: Yup.string().oneOf([
    'american-indian-or-alaska-native',
    'asian',
    'black',
    'native-hawaiian-or-islander',
    'white',
    'not-disclosed',
  ]),
  ethnicity: Yup.string().oneOf([
    'hispanic-or-latino',
    'non-hispanic-or-latino',
    'not-disclosed',
  ]),
})

const initialValues = {
  veteranStatus: 'not-disclosed',
  gender: 'not-disclosed',
  race: 'not-disclosed',
  ethnicity: 'not-disclosed',
}

const buttonStyles = {
  width: '170px',
  margin: '8px 0',
}

function ForgivenessDemographic() {
  const app = JSON.parse(localStorage.getItem('forgivenessApp') || '{}')
  useAnalytics()

  const handleStartSubmit = async (values, actions) => {
    const isEZ = get(app, 'loan.funding.loan.amount', 0) > 150000
    actions.setSubmitting(true)
    if (isEZ) {
      navigate('/forgiveness/ez/docs')
    } else {
      navigate('/forgiveness/ez/certs')
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
          Demographic Information
        </Heading>
        <div css={flexRow}>
          <p css={paragraph}>
            The following information is optional. If you wish you can choose
            "Prefer Not Disclosed" or simply click or tap "continue" without
            answering:
          </p>
          <div css={formWrap}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, actions) => handleStartSubmit(values, actions)}
            >
              {({
                handleSubmit,
                isSubmitting,
                setFieldTouched,
                setFieldValue,
              }) => (
                <form onSubmit={handleSubmit}>
                  <p>
                    Choose the option that best describes you or your
                    relationship to a veteran:
                  </p>
                  <div css={row}>
                    <SelectInput
                      setFieldTouched={setFieldTouched}
                      setFieldValue={setFieldValue}
                      defaultValue={0}
                      options={VETERAN_OPTIONS}
                      name="veteranStatus"
                    />
                  </div>
                  <p>What is your gender:</p>
                  <div css={row}>
                    <SelectInput
                      setFieldTouched={setFieldTouched}
                      setFieldValue={setFieldValue}
                      defaultValue={0}
                      options={GENDER_OPTIONS}
                      name="gender"
                    />
                  </div>
                  <p>Which option best describes your race:</p>
                  <div css={row}>
                    <SelectInput
                      setFieldTouched={setFieldTouched}
                      setFieldValue={setFieldValue}
                      defaultValue={0}
                      options={RACE_OPTIONS}
                      name="race"
                    />
                  </div>
                  <p>Which option best describes your ethnicity:</p>
                  <div css={row}>
                    <SelectInput
                      setFieldTouched={setFieldTouched}
                      setFieldValue={setFieldValue}
                      defaultValue={0}
                      options={ETHNICITY_OPTIONS}
                      name="ethnicity"
                    />
                  </div>
                  <Persist name="forgivenessDemographic" />
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
                    <Button css={buttonStyles} type="submit">
                      Continue
                    </Button>
                  </FooterNav>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ForgivenessDemographic
