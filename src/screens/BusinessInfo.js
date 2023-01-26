/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import React, { useEffect, useState } from 'react'
import { Formik, FieldArray } from 'formik'
import * as Yup from 'yup'
import { navigate } from '@reach/router'
import get from 'lodash/get'
import HelperText from '../components/ui/helperText'
import getAddressByZipcode from '../utils/addressHelpers'
import { normalizePhone, validateDate, validateState } from '../utils/validate'
import Button from '../components/ui/button'
import Checkbox from '../components/ui/forms/checkbox'
import Collapse from '../components/ui/collapse'
import Heading from '../components/ui/heading'
import Input from '../components/ui/forms/input'
import Layout from '../components/layout'
import FooterNav from '../components/ui/footerNav'
import Persist from '../components/persist'
import Radio from '../components/ui/forms/radio'
import SelectInput from '../components/ui/forms/select'
import StatusBar from '../components/ui/statusBar'
import BUSINESS_ENTITY_OPTIONS from '../constants/businessEntityTypeOptions'
import useAnalytics from '../components/analytics'
import getBankConfig from '../bankConfig'
import Modal from '../components/ui/modal'
import LimitSolePropSolera from '../components/modals/limitSolePropSolera'

const BLACKLISTED_ENTITY_TYPES = [
  'sole-proprietor',
  'independent-contractor',
  'self-employed',
]

const bank = getBankConfig()

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const validationSchema = Yup.object().shape({
  business: Yup.object().shape({
    establishedDate: Yup.string()
      .length(10, 'Use format MM/DD/YYYY')
      .test('validDate', 'Use format MM/DD/YYYY', validateDate)
      .required('Required'),
    entityType: Yup.string().required('Required'),
    tinType: Yup.string()
      .oneOf(['ein', 'ssn'])
      .required('Required'),
    isStartup: Yup.string().oneOf(['yes', 'no']),
    isScheduleC: Yup.string().oneOf(['yes', 'no']),
    entityName: Yup.string().required('Required'),
    naicsCode: Yup.string()
      .length(6)
      .required('Required'),
    dba: Yup.string(),
    tin: Yup.string()
      .matches(/^([0-9]+-)*[0-9]+$/, { message: 'Only numbers and hyphens' })
      .required('Required'),
    phone: Yup.string()
      .min(12, 'Phone must be at least 10 digits')
      .matches(phoneRegExp, {
        message: 'Please enter valid number.',
        excludeEmptyString: false,
      })
      .required('Required'),
    jobs: Yup.number().required('Required'),
    projectedJobsRetained: Yup.number().required('Required'),
    projectedJobsAdded: Yup.number().required('Required'),
    purposes: Yup.object().shape({
      payroll: Yup.bool(),
      rent: Yup.bool(),
      utilities: Yup.bool(),
      other: Yup.bool(),
      otherText: Yup.string().when('other', {
        is: true,
        then: Yup.string().required('Required'),
      }),
    }),
    address: Yup.object().shape({
      address1: Yup.string().required('Required'),
      address2: Yup.string(),
      city: Yup.string().required('Required'),
      state: Yup.string()
        .test('validState', 'Must be valid state.', validateState)
        .required('Required'),
      postcode: Yup.string()
        .min(5, 'Must be 5 digits')
        .max(5, 'Must be 5 digits')
        .required('Required'),
    }),
    location: Yup.object().shape({
      address1: Yup.string().required('Required'),
      address2: Yup.string(),
      city: Yup.string().required('Required'),
      state: Yup.string()
        .test('validState', 'Must be valid state.', validateState)
        .required('Required'),
      postcode: Yup.string()
        .min(5, 'Must be 5 digits')
        .max(5, 'Must be 5 digits')
        .required('Required'),
    }),
    owners: Yup.array().of(
      Yup.object().shape({
        isBusiness: Yup.bool(),
        tinType: Yup.string().when('isBusiness', {
          is: true,
          then: Yup.string()
            .oneOf(['ein', 'ssn'], { message: 'Required' })
            .required('Required'),
        }),
        entityType: Yup.string().when('isBusiness', {
          is: true,
          then: Yup.string().required('Required'),
        }),
        name: Yup.string().when('isBusiness', {
          is: true,
          then: Yup.string().required('Required'),
        }),
        firstName: Yup.string().when('isBusiness', {
          is: false,
          then: Yup.string().required('Required'),
        }),
        lastName: Yup.string().when('isBusiness', {
          is: false,
          then: Yup.string().required('Required'),
        }),
        title: Yup.string().when('isBusiness', {
          is: false,
          then: Yup.string().required('Required'),
        }),
        dateOfBirth: Yup.string().when('isBusiness', {
          is: false,
          then: Yup.string()
            .length(10, 'Use format MM/DD/YYYY')
            .test('validDate', 'Use format MM/DD/YYYY', validateDate)
            .required('Required'),
        }),
        percent: Yup.number()
          .typeError('Must be a number (no %)')
          .lessThan(101, 'Must be 100 or less')
          .required('Required'),
        tin: Yup.string()
          .matches(/^([0-9]+-)*[0-9]+$/, {
            message: 'Only numbers and hyphens',
          })
          .required('Required'),
        address: Yup.object().shape({
          address1: Yup.string().required('Required'),
          address2: Yup.string(),
          city: Yup.string().required('Required'),
          state: Yup.string()
            .test('validState', 'Must be valid state.', validateState)
            .required('Required'),
          postcode: Yup.string()
            .min(5, 'Must be 5 digits')
            .max(5, 'Must be 5 digits')
            .required('Required'),
        }),
      })
    ),
  }),
})

