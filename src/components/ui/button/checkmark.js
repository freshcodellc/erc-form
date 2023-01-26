import React from 'react'
import PropTypes from 'prop-types'

const Checkmark = props => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 100 100"
    stroke={props.color || 'currentColor'}
    aria-hidden={false}
    focusable={false}
  >
    <g>
      <line
        strokeLinecap="round"
        strokeLinejoin="round"
        id="svg_3"
        y2="83.497466"
        x2="34.235185"
        y1="54.480229"
        x1="5.217949"
        strokeWidth="10"
        fill="none"
      />
      <line
        strokeLinecap="round"
        strokeLinejoin="round"
        id="svg_4"
        y2="19.43801"
        x2="94.798629"
        y1="84"
        x1="34"
        strokeWidth="10"
        fill="none"
      />
    </g>
  </svg>
)

Checkmark.propTypes = {
  color: PropTypes.string,
}

export default Checkmark
