/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import PropTypes from 'prop-types'
import { useTheme } from 'emotion-theming'
import { useField } from 'formik'
import xIcon from '../../../images/icons/xIcon.svg'

const Radio = ({ label, ...props }) => {
  const { colors, fonts } = useTheme()
  const [field, meta] = useField(props)
  const { checked } = props

  const outerBase = css`
    position: relative;
    display: inline-block;
    margin: 0 8px;
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
    top: -16px;
  `

  const button = css`
    position: absolute;
    top: 0;
    left: 0;
    height: 13px;
    width: 13px;
    border: 2px solid ${colors.blue};
    background-color: white;
    border-radius: 50%;
    box-shadow: 0px 2px 4px rgba(${colors.grey800}, 0.4);

    &.checked {
      background-color: ${colors.blue};
    }
  `

  const labelBase = css`
    position: relative;
    display: block;
    color: ${colors.grey800};
    font-size: 14px;
    padding-left: 24px;
  `

  return (
    <div css={outerBase}>
      {meta.touched && meta.error ? (
        <div css={errorField}>{meta.error}</div>
      ) : null}
      <label css={labelBase} htmlFor={props.id}>
        <input
          css={base}
          type="radio"
          id={field.name}
          placeholder={label}
          {...field}
          {...props}
        />
        <span className={checked ? 'checked' : ''} css={button} />
        {label}
      </label>
    </div>
  )
}

Radio.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string,
}

Radio.defaultProps = {
  checked: false,
  label: '',
}

export default Radio
