/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import PropTypes from 'prop-types'
import { useTheme } from 'emotion-theming'

const Heading = ({ children, ...props }) => {
  const { colors, fonts } = useTheme()
  const { align, size, color } = props

  const headingDefaults = {
    '1': {
      fontSize: '36px',
      weight: '600',
      lineHeight: '42px',
    },
    '2': {
      fontSize: '32px',
      weight: '600',
      lineHeight: '39px',
    },
    '3': {
      fontSize: '24px',
      weight: '600',
      lineHeight: '30px',
      paddingBottom: '8px',
    },
    '4': {
      fontSize: '20px',
      weight: '600',
      lineHeight: '24px',
    },
    '5': {
      fontSize: '16px',
      weight: '600',
      lineHeight: '20px',
      textColor: colors.grey1000,
    },
    '6': {
      fontSize: '14px',
      weight: '600',
      lineHeight: '18px',
    },
  }

  const {
    fontSize,
    weight,
    lineHeight,
    textColor,
    paddingBottom,
  } = headingDefaults[size]

  const base = css`
    width: 100%;
    font-family: ${fonts.secondary};
    font-size: ${fontSize};
    font-weight: ${weight};
    line-height: ${lineHeight};
    color: ${color || textColor || colors.blueDark};
    text-align: ${align};
    padding-bottom: ${paddingBottom || '0'};
  `

  const HeadingTag = `h${size}`

  return (
    <HeadingTag css={base} {...props}>
      {children}
    </HeadingTag>
  )
}

Heading.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  size: PropTypes.string,
  align: PropTypes.string,
  color: PropTypes.string,
}

Heading.defaultProps = {
  children: null,
  size: '1',
  align: 'left',
  color: null,
}

export default Heading
