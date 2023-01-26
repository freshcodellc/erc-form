/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import PropTypes from 'prop-types'
import Select, { components } from 'react-select'
import { useField } from 'formik'

import arrowDownBlue from '../../../images/icons/arrow-down-blue.svg'

const DropdownIndicator = props => {
  const icon = css`
    width: 12px;
    height: 12px;
  `
  return (
    <components.DropdownIndicator {...props}>
      <img css={icon} src={arrowDownBlue} alt="" />
    </components.DropdownIndicator>
  )
}

const themeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: '#008CFF',
  },
})

const SelectInput = ({
  options,
  defaultValue,
  className,
  components,
  setFieldTouched,
  setFieldValue,
  ...props
}) => {
  const { colors, fonts } = useTheme()
  const [field, meta] = useField(props)

  const errorOverrides = {}
  if (meta.error && meta.touched) {
    errorOverrides.borderColor = colors.orange
  }

  const styles = {
    control: provided => ({
      ...provided,
      ...errorOverrides,
    }),
    singleValue: () => ({
      font: `350 14px/14px ${fonts.primary}`,
    }),
    option: provided => ({
      ...provided,
      font: `350 14px/14px ${fonts.primary}`,
    }),
    menu: (provided, state) => ({
      ...provided,
      zIndex: 100000,
    }),
  }

  const outerBase = css`
    position: relative;
    margin: 8px;
  `

  const errorField = css`
    position: absolute;
    font-size: 11px;
    color: ${colors.orange};
    top: -14px;
    left: 3px;
  `

  return (
    <div css={outerBase}>
      {meta.touched && meta.error ? (
        <div css={errorField}>{meta.error}</div>
      ) : null}
      <Select
        className={className}
        components={{ DropdownIndicator, ...components }}
        defaultValue={defaultValue}
        options={options}
        styles={styles}
        theme={themeColors}
        name={field.name}
        value={
          options ? options.find(option => option.value === field.value) : ''
        }
        onChange={option => {
          setFieldValue(props.name, option.value)
          props.runOnChange(option.value)
        }}
        onBlur={e => {
          field.onBlur(e)
          setFieldTouched(field.name)
        }}
      />
    </div>
  )
}

SelectInput.propTypes = {
  name: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object),
  defaultValue: PropTypes.number,
  value: PropTypes.string,
  onChange: PropTypes.func,
  components: PropTypes.object,
  className: PropTypes.string,
  runOnChange: PropTypes.func,
}

SelectInput.defaultProps = {
  name: '',
  options: [],
  defaultValue: 0,
  value: '',
  onChange: () => {},
  className: '',
  runOnChange: () => null,
}

export default SelectInput