const initialValues = {
  business: {
    establishedDate: '',
    entityType: '',
    tinType: '',
    entityName: '',
    naicsCode: '',
    dba: '',
    tin: '',
    phone: '',
    jobs: '',
    projectedJobsRetained: '',
    projectedJobsAdded: '',
    purposes: {
      payroll: false,
      rent: false,
      utilities: false,
      other: false,
      otherText: '',
    },
    address: {
      address1: '',
      address2: '',
      city: '',
      postcode: '',
      state: '',
    },
    location: {
      address1: '',
      address2: '',
      city: '',
      postcode: '',
      state: '',
    },
    owners: [
      {
        isBusiness: false,
        tinType: 'ssn',
        entityType: '',
        name: '',
        firstName: '',
        lastName: '',
        title: '',
        percent: '',
        tin: '',
        dateOfBirth: '',
        address: {
          address1: '',
          address2: '',
          city: '',
          postcode: '',
          state: '',
        },
      },
    ],
  },
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
  align-items: flex-start;
  justify-content: center;

  & form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    & > div {
      align-self: stretch;
    }
  }
`

const section = css`
  margin-top: 32px;
`

const buttonStyles = css`
  width: 170px;
  margin: 8px;
`

const row = css`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 520px) {
    flex-direction: column;
  }

  & > div {
    flex: 1 1 auto;
  }
`

const rowVertical = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 8px;

  & > div {
    flex: 1 1 auto;
  }
`

const buttonRow = css`
  display: flex;
  align-items: center;
  justify-content: center;
`

