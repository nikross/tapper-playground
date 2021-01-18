import axios from 'axios'

const {
  LP_CONFIDENTIAL_CLIENT_ID,
  LP_CONFIDENTIAL_CLIENT_SECRET
} = process.env

const getAccessToken = () => {
  const LP_BASE_URL = 'https://auth.laterpay.net'
  const authEndpoint = `${LP_BASE_URL}/oauth2/token`
  const basicAuthCredentials = Buffer.from(`${LP_CONFIDENTIAL_CLIENT_ID}:${LP_CONFIDENTIAL_CLIENT_SECRET}`).toString('base64')
  const requestBody = {
    scope: 'read write',
    grant_type: 'client_credentials'
  }
  const getUrlEncodedString = obj => (
    Object
      .entries(requestBody)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
  )

  return axios({
    method: 'post',
    url: authEndpoint,
    headers: {
      Authorization: `Basic ${basicAuthCredentials}`
    },
    data: getUrlEncodedString(requestBody)
  })
    .then(response => {
      const { data } = response
      return data.access_token
    })
    .catch(error => {
      const { data } = error.response
      return data
    })
}

export default getAccessToken
