import axios from 'axios'
import getAuthToken from './get-auth-token'

const signedRequest = async ({ method, endpoint, headers, data }) => {
  const BASE_URL = 'https://tapi.sbx.laterpay.net'
  const token = await getAuthToken()
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
