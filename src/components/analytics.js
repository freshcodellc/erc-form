import { useEffect } from 'react'
import { useLocation } from '@reach/router'
import ReactGA from 'react-ga'

const useAnalytics = props => {
  const location = useLocation()

  useEffect(() => {
    ReactGA.pageview(location.pathname)
  }, [])
}

export default useAnalytics
