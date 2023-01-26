import client from './api-client'

const localStorageKey = '__cove_leads__'

function handleLoginResponse(response) {
  const userKey = `${localStorageKey}/user`
  window.localStorage.setItem(userKey, JSON.stringify(response))
  return response.user
}

function login(salesRepId) {
  return client(`sales/${salesRepId}/validate`)
    .then(handleLoginResponse)
    .catch(error => console.log('CE', error))
}

function logout() {
  window.localStorage.clear()
  return Promise.resolve()
}

function getUser() {
  return window.localStorage.getItem(`${localStorageKey}/user`)
}

export { login, logout, getUser }
