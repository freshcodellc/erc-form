/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import PropTypes from 'prop-types'
import { useTheme } from 'emotion-theming'

const HelperText = ({ children, ...props }) => {
  const { colors, fonts } = useTheme()
  const { align, color } = props

  const base = css`
    width: 100%;
    font-family: ${fonts.primary};
    color: ${color || colors.black};
    text-align: ${align};
    margin: 10px 0 8px 0;
  `

  return (
    <p css={base} {...props}>
      {children}
    </p>
  )
}

HelperText.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  align: PropTypes.string,
  color: PropTypes.string,
}

HelperText.defaultProps = {
  children: null,
  align: 'left',
  color: null,
}

export default HelperText
