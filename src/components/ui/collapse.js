/** @jsx jsx */
import { jsx } from '@emotion/core'
import PropTypes from 'prop-types'
import { useSpring, animated } from 'react-spring'

const Collapse = ({ children, maxHeight, isOpen, ...props }) => {
  const [springProps, set] = useSpring(() => ({
    maxHeight: `${isOpen ? maxHeight : 0}px`,
    width: '100%',
    overflow: isOpen ? 'inherit' : 'hidden',
    opcaity: isOpen ? 1 : 0,
    transform: isOpen ? 'scaleY(1)' : 'scaleY(0)',
    config: { duration: 500 },
  }))

  set({
    maxHeight: `${isOpen ? maxHeight : 0}px`,
    overflow: isOpen ? 'inherit' : 'hidden',
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scaleY(1)' : 'scaleY(0)',
  })

  return (
    <animated.div style={springProps} {...props}>
      {children}
    </animated.div>
  )
}

Collapse.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  maxHeight: PropTypes.number,
  isOpen: PropTypes.bool,
}

Collapse.defaultProps = {
  children: null,
  maxHeight: 0,
  isOpen: false,
}

export default Collapse
