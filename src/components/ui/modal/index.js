/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import PropTypes from 'prop-types'

const Modal = ({ children, disableClose, isOpen, onCloseClicked, title }) => {
  const { colors } = useTheme()
  const overlayStyles = css`
    display: ${isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.3);
    transition-property: all;
    transition-timing-function: ease;
    transition-duration: 200ms;
  `

  const dialogStyles = css`
    width: 40%;
    max-height: 100%;
    overflow: hidden;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -200px;
    margin-left: -20%;
    background-color: rgb(255, 255, 255);
    border-radius: 3px;
    border: 3px solid ${colors.blueDark};
    z-index: 100;
    padding: 15px;
    box-shadow: rgba(0, 0, 0, 0.14) 0px 0px 4px, rgba(0, 0, 0, 0.28) 0px 4px 8px;
    transition-duration: 200ms;

    @media screen and (max-width: 640px) {
      width: 80%;
      margin-left: -40%;
    }
  `

  const animationBase = css`
    transform: scale(0);
    transition-property: transform;
    transition-timing-function: ease;
  `

  const animationOpen = css`
    transform: scale(1);
    transition-property: transform;
    transition-timing-function: ease;
  `

  const closeButtonStyle = css`
    cursor: pointer;
    position: absolute;
    font-size: 20px;
    font-weight: 300;
    right: 10px;
    top: 4px;
    color: ${colors.grey800};
  `

  return (
    <section>
      <div css={overlayStyles} />
      <div css={[dialogStyles, isOpen ? animationOpen : animationBase]}>
        {!disableClose && (
          <button css={closeButtonStyle} onClick={onCloseClicked} type="button">
            {'\u00D7'}
          </button>
        )}
        {title}
        {children}
      </div>
    </section>
  )
}

Modal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  disableClose: PropTypes.bool,
  isOpen: PropTypes.bool,
  onCloseClicked: PropTypes.func,
  title: PropTypes.string,
}

Modal.defaultProps = {
  children: null,
  disableClose: true,
  isOpen: false,
  onCloseClicked: () => null,
  title: '',
}

export default Modal
