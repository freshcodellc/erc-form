/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import PropTypes from 'prop-types'
import Dots from './loader/dots'

const TextButton = ({
  children,
  color,
  loading,
  onClick,
  underlined,
  ...props
}) => {
  const textLink = css`
    border: none;
    font-size: 14px;
    font-weight: 500;
    color: ${color};
    text-decoration: ${underlined ? 'underline' : 'none'};
    margin: 0;
  `

  return (
    <div>
      {loading && <Dots {...props} />}
      {!loading && (
        <button type="button" css={textLink} onClick={onClick} {...props}>
          {children}
        </button>
      )}
    </div>
  )
}

TextButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  color: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  underlined: PropTypes.bool,
}

TextButton.defaultProps = {
  children: null,
  color: '#2C3138',
  loading: false,
  onClick: () => null,
  underlined: true,
}

export default TextButton
