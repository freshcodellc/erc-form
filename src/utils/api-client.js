const localStorageKey = '__cove_token__'

function handleErrors(response) {
  if (response.status === 403) {
    window.localStorage.clear()
    return window.location.reload()
  }
  if (!response.ok && response.status > 400) {
    throw Error(response.message)
  } else {
    return response
  }
}

async function formatResponse(response) {
  const parsedResponse = await response.json()
  return parsedResponse
}

function client(endpoint, { body, ...customConfig } = {}) {
  const token = window.localStorage.getItem(localStorageKey)
  const headers = {
    'content-type': 'application/json',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }
  if (body) {
    config.body = JSON.stringify(body)
  }

  return window
    .fetch(`${process.env.REACT_APP_COVE_API_V1_URL}/${endpoint}`, config)
    .then(handleErrors)
    .then(formatResponse)
    .catch(error => {
      throw new Error(error)
    })
}

export default client
