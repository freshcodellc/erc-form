/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import PropTypes from 'prop-types'
import { useTheme } from 'emotion-theming'
import { useField } from 'formik'
import uploadCloud from '../../../images/icons/upload.svg'

const FileInput = ({ label, setFieldValue, ...props }) => {
  const { colors, fonts } = useTheme()
  const [field, meta] = useField(props)

  const outerBase = css`
    position: relative;
    display: flex;
    margin: 8px;
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
    border: 1px solid ${colors.grey200};
    border-radius: 3px;
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

  return (
    <div css={outerBase}>
      {meta.touched && meta.error ? (
        <div css={errorField}>{meta.error}</div>
      ) : null}
      <label css={inputLabelBase} htmlFor={field.name}>
        <img src={uploadCloud} alt="Upload" />{' '}
        <span>{meta.value ? meta.value.name : label}</span>
      </label>
      <input
        css={base}
        type="file"
        id={field.name}
        name={field.name}
        placeholder={label}
        onChange={event =>
          setFieldValue(field.name, event.currentTarget.files[0] || '')
        }
      />
    </div>
  )
}

FileInput.propTypes = {
  label: PropTypes.string,
  setFieldValue: PropTypes.func,
}

FileInput.defaultProps = {
  label: 'Click here to upload a file',
  setFieldValue: () => null,
}

export default FileInput
