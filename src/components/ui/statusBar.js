/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserTie,
  faBuilding,
  faFileContract,
  faCheck,
  faListAlt,
} from '@fortawesome/free-solid-svg-icons'
import { useTheme } from 'emotion-theming'

const StatusBar = ({ steps, currentStep, ...props }) => {
  const { colors } = useTheme()

  const icons = [faUserTie, faBuilding, faListAlt, faFileContract, faCheck]
  const STEPS = [
    'Customer Info',
    'Business Info',
    'Certifications',
    'Disclosures',
    'Confirmation',
  ]

  const wrap = css`
    max-width: 460px;
    width: 100%;
    margin: 0 auto 32px auto;
  `

  const base = css`
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `

  const bar = css`
    transition: all 0.5s ease-in-out;

    &:before {
      content: '';
      width: 100%;
      position: absolute;
      top: 14px;
      height: 2px;
      background-color: ${colors.grey400};
    }

    &:after {
      content: '';
      width: calc(${((currentStep - 1) / (steps.length - 1)) * 100}%);
      position: absolute;
      top: 14px;
      height: 2px;
      background-color: ${colors.blueDark};
    }
  `

  const stepStyle = css`
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: 2px solid ${colors.grey400};
    border-radius: 50%;
    background-color: ${colors.grey0};
    color: ${colors.grey400};
  `

  const complete = css`
    border-color: ${colors.blueDark};
    color: ${colors.blueDark};
  `

  const label = css`
    position: absolute;
    bottom: -15px;
    font-size: 10px;
    display: block;
    width: 80px;
    left: -25px;
    text-align: center;

    @media screen and (max-width: 520px) {
      display: none;
    }
  `

  const column = css`
    position: relative;
  `

  return (
    <div css={wrap}>
      <div css={[base, bar]} {...props}>
        {STEPS.map((step, i) => (
          <div css={column} key={`step-${step}`}>
            <span css={[stepStyle, i < currentStep ? complete : '']}>
              <FontAwesomeIcon
                icon={icons[i]}
                color={`${i < currentStep ? colors.blueDark : colors.grey400}`}
              />
            </span>
            <span css={label}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

StatusBar.propTypes = {
  steps: PropTypes.array,
  currentStep: PropTypes.number,
}

StatusBar.defaultProps = {
  steps: [],
  currentStep: 1,
}

export default StatusBar
