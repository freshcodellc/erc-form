/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import React from 'react'
import { FieldArray, Formik } from 'formik'
import * as Yup from 'yup'
import { navigate } from '@reach/router'
import Button from '../components/ui/button'
import Collapse from '../components/ui/collapse'
import Input from '../components/ui/forms/input'
import Heading from '../components/ui/heading'
import Layout from '../components/layout'
import FooterNav from '../components/ui/footerNav'
import Persist from '../components/persist'
import Radio from '../components/ui/forms/radio'
import HelperText from '../components/ui/helperText'
import StatusBar from '../components/ui/statusBar'
import Checkbox from '../components/ui/forms/checkbox'
import CERTIFICATIONS from '../constants/certificationQuestions'
import useAnalytics from '../components/analytics'
import getBankConfig from '../bankConfig'

const bank = getBankConfig()

const getRiskValidation = () => {
  if (bank.showRiskQuestions) {
    return Yup.object().shape({
      providesCheckCashing: Yup.string()
        .oneOf(['yes', 'no'])
        .required('Required'),
      sellsMoneyOrders: Yup.string()
        .oneOf(['yes', 'no'])
        .required('Required'),
      sellsPrepaidCards: Yup.string()
        .oneOf(['yes', 'no'])
        .required('Required'),
      providesMoneyTransfers: Yup.string()
        .oneOf(['yes', 'no'])
        .required('Required'),
      sellsTravelersChecks: Yup.string()
        .oneOf(['yes', 'no'])
        .required('Required'),
      operatesOnPremiseAtm: Yup.string()
        .oneOf(['yes', 'no'])
        .required('Required'),
      offersGambling: Yup.string()
        .oneOf(['yes', 'no'])
        .required('Required'),
    })
  }
  return Yup.object().shape({
    providesCheckCashing: Yup.string().oneOf(['yes', 'no']),
    sellsMoneyOrders: Yup.string().oneOf(['yes', 'no']),
    sellsPrepaidCards: Yup.string().oneOf(['yes', 'no']),
    providesMoneyTransfers: Yup.string().oneOf(['yes', 'no']),
    sellsTravelersChecks: Yup.string().oneOf(['yes', 'no']),
    operatesOnPremiseAtm: Yup.string().oneOf(['yes', 'no']),
    offersGambling: Yup.string().oneOf(['yes', 'no']),
  })
}

const validationSchema = Yup.object().shape({
  certifications: Yup.object().shape({
    wasBusinessOperating: Yup.bool()
      .oneOf([true], 'Required')
      .required('Required'),
    isLoanNecessary: Yup.bool()
      .oneOf([true], 'Required')
      .required('Required'),
    willRetainWorkers: Yup.bool()
      .oneOf([true], 'Required')
      .required('Required'),
    willProvideDocumentation: Yup.bool()
      .oneOf([true], 'Required')
      .required('Required'),
    approveForgivenessTerms: Yup.bool()
      .oneOf([true], 'Required')
      .required('Required'),
    noAdditionalLoans: Yup.bool()
      .oneOf([true], 'Required')
      .required('Required'),
    isLoanInfoAccurate: Yup.bool()
      .oneOf([true], 'Required')
      .required('Required'),
    willLenderCalculateAmount: Yup.bool()
      .oneOf([true], 'Required')
      .required('Required'),
  }),
  risk: getRiskValidation(),
  disclosures: Yup.object().shape({
    excludedFromParticipating: Yup.string()
      .oneOf(['yes', 'no'])
      .required('Required'),
    hasObtainedDirectLoan: Yup.string()
      .oneOf(['yes', 'no'])
      .required('Required'),
    hasCommonManagement: Yup.string()
      .oneOf(['yes', 'no'])
      .required('Required'),
    hasObtainedSbaLoan: Yup.string()
      .oneOf(['yes', 'no'])
      .required('Required'),
    hasCurrentCriminal: Yup.string()
      .oneOf(['yes', 'no'])
      .required('Required'),
    hasPastCriminal: Yup.string()
      .oneOf(['yes', 'no'])
      .required('Required'),
    citizenship: Yup.string()
      .oneOf(['yes', 'no'])
      .required('Required'),
    isSbaFranchise: Yup.string()
      .oneOf(['yes', 'no'])
      .required('Required'),
    affiliates: Yup.array().when('hasCommonManagement', {
      is: 'yes',
      then: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required('Required'),
          industry: Yup.string().required('Required'),
          relationship: Yup.string().required('Required'),
          tin: Yup.string()
            .matches(/^([0-9]+-)*[0-9]+$/, {
              message: 'Only numbers and hyphens',
            })
            .required('Required'),
        })
      ),
    }),
    sbaLoanBusinessName: Yup.string().when('hasObtainedSbaLoan', {
      is: 'yes',
      then: Yup.string().required('Required'),
    }),
    sbaLoanIndustry: Yup.string().when('hasObtainedSbaLoan', {
      is: 'yes',
      then: Yup.string().required('Required'),
    }),
    sbaLoanTin: Yup.string().when('hasObtainedSbaLoan', {
      is: 'yes',
      then: Yup.string().required('Required'),
    }),
    sbaLoanRelationship: Yup.string().when('hasObtainedSbaLoan', {
      is: 'yes',
      then: Yup.string().required('Required'),
    }),
    sbaLoanOwnership: Yup.number().when('hasObtainedSbaLoan', {
      is: 'yes',
      then: Yup.number()
        .typeError('Must be a number (no %)')
        .lessThan(101, 'Must be 100 or less')
        .required('Required'),
    }),
  }),
})

