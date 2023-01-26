/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import React, { useEffect, useState } from 'react'
import { useTheme } from 'emotion-theming'
import { Formik, FieldArray } from 'formik'
import * as Yup from 'yup'
import { navigate } from '@reach/router'
import axios from 'axios'
import get from 'lodash/get'
import format from 'date-fns/format'
import isNaN from 'lodash/isNaN'
import isNull from 'lodash/isNull'
import isUndefined from 'lodash/isUndefined'
import filter from 'lodash/filter'
import slugify from 'slugify'
import isNumber from 'lodash/isNumber'
import { formatCurrency } from '../utils/helpers'
import { validateFullName } from '../utils/validate'
import Button from '../components/ui/button'
import Heading from '../components/ui/heading'
import Modal from '../components/ui/modal'
import Layout from '../components/layout'
import Persist from '../components/persist'
import Checkbox from '../components/ui/forms/checkbox'
import Collapse from '../components/ui/collapse'
import FileInput from '../components/ui/forms/fileInput'
import Input from '../components/ui/forms/input'
import FooterNav from '../components/ui/footerNav'
import HelperText from '../components/ui/helperText'
import StatusBar from '../components/ui/statusBar'
import SelectInput from '../components/ui/forms/select'
import FormViewer from '../components/documents/formViewer'
import EsignDoc from '../components/documents/eSign'
import getBankConfig from '../bankConfig'
import getFileToken from '../utils/fileToken'
import DOC_MAP from '../constants/loanDocs'
import useAnalytics from '../components/analytics'
import LimitSolePropSolera from '../components/modals/limitSolePropSolera'
import config from '../config'

const FINANCIALS_REQUIRED = ['w3', 'form940', 'form941']

const FILE_FIELDS = [
  { key: 'yearEndFinancialStatements2019', multiple: false },
  { key: 'payrollRegister', multiple: false },
  { key: 'february2020Payroll', multiple: false },
  { key: 'healthInsuranceDoc', multiple: false },
  { key: 'retirementPlanDoc', multiple: false },
  { key: 'payrollTaxDoc', multiple: false },
  { key: 'additionalSupportingDocs', multiple: false },
  { key: 'calculateLoanDocs', multiple: true },
  { key: 'primaryIds', multiple: true },
  { key: 'entityDocs', multiple: true },
]

const DATA_SOURCE_OPTIONS = [
  { label: 'Choose one of the following sources', value: '' },
  { label: '2019 W-3', value: 'w3' },
  { label: '2019 Form 940', value: 'form940' },
  { label: '2019 Form 941', value: 'form941' },
  { label: '1099/K-1/Schedule C', value: 'taxDoc' },
]

const DYNAMIC_LABELS = {
  w3: '2019 W-3 Box 5',
  form940: 'Form 940 Line 3 - Line 4',
  form941: 'Box 5c Q1+Q2+Q3+Q4',
  taxDoc: 'Schedule C line 31',
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
`

const sectionHeading = css`
  margin-top: 36px;
`

const subheading = css`
  font-weight: 300;
  margin-top: 24px;
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
    justify-content: center;

    & > div {
      align-self: stretch;
    }
  }
`

const buttonStyles = {
  width: '170px',
}

const flexRow = css`
  display: flex;
  align-items: center;
  margin: 24px 0;
`

const fileInput = css`
  flex: 5;
`

const consentRow = css`
  & > div {
    margin: 16px 0;
  }
`

const boldText = css`
  font-weight: 600;
  line-height: 1.3em;
`

const lightText = css`
  font-weight: 300;
`

const row = css`
  display: flex;
  justify-content: space-between;
  margin: 24px 0;

  @media screen and (max-width: 520px) {
    flex-direction: column;
  }

  & > div {
    flex: 1 1 auto;
  }
`

const rowSimple = css`
  display: flex;
  justify-content: space-between;
  margin: 8px 0;

  @media screen and (max-width: 520px) {
    flex-direction: column;
  }

  & > div {
    flex: 1 1 auto;
  }
