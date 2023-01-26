/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core'
import PropTypes from 'prop-types'

const Dots = ({ color, ...props }) => {
  const waveAnimation = keyframes`
  from, 60%, to {
		transform: initial;
	}

	30% {
		transform: translateY(-10px);
	}
`

  const wave = css`
    position: relative;
    text-align: center;
    margin-left: auto;
    margin-right: auto;

    .dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 3px;
      background: #303131;
      animation: ${waveAnimation} 1.3s linear infinite;

      &:nth-of-type(2) {
        animation-delay: -1.1s;
      }

      &:nth-of-type(3) {
        animation-delay: -0.9s;
      }
    }
  `

  return (
    <div css={wave} {...props}>
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </div>
  )
}

Dots.propTypes = {
  color: PropTypes.string,
}

Dots.defaultProps = {
  color: '#2C3138',
}

export default Dots