const initialValues = {
  certifications: {
    wasBusinessOperating: '',
    isLoanNecessary: '',
    willRetainWorkers: '',
    willProvideDocumentation: '',
    approveForgivenessTerms: '',
    noAdditionalLoans: '',
    isLoanInfoAccurate: '',
    willLenderCalculateAmount: '',
  },
  risk: {
    providesCheckCashing: '',
    sellsMoneyOrders: '',
    sellsPrepaidCards: '',
    providesMoneyTransfers: '',
    sellsTravelersChecks: '',
    operatesOnPremiseAtm: '',
    offersGambling: '',
  },
  disclosures: {
    excludedFromParticipating: '',
    hasObtainedDirectLoan: '',
    hasCommonManagement: '',
    hasObtainedSbaLoan: '',
    affiliates: [
      {
        name: '',
        industry: '',
        relationship: '',
        tin: '',
      },
    ],
    sbaLoanBusinessName: '',
    sbaLoanIndustry: '',
    sbaLoanTin: '',
    sbaLoanRelationship: '',
    sbaLoanOwnership: '',
    hasCurrentCriminal: '',
    hasPastCriminal: '',
    citizenship: '',
    isSbaFranchise: '',
  },
}

const listStyle = css`
  margin-left: 36px;
  margin-bottom: 24px;

  & > li {
    margin: 6px 0;
  }
`

const section = css`
  margin-top: 16px;
`

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
    flex: 1 1 0;
  }
`

const buttonStyles = {
  width: '170px',
}

const buttonRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
  width: 100%;
  max-width: 360px;
`

