import client from './api-client'

function sendContactEmail(salesRepId, data) {
  return client(`sales/${salesRepId}/email`, { body: data }).catch(error =>
    console.log('Send Contact Email Error:', error)
  )
}

export { sendContactEmail }
