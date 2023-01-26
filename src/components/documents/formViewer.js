import PropTypes from 'prop-types'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import { useEffect, useRef } from 'react'
import xIconBlack from '../../images/icons/xIconBlack.svg'

const FormViewer = ({ agreementName, children, checkField, close, title }) => {
  const { colors } = useTheme()
  const signatureRef = useRef(null)

  useEffect(() => {
    const storedSignature = localStorage.getItem(`${agreementName}Signature`)
    if (storedSignature) {
      signatureRef.current.fromDataURL(storedSignature)
    }
  })

  const signDocument = e => {
    e.preventDefault()
    checkField()
  }

  const formViewer = css`
    position: relative;
    background-color: white;
    border: 2px solid ${colors.blueDark};
    padding: 40px 20px 10px;

    & .document-container {
      max-height: 300px;
      border: 1px solid black;
      margin-bottom: 40px;

      & .content {
        overflow: auto;
        height: 300px;
      }
    }

    & .close-viewer {
      position: absolute;
      top: 10px;
      left: 10px;
    }

    & .text {
      margin-bottom: 16px;
    }

    & .signature {
      position: relative;
      margin: 0 auto 40px;
      border-bottom: 1px solid black;
      width: 80%;
    }

    & .signature-canvas {
      position: relative;
      top: 20px;
    }

    & .sign-here {
      position: absolute;
      bottom: 0;
    }

    & .sign-prompt {
      color: #b1b2b4;
      font-size: 14px;
      text-align: center;
      position: relative;
      bottom: -25px;
    }

    & .sign-error {
      position: absolute;
      color: ${colors.orange};
      bottom: 25px;
      transform: translateX(-50%);
      left: 50%;
    }

    & .buttons {
      display: flex;
      justify-content: center;
    }

    & .outline-button {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px solid ${colors.grey800};
      border-radius: 6px;
      width: 141px;
      height: 36px;
      /* margin: 0 auto 24px; */

      &:first-of-type {
        margin-right: 30px;
      }
    }
  `

  return (
    <div css={formViewer}>
      <button
        onClick={e => {
          e.preventDefault()
          close()
        }}
      >
        <img
          src={xIconBlack}
          alt="Close document viewer"
          className="close-viewer"
        />
      </button>
      <div className="document-container">
        <div className="content">{children}</div>
      </div>
      <p className="text">Please click “ACCEPT” to agree to the {title}</p>
      <div className="buttons">
        <button className="outline-button" onClick={e => close()}>
          Clear
        </button>
        <button className="outline-button" onClick={e => signDocument(e)}>
          Accept
        </button>
      </div>
    </div>
  )
}

FormViewer.propTypes = {
  agreementName: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  checkField: PropTypes.func,
  close: PropTypes.func,
  title: PropTypes.string,
}

FormViewer.defaultProps = {
  agreementName: '',
  children: null,
  checkField: () => null,
  close: () => null,
  title: '',
}

export default FormViewer
