import axios from 'axios'

const getAuthToken = () => {
  const LP_BASE_URL = 'https://tapi.sbx.laterpay.net'
  const { LP_CLIENT_ID, LP_CLIENT_SECRET } = process.env
  const authEndpoint = `${LP_BASE_URL}/v1/auth/token`
  const basicAuthCredentials = Buffer.from(`${LP_CLIENT_ID}:${LP_CLIENT_SECRET}`).toString('base64')
  const requestBody = {
    scope: 'read write',
    grant_type: 'client_credentials'
  }
  const getUrlEncodedString = obj => (
    Object.entries(requestBody).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')
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

export default getAuthToken
