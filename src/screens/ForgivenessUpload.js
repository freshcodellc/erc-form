/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Formik, FieldArray } from 'formik'
import * as Yup from 'yup'
import { useLocation } from '@reach/router'
import get from 'lodash/get'
import qs from 'qs'
import AsyncFileInput from '../components/ui/forms/asyncFileInput'
import Button from '../components/ui/button'
import FooterNav from '../components/ui/footerNav'
import Heading from '../components/ui/heading'
import Layout from '../components/layout'
import config from '../config'
import getBankConfig from '../bankConfig'
import useAnalytics from '../components/analytics'

import plusIcon from '../images/icons/plus.svg'

const bank = getBankConfig()

const validationSchema = Yup.object().shape({
  miscDocs: Yup.array()
    .of(
      Yup.string()
        .min(1, 'Required')
        .required('Required')
    )
    .required('Required'),
})

const initialValues = {
  miscDocs: [''],
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

const heading = css`
  margin: 24px 0;
`

const changeList = css`
  background-color: white;
  padding: 16px;

  & ul {
    & li {
      margin: 0 16px;
      line-height: 1.5em;
    }
  }
`

function ForgivenessUpload() {
  localStorage.removeItem('LOAN_ID')
  const { colors } = useTheme()
  const [success, setSuccess] = useState(false)
  const [appData, setAppData] = useState({})
  const location = useLocation()
  const queryParams = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  })
  useAnalytics()

  const getAppData = () => {
    const encodedData = get(queryParams, 'r', '')
    if (encodedData.length) {
      return JSON.parse(atob(encodedData))
    }
    return { email: '' }
  }

  const basicData = getAppData()
  const customerEmail = basicData.email
  const fileType = get(queryParams, 'fileType', '')

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post(
        `${config.API_URL}/api/application/details`,
        { ...basicData }
      )

      setAppData(response.data)
      localStorage.setItem('forgivenessApp', JSON.stringify(response.data))
    }

    fetchData()
  }, [])

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

  const flexRow = css`
    display: flex;
    align-items: center;
    margin: 24px 0;
  `

  const label = css`
    display: block;
    font-size: 18px;
    color: ${colors.blueDark};
    flex: 3;
    margin-right: 8%;
  `

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

  const inputColumn = css`
    flex: 5;
  `

  const handleCertSubmit = async (values, actions) => {
    actions.setSubmitting(true)
    setSuccess(true)
    actions.setSubmitting(false)
  }

  if (success) {
    return (
      <Layout>
        <div css={formStyle}>
          <Heading size="1" align="center">
            Success!
          </Heading>
          <p css={text}>
            The files you uploaded have been sent to your bank. Please contact
            them if you have further questions or concerns.
          </p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div css={formStyle}>
        <Heading size="1" align="center">
          Additional Documents Upload
        </Heading>
        <p css={text}>
          This form will allow you to upload any additional documents requested
          by your bank.
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
                  <Heading size="3">Upload Documents</Heading>
                </div>
                <div css={flexRow}>
                  <span css={label}>Any documents requested by your bank.</span>
                  <FieldArray
                    name="miscDocs"
                    render={arrayHelpers => (
                      <div css={inputColumn}>
                        {values.miscDocs &&
                          values.miscDocs.length > 0 &&
                          values.miscDocs.map((miscDocsFile, index) => (
                            <AsyncFileInput
                              key={index}
                              type="file"
                              name={`miscDocs.${index}`}
                              label="Click here to choose your file to upload."
                              setFieldValue={setFieldValue}
                              onDeleteClick={() => arrayHelpers.remove(index)}
                              canDelete={index > 0}
                              fileType={fileType}
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
                <FooterNav>
                  <Button
                    css={buttonStyles}
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                </FooterNav>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  )
}

export default ForgivenessUpload
