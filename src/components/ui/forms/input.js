/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useTheme } from 'emotion-theming'
import { useField } from 'formik'
import editIcon from '../../../images/icons/edit.svg'

const bounceInUpAnimation = keyframes`
  from,
  60%,
  75%,
  90%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  from {
    opacity: 0;
    -webkit-transform: translate3d(0, 20px, 0);
    transform: translate3d(0, 20px, 0);
  }

  60% {
    opacity: 0.2;
    -webkit-transform: translate3d(0, 12px, 0);
    transform: translate3d(0, 12px, 0);
  }

  75% {
    opacity: 0.4;
    -webkit-transform: translate3d(0, 8px, 0);
    transform: translate3d(0, 8px, 0);
  }

  90% {
    opacity: 0.7;
    -webkit-transform: translate3d(0, 4px, 0);
    transform: translate3d(0, 4px, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
`

const Input = ({ align, label, locked, money, readOnly, ...props }) => {
  const { colors, fonts } = useTheme()
  const [disabled, setDisabled] = useState(!!locked)
  const [field, meta] = useField(props)

  const outerBase = css`
    position: relative;
    display: flex;
    align-items: center;
    margin: 16px 16px 8px 0;
    text-align: ${money || align === 'right' ? 'right' : 'left'};
    width: 100%;
    min-width: 0;
    &:last-of-type {
      margin-right: 0;
    }
  `

  const errorField = css`
    position: absolute;
    font-size: 11px;
    color: ${colors.orange};
    ${money ? 'bottom' : 'top'}: -14px;
    left: 3px;
  `

  const errorStyle = css`
    border-color: ${colors.orange};
    border-width: 2px;
  `
  const base = css`
    position: relative;
    outline: none;
    background-color: white;
    border: 1px solid ${colors.grey400};
    border-radius: 4px;
    box-shadow: none !important;
    padding: 2px 10px 2px 10px;
    padding-top: ${meta.value && meta.value.toString().length && !money
      ? '8px'
      : '2px'};
    height: 34px;
    flex: 1;
    font-family: ${fonts.primary};
    font-size: 12px;
    width: 100%;
    min-width: 0;
    &:focus {
      border: 1px solid ${colors.greenDark};
    }
    &:disabled {
      background-color: transparent;
    }
    &::placeholder {
      color: ${colors.grey600};
    }
  `
  const inputLabelBase = css`
    position: absolute;
    z-index: 2;
    top: 3px;
    left: 13px;
    font-family: ${fonts.primary};
    font-weight: bold;
    font-size: 8px;
    height: 10px;
    color: ${colors.grey600};
    animation-name: bounceInUp;
    animation-duration: 0.4s;
    display: none;
    animation-name: ${bounceInUpAnimation};
    animation-duration: 0.4s;
  `
  const inputLabelShow = css`
    display: block;
  `

  const fileStyles = css`
    padding: 8px !important;
  `

  const dollarIcon = css`
    position: absolute;
    z-index: 1;
    left: 12px;
    top: 10px;
    font-weight: 400;
  `

  const editButton = css`
    margin-left: 16px;
    width: 20px;
    height: 20px;
    & img {
      width: 100%;
      object-fit: contain;
      opacity: 1;
      transition: opacity 0.2s ease-in-out;

      &:hover {
        opacity: 0.7;
      }
    }
  `

  return (
    <div css={outerBase} className="input">
      {meta.touched && meta.error ? (
        <div css={errorField}>{meta.error}</div>
      ) : null}
      <label
        css={[
          inputLabelBase,
          meta.value &&
            meta.value.toString().length > 0 &&
            !money &&
            inputLabelShow,
        ]}
        htmlFor={field.name}
      >
        {label}
      </label>
      {money && <span css={dollarIcon}>$</span>}
      <input
        css={[
          base,
          meta.touched && meta.error && errorStyle,
          props.type === 'file' && fileStyles,
        ]}
        type="text"
        id={field.name}
        placeholder={label}
        {...field}
        {...props}
        disabled={disabled || readOnly}
      />
      {locked && !readOnly && (
        <button
          css={editButton}
          type="button"
          onClick={() => setDisabled(!disabled)}
        >
          <img src={editIcon} alt="edit" />
        </button>
      )}
    </div>
  )
}

Input.propTypes = {
  align: PropTypes.string,
  label: PropTypes.string,
  locked: PropTypes.bool,
  money: PropTypes.bool,
  readOnly: PropTypes.bool,
}

Input.defaultProps = {
  align: 'left',
  label: '',
  locked: false,
  money: false,
  readOnly: false,
}

export default Input