function Disclosures() {
  const { colors } = useTheme()
  useAnalytics()

  const flexRow = css`
    display: flex;
    align-items: center;
    margin-bottom: 16px;

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

  const fillChildren = css`
    & > div {
      flex: 1;
    }
  `

  const affiliateWrap = css`
    border: 1px solid ${colors.grey400};
    padding: 8px 8px 0 8px;
    margin-bottom: 16px;
  `

  const subformStyle = css`
    border: 1px solid ${colors.grey800};
    padding: 16px;
    margin: 16px 0 32px;
  `

  const handleLoginSubmit = async (values, actions) => {
    actions.setSubmitting(true)
    navigate('documents')
    actions.setSubmitting(false)
  }

  return (
    <Layout>
      <div css={formStyle}>
        <StatusBar steps={[1, 2, 3, 4, 5]} currentStep={3} />
        <Heading size="1" align="center">
          Disclosures
        </Heading>
        <HelperText>
          <i>
            If questions (1) or (2) below are answered “Yes,” the loan will not
            be approved.
          </i>
        </HelperText>
        <div css={formWrap}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleLoginSubmit(values, actions)}
          >
            {({ handleSubmit, isSubmitting, values }) => (
              <form onSubmit={handleSubmit}>
                <div css={flexRow}>
                  <Radio
                    id="excludedFromParticipating-yes"
                    name="disclosures.excludedFromParticipating"
                    label="Yes"
                    value="yes"
                    checked={
                      values.disclosures.excludedFromParticipating === 'yes'
                    }
                  />
                  <Radio
                    id="excludedFromParticipating-no"
                    name="disclosures.excludedFromParticipating"
                    label="No"
                    value="no"
                    checked={
                      values.disclosures.excludedFromParticipating === 'no'
                    }
                  />
                  <p>
                    1. Is the Applicant or any owner of the Applicant presently
                    suspended, debarred, proposed for debarment, declared
                    ineligible, voluntarily excluded from participation in this
                    transaction by any Federal department or agency, or
                    presently involved in any bankruptcy?
                  </p>
                </div>

                <div css={flexRow}>
                  <Radio
                    id="hasObtainedDirectLoan-yes"
                    name="disclosures.hasObtainedDirectLoan"
                    label="Yes"
                    value="yes"
                    checked={values.disclosures.hasObtainedDirectLoan === 'yes'}
                  />
                  <Radio
                    id="hasObtainedDirectLoan-no"
                    name="disclosures.hasObtainedDirectLoan"
                    label="No"
                    value="no"
                    checked={values.disclosures.hasObtainedDirectLoan === 'no'}
                  />
                  <p>
                    2. Has the Applicant, any owner of the Applicant, or any
                    business owned or controlled by any of them, ever obtained a
                    direct or guaranteed loan from SBA or any other Federal
                    agency that is currently delinquent or has defaulted in the
                    last 7 years and caused a loss to the government?
                  </p>
                </div>

                <div css={flexRow}>
                  <Radio
                    id="hasCommonManagement-yes"
                    name="disclosures.hasCommonManagement"
                    label="Yes"
                    value="yes"
                    checked={values.disclosures.hasCommonManagement === 'yes'}
                  />
                  <Radio
                    id="hasCommonManagement-no"
                    name="disclosures.hasCommonManagement"
                    label="No"
                    value="no"
                    checked={values.disclosures.hasCommonManagement === 'no'}
                  />
                  <p>
                    3. Is the Applicant or any owner of the Applicant an owner
                    of any other business, or have common management with, any
                    other business?
                  </p>
                </div>

                <Collapse
                  maxHeight={1000}
                  isOpen={values.disclosures.hasCommonManagement === 'yes'}
                >
                  <div css={subformStyle}>
                    <Heading size="3">Affiliates</Heading>

                    <HelperText>
                      Please list all business affiliates:
                    </HelperText>

                    <FieldArray
                      name="disclosures.affiliates"
                      render={(arrayHelpers, i) => (
                        <fieldset>
                          {values.disclosures.affiliates &&
                          values.disclosures.affiliates.length > 0 ? (
                            values.disclosures.affiliates.map(
                              (affiliate, index) => (
                                <div key={index} css={affiliateWrap}>
                                  <HelperText>Affiliate {index + 1}</HelperText>
                                  <div css={[flexRow, fillChildren]}>
                                    <Input
                                      type="text"
                                      name={`disclosures.affiliates.${index}.name`}
                                      label="Name"
                                      size={35}
                                    />
                                    <Input
                                      type="text"
                                      name={`disclosures.affiliates.${index}.industry`}
                                      label="Industry"
                                      size={35}
                                    />
                                  </div>
                                  <div css={[flexRow, fillChildren]}>
                                    <Input
                                      type="text"
                                      name={`disclosures.affiliates.${index}.relationship`}
                                      label="Relationship"
                                      size={70}
                                    />
                                    <Input
                                      type="text"
                                      autoComplete="off"
                                      name={`disclosures.affiliates.${index}.tin`}
                                      label="TIN (EIN/SSN)"
                                      size={70}
                                    />
                                  </div>
                                </div>
                              )
                            )
                          ) : (
                            <span>Must have at least one affiliate</span>
                          )}
                          <div css={buttonRow}>
                            {values.disclosures.affiliates.length > 1 && (
                              <Button
                                css={buttonStyles}
                                hollow
                                loading={isSubmitting}
                                disabled={isSubmitting}
                                onClick={() => arrayHelpers.pop()}
                              >
                                Remove Affiliate
                              </Button>
                            )}
                            <Button
                              css={buttonStyles}
                              loading={isSubmitting}
                              disabled={isSubmitting}
                              onClick={() =>
                                arrayHelpers.push(
                                  initialValues.disclosures.affiliates[0]
                                )
                              }
                            >
                              Add Affiliate
                            </Button>
                          </div>
                        </fieldset>
                      )}
                    />
                  </div>
                </Collapse>

                <div css={flexRow}>
                  <Radio
                    id="hasObtainedSbaLoan-yes"
                    name="disclosures.hasObtainedSbaLoan"
                    label="Yes"
                    value="yes"
                    checked={values.disclosures.hasObtainedSbaLoan === 'yes'}
                  />
                  <Radio
                    id="hasObtainedSbaLoan-no"
                    name="disclosures.hasObtainedSbaLoan"
                    label="No"
                    value="no"
                    checked={values.disclosures.hasObtainedSbaLoan === 'no'}
                  />
                  <p>
                    4. Has the Applicant received an SBA Economic Injury
                    Disaster Loan between January 31, 2020 and April 3, 2020?
                  </p>
                </div>

                <Collapse
                  maxHeight={1000}
                  isOpen={values.disclosures.hasObtainedSbaLoan === 'yes'}
                >
                  <div css={subformStyle}>
                    <Heading size="3">
                      SBA Economic Injury Disaster Loan Details
                    </Heading>

                    <HelperText>
                      Please enter the details of any SBA Economic Injury
                      Disaster Loans that your business has received:
                    </HelperText>

                    <div css={row}>
                      <Input
                        type="text"
                        name="disclosures.sbaLoanBusinessName"
                        label="Business Name"
                        size={100}
                      />
                    </div>
                    <div css={row}>
                      <Input
                        type="text"
                        name="disclosures.sbaLoanIndustry"
                        label="Industry"
                        size={100}
                      />
                      <Input
                        type="text"
                        name="disclosures.sbaLoanTin"
                        label="TIN (EIN/SSN)"
                        size={100}
                      />
                    </div>
                    <div css={row}>
                      <Input
                        type="text"
                        name="disclosures.sbaLoanRelationship"
                        label="Relationship"
                        size={100}
                      />
                      <Input
                        type="text"
                        name="disclosures.sbaLoanOwnership"
                        label="Ownership %"
                        size={100}
                      />
                    </div>
                  </div>
                </Collapse>

                <HelperText>
                  <i>
                    Applicants who are individuals and all 20% or greater owners
                    of the business must answer the following questions. If
                    questions (5) or (6) below are answered “Yes” the loan will
                    not be approved.
                  </i>
                </HelperText>

                <div css={flexRow}>
                  <Radio
                    id="hasCurrentCriminal-yes"
                    name="disclosures.hasCurrentCriminal"
                    label="Yes"
                    value="yes"
                    checked={values.disclosures.hasCurrentCriminal === 'yes'}
                  />
                  <Radio
                    id="hasCurrentCriminal-no"
                    name="disclosures.hasCurrentCriminal"
                    label="No"
                    value="no"
                    checked={values.disclosures.hasCurrentCriminal === 'no'}
                  />
                  <p>
                    5. Is the Applicant (if an individual) or any individual
                    owning 20% or more of the equity of the Applicant subject to
                    an indictment, criminal information, arraignment, or other
                    means by which formal criminal charges are brought in any
                    jurisdiction, or presently incarcerated, or on probation or
                    parole?
                  </p>
                </div>

                <div css={flexRow}>
                  <Radio
                    id="hasPastCriminal-yes"
                    name="disclosures.hasPastCriminal"
                    label="Yes"
                    value="yes"
                    checked={values.disclosures.hasPastCriminal === 'yes'}
                  />
                  <Radio
                    id="hasPastCriminal-no"
                    name="disclosures.hasPastCriminal"
                    label="No"
                    value="no"
                    checked={values.disclosures.hasPastCriminal === 'no'}
                  />
                  <p>
                    6. Within the last 5 years, for any felony, has the
                    Applicant (if an individual) or any owner of the Applicant
                    1) been convicted; 2) pleaded guilty; 3) pleaded nolo
                    contendere; 4) been placed on pretrial diversion; or 5) been
                    placed on any form of parole or probation (including
                    probation before judgment)?
                  </p>
                </div>

                <div css={flexRow}>
                  <Radio
                    id="isSbaFranchise-yes"
                    name="disclosures.isSbaFranchise"
                    label="Yes"
                    value="yes"
                    checked={values.disclosures.isSbaFranchise === 'yes'}
                  />
                  <Radio
                    id="isSbaFranchise-no"
                    name="disclosures.isSbaFranchise"
                    label="No"
                    value="no"
                    checked={values.disclosures.isSbaFranchise === 'no'}
                  />
                  <p>
                    7. Is the Applicant a franchise that is listed in the SBA’s
                    Franchise Directory?
                  </p>
                </div>
                <Heading size="3">Citizenship Disclosure</Heading>
                <HelperText>
                  <i>
                    Answering "no" to the following question will result in your
                    application being denied.
                  </i>
                </HelperText>
                <div css={flexRow}>
                  <Radio
                    id="citizenship-yes"
                    name="disclosures.citizenship"
                    label="Yes"
                    value="yes"
                    checked={values.disclosures.citizenship === 'yes'}
                  />
                  <Radio
                    id="citizenship-no"
                    name="disclosures.citizenship"
                    label="No"
                    value="no"
                    checked={values.disclosures.citizenship === 'no'}
                  />
                  <p>
                    8. Is the United States the principal place of residence for
                    all employees of the Applicant included in the Applicant’s
                    payroll calculation above?
                  </p>
                </div>
                {bank.showRiskQuestions && (
                  <React.Fragment>
                    <HelperText>
                      Does this business provide any of the following services
                      to its customers?
                    </HelperText>
                    <div css={flexRow}>
                      <Radio
                        id="providesCheckCashing-yes"
                        name="risk.providesCheckCashing"
                        label="Yes"
                        value="yes"
                        checked={values.risk.providesCheckCashing === 'yes'}
                      />
                      <Radio
                        id="providesCheckCashing-no"
                        name="risk.providesCheckCashing"
                        label="No"
                        value="no"
                        checked={values.risk.providesCheckCashing === 'no'}
                      />
                      <p>Check cashing</p>
                    </div>
                    <div css={flexRow}>
                      <Radio
                        id="sellsMoneyOrders-yes"
                        name="risk.sellsMoneyOrders"
                        label="Yes"
                        value="yes"
                        checked={values.risk.sellsMoneyOrders === 'yes'}
                      />
                      <Radio
                        id="sellsMoneyOrders-no"
                        name="risk.sellsMoneyOrders"
                        label="No"
                        value="no"
                        checked={values.risk.sellsMoneyOrders === 'no'}
                      />
                      <p>Sell money orders</p>
                    </div>
                    <div css={flexRow}>
                      <Radio
                        id="sellsPrepaidCards-yes"
                        name="risk.sellsPrepaidCards"
                        label="Yes"
                        value="yes"
                        checked={values.risk.sellsPrepaidCards === 'yes'}
                      />
                      <Radio
                        id="sellsPrepaidCards-no"
                        name="risk.sellsPrepaidCards"
                        label="No"
                        value="no"
                        checked={values.risk.sellsPrepaidCards === 'no'}
                      />
                      <p>Sell prepaid cards</p>
                    </div>
                    <div css={flexRow}>
                      <Radio
                        id="providesMoneyTransfers-yes"
                        name="risk.providesMoneyTransfers"
                        label="Yes"
                        value="yes"
                        checked={values.risk.providesMoneyTransfers === 'yes'}
                      />
                      <Radio
                        id="providesMoneyTransfers-no"
                        name="risk.providesMoneyTransfers"
                        label="No"
                        value="no"
                        checked={values.risk.providesMoneyTransfers === 'no'}
                      />
                      <p>Provide money transfer services</p>
                    </div>
                    <div css={flexRow}>
                      <Radio
                        id="sellsTravelersChecks-yes"
                        name="risk.sellsTravelersChecks"
                        label="Yes"
                        value="yes"
                        checked={values.risk.sellsTravelersChecks === 'yes'}
                      />
                      <Radio
                        id="sellsTravelersChecks-no"
                        name="risk.sellsTravelersChecks"
                        label="No"
                        value="no"
                        checked={values.risk.sellsTravelersChecks === 'no'}
                      />
                      <p>Sell traveler’s checks</p>
                    </div>
                    <div css={flexRow}>
                      <Radio
                        id="operatesOnPremiseAtm-yes"
                        name="risk.operatesOnPremiseAtm"
                        label="Yes"
                        value="yes"
                        checked={values.risk.operatesOnPremiseAtm === 'yes'}
                      />
                      <Radio
                        id="operatesOnPremiseAtm-no"
                        name="risk.operatesOnPremiseAtm"
                        label="No"
                        value="no"
                        checked={values.risk.operatesOnPremiseAtm === 'no'}
                      />
                      <p>Own or operate an ATM on premise(s)</p>
                    </div>
                    <div css={flexRow}>
                      <Radio
                        id="offersGambling-yes"
                        name="risk.offersGambling"
                        label="Yes"
                        value="yes"
                        checked={values.risk.offersGambling === 'yes'}
                      />
                      <Radio
                        id="offersGambling-no"
                        name="risk.offersGambling"
                        label="No"
                        value="no"
                        checked={values.risk.offersGambling === 'no'}
                      />
                      <p>
                        Offers gambling, bingo, or electronic gaming services
                      </p>
                    </div>
                  </React.Fragment>
                )}
                <div>
                  <Heading size="1" align="center">
                    Certifications and Authorizations
                  </Heading>
                  <div css={section}>
                    <HelperText>I certify that:</HelperText>
                    <ul css={listStyle}>
                      <li>
                        I have read the statements included in this form,
                        including the Statements Required by Law and Executive
                        Orders, and I understand them.
                      </li>
                      <li>
                        The Applicant is eligible to receive a loan under the
                        rules in effect at the time this application is
                        submitted that have been issued by the Small Business
                        Administration (SBA) implementing the Paycheck
                        Protection Program under Division A, Title I of the
                        Coronavirus Aid, Relief, and Economic Security Act
                        (CARES Act) (the Paycheck Protection Program Rule).
                      </li>
                      <li>
                        The Applicant (1) is an independent contractor, eligible
                        self-employed individual, or sole proprietor or (2)
                        employs no more than the greater of 500 or employees or,
                        if applicable, the size standard in number of employees
                        established by the SBA in 13 C.F.R. 121.201 for the
                        Applicant’s industry.
                      </li>
                      <li>
                        I will comply, whenever applicable, with the civil
                        rights and other limitations in this form.
                      </li>
                      <li>
                        All SBA loan proceeds will be used only for
                        business-related purposes as specified in the loan
                        application and consistent with the Paycheck Protection
                        Program Rule.
                      </li>
                      <li>
                        To the extent feasible, I will purchase only
                        American-made equipment and products.
                      </li>
                      <li>
                        To the extent feasible, I will purchase only
                        American-made equipment and products.
                      </li>
                      <li>
                        Any loan received by the Applicant under Section 7(b)(2)
                        of the Small Business Act between January 31, 2020 and
                        April 3, 2020 was for a purpose other than paying
                        payroll costs and other allowable uses loans under the
                        Paycheck Protection Program Rule.{' '}
                      </li>
                    </ul>
                  </div>
                  {CERTIFICATIONS.map(question => (
                    <div css={flexRow} key={question.id}>
                      <Checkbox
                        name={question.fieldName}
                        label={question.text}
                      />
                    </div>
                  ))}
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
                <Persist name="disclosures" />
              </form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  )
}

export default Disclosures
