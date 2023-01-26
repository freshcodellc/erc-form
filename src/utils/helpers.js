import isUndefined from 'lodash/isUndefined'

export const formatCurrency = value => {
  if (!isUndefined(window.Intl)) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    })

    return formatter.format(value)
  }
  return `$${value.toFixed(2)}`
}

export const getUrlParameter = name => {
  const newName = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
  const regex = new RegExp(`[\\?&]${newName}=([^&#]*)`)

  let results = null
  if (typeof window !== `undefined` && typeof window.location !== 'undefined') {
    results = regex.exec(window.location.search)
  }

  return results === null
    ? ''
    : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

export const setCookie = (name, value, days) => {
  const d = new Date()
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days)
  document.cookie = `${name}=${value};path=/;expires=${d.toGMTString()}`
}

export const getCookie = name => {
  if (typeof document !== 'undefined') {
    const v = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`)
    return v ? v[2] : null
  }
  return null
}

export const toTitleCase = str =>
  str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )

export const isMobile = () => {
  const smallScreenSize = 576 // $width-sm = 576px;
  return typeof window === 'undefined' || typeof window.screen === 'undefined'
    ? false
    : window.screen.width < smallScreenSize
}

export const printNumber = num => {
  if (num % 1 === 0) {
    return num
  }
  return num.toFixed(2)
}

export const isMobileUserAgent = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
