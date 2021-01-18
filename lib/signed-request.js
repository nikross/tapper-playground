import axios from 'axios'
import getAccessToken from './get-access-token'

const signedRequest = async ({ method, endpoint, headers, data }) => {
  const BASE_URL = 'https://tapi.sbx.laterpay.net'
  const token = await getAccessToken()
  return axios({
    method: method || 'get',
    url: `${BASE_URL}${endpoint}`,
    headers: {
      Authorization: `Bearer ${token}`,
      ...headers
    },
    data
    // ...rest
  })
    .then(response => {
      return response
    })
    .catch((error) => {
      const errorResponse = error.response || error
      return errorResponse.data || errorResponse
    })
}

export default signedRequest