`

const PrimaryIdArrayErrors = ({ errors }) =>
  typeof errors.primaryIds === 'string' ? (
    <div
      css={css`
        color: #f27927;
      `}
    >
      {errors.primaryIds}
    </div>
  ) : null

const EntityDocsArrayErrors = ({ errors }) =>
  typeof errors.entityDocs === 'string' ? (
    <div
      css={css`
        color: #f27927;
      `}
    >
      {errors.entityDocs}
    </div>
  ) : null

const CalculatedDocsArrayErrors = ({ errors }) =>
  typeof errors.calculateLoanDocs === 'string' ? (
    <div
      css={css`
        color: #f27927;
      `}
    >
      {errors.calculateLoanDocs}
    </div>
  ) : null

const NonFieldErrors = ({ errors }) =>
  typeof errors.non_field_errors === 'string' ? (
    <div
      css={css`
        color: #f27927;
      `}
    >
      {errors.non_field_errors}
    </div>
  ) : null

function Certifications() {
  const { colors } = useTheme()
  const [showModal, setShowModal] = useState(false)
  useAnalytics()
  const bank = getBankConfig()
  const token = getFileToken()
  const [appError, setAppError] = useState(false)
  const [showEsign, setShowEsign] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [calculatedLoanAmt, setCalculatedLoanAmt] = useState(0)
  const [fileUploadStats, setFileUploadStats] = useState({
    total: 0,
    current: 0,
  })
  const customerInfoData = localStorage.getItem('customerInfo')
  const parsedCustomerInfoData = JSON.parse(customerInfoData)
  const isBankCustomer = get(
    parsedCustomerInfoData,
    'values.customer.isBankCustomer',
    'no'
  )

  const businessInfoStored = localStorage.getItem('businessInfo') || '{}'
  const businessInfoValues = JSON.parse(businessInfoStored)
  const currentFormValues = localStorage.getItem('certifications') || '{}'
  const parsedCurrentFormValues = JSON.parse(currentFormValues)
  const dataSourceValue = get(parsedCurrentFormValues, 'values.dataSource', '')
  const entityTypeValue = get(parsedCurrentFormValues, 'values.entityType', '')
  const businessOwners = get(businessInfoValues, 'values.business.owners', [])
  const individualBusinessOwners = filter(
    businessOwners,
    owner => !owner.isBusiness
  )

  const calculateDocsArray = []
  const entityDocsArray = []
  const primaryIdsDocsArray = []
  if (dataSourceValue && dataSourceValue.length > 0) {
    DOC_MAP[dataSourceValue].forEach(() => calculateDocsArray.push(''))
  }
  if (entityTypeValue && entityTypeValue.length > 0) {
    const currentSelectedBank = getBankConfig()
    currentSelectedBank.docs[entityTypeValue].forEach(() =>
      entityDocsArray.push('')
    )
  }

  if (businessOwners && businessOwners.length > 0) {
    individualBusinessOwners.forEach(owner => primaryIdsDocsArray.push(''))
  }

  const initialValues = {
    payrollDoesNotInclude1099: '',
    signature: '',
    signatureDate: format(new Date(), 'yyyy-MM-dd'),
    signeeTitle: '',
    eSignConsent: '',
    calculateLoanDocs: calculateDocsArray,
    yearEndFinancialStatements2019: null,
    payrollRegister: null,
    february2020Payroll: null,
    healthInsuranceDoc: null,
    retirementPlanDoc: null,
    payrollTaxPlanDoc: null,
    additionalSupportingDocs: null,
    primaryIds: primaryIdsDocsArray,
    bankCustomerName: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    entityDocs: entityDocsArray,
    entityType: '',
    dataSource: '',
    dynamicPayroll: '',
    healthCoverageCost: '',
    retirementBenefitsCost: '',
    statePayrollTaxCost: '',
    wagesOverLimit: '',
    nonResidentPayroll: '',
    sickLeaveWages: '',
    eidlLoanAmount: '',
    loanAmount: '',
  }

  const validationSchema = Yup.object().shape({
    payrollDoesNotInclude1099: Yup.bool()
      .oneOf(
        [true],
        'Must agree to not include 1099 workers in payroll calculations'
      )
      .required('Required'),
    signature: Yup.string()
      .test(
        'validateFullName',
        'Please enter first and last name',
        validateFullName
      )
      .required('Required'),
    signatureDate: Yup.string().required('Required'),
    eSignConsent: Yup.bool()
      .oneOf([true], 'Must Accept the eSign Consent')
      .required('Required'),
    signeeTitle: Yup.string().required('Required'),
    calculateLoanDocs: Yup.array().when('dataSource', (dataSource, schema) =>
      dataSource !== '' && !isUndefined(dataSource)
        ? schema
            .of(Yup.mixed().required())
            .min(
              DOC_MAP[dataSource].length,
              'Please add a document for each of the fields below.'
            )
            .required('The documents below are required.')
        : schema.of(Yup.mixed())
    ),
    yearEndFinancialStatements2019: Yup.mixed().when(
      'dataSource',
      (dataSource, schema) =>
        dataSource !== '' &&
        !isUndefined(dataSource) &&
        FINANCIALS_REQUIRED.includes(dataSource)
          ? schema.required('Required.')
          : schema
    ),
    payrollRegister: Yup.mixed().when('dataSource', (dataSource, schema) =>
      dataSource !== '' &&
      !isUndefined(dataSource) &&
      FINANCIALS_REQUIRED.includes(dataSource)
        ? schema.required('Required.')
        : schema
    ),
    february2020Payroll: Yup.mixed().when('dataSource', (dataSource, schema) =>
      dataSource !== '' &&
      !isUndefined(dataSource) &&
      FINANCIALS_REQUIRED.includes(dataSource)
        ? schema.required('Required.')
        : schema
    ),
    healthInsuranceDoc: Yup.mixed().when(
      'healthCoverageCost',
      (healthCoverageCost, schema) =>
        healthCoverageCost !== '' &&
        !isUndefined(healthCoverageCost) &&
        healthCoverageCost > 0
          ? schema.required(
              'Required because you entered insurance costs above.'
            )
          : schema
    ),
    retirementPlanDoc: Yup.mixed().when(
      'retirementBenefitsCost',
      (retirementBenefitsCost, schema) =>
        retirementBenefitsCost !== '' &&
        !isUndefined(retirementBenefitsCost) &&
        retirementBenefitsCost > 0
          ? schema.required(
              'Required because you entered retirement costs above.'
            )
          : schema
    ),
    payrollTaxPlanDoc: Yup.mixed().when(
      'statePayrollTaxCost',
      (statePayrollTaxCost, schema) =>
        statePayrollTaxCost !== '' &&
        !isUndefined(statePayrollTaxCost) &&
        statePayrollTaxCost > 0
          ? schema.required(
              'This field is required because you entered state or local payroll costs above.'
            )
          : schema
    ),
    additionalSupportingDocs: Yup.mixed(),
    primaryIds:
      individualBusinessOwners.length > 0
        ? Yup.array()
            .of(Yup.mixed().required())
            .required()
        : Yup.array().of(Yup.mixed()),
    bankName: Yup.string().required('Required'),
    bankCustomerName: Yup.string().required('Required'),
    accountNumber: Yup.number().required('Required'),
    routingNumber: Yup.number().required('Required'),
    entityDocs: Yup.array().when('entityType', (entityType, schema) =>
      entityType !== '' &&
      !isUndefined(entityType) &&
      entityType !== 'independent' &&
      isBankCustomer === 'no'
        ? schema
            .of(Yup.mixed().required())
            .min(
              bank.docs[entityType].length,
              'Please add a document for each of the fields below.'
            )
            .required('The documents below are required.')
        : schema.of(Yup.mixed())
    ),
    entityType:
      isBankCustomer === 'no' ? Yup.string().required() : Yup.string(),
    dataSource: Yup.string().required(),
    dynamicPayroll: Yup.number().required('Required (can be 0)'),
    healthCoverageCost: Yup.number().required('Required (can be 0)'),
    retirementBenefitsCost: Yup.number().required('Required (can be 0)'),
    statePayrollTaxCost: Yup.number().required('Required (can be 0)'),
    wagesOverLimit: Yup.number().required('Required (can be 0)'),
    nonResidentPayroll: Yup.number().required('Required (can be 0)'),
    sickLeaveWages: Yup.number().required('Required (can be 0)'),
    eidlLoanAmount: Yup.number().required('Required (can be 0)'),
    loanAmount: Yup.number()
      .min(1)
      .max(
        calculatedLoanAmt + 0.01,
        'Cannot request more than elligible amount'
      )
      .required('Required'),
  })

  const textLink = css`
    color: ${colors.blue};
    &:hover {
      text-decoration: underline;
    }
  `

  const columnWrap = css`
    color: ${colors.blueLight};
    font-weight: 300;
    font-size: 12px;
    margin-right: 16px;
    &:last-of-type {
      margin-right: 0;
    }
  `

  const listStyle = css`
    margin-left: 36px;
    margin-bottom: 24px;
    margin-top: 12px;
    list-style-type: none;

    & > li {
      margin: 6px 0;
      font-size: 11px;
    }
  `

  const progress = css`
    color: ${colors.green};
  `

  const errorBox = css`
    color: ${colors.orange};
    width: 100%;
    text-align: center;
  `

  const ruler = css`
    border: 0;
    height: 2px;
    background-color: ${colors.grey400};
  `

  const label = css`
    display: block;
    font-size: 18px;
    color: ${colors.blueDark};
    flex: 3;
    margin-right: 8%;
  `

  const simpleLabel = css`
    flex: 3;
    margin-right: 8%;
    display: block;
    color: #253551;
    font-size: 13px;
    line-height: 1.3em;
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

  const box = css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${colors.grey400};
    padding: 16px;

    & span {
      position: absolute;
      top: 16px;
      left: 16px;
    }

    & p {
      margin: 24px 0 8px 0;
      font-size: 36px;
      color: ${colors.grey400};
    }
  `

  const application = localStorage.getItem('application')

  if (application && application !== null) {
    localStorage.clear()
    navigate('https://caresactsmb.com')
  }

  const uploadFile = async (type, file) => {
    const data = new FormData()
    data.append('json', JSON.stringify({ bank: bank.id, token, type }))
    data.append('file', file)

    try {
      const response = await axios.post(
        `${config.API_URL}/api/application/file`,
        data,
        {
          onUploadProgress: progress => {
            setUploadProgress(
              Math.round((progress.loaded * 100) / progress.total)
            )
          },
        }
      )
      return response
    } catch (error) {
      return error.response
    }
  }

  const getFilesToUpload = (values, owners) => {
    const files = []
    FILE_FIELDS.forEach(field => {
      const fieldValue = values[field.key]
      if (field.multiple && fieldValue.length > 0) {
        fieldValue.forEach((file, i) => {
          let docType = 'default'
          if (field.key === 'entityDocs') {
            docType = bank.docs[values.entityType][i].slug
          } else if (field.key === 'primaryIds') {
            docType = `primaryIds-${slugify(
              `${owners[i].firstName} ${owners[i].lastName}`
            )}`
          } else {
            docType = DOC_MAP[values.dataSource][i].key
          }
          files.push({
            file,
            type: docType,
          })
        })
      } else if (
        !isNull(fieldValue) &&
        !isUndefined(fieldValue) &&
        !field.multiple &&
        fieldValue !== ''
      ) {
        files.push({ file: fieldValue, type: field.key })
      }
    })
    return files
  }

  const handleLoginSubmit = async (values, actions) => {
    const { setSubmitting } = actions
    setIsUploading(true)
    const customerInfo = JSON.parse(localStorage.getItem('customerInfo'))
    const businessInfo = JSON.parse(localStorage.getItem('businessInfo'))
    const disclosures = JSON.parse(localStorage.getItem('disclosures'))
    setAppError(false)
    actions.setSubmitting(true)
    const uploadedFiles = []

    const filesToUpload = getFilesToUpload(
      values,
      businessInfo.values.business.owners
    )

    for (let i = 0; i < filesToUpload.length; i++) {
      const upload = filesToUpload[i]
      setFileUploadStats({ total: filesToUpload.length, current: i + 1 })
      const response = await uploadFile(upload.type, upload.file)
      if (!isUndefined(response) && response.status !== 200) {
        const errorText = get(
          response,
          'data.errors.file',
          'File upload failed. Please choose a smaller file.'
        )

        actions.setErrors({
          non_field_errors: errorText,
        })
        setIsUploading(false)
        setSubmitting(false)
        break
      }
      uploadedFiles.push(i)
    }

    if (uploadedFiles.length === filesToUpload.length) {
      const finalCustomer = {
        ...customerInfo.values.customer,
        passcode: isUndefined(customerInfo.values.customer.passcode)
          ? 'n/a'
          : customerInfo.values.customer.passcode,
        isBankCustomer: customerInfo.values.customer.isBankCustomer === 'yes',
      }

      const finalBusinessInfo = {
        ...businessInfo.values,
        business: {
          ...businessInfo.values.business,
          monthlyPayroll: (
            (values.healthCoverageCost +
              values.dynamicPayroll +
              values.retirementBenefitsCost +
              values.statePayrollTaxCost) /
            12
          ).toFixed(2),
        },
      }

      const finalDisclosures = {
        ...disclosures.values.disclosures,
        affiliates:
          disclosures.values.disclosures.hasCommonManagement === 'yes'
            ? disclosures.values.disclosures.affiliates
            : [],
        excludedFromParticipating:
          disclosures.values.disclosures.excludedFromParticipating === 'yes',
        hasObtainedDirectLoan:
          disclosures.values.disclosures.hasObtainedDirectLoan === 'yes',
        hasCommonManagement:
          disclosures.values.disclosures.hasCommonManagement === 'yes',
        hasObtainedSbaLoan:
          disclosures.values.disclosures.hasObtainedSbaLoan === 'yes',
        hasCurrentCriminal:
          disclosures.values.disclosures.hasCurrentCriminal === 'yes',
        hasPastCriminal:
          disclosures.values.disclosures.hasPastCriminal === 'yes',
        citizenship: disclosures.values.disclosures.citizenship === 'yes',
        isSbaFranchise: disclosures.values.disclosures.isSbaFranchise === 'yes',
      }
      const finalRisk = {
        providesCheckCashing:
          disclosures.values.risk.providesCheckCashing === 'yes',
        sellsMoneyOrders: disclosures.values.risk.sellsMoneyOrders === 'yes',
        sellsPrepaidCards: disclosures.values.risk.sellsPrepaidCards === 'yes',
        providesMoneyTransfers:
          disclosures.values.risk.providesMoneyTransfers === 'yes',
        sellsTravelersChecks:
          disclosures.values.risk.sellsTravelersChecks === 'yes',
        operatesOnPremiseAtm:
          disclosures.values.risk.operatesOnPremiseAtm === 'yes',
        offersGambling: disclosures.values.risk.offersGambling === 'yes',
      }

      const data = new FormData()

      data.append(
        'json',
        JSON.stringify({
          bank: bank.id,
          token,
          customer: finalCustomer,
          ...finalBusinessInfo,
          disclosures: finalDisclosures,
          risk: finalRisk,
          certifications: disclosures.values.certifications,
          ...values,
        })
      )

      try {
        const response = await axios.post(
          `${config.API_URL}/api/application`,
          data
        )
        if (response.status === 200) {
          if (bank.id === 'seattle') {
            window.gtag('event', 'conversion', {
              send_to: 'AW-671371242/XZUNCLSg0s4BEOqfkcAC',
            })
          }
          setSubmitting(false)
          setIsUploading(false)
          localStorage.setItem('application', JSON.stringify(response.data))
          navigate('success')
        } else {
          setIsUploading(false)
          setAppError(true)
        }
      } catch (error) {
        setSubmitting(false)
        setIsUploading(false)
        setAppError(true)
      }
    }
  }

  const shouldShowModal = formValues => {
    const FIELDS_TO_VALIDATE = [
      'dynamicPayroll',
      'healthCoverageCost',
      'retirementBenefitsCost',
      'statePayrollTaxCost',
      'wagesOverLimit',
      'nonResidentPayroll',
      'sickLeaveWages',
      'eidlLoanAmount',
    ]

    let isValid = true
    if (isUndefined(formValues)) {
      return false
    }
    FIELDS_TO_VALIDATE.forEach(field => {
      if (!isNumber(formValues[field])) {
        isValid = false
      }
    })

    if (
      isValid &&
      calculatedLoanAmt < bank.minimumLoanAmount &&
      calculatedLoanAmt > 0
    ) {
      setShowModal(true)
    }
  }

  const calculateLoanAmount = formValues => {
    const {
      dynamicPayroll,
      healthCoverageCost,
      retirementBenefitsCost,
      statePayrollTaxCost,
      wagesOverLimit,
      nonResidentPayroll,
      sickLeaveWages,
      eidlLoanAmount,
    } = formValues || {}

    const dynamicPayrollFinal =
      isNumber(dynamicPayroll) && !isNaN(dynamicPayroll) ? dynamicPayroll : 0
    const healthCoverageCostFinal =
      isNumber(healthCoverageCost) && !isNaN(healthCoverageCost)
        ? healthCoverageCost
        : 0
    const retirementBenefitsCostFinal =
      isNumber(retirementBenefitsCost) && !isNaN(retirementBenefitsCost)
        ? retirementBenefitsCost
        : 0
    const statePayrollTaxCostFinal =
      isNumber(statePayrollTaxCost) && !isNaN(statePayrollTaxCost)
        ? statePayrollTaxCost
        : 0
    const wagesOverLimitFinal =
      isNumber(wagesOverLimit) && !isNaN(wagesOverLimit) ? wagesOverLimit : 0
    const nonResidentPayrollFinal =
      isNumber(nonResidentPayroll) && !isNaN(nonResidentPayroll)
        ? nonResidentPayroll
        : 0
    const sickLeaveWagesFinal =
      isNumber(sickLeaveWages) && !isNaN(sickLeaveWages) ? sickLeaveWages : 0
    const eidlLoanAmountFinal =
      isNumber(eidlLoanAmount) && !isNaN(eidlLoanAmount) ? eidlLoanAmount : 0
    const additions =
      dynamicPayrollFinal +
      healthCoverageCostFinal +
      retirementBenefitsCostFinal +
      statePayrollTaxCostFinal
    const subtractions =
      wagesOverLimitFinal + nonResidentPayrollFinal + sickLeaveWagesFinal
    const annualValue = additions - subtractions
    const calculatedValue = (annualValue / 12) * 2.5
    const finalValue = calculatedValue + eidlLoanAmountFinal
    setCalculatedLoanAmt(finalValue)
  }

  const currentValues = localStorage.getItem('certifications') || '{}'
  const parsedCurrentValues = JSON.parse(currentValues)

  useEffect(() => calculateLoanAmount(parsedCurrentValues.values), [])

  const storedCustomerInfo = JSON.parse(localStorage.getItem('customerInfo'))
  const customerEmail = get(storedCustomerInfo, 'values.customer.email')

  return (
    <Layout>
      <div css={formStyle}>
        <StatusBar steps={[1, 2, 3, 4, 5]} currentStep={4} />
        <Heading size="1" align="center">
          Documents
        </Heading>
        <span css={subheading}>
          *Costs should only be included for employees based primarily in the
          US.
        </span>
        <div css={formWrap}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleLoginSubmit(values, actions)}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              setFieldTouched,
              setFieldValue,
              values,
            }) => (
              <form onSubmit={handleSubmit}>
                <HelperText>
                  Last step - we’re going to need some documents from you. These
                  documents range from your W-2 or W-3 filings from last year to
                  your 2019 financials statements.
                </HelperText>
                <HelperText>
                  If you need help locating these forms in your payroll
                  software,{' '}
                  <a
                    css={textLink}
                    href="https://www.caresactsmb.com/payroll-data"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    check out our guide here
                  </a>
                  .
                </HelperText>
                <hr css={ruler} />
                <div css={row}>
                  <Heading
                    size="2"
                    css={css`
                      width: initial;
                      margin-right: 24px;
                    `}
                  >
                    Calculate Loan
                  </Heading>
                  <SelectInput
                    css={css`
                      flex: 1;
                    `}
                    setFieldTouched={setFieldTouched}
                    setFieldValue={setFieldValue}
                    defaultValue={0}
                    options={DATA_SOURCE_OPTIONS}
                    name="dataSource"
                    runOnChange={fieldName => {
                      const docsArray = []
                      if (fieldName && fieldName.length > 0) {
                        DOC_MAP[fieldName].forEach(() => docsArray.push(''))
                      }
                      setFieldValue('calculateLoanDocs', docsArray)
                    }}
                  />
                </div>
                <div css={row}>
                  <Checkbox
                    name="payrollDoesNotInclude1099"
                    label="I will not include payments to 1099 workers in payroll figures below."
                  />
                </div>

                {values.dataSource &&
                  values.dataSource.length > 0 &&
                  values.payrollDoesNotInclude1099 && (
                    <React.Fragment>
                      <HelperText css={boldText}>
                        Payroll expenses -{' '}
                        <span css={lightText}>
                          Please share your payroll expenses below.
                        </span>
                      </HelperText>
                      <div css={row}>
                        <div css={columnWrap}>
                          {values.dataSource &&
                            values.dataSource.length > 0 &&
                            DYNAMIC_LABELS[values.dataSource]}
                          <Input
                            type="number"
                            name="dynamicPayroll"
                            label="1,000"
                            onChange={e => {
                              handleChange(e)
                              calculateLoanAmount({
                                ...values,
                                [e.target.name]: parseInt(e.target.value, 10),
                              })
                            }}
                            onBlur={e => {
                              handleBlur(e)
                              calculateLoanAmount({
                                ...values,
                                [e.target.name]: parseInt(e.target.value, 10),
                              })
                            }}
                            money
                          />
                        </div>
                        <div css={columnWrap}>
                          Health care coverage
                          <Input
                            type="number"
                            name="healthCoverageCost"
                            label="1,000"
                            onChange={e => {
                              handleChange(e)
                              calculateLoanAmount({
                                ...values,
                                [e.target.name]: parseInt(e.target.value, 10),
                              })
                            }}
                            onBlur={e => {
                              handleBlur(e)
                              calculateLoanAmount({
                                ...values,
                                [e.target.name]: parseInt(e.target.value, 10),
                              })
                            }}
                            money
                          />
                        </div>
                        <div css={columnWrap}>
                          Retirement benefits
                          <Input
                            type="number"
                            name="retirementBenefitsCost"
                            label="1,000"
                            onChange={e => {
                              handleChange(e)
                              calculateLoanAmount({
                                ...values,
                                [e.target.name]: parseInt(e.target.value, 10),
                              })
                            }}
                            onBlur={e => {
                              handleBlur(e)
                              calculateLoanAmount({
                                ...values,
                                [e.target.name]: parseInt(e.target.value, 10),
                              })
                            }}
                            money
                          />
                        </div>
                        <div css={columnWrap}>
                          State unemployment or local taxes
                          <Input
                            type="number"
                            name="statePayrollTaxCost"
                            label="1,000"
                            onChange={e => {
                              handleChange(e)
                              calculateLoanAmount({
                                ...values,
                                [e.target.name]: parseInt(e.target.value, 10),
                              })
                            }}
                            onBlur={e => {
                              handleBlur(e)
                              calculateLoanAmount({
                                ...values,
                                [e.target.name]: parseInt(e.target.value, 10),
                              })
                            }}
                            money
                          />
                        </div>
                      </div>
                      <HelperText css={boldText}>
                        Exclusions{' '}
                        <span css={lightText}>
                          - some payroll expenses cannot be included in your
                          payroll expense calculation.
                        </span>{' '}
                        The amount you claim will be excluded if supporting
                        documentation is not sufficient.
                      </HelperText>
                      <div css={flexRow}>
                        <span css={simpleLabel}>
                          Wages, salaries and bonus in excess of $100,000 to any
                          employee.
                        </span>
                        <div css={fileInput}>
                          <Input
                            type="number"
                            name="wagesOverLimit"
                            label="1,000"
                            onChange={e => {
                              handleChange(e)
                              calculateLoanAmount({
                                ...values,
                                [e.target.name]: parseInt(e.target.value, 10),
                              })
                            }}
                            onBlur={e => {
                              handleBlur(e)
                              calculateLoanAmount({
                                ...values,
                                [e.target.name]: parseInt(e.target.value, 10),
                              })
                            }}
                            money
                          />
                        </div>
                      </div>
                      <div css={flexRow}>
                        <span css={simpleLabel}>
                          Payroll expense to employee(s) with a principal place
                          of residence outside the US for the period covered.
                        </span>
                        <div css={fileInput}>
                          <Input
                            type="number"
                            name="nonResidentPayroll"
                            label="1,000"
                            onChange={e => {
                              handleChange(e)
                              calculateLoanAmount({
                                ...values,
                                [e.target.name]: parseInt(e.target.value, 10),
                              })
                            }}
                            onBlur={e => {
                              handleBlur(e)
                              calculateLoanAmount({
                                ...values,
                                [e.target.name]: parseInt(e.target.value, 10),
                              })
                            }}
                            money
                          />
                        </div>
                      </div>
                      <div css={flexRow}>
                        <span css={simpleLabel}>
                          Any payroll expense above that includes qualified sick
                          and/or family leave wages allowed under section 7001
                          of the Families First Coronavirus Response Act.
                        </span>
                        <div css={fileInput}>
                          <Input
                            type="number"
                            name="sickLeaveWages"
                            label="1,000"
                            onChange={e => {
                              handleChange(e)
                              calculateLoanAmount({
                                ...values,
                                [e.target.name]: parseInt(e.target.value, 10),
                              })
                            }}
                            onBlur={e => {
                              handleBlur(e)
                              calculateLoanAmount({
                                ...values,
                                [e.target.name]: parseInt(e.target.value, 10),
                              })
                            }}
                            money
                          />
                        </div>
                      </div>
                      <HelperText css={boldText}>
                        <span css={lightText}>
                          EIDL - If you applied for the Economic Injury Disaster
                          Loan Program, please enter the outstanding balance of
                          any loan received between 1/31/2020 and 4/3/2020.
                        </span>
                      </HelperText>
                      <div css={flexRow}>
                        <span css={simpleLabel}>
                          EIDL loan amount <br />
                          (if applicable, otherwise put $0)
                        </span>
                        <div css={fileInput}>
                          <Input
                            type="number"
                            name="eidlLoanAmount"
                            label="1,000"
                            onChange={e => {
                              handleChange(e)
                              calculateLoanAmount({
                                ...values,
                                [e.target.name]: parseInt(e.target.value, 10),
                              })
                            }}
                            onBlur={e => {
                              handleBlur(e)
                              if (
                                values.loanAmount < 1 ||
                                values.loanAmount === ''
                              ) {
                                setFieldValue(
                                  'loanAmount',
                                  calculatedLoanAmt.toFixed(2)
                                )
                              }
                              calculateLoanAmount({
                                ...values,
                                [e.target.name]: parseInt(e.target.value, 10),
                              })
                            }}
                            money
                          />
                        </div>
                      </div>
                      <div css={box}>
                        <span>Maximum Elligible Loan Amount</span>
                        <p
                          css={css`
                            color: ${calculatedLoanAmt > 0
                              ? colors.greenDark
                              : 'auto'} !important;
                          `}
                        >
                          {formatCurrency(calculatedLoanAmt)}
                        </p>
                      </div>
                      <div css={flexRow}>
                        <span css={label}>
                          Requested Loan Amount
                          <span css={subtext}>
                            You can request up to your maximum eligible loan
                            amount.
                          </span>
                        </span>
                        <div css={fileInput}>
                          <Input
                            type="number"
                            name="loanAmount"
                            label="1,000"
                            onChange={e => {
                              handleChange(e)
                              calculateLoanAmount({
                                ...values,
                                [e.target.name]: parseInt(e.target.value, 10),
                              })
                            }}
                            onBlur={e => {
                              handleBlur(e)
                              if (bank.hasMinimumLoanAmount) {
                                shouldShowModal(values)
                              }
                              calculateLoanAmount({
                                ...values,
                                [e.target.name]: parseInt(e.target.value, 10),
                              })
                            }}
                            money
                          />
                        </div>
                      </div>
                      <Heading size="2" css={sectionHeading}>
                        Documents
                      </Heading>
                      <hr css={[ruler, sectionHeading]} />
                      <CalculatedDocsArrayErrors errors={errors} />
                      <FieldArray
                        name="calculateLoanDocs"
                        render={arrayHelpers => (
                          <div>
                            {values.calculateLoanDocs &&
                              values.calculateLoanDocs.length > 0 &&
                              values.calculateLoanDocs.map((doc, index) => (
                                <div
                                  key={`${slugify(
                                    DOC_MAP[values.dataSource][index].label
                                  )}`}
                                >
                                  <div css={flexRow}>
                                    <span css={label}>
                                      {DOC_MAP[values.dataSource][index].label}
                                      <span css={subtext}>
                                        {
                                          DOC_MAP[values.dataSource][index]
                                            .subtext
                                        }
                                      </span>
                                    </span>
                                    <div css={fileInput}>
                                      <FileInput
                                        setFieldValue={setFieldValue}
                                        type="file"
                                        name={`calculateLoanDocs.${index}`}
                                      />
                                    </div>
                                  </div>
                                  <hr css={ruler} />
                                </div>
                              ))}
                          </div>
                        )}
                      />
                      {FINANCIALS_REQUIRED.includes(values.dataSource) && (
                        <React.Fragment>
                          <div css={flexRow}>
                            <span css={label}>2019 Financial Statements</span>
                            <div css={fileInput}>
                              <FileInput
                                setFieldValue={setFieldValue}
                                type="file"
                                name="yearEndFinancialStatements2019"
                              />
                            </div>
                          </div>
                          <hr css={ruler} />
                        </React.Fragment>
                      )}
                      {FINANCIALS_REQUIRED.includes(values.dataSource) && (
                        <React.Fragment>
                          <div css={flexRow}>
                            <span css={label}>
                              W-2's or Payroll Register
                              <span css={subtext}>
                                Payroll register/detail broken down by employee
                                or W-2's for all employees.
                              </span>
                            </span>
                            <div css={fileInput}>
                              <FileInput
                                setFieldValue={setFieldValue}
                                type="file"
                                name="payrollRegister"
                              />
                            </div>
                          </div>
                          <hr css={ruler} />
                        </React.Fragment>
                      )}
                      {FINANCIALS_REQUIRED.includes(values.dataSource) && (
                        <React.Fragment>
                          <div css={flexRow}>
                            <span css={label}>
                              February 2020 Payroll
                              <span css={subtext}>
                                Payroll closest to February 15.
                              </span>
                            </span>
                            <div css={fileInput}>
                              <FileInput
                                setFieldValue={setFieldValue}
                                type="file"
                                name="february2020Payroll"
                              />
                            </div>
                          </div>
                          <hr css={ruler} />
                        </React.Fragment>
                      )}
                      {values.healthCoverageCost > 0 && (
                        <React.Fragment>
                          <div css={flexRow}>
                            <span css={label}>
                              Health Insurance Premiums
                              <span css={subtext}>
                                Documentation showing the total of health
                                insurance premiumns paid by the owner(s) of the
                                business.
                              </span>
                            </span>
                            <div css={fileInput}>
                              <FileInput
                                setFieldValue={setFieldValue}
                                type="file"
                                name="healthInsuranceDoc"
                              />
                            </div>
                          </div>
                          <hr css={ruler} />
                        </React.Fragment>
                      )}
                      {values.retirementBenefitsCost > 0 && (
                        <React.Fragment>
                          <div css={flexRow}>
                            <span css={label}>
                              Retirement Plan Funding
                              <span css={subtext}>
                                Please provide documentation of all retirement
                                plan funding that was paid by business owners:
                              </span>
                              <ul css={listStyle}>
                                <li>
                                  - Do not include funding that came from
                                  employees out of their paycheck deferrals
                                </li>
                                <li>
                                  - Include all employees and the borrower’s
                                  owners
                                </li>
                                <li>
                                  - Include 401k plans, Simple IRA and SEP IRA’s{' '}
                                </li>
                              </ul>
                            </span>
                            <div css={fileInput}>
                              <FileInput
                                setFieldValue={setFieldValue}
                                type="file"
                                name="retirementPlanDoc"
                              />
                            </div>
                          </div>
                          <hr css={ruler} />
                        </React.Fragment>
                      )}
                      {values.statePayrollTaxCost > 0 && (
                        <React.Fragment>
                          <div css={flexRow}>
                            <span css={label}>
                              State or Local Payroll Tax Supporting Documents
                            </span>
                            <div css={fileInput}>
                              <FileInput
                                setFieldValue={setFieldValue}
                                type="file"
                                name="payrollTaxPlanDoc"
                              />
                            </div>
                          </div>
                          <hr css={ruler} />
                        </React.Fragment>
                      )}
                      <div css={flexRow}>
                        <span css={label}>
                          Additional Docs
                          <span css={subtext}>
                            May include files like 941 or 940.
                          </span>
                        </span>
                        <div css={fileInput}>
                          <FileInput
                            setFieldValue={setFieldValue}
                            type="file"
                            name="additionalSupportingDocs"
                          />
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                <hr css={ruler} />
                {individualBusinessOwners.length > 0 && (
                  <React.Fragment>
                    <Heading size="2" css={sectionHeading}>
                      Identification
                    </Heading>
                    {bank.id === 'seattle' ? (
                      <HelperText css={subheading}>
                        Please upload a copy of the state-issued or government
                        issued ID such as a drivers license, passport, military
                        ID card, etc. for each owner listed below:
                      </HelperText>
                    ) : (
                      <HelperText css={subheading}>
                        Please upload a copy of a valid drivers license. Make
                        sure that the image is clear and that all the
                        information is legible.
                      </HelperText>
                    )}
                  </React.Fragment>
                )}
                <PrimaryIdArrayErrors errors={errors} />
                <FieldArray
                  name="primaryIds"
                  render={arrayHelpers => (
                    <React.Fragment>
                      {values.primaryIds &&
                        values.primaryIds.length > 0 &&
                        values.primaryIds.map((primaryId, index) => (
                          <div
                            css={flexRow}
                            key={`${slugify(
                              individualBusinessOwners[index].firstName
                            )}`}
                          >
                            <span css={label}>
                              {`${individualBusinessOwners[index].firstName} ${individualBusinessOwners[index].lastName}`}
                              {bank.id === 'solera' && (
                                <span css={subtext}>
                                  You must upload a valid state drivers license
                                  in order for your application to be approved.
                                </span>
                              )}
                            </span>
                            <div css={fileInput}>
                              <FileInput
                                setFieldValue={setFieldValue}
                                type="file"
                                name={`primaryIds.${index}`}
                              />
                            </div>
                          </div>
                        ))}
                    </React.Fragment>
                  )}
                />
                {bank.docsOptions.length > 0 && isBankCustomer === 'no' && (
                  <div>
                    <div css={row}>
                      <Heading
                        size="2"
                        css={css`
                          width: initial;
                          margin-right: 24px;
                        `}
                      >
                        Entity-specific docs
                      </Heading>
                      <SelectInput
                        css={css`
                          flex: 1;
                        `}
                        setFieldTouched={setFieldTouched}
                        setFieldValue={setFieldValue}
                        options={bank.docsOptions}
                        name="entityType"
                        runOnChange={fieldName => {
                          const entityDocsArray2 = []
                          if (fieldName && fieldName.length > 0) {
                            bank.docs[fieldName].forEach(() =>
                              entityDocsArray2.push('')
                            )
                          }
                          setFieldValue('entityDocs', entityDocsArray2)
                        }}
                      />
                    </div>
                    <EntityDocsArrayErrors errors={errors} />
                    <div>
                      {values.entityType &&
                        values.entityType !== 'independent' && (
                          <FieldArray
                            name="entityDocs"
                            render={arrayHelpers => (
                              <div>
                                {values.entityDocs.map((item, index) => {
                                  const document =
                                    bank.docs[values.entityType][index]
                                  return (
                                    <div css={flexRow} key={document.slug}>
                                      <span css={label}>
                                        <span
                                          css={label}
                                          dangerouslySetInnerHTML={{
                                            __html: document.name,
                                          }}
                                        />
                                        <div
                                          css={subtext}
                                          dangerouslySetInnerHTML={{
                                            __html: document.description,
                                          }}
                                        />
                                      </span>

                                      <div css={fileInput}>
                                        <FileInput
                                          setFieldValue={setFieldValue}
                                          type="file"
                                          name={`entityDocs.${index}`}
                                        />
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          />
                        )}
                    </div>
                  </div>
                )}
                <hr css={ruler} />
                <div css={row}>
                  <Heading size="2">Signature</Heading>
                </div>
                <div css={row}>
                  <Input type="text" name="signature" label="Full Name" />
                  <Input type="text" name="signeeTitle" label="Title" />
                  <Input
                    type="date"
                    name="signatureDate"
                    label="Date"
                    value={format(new Date(), 'yyyy-MM-dd')}
                    disabled
                  />
                </div>
                <hr css={ruler} />
                <div css={row}>
                  <Heading size="2">eSign Consent</Heading>
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
                <div css={row}>
                  <Heading size="2">Bank Account</Heading>
                </div>
                <HelperText>
                  Please enter the bank account information for the account you
                  would like the funds deposited into.{' '}
                  <i>
                    Be sure to verify your account number, we don't want to send
                    funds to the wrong place.
                  </i>
                </HelperText>
                <div css={rowSimple}>
                  <Input type="text" name="bankName" label="Bank Name" />
                  <Input
                    type="text"
                    name="bankCustomerName"
                    label="Name as it appears on account"
                  />
                </div>
                <div css={rowSimple}>
                  <Input
                    type="text"
                    name="accountNumber"
                    label="Bank Account Number"
                  />
                  <Input
                    type="text"
                    name="routingNumber"
                    label="Bank Routing Number"
                  />
                </div>
                {appError && (
                  <div css={errorBox}>
                    Error: Your application did not submit. This typically means
                    that you forgot a field, or you are seeing an old version of
                    the application. If you can't find any missing fields please
                    open this page in a new browser or incognito window and try
                    again.
                  </div>
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
                    Submit
                  </Button>
                </FooterNav>
                <Modal
                  isOpen={isUploading}
                  onCloseClicked={() => setIsUploading(false)}
                >
                  <div>
                    <HelperText align="center">
                      Your application is currently being submitted.
                      <br />
                      Please do not press the back button!
                    </HelperText>
                    <Heading size="3" align="center" css={progress}>
                      Upload Progress (File {fileUploadStats.current} /{' '}
                      {fileUploadStats.total}): {uploadProgress}%
                    </Heading>
                  </div>
                </Modal>
                <NonFieldErrors errors={errors} />
                <Persist
                  name="certifications"
                  ignoreFields={[
                    'calculateLoanDocs',
                    'yearEndFinancialStatements2019',
                    'payrollRegister',
                    'february2020Payroll',
                    'healthInsuranceDoc',
                    'retirementPlanDoc',
                    'additionalSupportingDocs',
                    'primaryIds',
                    'entityDocs',
                  ]}
                />
                {bank.hasMinimumLoanAmount && (
                  <Modal
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

export default Certifications