function BusinessInfo() {
  const { colors } = useTheme()
  const [showModal, setShowModal] = useState(false)
  useAnalytics()
  localStorage.removeItem('application')

  const radioRow = css`
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

  const ownerStyle = css`
    border: 1px solid ${colors.grey800};
    padding: 16px;
    margin-bottom: 8px;
  `

  const ownerTitle = css`
    margin-bottom: 8px;
  `

  const linkLabel = css`
    & a {
      display: inline-block;
      color: ${colors.blue};

      &:hover {
        text-decoration: underline;
      }
    }
  `

  const lookupZipcode = async (zipcode, replaceMap, setFieldValue) => {
    const address = await getAddressByZipcode(zipcode)
    if (address) {
      Object.entries(replaceMap).forEach(([key, fieldKey]) => {
        setFieldValue(fieldKey, address[key])
      })
    }
  }

  const handleZip = async (
    { target: { value } },
    setFieldValue,
    addressType
  ) => {
    if (value.length === 5) {
      lookupZipcode(
        value,
        { city: `${addressType}.city`, state: `${addressType}.state` },
        setFieldValue
      )
    }
  }

  const handleLoginSubmit = async (values, actions) => {
    actions.setSubmitting(true)
    if (
      (bank.limitSoleProps &&
        BLACKLISTED_ENTITY_TYPES.includes(values.business.entityType)) ||
      (bank.limitSoleProps && values.business.isStartup === 'yes') ||
      (bank.limitSoleProps && values.business.isScheduleC === 'yes')
    ) {
      setShowModal(true)
    } else {
      navigate('disclosures')
    }
    actions.setSubmitting(false)
  }

  useEffect(() => {
    const formValues = JSON.parse(localStorage.getItem('businessInfo') || '{}')
    const selectedEntityType = get(formValues, 'values.business.entityType', '')
    const startupResponse = get(formValues, 'values.business.isStartup', '')
    const scheduleResponse = get(formValues, 'values.business.isScheduleC', '')
    if (
      (bank.limitSoleProps &&
        BLACKLISTED_ENTITY_TYPES.includes(selectedEntityType)) ||
      (bank.limitSoleProps && startupResponse === 'yes') ||
      (bank.limitSoleProps && scheduleResponse === 'yes')
    ) {
      setShowModal(true)
    }
  }, [])

  return (
    <Layout>
      <div css={formStyle}>
        <StatusBar steps={[1, 2, 3, 4, 5]} currentStep={2} />
        <Heading size="1" align="center">
          Business Information
        </Heading>
        <div css={formWrap}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleLoginSubmit(values, actions)}
          >
            {({
              handleSubmit,
              handleChange,
              isSubmitting,
              setFieldValue,
              setFieldTouched,
              values,
            }) => (
              <form onSubmit={handleSubmit}>
                {bank.id === 'seattle' && (
                  <React.Fragment>
                    <div css={radioRow}>
                      <Radio
                        id="isStartup-yes"
                        name="business.isStartup"
                        label="Yes"
                        value="yes"
                        checked={values.business.isStartup === 'yes'}
                      />
                      <Radio
                        id="isStartup-no"
                        name="business.isStartup"
                        label="No"
                        value="no"
                        checked={values.business.isStartup === 'no'}
                      />
                      <p>Was your business started after January 1st, 2019?</p>
                    </div>
                    <div css={radioRow}>
                      <Radio
                        id="isScheduleC-yes"
                        name="business.isScheduleC"
                        label="Yes"
                        value="yes"
                        checked={values.business.isScheduleC === 'yes'}
                      />
                      <Radio
                        id="isScheduleC-no"
                        name="business.isScheduleC"
                        label="No"
                        value="no"
                        checked={values.business.isScheduleC === 'no'}
                      />
                      <p>Are you an LLC submitting a Schedule C?</p>
                    </div>
                  </React.Fragment>
                )}
                <div css={row}>
                  <SelectInput
                    setFieldTouched={setFieldTouched}
                    setFieldValue={setFieldValue}
                    defaultValue={0}
                    options={BUSINESS_ENTITY_OPTIONS}
                    name="business.entityType"
                    runOnChange={fieldValue => {
                      if (fieldValue !== 'sole-proprietor') {
                        setFieldValue(`business.tinType`, 'ein')
                      } else {
                        setFieldValue(`business.tinType`, '')
                      }
                    }}
                  />
                </div>
                <div css={row}>
                  <Input
                    type="text"
                    name="business.entityName"
                    label="Entity Name"
                  />
                  <Input type="text" name="business.dba" label="DBA" />
                </div>
                {values.business.entityType === 'sole-proprietor' && (
                  <div css={radioRow}>
                    <Radio
                      id="tinType-ssn"
                      name="business.tinType"
                      label="SSN"
                      value="ssn"
                      checked={values.business.tinType === 'ssn'}
                    />
                    <Radio
                      id="tinType-ein"
                      name="business.tinType"
                      label="EIN"
                      value="ein"
                      checked={values.business.tinType === 'ein'}
                    />
                    <p>
                      What type of tax identification number will you enter
                      below? (Social Security Number or Employer ID)
                    </p>
                  </div>
                )}
                <div css={row}>
                  <Input
                    type="text"
                    autoComplete="off"
                    name="business.tin"
                    label={
                      values.business.entityType === 'sole-proprietor'
                        ? 'SSN'
                        : 'EIN'
                    }
                  />
                  <Input
                    type="text"
                    name="business.phone"
                    label="Phone"
                    onChange={e =>
                      setFieldValue(
                        e.target.name,
                        normalizePhone(e.target.value),
                        false
                      )}
                  />
                </div>
                <div css={rowVertical}>
                  <span css={linkLabel}>
                    Search for your NAICS code{' '}
                    <a
                      href="https://www.naics.com/search/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </a>
                  </span>

                  <Input
                    type="text"
                    autoComplete="off"
                    name="business.naicsCode"
                    label="NAICS Code"
                  />
                </div>
                <div css={rowVertical}>
                  Date company was established
                  <Input
                    type="date"
                    name="business.establishedDate"
                    label="Date Established (mm/dd/yyyy)"
                  />
                </div>
                <HelperText>
                  Please enter the number of employees in your business today:
                </HelperText>
                <div css={row}>
                  <Input
                    type="number"
                    name="business.jobs"
                    label="Number of Employees"
                    min="0"
                    step="1"
                  />
                </div>

                <HelperText>
                  Please enter your plans for employee retention and/or growth
                  below:
                </HelperText>
                <div css={row}>
                  <Input
                    type="number"
                    name="business.projectedJobsRetained"
                    label="Number of Employees Retained"
                    min="0"
                    step="1"
                  />
                  <Input
                    type="number"
                    name="business.projectedJobsAdded"
                    label="Number of Employees Added"
                    min="0"
                    step="1"
                  />
                </div>

                <HelperText>
                  What is the purpose of the loan? Select all that apply.
                </HelperText>
                <div css={rowVertical}>
                  <Checkbox name="business.purposes.payroll" label="Payroll" />
                  <Checkbox
                    name="business.purposes.rent"
                    label="Lease / Mortgage Interest"
                  />
                  <Checkbox
                    name="business.purposes.utilities"
                    label="Utilities"
                  />
                  <Checkbox name="business.purposes.other" label="Other" />
                  <Collapse
                    maxHeight={1000}
                    isOpen={values.business.purposes.other}
                  >
                    <Input
                      type="text"
                      name="business.purposes.otherText"
                      label="Describe Other"
                    />
                  </Collapse>
                </div>
                <div css={section}>
                  <Heading size="3">Business Address</Heading>
                  <Input
                    type="text"
                    name="business.address.address1"
                    label="Address"
                  />
                  <Input
                    type="text"
                    name="business.address.address2"
                    label="Address 2"
                  />
                  <div css={row}>
                    <Input
                      type="text"
                      name="business.address.postcode"
                      label="Zip"
                      onChange={e => {
                        setFieldValue(
                          e.target.name,
                          e.target.value.substring(0, 5),
                          false
                        )
                        handleZip(e, setFieldValue, 'business.address')
                      }}
                    />
                    <Input
                      type="text"
                      name="business.address.city"
                      label="City"
                    />
                    <Input
                      type="text"
                      name="business.address.state"
                      label="State"
                    />
                  </div>
                </div>
                <div css={section}>
                  <Heading size="3">Primary Business Location</Heading>
                  <Input
                    type="text"
                    name="business.location.address1"
                    label="Address"
                  />
                  <Input
                    type="text"
                    name="business.location.address2"
                    label="Address 2"
                  />
                  <div css={row}>
                    <Input
                      type="text"
                      name="business.location.postcode"
                      label="Zip"
                      onChange={e => {
                        setFieldValue(
                          e.target.name,
                          e.target.value.substring(0, 5),
                          false
                        )
                        handleZip(e, setFieldValue, 'business.location')
                      }}
                    />
                    <Input
                      type="text"
                      name="business.location.city"
                      label="City"
                    />
                    <Input
                      type="text"
                      name="business.location.state"
                      label="State"
                    />
                  </div>
                </div>
                <div css={section}>
                  <Heading size="3">Ownership</Heading>

                  <HelperText>
                    Please list all owners with greater than 20% ownership
                    stakes in your business:
                  </HelperText>

                  <FieldArray
                    name="business.owners"
                    render={(arrayHelpers, i) => (
                      <fieldset>
                        {values.business.owners &&
                        values.business.owners.length > 0 ? (
                          values.business.owners.map((owner, index) => (
                            <div key={index} css={ownerStyle}>
                              <p css={ownerTitle}>Owner {index + 1}</p>
                              <Checkbox
                                name={`business.owners.${index}.isBusiness`}
                                label="This owner is a business entity"
                                onChange={e => {
                                  handleChange(e)
                                  if (!e.target.checked) {
                                    setFieldValue(
                                      `business.owners.${index}.tinType`,
                                      'ssn'
                                    )
                                  } else {
                                    setFieldValue(
                                      `business.owners.${index}.tinType`,
                                      'ein'
                                    )
                                  }
                                }}
                              />
                              <br />
                              {owner.isBusiness && (
                                <React.Fragment>
                                  <div css={row}>
                                    <SelectInput
                                      setFieldTouched={setFieldTouched}
                                      setFieldValue={setFieldValue}
                                      defaultValue={0}
                                      options={BUSINESS_ENTITY_OPTIONS}
                                      name={`business.owners.${index}.entityType`}
                                      runOnChange={fieldValue => {
                                        if (fieldValue !== 'sole-proprietor') {
                                          setFieldValue(
                                            `business.owners.${index}.tinType`,
                                            'ein'
                                          )
                                        }
                                      }}
                                    />
                                  </div>
                                  {values.business.owners[index].entityType ===
                                    'sole-proprietor' && (
                                    <div css={radioRow}>
                                      <Radio
                                        id={`owner${index}TinType-ssn`}
                                        name={`business.owners.${index}.tinType`}
                                        label="SSN"
                                        value="ssn"
                                        checked={
                                          values.business.owners[index]
                                            .tinType === 'ssn'
                                        }
                                      />
                                      <Radio
                                        id={`owner${index}TinType-ein`}
                                        name={`business.owners.${index}.tinType`}
                                        label="EIN"
                                        value="ein"
                                        checked={
                                          values.business.owners[index]
                                            .tinType === 'ein'
                                        }
                                      />
                                      <p>
                                        What type of tax identification number
                                        will you enter below? (Social Security
                                        Number or Employer ID)
                                      </p>
                                    </div>
                                  )}
                                  <div css={row}>
                                    <Input
                                      type="text"
                                      name={`business.owners.${index}.name`}
                                      label="Name"
                                    />
                                  </div>
                                </React.Fragment>
                              )}
                              {!owner.isBusiness && (
                                <React.Fragment>
                                  <div css={row}>
                                    <Input
                                      type="text"
                                      name={`business.owners.${index}.firstName`}
                                      label="First Name"
                                    />
                                    <Input
                                      type="text"
                                      name={`business.owners.${index}.lastName`}
                                      label="Last Name"
                                    />
                                  </div>
                                  <div css={row}>
                                    Date of birth
                                    <Input
                                      type="date"
                                      name={`business.owners.${index}.dateOfBirth`}
                                      label="Birth Date (mm/dd/yyyy)"
                                    />
                                  </div>
                                  <div css={row}>
                                    <Input
                                      type="text"
                                      name={`business.owners.${index}.title`}
                                      label="Title"
                                    />
                                  </div>
                                </React.Fragment>
                              )}
                              <div css={row}>
                                <Input
                                  type="number"
                                  name={`business.owners.${index}.percent`}
                                  label="Ownership %"
                                  min="0"
                                  max="100"
                                  step="0.1"
                                />
                                <Input
                                  type="text"
                                  autoComplete="off"
                                  name={`business.owners.${index}.tin`}
                                  label={
                                    values.business.owners[index].isBusiness
                                      ? 'EIN'
                                      : 'SSN'
                                  }
                                />
                              </div>
                              <Input
                                type="text"
                                name={`business.owners.${index}.address.address1`}
                                label="Address"
                              />
                              <Input
                                type="text"
                                name={`business.owners.${index}.address.address2`}
                                label="Address 2"
                              />
                              <div css={row}>
                                <Input
                                  type="text"
                                  name={`business.owners.${index}.address.postcode`}
                                  label="Zip"
                                  onChange={e => {
                                    setFieldValue(
                                      e.target.name,
                                      e.target.value.substring(0, 5),
                                      false
                                    )
                                    handleZip(
                                      e,
                                      setFieldValue,
                                      `business.owners.${index}.address`
                                    )
                                  }}
                                />
                                <Input
                                  type="text"
                                  name={`business.owners.${index}.address.city`}
                                  label="City"
                                />
                                <Input
                                  type="text"
                                  name={`business.owners.${index}.address.state`}
                                  label="State"
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <span>Must have at least one owner</span>
                        )}
                        <div css={buttonRow}>
                          {values.business.owners.length > 1 && (
                            <Button
                              css={buttonStyles}
                              hollow
                              loading={isSubmitting}
                              disabled={isSubmitting}
                              onClick={() => arrayHelpers.pop()}
                            >
                              Remove Owner
                            </Button>
                          )}
                          <Button
                            css={buttonStyles}
                            hollow
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            onClick={() =>
                              arrayHelpers.push(
                                initialValues.business.owners[0]
                              )}
                          >
                            Add Owner
                          </Button>
                        </div>
                      </fieldset>
                    )}
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
                    Continue
                  </Button>
                </FooterNav>
                <Persist name="businessInfo" />
                {bank.limitSoleProps && (
                  <Modal
                    disableClose={false}
                    isOpen={showModal}
                    onCloseClicked={() => setShowModal(false)}
                  >
                    <LimitSolePropSolera
                      closeModal={() => setShowModal(false)}
                    />
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

export default BusinessInfo
