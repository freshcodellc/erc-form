/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import { useToast } from '../../../context/toast'

const Toast = () => {
  const { colors } = useTheme()
  const { toast } = useToast()
  const base = css`
    position: fixed;
    z-index: 1000;
    bottom: 20px;
    left: 50%;
    font-size: 14px;
    max-width: 90%;
    border-radius: 3px;
    padding: 16px 24px;
    background-color: white;
    border: 1px solid ${colors.green};
    box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.35);
    color: ${colors.greenDark};
    transition: all 0.5s ease-in-out;
    opacity: 0;
    transform: translate(-50%, 100%);
  `

  const show = css`
    opacity: 1;
    transform: translate(-50%, 0);
  `

  return <div css={[base, toast.visible && show]}>{toast.message}</div>
}

export default Toast
