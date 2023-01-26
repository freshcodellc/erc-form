/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import PropTypes from 'prop-types'

const Card = ({ children, ...props }) => {
  const { colors } = useTheme()
  const card = css`
    border: 1px solid ${colors.darkBlue};
    border-radius: 3px;
    background-color: white;
    padding: 18px 16px;
  `

  return (
    <div css={card} {...props}>
      {children}
    </div>
  )
}

Card.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

Card.defaultProps = {
  children: null,
}

export default Card
