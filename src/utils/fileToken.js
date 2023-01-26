import { v4 as uuid } from 'uuid'

const getFileToken = () => {
  const currentToken = localStorage.getItem('fileToken')
  if (!currentToken) {
    const newToken = uuid()
    localStorage.setItem('fileToken', newToken)
    return newToken
  }
  return currentToken
}

export default getFileToken
