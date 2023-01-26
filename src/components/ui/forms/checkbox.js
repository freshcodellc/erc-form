/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import PropTypes from 'prop-types'
import { useTheme } from 'emotion-theming'
import { useField } from 'formik'
import xIcon from '../../../images/icons/xIcon.svg'

const Checkbox = ({ label, labelLinkText = '', ...props }) => {
  const { colors, fonts } = useTheme()
  const [field, meta] = useField(props)

  const outerBase = css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  `

  const base = css`
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
    outline: none;
    background-color: white;
    border: 1px solid ${colors.grey800};
    border-radius: 4px;
    box-shadow: none !important;
    padding: 2px 10px 2px 10px;
    margin-right: 10px;
    font-family: ${fonts.primary};
    &:focus {
      border: 1px solid ${colors.greenDark};
    }
    &::placeholder {
      color: ${colors.grey600};
    }
    &:checked ~ .button {
      background-image: url('${xIcon}');
      background-size: 12px 10px;
      background-position: -1px 0px;
    }
  `

  const errorField = css`
    position: absolute;
    font-size: 11px;
    color: ${colors.orange};
    bottom: -14px;
    left: 0px;
  `

  const button = css`
    position: absolute;
    top: 0;
    left: 0;
    height: 14px;
    width: 14px;
    border: 2px solid ${colors.blue};
    background-color: white;
    border-radius: 4px;
    box-shadow: 0px 2px 4px rgba(${colors.grey800}, 0.4);

    &.checked {
      background-image: url(${xIcon});
      background-size: 12px 12px;
      background-position: -1px -1px;
      background-repeat: no-repeat;
    }
  `

  const labelBase = css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: ${colors.blueDark};
    font-size: 14px;
    padding-left: 34px;
  `

  const labelLink = css`
    color: ${colors.blue};
  `

  return (
    <div css={outerBase}>
      {meta.touched && meta.error ? (
        <div css={errorField}>{meta.error}</div>
      ) : null}
      <label css={labelBase} htmlFor={field.name}>
        <input
          css={base}
          type="checkbox"
          id={field.name}
          placeholder={label}
          {...field}
          {...props}
        />
        <span className={field.value ? 'checked' : ''} css={button} />
        <span
          dangerouslySetInnerHTML={{
            __html: label,
          }}
        />
        &nbsp; <span css={labelLink}>{labelLinkText}</span>
      </label>
    </div>
  )
}

Checkbox.propTypes = {
  label: PropTypes.string,
}

Checkbox.defaultProps = {
  label: '',
}

export default Checkbox
