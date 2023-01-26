import React, { useContext, useState } from 'react'

const ToastContext = React.createContext()

function ToastProvider(props) {
  const initialValue = { message: '', visible: false }
  const [toast, setToast] = useState(initialValue)

  const setNewToast = value => {
    setToast(
      { message: value, visible: true },
      setTimeout(() => setToast({ ...initialValue, message: value }), 3000)
    )
  }

  return (
    <ToastContext.Provider
      value={{ toast, setToast: setNewToast }}
      {...props}
    />
  )
}

function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error(`usePToast must be used within a ToastProvider`)
  }
  return context
}

export { ToastProvider, useToast }
