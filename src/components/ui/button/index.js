/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import PropTypes from 'prop-types'
import { useTheme } from 'emotion-theming'
import Checkmark from './checkmark'
import Spinner from './spinner'

const Button = ({
  children,
  complete,
  hollow,
  hollowcolor,
  loading,
  style,
  ...props
}) => {
  const { colors, fonts } = useTheme()
  const base = css`
    font-family: ${fonts.primary};
    font-size: 14px;
    background-color: ${hollow ? 'white' : colors.blueDark};
    color: ${hollow ? hollowcolor : 'white'};
    border: 2px solid ${hollow ? hollowcolor : colors.blueDark};
    padding: 10px 16px;
    box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.35);
    text-align: center;
    transition: all 0.3s ease-in-out;
    &:hover {
      cursor: pointer;
      background-color: ${colors.blueDark};
      color: white;
      & span {
        color: white;
      }
    }
  `

  const innerWrap = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `

  const textBase = css`
    font-family: ${fonts.primary};
    font-size: 14px;
    color: ${hollow ? hollowcolor : 'white'};
    &:hover {
      color: ${hollow ? 'white' : 'inherit'};
    }
  `

  const hidden = css`
    height: 0;
    overflow: hidden;
  `

  const renderChildren = () => {
    return (
      <div css={innerWrap}>
        {loading && <Spinner />}
        {complete && <Checkmark />}
        <span css={[textBase, loading || complete ? hidden : '']}>
          {children}
        </span>
      </div>
    )
  }

  return (
    <button css={base} {...props} style={style}>
      {renderChildren()}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  hollow: PropTypes.bool,
  hollowcolor: PropTypes.string,
  loading: PropTypes.bool,
  complete: PropTypes.bool,
  style: PropTypes.object,
}

Button.defaultProps = {
  children: null,
  hollow: false,
  hollowcolor: '#4E5661',
  loading: false,
  complete: false,
  type: 'button',
  style: {},
}

export default Button
