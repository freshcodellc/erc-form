/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useTheme } from 'emotion-theming'
import { useField } from 'formik'
import axios from 'axios'
import isUndefined from 'lodash/isUndefined'
import getBankConfig from '../../../bankConfig'
import getFileToken from '../../../utils/fileToken'
import config from '../../../config'
import uploadCloud from '../../../images/icons/upload.svg'

const FileInput = ({
  canDelete,
  label,
  onDeleteClick,
  setFieldValue,
  fileType,
  ...props
}) => {
  const bank = getBankConfig()
  const token = getFileToken()
  const appString = localStorage.getItem('forgivenessApp')
  const app = JSON.parse(appString)
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadFile = async (fieldName, file, setValue, type) => {
    setValue(fieldName, `Uploading ${file.name}...`)
    const data = new FormData()
    data.append(
      'json',
      JSON.stringify({
        bank: bank.id,
        token,
        type,
        forgiveness: true,
        uniqueId: app.application.uniqueId,
      })
    )
    data.append('file', file)

    try {
      const response = await axios.post(
        `${config.API_URL}/api/application/file`,
        data,
        {
          onUploadProgress: progress => {
            const currentProgress = Math.round(
              (progress.loaded * 100) / progress.total
            )
            setUploadProgress(currentProgress)
            if (currentProgress > 99) {
              setValue(fieldName, file.name)
              setUploadProgress(0)
            }
          },
        }
      )
      return response
    } catch (error) {
      setValue(fieldName, '')
      return error.response
    }
  }

  const { colors, fonts } = useTheme()
  const [field, meta] = useField(props)

  const wrap = css`
    display: flex;
    flex-direction: column;
    border: 1px solid ${colors.grey200};
    border-radius: 3px;
    background-color: white;
  `

  const outerBase = css`
    position: relative;
    display: flex;
  `

  const errorField = css`
    position: absolute;
    font-size: 11px;
    color: ${colors.orange};
    top: -14px;
    left: 3px;
  `

  const base = css`
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  `
  const inputLabelBase = css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    outline: none;
    background-color: white;
    box-shadow: none !important;
    padding: 2px 16px 2px 16px;
    height: 44px;
    width: 100%;
    font-family: ${fonts.primary};
    font-size: 12px;
    color: ${colors.blueDark};
    &:focus {
      border: 1px solid ${colors.greenDark};
    }
    &::placeholder {
      color: ${colors.grey600};
    }

    & > img {
      width: 34px;
      margin-right: 24px;
    }

    & > span {
      flex: 1;
    }
  `

  const progressBar = css`
    position: absolute;
    z-index: 1;
    left: 0;
    bottom: 0;
    background-color: ${colors.green};
    top: 0;
    width: ${uploadProgress}%;
    transition: all 0.1s ease-in-out;
    opacity: 0.3;
  `

  const closeIcon = css`
    padding: 12px;
    right; 0;
    color: ${colors.blue};

    &:hover {
      color: ${colors.orange};
    }
  `
  return (
    <div css={wrap}>
      <div css={outerBase}>
        {meta.touched && meta.error ? (
          <div css={errorField}>
            {meta.error.length > 1 ? meta.error : null}
          </div>
        ) : null}
        <div css={progressBar} />
        <label css={inputLabelBase} htmlFor={field.name}>
          <img src={uploadCloud} alt="Upload" />{' '}
          <span>{meta.value ? meta.value : label}</span>
        </label>
        <input
          css={base}
          type="file"
          id={field.name}
          name={field.name}
          placeholder={label}
          onChange={event =>
            !isUndefined(event.target.files[0]) &&
            uploadFile(
              field.name,
              event.target.files[0],
              setFieldValue,
              fileType !== '' ? fileType : field.name
            )}
        />
        {canDelete && (
          <button css={closeIcon} onClick={onDeleteClick}>
            &times;
          </button>
        )}
      </div>
    </div>
  )
}

FileInput.propTypes = {
  canDelete: PropTypes.bool,
  label: PropTypes.string,
  onDeleteClick: PropTypes.func,
  setFieldValue: PropTypes.func,
  fileType: PropTypes.string,
}

FileInput.defaultProps = {
  canDelete: false,
  label: 'Click here to upload a file',
  onDeleteClick: () => null,
  setFieldValue: () => null,
  fileType: '',
}

export default FileInput
